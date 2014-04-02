function onCreate() {

    // Consider this to be the "main" function of sorts
    document.getElementById("clock").innerHTML = createClock();                                     // Create a clock
    setInterval(function() { document.getElementById("clock").innerHTML = createClock(); }, 500);   // Update it every half-second

    // Dynamically create equivalency-rate bars from array data
    //              Time     Equivalency Rate
    var EqRates = [ [7,  30, "5.00"],
                    [10, 45, "7.00"],
                    [16, 45, "9.00"],
                    [19, 30, "7.00"],
                    [26, 00, "N/A" ]];  // 2:00 AM, the NEXT day!
    var sundayEqRates = 
                  [ [7,  30, "9.00"],
                    [26, 00, "N/A" ]];  // Meals are $9 all day Sunday

    // Use a different set of bars on Sunday
    var today = new Date();
    if (today.getDay() == 0) {
        createEqRateBars(sundayEqRates);
    } else {
        createEqRateBars(EqRates);
    }

    // Set the position of an arrow pointing to the correct time block
    setArrowPosition(EqRates);
    setInterval(function() { setArrowPosition(EqRates); }, 60000);  // Update it every minute
    $(window).resize(function() { setArrowPosition(EqRates); });    // Update it upon window resize

    // Procedurally indicate whether a dining hall is open or closed and provide relevant info [7][]
    //                      Hall/Meal     Mon-Thur       Fri            Sat            Sun
    var operatingHours =  [ ["1835 Hinman", "https://m-nucuisine.sodexomyway.com/images/Hinman1_tcm238-12915.htm",
                            ["Breakfast", "7:30-9:45"  , "7:30-9:45"  , "N/A"        , "N/A"        ],
                            ["Lunch"    , "10:45-13:15", "10:45-13:15", "N/A"        , "N/A"        ],
                            ["Afternoon", "13:15-16:45", "13:15-16:45", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-20:00", "16:45-19:00", "N/A"        , "N/A"        ]],

                            ["Allison"  , "https://m-nucuisine.sodexomyway.com/images/Allison1_tcm238-9944.htm",
                            ["Breakfast", "7:30-9:45"  , "7:30-9:45"  , "N/A"        , "N/A"        ],
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "11:15-13:15", "11:15-13:45", "10:45-13:30", "N/A"        ],
                            ["Dinner"   , "16:45-19:00", "16:45-19:00", "16:45-19:00", "16:45-19:30"]],

                            ["Elder"    , "https://m-nucuisine.sodexomyway.com/images/Elder1_tcm238-12911.htm",
                            ["Lunch"    , "11:15-13:15", "11:15-13:15", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-19:00", "16:45-19:00", "N/A"        , "N/A"        ]],

                            ["Plex East", "https://m-nucuisine.sodexomyway.com/images/Foster_East1_tcm238-12913.htm",
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "10:45-13:15", "10:45-13:15", "10:45-13:30", "N/A"        ],
                            ["Dinner"   , "16:45-20:00", "16:45-20:00", "16:45-19:00", "16:45-19:00"]],

                            ["Plex West", "https://m-nucuisine.sodexomyway.com/images/Foster_West1_tcm238-12914.htm",
                            ["Breakfast", "7:30-10:45" , "7:30-10:45" , "7:30-9:45"  , "N/A"        ],
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "11:15-13:15", "11:15-13:15", "10:45-13:30", "N/A"        ],
                            ["Afternoon", "13:15-16:45", "13:15-16:45", "N/A"        , "N/A"        ],
                            ["Dinner"   , "17:15-19:30", "17:15-19:00", "17:15-19:00", "16:45-19:30"],
                            ["Late Night","20:00-23:30", "N/A"        , "N/A"        , "N/A"        ]],

                            ["Sargent"  , "https://m-nucuisine.sodexomyway.com/images/Sargent1_tcm238-12910.htm",
                            ["Breakfast", "7:30-10:45" , "7:30-10:45" , "7:30-9:45"  , "N/A"        ],
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "10:45-13:15", "10:45-13:15", "10:45-13:30", "N/A"        ],
                            ["Afternoon", "13:15-16:45", "13:15-16:45", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-20:00", "16:45-19:00", "16:45-19:00", "16:45-19:30"]],

                            ["Willard"  , "https://m-nucuisine.sodexomyway.com/images/Willard1_tcm238-12912.htm",
                            ["Lunch"    , "11:15-13:15", "11:15-13:15", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-19:00", "16:45-19:00", "N/A"        , "N/A"        ]] ];
    createPanels(operatingHours);

}

/*
 * Create a clock, with special formatting
 */
function createClock() {
    // Date format is "Sunday, January 1st, 12:00:00 AM"
    var today = new Date();

    var day = returnDay(today.getDay());    // Convert day integer to string (i.e. Monday, Tuesday, Wednesday...)
    var o = returnMonth(today.getMonth());  // Convert month integer to string (i.e. January, February, March...)
    var d = formatDate(today.getDate());    // Add suffix to date (i.e. 1st, 2nd, 4th...)

    var h = today.getHours();
    var m = formatTime(today.getMinutes()); // If minutes or seconds is single digit, add zero before
    var s = formatTime(today.getSeconds());

    var AMPM = getAMPM(h);
    h = h % 12;
    if (h == 0) {
        h = 12;
    }

    // Controls the final output of the clock's text
    return (day).bold() + ", " + o + " " + d + ", " + h + ":" + m + ":" + s + " " + AMPM;
}

// A series of helper functions
function returnDay(day) {
    return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day];
}

function returnMonth(month) {
    return ["January","February","March","April","May","June","July","August","September","October","November","December"][month];
}

function formatDate(date) {
    digit = date % 10;
    if (digit == 1) {
        return date + "st";
    } else if (digit == 2) {
        return date + "nd";
    } else if (digit == 3) {
        return date + "rd";
    } else {
        return date + "th";
    }
}

// Add zeros before numbers where necessary
function formatTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Given an hour, determine if it is AM or PM
function getAMPM(hour) {
    return ["AM","PM"][(((hour % 24) >= 12) & 1)];
}


/*
 * Procedurally create equivalency rate exchange bars
 */
function createEqRateBars(EqRates) {
    
    // EqRates is a "3-dimensional" array of time slots and corresponding equivalency rates
    var rows = EqRates.length;
    var columns = EqRates[0].length;

    // Use the total length of all blocks to figure out what proportion each individual block takes up
    var startMin = timeInMin(EqRates[0][0], EqRates[0][1]); // Converts hours and minutes to just minutes for easy math
    var endMin = timeInMin(EqRates[rows - 1][0], EqRates[rows - 1][1]);   
    var totalMin = endMin - startMin;

    // For each time block, create a div that represents that block graphically as a horizontal bar
    for (var i = 0; i < rows - 1; i++) {
        
        // Set up variables that specify the horizontal bar's name and width, then add it
        var name = "block" + i;
        var blockMin = timeInMin(EqRates[i + 1][0], EqRates[i + 1][1]) - timeInMin(EqRates[i][0], EqRates[i][1]);
        var blockWidth = (blockMin / totalMin) * 100 + "%";

        jQuery('<div/>', {
            id: name,
            class: "rate-bars",
            css: {
                width: blockWidth,
            }
        }).appendTo('#rate-bars-container');


        // Format time information, then display it ABOVE the bar
        var hour = EqRates[i][0] % 12;              // 12-hour time
        var minute = formatTime(EqRates[i][1]);     // Add '0' before minute if minute < 10
        var AMPM = getAMPM(EqRates[i][0]);          // Is it AM or PM?

        jQuery('<div/>', {
            class: 'timeText',
            text: hour + ":" + minute + " " + AMPM
        }).appendTo("#" + name);


        // Pull price information, then display it ON the bar
        var price = EqRates[i][2];

        jQuery('<div/>', {
            class: 'priceText',
            text: "$" + price
        }).appendTo("#" + name);
    }

    // Do something special to pull closing time and put it ABOVE the bar and flush right
    var hour = EqRates[rows-1][0] % 12;             // 12-hour time
    var minute = formatTime(EqRates[rows-1][1]);    // Add '0' before minute if minute < 10
    var AMPM = getAMPM(EqRates[rows - 1][0]);       // Is it AM or PM?

    jQuery('<div/>', {
        class: 'timeText-right',
        text: hour + ":" + minute + " " + AMPM
    }).appendTo("#" + name); // Just to keep thing simple, we'll make it a subclass of the last horizontal bar
}

/*
 * Set arrow location depending on equivalency meal value
 */
function setArrowPosition(EqRates) {

    // EqRates is a "3-dimensional" array of time slots and corresponding equivalency rates
    var rows = EqRates.length;

    // Get some time information
    var today = new Date();

    var currentMin = dateInMin(today);                                      // Current time in minutes from midnight
    var openMin = timeInMin(EqRates[0][0], EqRates[0][1]);                  // 7:30 AM - same format
    var closeMin = timeInMin(EqRates[rows - 1][0], EqRates[rows - 1][1]);   // 2:00 AM the NEXT DAY - same format
    var DAY_IN_MINUTES = 24*60;                                             // Will be useful later on for subtracting

    // If it is after 7:30 AM OR before 2:00 AM on the SAME DAY, show the arrow, otherwise hide it
    if (currentMin >= openMin || currentMin < closeMin - DAY_IN_MINUTES) {

        /* Place the "current time" arrow as such:
         * 1) Subtract currentMin by openMin so the arrow is at 0(%) displacement at 7:30 AM
         * 2) Divide by (closeMin - openMin), the minutes from open to close time, so that at close time, the arrow is at 100(%) displacement
         * 3) There is 5px of offset from the width of the arrow, convert that to a (%) and subtract it
         * 4) Multiply by 100 so we have an actual percent
         * 5) Set this absolute number to the left-margin shift
         */
        var timelinePercent = [(currentMin - openMin)/(closeMin - openMin) - (5/$("#rate-bars-container").width())] * 100;
        $("#arrow").css("margin-left", timelinePercent + "%");
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

/*
 * Procedurally create a panel for each store/dining hall and update it
 */
function createPanels(operatingHours) {

    var numOfStores = operatingHours.length;    // Keep track of the number of stores/dining halls

    // Create an empty panel "container" for each facility
    for (var i = 0; i < numOfStores; i++) {
        jQuery('<div/>', {
            class: 'panel panel-default'
        }).appendTo('#accordion');
    }

    // Now create an empty heading "container" for each empty panel
    jQuery('<div/>', {
        class: 'panel-heading'
    }).appendTo('.panel.panel-default');

    // Iteratively create an h4 div with the name of the dining hall
    $('.panel-heading').each(function(index) {

        jQuery('<h4/>', {
            class: 'panel-title',
            text: operatingHours[index][0]      // Name of dining hall
        }).appendTo($(this));
    });

    // Iteratively add a link to each dining hall's menu in the title bar
    $('.panel-title').each(function(index) {

        jQuery('<div/>', {                       
            id: index,
            class: 'panel-title menu'
        }).appendTo($(this));

        menuURL = operatingHours[index][1];
        schURL = "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png";

        $("#" + index).html("<a href=" + menuURL + ">Menu</a> - <a href=" + schURL + ">Schedule</a>");

    });

    // Add empty panel bodies
    jQuery('<div/>', {
        class: 'panel-collapse collapse in'
    }).appendTo('.panel.panel-default');
    
    // Iteratively fill the panel with information about whether the dining hall is open or not, and a link to a schedule
    $('.panel-collapse.collapse.in').each(function(index) {

        var output = returnOpenOrClosed(operatingHours, index);

        if (output[0] == 0) {

            jQuery('<div/>', {
                class: 'panel-body open',
                text: output[1]
            }).appendTo($(this));

        } else if (output[0] == 1) {

            jQuery('<div/>', {
                class: 'panel-body closed',
                text: output[1]
            }).appendTo($(this));
        }
    });
}

// Given the an index in 'operatingHours' corresponding to an establishment, find out its open or close status
function returnOpenOrClosed(operatingHours, hallCode) {
    
    // Get the current time as a number of minutes past midnight, and compare it to the dining hall's open and close times
    var today = new Date();

    var day = today.getDay();
    var hour = today.getHours();
    var minute = today.getMinutes();

    var currentMin = timeInMin(hour, minute);

    // Used to select a day in the operatingHours array
    var dayCode;
    if (day >= 1 && day <= 4) { // Monday-Thursday
        dayCode = 1;
    } else if (day == 5) {  // Friday
        dayCode = 2;
    } else if (day == 6) {  // Saturday
        dayCode = 3;
    } else if (day == 0) {  // Sunday
        dayCode = 4;
    }

    // Count the number of meal "blocks" for iteration purposes
    var mealOptions = operatingHours[hallCode].length;  

    // Now iterate and find out if the selected dining hall is open
    for (var i = 2; i < mealOptions; i++) {
        var openCloseTimes = parseTime(operatingHours[hallCode][i][dayCode]);

        // If a dining hall is open
        if (currentMin >= openCloseTimes[0] && currentMin < openCloseTimes[1]) {
            return [0, "OPEN - " + operatingHours[hallCode][i][0]];
        }
    }
    return [1, "CLOSED"];
}

// Desearializes the time in 'operatingHours' in a meaningful way -- either it is "N/A" or it is a string representation of a time
// In the latter case, convert time to minutes after midnight, for easy comparing
function parseTime(str) {
    if (str === "N/A") {
        var output = [0, 0];
    } else {
        var res = str.split(/-|:/);
        var output = [timeInMin(parseInt(res[0]), parseInt(res[1])), 
                      timeInMin(parseInt(res[2]), parseInt(res[3]))]
    }
    return output;
}
