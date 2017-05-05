<?php
session_start();
ob_start();

if ($_POST) {
    $errors = "";
    $user_id = $_SESSION['user_session'];
    $user_email_sess = $_SESSION['user_email'];
    $phone = $_POST['user_phone'];
    $address = $_POST['user_address'];
    $user_email = $_POST['user_email'];
    $user_password = md5($_POST['password']);
    $password = $_POST['password'];
    $cpassword = $_POST['cpassword'];
    if (empty($_POST["user_email"])) {
        $errors.= "Email is required ";
    }
    else {
        $email = $_POST["user_email"];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors.= "Invalid email format ";
        }
    }

    if (!empty($_POST["password"])) {
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

    if (!empty($_POST["password"]) && empty($_POST["cpassword"])) {
        $errors.= "Confirm Password is required ";
    }
    else
    if ($password != $cpassword) {
        $errors.= "Your password confirmation does not match ";
    }

    if ($errors == "" || $errors == null) {
        updateDatabase($user_email, $user_id, $user_password, $phone, $address, $user_email_sess);
    }

    echo $errors;
}

function updateDatabase($user_email, $user_id, $user_password, $phone, $address, $user_email_sess)
{
    require_once 'create_db.php';

    try {
        $stmt = $db->prepare("SELECT * FROM student_login WHERE user_email=:email");
        $stmt->execute(array(
            ":email" => $user_email
        ));
        $count = $stmt->rowCount();
        if ($count == 0 || $user_email == $user_email_sess) {
            $stmt = $db->prepare("UPDATE students SET phone = COALESCE(:phone, phone), address = COALESCE(:address,address) WHERE id = :id");
            $stmt->bindParam(":id", $user_id);
            $stmt->bindParam(":phone", $phone);
            $stmt->bindParam(":address", $address);
            if ($stmt->execute()) {
                echo "updated";
            }
            else {
                echo "Query could not execute!";
            }

            $stmt = $db->prepare("UPDATE student_login SET user_email = COALESCE(:email, user_email), user_name = COALESCE(:uname, user_name), user_password = COALESCE(:pass, user_password)  WHERE user_id = :uid");
            $stmt->bindParam(":uname", $user_email);
            $stmt->bindParam(":email", $user_email);
            $stmt->bindParam(":pass", $user_password);
            $stmt->bindParam(":uid", $user_id);
            if ($stmt->execute()) {
                echo "amended";
                $_SESSION['user_email'] = $user_email;
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

ob_end_flush();
?>
