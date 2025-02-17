<form id="registerForm" method="POST">
    <h2>Регистрация</h2>
    <div class='forms'>
        <div class="form-group">
            <input name="login" type="text" placeholder=" " required>
            <label for="login">
                Введите логин
            </label>
        </div>
        <div class="form-group">
            <input name="password" type="password"  placeholder=" " required>
            <label for="password">
                Введите пароль
            </label>
        </div>
        <div class="form-group">
            <input name="password-again" type="password" placeholder=" " required>
            <label for="password-again">
                Повторите пароль
            </label>
        </div>
    </div>
    <button type="submit">Зарегистрироваться</button>
</form>

<script type="module" src="..\components\dialog\templates\reg\script.js"></script>