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
        this.modalMessage.innerHTML = ''; 

        this.modalMessage.textContent = message;

        renderCard(id, calculatedType, cardType, (html) => {
            this.modalMessage.innerHTML += html; 
        });

        this.modalCard.style.display = 'flex'; 

        setTimeout(() => {
            this.closeModal();
        }, 2000);
    }

    closeModal() {
        this.modalCard.style.display = 'none'; 
    }
}

const gameModalCard = new GameModalCard();
export default gameModalCard;
