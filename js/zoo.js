import { getGameStatus } from './game.js'; 

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
