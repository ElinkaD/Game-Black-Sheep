
<?php
session_start(); 
session_unset();
session_destroy();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/'); 
}

echo json_encode(['status' => 'success', 'message' => 'Вы успешно вышли из игры.']);
?>
