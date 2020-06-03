# PBS 26 of x – HTML Data Attributes with jQuery

After our brief division in the previous instalment, it’s time to get back to learning new things. We’ll learn about data attributes – a mechanism for embedding data into HTML elements.

We’ll also revise what we learned about defining our own object prototypes to start including prototypes in our APIs.

Finally, as a practical worked example, we’ll build a better clock API for Allison’s website. Each Sunday she streams the live recording of her podcast from [podfeet.com/live](http://podfeet.com/live) at 5pm at her house. To avoid timezone confusion, Allison would like a clock on that page that shows the current time at her house.

As usual I’ve packaged all the files needed for the worked example into a ZIP file which you can [download here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/12/pbs26.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs26.zip).

## Matching Podcast Episode 467

Listen Along: Chit Chat Across the Pond Episode 467

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_12_10.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_12_10.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to PBS 24 Challenge

The challenge at the end of the previous instalment was to write the contents of the function `pbs.renderClock()` in the file `pbs.renderClock.js` so it renders a clock showing the current time in an arbitrary timezone. A file named `pbs24-assignment.html` was provided to test your code with, but did not need to be altered. The test file will only work if it’s in the same file as the `contrib` folder, which contains the Moment.js library. For completeness, I’ve included the Moment.js files (in the `contrib` folder), `pbs24-assignment.html`, and my suggested `pbs.renderClock.js` in this instalment’s ZIP file.

Below is my suggested `pbs.renderClock.js`. Again, if your code is different to mine but works, it is no less correct.

```javascript
/**
* @overview A simple single-function API for inserting a clock into a web page that shows the current time in a give timezone.

This single-function API is consists solely of the function {@link pbs.renderClock} within the {@link pbs} namespace.

* @requires jQuery
* @requires moment
* @requires moment-timezone
* @author Bart Busschots
*/

// set up the PBS namespace
/**
* APIs related to the [Programming by Stealth podcast/blog series](http://bartb.ie/pbs) are grouped under this namespace.
* @namespace
*/
var pbs = pbs ? pbs : {};

// define our API within a self-executing anonymous function
(function(pbs){

  /**
  * Converts a given span into a clock showing the current time in a given time zone.
  *
  * **NOTE** this function should not be called before the DOM is ready.
  * @param {jQuery} $span - a jQuery object representing the span to be converted into a clock.
  * This argument must be a jQuery representing exactly one element, and that element must be a span.
  * @param {string} tz - a string containing a valid timezone (with any spaces replaced with `_` characers), e.g. `America/Los_Angeles` or `Europe/Dublin`.
  * @returns {jQuery} A reference to `$span`.
  * @throws {Error} A generic error is thrown if and invalid value is passed for `$span`.
  * @example
  * pbs.renderClock($('#example-clock'), 'Europe/Brussels');
  */
  pbs.renderClock = function($span, tz){
    // validate the arguments
    if(!(typeof $span === 'object' && $span instanceof jQuery && $span.length === 1 && $span.is('span'))){
    	throw new Error('the first argument must be a jQuery object representing exactly one span element');
    }

    // initialise the span
    $span.empty();

    // create and inject spans for the components of the time
    var $hours = $('<span />').addClass('pbs-hours');
    var $separator = $('<span />').addClass('pbs-separator').text(':');
    var $minutes = $('<span />').addClass('pbs-minutes');
    $span.append($hours).append($separator).append($minutes);

    // create a local function to render the current time, then call it immediately
    var renderTime = function(){
    	// create a moment object representing the current time in our desired timezone
    	var now = moment().tz(tz);

    	// set the hours and minutes
    	$hours.text(now.format('HH'));
    	$minutes.text(now.format('mm'));
    }
    renderTime();

    // add an interval to blink the cursor
    var doFade = true; // a toggle to keep track of whether or fade in or out
    setInterval(
    	function(){
    		// fade in or out
    		$separator.fadeTo(250, doFade ? 0 : 1);

    		// update the toggle
    		doFade = !doFade;
    	},
    	1000
    );

    // add an interval to update the clock
    setInterval(renderTime, 60 * 1000);

    // return the span
    return $span;
  };
})(pbs);
```

I want to draw your attention to two points within my solution.

Firstly, the use of closures within `pbs.renderClock()`. Three variables are created to represent the parts of the clock (`$hours`, `$separator` & `$minutes`), and they are created in `pbs.renderClock()`‘s scope. The function for updating the clock is defined within `pbs.renderClock()`. So, thanks to closures, it retains access to these variables permanently.

Secondly, my code uses a jQuery function we have not seen before – `.fadeTo()`. This function gradually shifts the opacity of a DOM element to a given value over a given amount of time. The first argument is the time to take for the fade in milliseconds, and the second the target opacity as a number between 0 and 1 inclusive (0 is fully transparent and 1 is fully opaque).

## HTML Data Attributes

It is possible to save data into a HTML tag using an attribute with a name that starts with `data-` and then has a name of your choosing. For example, you could put the SKU of a product into a listing doing something like:

```html
<ul>
  <li data-sku="1234">Bart's Big Widget</li>
  <li data-sku="1235">Bart's Little Dongle</li>
  <li data-sku="1236">Bart's Thingamajig</li>
</ul>
```

Data attributes should be named in all lower case, and different parts of the name separated by dashes e.g. `data-unit-price` not `data-unitPrice`.

## jQuery and Data Attributes

Using jQuery, you can both read and write data attributes. The only slight confusion is that jQuery follows the HTML5 spec, and applies a mapping to data attribute names, converting them to camel-case. So, the raw HTML data attribute `data-unit-price` becomes `unitPrice` in jQuery.

The jQuery for interacting with data attributes is `.data()`. The first argument is always the name of the data attribute (in the short camel-case format). If there is no second argument, the function returns the current value of the data attribute. If there is a second argument, then the function uses it as the new value for the data attribute.

For example, given the following HTML snippet:

```html
<ul>
  <li data-sku="1234" id="widget">Bart's Big Widget</li>
  <li data-sku="1235" id="dongle">Bart's Little Dongle</li>
  <li data-sku="1236" id="thingy">Bart's Thingamajig</li>
</ul>
```

You could access the SKU of the dongle with:

```javascript
var dongleSKU = $('#dongle').data('sku');
```

And you could set a new SKU on the widget with:

```javascript
$('#widget').data('sku', 1233);
```

When setting data attributes in HTML, you are limited to setting string values, but when you use jQuery, you can add any value at all to a data attribute, including references to objects.

## An Improved Design Pattern for APIs

To see data attributes in action, and to remind ourselves how to create our own prototypes, we’ll build a better clock API that allows arbitrarily many clocks to be added to a single page by building a prototype. Before we start our API, let’s remind ourselves of how we build a basic prototype:

```javascript
// define a constructor
function MyPrototype(){
  // initialise any needed data attributes
  this._stuff = 'boogers';

  // if there was an argument, use it as an initial value
  if(arguments.length >= 1){
    this.stuff(arguments[0]); // use the accessor method defined below
  }
}

// add accessor methods for the data attribute(s)
MyPrototype.prototype.stuff = function(){
  // if there was at least one argument, we are a setter
  if(arguments.length >= 1){
    this._stuff = arguments[0];
  }

  // always return the current value of the attribute
  return this._stuff
};

// add any other methods, e.g. a toString method
MyPrototype.prototype.toString = function(){
  return "Some stuff: " + this._stuff;
};
```

Given that prototype, we could interact with it like so:

```javascript
var x = new MyPrototype('watzits');
console.log(x.stuff());
x.stuff('thingys');
console.log(x.toString());
```

Now that we know about self executing anonymous functions and namespaces, let’s update that template to make it adhere to more best practices.

```javascript
// init the PBS namespace
var pbs = pbs ? pbs : {};

// wrap the code in a self-executing anonymous function
(function(pbs, $, undefined){
  // define a constructor
  pbs.MyPrototype = function(){
    // initialise any needed data attributes
    this._stuff = 'boogers';

    // if there was an argument, use it as an initial value
    if(arguments.length >= 1){
      this._stuff(arguments[0]); // use the accessor method defined below
    }
  }

  // add accessor methods for the data attribute(s)
  pbs.MyPrototype.prototype.stuff = function(){
    // if there was at least one argument, we are a setter
    if(arguments.length >= 1){
      this._stuff = arguments[0];
    }

    // always return the current value of the attribute
    return this._stuff
  };

  // add any other methods, e.g. a toString method
  pbs.MyPrototype.prototype.toString = function(){
    return "Some stuff: " + this._stuff;
  };
})(pbs, jQuery);
```

We can now interact with our updated prototype like so:

```javascript
var x = new pbs.MyPrototype('watzits');
console.log(x.stuff());
x.stuff('thingys');
console.log(x.toString());
```

I want to draw your attention to the start and end of the self-executing anonymous function:

```javascript
(function(pbs, $, undefined){
  // .... the code goes here
})(pbs, jQuery);
```

When we define the function, we say that we will name the first argument `pbs`, the second `$`, and the third `undefined`. When we call the function, we only pass two arguments, `pbs`, and `jQuery`.

The first argument is exactly like we have seen before: we pass the namespace and we use the same name for it within the anonymous function.

In our previous examples, there were no other arguments, so what is going on with the other two?

Whenever you use the jQuery library, it is always presented as a function object named `jQuery`. By default, the variable named `$` is assigned equal to `jQuery`. This default can be overridden. It is possible to use `jQuery`, without `$` existing. Obviously, `$` is much shorter to write. So it would be nice to be able to safely use `$` within our API’s code. That is what the second argument achieves. When defining what we will refer to the arguments within the anonymous function, we name the second argument `$`, but when calling the function, we pass `jQuery`.

Finally, there are bad developers in this world. They sometimes do silly hacky things, like defining a variable named `undefined`. When you assign a value to `undefined`, you effectively redefining undefinedness. To be absolutely sure `undefined` really is undefined within our function, we name the third argument `undefined`, and then only pass two arguments.

## Worked Example – a Better Clock API

Armed with our improved API design pattern, and our knowledge of data attributes, let’s built a better clock API.

The main features of this new API will be:

*   Object oriented code – we will define a prototype to represent clocks.
*   For each clock, a reference to the object representing it will be added to the `span` element containing it using a data attribute.
*   It will be possible to set the timezone for clocks in the HTML through the use of data attributes.
*   It will be possible to have clocks automatically initialise when the page loads.

The final code will be included below, but let’s built it up piece-by-piece. It’s good practice to validate data passed to the functions in your API. So let’s start by defining some data validation functions.

Our API relies on jQuery, so we should write a function to test if a value is a reference to a jQuery object:

```javascript
var isjQuery = function(obj){
  if(typeof obj !== 'object'){
    return false;
  }
  if(!(obj instanceof $)){
    return false;
  }
  return true;
};
```

Our API transforms single HTML span elements into clocks. So we also need a function to check if a given value is a reference to a jQuery object representing exactly one `span` element:

```javascript
var isSingleSpan = function($s){
  if(typeof $s !== 'object'){
    return false;
  }
  if(!($s instanceof $)){
    return false;
  }
  if($s.length !== 1){
    return false;
  }
  return $s.is('span') ? true : false;
};
```

Since the whole point of this API is to support clocks in any timezone, we also need a function to check that a given value is a valid timezone specifier. What matters is not so much that the timezone makes sense to humans, but, that the timezone makes sense to the API our code will rely on for dealing with time – MomentJS.

The MomentJS API provides a function `moment.tz.names()` which returns an array of all valid timezone names as strings. For a value to be a valid timezone, it must be a string, and, it must be in the array returned by `moment.tz.names()`.

We could loop through the entire array returned by `moment.tz.names()` each time we need to test a value, but that would be very inefficient. Instead, this is a good opportunity to see a very common technique in action – so-called _lookup tables_.

A lookup table is simply a plain object where every valid string is a key that maps to the value `true`. Once that lookup table exists, you can check if a string is valid in a single step – if the value maps to `true` in the lookup table, then it is valid.

Consider the following simple lookup table:

```javascript
var daysOfTheWeek = {
  Monday: true,
  Tuesday: true,
  Wednesday: true,
  Thursday: true,
  Friday: true,
  Saturday: true,
  Sunday: true
};
```

We can now write a function to test if a given string is a day of the week like so:

```javascript
function isDayOfTheWeek(d){
  return daysOfTheWeek[d] ? true : false;
}
```

Using this approach, we can build a lookup table of all valid timezone, and then write a very efficient validation function like so:

```javascript
var tzLookup = {};
moment.tz.names().forEach(function(tzn){
  tzLookup[tzn] = true;
});

var isValidTimeZone = function(tz){
  if(typeof tz !== 'string'){
    return false;
  }
  return tzLookup[tz] ? true : false;
};
```

With that groundwork laid, let’s write the constructor for our world clock prototype. Because our API transforms HTML `span` elements into clocks, the first argument to the constructor must be a jQuery object representing a single `span` element. Clocks also need a timezone, but we can be a little more flexible there. We should allow the timezone to be specified as a second argument to the constructor, but we should also allow the timezone to be directly specified within the HTML of the `<span>` tag using the data attribute `data-timezone`. Finally, we can have a default timezone if none is provided by either of the possible mechanisms – I’ve chosen London, because that’s where Greenwich is. Because there are multiple possible sources of the timezone information, we need to decide on their order of importance. I’ve chosen to give the constructor the highest precedence, then the data attribute, and then the default.

Here’s the code for the constructor for the `pbs.WorldClock` prototype:

```javascript
pbs.WorldClock = function($span, tz){
  // make sure we were passed a jQuery object representing exactly one span
  if(!isSingleSpan($span)){
    throw new TypeError('the first argument must be a jQuery object representing exactly one span element');
  }

  // make sure the span has not already been initialised as a clock
  if($span.is('.pbs-worldclock')){
    throw new Error('Cannot initialise a World Clock into a span that has already been initialised as a World Clock');
  }

  // save a reference to the span into the object
  this._$span = $span;

  // figure out which timezone to use
  if(typeof tz === 'string'){
    // if there is a valid second argument, use it
    this._timezone = tz;
  }else if($span.data('timezone')){
    // if there is no second argument, but
    // there is a data attribute, use it
    this._timezone = $span.data('timezone');
  }else{
    // no timezone found, so default to Greenwich
    this._timezone = 'Europe/London';
  }

  // validate the timezone
  if(!isValidTimeZone(this._timezone)){
    throw new TypeError('Invalid timezone string: ' + this._timezone);
  }

  // initialise a placeholder for the interval ID
  this._intervalId = 0; // will hold the ID for the interval

  // initialise the span
  this._$span.empty().addClass('pbs-worldclock');
  this._$hours = $('<span />').addClass('pbs-worldclock-hours');
  this._$span.append(this._$hours);
  this._$separatorHM = $('<span />').text(':').addClass('pbs-worldclock-separator');
  this._$span.append(this._$separatorHM);
  this._$minutes = $('<span />').addClass('pbs-worldclock-minutes');
  this._$span.append(this._$minutes);

  // save a reference to this object into the span
  this._$span.data('pbsWorldclock', this);

  // start the clock
  this.start();
};
```

Notice that we made use of our previously defined validation functions to make sure all is well before we initialise the clock. When we’re sure everything’s in order, we empty the `span` element and then append the needed inner `span` elements for the various components of the clock. To allow access to the object representing the clock via the `span` element that contains it, we add a reference to the object (`this`) into the span as a data attribute.

Finally, we call the `.start()` function on our newly built object to start the clock running. At this point in the code we have not defined that function yet, but we’ll get to it shortly.

Clocks built with our prototype contain one piece of data that should be made accessible to users of the API – the timezone. To allow users to get and set the timezone of any clock, we should add an accessor function to the prototype:

```javascript
pbs.WorldClock.prototype.timezone = function(){
  // if there is a first argument, try use it as a timezone
  if(arguments.length >= 1){
    if(!isValidTimeZone(arguments[0])){
      throw new TypeError('invalid timezone');
    }
    this._timezone = arguments[0];
  }

  // always return the current timezone
  return this._timezone;
};
```

The last thing we need before we can write the function to start our clock running is a function to render the current time into a clock. I’ve chosen to use a private function to do this work, rather than a function that’s part of the prototype. Because this function is not part of the prototype, it can’t make use of the special variable `this` for accessing the internals of a clock. Instead, we need to pass the clock to be rendered as an argument.

```javascript
var renderClock = function(clock){
  // get the current time
  var now = moment().tz(clock._timezone);

  // render the current time
  clock._$hours.text(now.format('HH'));
  clock._$minutes.text(now.format('mm'));

  // blink the separator
  if(parseInt(now.format('ss')) %2 == 0){
    $('span.pbs-worldclock-separator', clock._$span).fadeTo(500, 0.2);
  }else{
    $('span.pbs-worldclock-separator', clock._$span).fadeTo(500, 1);
  }
};
```

We can now add functions for starting and stopping clocks into the prototype:

```javascript
/**
* Start the clock.
*/
pbs.WorldClock.prototype.start = function(){
  // if the clock is already started, do nothing
  if(this._intervalId !== 0){
    return;
  }

  // render the current time
  renderClock(this);

  // start an interval
  var self = this;
  this._intervalId = setInterval(function(){ renderClock(self); }, 1000);
};

/**
* Stop the clock.
*/
pbs.WorldClock.prototype.stop = function(){
  // if the clock is already stopped, do nothing
  if(this._intervalId === 0){
    return;
  }

  // stop the clock
  clearInterval(this._intervalId);
  this._intervalId = 0;
};
```

Finally, let’s add the ability to automatically transform spans into clocks. As a first step, let’s build a function to search one or more containers for spans with the class pbs-worldclock-auto, and turn each of them into a clock:

```javascript
pbs.WorldClock.autoInitialise = function($containers){
  // default the container if none was passed
  if(typeof $containers === 'undefined'){
    $containers = $(document);
  }

  // make sure we have a jQuery object to search within
  if(!isjQuery($containers)){
    throw new TypeError('the first argument must be a jQuery object');
  }

  // search the container(s) and initialise each clock found
  $('span.pbs-worldclock-auto', $containers).each(function(){
    var $span = $(this);

    // initialise the clock
    new pbs.WorldClock($span);

    // remove the auto class to avoid re-initialisation
    $span.removeClass('pbs-worldclock-auto');
  });
};
```

Now that we have a function for scanning parts of a document for clock spans and automatically initialising them, let’s add an event handler to the document to automatically initialise clocks when the page loads:

```javascript
// add an event handler to automaticlaly initialise clocks when the document becomes ready
$(function(){ pbs.WorldClock.autoInitialise(); });
```

We have all the pieces for our API now, so let’s put them all together to form a complete and documented API:

```javascript
/**
* @overview A JavaScript prototype for creating world clocks.
* @requires jQuery
* @requires moment
* @requires moment-timezone
* @author Bart Busschots
* @license BSD-2-Clause
*/

//
// === Add needed JSDoc data type definitions ===
//

/**
* A TZ string from the [IANA Time Zone Database](https://en.wikipedia.org/wiki/Tz_database).
* A full list of the valid strings can be found in the
* [third column of this listing}(https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
* @typedef {string} TimeZoneString
*/

/**
* A jQuery object.
* @typedef {object} jQuery
*/

/**
* A jQuery object representing exactly one HTML span element.
* @typedef {jQuery} jQuerySingleSpan
*/

// make sure the needed pre-requisites are installed.
if(typeof jQuery !== 'function'){
    throw new Error('jQuery is required but not loaded');
}

// init the pbs namespace safely
/**
* APIs related to the [Programming by Stealth podcast/blog series](http://bartb.ie/pbs) are grouped under this namespace.
* @namespace
*/
var pbs = pbs ? pbs : {};

// add all the API's functionality within a self-executing anonymous function
(function(pbs, $, undefined){
    //
    // === Define private helper functions and their needed data structures ===
    //

    /**
    * A helper function for testing if a given value is a {@link jQuery}.
    * @memberof pbs
    * @inner
    * @access private
    * @param {*} $s - the value to test.
    * @returns {boolean} - `true` if the value being tested is a valid
    *     {@link jQuery}, `false` otherwise.
    */
    var isjQuery = function(obj){
        if(typeof obj !== 'object'){
            return false;
        }
        if(!(obj instanceof $)){
            return false;
        }
        return true;
    };

    /**
    * A helper function for testing if a given value is a {@link jQuerySingleSpan}
    * @memberof pbs
    * @inner
    * @access private
    * @param {*} $s - the value to test.
    * @returns {boolean} - `true` if the value being tested is a valid
    *     {@link jQuerySingleSpan}, `false` otherwise.
    */
    var isSingleSpan = function($s){
        if(!isjQuery($s)){
            return false;
        }
        if($s.length !== 1){
            return false;
        }
        return $s.is('span') ? true : false;
    };

    /**
    * A lookup table for validating TZ strings. All valid strings are keys in
    * this table with value `true`.
    * @inner
    * @private
    * @const
    * @memberof pbs
    * @type {Object.<string, boolean>}
    */
    var tzLookup = {};
    moment.tz.names().forEach(function(tzn){
        tzLookup[tzn] = true;
    });

    /**
    * A helper function for testing if a given value is valid
    * {@link TimeZoneString}.
    * @memberof pbs
    * @inner
    * @private
    * @param {*} tz - the value to test.
    * @returns {boolean} - `true` if the value being tested is a valid
    *     {@link TimeZoneString}, `false` otherwise.
    */
    var isValidTimeZone = function(tz){
        if(typeof tz !== 'string'){
            return false;
        }
        return tzLookup[tz] ? true : false;
    };

    //
    // === Define a prototype to represent a Single World Clock ===
    //

    /**
    * @constructor
    * @classdesc A prototype to represent a single world clock.
    *
    * The timezone can be specified either as an argument to the constructor, or
    * by specifying it with the data attribute `data-timezone` on the `span` to
    * be converted into a clock. An argument to the constructor takes precedence
    * over the data attribute.
    *
    * The markup produced to represent the clock is very simple:
    *
    * ```
    * <span class="pbs-worldclock">
    *  <span class="pbs-worldclock-hours">HH</span>
    *  <span class="pbs-worldclock-separator">:</span>
    *  <span class="pbs-worldclock-minutes">MM</span>
    * </span>
    * ```
    *
    * No CSS attributes are set on any of the elements, so all styling is left
    * to the user. Below is a sample style:
    *
    * ```
    * .pbs-worldclock{
    *    font-weight: bold;
    *    display: inline-block;
    *    border: 1px solid green;
    *    border-radius: 3px;
    *    padding: 3px;
    *    background-color: black;
    *    color: lightgreen;
    *    font-family: monospace;
    * }
    * ```
    *
    * @param {jQuerySingleSpan} $span - a jQuery object representing the HTML
    *     `span` element to be transformed into a clock. Note that all existing
    *     content within the span will be  will be removed.
    * @param {TimeZoneString} [tz=Europe/London] - The timezone for the clock.
    * @throws {TypeError} An error is thrown when an invalid value is passed for
    *     any of the arguments.
    */
    pbs.WorldClock = function($span, tz){
        // make sure we were passed a jQuery object representing exactly one span
        if(!isSingleSpan($span)){
            throw new TypeError('the first argument must be a jQuery object representing exactly one span element');
        }

        // make sure the span has not already been initialised as a clock
        if($span.is('.pbs-worldclock')){
            throw new Error('Cannot initialise a World Clock into a span that has already been initialised as a World Clock');
        }

        // save a reference to the span into the object
        /**
        * A jQuery object representing the span containing the clock.
        * @member {jQuerySingleSpan}
        * @private
        */
        this._$span = $span;

        // figure out which timezone to use
        /**
        * The clock's timezone as a string.
        * @member {TimeZoneString}
        * @private
        */
        this._timezone = 'Europe/London'; // default to Greenwich
        if(typeof tz === 'string'){
            // if there is a valid second argument, use it
            this._timezone = tz;
        }else if($span.data('timezone')){
            // if there is no second argument, but
            // there is a data attribute, use it
            this._timezone = $span.data('timezone');
        }

        // validate the timezone
        if(!isValidTimeZone(this._timezone)){
            throw new TypeError('Invalid timezone string: ' + this._timezone);
        }

        // initialise a placeholder for the interval ID
        /**
        * When the clock is running, the ID of the interval controlling it,
        * otherwise, 0.
        * @member {integer}
        * @private
        */
        this._intervalId = 0; // will hold the ID for the interval

        // initialise the span
        this._$span.empty().addClass('pbs-worldclock');
        /**
        * The inner span for the hours.
        * @member {jQuerySingleSpan}
        * @private
        */
        this._$hours = $('<span />').addClass('pbs-worldclock-hours');
        this._$span.append(this._$hours);
        /**
        * The inner span for the separator between the hours and minutes.
        * @member {jQuerySingleSpan}
        * @private
        */
        this._$separatorHM = $('<span />').text(':').addClass('pbs-worldclock-separator');
        this._$span.append(this._$separatorHM);
        /**
        * The inner span for the minutes.
        * @member {jQuerySingleSpan}
        * @private
        */
        this._$minutes = $('<span />').addClass('pbs-worldclock-minutes');
        this._$span.append(this._$minutes);

        // save a reference to this object into the span
        this._$span.data('pbsWorldclock', this);

        // start the clock
        this.start();
    };

    //
    // -- Accessor Methods --
    //

    /**
    * Get and/or set the clock's timezone.
    * @param {TimeZoneString} [tz]
    * @returns {TimeZoneString}
    * @throws {TypeError} An error is thrown if an argument is passed that is
    *     not valid.
    */
    pbs.WorldClock.prototype.timezone = function(){
        // if there is a first argument, try use it as a timezone
        if(arguments.length >= 1){
            if(!isValidTimeZone(arguments[0])){
                throw new TypeError('invalid timezone');
            }
            this._timezone = arguments[0];
        }

        // always return the current timezone
        return this._timezone;
    };

    //
    // -- Methods for Rendering the Clock --
    //

    /**
    * Render the current time into a given clock.
    * @memberof pbs
    * @inner
    * @private
    * @param {pbs.WorldClock} clock - a reference to the clock to render the
    *     time into.
    */
    var renderClock = function(clock){
        // get the current time
        var now = moment().tz(clock._timezone);

        // render the current time
        clock._$hours.text(now.format('HH'));
        clock._$minutes.text(now.format('mm'));

        // blink the separator
        if(parseInt(now.format('ss')) %2 == 0){
            $('span.pbs-worldclock-separator', clock._$span).fadeTo(500, 0.2);
        }else{
            $('span.pbs-worldclock-separator', clock._$span).fadeTo(500, 1);
        }
    };

    /**
    * Start the clock.
    */
    pbs.WorldClock.prototype.start = function(){
        // if the clock is already started, do nothing
        if(this._intervalId !== 0){
            return;
        }

        // render the current time
        renderClock(this);

        // start an interval
        var self = this;
        this._intervalId = setInterval(function(){ renderClock(self); }, 1000);
    };

    /**
    * Stop the clock.
    */
    pbs.WorldClock.prototype.stop = function(){
        // if the clock is already stopped, do nothing
        if(this._intervalId === 0){
            return;
        }

        // stop the clock
        clearInterval(this._intervalId);
        this._intervalId = 0;
    };

    //
    // === Provide Automation ===
    //

    /**
    * Initialise all spans with the class `pbs-worldclock-auto` within a given
    * set of containers.
    * @param {jQueryObject} [$containers=$(document)] - the container(s) to
    *     search for spans to be automatially transformed into clocks. By
    *     default the entire document is searched.
    * @throws {TypeError} An error is thrown if the first argument is present,
    *     but not a jQuery object.
    */
    pbs.WorldClock.autoInitialise = function($containers){
        // default the container if none was passed
        if(typeof $containers === 'undefined'){
            $containers = $(document);
        }

        // make sure we have a jQuery object to search within
        if(!isjQuery($containers)){
            throw new TypeError('the first argument must be a jQuery object');
        }

        // search the container(s) and initialise each clock found
        $('span.pbs-worldclock-auto', $containers).each(function(){
            var $span = $(this);

            // initialise the clock
            new pbs.WorldClock($span);

            // remove the auto class to avoid re-initialisation
            $span.removeClass('pbs-worldclock-auto');
        });
    };

    // add an event handler to automaticlaly initialise clocks when the document
    // becomes ready
    $(function(){ pbs.WorldClock.autoInitialise(); });
})(pbs, jQuery);
```

You can see the API in use in `pbs26.html`:

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 26 - World Clocks Example</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Import the moment.js & moment-timezone.js libraries -->
  <script type="text/javascript" src="contrib/moment.min.js"></script>
  <script type="text/javascript" src="contrib/moment-timezone-with-data.js"></script>

  <!-- Import the pbs.WorldClock API -->
  <script type="text/javascript" src="lib/pbs.WorldClock.js"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

  	// when the DOM loads, turn the span with the ID clock1 into a clock
  	$(function(){
  		new pbs.WorldClock($('#clock1'), 'Europe/Dublin');
  	});

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">
    /*
     * Style the clocks
     */

    /* styles common to both defaults */
    .pbs-worldclock{
    	font-weight: bold;
    	border-style: solid;
    	border-color: green;
    	background-color: black;
    	color: lightgreen;
    	font-family: monospace;
    }

    /* styles for the inline example */
    #clock1{
    	display: inline-block;
    	padding: 3px;
    	vertical-align: middle;
    	border-width: 1px;
    	border-radius: 3px;
    }

    /* styles for the block-level example */
    #clock2{
    	display: block;
    	padding: 0.25em;
    	vertical-align: middle;
    	font-size: 50pt;
    	text-align: center;
    	margin-left: 2em;
    	margin-right: 2em;
    	border-width: 3px;
    	border-radius: 30px;
    }
  </style>
</head>
<body>

<h1><code>pbs.WorldClock.js</code> Demo</h1>

<p>The <code>pbs.WorldClock</code> API can be used to insert live clocks into a web page showing the current time in any timezone.</p>

<p>The clocks can be styled with CSS, allowing them to appear however you wish. Clocks can be explicitly craeted using the constructor, or they can be automatically initialised if they are given the appropriate CSS class.</p>

<p>For example, it's now <span id="clock1"></span> in Dublin (Ireland). This first example is an a clock that has been styled to appear inline, and was explicitly created using the constructor.</p>

<p>Below is the current time in LA. This clock is styled as a block-level element, and was automatically initialised:</p>

<span id="clock2" data-timezone="America/Los_Angeles" class="pbs-worldclock-auto"></span>

</body>
</html>
```

The HTML file will only work if it is in the same folder as the `contrib` and `lib` folders from the ZIP file. Assuming that you extracted the ZIP into your local web server’s document root, and that your local web server is running, you should be able to see the example in action at `http://localhost/pbs26/pbs26.html`. Alternatively, you can [see it in action on my web server](https://www.bartbusschots.ie/pbsdemos/pbs26/pbs26.html).

You can generate the public documentation for this API by opening a terminal in the folder you extracted the ZIP file to, and running the command:

`jsdoc lib/pbs.WorldClock.js --destination docs -c jsdoc.conf.json`

You can generate the developer documentation, including all the private variables and functions, with the command:

`jsdoc lib/pbs.WorldClock.js --destination docs-dev --private -c jsdoc.conf.json`

Assuming that you extracted the ZIP file into your local web server’s document root, and that your local web server is running, you should now be able to access the public documentation at `http://localhost/pbs26/docs/`, and the developer documentation at `http://localhost/pbs26/docs-dev/`. Alternatively, you can access both sets of documentation on my web server: [public docs](https://www.bartbusschots.ie/pbsdemos/pbs26/docs/) & [private docs](https://www.bartbusschots.ie/pbsdemos/pbs26/docs-dev/).

In this example we initialise the first clock ourselves by explicitly calling the constructor of our `pbs.WorldClock` prototype, while we allow the second clock to be automatically initialised. In the first case we pass the timezone to the constructor as an argument, but in the second case we never call the constructor ourselves, so we can’t do that. Instead, we specify the desired timezone directly in the HTML using a data attribute.

We did not just use data attributes to allow a timezone to be specified. We also had the constructor add a reference to the object representing a clock into the span that contains it, using a data attribute. This linkage can be useful, for example, you could enter the following in the console to stop clock 1:

```javascript
$('#clock1').data('pbsWorldclock').stop()
```

We can later restart it with:

```javascript
$('#clock1').data('pbsWorldclock').start()
```

## A Challenge

The API above is functional, but not very configurable. To make it more useful, add the ability to configure the following options:

1.  Time format – 12 or 24 hour
2.  Whether or not to show seconds
3.  Whether or not to blink the separator(s)

Each of these options should be configurable in three ways – via data attributes, via the constructor, and via accessor methods.

Finally, create two functions, `pbs.WorldClock.stopAll()` and `pbs.WorldClock.startAll()` to allow users to easily stop and start all the clocks on a page. For bonus credit, can you write the functions such that they accept a jQuery object as an optional argument? If the argument is present, only the clocks contained within elements represented by the jQuery object should be stopped or started. If the argument is not present, all the clocks in the entire document should be stopped or started.

Feel free to use your own namespace for your version of the library. If you choose to do that, it would be good practice to acknowledge where the original code came from in your documentation.

## Final Thoughts

At this stage we’ve learned how to define the structure of web pages with HTML, to style them with CSS, and alter the structure of web pages with JavaScript. We’ve learned to use APIs written by others, and to write our own APIs, either for private code reuse or for sharing with the world.

So far, we’ve omitted an entire facet of the web – user input. Web forms allow users to enter information and to trigger events. We need to learn the HTML markup to define them, the CSS to style them, and the JavaScript to bring them to life – that’s where this series is heading next.
