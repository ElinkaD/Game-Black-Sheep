<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$player = isset($data['player']) ? $data['player'] : null;
$animal_type = isset($data['animal_type']) ? $data['animal_type'] : null;

$stmt = $pdo->prepare('SELECT s338859.request_card(:t, :player, :animal_type)');
$stmt->execute(['t' => $_SESSION['token'], 'player' => $player, 'animal_type' => $animal_type]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
	echo json_encode([
		'status' => 'success',
		'message' => $response['message'], 
		'info' => $response
	]);
} else {
	error_log('Error in request_card: ' . json_encode($response));
	echo json_encode([
		'status' => 'error',
		'message' => $response['message'] ?? 'Error'
	]);
}
?>