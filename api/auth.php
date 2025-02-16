<?php
session_start();

include 'db_connect.php';

$login = $_POST['login'] ?? null;
$password = $_POST['password'] ?? null;
if (empty($login) || empty($password)) {
	echo json_encode(['status' => 'error', 'message' => 'No login or password']);
	exit;
}

$stmt = $pdo->prepare('SELECT s338859.auth(:login, :password)');
$stmt->execute(['login' => $login, 'password' => $password]);
$result = $stmt->fetchColumn();

$response = json_decode($result, true);

if ($response && isset($response['status']) && $response['status'] === 'success') {
	$_SESSION['token'] = $response['token'];
	$_SESSION['login'] = $login;
	$_SESSION['rooms'] = $response['rooms'];
	$_SESSION['role'] = $response['role'];
	
	echo json_encode([
		'status' => 'success',
		'info' => $response
	]);
} else {
	echo json_encode([
		'status' => 'error',
		'message' => $response['result_message'] ?? 'Неверный логин или пароль.'
	]);
}
?>