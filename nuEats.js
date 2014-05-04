function onCreate() {

    // Create a clock and update it every 500ms
    document.getElementById("clock").innerHTML = createClock();
    setInterval(function() { document.getElementById("clock").innerHTML = createClock(); }, 500);

    // Dynamically create equivalency-rate bars from array data
    //              Time     Equivalency Rate
    var EqRates = [ [7,  30, "5"],
                    [10, 45, "7"],
                    [16, 45, "9"],
                    [19, 30, "7"],
                    [26, 00, "N/A" ]];  // 2:00 AM, the NEXT day!
    var sundayEqRates = 
                  [ [7,  30, "9"],
                    [26, 00, "N/A" ]];  // Meals are $9 all day Sunday

    // Use a different set of bars on Sunday
    var today = new Date();
    if (today.getDay() == 0) {
        createEqMealBars(sundayEqRates);
    } else {
        createEqMealBars(EqRates);
    }

    // Set the position of an arrow pointing to the correct time block
    setArrowPosition(EqRates);
    setInterval(function() { setArrowPosition(EqRates); }, 60000);  // Update it every minute
    $(window).resize(function() { setArrowPosition(EqRates); });    // Update it upon window resize

    // Procedurally indicate whether a dining hall is open or closed and provide relevant info [7][]
    //                      Hall/Meal     Mon-Thur       Fri            Sat            Sun
    var diningHallHours  =  [
                            ["1835 Hinman", "https://m-nucuisine.sodexomyway.com/images/Hinman4_tcm238-12915.htm", "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png",
                            ["Breakfast", "7:30-9:45"  , "7:30-9:45"  , "N/A"        , "N/A"        ],
                            ["Lunch"    , "10:45-13:15", "10:45-13:15", "N/A"        , "N/A"        ],
                            ["Afternoon", "13:15-16:45", "13:15-16:45", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-20:00", "16:45-19:00", "N/A"        , "N/A"        ]],

                            ["Allison"  , "https://m-nucuisine.sodexomyway.com/images/Allison4_tcm238-9944.htm", "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png",
                            ["Breakfast", "7:30-9:45"  , "7:30-9:45"  , "N/A"        , "N/A"        ],
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "11:15-13:15", "11:15-13:45", "10:45-13:30", "N/A"        ],
                            ["Dinner"   , "16:45-19:00", "16:45-19:00", "16:45-19:00", "16:45-19:30"]],

                            ["Elder"    , "https://m-nucuisine.sodexomyway.com/images/Elder4_tcm238-12911.htm", "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png",
                            ["Lunch"    , "11:15-13:15", "11:15-13:15", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-19:00", "16:45-19:00", "N/A"        , "N/A"        ]],

                            ["Plex East", "https://m-nucuisine.sodexomyway.com/images/Foster_East4_tcm238-12913.htm", "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png",
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "10:45-13:15", "10:45-13:15", "10:45-13:30", "N/A"        ],
                            ["Dinner"   , "16:45-20:00", "16:45-20:00", "16:45-19:00", "16:45-19:00"]],

                            ["Plex West", "https://m-nucuisine.sodexomyway.com/images/Foster_West4_tcm238-12914.htm", "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png",
                            ["Breakfast", "7:30-10:45" , "7:30-10:45" , "7:30-9:45"  , "N/A"        ],
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "11:15-13:15", "11:15-13:15", "10:45-13:30", "N/A"        ],
                            ["Afternoon", "13:15-16:45", "13:15-16:45", "N/A"        , "N/A"        ],
                            ["Dinner"   , "17:15-19:30", "17:15-19:00", "17:15-19:00", "16:45-19:30"],
                            ["Late Night","20:00-23:30", "N/A"        , "N/A"        , "N/A"        ]],

                            ["Sargent"  , "https://m-nucuisine.sodexomyway.com/images/Sargent4_tcm238-12910.htm", "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png",
                            ["Breakfast", "7:30-10:45" , "7:30-10:45" , "7:30-9:45"  , "N/A"        ],
                            ["Brunch"   , "N/A"        , "N/A"        , "N/A"        , "11:00-14:00"],
                            ["Lunch"    , "10:45-13:15", "10:45-13:15", "10:45-13:30", "N/A"        ],
                            ["Afternoon", "13:15-16:45", "13:15-16:45", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-20:00", "16:45-19:00", "16:45-19:00", "16:45-19:30"]],

                            ["Willard"  , "https://m-nucuisine.sodexomyway.com/images/Willard4_tcm238-12912.htm", "https://m-nucuisine.sodexomyway.com/images/Dining%20Halls%20Hours%20of%20Operation%20-%20Website_tcm238-13180.png",
                            ["Lunch"    , "11:15-13:15", "11:15-13:15", "N/A"        , "N/A"        ],
                            ["Dinner"   , "16:45-19:00", "16:45-19:00", "N/A"        , "N/A"        ]] ];

    var cstorecafeHours  =  [
                            ["Hinman C-Store", "#", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "7:30-24:00" , "7:30-19:00" , "10:45-19:00", "11:00-24:00"]],

                            ["Plex C-Store", "#", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "7:30-24:00" , "7:30-19:00" , "7:30-19:00" , "11:00-24:00"]],

                            ["Willard C-Store", "#", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "11:15-13:15", "11:15-13:15", "N/A"        , "N/A"        ],
                            ["business" , "16:45-26:00", "16:45-19:00", "N/A"        , "19:00-26:00"]],

                            ["Crowe Cafe", "#", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "8:00-17:00" , "8:00-15:00" , "N/A"        , "N/A"        ]],

                            ['"Secret" Einstein Bros', "#", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "8:00-16:00" , "8:00-15:00" , "N/A"        , "N/A"        ]],

                            ["Fran's Cafe", "https://m-nucuisine.sodexomyway.com/images/Fran%27s%20Caf%C3%A9%2011x17_tcm238-13472.jpg", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "20:00-26:00", "N/A"        , "N/A"        , "19:00-26:00"]],

                            ["Lisa's Cafe", "https://m-nucuisine.sodexomyway.com/images/Lisa%27s%20Online%20Menu_tcm238-15568.pdf", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "11:00-26:00", "11:00-26:00", "11:00-26:00", "12:00-26:00"]],

                            ["Plaza Cafe", "#", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "8:30-24:00" , "8:30-15:00" , "12:00-16:00", "17:00-24:00"]],

                            ["Tech Express", "https://m-nucuisine.sodexomyway.com/images/Tech1_tcm238-9928.htm", "https://m-nucuisine.sodexomyway.com/images/Cafe%20and%20C-Store%20Hours%20of%20Operation%20-%20Website_tcm238-13183.png",
                            ["business" , "7:30-18:30" , "7:30-15:00" , "N/A"        , "N/A"        ]]];

    var norriscenterHours = [
                            ["Willie's Food Court", "#", "https://m-nucuisine.sodexomyway.com/images/Norris%20Hours%20of%20Operation%20-%20Website_tcm238-13181.png",
                            ["business" , "11:00-15:00", "11:00-15:00", "N/A"        , "11:00-15:00"]],

                            ["Paws 'N Go C-Store", "#", "https://m-nucuisine.sodexomyway.com/images/Norris%20Hours%20of%20Operation%20-%20Website_tcm238-13181.png",
                            ["business" , "8:00-23:00" , "8:00-21:00" , "10:00-21:00", "11:00-23:00"]],

                            ["Subway", "#", "https://m-nucuisine.sodexomyway.com/images/Norris%20Hours%20of%20Operation%20-%20Website_tcm238-13181.png",
                            ["business" , "11:00-21:00", "11:00-21:00", "11:00-21:00", "11:00-21:00"]],

                            ["Dunkin Donuts", "#", "https://m-nucuisine.sodexomyway.com/images/Norris%20Hours%20of%20Operation%20-%20Website_tcm238-13181.png",
                            ["business" , "8:00-23:45" , "8:00-19:00" , "12:00-19:00", "12:00-23:45"]],

                            ["NorShore Pizza Co.", "https://m-nucuisine.sodexomyway.com/images/NSPC%20Menu%20Board%202013%20-%202014_tcm238-12997.png", "https://m-nucuisine.sodexomyway.com/images/Norris%20Hours%20of%20Operation%20-%20Website_tcm238-13181.png",
                            ["business" , "11:00-23:00", "11:00-21:00", "10:00-21:00", "11:00-23:00"]],

                            ["Norbucks", "#", "https://m-nucuisine.sodexomyway.com/images/Norris%20Hours%20of%20Operation%20-%20Website_tcm238-13181.png",
                            ["business" , "8:00-23:45" , "8:00-21:00" , "9:00-21:00" , "10:00-23:45"]],

                            ["Frontera Fresco", "https://m-nucuisine.sodexomyway.com/images/frontera_menu_tcm238-4571.pdf", "https://m-nucuisine.sodexomyway.com/images/Norris%20Hours%20of%20Operation%20-%20Website_tcm238-13181.png",
                            ["business" , "11:00-19:00", "11:00-19:00", "11:00-15:00", "N/A"        ]]];
    
    // Dining hall buttons
    $(document).on('click', '#dining-halls', function() {
        createPanels(diningHallHours);
    });
    $(document).on('click', '#c-stores', function() {
        createPanels(cstorecafeHours);
    })
    $(document).on('click', '#norris', function() {
        createPanels(norriscenterHours);
    });
    $('#dining-halls').click();
}

/*
 * Create a clock with formatting: "Sunday, January 1st, 12:00:00 AM"
 */
function createClock() {
    var today = new Date();

    var n = monthToStr(today.getMonth());  // Convert month integer code to string (i.e. January, February, March...)
    var d = dateToStr(today.getDate());    // Add suffix to date (i.e. 1st, 2nd, 4th...)
    var day = dayToStr(today.getDay());    // Convert day integer code to string (i.e. Monday, Tuesday, Wednesday...)
    
    var h = today.getHours();
    var m = formatTime(today.getMinutes());
    var s = formatTime(today.getSeconds());

    var AMPM = getAMPM(h);                  // Convert hour to 12-hour time format
    h = h % 12;
    if (h == 0) {
        h = 12;
    }

    // Controls the Final formatting of the clock string
    return (day).bold() + ", " + n + " " + d + ", " + h + ":" + m + ":" + s + " " + AMPM;
}

// Helper functions for createClock()
function dayToStr(day) {
    return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day];
}

function monthToStr(month) {
    return ["January","February","March","April","May","June","July","August","September","October","November","December"][month];
}

function dateToStr(date) {
    if (date == 11 || date == 12 || date == 13) {
        return date + "th";
    }

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

// If minutes or seconds variable is a single digit, add zero before it so it looks nice
function formatTime(time) {
    if (time >= 0 && time < 10) {
        time = "0" + time;
    }
    return time;
}

// Given an hour, determine if it's in the AM or PM
function getAMPM(hour) {
    return ["AM","PM"][(((hour % 24) >= 12) & 1)];
}

/*
 * Procedurally create equivalency meal exchange rate bars
 */
function createEqMealBars(EqMeals) {
    
    // EqMeals is a 2D array of values that shows HOW MUCH an equivalency meal is worth AT WHAT times
    var rows = EqMeals.length;
    var columns = EqMeals[0].length;

    // Calculate the total number of minutes Sodexo facilities are open
    var startMin = timeInMin(EqMeals[0][0], EqMeals[0][1]);
    var endMin = timeInMin(EqMeals[rows - 1][0], EqMeals[rows - 1][1]);   
    var totalMin = endMin - startMin;

    // For each block, find its time as a proportion of the total time, and create a bar of proportional width
    for (var i = 0; i < rows - 1; i++) {
        
        // Set up variables that specify the horizontal bar's name and width, then add it
        var blockMin = timeInMin(EqMeals[i + 1][0], EqMeals[i + 1][1]) - timeInMin(EqMeals[i][0], EqMeals[i][1]);
        var blockWidth = (blockMin / totalMin) * 100 + "%";

        // Format time information, then display it ABOVE the bar
        var hour = EqMeals[i][0] % 12;              // 12-hour time
        var minute = formatTime(EqMeals[i][1]);     // Add '0' before minute if minute < 10
        var AMPM = getAMPM(EqMeals[i][0]);          // Is it AM or PM?

        // Pull price information, then display it ON the bar
        var price = EqMeals[i][2];

        // Generate the blocks and surrounding text (requires nested divs)
        $('#rate-bars-container').append(
            $('<div/>', {
                id: "block" + i,
                class: "rate-bars",
                css: {
                    width: blockWidth,
                }
            }).append(
                $('<div/>', {
                    id: "time-text" + i,
                    class: 'time-text',
                    text: hour + ":" + minute + " " + AMPM
                })
            ).append(
                $('<div/>', {
                    class: 'price-text',
                    text: "$" + price
                })
            )
        );
    }

    // Do something special to pull closing time and put it ABOVE the bar and flush right
    var hour = EqMeals[rows-1][0] % 12;             // 12-hour time
    var minute = formatTime(EqMeals[rows-1][1]);    // Add '0' before minute if minute < 10
    var AMPM = getAMPM(EqMeals[rows - 1][0]);       // Is it AM or PM?
    
    $('<div/>', {
        class: 'time-text-closing',
        text: hour + ":" + minute + " " + AMPM
    }).appendTo("#block" + (rows - 2)); // Just to keep thing simple, we'll make it a subclass of the last horizontal bar
}

/*
 * Set arrow location depending on equivalency meal value
 */
function setArrowPosition(EqRates) {

    // EqRates is a 2D array of time slots and corresponding equivalency rates
    var rows = EqRates.length;

    // Get some time information
    var today = new Date();

    var currentMin = dateInMin(today);                                      // Current time in minutes from midnight
    var openMin = timeInMin(EqRates[0][0], EqRates[0][1]);                  // 7:30 AM - same format
    var closeMin = timeInMin(EqRates[rows - 1][0], EqRates[rows - 1][1]);   // 2:00 AM the NEXT DAY - same format
    var DAY_IN_MINUTES = 24*60;                                             // Will be useful later on for subtracting

    // If it is between midnight and 2AM the next day, correct for that by adding a day of minutes
    if (currentMin >= 0 && currentMin < 120) {
        currentMin = currentMin + DAY_IN_MINUTES;
    }

    // If it is after 7:30 AM OR before 2:00 AM on the SAME DAY, show the arrow, otherwise hide it
    if (currentMin >= openMin || currentMin < closeMin - DAY_IN_MINUTES) {

        /* Place the "current time" arrow as such:
         * 1) Subtract currentMin by openMin so the arrow is at 0(%) displacement at 7:30 AM
         * 2) Divide by (closeMin - openMin), the minutes from open to close time, so that at close time, the arrow is at 100(%) displacement
         * 3) There is 5px of offset from the width of the arrow, convert that to a (%) and subtract it
         * 4) Multiply by 100 so we have an actual percent
         * 5) Set this absolute number to the left-margin shift
         */
        var timelinePercent = [(currentMin - openMin)/(closeMin - openMin) - (7.5/$("#rate-bars-container").width())] * 100;
        $("#arrow").css("margin-left", timelinePercent + "%");
    } else {
        var startPercent = [(openMin - openMin)/(closeMin - openMin) - (7.5/$("#rate-bars-container").width())] * 100;
        $("#arrow").css("margin-left", startPercent + "%");
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
    document.getElementById("accordion").innerHTML = "";

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

    // Iteratively create a div with the name of the dining hall
    $('.panel-heading').each(function(index) {

        jQuery('<div/>', {
            class: 'panel-title left',
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
        schURL = operatingHours[index][2];

        // If no menu exists, don't show the link for it
        if (menuURL === "#") {
            $("#" + index).html("<a href=" + schURL + ">Schedule</a>");
        } else {
            $("#" + index).html("<a href=" + menuURL + ">Menu</a> - <a href=" + schURL + ">Schedule</a>");
        }
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

            jQuery('<div/>', {
                class: 'panel-body neutral',
                text: output[2]
            }).appendTo($(this));

        } else if (output[0] == 1) {

            jQuery('<div/>', {
                class: 'panel-body closed',
                text: output[1]
            }).appendTo($(this));

            jQuery('<div/>', {
                class: 'panel-body neutral',
                text: output[2]
            }).appendTo($(this));
        }
    });
}

/* 
 * Interate through each dining facility in the array 'operatingHours', (facilities are ID'd by their location or 'hallCode' in 'operatingHours')
 * Return a string saying whether the dining facility is open or not
 */
function returnOpenOrClosed(operatingHours, hallCode) {
    
    // Get the current time and convert it into minutes after midnight (i.e. 8:00 AM is 8 * 60 = 480) for easy ordering
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();

    var currentMin = timeInMin(hour, minute);

    // Since 'operatingHours' groups Mon-Thurs (as per Sodexo schedule), 'day' needs to be converted to 'dayCode' to select the correct day's schedule
    var day = today.getDay();
    var dayCode = getDayCode(day);

    // Specify where to start and end interation (over the range of block types)
    var startBlock = 3;  // Indices 0, 1, and 2 are reserved for dining hall metadata
    var blocks = operatingHours[hallCode].length;

    // Now iterate over all blocks for a given dining hall and day and determine if the facility is open/closed
    for (var i = startBlock; i < blocks; i++) {
        
        var blockOpenMin = timeToMin(operatingHours[hallCode][i][dayCode])[0];          // start time of current block (in minutes after midnight)
        var blockCloseMin = timeToMin(operatingHours[hallCode][i][dayCode])[1];         // end time of current block (in minutes after midnight)

        if (currentMin >= blockOpenMin && currentMin < blockCloseMin) {                 // Case 1: A facility is open, find when it closes

            var blockName = operatingHours[hallCode][i][0];
            var closeStr = closeTime(operatingHours[hallCode][i][dayCode]);

            return [0, "OPEN", "- for " + blockName + " until " + closeStr];
        }
    }

    for (var i = day; i % 7 != day - 1; i++) {

        var dayCode = getDayCode(i % 7);
        for (var j = startBlock; j < blocks; j++) {

            var blockOpenMin = timeToMin(operatingHours[hallCode][j][dayCode])[0];  // start time of current block (in minutes after midnight)
            if (!(blockOpenMin === "N/A")) {
                

                if (i == day && currentMin < blockOpenMin) {
                    var blockName = operatingHours[hallCode][j][0];
                    var openStr = openTime(operatingHours[hallCode][j][dayCode]);

                    return [1, "CLOSED", "- opens for " + blockName + " at " + openStr];
                } else if (i > day) {
                    var blockName = operatingHours[hallCode][j][0];
                    var openStr = openTime(operatingHours[hallCode][j][dayCode]);
                    var openDay = dayToStr(i % 7);

                    return [1, "CLOSED", "- opens for " + blockName + " on " + openDay + " at " + openStr];
                }
            }
        }
    }
}

/*
 * Deserializes the time in 'operatingHours' by converting the start and end times to minutes after midnight; result displayed in array of size 2:
 * [openMin, closeMin] for the given 'str'
 */
function getDayCode(day) {
    if (day >= 1 && day <= 4) { // Monday-Thursday is in col 1, col 0 reserved Dining Hall and "block type" (i.e. breakfast, brunch, late night) names
        dayCode = 1;
    } else if (day == 5) {      // Friday is in col 2
        dayCode = 2;
    } else if (day == 6) {      // Saturday is in col 3
        dayCode = 3;
    } else if (day == 0) {      // Sunday is column 4
        dayCode = 4;
    }
    return dayCode;
}

function timeToMin(str) {
    if (str === "N/A") {
        var output = ["N/A", "N/A"];
    } else {
        var res = str.split(/-|:/);
        var output = [timeInMin(parseInt(res[0]), parseInt(res[1])), 
                      timeInMin(parseInt(res[2]), parseInt(res[3]))]
    }
    return output;
}

// Deserializes the time in 'operatingHours' by converting start and end times to easily-readable strings
function openTime(str) {
    if (str === "N/A") {
        return str;
    } else {
        var res = str.split(/-|:/);

        var hour = res[0];
        var min = res[1];
        var AMPM = getAMPM(hour);

        if (hour == 24 && min == 0) {
            return "midnight";
        }
        
        hour = hour % 12;
        if (hour == 0) {
            hour = 12;
        }

        return hour + ":" + min + " " + AMPM;
    }
}

function closeTime(str) {
    if (str === "N/A") {
        return str;
    } else {
        var res = str.split(/-|:/);

        var hour = res[2];
        var min = res[3];
        var AMPM = getAMPM(hour);

        if (hour == 24 && min == 0) {
            return "midnight";
        }
        
        hour = hour % 12;
        if (hour == 0) {
            hour = 12;
        }

        return hour + ":" + min + " " + AMPM;
    }
}