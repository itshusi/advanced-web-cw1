<?php
ob_start();
require_once 'connection.php';

try {
    $db->exec("CREATE TABLE IF NOT EXISTS timetable (
                        id VARCHAR(100) NOT NULL PRIMARY KEY,
                        name TEXT NOT NULL,
                        start DATETIME NOT NULL,
                        end DATETIME NOT NULL,
                        resource VARCHAR(30),
                        availability INTEGER NOT NULL,
                        type VARCHAR(100) NOT NULL)");

    $db->exec("CREATE TABLE IF NOT EXISTS students (
                        id INTEGER NOT NULL AUTO_INCREMENT,
                        surname VARCHAR(100) NOT NULL,
                        forename VARCHAR(100) NOT NULL,
                        phone VARCHAR(30) NOT NULL,
                        address VARCHAR(300) NOT NULL,
                        PRIMARY KEY(id))");

    $db->exec("CREATE TABLE IF NOT EXISTS student_login (
                        login_id INTEGER NOT NULL AUTO_INCREMENT,
                        user_name VARCHAR(25) NOT NULL,
                        user_email VARCHAR(60) NOT NULL,
                        user_password VARCHAR(255) NOT NULL,
                        joining_date datetime NOT NULL,
                        user_id INTEGER,
                        PRIMARY KEY (login_id),
                        FOREIGN KEY (user_id) REFERENCES students(id))");
    
    $db->exec("CREATE TABLE IF NOT EXISTS student_booking (
                        id INTEGER NOT NULL AUTO_INCREMENT,
                        timetable_id VARCHAR(100) NOT NULL,
                        student_id INTEGER NOT NULL,
                        PRIMARY KEY (id),
                        FOREIGN KEY (timetable_id) REFERENCES timetable(id),
                        FOREIGN KEY (student_id) REFERENCES students(id))");
}

catch(PDOException $e) {
    echo $e->getMessage();
}

ob_end_flush();
?>