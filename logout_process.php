<?php
session_start();
unset($_SESSION['user_session']);
unset($_SESSION['user_email']);

if (session_destroy()) {
	header("Location: login.php");
}

?>
