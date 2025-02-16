document.addEventListener("DOMContentLoaded", () => {
    const dialogs = document.querySelectorAll("dialog");
    const openButtons = document.querySelectorAll("[data-show-dialog]");
    const closeButtons = document.querySelectorAll(".close");
    
    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const dialogName = button.getAttribute("data-show-dialog");
            const dialog = document.querySelector(`[data-dialog-name="${dialogName}"]`);
            if (dialog) {
                dialog.showModal();
            }
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.target.closest("dialog").close();
        });
    });
    
    document.getElementById("loginForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("login", event.target["login-auth"].value);
        formData.append("password", event.target["password-auth"].value);
        console.log(formData);
        const response = await fetch("../api/auth.php", {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        
        if (result.status === "success") {
            window.location.href = "rooms.php";
        } else {
            alert(result.message);
        }
    });
    
    document.getElementById("registerForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("login", event.target["login"].value);
        formData.append("password", event.target["password"].value);
        const passwordAgain = event.target["password-again"].value;
        
        if (formData.get("password") !== passwordAgain) {
            alert("Пароли не совпадают");
            return;
        }
        
        const response = await fetch("../api/reg.php", {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        
        if (result.status === "success") {
            window.location.href = "rooms.php";
        } else {
            alert(result.message);
        }
    });
});
