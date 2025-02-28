<style>
#eagle-card-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>

<p>Вы вытянули карту Орла — прирождённого лидера! Выбери игрока и спроси, есть ли у него определённое животное.</p>
<form id="eagle-card-container" method="POST">
    <div class="form-group">
        <label>Выберите игрока:</label>
        <select id="player-select" class="form-control"> </select>
    </div>
    <div class="form-group">
        <input name="animal-type" type="number" id="animal-type" class="form-control" min="1" max="16" placeholder=" ">
        <label for="animal-type">Выберите тип животного:</label>
    </div>

    <div class="form-group">
        <button id="use-eagle-card">Спросить</button>
        <button id="cancel-eagle-card">Не использовать карту</button>
    </div>

</form>