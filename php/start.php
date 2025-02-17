<!DOCTYPE html>
<html>	
	<main class="start">
		<h1>Чёрная овечка</h1>
		<p>онлайн настольная игра</p>
		<div>
			<button data-show-dialog="auth-dialog">войти</button>
			<button data-show-dialog="register-dialog">регистрация</button>
			<button data-show-dialog="rules-dialog">правила</button>
		</div>

		<?php
		include '../components/dialog/component.php';

		$authForm = file_get_contents('../components/dialog/templates/auth/template.php');
		render_dialog('auth-dialog', $authForm);

		$regForm = file_get_contents('../components/dialog/templates/reg/template.php');
		render_dialog('register-dialog', $regForm);

		$rules = file_get_contents('../components/dialog/templates/rules/template.php');
		render_dialog('rules-dialog', $rules);
		?>
	</main>
	<!-- <script type="module" src="../js/start.js"></script> -->
</html>