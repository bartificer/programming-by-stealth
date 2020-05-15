# PBS 30 of x – Comparing JS Objects | Introducing WAI-ARIA

In this instalment we’re going to continue with our dual-track approach, first, looking at some more JavaScript prototypes, then switching tack to HTML forms again.

We’ll start with my sample solution to the challenge set in [the previous instalment](https://bartificer.net/pbs29). Then, we’ll move on to add an important enhancement to our prototypes – support for object comparisons. Strictly speaking, this won’t actually be revision – we haven’t looked at the intricacies of comparing objects before.

We’ll finish our JavaScript section with another challenge.

When we switch back to HTML we’ll take a big-picture look at an important accessibility standard named WAI-ARIA. We want to build our forms in a screen-reader-friendly way from day one, and to do that, we need to begin learning about ARIA. ARIA is really quite big, so all we’ll be doing this time is taking in an overview so we understand why it exists, and the basic concepts its built around.

We’ll finish by creating a final, fully accessible, button complete with a pretty scalable icon.

In the next instalment we’ll finally be ready to move on to some more different form inputs, specifically, checkboxes and radio buttons.

# Matching Podcast Episode 476

Listen Along: Chit Chat Across the Pond Episode 476

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_02_17.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_02_17.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to PBS 29 Challenge

```javascript
// init name space
var pbs = pbs ? pbs : {};

// define all prototypes within an anonymous self executing fuction
(function(pbs, undefined){
	//
	// ==== Define Needed Helper Functions ===
	//

	// A function for validating integer inputs
	function isValidInteger(v, lbound, ubound){
		// first and foremost, make sure we have an integer
		if(!String(v).match(/^-?\d+$/)){
			return false;
		}

		// if a lower bound was passed, check it
		if(typeof lbound === 'number' && v < lbound){
			return false;
		}

		// if an upper bound was passed, check it
		if(typeof ubound === 'number' && v > ubound){
			return false;
		}

		// if we got here all is well
		return true;
	}

	// a data structure to help validate days of the month
	var daysInMonthLookup = {};
	daysInMonthLookup[1] = 31;
	daysInMonthLookup[2] = 28;
	daysInMonthLookup[3] = 31;
	daysInMonthLookup[4] = 30;
	daysInMonthLookup[5] = 31;
	daysInMonthLookup[6] = 30;
	daysInMonthLookup[7] = 31;
	daysInMonthLookup[8] = 31;
	daysInMonthLookup[9] = 30;
	daysInMonthLookup[10] = 31;
	daysInMonthLookup[11] = 30;
	daysInMonthLookup[12] = 31;

	// helper function to validate a given combination of day, month, and year
	function isValidateDMYCombo(d, m, y){
		// figure out how many days are allowed in the curreny month
		var numDaysInMonth = daysInMonthLookup[m];
		if(m === 2){
			// the month is February, so check for a leap year (assume not)
			var isLeapYear = false;
			if(y % 4 === 0){
				// year is divisible by 4, so might be a leap year
				if(y % 100 === 0){
					// a century, so not a leap year unless divisible by 400
					if(y % 400 === 0){
						isLeapYear = true;
					}
				}else{
					// divisible by four and not a century, so a leap year
					isLeapYear = true;
				}
			}
			// if we are a leap year, change the days to 29
			if(isLeapYear){
				numDaysInMonth = 29;
			}
		}

		// return based on wheather or not the days are valid
		return d <= numDaysInMonth ? true : false;
	}

	// helper function to convert integers to zero-padded strings
	function intToPaddedString(i, len){
		// take note of whethere or not the original number was negative
		var isNegative = i < 0 ? true : false;

		// convert the absolute value of the number to a string
		var ans = String(Math.abs(i));

		// add any needed padding if a sane length was provided
		if(typeof len === 'number' && len > 0){
			while(ans.length < len){
				ans = '0' + ans;
			}
		}

		// pre-fix the minus sign if needed
		if(isNegative){
			ans = '-' + ans;
		}

		return ans;
	}

	// a helper function to get the two-letter ordinal suffix for any integer
	function toOrdinalString(n){
		if(n === 1){
			return 'st';
		}
		if(n === 2){
			return 'nd';
		}
		if(n === 3){
			return 'rd';
		}
		return 'th';
	}

	// a lookup table to convert month numbers into English names
	var monthNameLookup = {};
	monthNameLookup[1] = 'January';
	monthNameLookup[2] = 'February';
	monthNameLookup[3] = 'March';
	monthNameLookup[4] = 'April';
	monthNameLookup[5] = 'May';
	monthNameLookup[6] = 'June';
	monthNameLookup[7] = 'July';
	monthNameLookup[8] = 'August';
	monthNameLookup[9] = 'September';
	monthNameLookup[10] = 'October';
	monthNameLookup[11] = 'November';
	monthNameLookup[12] = 'December';

	//
	// === Define Time protoype (Part 1) ===
	//

	// the constructor
	pbs.Time = function(h, m, s){
		// init data with default values
		this._hours = 0;
		this._minutes = 0;
		this._seconds = 0;

		// process any args that were passed
		if(typeof h !== 'undefined'){
			this.hours(h);
		}
		if(typeof m !== 'undefined'){
			this.minutes(m);
		}
		if(typeof s !== 'undefined'){
			this.seconds(s);
		}
	};

	// the accessor methods
	pbs.Time.prototype.hours = function(h){
		if(arguments.length === 0){
			return this._hours;
		}
		if(!isValidInteger(h, 0, 23)){
			throw new TypeError('the hours value must be an integer between 0 and 23 inclusive');
		}
		this._hours = h;
		return this;
	};
	pbs.Time.prototype.minutes = function(m){
		if(arguments.length === 0){
			return this._minutes;
		}
		if(!isValidInteger(m, 0, 59)){
			throw new TypeError('the minutes value must be an integer between 0 and 59 inclusive');
		}
		this._minutes = m;
		return this;
	};
	pbs.Time.prototype.seconds = function(s){
		if(arguments.length === 0){
			return this._seconds;
		}
		if(!isValidInteger(s, 0, 59)){
			throw new TypeError('the seconds value must be an integer between 0 and 59 inclusive');
		}
		this._seconds = s;
		return this;
	};

	// add functions
	pbs.Time.prototype.time12 = function(){
		var ans = '';
		if(this._hours === 0){
			ans += '12';
		}else if(this._hours <= 12){
			ans += this._hours;
		}else{
			ans += (this._hours - 12);
		}
		ans += ':' + intToPaddedString(this._minutes, 2) + ':' + intToPaddedString(this._seconds, 2);
		ans += this._hours < 12 ? 'AM' : 'PM';
		return ans;
	};
	pbs.Time.prototype.time24 = function(){
		return '' + intToPaddedString(this._hours, 2) + ':' + intToPaddedString(this._minutes, 2) + ':' + intToPaddedString(this._seconds, 2);
	};

	// define a toString function
	pbs.Time.prototype.toString = pbs.Time.prototype.time24;

	// define a clone function
	pbs.Time.prototype.clone = function(){
		return new pbs.Time(this._hours, this._minutes, this._seconds);
	};

	//
	// === Define Date protoype (Part 2) ===
	//

	// the constructor
	pbs.Date = function(d, m, y){
		// init data with default values
		this._day = 1;
		this._month = 1;
		this._year = 1970;

		// deal with any passed args
		if(typeof d !== 'undefined'){
			this.day(d);
		}
		if(typeof m !== 'undefined'){
			this.month(m);
		}
		if(typeof y !== 'undefined'){
			this.year(y);
		}
	};

	// the accessor methods
	pbs.Date.prototype.day = function(d){
		if(arguments.length === 0){
			return this._day;
		}
		if(!isValidInteger(d, 1, 31)){
			throw new TypeError('the day must be an integer between 1 and 31 inclusive');
		}
		d = parseInt(d); // force to number if string of digits
		if(!isValidateDMYCombo(d, this._month, this._year)){
			throw new Error('invalid day, month, year combination');
		}
		this._day = d;
		return this;
	};
	pbs.Date.prototype.month = function(m){
		if(arguments.length === 0){
			return this._month;
		}
		if(!isValidInteger(m, 1, 12)){
			throw new TypeError('the month must be an integer between 1 and 12 inclusive');
		}
		m = parseInt(m); // force to number if string of digits
		if(!isValidateDMYCombo(this._day, m, this._year)){
			throw new Error('invalid day, month, year combination');
		}
		this._month = m;
		return this;
	};
	pbs.Date.prototype.year = function(y){
		if(arguments.length === 0){
			return this._year;
		}
		if(!isValidInteger(y)){ // no bounds check on the year
			throw new TypeError('the year must be an integer');
		}
		y = parseInt(y); // force to number if string of digits
		if(!isValidateDMYCombo(this._day, this._month, y)){
			throw new Error('invalid day, month, year combination');
		}
		this._year = y;
		return this;
	};

	// define needed functions
	pbs.Date.prototype.international = function(y, m, d){
		if(arguments.length === 0){
			// we are in 'get' mode
			return intToPaddedString(this._year, 4) + '-' + intToPaddedString(this._month, 2) + '-' + intToPaddedString(this._day, 2);
		}

		// if we got here we are in 'set' mode

		// validate the three pieces of data
		if(!(isValidInteger(d, 1, 31) && isValidInteger(m, 1, 12) && isValidInteger(y))){
			throw new TypeError('invalid date information - must be three integers');
		}

		// force the three pieces of data to be numbers and not strings
		d = parseInt(d);
		m = parseInt(m);
		y = parseInt(y);

		// test the combination is valid
		if(!isValidateDMYCombo(d, m, y)){
			throw new Error('invalid day, month, year combination');
		}

		// set the three pieces of data
		this._day = d;
		this._month = m;
		this._year = y;

		// return a refernce to self
		return this;
	};
	pbs.Date.prototype.american = function(m, d, y){
		if(arguments.length === 0){
			// we are in 'get' mode
			var ans = '';
			ans += this._month + '/' + this._day + '/';
			if(this._year <= 0){
				ans += (Math.abs(this._year - 1)) + 'BC';
			}else{
				ans += this._year;
			}
			return ans;
		}

		// if we got here we are in 'set' mode
		return this.international(y, m, d); // avoid needless duplication
	};
	pbs.Date.prototype.european = function(d, m, y){
		if(arguments.length === 0){
			// we are in 'get' mode
			var ans = '';
			ans += intToPaddedString(this._day, 2) + '-' + intToPaddedString(this._month, 2) + '-';
			if(this._year <= 0){
				ans += Math.abs(this._year - 1) + 'BCE';
			}else{
				ans += this._year;
			}
			return ans;
		}

		// if we got here we are in 'set' mode
		return this.international(y, m, d); // avoid needless duplication
	};
	pbs.Date.prototype.english = function(){
		var ans = '';
		ans += this._day + toOrdinalString(this._day) + ' of ' + monthNameLookup[this._month] + ' ';
		if(this._year <= 0){
			ans += Math.abs(this._year - 1) + 'BCE';
		}else{
			ans += this._year;
		}
		return ans;
	};

	// provide a toString
	pbs.Date.prototype.toString = pbs.Date.prototype.international;

	// define a clone function
	pbs.Date.prototype.clone = function(){
		return new pbs.Date(this._day, this._month, this._year);
	};

	//
	// === Define DateTime protoype (Part 3) ===
	//

	// the constructor
	pbs.DateTime = function(d, t){
		// init data with defaults
		this._date = new pbs.Date();
		this._time = new pbs.Time();

		// deal with any args that were passed
		if(typeof d !== 'undefined'){
			this.date(d);
		}
		if(typeof t !== 'undefined'){
			this.time(t);
		}
	};

	// accessor methods
	pbs.DateTime.prototype.date = function(d){
		if(arguments.length === 0){
			return this._date.clone();
		}
		if(!(d instanceof pbs.Date)){
			throw new TypeError('require an instance of the pbs.Date prototype');
		}
		this._date = d.clone();
		return this;
	};
	pbs.DateTime.prototype.time = function(t){
		if(arguments.length === 0){
			return this._time.clone();
		}
		if(!(t instanceof pbs.Time)){
			throw new TypeError('require an instance of the pbs.Time prototype');
		}
		this._time = t.clone();
		return this;
	};

	// define functions
	pbs.DateTime.prototype.american12Hour = function(){
		return this._date.american() + ' ' + this._time.time12();
	};
	pbs.DateTime.prototype.american24Hour = function(){
		return this._date.american() + ' ' + this._time.time24();
	};
	pbs.DateTime.prototype.european12Hour = function(){
		return this._date.european() + ' ' + this._time.time12();
	};
	pbs.DateTime.prototype.european24Hour = function(){
		return this._date.european() + ' ' + this._time.time24();
	};

	// provide a toString
	pbs.DateTime.prototype.toString = function(){
		return this._date.toString() + ' ' + this._time.toString();
	};

	// define a clone function
	pbs.DateTime.prototype.clone = function(){
		return new pbs.DateTime(this._date, this._time);
	};
})(pbs);

//
// === Test Code ===
//

// instalment 27 part 1 tests
var lunchTime = new pbs.Time();
lunchTime.hours(13);
console.log(lunchTime.toString());
var dinnerTime = new pbs.Time(17, 30);
console.log("I have my lunch at " + lunchTime.time24() + " each day");
console.log("I have my dinner at " + dinnerTime.time12() + " each evening");

// instalment 27 part 2 tests
var nextAprilFools = new pbs.Date();
nextAprilFools.day(1).month(4).year(2017);
console.log("In America the next April Fools Day is " + nextAprilFools.american());
console.log("In Europe the next April Fools Day is " + nextAprilFools.european());

// instalment 27 part 3 tests
var gonnaPrankBart = new pbs.DateTime(new pbs.Date(1, 4, 2017), new pbs.Time(15));
console.log('Gonna prank Bart good on ' + gonnaPrankBart.european24Hour() + ' his time');

// instalment 28 part 2 tests
var testDate = new pbs.Date(1, 1, 1970);
testDate.european(29, 2, 2016);
console.log('successfully converted 1 Jan 1970 to ' + testDate.toString());

// instalment 28 part 3 tests
var nextXMas = new pbs.Date();
nextXMas.international(2017, 12, 25);
console.log("I'm looking forward to getting presents on the " + nextXMas.english());

// instalment 29 tests
var d = new pbs.Date(17, 3, 2017);
var t = new pbs.Time(11, 0);
var dt = new pbs.DateTime(d, t);
console.log('d=' + d + ', t=' + t + ' & dt=' + dt);
d.year(2018);
t.minutes(15);
console.log('d=' + d + ', t=' + t + ' & dt=' + dt);
var t2 = dt.time();
t2.seconds(15);
console.log('t=' + t + ', t2=' + t2 + ' & dt=' + dt);
```

## Comparing Objects

At this stage our prototypes are free of glaring problems, but they are still missing an important chunk of functionality – they lack support for comparisons.

The JavaScript language provides useful comparison operators for values like numbers, strings, and booleans, but not for objects. When dealing with objects, the `==` and `===` operators only tell us whether or not two variables contain references to the same object. The following code illustrates this:

```javascript
var t1 = new pbs.Time(12, 0);
var t2 = new pbs.Time(12, 0);
console.log(t1 == t2); // false
console.log(t1 === t2); // false
var t3 = t1;
console.log(t1 == t3); // true
console.log(t1 === t3); // true
```

`t1` and `t2` contain references to two different objects that contain the same values, while `t1` and `t3` are references to the same object.

The core JavaScript language does not provide any mechanism for meaningful object comparisons – if you want instances of your prototypes to be comparable to each other, it’s entirely up to you to provide that functionality.

Not only does JavaScript not provide you with a mechanism for object comparison, there is not even an agreed standard approach to this problem. The closest we can come to any kind of _right way_ of doing this is to follow some community conventions.

Basically, what many people choose to do in JavaScript is to follow Java’s comparison rules (Java does not rely on conventions, there is a formally defined correct way of making Java objects comparable). That is to say, many JavaScript programmers choose to add two comparison functions to each of their prototypes – `.equals()`, and `.compareTo()`.

The first of these, `.equals()` should take one argument, return `true` if that argument is a reference to an object that should be considered to have the same value as the object the function was called on, and return `false` in all other situations.

Let’s add a `.equals()` function to the `pbs.Time` prototype:

```javascript
pbs.Time.prototype.equals = function(obj){
  if(typeof obj !== 'object'){
    return false;
  }
  if(! obj instanceof pbs.Time){
    return false;
  }
  return obj._hours === this._hours && obj._minutes === this._minutes && obj._seconds === this._seconds;
};
```

We can test our new `.equals()` function with the following code:

```javascript
var t1 = new pbs.Time(12, 0);
var t2 = new pbs.Time(12, 0);
console.log(t1.equals(t2)); // true
console.log(t2.equals(t1)); // true
var t3 = t1;
console.log(t1.equals(t3)); // true
var t4 = new pbs.Time(11, 30);
console.log(t3.equals(t4)); // false
console.log(t4.equals(t3)); // false
```

Notice the symmetry – `t1.equals(t2)` gives the same result as `t2.equals(t1)`. This should always be the case with a properly implemented `.equals()` function.

The second comparison function, `.compareTo()`, is a little more complex, but not much. Like `.equals()`, it expects one argument, but rather than simply testing for equality, it tests for ordering, and returns `-1` if the object passed should be considered less than the object the function was called on, `0` if they should be considered equal, `1` if the value passed should be considered greater than the object the function was called on, or `NaN` if the passed value is invalid in some way.

Let’s add a `.compareTo()` function to our `pbs.Time` prototype:

```javascript
pbs.Time.prototype.compareTo = function(obj){
  // make sure we have a valid object to test
  if(!(typeof obj === 'object' && obj instanceof pbs.Time)){
    return NaN;
  }

  // check if the hours are different
  if(this._hours < obj._hours){
    return -1;
  }
  if(this._hours > obj._hours){
    return 1;
  }

  // if we got here, the hours are the same, so check the minutes
  if(this._minutes < obj._minutes){
    return -1;
  }
  if(this._minutes > obj._minutes){
    return 1;
  }

  // if we got here, the hours and minutes are the same, so check the seconds
  if(this._seconds < obj._seconds){
    return -1;
  }
  if(this._seconds > obj._seconds){
    return 1;
  }

  // if we got here the two times are equal, so return 0
  return 0;
};
```

We can test our `.compareTo()` function with the following code:

```javascript
var t1 = new pbs.Time(12, 0);
var t2 = new pbs.Time(12, 0);
console.log(t1.compareTo(t2)); // 0
console.log(t2.compareTo(t1)); // 0
var t3 = new pbs.Time(11, 0);
console.log(t1.compareTo(t3)); // 1
console.log(t3.compareTo(t1)); // -1
var t4 = new pbs.Time(12, 0, 1);
console.log(t1.compareTo(t4)); // -1
console.log(t4.compareTo(t1)); // 1
```

Again, there should be symmetry in the outputs, if `t1.compareTo(t2)` returns `0`, then `t2.compareTo(t1)` should also return `0`. Furthermore, if `t1.compareTo(t2)` returns `-1`, then `t2.compareTo(t1)` should return `1`, and _vica-versa_.

## Updated JavaScript Prototype Algorithm

Given all we have learned over the past few instalments, we need to update our original six-step process for creating prototypes to the following 8 step process:

1.  Gather your requirements, specifically, what data do your objects need to store, and, what functions need to be provided.
2.  Initialise your namespace and start a self-executing anonymous function within which you’ll define your prototype.
3.  Write your constructor. In general, your constructor should accept initial values for all your object’s pieces of data, and if none are provided, a sane default should be used. You should validate all data from the user and throw an exception if it’s not usable.
4.  Write your accessor methods – one for each piece of data your objects need to store. When called with no arguments, the accessor methods should get the current value, when called with an argument, they should set the value. Again, when setting, validate the data and throw an exception if the passed value is unusable.
5.  Write the functions you need to provide.
6.  Provide a `.toString()` function.
7.  Provide a `.clone()` function.
8.  Provide comparison functions (`.equals()` & `.compareTo()`).

## Challenge

Add `.equals()` and `.compareTo()` functions to all three prototypes. You can make use of the `.equals()` and `.compareTo()` functions in `pbs.Date` and `pbs.Time` to avoid code duplication in `pbs.DateTime`.

Finally, because our prototypes are all time-related, implement two additional functions in each prototype named `.isBefore()` and `.isAfter()`. You can make use of the prototypes’ `.compareTo()` functions to do most of the work within these new functions.

You can test all of your comparison operators with the following code:

```javascript
var dt1 = new pbs.DateTime(new pbs.Date(4, 7, 2017), new pbs.Time(12));
var dt2 = new pbs.DateTime(new pbs.Date().day(4).month(7).year(2017), new pbs.Time(12));
console.log(dt1.equals(dt2)); // true
console.log(dt2.equals(dt1)); // true
console.log(dt1.compareTo(dt2)); // 0
console.log(dt1.isBefore(dt2)); // false
console.log(dt1.isAfter(dt2)); // false
var dt3 = new pbs.DateTime(dt1.date(), new pbs.Time(11));
console.log(dt3.equals(dt1)); // false
console.log(dt3.compareTo(dt1)); // -1
console.log(dt3.isBefore(dt1)); // true
console.log(dt3.isAfter(dt1)); // false
var dt4 = new pbs.DateTime(dt1.date(), new pbs.Time(12, 15));
console.log(dt4.equals(dt1)); // false
console.log(dt4.compareTo(dt1)); // 1
console.log(dt4.isBefore(dt1)); // false
console.log(dt4.isAfter(dt1)); // true
```

## Making Web Forms Accessible

Let’s leave JavaScript Prototypes behind, and switch context back to HTML forms.

It’s been my aim in this series to skip over all the mistakes made in earlier versions of HTML, and to start by doing things _the right way_. That’s why I want to make the forms we create accessible from the start, and to that end, we should look at the relevant web standard – [WAI-ARIA](http://www.w3.org/TR/wai-aria/).

## A Big-Picture Introduction to WAI-ARIA

ARIA is big, very big. It would take us months to go through it all in any kind of detail. So, what we’ll do is start with a very high-level overview, and then learn the specifics in small bite-sizes pieces as and when we need them.

### The Problem to be Solved

Let’s start with the problem to be solved. Historically, web pages were very simple things, so if developers remembered to do a few little things like add `alt` attributes to `<img>` tags, screen readers and other assistive devices would have no problem helping the visually impaired surf the web. However, things have changed – modern web sites are often interactive, and in fact, many modern sites would be much more accurately described as web-based apps. JavaScript and CSS have turned what was once mostly just text into a collection of complex interactive user interfaces, and assistive technologies need some help to deal with this new reality.

### WAI-ARIA 1.0 to the Rescue

This is where the [Web Accessibility Initiative](https://www.w3.org/WAI/), or WAI, comes in. The WAI are an industry group under the [World Wide Web Consortium](https://www.w3.org) (AKA the WC3) with high-profile members like Adobe, HP & IBM. They work on standards for making the web accessible.

In 2014 WAI finalised the first version of the W3C recommendation on _Accessible Rich Internet Applications_, or WAI-ARIA. This is still the most recent finalised versions of ARIA. To save our sanity, from now on in this series, we’ll refer to version 1.0 of WAI-ARIA as simply ARIA.

### Three Main Components of ARIA

Like I said, ARIA is big, very big, but if you zoom out far enough, you can break it into three broad topic areas:

1.  ARIA Roles
2.  ARIA States & Properties
3.  Keyboard Navigation

These concepts are quite abstract, but in practice, the actual code tends to be very human-friendly, and thankfully, most things in ARIA are well named, so I think most people will find them quite intuitive.

The most important concept is that of ARIA roles. The basic idea is that no matter what HTML tags you use, a page or web app consists of widgets that do certain things, and you should use the `role` attribute to tell assistive technologies what role different HTML elements play on your web page/web app.

For example, you might have a `div` that contains an `h1`, an `h2`, and an image that together form your site’s banner. To make that fact clear to assistive devices, you should add a `role` attribute to the `<div>` tag with the value `banner`:

```html
<div role="banner">
<h1>Bart's Widgets</h1>
<h2>The Best Widgets on the Web by a Country Mile!</h2>
<img src="logo.png" alt="Bart's Wights Corporate Logo" />
</div>
```

The specification defines a lot of different possible roles, and they get quite granular. A very common example of a more granular role is that of `button`. For aesthetic reasons, some websites like to use images with JavaScript click handlers as buttons. Before ARIA this would totally flummox assistive technologies. Now, with ARIA roles, you simply add a `role` attribute with the value `button` to the `<img>` tag, and assistive technologies know they should treat the image as if it were a button.

ARIA roles don’t only exist on elements with explicit `role` attributes, they also exist implicitly for HTML tags for which they make sense.

For example, the top-level `<header>` tag on any page gets the implicit ARIA role `banner`. Unsurprisingly, `<button>` tags get the implicit ARIA role `button`.

Elements on a page that have an ARIA role, be that an explicit role defined with a `role` attribute or an implicit role based on the tag name, can define ARIA states and properties. From a practical point of view, there’s basically no difference between a state and a property, and they’re both defined by adding attributes to html elements who’s names start with `aria-`. The difference is so subtle that the official spec says:

> Because the distinction between states and properties is of little consequence to most web content authors, this specification refers to both “states” and “properties” simply as “attributes” whenever possible.

Different roles support different states and properties, but some states and properties are globally applicable to all elements on a page.

An example of a global property is `aria-hidden`, which can be used to tell assistive technologies to completely ignore an element.

An example of a role-dependent state is `aria-disabled`, which only makes sense on things with roles like `button`, which can be disabled.

Finally, the ARIA spec says that everything clickable must be focusable with the keyboard. In practical terms that basically means you sometimes have to use the `tabindex` attribute when you assign an explicit ARIA role to things. For example, if you use an image as a button you should add two additional attributes to the `<img>` tag, `role="button"`, and something like `tabindex="0"`.

## Properly Accessible Buttons with Glyph Icons

Let’s finish this instalment by getting back to some specifics. In the previous instalment we learned how to use glyph icon sets like Font Awesome to add icons to buttons. Our code looked something like:

```html
<button type="submit">
  <span class="fa fa-save"></span>
  Save
</button>
```

Visually, buttons of this form work fine, but for assistive technologies they contain some potentially confusing additional information – that empty `<span>` tag. This serves no purpose other than visual ornamentation. As such, we should hide it from assistive technologies by applying the `aria-hidden` property to it like so:

```html
<button type="submit">
  <span class="fa fa-save" aria-hidden="true"></span>
  Save
</button>
```

## Final Thoughts

At this stage we’ve nearly finished our second look at JavaScript prototypes. There is just one more object-related concept we need to look at next time – _static_ functions. This is a technical term you may have encountered in the documentation for the various JavaScript APIs we have used, but it’s one we’ve neither defined nor explained in this series to date. It’s about time we rectified that oversight.

Now that we’ve been introduced to WAI-ARIA, we’re ready to start learning about more types of form elements. In the next instalment we’ll look at two new types – checkboxes and radio buttons, and we’ll learn how to use them so they are compatible with accessibility tools like screen readers.
