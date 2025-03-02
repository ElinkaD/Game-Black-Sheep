import gameModalCard from '../components/game_modal_card/script.js'; 
import { renderCard } from '../components/card/script.js';
import { placeCardsInZoo } from './zoo.js';
import { openMoleCardDialog } from '../components/dialog/templates/mole/script.js';
import { openEagleCardDialog } from '../components/dialog/templates/eagle/script.js';
import { setupQuitButton, quitGame } from './quit_game.js';
import { deleteGame } from './delete.js';

const cardContainers = new Map();
let selectedCards = [];

function addClickListenersToCards(containerId) {
    const container = document.getElementById(containerId);
    const cards = container.querySelectorAll('.card');    
    cards.forEach(card => {
        card.addEventListener('click', (event) => {
            const cardId = card.getAttribute('data-id');
            if (cardId) {
                handleCardClick(cardId, card);  
            }
        });
    });
}

function handleCardClick(cardId, cardElement) {
    const cardIndex = selectedCards.indexOf(cardId);
    if (cardIndex === -1) {
        selectedCards.push(cardId);
        cardElement.style.boxShadow = '0px 0px 7px 7px rgb(200, 175, 73)';
    } else {
        selectedCards.splice(cardIndex, 1);
        cardElement.style.boxShadow = '';
    }
}

function updateCards(containerId, cardsData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!Array.isArray(cardsData) || cardsData.length === 0) {
        container.innerHTML = ''; 
        return;
    }

    const newCards = new Set(cardsData.map(card => card.card_id));

    const currentCards = container.querySelectorAll('.card');
    currentCards.forEach(cardElement => {
        const cardId = cardElement.dataset.cardId;
        if (!newCards.has(cardId)) {
            cardElement.remove();
        }
    });

    cardsData.forEach(card => {
        const existingCardElement = container.querySelector(`[data-card-id="${card.card_id}"]`);
        if (!existingCardElement) {
            renderCard(card.card_id, card.calculated_type, card.card_type, (html) => {
                container.insertAdjacentHTML('beforeend', html);
            });
        }
    });
}


// Функция для получения статуса игры
export function getGameStatus() {
    const url = `../api/get_game_status.php?room_id=${roomIdGame}`;

    fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'} 
    })
    .then(response => response.json())
    .then(data => {
        console.log("JSON-данные:", data);
        if (data.status === 'success') {
            openEagleCardDialog(data.info.zoo_opponent_cards, roomIdGame);
            if (data.info.count_players <= 1 && data.info.current_turn_player != null) {
                alert('Игра завершена!');
                deleteGame(roomIdGame); 
                window.location.href = './rooms.php';
            }

            if (data.info.game_winner != 'false') {
                alert(data.info.game_winner);
                quitGame(roomIdGame); 
            }
            
            updateGameStatus(data.info); 
        } else {
            console.log('Ошибка получения статуса игры: ' + (data.message || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.error('Ошибка при получении статуса игры:', error);
        alert('Ошибка при получении статуса игры');
    });
}

function updateGameStatus(gameInfo) {
    const opponentsZoo = document.getElementById('opponents-zoo');
    const playerName = document.getElementById('player-name');
    // const magpieCard = document.getElementById('magpie-card');
    const timerElement = document.getElementById('timer'); 

    opponentsZoo.innerHTML = '';

    document.getElementById('hod').innerHTML = gameInfo.current_player_login;
    document.getElementById('ave-count').innerHTML = gameInfo.available_zoo_slots || '0';

    let timeLeft = gameInfo.time_left;  
    timerElement.innerHTML = timeLeft; 

    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

    window.timerInterval = setInterval(() => {
        timeLeft -= 1;
        timerElement.innerHTML = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(window.timerInterval); 
        }
    }, 1000);


    // if (gameInfo.magpie_card.has_card) {
    //     magpieCard.style.opacity = '1'; 
    // } else {
    //     magpieCard.style.opacity = '0'; 
    // }

    const currentPlayerLogin = gameInfo.current_player_login;
    const userLogin = gameInfo.my_player_info.user_login;

    if (gameInfo.mole_player_cards && gameInfo.mole_player_cards.length > 0) {
        openMoleCardDialog(gameInfo.mole_player_cards, roomIdGame);
    }

    if (gameInfo.has_eagle_card) {
        const opponents = gameInfo.zoo_opponent_cards; 
        openEagleCardDialog(opponents, roomIdGame); 
    }

    if (gameInfo.zoo_opponent_cards) {
        for (const playerId in gameInfo.zoo_opponent_cards) {
            const playerInfo = gameInfo.zoo_opponent_cards[playerId];
            const playerDiv = document.createElement('div');
            playerDiv.className = 'opponent';
            playerDiv.dataset.playerId = playerId;
            
            const playerLogin = playerInfo.player_login;
            const isCurrentPlayer = playerLogin === currentPlayerLogin; 
        
            playerDiv.innerHTML = `
                <div class="opponent-header">
                    <p class="player-login">Игрок ${playerLogin}</p>
                    <p class="cards-count">К-во карт: ${playerInfo.cards_in_hand_count}</p>
                </div>
            `;

            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container'

            playerInfo.zoo_cards.forEach(card => {
                renderCard(card.card_id, card.calculated_type, card.card_type, (html) => {
                    cardContainer.innerHTML += html;
                });
            });
    
            playerDiv.appendChild(cardContainer);
            document.getElementById('opponents-zoo').appendChild(playerDiv);
    
            playerDiv.addEventListener('mouseenter', () => {
                if (!isCurrentPlayer) {
                    playerDiv.style.backgroundColor = '#D1DCB2'; 
                }
            })
    
            playerDiv.addEventListener('mouseleave', () => {
                playerDiv.style.backgroundColor = ''; 
            });
    
            playerDiv.addEventListener('click', () => {
                drawCard(playerId);
            });
    
            // Если это текущий игрок, выделяем его
            if (isCurrentPlayer) {
                playerDiv.classList.add('current-player');
            }
        }
    }

    if (gameInfo.waterhole_cards) { 
        updateCards('waterhole-cards', gameInfo.waterhole_cards);
        if(currentPlayerLogin === userLogin){
            setTimeout(() => {
                addClickListenersToCards('waterhole-cards');
            }, 1000)
        }
    }

    if (gameInfo.my_player_info.zoo_cards) {
        updateCards('player-zoo-cards', gameInfo.my_player_info.zoo_cards);
    }
    
    playerName.innerHTML += userLogin;

    if (gameInfo.my_player_info.hand_cards) {
        updateCards('player-hand-cards', gameInfo.my_player_info.hand_cards);
        if(currentPlayerLogin === userLogin){
            setTimeout(() => {
                addClickListenersToCards('player-hand-cards');
            }, 1000)
        }
    }
}

function drawCard(playerId) {
    fetch('../api/draw_card.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ playerId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Ответ от сервера:', data);
        if (data.status === 'success') {
            showCardInModal(data.card_id, data.calculated_type, data.card_type, data.message);
        } else {
            alert(data.message || 'Ошибка'); 
        }
    })
    .catch(error => {
        console.error('Ошибка при вытягивании карты:', error);
        alert('Ошибка при вытягивании карты');
    });
}


function showCardInModal(id, calculatedType, cardType = null, message = "") {
    gameModalCard.showCardInModal(id, calculatedType, cardType, message);
    
    // if (cardType !== 'черная овечка') {
    //     const waterhole = document.getElementById('waterhole-cards');
        
    //     if (waterhole) {
    //         let cardContainer = waterhole.querySelector('.card-container');
            
    //         if (!cardContainer) {
    //             cardContainer = document.createElement('div');
    //             cardContainer.className = 'card-container';
    //             waterhole.appendChild(cardContainer); 
    //         }
    //         renderCard(id, calculatedType, cardType, (html) => {
    //             cardContainer.innerHTML += html;
    //         });
    //     } else {
    //         console.error("Не найден элемент с id 'waterhole'");
    //     }
    // }
    if (cardType === 'черная овечка') {
        getGameStatus();
    }
}

let roomIdGame;

document.addEventListener("DOMContentLoaded", () => {
    roomIdGame = new URLSearchParams(window.location.search).get('room_id');
    if (!roomIdGame) {
        alert('Ошибка: Комната не указана.');
        return;
    }

    getGameStatus();
    setupQuitButton();

    // setInterval(() => getGameStatus(), 10000);
});

document.getElementById('place-cards-btn').addEventListener('click', () => {
    placeCardsInZoo(roomIdGame, selectedCards);
    getGameStatus();
});
