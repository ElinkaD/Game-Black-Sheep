<?php
session_start();

if (!isset($_SESSION['token'])) {
	header("Location: ./start.php");
}
include '../api/db_connect.php';
include '../components/dialog/component.php';

$rules = file_get_contents('../components/dialog/templates/rules/template.php');
render_dialog('rules-dialog', $rules);

$roomForm = file_get_contents('../components/dialog/templates/create_room/template.php');
render_dialog('create-room-dialog', $roomForm);
?>

<!DOCTYPE html>
<html>	
	<main class='rooms'>
		<div class='header'>
			<h2>Добро пожаловать, <?php echo $_SESSION['login'];?></h2>
			<button data-show-dialog="rules-dialog">правила</button>
		</div>

		<div class="settings">
			<button data-show-dialog="create-room-dialog">Создать новую игру</button>
			<button class="refresh" id="room_refresh">Обновить</button>
		</div>

		<div class="games">
            <h3>Список доступных игр для подключения</h3>
            <ul class="rooms-list">
                <!-- Список комнат через JavaScript -->
            </ul>
        </div>
	</main>

	<script type="module" src="../js/rooms.js"></script>
</html>