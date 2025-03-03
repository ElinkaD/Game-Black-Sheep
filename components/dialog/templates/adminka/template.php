
<form id="adminkaForm" method="POST">
    <h2>Админка</h2>
    <div class="admin_del">
        <div class="form-group">
            <input name="room_id" type="number" placeholder=" " required>
            <label for="room_id">Номер комнаты</label>
        </div>
        <button type="submit">Удалить</button>
    </div>
</form>
<button id="delete-all-arooms">Удалить все пустые комнаты</button>

<script type="module" src="../js/rooms.js"></script>
<script type="module" src="..\components\dialog\templates\adminka\script.js"></script>