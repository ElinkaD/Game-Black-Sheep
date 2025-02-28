<form id="resetForm" method="POST">
    <h2>Сменить пароль</h2>
        <div class="form-group">
            <input name="login" type="text" placeholder=" " required>
            <label for="login">
                Введите логин
            </label>
        </div>
        <div class="form-group">
            <input name="old_password" type="password"  placeholder=" " required>
            <label for="old_password">
                Введите старый пароль
            </label>
        </div>
        <div class="form-group">
            <input name="new_password" type="password" placeholder=" " required>
            <label for="new_password">
                Введите новый пароль
            </label>
        </div>
    <button type="submit">Сброс пароля</button>
</form>

<script type="module" src="..\components\dialog\templates\pass_reset\script.js"></script>