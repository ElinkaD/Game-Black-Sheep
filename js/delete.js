export function deleteGame(roomId) {
    console.log('Deleting room with ID:', roomId);
    fetch('../api/delete_game_room.php', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log(data.message);  
        } else {
            alert('Ошибка при удаление: ' + (data.message || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.error('Ошибка при удаление комнаты:', error);
    });
}

