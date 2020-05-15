// 
// Define globally-scoped variables
// 

// Time formats
let TIME12WSEC = 'h:mm:ss a';
let TIME12WOSEC = 'h:mm a';
let TIME24WSEC = 'HH:mm:ss';
let TIME24WOSEC = 'HH:mm';
let FORMATTEDTIME = TIME12WSEC; // Default formatted time
let TRUESECONDS = ''; // boolean true if show seconds is true
let TRUE12HR = ''; // boolean true if numHrs is 12

// Time Zone globally-scoped variables
let zones = [];
let dropDown = '';
let selectedZone = '';

// 
// Document Ready Handler
// 
$(function(){
  selectedZone = 'Pacific/Auckland';
  renderTime();
  setInterval(renderTime, 1000); // update clock every second
  makeDropDown();
});

// Document functions

// *********************************************************** //
// render the time in the chosen format and put it in the html //
// *********************************************************** //
/**
* Render Time Function
*
* What comes in: 
* @FORMATTEDTIME {string}
* @return {string} Returns a string with formatted time and sends it placeholder html
* Errors thrown e.g. @throws {RangeError} and why
*/

function renderTime(){
  $('#forTime').html(moment().format(FORMATTEDTIME)); // local time
  $('#forTime2').html(moment().tz(selectedZone).format(FORMATTEDTIME)); // time in selected zone
}
// *********************************************************** //
// populate the timezone dropdown //
// *********************************************************** //
/**
* Create dropdown for timezone selection
*
* What comes in: 
* @zones.json {json object}
* @#timeZone {ID of select for the dropdown}
* @return {string} Returns a string with formatted time and sends it to placeholder html ID
* Errors thrown e.g. @throws {RangeError} and why
*/

// source: https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json
// shortcut for full AJAX call: https://api.jquery.com/jQuery.getJSON/
function makeDropDown(){
  dropDown = $('#timeZone'); // dropDown is the ID of the select element in the html
  dropDown.empty(); // empty whatever is in the dropdown to start with
  // create a disabled but selected default to tell people to use the dropdown
  dropDown.append('<option selected="true" disabled>(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>')
  dropDown.prop('selectedIndex', 0);
  // give the json file a name
  const jsonUrl = './zones.json';
  // feels like an AJAX call to get the data
  $.getJSON(jsonUrl, function(zones){
    for (const z of zones){
      dropDown.append($('<option></option>').attr('value', z.city).text(`${z.name}`));
    }
  });
}

// Event handler for when the dropdown is changed to choose a new zone
$('#timeZone').change(function(){ // triggers the function EVERY time you change the select
  ifTrue();
  selectedZone = $('#timeZone option:selected').val();
  console.log(selectedZone);
  // renderTime();
});

// ********************************************************* //
// Click Handler checking for 12/24 hr and show/hide seconds //
// ********************************************************* //
/**
* Define Time format
*
* What comes in: 
* @showSeconds {boolean}
* @numHrs {string} 12 or 24
* @return {string} Returns a string that defines the time format
* Errors thrown e.g. @throws {RangeError} and why
*/

function ifTrue(){
  TRUESECONDS = ($("input[id][name$='showSeconds']").prop( "checked" ));
  TRUE12HR = ($("input[id][name$='numHrs']").prop( "checked" ))
  if (TRUESECONDS && TRUE12HR){
    FORMATTEDTIME = TIME12WSEC
    }
    else{
      if (TRUESECONDS && !TRUE12HR){
        FORMATTEDTIME = TIME24WSEC
        }
        else{
          if (!TRUESECONDS && TRUE12HR){
            FORMATTEDTIME = TIME12WOSEC
            }
            else{
                FORMATTEDTIME = TIME24WOSEC
              }
            }
    }
}

$('#showSeconds').click(function(){
  ifTrue();
  renderTime();
});
$('#numHrs').click(function(){
  ifTrue();
  renderTime();
});


/**
* Create dropdown for timezone
*
* What comes in: 
* @TIMEZONE {object}
* @return {string} Returns a string to pass to the mustache to renderTime function to forTime2
* Errors thrown e.g. @throws {RangeError} and why
*/



// ************** //
// Click Handlers //
// ************** //

/**
* Click Handler for Timezone selection (Select)
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* Click Handler for 12 vs 24 hr and show/hide seconds selection (checkbox custom-switch)
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/


/**
* Click Handler for pulsing divider option (radio)
* Can I animate the radio button to help illustrate?
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* Description
*
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/

/**
* First test of moment.js
* 
* What comes in e.g. @param {string} boogers which is the string
* What goes out e.g. @return {jQuery} Returns a jQuery ojbect that contains...
* Errors thrown e.g. @throws {RangeError} and why
*/
