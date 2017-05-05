<?php

 require_once 'create_db.php';

 if($_POST)
 {
  $surname = $_POST['user_surname'];
  $forename = $_POST['user_forename'];
  $phone = $_POST['user_phone'];
  $address = $_POST['user_address'];
  $user_name = $_POST['user_name'];
  $user_email = $_POST['user_email'];
  $user_password = $_POST['password'];
  $joining_date =date('Y-m-d H:i:s');

  
  try
  { 
   $user_id = ($db->lastInsertId('students')+1);
   $stmt = $db>prepare("SELECT * FROM student_login WHERE user_email=:email");
   $stmt->execute(array(":email"=>$user_email));
   $count = $stmt->rowCount();
   
   if($count==0){
   $stmt = $db->prepare("INSERT INTO students(id,surname,forename,phone,address) VALUES(:id, :surname, :forename, :phone, :address)");
   $stmt->bindParam(":id",$user_id);
   $stmt->bindParam(":surname",$surname);
   $stmt->bindParam(":forename",$forename);
   $stmt->bindParam(":phone",$phone);
   $stmt->bindParam(":address",$address);
    if($stmt->execute())
    {
     echo "student added";
    }
    else
    {
     echo "Query could not execute !";
    }
   $stmt = $db->prepare("INSERT INTO student_login(user_name,user_email,user_password,joining_date, user_id) VALUES(:uname, :email, :pass, :jdate, :uid)");
   $stmt->bindParam(":uname",$user_name);
   $stmt->bindParam(":email",$user_email);
   $stmt->bindParam(":pass",$user_password);
   $stmt->bindParam(":jdate",$joining_date);
   $stmt->bindParam(":uid",$user_id);
   
    if($stmt->execute())
    {
     echo "student registered";
    }
    else
    {
     echo "Query could not execute !";
    }
   
   }
   else{
    
    echo "1"; //  not available
   }
    
  }
  catch(PDOException $e){
       echo $e->getMessage();
  }
 }

?>