<?php
session_start();

include 'db_connect.php';

$login = $_POST['login'] ?? null;
$password = $_POST['password'] ?? null;

if (empty($login) || empty($password)) {
	echo json_encode(['status' => 'error', 'message' => 'Не введен логин или пароль']);
	exit;
}

$stmt = $pdo->prepare('SELECT s338859.reg(:login, :password)');
$stmt->execute(['login' => $login, 'password' => $password]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
	$_SESSION['token'] = $response['token'];
	$_SESSION['rooms'] = $response['rooms'];

	echo json_encode([
		'status' => 'success',
		'info' => $response
	]);
} else {
	echo json_encode([
		'status' => 'error',
		'message' => $response['result_message'] ?? 'Error'
	]);
}
?>