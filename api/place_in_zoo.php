<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$room = isset($_POST['room']) ? intval($_POST['room']) : null;
$cards = isset($_POST['cards']) ? $_POST['cards'] : [];

if (empty($room)) {
	echo json_encode(['status' => 'error', 'message' => 'Not enough info']);
	exit;
}

$cards_sql = '{' . implode(',', $cards) . '}'; 

$stmt = $pdo->prepare('SELECT s338859.place_in_zoo(:t, :room, :cards::integer[])');
$stmt->execute(['t' => $_SESSION['token'], 'room' => $room, 'cards' => $cards_sql]);
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