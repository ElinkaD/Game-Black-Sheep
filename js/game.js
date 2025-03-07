import gameModalCard from '../components/game_modal_card/script.js'; 
import { renderCard } from '../components/card/script.js';
import { placeCardsInZoo } from './zoo.js';
import { openMoleCardDialog } from '../components/dialog/templates/mole/script.js';
import { openEagleCardDialog } from '../components/dialog/templates/eagle/script.js';
import { setupQuitButton, quitGame } from './quit_game.js';
import { deleteGame } from './delete.js';

let selectedCards = [];
let roomIdGame;

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
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
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
        if (!newCards.has(cardElement.dataset.cardId)) {
            cardElement.classList.add('removing');
            setTimeout(() => cardElement.remove(), 300);
        }
    });
    

    Promise.all(cardsData.map(card =>
        new Promise(resolve => {
            const existingCardElement = container.querySelector(`[data-card-id="${card.card_id}"]`);
            if (!existingCardElement) {
                renderCard(card.card_id, card.calculated_type, card.card_type, resolve);
            } else {
                resolve(existingCardElement.outerHTML); 
            }
        })
    )).then(newCardsHtml => {
        container.innerHTML = newCardsHtml.join('');
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
            if (data.info.count_players <= 1 && data.info.current_turn_player != null) {
                alert('Игра завершена!');
                deleteGame(roomIdGame); 
                window.location.href = './rooms.php';
                return;
            }

            if (data.info.game_winner != 'false') {
                alert(data.info.game_winner);
                if (data.info.count_players <= 1 && data.info.current_turn_player != null) {
                    deleteGame(roomIdGame);
                    window.location.href = './rooms.php';
                    return;
                }
                quitGame(roomIdGame); 
                return;
            }
            
            updateGameStatus(data.info); 
        } else {
            console.log('Ошибка получения статуса игры: ' + (data.message || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.log('Ошибка при получении статуса игры:', error);
    });
}

export function updateGameStatus(gameInfo) {
    const opponentsZoo = document.getElementById('opponents-zoo');
    // const magpieCard = document.getElementById('magpie-card');
    const timerElement = document.getElementById('timer'); 
    const waterhole = document.getElementById('waterhole-cards');
    
    waterhole.innerHTML = '';
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
            let playerDiv = document.getElementById(`data-player-id-${playerId}`);
    
            const playerLogin = playerInfo.player_login;
            const isCurrentPlayer = playerLogin === currentPlayerLogin;

            if (!playerDiv) {
                playerDiv = document.createElement('div');
                playerDiv.className = 'opponent';
                playerDiv.id = `data-player-id-${playerId}`;
                playerDiv.dataset.playerId = playerId;
                document.getElementById('opponents-zoo').appendChild(playerDiv);

                playerDiv.innerHTML = `
                <div class="opponent-header">
                    <p class="player-login">Игрок ${playerLogin}</p>
                    <p class="cards-count" id="cards-count-${playerId}">К-во карт: ${playerInfo.cards_in_hand_count}</p>
                </div>
                <div class="card-container" id="zoo-${playerId}"></div>
            `;
            }
            updateCards(`zoo-${playerId}`, playerInfo.zoo_cards);

            document.getElementById(`cards-count-${playerId}`).innerHTML = `К-во карт: ${playerInfo.cards_in_hand_count}`;

    
            if (isCurrentPlayer) {
                playerDiv.classList.add('current-player');
                selectedCards.length = 0; 
                localStorage.removeItem('selectedCards');
            }
    
            playerDiv.addEventListener('mouseenter', () => {
                if (!isCurrentPlayer) {
                    playerDiv.style.backgroundColor = '#D1DCB2';
                }
            });
    
            playerDiv.addEventListener('mouseleave', () => {
                playerDiv.style.backgroundColor = '';
            });
    
            playerDiv.addEventListener('click', () => {
                drawCard(playerId);
            });
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
            if(data.info.game_status != null){
                updateGameStatus(data.info.game_status);
            }
        } else {
            alert(data.message || 'Ошибка'); 
        }
    })
    .catch(error => {
        console.error('Ошибка при вытягивании карты:', error);
    });
}


function showCardInModal(id, calculatedType, cardType = null, message = "") {
    gameModalCard.showCardInModal(id, calculatedType, cardType, message);

    if (cardType === 'черная овечка') {
        selectedCards.length = 0; 
        localStorage.removeItem('selectedCards');
        getGameStatus();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    roomIdGame = new URLSearchParams(window.location.search).get('room_id');
    if (!roomIdGame) {
        alert('Ошибка: Комната не указана.');
        return;
    }

    getGameStatus();
    setupQuitButton();

    setInterval(() => {
        getGameStatus();

        const savedSelectedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
        selectedCards = savedSelectedCards;

        setTimeout(() => {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                if (savedSelectedCards.includes(card.dataset.id.toString())) {
                    card.style.boxShadow = '0px 0px 7px 7px rgb(200, 175, 73)';
                }
            });
        }, 500);
    }, 10000); 
});


document.getElementById('place-cards-btn').addEventListener('click', () => {
    placeCardsInZoo(roomIdGame, selectedCards);
});

// document.getElementById('exit_in_rooms').addEventListener('click', () => {
//     window.location.href = './rooms.php';
// });
