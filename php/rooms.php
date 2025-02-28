<?php
session_start();

if (!isset($_SESSION['token'])) {
	header("Location: ./start.php");
}
include '../api/db_connect.php';
include '../components/dialog/component.php';

$rules = file_get_contents('../components/dialog/templates/rules/template.php');
render_dialog('rules-dialog', $rules, true);

$roomForm = file_get_contents('../components/dialog/templates/create_room/template.php');
render_dialog('create-room-dialog', $roomForm, true);

$resetForm = file_get_contents('../components/dialog/templates/pass_reset/template.php');
render_dialog('pass-reset-dialog', $resetForm, true);

$zaglushka = file_get_contents('../components/dialog/templates/zaglushka/template.php');
render_dialog('zaglushka-dialog', $zaglushka, false);
?>

<!DOCTYPE html>
<html>	
<head>
    <title>Игра Черная овечка</title>
    <link rel="stylesheet" href="../css/rooms.css">

	<style>
        @font-face {
            font-family: 'RussianRail G Pro';
            src: url('../fonts/RussianRail G Pro Regular_0.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'Groboldov';
            src: url('../fonts/Groboldov.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
        }
    </style> 
</head>
<body>
	<button data-show-dialog="rules-dialog" class="rules-button">правила</button>

	<main class='rooms'>
		<div class='header'>
			<h2>Добро пожаловать, <?php echo $_SESSION['login'];?></h2>
			<button id="quit-rooms-button">Выйти</button>
            <button data-show-dialog="pass-reset-dialog">Сменить пароль</button>
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