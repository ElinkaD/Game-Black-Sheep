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
<head>
    <title>Игра Черная овечка</title>
    <link rel="stylesheet" href="../css/rooms.css">
</head>
<body>
	<button data-show-dialog="rules-dialog" class="rules-button">правила</button>

	<main class='rooms'>
		<div class='header'>
			<h2>Добро пожаловать, <?php echo $_SESSION['login'];?></h2>
			<button id="quit-rooms-button">Выйти</button>
		</div>

		<div class="settings">
			<button data-show-dialog="create-room-dialog">Создать новую игру</button>
			<button class="refresh" id="room_refresh">Обновить</button>
		</div>

		<div class="games">
            <ul class="rooms-list">
                <!-- Список комнат js -->
            </ul>
        </div>
	</main>
	<script type="module" src="../js/rooms.js"></script>
</body>
</html>