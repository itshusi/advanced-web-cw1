<?php
ob_start();
require_once 'create_db.php';

$stmt = $db->prepare('SELECT * FROM student_booking WHERE timetable_id = :id');
$stmt->bindParam(':id', $_POST['id']);
$stmt->execute();
$result = $stmt->fetchAll();
class Event

{
}

$events = array();

foreach($result as $row) {
	$e = new Event();
	$e->id = $row['id'];
	$e->timetableid = $row['timetable_id'];
	$e->studentid = $row['student_id'];
	$events[] = $e;
}

header('Content-Type: application/json');
echo json_encode($events);
ob_end_flush();
?>