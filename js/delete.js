export function deleteGame(roomId) {
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

// export function setupQuitButton() {
//     const quitButton = document.getElementById("quit-button");
//     const roomIdFromButton = quitButton.getAttribute('data-id-room');

//     quitButton.addEventListener("click", () => {
//         quitGame(roomIdFromButton);  
//     });
// }

