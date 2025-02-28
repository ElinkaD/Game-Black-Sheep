<!DOCTYPE html>
<html>
<head>
    <title>Игра Черная овечка</title>
    <link rel="stylesheet" href="../css/start.css">
</head>
<body>
	<button data-show-dialog="rules-dialog" class="rules-button">правила</button>

    <main class="start">
        <h1>Чёрная овечка</h1>
        <p>онлайн настольная игра</p>
        <div>
            <button data-show-dialog="auth-dialog">Войти</button>
            <button data-show-dialog="register-dialog">Регистрация</button>
        </div>

        <?php
        include '../components/dialog/component.php';

        $authForm = file_get_contents('../components/dialog/templates/auth/template.php');
        render_dialog('auth-dialog', $authForm);

        $regForm = file_get_contents('../components/dialog/templates/reg/template.php');
        render_dialog('register-dialog', $regForm);

        $rules = file_get_contents('../components/dialog/templates/rules/template.php');
        render_dialog('rules-dialog', $rules);
        ?>
    </main>
</body>
</html>
