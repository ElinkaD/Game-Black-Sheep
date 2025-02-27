import { renderCard } from '../components/card/script.js';
import { getGameStatus } from './game.js'; 

let selectedCards = [];

function selectCard(cardId, cardElement) {
    const cardIndex = selectedCards.indexOf(cardId);
    if (cardIndex === -1) {
        selectedCards.push(cardId);
        cardElement.style.border = '3px solid green'; // Добавляем зеленую границу
    } else {
        selectedCards.splice(cardIndex, 1);
        cardElement.style.border = ''; // Убираем зеленую границу
    }
}

function updateSelectedCardsUI() {
    const selectedCardsContainer = document.getElementById('selected-cards');
    selectedCardsContainer.innerHTML = '';  
    selectedCards.forEach(cardId => {
        const div = document.createElement('div');
        div.classList.add('selected-card');
        div.dataset.cardId = cardId;
        div.textContent = cardId;
        selectedCardsContainer.appendChild(div);
    });
}

function placeCardsInZoo(roomId) {
    fetch('../api/place_in_zoo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room: roomId,
            cards: selectedCards
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Карты успешно выложены в зоопарк');
            updateZooUI(data.info);
            getGameStatus(); 
        } else {
            alert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка при выкладывании карт:', error);
        alert('Ошибка при выкладывании карт');
    });
}

function updateZooUI(gameInfo) {
    const playerZoo = document.getElementById('player-zoo');
    playerZoo.innerHTML = '';  

    gameInfo.my_player_info.zoo_cards.forEach(card => {
        renderCard(card.card_id, card.calculated_type, null, (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            playerZoo.appendChild(div);
        });
    });
}

function handleCardClick(cardId) {
    const cardElement = document.querySelector(`.card[data-id='${cardId}']`);
    if (cardElement) {
        selectCard(cardId, cardElement);
    }
}




export { selectCard, placeCardsInZoo, updateZooUI, handleCardClick };
