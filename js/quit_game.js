export function setupQuitButton(roomId) {
    const quitButton = document.getElementById("quit-button");

    quitButton.addEventListener("click", () => {
        quitButton.disabled = true;

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
    });
}
