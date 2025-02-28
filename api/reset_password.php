<?php
session_start();

include 'db_connect.php';

if (!isset($_SESSION['token'])) {
	echo json_encode(['status' => 'error', 'message' => 'No token']);
	exit;
}

$login = trim($_POST['login'] ?? '');
$old_password = trim($_POST['old_password'] ?? '');
$new_password = trim($_POST['new_password'] ?? '');

if (empty($login) || empty($old_password) || empty($new_password)) {
	echo json_encode(['status' => 'error', 'message' => 'Не введен логин или пароль']);
	exit;
}

$stmt = $pdo->prepare('SELECT s338859.reset_password(:t, :login, :old_password, :new_password)');
$stmt->execute(['t' => $_SESSION['token'], 'login' => $login, 'old_password' => $old_password, 'new_password' => $new_password]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
	echo json_encode([
		'status' => 'success',
		'message' => $response['result_message'],
		'info' => $response
	]);
} else {
	echo json_encode([
		'status' => 'error',
		'message' => $response['result_message'] ?? 'Error'
	]);
}
?>