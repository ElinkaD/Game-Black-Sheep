<?php
function render_dialog($dialog_name, $form_content, $show_close_button = true) {
?>
<dialog data-dialog-name="<?php echo $dialog_name; ?>">
    <?php if ($show_close_button) : ?>
        <button class="close">X</button>
    <?php endif; ?>
    <div class="dialog-content">
        <?php echo $form_content; ?>
    </div>
</dialog>

<link rel="stylesheet" href="../components/dialog/style.css">
<script type="module" src="../components/dialog/script.js"></script>
<?php
}
?>
