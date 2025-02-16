<?php
session_start();

if (!isset($_SESSION['token'])) {
	header("Location: ./start.php");
}
include '../api/db_connect.php';
?>

<!DOCTYPE html>
<html>	
	<main class='rooms'>
		<div class='header'>
			<h2>Добро пожаловать,
				<?php 
					echo $_SESSION['login'];
				?>
			</h2>

			<?php
			include '../components/dialog_rules/rules_component.php'; 
			?>

			<?php 
				print_r($_SESSION);
			?>
		</div>

		<div class="settings">
			<button data-show-dialog="create-room-dialog">Создать новую игру</button>
			<button class="refresh" id="room_refresh">Обновить</button>
		</div>

		<div class="games">
			<h3>Список доступных игр для подключения</h3>
			<?php
				if (!empty($_SESSION['rooms'])) {
					echo '<ul class="rooms-list">';
					foreach ($_SESSION['rooms'] as $room) {
						$playersNeeded = $room['count_players_need'];
						if ($playersNeeded == 0) {
							$status = "Игра началась";
							$button = '<button class="join-room" data-id-room="' . $room['room_id'] . '" title="Игра уже началась">Продолжить</button>';
						} else {
							$status = "Ожидание игроков: $playersNeeded";
							$button = '<button class="join-room" data-id-room="' . $room['room_id'] . '">Войти</button>';
						}

						echo '<li>';
						echo '<span>Комната №' . htmlspecialchars($room['room_id']) . '</span>';
						echo '<span>Время на ход: ' . htmlspecialchars($room['time_to_move']) . ' сек</span>';
						echo '<span>' . htmlspecialchars($status) . '</span>';
						echo $button;
						echo '</li>';
					}
					echo '</ul>';
				}
				else {
					echo '<p>Нет доступных комнат</p>';
				}
			?>
		</div>
	</main>

	<dialog data-dialog-name="create-room-dialog">
        <button class="close"></button>
        <form id="createRoomForm" method="POST">
            <h2>Создать новую комнату</h2>
            <div class="form-group">
                <label for="amount_of_players">Количество мест:</label>
                <input name="amount_of_players" type="number" value="2" min="2" required>
            </div>
            <div class="form-group">
                <label for="time_for_move">Время на ход (сек):</label>
                <input name="time_for_move" type="number" value="60" min="60" required>
            </div>
            <button type="submit">Создать</button>
        </form>
    </dialog>

	<script type="module" src="../js/rooms.js"></script>
</html>