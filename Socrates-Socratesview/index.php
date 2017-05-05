<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Socrates | Socrates View </title>
    <!--calender stylesheet -->

    <link type="text/css" rel="stylesheet" href="../css/bootstrap/bootstrap.css" />
    <link type="text/css" rel="stylesheet" href="../css/jquery-ui.css" />
    <link type="text/css" rel="stylesheet" href="../css/jquery-ui-timepicker-addon.css" />
    <link type="text/css" rel="stylesheet" href="../media/layout.css" />
    <link type="text/css" rel="stylesheet" href="../css/calendar_transparent.css" />
    <link type="text/css" rel="stylesheet" href="../css/custom.css" />

    <script type="text/javascript" src="../js/jquery-1.12.js"></script>
    <script type="text/javascript" src="../js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/jquery-ui.js"></script>
    <script type="text/javascript" src="../js/jquery-ui-timepicker-addon.js"></script>
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js"></script>
    <script type="text/javascript" src="../js/moment.js"></script>
    <!-- daypilot libraries -->
    <script src="../js/daypilot/daypilot-pro.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="../js/socrates.js"></script>
    <style>
        .ui-menu {
            width: 150px;
        }
    </style>
</head>

<body>
    <div id="dialog" title="Calendar Info">
        <p>Data is loading. Please Wait...</p>
    </div>
    <nav class="navbar navbar-inverse">
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
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span style="margin-right: 0.5em" class="glyphicon glyphicon-education"></span>Students<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-search"></span>View Student Records</a>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li><a onclick="addNewStudentModal()" href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-plus"></span>Add New Student</a>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span style="margin-right: 0.5em" class="glyphicon glyphicon-calendar"></span>Bookings<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-plus"></span>Make Student Booking</a>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-search"></span>View Event Bookings</a>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span style="margin-right: 0.5em" class="glyphicon glyphicon-calendar"></span>Events<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a onclick="addNewEventModal()" href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-plus"></span>Add New Event</a>
                            </li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#"><span style="margin-right: 0.5em" class="glyphicon glyphicon-search"></span>View Calendar</a>
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

        <div style="float:left; width: 160px;">
            <div id="nav"></div>
        </div>
        <div style="margin-left: 160px;">

            <div id="dp"></div>

        </div>


    </div>
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
    <script type="text/javascript">
        $(document).ready(function() {
            $('#dialog').dialog({
                autoOpen: false
            });
            $('#dialog').dialog('open');
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
        dp.locale = "en-gb";
        dp.bubble = new DayPilot.Bubble();
        dp.cssClassPrefix = "calendar_transparent"
        dp.startDate = new DayPilot.Date("2017-05-07T00:00:00");
        dp.viewType = "Week";
        dp.weekStarts = 0;
        dp.eventDeleteHandling = "Update";
        dp.timeRangeDoubleClickHandling = "Disabled";
        dp.timeRangeRightClickHandling = "Disabled";

        dp.contextMenu = new DayPilot.Menu({
            items: [{
                text: "Delete",
                onclick: function() {
                    var e = this.source;
                    dp.events.remove(e);
                }
            }],
            cssClassPrefix: "menu_default"
        });

        $("#eventModal").on('hide.bs.modal', function() {
            dp.clearSelection();
        });
        dp.onEventDelete = function(args) {
            if (!confirm("Do you really want to delete this event?")) {
                args.preventDefault();
            }
        };

        dp.onEventDeleted = function(args) {
            $.post("../backend_delete.php", {
                    id: args.e.id()
                },
                function(result) {
                    dp.message("Event deleted: " + args.e.text());
                });

        };
        dp.onEventMoved = function(args) {
            $.post("../backend_move.php", {
                    id: args.e.id(),
                    newStart: args.newStart.toString(),
                    newEnd: args.newEnd.toString()
                },
                function() {
                    console.log("Moved.");
                });
        };

        dp.onEventResized = function(args) {
            $.post("../backend_resize.php", {
                    id: args.e.id(),
                    newStart: args.newStart.toString(),
                    newEnd: args.newEnd.toString()
                },
                function() {
                    console.log("Resized.");
                });
        };

        // event creating
        dp.onTimeRangeSelected = function newEventModal(args) {
            var name;

            //modalForm = '<form method="post"><label for="event-name">Event Name:</label> <input type="text" name="event-name" id="event-name"/> ';
            //modalForm += '<label for="event-type">Event Type:</label> <select id="event-type"><option value="appointment">One to one Appointment</option><option value="group">Small Group Session</option></select></br>';
            //modalForm += '<label for="start-date">Start Date and Time:</label> <input type="text" id="start-date"> <label for="end-date">End Date and Time:</label> <input type="text" id="end-date"></br><input type="submit" value="Submit" id="submit"/></form>';
            modalForm = "";
            modalForm += "<form class=\"form-signin\" method=\"post\" id=\"event-form\">";
            modalForm += "        <div id=\"error\">";
            modalForm += "        <!-- error will be shown here ! -->";
            modalForm += "        <\/div>";
            modalForm += "        ";
            modalForm += "        <div class=\"form-group\">";
            modalForm += "<label for=\"event-name\">Event Name:<\/label>";
            modalForm += "        <input type=\"text\" class=\"form-control\" placeholder=\"Event Name\" name=\"event-name\" id=\"event-name\" \/>";
            modalForm += "        <\/div>";
            modalForm += "";
            modalForm += "        <div class=\"form-group\">";
            modalForm += "<label for=\"event-type\">Event Type:<\/label>";
            modalForm += "        <select class=\"form-control\" name=\"event-type\" id=\"event-type\">";
            modalForm += "        <option value=\"\" disabled selected>Event Type<\/option>";
            modalForm += "        <option value=\"appointment\">One to one Appointment<\/option>";
            modalForm += "        <option value=\"group\">Small Group Session<\/option>";
            modalForm += "      <\/select>";
            modalForm += "        <\/div>";
            modalForm += "";
            modalForm += "        <div class=\"form-group\">";
            modalForm += "<label for=\"start-date\">Start Date and Time:<\/label>";
            modalForm += "        <input type=\"text\" class=\"form-control\" name=\"start-date\" id=\"start-date\" \/>";
            modalForm += "        <\/div>";
            modalForm += "";
            modalForm += "";
            modalForm += "      <div class=\"form-group\">";
            modalForm += "<label for=\"end-date\">End Date and Time:<\/label>";
            modalForm += "        <input type=\"text\" class=\"form-control\" name=\"end-date\" id=\"end-date\" \/>";
            modalForm += "        <\/div>";
            modalForm += "        ";
            modalForm += "        <div class=\"form-group\">";
            modalForm += "            <button type=\"submit\" class=\"btn btn-default\" name=\"submit\" id=\"submit\">";
            modalForm += "      <span class=\"glyphicon glyphicon-calendar\"><\/span> &nbsp; Add Event";
            modalForm += "   <\/button> ";
            modalForm += "        <\/div>  ";
            modalForm += " <\/form>";


            var start = moment(args.start.toString(), "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
            var end = moment(args.end.toString(), "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
            $('#modal-form').html(modalForm);
            $('.modal-title').html('Add New Event');
            $("#start-date").val(start);
            $("#end-date").val(end);
            $('#modal-form').on('focus', "#start-date", function() {
                $(this).datetimepicker({
                    controlType: 'select',
                    oneLine: true,
                    dateFormat: 'dd/mm/yy',
                    timeFormat: 'HH:mm:ss',
                    defaultValue: start
                });
            });
            $('#modal-form').on('focus', "#end-date", function() {
                $(this).datetimepicker({
                    controlType: 'select',
                    oneLine: true,
                    dateFormat: 'dd/mm/yy',
                    timeFormat: 'HH:mm:ss',
                    defaultValue: end
                });
            });
            $('#eventModal').modal('show');

            document.getElementById("submit").addEventListener("click", submitData, true);

            function submitData() {
                name = document.getElementById('event-name').value;
                var startDate = document.getElementById('start-date').value;
                startDate = moment(startDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss");
                var endDate = document.getElementById('end-date').value;
                endDate = moment(endDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss");

                var eventType = document.getElementById('event-type');
                var eventSelected = eventType.options[eventType.selectedIndex].value;

                var availability;
                if (eventSelected == "appointment") {
                    availability = 1;
                } else if (eventSelected == "group") {
                    availability = 3;
                }
                $('#eventModal').modal('hide');
                var id = DayPilot.guid();
                if (!name) return;
                var e = new DayPilot.Event({
                    start: startDate,
                    end: endDate,
                    id: id,
                    text: name
                });
                dp.events.add(e);

                $.post("../backend_create.php", {
                        id: id,
                        start: startDate,
                        end: endDate,
                        name: name,
                        availability: availability,
                        type: eventSelected
                    },
                    function() {
                        console.log("Created.");
                    });
                dp.clearSelection();

            }

        };
        dp.cellDuration = 10;
        dp.onEventClick = function(args) {
        };

        dp.onBeforeEventRender = function(args) {
            var bookedStudentData;
            var bookedStudentID = "";
            var bookedStudentMsg = "";
            var len;
            $.ajax({
                method: "POST",
                data: {
                    'id': args.e.id
                },
                url: "../get_students_booked.php",
                cache: false,
                dataType: "JSON",
                async: false,
                success: function(data) {
                    if (data != "") {
                        bookedStudentData = data;
                        len = Object.keys(data).length;
                    }
                }
            });
            var i = 0;
            $.each(bookedStudentData, function(key, value) {
                if (i == len - 1) {
                    bookedStudentID += value.studentid;
                } else {
                    bookedStudentID += value.studentid + ", ";
                }
                i++;
            });

            if (bookedStudentID == "") {
                bookedStudentMsg = "No students booked";
            } else {
                bookedStudentMsg = "Students booked: ";
            }

            var start = args.e.start.toString();
            var end = args.e.end.toString();
            var startTime = start.split("T");
            var endTime = end.split("T");
            args.e.bubbleHtml = "Session runs from " + startTime[1] + " till " + endTime[1];
            args.data.html = args.data.text + " - Avaliable Slots: " + args.e.availability + "</br> " + bookedStudentMsg + bookedStudentID;
            if (args.e.availability > 0) {
                args.e.backColor = "#77DD77";
            } else {
                args.e.backColor = "#FF6961";
            }
            $('#dialog').dialog('close');
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

    <div class="clear">
    </div>
</body>

</html>