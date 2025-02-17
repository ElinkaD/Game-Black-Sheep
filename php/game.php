<?php
session_start();

if (!isset($_SESSION['token'])) {
	header("Location: ./start.php");
}
include '../api/db_connect.php';

// $idRoom = $_GET['room'];


// $stmt = $pdo->prepare('SELECT * FROM s335141.users_in_rooms where login_user =:login and id_room =:room');
// $stmt->execute(['login' => $_SESSION['user']['login'], 'room' => $idRoom]);
// $result = $stmt->fetch();

if (!$result) {
	header("Location: ./rooms.php");
}
?>

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