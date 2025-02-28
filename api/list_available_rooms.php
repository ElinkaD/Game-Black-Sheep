<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
    echo json_encode(['status' => 'error', 'message' => 'No token']);
    exit;
}

$token = $_SESSION['token'];

$stmt = $pdo->prepare('SELECT s338859.list_available_rooms(:t)');
$stmt->execute(['t' => $token]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
    echo json_encode([
        'status' => 'success',
        'info' => $response['rooms'],
        'message' => $response['result_message']
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => $response['result_message'] ?? 'Error'
    ]);
}
?>
