document.addEventListener("DOMContentLoaded", () => {
    const roomId = new URLSearchParams(window.location.search).get('room_id');
    if (!roomId) {
        alert('Ошибка: Комната не указана.');
        return;
    }

    // Функция для получения статуса игры
    function getGameStatus() {
        fetch('../api/get_game_status.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ roomId })
        })
        .then(response => response.json())
        .then(data => {
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

    // Функция для обновления статуса игры на странице
    function updateGameStatus(gameInfo) {
        const gameStatusDiv = document.getElementById('game-status');
        
        // Формируем строку с информацией о текущем игроке и времени
        const currentPlayer = gameInfo.current_turn_player || 'Неизвестно';
        const remainingTime = formatTime(gameInfo.time_left);
        const availableZooSlots = gameInfo.available_zoo_slots || 'Неизвестно';
        const gameWinner = gameInfo.game_winner || 'Игра не завершена';

        let gameStatusHTML = `
            <p>Текущий игрок: ${currentPlayer}</p>
            <p>Оставшееся время: ${remainingTime}</p>
            <p>Доступные слоты для зоопарка: ${availableZooSlots}</p>
            <p>Победитель: ${gameWinner}</p>
        `;
    
        gameStatusHTML += displayCards('Карты на водопое', gameInfo.waterhole_cards);
        gameStatusHTML += displayZooCards(gameInfo.zoo_opponent_cards);
        gameStatusHTML += displayCards('Карты текущего игрока', gameInfo.my_player_info?.hand_cards);
    
        // Дополнительная информация о картах
        gameStatusHTML += displayCardInfo('сорока-воровка', gameInfo.has_magpie_card);
        gameStatusHTML += displayCardInfo('крот', gameInfo.has_mole_card);
        gameStatusHTML += displayCards('Карты игрока с картой "крот"', gameInfo.mole_player_cards);
    
        gameStatusDiv.innerHTML = gameStatusHTML;
    }

    // Форматирование времени (например, оставшееся время в секундах)
    function formatTime(time) {
        if (time === undefined || time < 0) {
            return 'Неизвестно';
        }
        return `${time} сек`;
    }

    // Вывод карт (например, на водопое или в руке)
    function displayCards(title, cards) {
        if (!cards || cards.length === 0) {
            return `<p>${title}: Нет карт</p>`;
        }
        let cardsHTML = `<p>${title}:</p><ul>`;
        cards.forEach(card => {
            cardsHTML += `<li>Карточка ID: ${card.card_id}, Тип: ${card.calculated_type}</li>`;
        });
        cardsHTML += '</ul>';
        return cardsHTML;
    }

    // Вывод карт в зоопарке у соперников
    function displayZooCards(zooCards) {
        if (!zooCards || Object.keys(zooCards).length === 0) {
            return '<p>У соперников нет карт в зоопарке.</p>';
        }
        let zooCardsHTML = '<p>Карты в зоопарке у соперников:</p><ul>';
        for (const playerId in zooCards) {
            const playerInfo = zooCards[playerId];
            zooCardsHTML += `
                <li>Игрок: ${playerInfo.player_login}</li>
                <ul>
                    ${playerInfo.zoo_cards.map(card => `
                        <li>Карточка ID: ${card.card_id}, Тип: ${card.calculated_type}</li>
                    `).join('')}
                    <li>Количество карт в руке: ${playerInfo.cards_in_hand_count}</li>
                </ul>
            `;
        }
        zooCardsHTML += '</ul>';
        return zooCardsHTML;
    }

    // Дополнительная информация о картах
    function displayCardInfo(cardType, hasCard) {
        if (hasCard === undefined) return '';
        return `<p>Есть ли карта "${cardType}": ${hasCard ? 'Да' : 'Нет'}</p>`;
    }

    getGameStatus();
});
