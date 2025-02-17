<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$amount_of_players = isset($data['amount_of_players']) ? intval($data['amount_of_players']) : 2;
$time_for_move = isset($data['time_for_move']) ? intval($data['time_for_move']) : 60;


$stmt = $pdo->prepare('SELECT s338859.create_room(:amount_of_players, :time_for_move)');
$stmt->execute(['amount_of_players' => $amount_of_players ? $amount_of_players : 2, 'time_for_move' => $time_for_move ? $time_for_move : 60]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
	$_SESSION['id_room'] = $response['id_new_room'];

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