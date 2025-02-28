document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("resetForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const login = event.target["login"].value;
        const passwordOld = event.target["old_password"].value;
        const passwordNew = event.target["new_password"].value;
        
        if (passwordOld == passwordNew) {
            alert("Пароли совпадают!");
            return;
        }
        
        const response = await fetch("../api/reset_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `login=${encodeURIComponent(login)}&old_password=${encodeURIComponent(passwordOld)}&new_password=${encodeURIComponent(passwordNew)}`
        });
        
        const result = await response.json();
        
        if (result.status === "success") {
            alert("Пароль успешно изменен!");
            window.location.href = "rooms.php";
        } else {
            alert(result.message);
        }
    });
});