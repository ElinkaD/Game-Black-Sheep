<?php
session_start();

include 'db_connect.php';

$login = trim($_POST['login'] ?? '');
$password = trim($_POST['password'] ?? '');

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
	$_SESSION['login'] = $login;
	$_SESSION['role'] = $response['role'];

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