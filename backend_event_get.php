<?php
ob_start();
require_once 'create_db.php';

$stmt = $db->prepare('SELECT * FROM timetable WHERE id = :id');
$stmt->bindParam(':id', $_POST['id']);
$stmt->execute();
$result = $stmt->fetchAll();
class Event

{
}

$events = array();

foreach($result as $row) {
	$e = new Event();
	$e->availability = $row['availability'];
	$e->type = $row['type'];
}

header('Content-Type: application/json');
echo json_encode($e);
ob_end_flush();
?>