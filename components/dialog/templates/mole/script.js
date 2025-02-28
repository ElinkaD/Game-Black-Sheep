import { renderCard } from '/~s338859/Game-Black-Sheep/components/card/script.js';
import { getGameStatus } from '/~s338859/Game-Black-Sheep/js/game.js'; 



function openMoleCardDialog(cards, roomId) {
    const dialog = document.querySelector('[data-dialog-name="mole-dialog"]');
    if (!dialog) {
        console.error("Диалог не найден");
        return;
    }

    dialog.showModal(); 
    document.body.classList.add("dialog-open");

    const cardContainer = dialog.querySelector('#mole-card-container');
    if (!cardContainer) {
        console.error("Контейнер карт не найден в диалоге");
        return;
    }
    cardContainer.innerHTML = ''; 

    cards.forEach(card => {
        renderCard(card.card_id, card.calculated_type, null, (cardHtml) => {
            cardContainer.innerHTML += cardHtml; 
            setTimeout(() => {
                const cardElement = cardContainer.querySelector(`[data-id="${card.card_id}"]`);
                if (cardElement) {
                    cardElement.addEventListener('click', () => {
                        handleCardClickMole(card.card_id, roomId, dialog);
                    });
                }
            }, 1000); 
        });
    });
}

function handleCardClickMole(cardId, roomId, dialog) {
    fetch('../api/select_one_card.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            room: roomId,
            card: cardId
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);
            dialog.close();
            getGameStatus();
        } else {
            alert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при выборе карты:', error);
        alert('Ошибка при соединении с сервером');
    });
}


export { openMoleCardDialog };