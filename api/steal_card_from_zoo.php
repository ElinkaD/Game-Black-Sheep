<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$player = $_POST['player'] ?? null;
$card = $_POST['card'] ?? null;

if (empty($card) || empty($player)) {
	echo json_encode(['status' => 'error', 'message' => 'Not enough info']);
	exit;
}

$stmt = $pdo->prepare('SELECT s338859.steal_card_from_zoo(:t, :player, :card)');
$stmt->execute(['t' => $_SESSION['token'], 'player' => $player, 'card' => $card]);
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