<?php
ob_start();
require_once 'create_db.php';

$stmt = $db->prepare('SELECT * FROM timetable WHERE NOT ((end <= :start) OR (start >= :end))');
$stmt->bindParam(':start', $_POST['start']);
$stmt->bindParam(':end', $_POST['end']);
$stmt->execute();
$result = $stmt->fetchAll();
class Event

{
}

$events = array();

foreach($result as $row) {
	$e = new Event();
	$e->id = $row['id'];
	$e->text = $row['name'];
	$e->start = $row['start'];
	$e->end = $row['end'];
	$e->availability = $row['availability'];
	$e->type = $row['type'];
	$events[] = $e;
}

header('Content-Type: application/json');
echo json_encode($events);
ob_end_flush();
?>