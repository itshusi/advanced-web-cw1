<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title> Socrates | Student Login </title>

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
        $('document').ready(function() {
            /* validation */
            $("#login-form").validate({
                rules: {
                    password: {
                        required: true,
                    },
                    user_email: {
                        required: true,
                        email: true
                    },
                },
                messages: {
                    password: {
                        required: "Please enter your password"
                    },
                    user_email: "Please enter your email address",
                },
                submitHandler: submitForm
            });
            /* validation */

            /* login submit */
            function submitForm() {
                var data = $("#login-form").serialize();

                $.ajax({

                    type: 'POST',
                    url: 'login_process.php',
                    data: data,
                    beforeSend: function() {
                        $("#error").fadeOut();
                        $("#btn-login").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Sending ...');
                    },
                    success: function(response) {
                        if (response == "ok") {

                            $("#btn-login").html('<img src="css/images/btn-ajax-loader.gif" /> &nbsp; Signing In ...');
                            setTimeout(' window.location.href = "Socrates-studentview/index.php"; ', 4000);
                        } else {

                            $("#error").fadeIn(1000, function() {
                                $("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; ' + response + '!</div>');
                                $("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
                            });
                        }
                    }
                });
                return false;
            }
            /* login submit */
        });
    </script>
</head>

<body>

    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Socrates Appointment System</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-log-in"></span>Login<span class="sr-only">(current)</span></a>
                    </li>


                </ul>

            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </nav>

    <div class="main">
        <div class="signin-form">

            <div class="container">


                <form class="form-signin" method="post" id="login-form">

                    <h2 class="form-signin-heading">Log In to Socrates Appointment System.</h2>
                    <hr />

                    <div id="error">
                        <!-- error will be shown here ! -->
                    </div>

                    <div class="form-group">
                        <input type="email" class="form-control" placeholder="Email address" name="user_email" id="user_email" />
                        <span id="check-e"></span>
                    </div>

                    <div class="form-group">
                        <input type="password" class="form-control" placeholder="Password" name="password" id="password" />
                    </div>

                    <hr />

                    <div class="form-group">
                        <button type="submit" class="btn btn-default" name="btn-login" id="btn-login">
      <span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In
   </button>
                    </div>

                </form>

            </div>

        </div>

    </div>
    <div class="clear">
    </div>


</body>

</html>