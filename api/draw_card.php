<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$player = $_POST['player'] ?? null;
if (empty($player)) {
	echo json_encode(['status' => 'error', 'message' => 'Not enough info']);
	exit;
}

try {
    $stmt = $pdo->prepare('SELECT s338859.draw_card(:t, :player)');
    $stmt->execute(['t' => $_SESSION['token'], 'player' => $player ]);
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
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>