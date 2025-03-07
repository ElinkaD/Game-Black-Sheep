import { updateGameStatus } from '/~s338859/Game-Black-Sheep/js/game.js'; 



function openEagleCardDialog(opponents) {
    const dialog = document.querySelector('[data-dialog-name="eagle-dialog"]');
    if (!dialog) {
        console.error("Диалог не найден");
        return;
    }

    dialog.showModal(); 
    document.body.classList.add("dialog-open");

    const playerSelect = dialog.querySelector('#player-select');
    const animalTypeInput = dialog.querySelector('#animal-type');
    const useEagleCardButton = dialog.querySelector('#use-eagle-card');
    const cancelEagleCardButton = dialog.querySelector('#cancel-eagle-card');

    playerSelect.innerHTML = '';

    if (opponents && Object.keys(opponents).length === 1) {
        const opponentId = Object.keys(opponents)[0];
        playerSelect.innerHTML = `<option value="${opponentId}">${opponents[opponentId].player_login}</option>`;
        playerSelect.disabled = true;
    } else if (opponents && Object.keys(opponents).length > 1) {
        Object.keys(opponents).forEach(opponentId => {
            const option = document.createElement('option');
            option.value = opponentId;
            option.textContent = opponents[opponentId].player_login;
            playerSelect.appendChild(option);
        });
    } else {
        console.error("Нет доступных оппонентов.");
    }

    useEagleCardButton.addEventListener('click', () => {
        const playerId = playerSelect.value;
        const animalType = animalTypeInput.value;

        if (!playerId) {
            alert('Пожалуйста, выберите игрока.');
            return;
        }

        if (!animalType && animalType !== null) {
            alert('Пожалуйста, введите тип животного.');
            return;
        }

        useEagleCard(playerId, animalType, dialog);
    });

    cancelEagleCardButton.addEventListener('click', () => {
        const playerId = playerSelect.value;
        useEagleCard(playerId, 0, dialog); 
    });
}

function useEagleCard(playerId, animalType, dialog) {
    fetch('../api/request_card.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            player: playerId,
            animal_type: animalType,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);
            dialog.close();
            updateGameStatus(data.info.game_status);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при использовании карты Орла:', error);
        alert('Ошибка при соединении с сервером');
    });
}


export { openEagleCardDialog };