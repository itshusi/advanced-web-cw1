<?php
ob_start();
require_once 'create_db.php';

if (!isset($_SESSION)) {
	session_start();
}

$studentID = $_SESSION['user_session'];
$insert = "INSERT INTO student_booking (timetable_id, student_id) VALUES (:timetable_id, :student_id)";
$stmt = $db->prepare($insert);
$stmt->bindParam(':timetable_id', $_POST['timetable_id']);
$stmt->bindParam(':student_id', $studentID);
$stmt->execute();
class Result

{
}

$response = new Result();
$response->result = 'OK';
$response->message = 'Created with id: ' . $db->lastInsertId();
$insert = "UPDATE timetable SET availability = :availability WHERE id = :id";
$stmt = $db->prepare($insert);
$stmt->bindParam(':availability', $_POST['availability']);
$stmt->bindParam(':id', $_POST['timetable_id']);
$stmt->execute();
class Result1

{
}

$response = new Result1();
$response->result = 'OK';
$response->message = 'Update successful';
header('Content-Type: application/json');
echo json_encode($response);
ob_end_flush();
?>