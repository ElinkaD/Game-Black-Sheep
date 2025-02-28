export function renderCard(id, calculatedType, cardType = null, callback) {
    fetch('../components/card/component.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            id: id,
            calculated_type: calculatedType,
            card_type: cardType,
        }),
    })
    .then(response => response.text())
    .then(html => {
        callback(html); 
    })
    .catch(error => {
        console.error('Ошибка при рендеринге карты:', error);
        callback('<div class="card">Ошибка загрузки карты</div>'); 
    });
}


