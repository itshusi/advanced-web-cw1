<?php
ob_start();
session_start();
$userEmail = $_SESSION['user_email'];
echo $userEmail;
ob_end_flush();
?>