document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const login = event.target["login"].value;
        const password = event.target["password"].value;
        const passwordAgain = event.target["password-again"].value;
        
        if (password !== passwordAgain) {
            alert("Пароли не совпадают");
            return;
        }
        
        const response = await fetch("../api/reg.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`
        });
        
        const result = await response.json();
        
        if (result.status === "success") {
            window.location.href = "rooms.php";
        } else {
            alert(result.message);
        }
    });
});