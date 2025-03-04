import { updateGameStatus } from './game.js'; 

export function placeCardsInZoo(roomId, selectedCards) {
    const formData = new FormData();
    
    formData.append('room', roomId);
    selectedCards.forEach(card => {
        formData.append('cards[]', card); 
    });

    fetch('../api/place_in_zoo.php', {
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.message);
            updateGameStatus(data.info.game_status); 

            selectedCards.length = 0; 
            localStorage.removeItem('selectedCards');
        } else {
            alert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        console.log('Ошибка при выкладывании карт:', error);
    });
}
