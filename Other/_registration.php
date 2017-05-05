<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HTML5 Event Calendar</title>
    <!--calender stylesheet -->

    <link type="text/css" rel="stylesheet" href="css/bootstrap/bootstrap.css" />
    <link type="text/css" rel="stylesheet" href="css/bootstrap/bootstrap-theme.min.css" />
    <link type="text/css" rel="stylesheet" href="css/jquery-ui.css" />
    <link type="text/css" rel="stylesheet" href="css/jquery-ui-timepicker-addon.css" />
    <link type="text/css" rel="stylesheet" href="media/layout.css" />
    <link type="text/css" rel="stylesheet" href="css/calendar_transparent.css" />
    <link type="text/css" rel="stylesheet" href="css/custom.css" />

    <script type="text/javascript" src="js/jquery-1.12.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <script type="text/javascript" src="js/jquery-ui-timepicker-addon.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js"></script>
    <script type="text/javascript" src="js/moment.js"></script>
    <!-- daypilot libraries -->
    <script src="js/daypilot/daypilot-pro.min.js" type="text/javascript"></script>
    <script type="text/javascript">
$('document').ready(function()
{ 
     /* validation */
  $("#register-form").validate({
      rules:
   {
   user_name: {
      required: true,
   minlength: 3
   },
   password: {
   required: true,
   minlength: 8,
   maxlength: 15
   },
   cpassword: {
   required: true,
   equalTo: '#password'
   },
   user_email: {
            required: true,
            email: true
            },
    },
       messages:
    {
            user_name: "please enter user name",
            password:{
                      required: "please provide a password",
                      minlength: "password at least have 8 characters"
                     },
            user_email: "please enter a valid email address",
   cpassword:{
      required: "please retype your password",
      equalTo: "password doesn't match !"
       }
       },
    submitHandler: submitForm 
       });  
    /* validation */
    
    /* form submit */
    function submitForm()
    {  
    var data = $("#register-form").serialize();
    
    $.ajax({
    
    type : 'POST',
    url  : 'register.php',
    data : data,
    beforeSend: function()
    { 
     $("#error").fadeOut();
     $("#btn-submit").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; sending ...');
    },
    success :  function(data)
         {      
        if(data==1){
         
         $("#error").fadeIn(1000, function(){
           
           
           $("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Sorry email already taken!</div>');
           
           $("#btn-submit").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Create Account');
          
         });
                    
        }
        else if(data=="addedregistered")
        {
         
         $("#btn-submit").html('<img src="css/images/btn-ajax-loader.gif" /> &nbsp; Signing Up ...');
         setTimeout('$(".form-signin").fadeOut(500, function(){ $(".signin-form").load("Socrates-Socratesview.php"); }); ',5000);
         
        }
        else{
          
         $("#error").fadeIn(1000, function(){
           
      $("#error").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+data+'!</div>');
           
         $("#btn-submit").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Create Account');
          
         });
           
        }
         }
    });
    return false;
  }
    /* form submit */ 

});
    </script>
</head>

<body>
    <div id="header">
        <div class="bg-help">
            <div class="inBox">
                <h1 id="logo">Example</h1>
                <p id="claim">Etc</p>
                <hr class="hidden" />
            </div>
        </div>
    </div>
    <div class="shadow"></div>
    <div class="hideSkipLink">
    </div>
    <div class="main">
 <form class="form-signin" method="post" id="register-form">
      
        <h2 class="form-signin-heading">Sign Up</h2><hr />
        
        <div id="error">
        <!-- error will be shown here ! -->
        </div>
        
        <div class="form-group">
        <input type="text" class="form-control" placeholder="Forename" name="user_forename" id="user_forename" />
        </div>

        <div class="form-group">
        <input type="text" class="form-control" placeholder="Surname" name="user_surname" id="user_surname" />
        </div>

        <div class="form-group">
        <input type="text" class="form-control" placeholder="Phone Number" name="user_phone" id="user_phone" />
        </div>

        <div class="form-group">
        <textarea rows="4" class="form-control" placeholder="Address" name="user_address" id="user_address"></textarea>
        </div>

      <div class="form-group">
        <input type="text" class="form-control" placeholder="Username" name="user_name" id="user_name" />
        </div>
        
        <div class="form-group">
        <input type="email" class="form-control" placeholder="Email address" name="user_email" id="user_email" />
        <span id="check-e"></span>
        </div>
        
        <div class="form-group">
        <input type="password" class="form-control" placeholder="Password" name="password" id="password" />
        </div>
        
        <div class="form-group">
        <input type="password" class="form-control" placeholder="Retype Password" name="cpassword" id="cpassword" />
        </div>
      <hr />
        
        <div class="form-group">
            <button type="submit" class="btn btn-default" name="btn-save" id="btn-submit">
      <span class="glyphicon glyphicon-log-in"></span> &nbsp; Create Account
   </button> 
        </div>  
      
 </form>

    </div>
    <div class="clear">
    </div>


</body>

</html>