import { renderCard } from '../card/script.js';

class GameModalCard {
    constructor() {
        this.modalCard = document.getElementById('card-modal');
        this.modalMessage = document.getElementById('modal-message');
        this.podloshka = this.modalCard.querySelector('.podloshka');

        this.modalCard.addEventListener('click', (event) => {
            if (event.target === this.modalCard) {
                this.closeModal();
            }
        });
    }

    showCardInModal(id, calculatedType, cardType = null, message = "") {
        this.modalMessage.textContent = message;

        this.podloshka.innerHTML = ''; 
        this.podloshka.appendChild(this.modalMessage);

        renderCard(id, calculatedType, cardType, (html) => {
            this.podloshka.innerHTML += html;
        });

        this.modalCard.style.display = 'flex'; 
    }

    closeModal() {
        this.modalCard.style.display = 'none'; 
    }
}

const gameModalCard = new GameModalCard();
export default gameModalCard;
