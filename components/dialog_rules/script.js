document.addEventListener("DOMContentLoaded", () => {
    const openButtons = document.querySelectorAll("[data-show-dialog]");
    const closeButtons = document.querySelectorAll(".close");

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const dialogName = button.getAttribute("data-show-dialog");
            const dialog = document.querySelector(`[data-dialog-name="${dialogName}"]`);
            if (dialog) {
                dialog.showModal();
                loadRules();
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.target.closest("dialog").close();
        });
    });

    function loadRules() {
        fetch('rules_game_text.php') 
            .then(response => response.text())
            .then(html => {
                document.getElementById('rules-content').innerHTML = html;
            })
            .catch(error => {
                console.error("Ошибка при загрузке правил:", error);
                document.getElementById('rules-content').innerHTML = '<p>Не удалось загрузить правила.</p>';
            });
    }
});
