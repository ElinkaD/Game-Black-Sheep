<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
    echo json_encode(['status' => 'error', 'message' => 'No token']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT s338859.delete_empty_rooms(:t)');
    $stmt->execute(['t' => $_SESSION['token']]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'SQL Error: ' . $e->getMessage()]);
    exit;
}

if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'No result from function']);
    exit;
}

$response = json_decode($result['delete_empty_rooms'], true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
    echo json_encode([
        'status' => 'success',
        'message' => $response['result_message'] ?? 'Rooms deleted'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => $response['result_message'] ?? 'Error'
    ]);
}
?>