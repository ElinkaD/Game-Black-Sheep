<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
    echo json_encode(['status' => 'error', 'message' => 'No token']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$room_id = isset($data['room_id']) ? $data['room_id'] : null;

if (!$room_id) {
    echo json_encode(['status' => 'error', 'message' => 'Room ID is required']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT s338859.delete_game_room(:t, :room_id)');
    $stmt->execute(['t' => $_SESSION['token'], 'room_id' => $room_id]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        echo json_encode(['status' => 'error', 'message' => 'No result from function']);
        exit;
    }

    if (!isset($result['delete_game_room'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid function response']);
        exit;
    }

    $response = json_decode($result['delete_game_room'], true);

    if ($response && isset($response['status']) && $response['status'] === 'success') {
        echo json_encode([
            'status' => 'success',
            'message' => $response['result_message'] ?? 'Room deleted'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => $response['result_message'] ?? 'Error deleting room'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'SQL Error: ' . $e->getMessage()]);
    exit;
}
?>
