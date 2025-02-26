import { renderCard } from '../card/script.js';

class GameModalCard {
    constructor() {
        this.modalCard = document.getElementById('card-modal');
        this.modalMessage = document.getElementById('modal-message');

        this.modalCard.addEventListener('click', (event) => {
            if (event.target === this.modalCard) {
                this.closeModal();
            }
        });
    }

    showCardInModal(id, calculatedType, cardType = null, message = "") {
        this.modalMessage.textContent = message;

        renderCard(id, calculatedType, cardType, (html) => {
            this.modalCard.innerHTML = ''; 
            this.modalCard.appendChild(this.modalMessage); 
            this.modalCard.innerHTML += html; 
        });

        this.modalCard.style.display = 'flex'; 
    }

    closeModal() {
        this.modalCard.style.display = 'none'; 
    }
}

const gameModalCard = new GameModalCard();
export default gameModalCard;
