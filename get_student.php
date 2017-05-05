<?php
session_start();
ob_start();
require_once 'create_db.php';

$user_id = $_SESSION['user_session'];
$stmt = $db->prepare('SELECT * FROM students WHERE id = :id');
$stmt->bindParam(':id', $user_id);
$stmt->execute();
$result = $stmt->fetchAll();
class Event

{
}

foreach($result as $row) {
	$e = new Event();
	$e->id = $row['id'];
	$e->phone = $row['phone'];
	$e->address = $row['address'];
	$e->forename = $row['forename'];
	$e->surname = $row['surname'];
}

$stmt = $db->prepare('SELECT * FROM student_login WHERE user_id = :id');
$stmt->bindParam(':id', $user_id);
$stmt->execute();
$result = $stmt->fetchAll();

foreach($result as $row) {
	$e->email = $row['user_email'];
}

header('Content-Type: application/json');
echo json_encode($e);
ob_end_flush();
?>