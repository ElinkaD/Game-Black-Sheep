<?php
session_start();

if (!isset($_SESSION['token'])) {
	header("Location: ./start.php");
}

include '../api/db_connect.php';
include '../components/dialog/component.php';

$rules = file_get_contents('../components/dialog/templates/rules/template.php');
render_dialog('rules-dialog', $rules);

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

	<div id="card-modal">
		<div class="message" id="modal-message"></div>
	</div>


	<script type="module" src="../js/game.js"></script>
</html>

<!-- <!DOCTYPE html>
<html>
	<main class='game'>
		<section class='aside'>
			<div>
				<div class="info">
					<div class='head'>
						<h4 id='game_status'></h4>
						<div>
							<button data-show-dialog="rules-dialog">правила</button>
							<button id="quit-button" data-id-room="">выйти из игры</button>
							<button onclick="window.location.href = './profile.php';">в профиль</button>
						</div>
					</div>
					<span id='role'></span>
					<div class='timer hidden'>
						<span>Время до конца хода:</span>
						<div id='timer'></div>
					</div>
					<div class='moves hidden'>
						<span>До победы саботёров в игре осталось ходов:</span>
						<div id='moves'></div>
					</div>
				</div>

				<div class='players'>
					<h3>Игроки</h3>
					<ul class="players-list"></ul>
				</div>
				<div class="game-play">
					<ul class="cards-hand waiting"></ul>
					<div>
						<button title='вы можете перевернуть карты' id="switch-cards" class="waiting">
							<img src="../img/switch.png" alt="">
						</button>
						<div title='вы сбросить карту в колоду сброса' class="drop-card waiting">
							<img src="../img/drop.svg" alt="">
						</div>
					</div>
				</div>
			</div>
		</section>

	</main>

	<script type="module" src="../scripts/index.js"></script>
	<script type="module" src="../scripts/quit.js"></script>
	<script type="module" src="../scripts/game/game.js"></script>
	<script type="module" src="../scripts/game/cards.js"></script>
</html> -->