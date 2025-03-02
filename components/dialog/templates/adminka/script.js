import { updateRoomsList } from '../../../../js/rooms.js';

document.getElementById("adminkaForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const room_id = event.target["room_id"].value;
    
    const response = await fetch("../api/delete_game_room.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id })
    });
    
    const result = await response.json();
    
    if (result.status === "success") {
        document.querySelector('[data-dialog-name="adminka-dialog"]').close();
        updateRoomsList();
    } else {
        alert(result.message || "Ошибка при удаление комнаты");
    }
});


document.getElementById('delete-all-arooms').addEventListener('click', () => {
    fetch('../api/delete_empty_rooms.php', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.querySelector('[data-dialog-name="adminka-dialog"]').close();
                updateRoomsList();
            } else {
                alert('Ошибка при удаление всех пустых комнат: ' + (data.message || 'Неизвестная ошибка'));
            }
        })
        .catch(error => {
            console.error('Ошибка при удаление всех пустых комнат:', error);
        });
});