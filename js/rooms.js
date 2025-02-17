function updateRoomsList() {
    fetch('../api/list_available_rooms.php')
    .then(response => response.json())
    .then(data => {
        console.log("JSON-данные:", data);
        const roomsList = document.querySelector(".rooms-list");
        roomsList.innerHTML = '';

        if (data.status === 'success' && data.info && data.info.length > 0) {
            const rooms = data.info; 
            rooms.forEach(room => {
                const roomElement = document.createElement('li');
                const status = room.count_players_need === 0 ? "Игра началась" : `Ожидание игроков: ${room.count_players_need}`;
                const button = room.count_players_need === 0 
                    ? `<button class="join-room continue" data-id-room="${room.room_id}" title="Игра уже началась">Продолжить</button>`
                    : `<button class="join-room" data-id-room="${room.room_id}">Войти</button>`;

                roomElement.innerHTML = `
                    <span>Комната №${room.room_id}</span>
                    <span>Время на ход: ${room.time_to_move} сек</span>
                    <span>${status}</span>
                    ${button}
                `;
                roomsList.appendChild(roomElement);
            });
        } else {
            roomsList.innerHTML = '<p>Нет доступных комнат</p>';
        }
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
        alert('Ошибка при получении списка комнат');
    });
}
export { updateRoomsList };

function joinRoom(roomId) {
    fetch('../api/join_game.php', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomId }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = `game.php?room_id=${roomId}`; 
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при подключении к комнате:', error);
        alert('Ошибка при подключении к комнате');
    });
}


document.addEventListener("DOMContentLoaded", () => {
    updateRoomsList();
    document.getElementById("room_refresh").addEventListener("click", updateRoomsList);
    
    document.querySelector('.rooms-list').addEventListener('click', (event) => {
        if (event.target.classList.contains('join-room')) {
            const roomId = event.target.getAttribute('data-id-room');
            if (event.target.classList.contains('continue')) {
                window.location.href = `game.php?room_id=${roomId}`;
            } else {
                joinRoom(roomId); 
            }
        }
    });
});
