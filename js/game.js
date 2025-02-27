import gameModalCard from '../components/game_modal_card/script.js'; 
import { renderCard } from '../components/card/script.js';
import { openMoleCardDialog } from '../components/dialog/templates/mole/script.js';
import { selectCard, placeCardsInZoo, updateZooUI, handleCardClick } from './zoo.js';

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
    const waterhole = document.getElementById('waterhole');
    const magpieCard = document.getElementById('magpie-card');
    const playerZoo = document.getElementById('player-zoo');
    const gameStatus = document.getElementById('game-status');
    const playerHand = document.getElementById('player-hand');

    // Очистка предыдущих данных
    opponentsZoo.innerHTML = '';
    waterhole.innerHTML = '';
    magpieCard.innerHTML = '';
    playerZoo.innerHTML = '';
    gameStatus.innerHTML = '';
    playerHand.innerHTML = '';

    let currentPlayerLogin = 'Неизвестно';
    const currentPlayerId = gameInfo.current_turn_player;
    if (gameInfo.my_player_info && gameInfo.my_player_info.player_id == currentPlayerId) {
        currentPlayerLogin = gameInfo.my_player_info.user_login;
    } else {
        if (gameInfo.zoo_opponent_cards) {
            for (const playerId in gameInfo.zoo_opponent_cards) {
                if (playerId == currentPlayerId) {
                    currentPlayerLogin = gameInfo.zoo_opponent_cards[playerId].player_login;
                    break;
                }
            }
        }
    }

    if (gameInfo.mole_player_cards && gameInfo.mole_player_cards.length > 0) {
        openMoleCardDialog(gameInfo.mole_player_cards, roomId);
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
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        gameInfo.waterhole_cards.forEach(card => {
            renderCard(card.card_id, card.calculated_type, card.card_type, (html) => {
                cardContainer.innerHTML += html;
            });
        });

        waterhole.appendChild(cardContainer);
    }

    if (gameInfo.magpie_card.has_card) {
        renderCard(gameInfo.magpie_card.card_id, null, 'сорока-воровка', (html) => {
            magpieCard.innerHTML = html;
        });
    }

    if (gameInfo.my_player_info.zoo_cards) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        gameInfo.my_player_info.zoo_cards.forEach(card => {
            renderCard(card.card_id, card.calculated_type, card.card_type, (html) => {
                cardContainer.innerHTML += html;
            });
        });

        playerZoo.appendChild(cardContainer);
    }

    if (gameInfo.my_player_info.hand_cards) {
        playerHand.innerHTML += `<h3>${gameInfo.my_player_info.user_login}</h3>`;
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        gameInfo.my_player_info.hand_cards.forEach(card => {
            renderCard(card.card_id, card.calculated_type, card.card_type, (html) => {
                cardContainer.innerHTML += html;
            });
        });

        playerHand.appendChild(cardContainer);
    }
    
    gameStatus.innerHTML = `
        <p>Текущий ход: ${currentPlayerLogin}</p>
        <p id='timer'>Оставшееся время: ${formatTime(gameInfo.time_left)}</p>
        <p>К-во карт в зоопарк: ${gameInfo.available_zoo_slots || '0'}</p>
    `;
}


function formatTime(time) {
    return (time === undefined || time < 0) ? 'Неизвестно' : `${time} сек`;
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

    if (cardType !== 'черная овечка') {
        const waterhole = document.getElementById('waterhole');
        
        if (waterhole) {
            let cardContainer = waterhole.querySelector('.card-container');
            
            if (!cardContainer) {
                cardContainer = document.createElement('div');
                cardContainer.className = 'card-container';
                waterhole.appendChild(cardContainer); 
            }
            renderCard(id, calculatedType, cardType, (html) => {
                cardContainer.innerHTML += html;
            });
        } else {
            console.error("Не найден элемент с id 'waterhole'");
        }
    }
    if (cardType === 'черная овечка') {
        getGameStatus(roomId);
    }
}

let roomId;

document.addEventListener("DOMContentLoaded", () => {
    roomId = new URLSearchParams(window.location.search).get('room_id');
    if (!roomId) {
        alert('Ошибка: Комната не указана.');
        return;
    }

    document.getElementById('place-cards-btn').addEventListener('click', () => {
        placeCardsInZoo(roomId);
    });

    getGameStatus(roomId);
    // setInterval(() => getGameStatus(roomId), 5000);
});


document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const cardId = card.getAttribute('data-id');
        if (cardId) {
            handleCardClick(cardId); 
        }
    });
});
