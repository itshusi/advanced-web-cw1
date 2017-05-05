<?php
ob_start();
require_once 'create_db.php';

$insert = "UPDATE timetable SET start = :start, end = :end WHERE id = :id";
$stmt = $db->prepare($insert);
$stmt->bindParam(':start', $_POST['newStart']);
$stmt->bindParam(':end', $_POST['newEnd']);
$stmt->bindParam(':id', $_POST['id']);
$stmt->execute();
class Result

{
}

$response = new Result();
$response->result = 'OK';
$response->message = 'Update successful';
header('Content-Type: application/json');
echo json_encode($response);
ob_end_flush();
?>