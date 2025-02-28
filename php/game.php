<?php
session_start();

if (!isset($_SESSION['token'])) {
	header("Location: ./start.php");
}

include '../api/db_connect.php';
include '../components/dialog/component.php';
include '../components/game_modal_card/component.php';

$rules = file_get_contents('../components/dialog/templates/rules/template.php');
render_dialog('rules-dialog', $rules, true);

render_modal__card();

$mole = file_get_contents('../components/dialog/templates/mole/template.php');
render_dialog('mole-dialog',  $mole, false);

$eagle = file_get_contents('../components/dialog/templates/eagle/template.php');
render_dialog('eagle-dialog',  $eagle, false);

$zaglushka = file_get_contents('../components/dialog/templates/zaglushka/template.php');
render_dialog('zaglushka-dialog', $zaglushka, false);


$room_id = $_GET['room_id'] ?? null;

if (empty($room_id)) {
    header("Location: ./rooms.php");
    exit;
}

$stmt = $pdo->prepare('SELECT s338859.get_game_status(:t, :room)');
$stmt->execute(['t' => $_SESSION['token'], 'room' => $room_id]);
$result = $stmt->fetchColumn();
$response = json_decode($result, true);

if (!$response || $response['status'] !== 'success') {
    header("Location: ./rooms.php");
    exit;
}

$_SESSION['game'] = $response;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Игра Черная овечка №<?= htmlspecialchars($room_id)?></title>
	<link rel="stylesheet" href="../css/game.css">
	<link rel="stylesheet" href="../components/card/style.css">
	<link rel="stylesheet" href="../components/game_modal_card/style.css">
</head>
</head>
	<main class='game'>
		<div class="left-panel">
			<div class="room-info">
				<h1>Комната №<?= htmlspecialchars($room_id) ?></h1>
				<button id="quit-button" data-id-room="">Выйти</button>
			</div>
			
			<div id="opponents-zoo">
				<div class="card-container" id="opponent-cards"></div>
			</div>
		</div>

		<div class="right-panel">
			<div class="rules">
				<button data-show-dialog="rules-dialog">Правила</button>
			</div>
			<!-- Игровой экран -->
			<div class="game-panel">
				<div id="magpie-card">
					<div class='card' data-id='9999' data-type='сорока-воровка'>
							<img src='../img/magpiethief.png' alt='Карта Сорока-воровка'>
						</div>
					</div>
				<div class="waterhole-сard"></div>
				<div id="game-status">
						Текущий ход: <span id='hod'></span> </br>
						Оставшееся время: <span id='timer'></span> сек </br>
						К-во карт в зоопарк: <span id='ave-count'></span>
				</div>
			</div>
			<div id="waterhole">
				<div id="waterhole-cards" class="card-container"></div>
			</div>
			<div id="player-zoo">
				<div id="player-zoo-cards" class="card-container"></div>
			</div>
			<div id="player-hand">
				<h3 id="player-name"></h3>
				<div id="player-hand-cards" class="card-container"></div>
			</div>
			<button id="place-cards-btn">Карты в зоопарк</button>
		</div>
	</main>
	<script type="module" src="../js/game.js"></script>
	<script type="module" src="../js/zoo.js"></script>
</html>
