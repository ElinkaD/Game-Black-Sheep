import { updateRoomsList } from '../../../../js/rooms.js';

document.getElementById("createRoomForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount_of_players = event.target["amount_of_players"].value;
    const time_for_move = event.target["time_for_move"].value;
    
    const response = await fetch("../api/create_room.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_of_players, time_for_move })
    });
    
    const result = await response.json();
    
    if (result.status === "success") {
        document.querySelector('[data-dialog-name="create-room-dialog"]').close();
        updateRoomsList();
    } else {
        alert(result.message || "Ошибка при создании комнаты");
    }
});
