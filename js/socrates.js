$(function() {
    $("#menu").menu();
});

function addNewEventModal() {
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

    $('.modal-title').html('Add New Event');
    $('#modal-form').html(modalForm);
    $('#modal-form').on('focus', "#start-date", function() {
        $(this).datetimepicker({
            controlType: 'select',
            oneLine: true,
            dateFormat: 'dd/mm/yy',
            timeFormat: 'HH:mm:ss'
        });
    });
    $('#modal-form').on('focus', "#end-date", function() {
        $(this).datetimepicker({
            controlType: 'select',
            oneLine: true,
            dateFormat: 'dd/mm/yy',
            timeFormat: 'HH:mm:ss'
        });
    });
    $('#modal-form').on('focus', "#event-name", function() {});

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
}



function addNewStudentModal() {
    var modalForm = "";
    modalForm += " <form class=\"form-signin\" method=\"post\" id=\"register-form\">";
    modalForm += "        <div id=\"error\">";
    modalForm += "        <!-- error will be shown here ! -->";
    modalForm += "        <\/div>";
    modalForm += "        ";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"text\" class=\"form-control\" placeholder=\"Forename\" name=\"user_forename\" id=\"user_forename\" \/>";
    modalForm += "        <\/div>";
    modalForm += "";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"text\" class=\"form-control\" placeholder=\"Surname\" name=\"user_surname\" id=\"user_surname\" \/>";
    modalForm += "        <\/div>";
    modalForm += "";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"text\" class=\"form-control\" placeholder=\"Phone Number\" name=\"user_phone\" id=\"user_phone\" \/>";
    modalForm += "        <\/div>";
    modalForm += "";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <textarea rows=\"4\" class=\"form-control\" placeholder=\"Address\" name=\"user_address\" id=\"user_address\"><\/textarea>";
    modalForm += "        <\/div>";
    modalForm += "";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"email\" class=\"form-control\" placeholder=\"Email address\" name=\"user_email\" id=\"user_email\" \/>";
    modalForm += "        <span id=\"check-e\"><\/span>";
    modalForm += "        <\/div>";
    modalForm += "        ";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"password\" class=\"form-control\" placeholder=\"Password\" name=\"password\" id=\"password\" \/>";
    modalForm += "        <\/div>";
    modalForm += "        ";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"password\" class=\"form-control\" placeholder=\"Retype Password\" name=\"cpassword\" id=\"cpassword\" \/>";
    modalForm += "        <\/div>";
    modalForm += "      <hr \/>";
    modalForm += "        ";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "            <button type=\"submit\" class=\"btn btn-default\" name=\"btn-save\" id=\"btn-submit\">";
    modalForm += "      <span class=\"glyphicon glyphicon-log-in\"><\/span> &nbsp; Create Account";
    modalForm += "   <\/button> ";
    modalForm += "        <\/div>  ";
    modalForm += "      ";
    modalForm += " <\/form>";
    $('#modal-form').html(modalForm);
    $('.modal-title').html('Add New Student');
    $('#eventModal').modal('show');

    $('document').ready(function() {
        /* validation */
        $.validator.addMethod("telcheck", function(value) {
            return /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/.test(value)
        });

        $.validator.addMethod("pwcheck", function(value) {
            return /[\@\#\$\%\^\&\*\(\)\_\+\!]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value)
        });
        $("#register-form").validate({
            rules: {
                user_forename: {
                    required: true,
                    minlength: 2
                },
                user_surname: {
                    required: true,
                    minlength: 2
                },
                user_phone: {
                    telcheck: true,
                    required: true
                },
                user_address: {
                    required: true,
                    minlength: 2
                },
                password: {
                    pwcheck: true,
                    required: true,
                    minlength: 6
                },
                cpassword: {
                    required: true,
                    equalTo: '#password'
                },
                user_email: {
                    required: true,
                    email: true
                }

            },
            messages: {
                user_phone: {
                    telcheck: "Please enter a valid UK phone number. It may be in UK or international format.",
                    required: "Please provide a telephone number."
                },
                password: {
                    required: "Please provide a password",
                    minlength: "Password at least have 8 characters",
                    pwcheck: "Your password must contain at least one lowercase character, one uppercase character, one digit and one symbol character"
                },
                user_email: "Please enter a valid email address",
                cpassword: {
                    required: "Please retype your password",
                    equalTo: "Password doesn't match!"
                },
                user_address: {
                    required: "Please provide a valid address",
                    minlength: "Address requires a minimum of 2 characters"
                }

            },
            submitHandler: submitForm
        });
        /* validation */

        /* form submit */
        function submitForm() {
            var data = $("#register-form").serialize();
            $.ajax({
                type: 'POST',
                url: '../register.php',
                data: data,
                beforeSend: function() {
                    $("#error").fadeOut();
                    $("#btn-submit").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Sending ...');
                },
                success: function(data) {
                    if (data == 1) {

                        $("#error").fadeIn(1000, function() {


                            $("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Sorry email already taken!</div>');

                            $("#btn-submit").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Create Account');

                        });

                    } else if (data == "addedregistered") {

                        $("#btn-submit").html('<img src="../css/images/btn-ajax-loader.gif" /> &nbsp; Signing Up ...');
                        setTimeout('$(".form-signin").fadeOut(500, function(){ $(".signin-form").load("index.php"); }); ', 5000);
                        $('#eventModal').modal('hide');
                        dp.message("New Student Added!");
                    } else {

                        $("#error").fadeIn(1000, function() {

                            $("#error").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-info-sign"></span> &nbsp; ' + data + '!</div>');

                            $("#btn-submit").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Add Student Account');

                        });

                    }
                }
            });
            return false;
        }
        /* form submit */

    });
}

function updateStudentModal() {
    var studentData;
    $.ajax({
        method: "POST",
        url: "../get_student.php",
        cache: false,
        dataType: "JSON",
        async: false,
        success: function(data) {
            studentData = data;
        }
    });
    var email = studentData.email;
    var phone = studentData.phone;
    var address = studentData.address;
    var forename = studentData.forename;
    var surname = studentData.surname;

    var modalForm = "";
    modalForm += "  <div class=\"signin-form\"> <form class=\"form-signin\" method=\"post\" id=\"register-form\">";
    modalForm += "        <div id=\"error\">";
    modalForm += "        <!-- error will be shown here ! -->";
    modalForm += "        <\/div>";
    modalForm += "        ";
    modalForm += "<div class=\"form-group\">";
    modalForm += "         Full Name: <label>" + forename + " " + surname + "</label></br></br>";
    modalForm += "        <\/div>";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"text\" class=\"form-control\" pattern=\"^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$\" placeholder=\"Phone Number\" value=\"" + phone + "\" name=\"user_phone\" id=\"user_phone\" \/>";
    modalForm += "        <\/div>";
    modalForm += "";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <textarea rows=\"4\" class=\"form-control\" placeholder=\"Address\" name=\"user_address\" id=\"user_address\">" + address + "<\/textarea>";
    modalForm += "        <\/div>";
    modalForm += "";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"email\" class=\"form-control\" placeholder=\"Email address\" value=\"" + email + "\"  name=\"user_email\" id=\"user_email\" \/>";
    modalForm += "        <span id=\"check-e\"><\/span>";
    modalForm += "        <\/div>";
    modalForm += "        ";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"password\" class=\"form-control\" placeholder=\"New Password\" name=\"password\" id=\"password\" \/>";
    modalForm += "        <\/div>";
    modalForm += "        ";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "        <input type=\"password\" class=\"form-control\" placeholder=\"Retype Password\" name=\"cpassword\" id=\"cpassword\" \/>";
    modalForm += "        <\/div>";
    modalForm += "      <hr \/>";
    modalForm += "        ";
    modalForm += "        <div class=\"form-group\">";
    modalForm += "            <button type=\"submit\" class=\"btn btn-default\" name=\"btn-save\" id=\"btn-submit\">";
    modalForm += "      <span class=\"glyphicon glyphicon-log-in\"><\/span> &nbsp; Update Account";
    modalForm += "   <\/button> ";
    modalForm += "        <\/div>  ";
    modalForm += "      ";
    modalForm += " <\/form>  <div class=\"signin-form\">";
    $('#modal-form').html(modalForm);
    $('.modal-title').html('Update My Student Record');
    $('#eventModal').modal('show');

    $('document').ready(function() {
        $.validator.addMethod("telcheck", function(value) {
            return /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/.test(value)
        });

        $.validator.addMethod("pwcheck", function(value) {
            var password = $("#password").val();
            if (password == "") {
                return true;
            } else {
                return /[\@\#\$\%\^\&\*\(\)\_\+\!]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value)
            }
        });

        $("#register-form").validate({
            rules: {
                user_phone: {
                    telcheck: true,
                    required: true
                },
                user_address: {
                    required: true,
                    minlength: 2
                },
                password: {
                    pwcheck: true,
                    minlength: 6
                },
                cpassword: {
                    equalTo: '#password'
                },
                user_email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                user_phone: {
                    telcheck: "Please enter a valid UK phone number. It may be in UK or international format.",
                    required: "Please provide a telephone number."
                },
                password: {
                    minlength: "Password at least have 6 characters.",
                    pwcheck: "Your password must contain at least one lowercase character, one uppercase character, one digit and one symbol character."
                },
                user_email: "Please enter a valid email address.",
                cpassword: {
                    passconfirmcheck: "Please confirm your password.",
                    equalTo: "Password doesn't match!"
                },
                user_address: {
                    required: "Please provide a valid address.",
                    minlength: "Address requires a minimum of 2 characters."
                }

            },
            submitHandler: submitForm
        });
        /* validation */

        /* form submit */
        function submitForm() {
            var data = $("#register-form").serialize();

            $.ajax({

                type: 'POST',
                url: '../update_student.php',
                data: data,
                beforeSend: function() {
                    $("#error").fadeOut();
                    $("#btn-submit").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Sending ...');
                },
                success: function(data) {
                    if (data == 1) {

                        $("#error").fadeIn(1000, function() {


                            $("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Sorry email already taken!</div>');

                            $("#btn-submit").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Create Account');

                        });

                    } else if (data == "updatedamended") {

                        $("#btn-submit").html('<img src="../css/images/btn-ajax-loader.gif" /> &nbsp; Updating ...');
                        setTimeout('$(".form-signin").fadeOut(500, function(){ $(".signin-form").load("index.php"); }); ', 1000);
                        $('#modal-form').html("");
                        $('#eventModal').modal('hide');
                        dp.message("Your details have been updated!");
                    } else {

                        $("#error").fadeIn(1000, function() {

                            $("#error").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-info-sign"></span> &nbsp; ' + data + '!</div>');

                            $("#btn-submit").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Update Account');

                        });

                    }
                }
            });
            return false;
        }
        /* form submit */

    });
}


function showBookedEvents() {
    var modalForm = "";

    modalForm += "<table id=\"events\" class=\"display responsive\" cellspacing=\"0\" width=\"100%\">";
    modalForm += "        <thead>";
    modalForm += "            <tr>";
    modalForm += "                <th>Booking ID<\/th>";
    modalForm += "                <th>Event Name<\/th>";
    modalForm += "                <th>Event Start<\/th>";
    modalForm += "                <th>Event End<\/th>";
    modalForm += "                <th>Event Type<\/th>";
    modalForm += "            <\/tr>";
    modalForm += "        <\/thead>";
    modalForm += "        <tfoot>";
    modalForm += "            <tr>";
    modalForm += "                <th>Booking ID<\/th>";
    modalForm += "                <th>Event Name<\/th>";
    modalForm += "                <th>Event Start<\/th>";
    modalForm += "                <th>Event End<\/th>";
    modalForm += "                <th>Event Type<\/th>";
    modalForm += "            <\/tr>";
    modalForm += "        <\/tfoot>";
    modalForm += "        <tbody>";




    var bookedEventData;

    $.ajax({
        method: "POST",
        url: "../get_student_bookings.php",
        cache: false,
        dataType: "JSON",
        async: false,
        success: function(data) {
            if (data != "") {
                bookedEventData = data;
                len = Object.keys(data).length;
            }
        }
    });

    var str;
    $.each(bookedEventData, function(key, value) {
        str = value.type;
        str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        var startDate = moment(value.start, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
        var endDate = moment(value.end, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
        modalForm += "<tr>";
        modalForm += "                <td>" + value.id + "<\/td>";
        modalForm += "                <td>" + value.name + "<\/td>";
        modalForm += "                <td>" + startDate + "<\/td>";
        modalForm += "                <td>" + endDate + "<\/td>";
        modalForm += "                <td>" + str + "<\/td>";
        modalForm += "            <\/tr>";
    });
    modalForm += "<\/tbody>";
    modalForm += "    <\/table>";
    $('#modal-form').html(modalForm);
    $('.modal-title').html('Show Booked Events');
    $('#eventModal').modal('show');

    $("#eventModal").on("show.bs.modal", function() {
        var width = $(window).width() - 200;
        $(this).find(".modal-body").css("max-width", width);
    });

    $('#events').DataTable();




}