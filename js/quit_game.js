export function setupQuitButton(roomId) {
    const quitButton = document.getElementById("quit-button");

    quitButton.addEventListener("click", () => {
        quitButton.disabled = true;

        fetch('../api/remove_player_from_game.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded',},
            body: new URLSearchParams({room: roomId}), 
        })
        .then(response => response.json())
        .then(data => {
            quitButton.disabled = false;

            if (data.status === 'success') {
                alert(data.message || 'Вы успешно вышли из игры.');
                window.location.href = './rooms.php'; 
            } else {
                alert('Ошибка при выходе: ' + (data.message || 'Неизвестная ошибка'));
            }
        })
        .catch(error => {
            quitButton.disabled = false;

            console.error('Ошибка при выходе из игры:', error);
            alert('Ошибка при выходе из игры');
        });
    });
}
