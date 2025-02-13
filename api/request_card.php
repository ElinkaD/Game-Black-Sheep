<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$player = $_POST['player'] ?? null;
$animal_type = $_POST['animal_type'] ?? null;

if (empty($type) || empty($player)) {
	echo json_encode(['status' => 'error', 'message' => 'Not enough info']);
	exit;
}

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
	echo json_encode([
		'status' => 'error',
		'message' => $response['message'] ?? 'Error'
	]);
}
?>