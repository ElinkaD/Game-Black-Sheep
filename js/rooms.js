document.addEventListener("DOMContentLoaded", () => {
    const dialogs = document.querySelectorAll("dialog");
    const openButtons = document.querySelectorAll("[data-show-dialog]");
    const closeButtons = document.querySelectorAll(".close");
    
    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const dialogName = button.getAttribute("data-show-dialog");
            const dialog = document.querySelector(`[data-dialog-name="${dialogName}"]`);
            if (dialog) {
                dialog.showModal();
            }
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.target.closest("dialog").close();
        });
    });

    document.getElementById("createRoomForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("amount_of_players", event.target["amount_of_players"].value);
        formData.append("time_for_move", event.target["time_for_move"].value);
        
        const response = await fetch("../api/create_room.php", {
            method: "POST",
            body: formData
        });
        
        const result = await response.json();
        
        if (result.status === "success") {
            document.querySelector('[data-dialog-name="create-room-dialog"]').close();
            alert(result.message);
            updateRoomsList();
        } else {
            alert(result.message || "Ошибка при создании комнаты");
        }
    });


    document.getElementById("room_refresh").addEventListener("click", updateRoomsList);

    function updateRoomsList() {
        fetch('../api/list_available_rooms.php')
        .then(response => response.json())
        .then(data => {
            const roomsList = document.querySelector(".rooms-list");
            roomsList.innerHTML = '';

            if (data.status === 'success' && data.info && data.info.length > 0) {
                const rooms = data.info; 
                rooms.forEach(room => {
                    const roomElement = document.createElement('li');
                    const status = room.count_players_need === 0 ? "Игра началась" : `Ожидание игроков: ${room.count_players_need}`;
                    const button = room.count_players_need === 0 
                        ? `<button class="join-room" data-id-room="${room.room_id}" title="Игра уже началась">Продолжить</button>`
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

    updateRoomsList();
});
