<form id="loginForm" method="POST">
    <h2>Вход</h2>
    <div class="form-group">
        <input name="login-auth" type="text" placeholder=" " required>
        <label for="login-auth">
            Введите логин
        </label>
    </div>
    <div class="form-group">
        <input name="password-auth" type="password" placeholder=" " required>
        <label for="password-auth">
            Введите пароль
        </label>
    </div>
    <button type="submit">Войти</button>
</form>

<script type="module" src="..\components\dialog\templates\auth\script.js"></script>