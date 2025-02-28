import gameModalCard from '../components/game_modal_card/script.js'; 
import { renderCard } from '../components/card/script.js';
import { placeCardsInZoo } from './zoo.js';
import { openMoleCardDialog } from '../components/dialog/templates/mole/script.js';
import { openEagleCardDialog } from '../components/dialog/templates/eagle/script.js';
import { setupQuitButton } from './quit_game.js';

const cardContainers = new Map();
let selectedCards = [];

function addClickListenersToCards() {
    const cards = document.querySelectorAll('.card');    
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
        cardElement.style.border = '3px solid green';
    } else {
        selectedCards.splice(cardIndex, 1);
        cardElement.style.border = '';
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
    fetch('../api/get_game_status.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ roomId })
    })
    .then(response => response.json())
    .then(data => {
        console.log("JSON-данные:", data);
        if (data.status === 'success') {
            updateGameStatus(data.info); 
        } else {
            alert('Ошибка получения статуса игры: ' + (data.message || 'Неизвестная ошибка'));
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
    const magpieCard = document.getElementById('magpie-card');

    // Очистка предыдущих данных
    opponentsZoo.innerHTML = '';

    document.getElementById('hod').innerHTML = gameInfo.current_player_login;
    document.getElementById('timer').innerHTML = gameInfo.time_left;
    document.getElementById('ave-count').innerHTML = gameInfo.available_zoo_slots || '0';


    if (gameInfo.magpie_card.has_card) {
        magpieCard.style.opacity = '1'; 
    } else {
        magpieCard.style.opacity = '0'; 
    }

    const currentPlayerLogin = gameInfo.current_player_login;

    if (gameInfo.mole_player_cards && gameInfo.mole_player_cards.length > 0) {
        openMoleCardDialog(gameInfo.mole_player_cards, roomId);
    }

    if (gameInfo.has_eagle_card) {
        const opponents = gameInfo.zoo_opponent_cards; 
        openEagleCardDialog(opponents, roomId);
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
                    <p class="player-login">${playerLogin}</p>
                    <p class="cards-count">К-во карт: ${playerInfo.cards_in_hand_count}</p>
                </div>
            `;

            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
    
            updateCards(cardContainer, playerInfo.zoo_cards);
    
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
    }

    if (gameInfo.my_player_info.zoo_cards) {
        updateCards('player-zoo-cards', gameInfo.my_player_info.zoo_cards);
    }
    
    playerName.innerHTML = gameInfo.my_player_info.user_login;

    if (gameInfo.my_player_info.hand_cards) {
        updateCards('player-hand-cards', gameInfo.my_player_info.hand_cards);
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
    getGameStatus(roomId);
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
    // if (cardType === 'черная овечка') {
    //     getGameStatus(roomId);
    // }
}

let roomId;

document.addEventListener("DOMContentLoaded", () => {
    roomId = new URLSearchParams(window.location.search).get('room_id');
    if (!roomId) {
        alert('Ошибка: Комната не указана.');
        return;
    }
    getGameStatus(roomId);
    setupQuitButton(roomId);

    // setTimeout(() => {
    //     addClickListenersToCards();
    // }, 1000); 

    setInterval(() => getGameStatus(roomId), 5000);
});

document.getElementById('place-cards-btn').addEventListener('click', () => {
    placeCardsInZoo(roomId, selectedCards);
});


// let isUpdating = false;

// function debounce(func, wait) {
//     let timeout;
//     return function(...args) {
//         clearTimeout(timeout);
//         timeout = setTimeout(() => func.apply(this, args), wait);
//     };
// }

// const debouncedGetGameStatus = debounce(() => {
//     if (!isUpdating) {
//         isUpdating = true;
//         getGameStatus(roomId).finally(() => {
//             isUpdating = false;
//         });
//     }
// }, 1000);

// setInterval(debouncedGetGameStatus, 5000);