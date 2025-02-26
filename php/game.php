<?php
session_start();

if (!isset($_SESSION['token'])) {
	header("Location: ./start.php");
}

include '../api/db_connect.php';
include '../components/dialog/component.php';
include '../components/game_modal_card/component.php';

$rules = file_get_contents('../components/dialog/templates/rules/template.php');
render_dialog('rules-dialog', $rules);

render_modal__card();


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
			<div id="magpie-card"></div>
			<div id="game-status"></div>
			<div id="waterhole"></div>
			<div id="player-zoo"></div>
			<div id="player-hand"></div>
		</div>
	</main>
	<script type="module" src="../js/game.js"></script>
</html>
