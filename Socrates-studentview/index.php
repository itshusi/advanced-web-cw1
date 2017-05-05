<?php
session_start();

if(!isset($_SESSION['user_session']))
{
 header("Location: ../login.php");
}

include_once '../create_db.php';

$stmt = $db->prepare("SELECT * FROM student_login WHERE user_id=:uid");
$stmt->execute(array(":uid"=>$_SESSION['user_session']));
$row=$stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title> Socrates | Student View </title>
    <!--calender stylesheet -->

    <link type="text/css" rel="stylesheet" href="../css/bootstrap/bootstrap.css" />
    <link type="text/css" rel="stylesheet" href="../css/bootstrap/bootstrap-theme.min.css" />
    <link type="text/css" rel="stylesheet" href="../css/jquery-ui.css" />
    <link type="text/css" rel="stylesheet" href="../css/jquery-ui-timepicker-addon.css" />
    <link type="text/css" rel="stylesheet" href="../css/datatables.min.css" />
    <link type="text/css" rel="stylesheet" href="../media/layout.css" />
    <link type="text/css" rel="stylesheet" href="../css/calendar_transparent.css" />
    <link type="text/css" rel="stylesheet" href="../css/custom.css" />

    <script type="text/javascript" src="../js/jquery-1.12.js"></script>
    <script type="text/javascript" src="../js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/jquery-ui.js"></script>
    <script type="text/javascript" src="../js/jquery-ui-timepicker-addon.js"></script>
    <script type="text/javascript" src="../js/datatables.min.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js"></script>
    <script type="text/javascript" src="../js/moment.js"></script>
    <!-- daypilot libraries -->
    <script src="../js/daypilot/daypilot-pro.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="../js/socrates.js"></script>
    <script>
        showBookedEvents();
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
                    <li class="active"><a href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-home"></span>Home<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span style="margin-right: 0.5em" class="glyphicon glyphicon-education"></span>Student Area<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#" onclick="updateStudentModal()"><span style="margin-right: 0.5em" class="glyphicon glyphicon-search"></span>View and Edit My Details</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span style="margin-right: 0.5em" class="glyphicon glyphicon-calendar"></span>My Bookings<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#" id="make-booking"><span style="margin-right: 0.5em" class="glyphicon glyphicon-plus"></span>Make a Booking</a>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#" onclick="showBookedEvents()"><span style="margin-right: 0.5em" class="glyphicon glyphicon-search"></span>View My Bookings</a>
                            </li>
                        </ul>
                    </li>

                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="../logout_process.php"><span style="margin-right: 0.5em" class="glyphicon glyphicon-log-out"></span>Logout</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </nav>
    <div class="main">
        <div id="dialog" title="Booking Info">
            <p>To make a booking please close this dialog with the 'x' icon and click on the session that you would like to book in the calendar.
                <p></p>If an event has no free slots you will be unable to book the session.</p>
        </div>
                <div id="session-full-dialog" title="Booking Info">
            <p>Sorry, but the session you have selected is full. Please select another session.</p>
        </div>
        <div style="float:left; width: 160px;">
            <div id="nav"></div>
        </div>
        <div style="margin-left: 160px;">
            <div id="dp"></div>

            <!-- Modal -->
            <div id="eventModal" class="modal fade" role="dialog" data-backdrop="false">
                <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content" id="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title"></h4>
                        </div>
                        <div class="modal-body">
                            <div id="modal-form"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>


        </div>

        <script type="text/javascript">
            $(document).ready(function() {

                $('#dialog').dialog({
                    autoOpen: false
                });
                $('#session-full-dialog').dialog({
                    autoOpen: false
                });
                $('#make-booking').click(function() {
                    $('#dialog').dialog('open');
                });

            });
            var modalForm = document.getElementById('modal-form').innerHTML += '';

            var nav = new DayPilot.Navigator("nav");
            nav.startDate = new DayPilot.Date("2017-05-01T00:00:00");
            nav.weekStarts = 0;
            nav.showMonths = 1;
            nav.skipMonths = 1;
            nav.selectMode = "week";
            nav.onTimeRangeSelected = function(args) {
                dp.startDate = args.day;
                dp.update();
                loadEvents();
            };
            nav.init();

            var dp = new DayPilot.Calendar("dp");
            dp.bubble = new DayPilot.Bubble();
            dp.locale = "en-gb";
            dp.cssClassPrefix = "calendar_transparent"
            dp.startDate = new DayPilot.Date("2017-05-07T00:00:00");
            dp.viewType = "Week";
            dp.weekStarts = 0;
            dp.cellDuration = 10;
            dp.eventDeleteHandling = "Disabled";
            dp.eventMoveHandling = "Disabled";
            dp.eventResizeHandling = "Disabled";
            dp.timeRangeSelectedHandling = "Disabled";
            dp.timeRangeDoubleClickHandling = "Disabled";
            dp.timeRangeRightClickHandling = "Disabled";
            dp.onGridMouseDown = function(args) {
                var button = DayPilot.Util.mouseButton(args.originalEvent);
                if (button.right) {
                    args.action = "None";
                }
            };
            $("#eventModal").on('hide.bs.modal', function() {
                dp.clearSelection();
            });
            dp.onEventClick = function(args) {
                var availability = parseInt(getAvailability(args.e.id()));
                var type = parseInt(getType(args.e.id()));
                var studentEmail;
                $.ajax({
                    method: "POST",
                    url: "../get_session.php",
                    cache: false,
                    async: false,
                    success: function(data) {
                        studentEmail = data;
                    }
                });
                var start = args.e.start().toString();
                var end = args.e.end().toString();
                var startSplit = start.split("T");
                var endSplit = end.split("T");
                var eventName = args.e.text();
                var eventTime = startSplit[1] + " till " + endSplit[1];
                var eventDate;
                var eventDateStart = moment(startSplit[0], "YYYY-MM-DD").format("DD/MM/YYYY");
                var eventDateEnd = moment(endSplit[0], "YYYY-MM-DD").format("DD/MM/YYYY");
                if (eventDateStart == eventDateEnd) {
                    eventDate = eventDateStart;
                } else {
                    eventDate = eventDateStart + " till " + eventDateEnd;
                }
                if (availability > 0) {
                    modalForm = "";
                    modalForm += "<form class=\"form-signin\" method=\"post\" id=\"booking-form\">";
                    modalForm += "        <div class=\"form-group\">";
                    modalForm += "        Please check and confirm the below details: </br></br>"
                    modalForm += "        Student Email: <label>" + studentEmail + "</label></br></br>";
                    modalForm += "        Event Name: <label>" + eventName + "</label></br></br>";
                    modalForm += "        Event Date: <label>" + eventTime + "</label></br></br>";
                    modalForm += "        Event Time: <label>" + eventDate + "</label></br></br>";
                    modalForm += "        <button type=\"submit\" class=\"btn btn-default\" name=\"submit\" id=\"submit\">";
                    modalForm += "      <span class=\"glyphicon glyphicon-ok\"><\/span> &nbsp; Book Selected Event";
                    modalForm += "   <\/button> ";
                    modalForm += "        <\/div>  ";
                    modalForm += " <\/form>";


                    $('.modal-title').html('Booking Form');
                    $('#modal-form').html(modalForm);

                    $('#eventModal').modal('show');

                    document.getElementById("submit").addEventListener("click", submitData, true);

                    function submitData() {
                        var timetableID = args.e.id();
                        availability = availability - 1;
                        $('#eventModal').modal('hide');

                        $.post("../student_booking.php", {
                                timetable_id: timetableID,
                                availability: availability
                            },
                            function() {
                                console.log("Created.");
                            });
                        dp.clearSelection();

                    }
                } else { $('#session-full-dialog').dialog('open');}
            };

            function getAvailability(id) {
                var availability;
                var availabilityStr;

                $.ajax({
                    method: "POST",
                    data: {
                        'id': id
                    },
                    url: "../backend_event_get.php",
                    cache: false,
                    dataType: "JSON",
                    async: false,
                    success: function(data) {
                        availabilityStr = JSON.stringify(data.availability).split("\"");
                        availability = availabilityStr[1];
                    }
                });

                return availability;
            }

            function getType(id) {
                var type;
                var typeStr;

                $.ajax({
                    method: "POST",
                    data: {
                        'id': id
                    },
                    url: "../backend_event_get.php",
                    cache: false,
                    dataType: "JSON",
                    async: false,
                    success: function(data) {
                        typeStr = JSON.stringify(data.type).split("\"");
                        type = typeStr[1];
                    }
                });

                return type;
            }


            dp.onBeforeEventRender = function(args) {
                var start = args.e.start.toString();
                var end = args.e.end.toString();
                var startTime = start.split("T");
                var endTime = end.split("T");
                args.e.bubbleHtml = "Session runs from " + startTime[1] + " till " + endTime[1];
                if (args.e.availability > 0) {
                    args.e.backColor = "#77DD77";
                } else {
                    args.e.backColor = "#FF6961";
                }
                args.data.html = args.data.text + " - Avaliable Slots: " + args.e.availability;
            };

            dp.init();

            loadEvents();

            function loadEvents() {
                var start = dp.visibleStart();
                var end = dp.visibleEnd();

                $.post("../backend_events.php", {
                        start: start.toString(),
                        end: end.toString()
                    },
                    function(data) {

                        dp.events.list = data;
                        dp.update();
                    });

            }
        </script>


    </div>
    <div class="clear">
    </div>


</body>

</html>