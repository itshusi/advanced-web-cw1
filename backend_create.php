<?php
ob_start();
require_once 'create_db.php';

$insert = "INSERT INTO timetable (id, name, start, end, availability, type) VALUES (:id, :name, :start, :end, :availability, :type)";
$stmt = $db->prepare($insert);
$stmt->bindParam(':id', $_POST['id']);
$stmt->bindParam(':start', $_POST['start']);
$stmt->bindParam(':end', $_POST['end']);
$stmt->bindParam(':name', $_POST['name']);
$stmt->bindParam(':availability', $_POST['availability']);
$stmt->bindParam(':type', $_POST['type']);
$stmt->execute();
class Result

{
}

$response = new Result();
$response->result = 'OK';
$response->message = 'Created with id: ' . $db->lastInsertId();
header('Content-Type: application/json');
echo json_encode($response);
ob_end_flush();
?>