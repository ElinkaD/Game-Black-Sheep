
<form id="createRoomForm" method="POST">
    <h2>Создать новую комнату</h2>
    <div class="form-group">
        <input name="amount_of_players" type="number" min="2" max="5" placeholder=" " required>
        <label for="amount_of_players">Количество мест:</label>
    </div>
    <div class="form-group">
        <input name="time_for_move" type="number" min="60" placeholder=" " required>
        <label for="time_for_move">Время на ход (сек):</label>
    </div>
    <button type="submit">Создать</button>
</form>

<script type="module" src="../js/rooms.js"></script>
<script type="module" src="..\components\dialog\templates\create_room\script.js"></script>