<?php

if ($_POST) {
    $errors = "";
    $surname = $_POST['user_surname'];
    $forename = $_POST['user_forename'];
    $phone = $_POST['user_phone'];
    $address = $_POST['user_address'];
    $user_name = $_POST['user_email'];
    $user_email = $_POST['user_email'];
    $user_password = md5($_POST['password']);
    $password = $_POST['password'];
    $cpassword = $_POST['cpassword'];
    $joining_date = date('Y-m-d H:i:s');
    if (empty($_POST["user_forename"])) {
        $errors.= "Forename is required ";
    }
    else {

        // check if name only contains letters and whitespace

        if (!preg_match("/^[a-zA-Z ]*$/", $forename)) {
            $errors.= "Only letters and white space allowed in Forename ";
        }
    }

    if (empty($_POST["user_surname"])) {
        $errors.= "Surname is required ";
    }
    else {

        // check if name only contains letters and whitespace

        if (!preg_match("/^[a-zA-Z ]*$/", $surname)) {
            $errors.= "Only letters and white space allowed in Surname ";
        }
    }

    if (empty($_POST["user_email"])) {
        $errors.= "Email is required ";
    }
    else {
        $email = $_POST["user_email"];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors.= "Invalid email format ";
        }
    }

    if (empty($_POST["password"])) {
        $errors.= "Password is required ";
    }
    else {
        if (!preg_match("/(?=.*\d)(?=.*[A-Z])(?=.*\W)./",$password)) {
            $errors.= "Your password must contain at least one lowercase character, one uppercase character, one digit and one symbol character ";
        }
    }

    if (empty($_POST["user_phone"])) {
        $errors.= "Phone Number is required ";
    }
    else {
        if (!preg_match("/^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/", $phone)) {
            $errors.= "Please enter a valid UK phone number. It may be in UK or international format.";
        }
    }

    if (empty($_POST["user_address"])) {
        $errors.= "Address is required";
    }

    if (empty($_POST["cpassword"])) {
        $errors.= "Confirm Password is required ";
    }
    else
    if ($password != $cpassword) {
        $errors.= "Your password confirmation does not match ";
    }

    if ($errors == "" || $errors == null) {
        addStudent($user_email, $user_name, $user_password, $phone, $address, $joining_date, $forename, $surname);
    }

    echo $errors;
}

function addStudent($user_email, $user_name, $user_password, $phone, $address, $joining_date, $forename, $surname)
{
    require_once 'create_db.php';

    try {
        $stmt = $db->prepare("SELECT MAX(id)+1 AS max FROM STUDENTS");
        $stmt->execute();
        $user_id = $stmt->fetch(PDO::FETCH_OBJ)->max;
        if ($user_id < 100) {
            $user_id = 100;
        }

        $stmt = $db->prepare("SELECT * FROM student_login WHERE user_email=:email");
        $stmt->execute(array(
            ":email" => $user_email
        ));
        $count = $stmt->rowCount();
        if ($count == 0) {
            $stmt = $db->prepare("INSERT INTO students(id,surname,forename,phone,address) VALUES(:id, :surname, :forename, :phone, :address)");
            $stmt->bindParam(":id", $user_id);
            $stmt->bindParam(":surname", $surname);
            $stmt->bindParam(":forename", $forename);
            $stmt->bindParam(":phone", $phone);
            $stmt->bindParam(":address", $address);
            if ($stmt->execute()) {
                echo "added";
            }
            else {
                echo "Query could not execute!";
            }

            $stmt = $db->prepare("INSERT INTO student_login(user_name,user_email,user_password,joining_date, user_id) VALUES(:uname, :email, :pass, :jdate, :uid)");
            $stmt->bindParam(":uname", $user_name);
            $stmt->bindParam(":email", $user_email);
            $stmt->bindParam(":pass", $user_password);
            $stmt->bindParam(":jdate", $joining_date);
            $stmt->bindParam(":uid", $user_id);
            if ($stmt->execute()) {
                echo "registered";
            }
            else {
                echo "Query could not execute!";
            }
        }
        else {
            echo "1"; //  not available
        }
    }

    catch(PDOException $e) {
        echo $e->getMessage();
    }
}

?>