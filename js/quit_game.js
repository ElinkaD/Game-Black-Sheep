export function quitGame(roomId) {
    fetch('../api/remove_player_from_game.php', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: roomId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message || 'Вы успешно вышли из игры.');
            window.location.href = './rooms.php';  
        } else {
            alert('Ошибка при выходе: ' + (data.message || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.error('Ошибка при выходе из игры:', error);
        alert('Ошибка при выходе из игры');
    });
}

export function setupQuitButton() {
    const quitButton = document.getElementById("quit-button");
    const roomIdFromButton = quitButton.getAttribute('data-id-room');

    quitButton.addEventListener("click", () => {
        if (!confirm("Вы точно хотите покинуть игру? Вы не сможете потом ее продолжить.")) {
            return;
        }
        
        quitGame(roomIdFromButton);  
    });
}

