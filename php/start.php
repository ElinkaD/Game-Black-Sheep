<!DOCTYPE html>
<html>
<head>
    <title>Игра Черная овечка</title>
    <link rel="stylesheet" href="../css/start.css">
    <style>
        @font-face {
            font-family: 'RussianRail G Pro';
            src: url('../fonts/RussianRail G Pro Regular_0.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'Groboldov';
            src: url('../fonts/Groboldov.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
        }
    </style> 
</head>
<body>
	<button data-show-dialog="rules-dialog" class="rules-button"></button>

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
        render_dialog('auth-dialog', $authForm, true);

        $regForm = file_get_contents('../components/dialog/templates/reg/template.php');
        render_dialog('register-dialog', $regForm, true);

        $rules = file_get_contents('../components/dialog/templates/rules/template.php');
        render_dialog('rules-dialog', $rules, true);

        $zaglushka = file_get_contents('../components/dialog/templates/zaglushka/template.php');
        render_dialog('zaglushka-dialog', $zaglushka, false);
        ?>
    </main>
</body>
</html>
