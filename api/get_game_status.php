<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$room_id = $_GET['room_id'] ?? null;

if (empty($room_id)) {
	echo json_encode(['status' => 'error', 'message' => 'Write all the information']);
	exit;
}

$stmt = $pdo->prepare('SELECT s338859.get_game_status(:t, :room_id)');
$stmt->execute(['t' => $_SESSION['token'], 'room_id' => $room_id]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
	$_SESSION['game'] = $response;

	echo json_encode([
		'status' => 'success',
		'info' => $response
	]);
} else {
	echo json_encode([
		'status' => 'error',
		'message' => $response['result_message'] ?? 'Error'
	]);
}
?>
