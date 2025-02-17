document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const login = event.target["login-auth"].value;
        const password = event.target["password-auth"].value;

        const response = await fetch("../api/auth.php", {
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
