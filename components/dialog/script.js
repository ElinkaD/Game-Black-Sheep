document.addEventListener("DOMContentLoaded", () => {
    const openButtons = document.querySelectorAll("[data-show-dialog]");
    const closeButtons = document.querySelectorAll(".close");

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const dialogName = button.getAttribute("data-show-dialog");
            const dialog = document.querySelector(`[data-dialog-name="${dialogName}"]`);
            if (dialog) {
                dialog.showModal();
                document.body.classList.add("dialog-open");
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const dialog = button.closest("dialog");
            if (dialog) {
                dialog.close();
                document.body.classList.remove("dialog-open");
            }
        });
    });

    // const body = document.querySelector('body');
    // body.addEventListener('click', (event) => {
    //     if (event.target === body && document.body.classList.contains('dialog-open')) {
    //         const openDialog = document.querySelector("dialog[open]");
    //         if (openDialog) {
    //             openDialog.close();
    //             document.body.classList.remove("dialog-open");
    //         }
    //     }
    // });
});
