<?php
session_start();
ob_start();
require_once 'create_db.php';

$studentid = $_SESSION['user_session'];
$stmt = $db->prepare('SELECT s.id, t.name, t.start, t.end, t.type FROM timetable t, student_booking s WHERE s.timetable_id = t.id AND student_id = :id');
$stmt->bindParam(':id', $studentid);
$stmt->execute();
$result = $stmt->fetchAll();
class Event

{
}

$events = array();

foreach($result as $row) {
	$e = new Event();
	$e->id = $row['id'];
	$e->name = $row['name'];
	$e->start = $row['start'];
	$e->end = $row['end'];
	$e->type = $row['type'];
	$events[] = $e;
}

header('Content-Type: application/json');
echo json_encode($events);
ob_end_flush();
?>