/*
 * This portion of code is for the live updating clock
 */
function onCreate() {
    
    // Create a clock and keep it updated
    document.getElementById("clock").innerHTML = createClock();
    t = setInterval(function() {
        document.getElementById("clock").innerHTML = createClock();
    }, 500);

    // Dynamically create equivalency rate bars
    createEqMealBars();

    // Move the arrow when the window is resized
    setArrowPosition();
    $(window).resize(function() {
        setArrowPosition();
    });
}

/*
 * Create a clock that constantly updates itself
 */
function createClock() {
    // Date format is "Sunday, January 1st, 12:00 AM", inputs processed in order
    var today = new Date();

    var day = returnDay(today.getDay());    // Convert day integer to string (i.e. Monday, Tuesday, Wednesday...)
    var o = returnMonth(today.getMonth());  // Convert month integer to string (i.e. January, February, March...)
    var d = formatDate(today.getDate());    // Add suffix to date (i.e. 1st, 2nd, 4th...)

    var h = today.getHours();
    var m = formatTime(today.getMinutes()); // If minutes/seconds is single digit, add zero before
    var s = formatTime(today.getSeconds());
    var AMPM;

    // Format the time for a 12 hour schedule
    if (h > 12) {
        h = h % 12;
        AMPM = "PM";
    } else {
        AMPM = "AM";
    }

    if (h == 0) {
        h = "12";
    }

    // Controls the final clock formatting
    return (day).bold() + ", " + o + " " + d + ", " + h + ":" + m + ":" + s + " " + AMPM;

    }

function returnDay(day) {
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return days[day];
}

function returnMonth(month) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return months[month];
}

function formatDate(date) {
    if (date % 10 == 1) {
        return date + "st";
    } else if (date % 10 == 2) {
        return date + "nd";
    } else if (date % 10 == 3) {
        return date + "rd";
    } else {
        return date + "th";
    }
    return null;
}

// Add zeros before numbers where necessary
function formatTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

/*
 * Dynamically create equivalency meal bars
 */
function createEqMealBars() {
    
    /*
     * USER SPECIFIED VARIABLES  
     *///           Time     Equivalency Rate
    var EqRate = [  [7,  30, "5.00"],
                    [10, 45, "7.00"],
                    [16, 45, "9.00"],
                    [19, 30, "7.00"],
                    [26, 00, "N/A" ]  ]; // 2:00 AM, the next day
                                         // Put closing time in last row!
    var rows = 5;
    var columns = 3;
    
    /*
     * EVERYTHING ELSE IS PROCEDURALLY GENERATED
     */
    // Calculate total minutes for all blocks
    var startMin = timeInMin(EqRate[0][0], EqRate[0][1]);
    var endMin = timeInMin(EqRate[rows - 1][0], EqRate[rows - 1][1]);
    var totalMin = endMin - startMin;

    // Create div for each time block, aka "row"
    for (var i = 0; i < rows - 1; i++) {
        
        var name = "block" + i;
        var AMPM = AMorPM(EqRate[i][0]);
        var barWidth = timeInMin(EqRate[i + 1][0], EqRate[i + 1][1]) -
                       timeInMin(EqRate[i][0], EqRate[i][1]);
        barWidth = (barWidth / totalMin) * 100 + "%";

        jQuery('<div/>', {
            id: name,
            class: "bars",
            css: {
                width: barWidth,
            }
        }).appendTo('#timeline-bars');

        jQuery('<div/>', {
            class: 'time',
            text: (EqRate[i][0] % 12) + ":" + (formatTime(EqRate[i][1])) + " " + AMPM
        }).appendTo("#" + name);

        jQuery('<div/>', {
            class: 'price',
            text: '$' + EqRate[i][2]
        }).appendTo("#" + name);
    }

    var AMPM = AMorPM(EqRate[rows - 1][0]);
    jQuery('<div/>', {
        class: 'time-right',
        text: (EqRate[rows - 1][0] % 12) + ":" + (formatTime(EqRate[i][1])) + " " + AMPM
    }).appendTo("#" + name);
}

function AMorPM(hour) {
    if (hour >= 12 && hour < 24) {
        return "PM";
    }
    return "AM";
}

/*
 * Dynamic arrow adjustment and setting of equivalency meal value
 */
function setArrowPosition() {
    var today = new Date();

    var currentMin = dateInMin(today);  // Current time in minutes
    var openMin = timeInMin(7, 30);     // 7:30 AM
    var closeMin = timeInMin(2, 00);    // 2:00 AM

    // If after 7:30 AM/before 2:00 AM the same day, show arrow
    if (currentMin >= openMin || currentMin < closeMin) {

        // If next day's time, add minutes from the previous day (correction)
        if (currentMin >= 0 && currentMin < closeMin) {
            currentMin = currentMin + 1440;
        }

        /* Represent the currentMin as a percent along the timeline as such:
         * 1) Subtract currentMin by openMin so the percent is at zero at 7:30 AM
         * 2) Divide by 1110, the maximum number of minutes from 7:30 AM to 2:00 AM the next day, normalization
         * 3) Now multiply by the width of the timeline (using a proportion ensures it works on all screens)
         * 4) Subtract by 5px at the end, to correct for the 11px sized arrow (centering it by its center, not left side)
         * 5) Set this absolute number to the left-margin shift
         */
        var timelinePercent =
            [(currentMin - openMin)/1110] * $("#timeline-bars").width() - 5;
        $("#arrow").css("margin-left", timelinePercent + "px");

    } else {
        $("#arrow").hide();   
    }   
}

// Easy ways to return times as minutes
function dateInMin(dateObject) {
    return dateObject.getHours() * 60 + dateObject.getMinutes();
}

function timeInMin(hours, minutes) {
    return hours * 60 + minutes;
}