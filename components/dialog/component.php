<?php
function render_dialog($dialog_name, $form_content) {
?>

<dialog data-dialog-name="<?php echo $dialog_name; ?>">
    <button class="close">X</button>
    <div class="dialog-content">
        <?php echo $form_content; ?>
    </div>
</dialog>

<link rel="stylesheet" href="../components/dialog/style.css">
<script type="module" src="../components/dialog/script.js"></script>

<?php
}
?>
