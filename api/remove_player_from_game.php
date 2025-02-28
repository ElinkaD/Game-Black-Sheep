<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
    echo json_encode(['status' => 'error', 'message' => 'No token']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$room = isset($data['room']) ? $data['room'] : null;

if (empty($room)) {
    echo json_encode(['status' => 'error', 'message' => 'Write all the information']);
    exit;
}

$stmt = $pdo->prepare('SELECT s338859.remove_player_from_game(:t, :room)');
$stmt->execute(['t' => $_SESSION['token'], 'room' => $room]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
    $_SESSION['rooms'] = $response['available_rooms'];

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