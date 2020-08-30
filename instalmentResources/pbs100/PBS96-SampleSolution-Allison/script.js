/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// 
// Define globally-scoped variables
// 

// Time formats
let h = 'h';
let m = 'mm';
let s = 'ss a';
let TIME12WSEC = 'DD MMMM YYYY h:mm:ss a';
let TIME12WOSEC = 'DD MMMM YYYY h:mm a';
let TIME24WSEC = 'DD MMMM YYYY HH:mm:ss';
let TIME24WOSEC = 'DD MMMM YYYY HH:mm';
let FORMATTEDTIME = TIME12WSEC; // Default formatted time
// 
let TRUESECONDS = true; // boolean true if show seconds is true
let TRUE12HR = true; // boolean true if numHrs is 12

// TimeShifter variables
let hrsShifted = '';
let minShifted = '';

// Create an array from the official list of timezone names
let TzNamesArray = moment.tz.names();
// don't understand this but it takes the array which is just a list of the region/city and makes it into an object where the key is the region/city and so is the value. which for some reason works in autocomplete!
let tzNamesObject = TzNamesArray.reduce(function(o, val) { o[val.replace('_',' ')] = val; return o; }, {});

 // declare two global moment objects to be used in 12/24 hour toggle
 let momentObjST1 = {};
 let momentObjST2 = {};

// 
// Document Ready Handler
// 
$(function(){
  /**
  * A class to create clocks
  *
  * Dictionary to build the clock: 
  * @timeDescription - The text to explain what clock is showing
  * @#timeID - name for the id of the div that will hold the clock
  * @location - if specifying a particular location, a string of the format "region/city" per zones.js
  * @interval - boolean if true, setInterval() fires and keeps clock updated. Static clocks required for Time Shifting
  * @startTimeH - for static clocks, the hour on which to start display
  * @FORMATTEDTIME - string - global variable holding the format for displaying the time as chosen by show/hide seconds and 12/24 clock check boxes
  * 
  * Instance functions:
  * @aRenderTime - renders the html for the clocks with inputs of timeID,location and time format
  * @clockInterval - sets the interval for the clock
  * Errors thrown e.g. @throws {RangeError} and why
  * Errors thrown e.g. @throws {TypeError} and why
  */
  class AClock{
     // Clock will go into either the existing shifting or static placeholder div
    /**
     * @type {object} div where the clock will be placed, default is shiftingClocksPlaceholdery
     */
    get clockPlaceholder(){
      return this._clockPlaceholder;
    }
    /**
     * @type {object} div where the clock will be placed
     * @throws {RangeError} if not one of two values
     */
    set clockPlaceholder(cph){
      if((cph == shiftingClocksPlaceholder) || (cph == staticClocksPlaceholder)){
          this._clockPlaceholder = cph;
        }else{
        throw new RangeError(`clockPlaceholder must be either shiftingClocksPlaceholder or staticClocksPlaceholder`)
        }
      this._clockPlaceholder = cph;
    }
    //
    // Create the ID into which the description for the clock instance will be placed
    //
    /**
    * @type {string}  
    */
    get timeDescriptionID(){
      return this._timeDescriptionID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * // no range error because I have a default
    */
    set timeDescriptionID(tdid){
      if(is.not.string(tdid)){
        throw new TypeError('Time description ID must be a string');
      }
      this._timeDescriptionID = tdid;
    }
    // Ensure clock's card background color is one defined in Bootstrap documentation
    // https://getbootstrap.com/docs/4.0/utilities/colors/#background-color
    /**
    * @type {string}  
    */
   get bgcolor(){
    return this._bgcolor;
  }
  /**
  * @type {string}
  * @throws {RangeError}
  */
  set bgcolor(bgc){
    if((bgc !== 'bg-primary') && (bgc !== 'bg-secondary') && (bgc !== 'bg-success') && (bgc !== 'bg-info') && (bgc !== 'bg-light') && (bgc !== 'bg-dark') && (bgc !== 'bg-white')){
      throw new RangeError('Card background color must be one defined by Bootstrap documentation at https://getbootstrap.com/docs/4.0/utilities/colors/#background-color');
    }
    this._bgcolor = bgc;
  }
  // Create border around clocks
  /**
  * @type {string}  
  */
  get boardr(){
    return this._boardr;
  }
  /**
  * @type {string}
  * @throws {RangeError}
  */
  set boardr(brdr){
    // need to define range error - annoying because so many wrong answers

    this._boardr = brdr;
  }
    //
    // Create the description of the clock instance
    //
    /**
    * 
    * @type {string}  
    */
    get timeDescription(){
      return this._timeDescription;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * // no range error because I have a default
    */
    set timeDescription(td){
      if(is.not.string(td)){
        throw new TypeError('Time description must be a string');
      }
      this._timeDescription = td;
    }
    //
    // the ID into which the clock will be placed
    //
    /**
    * @type {string}
    */
     get timeID(){
      return this._timeID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * @throws {RangeError}
    */
    set timeID(tid){
      if(is.not.string(tid)){
        throw new TypeError('timeID must be a string');
      }
      if(is.empty(tid)){
        throw new RangeError('You must enter a timeID')
      }
      this._timeID = tid;
    }

    // Determine if clock will be timeshifted or static
    // If static it will update with interval
    /**
     * @type {Boolean}
     */
    get timeShifted(){
      return this._timeShifted;
    }
    /**
     * @type {boolean} defaults to true
     * @throws {TypeError} if not boolean
     */
    set timeShifted(ts){
      if(typeof ts === 'boolean'){
        this._timeShifted = ts;
      } else {
        if(typeof ts === 'undefined'){
          this._timeShifted = true;
        }else{
            throw new TypeError('timeShifted must be true or false')}
      }  
    }
    // Choose a time format
    /**
     * @type {string}
     */
    get timeFormat(){
      return this._timeFormat;
    }
    /**
     * @type {Global Variable}
     * @throws {TypeError} if not one of two variables
     */
    set timeFormat(tf){
      if(tf == TIME12WSEC || tf == TIME24WSEC){
        this._timeFormat = tf;
      } else {
        if(tf === 'undefined'){
          tf = FORMATTEDTIME;
        } else {
          throw new RangeError('timeFormat must be TIME12WSEC or TIME24WSEC')
        }
      }
    }        
    // ID for the Div to hold the search box
    /**
     * @typeof {string} Unique name of div for search box 
     */
    get searchBoxDivID(){
      return this._searchBoxDivID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * @throws {RangeError}
    */
    set searchBoxDivID(sbdid){
      if(!sbdid){
        return;
      } else {
        if(is.not.string(sbdid)){
          throw new TypeError('searchBoxDivID must be a string');
        } else {
        this._searchBoxDivID = sbdid;
        }
      } 
    }
    // ID for the search box itself
     /**
     * @typeof {string} Unique name of div for search box 
     */
    get searchBoxID(){
      return this._searchBoxID;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    */
    set searchBoxID(sbid){
      if(!sbid){
        return;
      }
      if(is.not.string(sbid)){
       throw new TypeError('searchBoxID must be a string');
      }
      this._searchBoxID = sbid;
    } 
    // Determine if a font awesome icon has been provided to prepend to search box
    /**
     * @typeof {string} font awesome name
     * 
    */
    get fas(){
      return this._fas;
    }
    /**
    * @type {string}
    * @throws {TypeError}
    * really should include a range error but the field of options is too vast
    * If none provided, then none used
    */
   set fas(fa){
     if (!fa){
       return;
     }
     if(is.not.string(fa)){
      throw new TypeError('fas must be a string representing the font awesome icon you want');
     }
     this._fas = fa;
   }

    /**
     * 
     * @typeof {string} location 
     */
    get location(){
      return this._location;
    }
    /**
     * 
     * @typeof {string} location
     * @throws {typeError}
     * @throws {rangeError} if not from the TzNamesArray values 
     */
    set location(loc){
      if(is.not.string(loc)){
        throw new TypeError('Location must be a string')
      } else {
        if(!TzNamesArray.includes(loc)){
          throw new RangeError('Location must be a city listed in moment.tz.names() from moment.js')
        } else {
        this._location = loc;
        }
      }
    }

    //
    // define the constructor
    //
    constructor(details){
      // Choose whether clock goes in shifting or static div
      this.clockPlaceholder = details.clockPlaceholder;

      // Text to be shown before time in clock
      this.timeDescriptionID = details.timeDescriptionID;
      this.timeDescription = details.timeDescription; // could throw error

      // set background color of clock
      this.bgcolor = details.bgcolor;

      // set border for clock
      this.boardr = details.boardr;

      // Unique IDs to hold the time (must have values)
      this.timeID = details.timeID; // could throw error

      // pulse if value of pulseMe is the class .pulse
      this.pulseMe = details.pulseMe;

      // Setting default location of clock if not defined
      this.location = details.location;

      // determine if the clock will move with the timeshifter
      this.timeShifted = details.timeShifted;

      // time format variable to allow change with slider
      this.timeFormat = details.timeFormat;
      
      // Unique Div to hold the text box for search
      this.searchBoxDivID = details.searchBoxDivID;

      // Unique ID to hold the text box for search
      this.searchBoxID = details.searchBoxID;

      // Apply font awesome to only shifting clocks
      this.fas = details.fas;
    }
    //  Define the Instance functions
    aRenderTime(){
        $(`#${this.timeID}`).html(moment.tz(this.location).format(FORMATTEDTIME));
      }  
  
    // Render the html for the clocks
    putClockUp(){
      // Convert the placeholder template script to a string
      let clockCardTemplate = $('#clockCards').html();
      // render the html for the clocks
      $(this.clockPlaceholder).append(Mustache.render(clockCardTemplate, this));
      this.aRenderTime();
      }
    clockInterval(){ // only static clocks show changing seconds
      if(!this.timeShifted){
        setInterval(this.aRenderTime.bind(this), 1000);
      }else{return}
    }

    shiftTime(){
      // if this.timeShifted is true, then shift time with sliders
      let self = this;
      if (this.timeShifted){
        // shift hours
        $('#changeHrs').on('input change', function(){
          let currentTime = moment.tz(self.location);
          let roundDownTime = currentTime.startOf('h');
          $(`#${self.timeID}`).html(roundDownTime.add(this.value, 'h').format(FORMATTEDTIME));
        })
        // shift min
        $('#changeMin').on('input change', function(){
          $(`#${self.timeID}`).html(roundDownTime.add(this.value, 'm').format(self.timeFormat));
        })
      }else{return}
    }
    // Add text search box for cities
    addSearchBox(){
      if (this.searchBoxDivID){
        if(this.searchBoxID){
          const $thisSearchBox = $('<input type="text">').addClass("mySearchboxes w-100 border-0").attr('id', `${this.searchBoxID}`).attr('placeholder', `default: ${this.location})`);
          // define a variable for the div which will hold the <input> text box
          let aSearchBoxDivID = $(`#${this.searchBoxDivID}`);
          aSearchBoxDivID.append($thisSearchBox);
        }else{throw new Error('You must provide a searchBoxID for the search box')}
      }else{
        throw new Error('You must provide a searchBoxDivID to hold the search box')
      }
    }

    addFasPrepend(){
      
    }
  } // complete AClock Class definition
  
  // Create a function to make the clocks
  // Accept parameters a,b,c,d as the query string values to populate searchClock1 and 2 for location and timeDescription
  // a and c are the location names in the search boxes
  // b and d are the timeDescriptions, e.g. "Time in Europe/London becomes"
  function makeClocks(a,b,c,d){ 
    // create instances of AClock as desired

    localClock = new AClock ({
      clockPlaceholder: staticClocksPlaceholder,
      timeDescriptionID: 'localID',
      bgcolor: 'bg-light',
      boardr: '',
      timeDescription: 'Your current local time is:',
      timeID: 'localTime',
      timeFormat: TIME12WSEC,
      location: moment.tz.guess(true),
      timeShifted: false,
    });
    searchClock1 = new AClock({
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescriptionID: 'search1TSID',
      bgcolor: 'bg-light',
      boardr: 'border border-primary rounded',
      timeDescription: b,
      timeID: 'search1Time',
      timeFormat: TIME12WSEC,
      timeShifted: true,
      location: a,
      searchBoxDivID: 'sbsearchClock1Div',
      searchBoxID: 'sbsearchClock1',
    });
    searchClock2 = new AClock({
      clockPlaceholder: shiftingClocksPlaceholder,
      timeDescriptionID: 'search2TSID',
      bgcolor: 'bg-light',
      boardr: 'border border-primary rounded',
      //timeDescription: 'Time in Europe/Dublin becomes:',
      timeDescription: d,
      timeID: 'search2Time',
      timeFormat: TIME12WSEC,
      timeShifted: true,
      location: c,
      searchBoxDivID: 'sbsearchClock2Div',
      searchBoxID: 'sbsearchClock2',
    });
    // Put the clocks up, enable/disable interval, and enable timeshifting
   
    // Local Clock static (non-shifting)
    // Doesn't shift time and doesn't have a search box
    localClock.putClockUp(staticClocksPlaceholder);
    localClock.clockInterval()

    // Searchboxes clock timeshifted
    searchClock1.putClockUp();
    searchClock1.clockInterval();
    searchClock1.shiftTime();
    searchClock1.addSearchBox();

    searchClock2.putClockUp();
    searchClock2.clockInterval();
    searchClock2.shiftTime();
    searchClock2.addSearchBox();
  }

  // pull the query string that may have been received in the URL
  const queryStringReceived = window.location.search;

  // Determine if URL has a query string and pass values to search clocks or send defaults if not
  function checkQuery(){
    // regex to find spaces
    const space = /\s/g;
    // if URL has no query string use these defaults
    if (queryStringReceived==""){
      // default city and location description for searchClock1
      sC1 = "America/Los_Angeles";
      sTD1 = 'Time in America/Los_Angeles becomes:';
      // default city and location description for searchClock1
      sC2 = "Europe/Dublin";
      sTD2 = 'Time in Europe/Dublin becomes:';
    } else {
      myUrlParam = new URLSearchParams(queryStringReceived);
      // If URL does have a query string, pull the time descriptions for search clocks
      // These exist even if the user hasn't entered a search city
      sTD1 = myUrlParam.get('searchTimeDesc1')
      sTD2 = myUrlParam.get('searchTimeDesc2')

      // Check to see if a search city has been entered for the search clocks
      // If not set it to the defaults
      // If they have, pull it from the query string
      if (myUrlParam.get('searchCity1') == ""){
        sC1 = "America/Los_Angeles";
      } else {
        // pull search city from the url and replace any spaces in the name with underscores
        sC1 = myUrlParam.get('searchCity1').replace(space, '_'); 
        console.log(sC1);
      }

      if (myUrlParam.get('searchCity2') == ""){
        sC2 = "Europe/Dublin";
      } else {
        // pull search city from the url and replace any spaces in the name with underscores
        sC2 = myUrlParam.get('searchCity2').replace(space, '_'); 
      }
    }
  }
   
  checkQuery();

  // make the individual clocks:
  // pass parameters for cities and locations to searchClock 1 and 2  that were parsed from the URL query string
  makeClocks(sC1,sTD1,sC2,sTD2);  

  // Set time on searchClock1 to the entered location
  function onSelectItem1(item){
    searchClock1.location = `${item.value}`;
    searchClock1.timeDescription = `Time in ${item.label} becomes:`;
    $(`#${searchClock1.timeDescriptionID}`).html(searchClock1.timeDescription);
    searchClock1.aRenderTime();
    // reset local and other search clock back to current time (since searchClock1 starts at current time)
    searchClock2.aRenderTime();
    // reset range slider and label back to 0
    $("input[type=range]").val(0);
    showSliderLabel();
  }
  // Set time on searchClock2 to the entered location
  function onSelectItem2(item){
    searchClock2.location = `${item.value}`;
    searchClock2.timeDescription = `Time in ${item.label} becomes:`;
    $(`#${searchClock2.timeDescriptionID}`).html(searchClock2.timeDescription);
    searchClock2.aRenderTime();
    // reset local and other search clock back to current time (since searchClock2 starts at current time)
    searchClock1.aRenderTime();
    // reset range slider and label back to 0
    $("input[type=range]").val(0);
    showSliderLabel();
  }

  // Click function for 12/24 hour toggle
  $('#numHrs').click(function(){
    // run ifTrue function which sets the FORMATTEDTIME variable to either 12 (checked) or 24 (unchecked). Just sets this value, no visual change onscreen
    ifTrue();

  // Create two moment objects with the time delivered by the query string (if there is one)
  if (window.location.search && ($('.slider_label') == 0)){
    const queryStringSend = window.location.search;
    myUrlParam = new URLSearchParams(queryStringSend);
    // create moment objects from the strings for the received time in the URL
    // This works perfectly - keeps the times that came in and does the 12/24 toggle
    // console.log(`searchtime1 from query string is ${myUrlParam.get('searchtime1')}`);
    momentObjST1 = moment(`${myUrlParam.get('searchtime1')}`);
    momentObjST2 = moment(`${myUrlParam.get('searchtime2')}`);
    } else {

    // works to toggle but uses the time when the page loaded instead of the timeshifted time,
    // creates strings from the visible time values for time-shifted clocks
    let searchT1 = $('#search1Time').html(); 
    // console.log(`searchT1 is currently: ${searchT1}`); // date/time
    // console.log(`searchT1 is of type: ${typeof searchT1}`); // string
    let searchT2 = $('#search2Time').html();
    // creates a moment objects from time strings
    momentObjST1 = moment(searchT1); 
    // console.log(`moment object ST1 is: ${momentObjST1}`);
    // console.log(`moment object ST1 is of type: ${typeof momentObjST1}`); // object
    momentObjST2 = moment(searchT2);
  }
    
    // render moment objects with toggled time format back into clocks
    $('#search1Time').html(momentObjST1.format(FORMATTEDTIME));
    $('#search2Time').html(momentObjST2.format(FORMATTEDTIME));
      
    // localTSClock.aRenderTime();
  });

  // function to show value chosen on range sliders
  // https://codepen.io/prasanthmj/pen/OxoamJ
  function showSliderLabel(){
    $(function(){
      $('.slider').on('input change', function(){
        $(this).next($('.slider_label')).html(this.value);
        });
        $('.slider_label').each(function(){
          var value = $(this).prev().attr('value');
          $(this).html(value);
        });
      });
  }
  showSliderLabel();

  // Adds Bootstrap autocomplete function to the ID #myAutocomplete

  $('#sbsearchClock1').autocomplete({
      source: tzNamesObject, // dictionary object with the values from which to search
      onSelectItem: onSelectItem1, // callback to run when item is selected
      highlightTyped: false, // if typed text is highlighted in search results, the name gets broken in two for screen readers. e.g. "Det roit"
      treshold: 3 // minimum characters to search before it starts displaying
  });
  $('#sbsearchClock2').autocomplete({
      source: tzNamesObject, // dictionary object with the values from which to search
      onSelectItem: onSelectItem2, // callback to run when item is selected
      highlightTyped: false, // if typed text is highlighted in search results, the name gets broken in two for screen readers. e.g. "Det roit"
      treshold: 1 // minimum characters to search before it starts displaying
  });


// ********************************************************* //
// Click Handler checking for 12/24 hr //
// ********************************************************* //
/**
* Define Time format
*
* What comes in:
* @numHrs {string} 12 or 24
* @return {string} Returns a string that defines the time format
*/

  function ifTrue(){
    TRUE12HR = ($("input[id][name$='numHrs']").prop( "checked" ))
    if (TRUE12HR){
      FORMATTEDTIME = TIME12WOSEC;
    } else {
      FORMATTEDTIME = TIME24WOSEC;
      }
    }

// creating sendable times
  
function setTimesFromURL(){
  if (window.location.search){
    // queryStringSend;
    // myUrlParam = new URLSearchParams(queryStringSend);
    // set times
    // Set 12/24 hour toggle to match format of incoming times
    time12 = myUrlParam.get('time12')
    if (time12 == "false"){
      $('#numHrs').prop('checked', false);
      FORMATTEDTIME = TIME24WSEC;
    }
    $('#localTSTime').html(`${myUrlParam.get('loctime')}`)
    $('#search1Time').html(`${myUrlParam.get('searchtime1')}`)
    $('#search2Time').html(`${myUrlParam.get('searchtime2')}`)

    // set location names (timeDescription)
    // $('#localTSID').html(`${myUrlParam.get('localTimeDesc')}`)
    $('#search1TSID').html(`${myUrlParam.get('searchTimeDesc1')}`)
    $('#search2TSID').html(`${myUrlParam.get('searchTimeDesc2')}`)
    // if no search city is entered, this will be blank 
    $('#sbsearchClock1').val(`${myUrlParam.get('searchCity1')}`)
    $('#sbsearchClock2').val(`${myUrlParam.get('searchCity2')}`)
  }
}
setTimesFromURL();

  // Event handler for the copy button to create the URL
  $('#copyBtn').click(function(){

    function createURL(){
      // need to remove spaces in values & replace with +
      const space = /\s/g;

      // check to see if 12/24 toggle is on 24
      let time12 = new Boolean(); // defaults to false
      if ($('#numHrs').prop('checked') == false){
        time12 = false;
      }else{
        time12 = true;
      } 

      // find search times and remove spaces
      // let localT = $('#localTSTime').html();
      let searchT1 = $('#search1Time').html();
      let searchT2 = $('#search2Time').html();

      // let lT = localT.replace(space, '+')
      let sT1 = searchT1.replace(space, '+')
      let sT2 = searchT2.replace(space, '+')

      // find time descriptions (locations) and search city names & remove spaces
      // let localTimeDesc = $('#localTSID').html();
      let searchTimeDesc1 = $('#search1TSID').html();
      let searchTimeDesc2 = $('#search2TSID').html();
      let searchCity1 = $('#sbsearchClock1').val();
      let searchCity2 = $('#sbsearchClock2').val();

      // trim any spaces on either side and replace spaces with + so the URL works
      // let lTD = localTimeDesc.trim().replace(space, '+');
      let sTD1 = searchTimeDesc1.trim().replace(space, '+');
      let sTD2 = searchTimeDesc2.trim().replace(space, '+');
      let sC1 = searchCity1.trim().replace(space, '+')
      let sC2 = searchCity2.trim().replace(space, '+')

      // split the url to remove any existing search queries
      let thisURL = $(location).attr('href').split("?")[0];
      // create the url adding FORMATTEDTIME to the end
      sendableURL = `${thisURL}?searchtime1=${sT1}&searchtime2=${sT2}&searchTimeDesc1=${sTD1}&searchTimeDesc2=${sTD2}&searchCity1=${sC1}&searchCity2=${sC2}&time12=${time12}`
      
      // create dummy text area to hold sendableURL so we can copy it, then remove text area
      // https://www.sharmaprakash.com.np/javascript/copying-value-from-variable-to-clipboard/
      var dummyTextInput = $('<input>').val(sendableURL).attr('id',"#dummyText").attr('class', 'dummy').appendTo('#dummy').select()
      document.execCommand("copy");
      alert('Sendable times URL copied to your clipboard and ready to send to your colleague.')
      $('input').remove('.dummy')
     
      
      // alert(`Copy this URL and send it to someone:\n\n${sendableURL}`);
    }
    // if both search boxes are empty, create the URL with the defaults
    if (($('#sbsearchClock1').val() == '') && ($('#sbsearchClock2').val() == '')) {
      createURL();
    } else {
      
      // put underscores in region/city name before testing if it's in the time zone array
      const space = /\s/g;
      let sbclock1Under = $('#sbsearchClock1').val().replace(space, '_')
      let sbclock2Under = $('#sbsearchClock2').val().replace(space, '_')
    
      // (if 1 is not in array AND 1 is not blank) OR (2 is not in array and 2 is not blank)
      if ((!TzNamesArray.includes(sbclock1Under) && !sbclock1Under == '') 
      || 
      (!TzNamesArray.includes(sbclock2Under) && !sbclock2Under == ''))
      {
        alert('You must search and select a valid city from the dropdown')
      } else {
        // if both values in both searchboxes have been chosen from the dropdown, create the URL
        createURL();
      }
    }
    
  })

}); // end document ready