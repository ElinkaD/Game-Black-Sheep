<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$room_id = isset($data['roomId']) ? $data['roomId'] : null;

if (empty($room_id)) {
	echo json_encode(['status' => 'error', 'message' => 'No room']);
	exit;
}

$stmt = $pdo->prepare('SELECT s338859.join_game(:t, :room_id)');
$stmt->execute(['t' => $_SESSION['token'], 'room_id' => $room_id]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {

	echo json_encode([
		'status' => 'success',
		'message' => $response['result_message'],
		'info' => $response
	]);
} else {
	echo json_encode([
		'status' => 'error',
		'message' => $response['result_message'] ?? 'Error'
	]);
}
?>