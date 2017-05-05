<?php
ob_start();
require_once 'create_db.php';

$delete = "DELETE FROM timetable WHERE id = :id";
$stmt = $db->prepare($delete);
$stmt->bindParam(':id', $_POST['id']);
$stmt->execute();
class Result

{
}

$response = new Result();
$response->result = 'OK';
$response->message = 'Delete successful';
header('Content-Type: application/json');
echo json_encode($response);
ob_end_flush();
?>