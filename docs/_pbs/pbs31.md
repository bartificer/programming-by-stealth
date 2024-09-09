---
title: JS Static Functions | Checkboxes & Radio Buttons
instalment: 31
creators: [bart, allison]
date: 2017-03-01
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_03_01.mp3
---

We’re going to continue our twin-track approach in this instalment – first some JavaScript, then some HTML Forms. We’ll start with my sample solution to the challenge set in [the previous instalment](https://pbs.bartificer.net/pbs30). Then we’ll look at one final new concept related to JavaScript prototypes – static functions. We’ll wrap up our revision and deeper dive into JavaScript prototypes with a final, finished
 version of our algorithm for generating prototypes.

Switching our focus on HTML forms, we’ll look at some important form-specific ARIA roles, we’ll introduce two useful tags for enclosing forms, or parts of forms, `<fieldset>` & `<legend>`. We’ll introduce the concept of form data. With those foundations laid, we’ll look at how to add checkboxes and radio buttons to web forms, and how to interact with them through jQuery.

You can download a ZIP file containing the code files for this instalment [here](https://www.bartbusschots.ie/s/wp-content/uploads/2017/03/pbs31.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs31.zip).

## Matching Podcast Episode 478

Listen Along: Chit Chat Across the Pond Episode 478

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_03_01.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_03_01.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 30 Challenge Solution

The challenge was to add comparison functions to all three of our prototypes.

You can find my entire solution in the file named `pbs30-challengeSolution` in this instalment’s ZIP file. Below are the snippets that are relevant to the challenge:

```javascript
// init name space
var pbs = pbs ? pbs : {};

// define all prototypes within an anonymous self executing fuction
(function(pbs, undefined){
	//
	// ==== Define Needed Helper Functions ===
	//

	// .....

	//
	// === Define Time prototype (Part 1) ===
	//

	// .....

	// define comparison functions
	pbs.Time.prototype.equals = function(obj){
		if(typeof obj !== 'object'){
			return false;
		}
		if(! obj instanceof pbs.Time){
			return false;
		}
		return obj._hours === this._hours && obj._minutes === this._minutes && obj._seconds === this._seconds;
	};
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
	pbs.Time.prototype.isBefore = function(obj){
		return this.compareTo(obj) === -1;
	}
	pbs.Time.prototype.isAfter = function(obj){
		return this.compareTo(obj) === 1;
	}

	//
	// === Define the Date Prototype ===
	//

	// .....

	// define comparison functions
	pbs.Date.prototype.equals = function(obj){
		if(typeof obj !== 'object'){
			return false;
		}
		if(! obj instanceof pbs.Date){
			return false;
		}
		return obj._day === this._day && obj._month === this._month && obj._year === this._year;
	};
	pbs.Date.prototype.compareTo = function(obj){
		// make sure we have a valid object to test
		if(!(typeof obj === 'object' && obj instanceof pbs.Date)){
			return NaN;
		}

		// check if the years are different
		if(this._year < obj._year){
			return -1;
		}
		if(this._year > obj._year){
			return 1;
		}

		// if we got here, the years are the same, so check the months
		if(this._month < obj._month){
			return -1;
		}
		if(this._month > obj._month){
			return 1;
		}

		// if we got here, the years and months are the same, so check the days
		if(this._day < obj._day){
			return -1;
		}
		if(this._day > obj._day){
			return 1;
		}

		// if we got here the two dates are equal, so return 0
		return 0;
	};
	pbs.Date.prototype.isBefore = function(obj){
		return this.compareTo(obj) === -1;
	}
	pbs.Date.prototype.isAfter = function(obj){
		return this.compareTo(obj) === 1;
	}

	//
	// === Define the DateTime Prototype ===
	//

	// .....

	// define comparison functions
	pbs.DateTime.prototype.equals = function(obj){
		if(typeof obj !== 'object'){
			return false;
		}
		if(! obj instanceof pbs.DateTime){
			return false;
		}
		return this._date.equals(obj._date) && this._time.equals(obj._time);
	};
	pbs.DateTime.prototype.compareTo = function(obj){
		// make sure we have a valid object to test
		if(!(typeof obj === 'object' && obj instanceof pbs.DateTime)){
			return NaN;
		}

		// check if the dates are different
		var dateCompare = this._date.compareTo(obj._date);
		if(dateCompare !== 0){
			return dateCompare;
		}

		// if we got here, the dates are the same, so check the times
		var timeCompare = this._time.compareTo(obj._time);
		if(timeCompare !== 0){
			return timeCompare;
		}

		// if we got here the two date times are equal, so return 0
		return 0;
	};
	pbs.DateTime.prototype.isBefore = function(obj){
		return this.compareTo(obj) === -1;
	}
	pbs.DateTime.prototype.isAfter = function(obj){
		return this.compareTo(obj) === 1;
	}
})(pbs);

//
// === Test Code ===
//

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

Our prototypes are now pretty complete – they have constructors, accessors, various functions for outputting the data as strings of various formats, support for cloning, and comparison functions.

## Instance Functions

The functions we have written to build out our prototypes can be divided into three categories:

- There are the unpublished private helper functions which are not really part of the prototypes, but rather, are utility functions used by the functions that do make up the prototype to avoid needless code reuse. When I say _unpublished_, I mean they are not available in the global scope.
- Constructors – the published functions that build instances of our prototypes
- All the other functions that make up our prototypes. We have not explicitly stated it before, but those functions all have something in common. They are all so-called _instance functions_ (or _instance methods_).

What does it mean to be an instance function? As the name suggests, instance functions are functions that are written to be called **on instances** of a prototype.

Consider the following simple code snippet:

```javascript
var t = new pbs.Time(16);
console.log(t.time12());
```

On the first line, we create an instance of the prototype `pbs.Time` and name that object `t`. So, `t` is an object, and, more specifically, `t` is an instance of the prototype `pbs.Time`.

On the second line we call the function `time12()` on `t`. In other words, we call the function `time12()` on an instance of the `pbs.Time` prototype.

Let’s think about this in a little more detail – how does JavaScript know what to do when you say `t.time12()`? Where does it go looking for a function named `time12`?

The key is what `t` is – `t` is an object, and what’s more, `t` is an object that has the prototype `pbs.Time` (because that was the constructor that built it). That means that the function that will be called will be `pbs.Time.prototype.time12()`. What’s more, when that function executes, the special variable `this` within it will contain a reference to the object `t`.

You can recognise the definition of an instance function because it will have a name of the form `PrototypeName.prototype.functionName`. In our example above, the function was `pbs.Time.prototype.time12`, where `pbs.Time` is the name of the prototype, and `time12` the name of the function.

You can recognise an instance function being invoked because the thing on the left will be an object that is an instance of a prototype.

## Static Functions

Prototypes can contain another category of functions, so-called _static functions_, or colloquially, _class functions_. These functions are not called on instances of prototypes. Instead, they are properties of the prototype itself. Static functions are used to add functionality to the prototype as a whole, not to instances of the prototype.

I’m sure that sounds both abstract and confusing. So let’s try make it more concrete with an example. The concept of a leap years is definitely related to the concept of dates; so it has relevance of our `pbs.Date` prototype. However, leap years are not dates. So a function for checking if a given year is a leap year doesn’t make sense as an instance function. If you wanted to find out if 1900 was a leap year, it would not make sense to have to write code like this:

```javascript
var testYear = 1900;
var tempDate = new pbs.Date(1, 1, testYear);
if(tempDate.isLeapYear()){
  console.log(testYear + ' IS a leap year');
}else{
  console.log(testYear + ' is NOT a leap year');
}
```

That code just doesn’t make sense – it’s definitely a bad smell! I’d argue that the following code snippet makes a lot more sense and makes for much more readable code:

```javascript
var testYear = 1900;
if(pbs.Date.isLeapYear(testYear)){
  console.log(testYear + ' IS a leap year');
}else{
  console.log(testYear + ' is NOT a leap year');
}
```

Notice that in this case, the function `isLeapYear()` is not being called on an instance of `pbs.Date` (like `tempYear` in the first example), but directly on the prototype itself – `pbs.Date.isLeapYear(testYear)`. In other words, **we want `isLeapYear` to be a _static function_**.

Let’s write that function:

```javascript
pbs.Date.isLeapYear = function(y){
  // make sure we were passed a plausible year
  if(!isValidInteger(y)){
    throw new TypeError('the year must be an integer');
  }

  // figure out if the year is a leapyear or not
  if(y % 4 === 0){
    // year is divisible by 4, so might be a leap year
    if(y % 100 === 0){
      // a century, so not a leap year unless divisible by 400
      if(y % 400 === 0){
        return true;
      }
    }else{
      // divisible by four and not a century, so a leap year
      return true;
    }
  }

  // if we got here, the year is not a leap year
  return false;
};
```

If you remember, the pattern for the name of an instance function was `PrototypeName.prototype.functionName`, e.g. `pbs.Date.prototype.time12`. The pattern for a static function is simply `PrototypeName.functionName`, hence, `pbs.Date.isLeapYear`.

If you add this code inside your self-executing anonymous function along with the rest of the `pbs.Date` prototype (you can add it anywhere after the `pbs.Date` constructor is defined), you will then be able to run the following test code:

```javascript
console.log(pbs.Date.isLeapYear(1900)); // false
console.log(pbs.Date.isLeapYear(2000)); // true
console.log(pbs.Date.isLeapYear(2001)); // false
console.log(pbs.Date.isLeapYear(2004)); // true
```

My version of our prototype makes use of a private helper function named `isValidateDMYCombo` for checking if a given day, month, and year combination is valid. That function has to check if a given year is a leap year every time the given month is February. Here is the full code for the function as it stands:

```javascript
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
```

Notice we now have code duplication between this function and our new `pbs.Date.isLeapYear()` static function. We can remedy that by refactoring the `isValidateDMYCombo()` private helper function to use the `pbs.Date.isLeapYear()` static function:

```javascript
// helper function to validate a given combination of day, month, and year
function isValidateDMYCombo(d, m, y){
  // figure out how many days are allowed in the curreny month
  var numDaysInMonth = daysInMonthLookup[m];
  if(m === 2){
    // the month is February, so check for a leap year and
    // if we are a leap year, change the days to 29
    if(pbs.Date.isLeapYear(y)){
      numDaysInMonth = 29;
    }
  }

  // return based on wheather or not the days are valid
  return d <= numDaysInMonth ? true : false;
}
```

## A Challenge

To help you get to grips with the concept of static functions, let’s write and test some!

Firstly, write a static function named `pbs.Date.leapYearsBetween()` that takes two arguments, both years as integers, and returns an array of all leap years between those two years (inclusive).

You’ll know your code works when the following test code produces the following output:

```javascript
console.log("The Leap Years between 2000 and 2100 (inclusive):");
pbs.Date.leapYearsBetween(2000, 2100).forEach(function(ly){
  console.log("* " + ly);
});
```

```
The Leap Years between 2000 and 2100 (inclusive):
* 2000
* 2004
* 2008
* 2012
* 2016
* 2020
* 2024
* 2028
* 2032
* 2036
* 2040
* 2044
* 2048
* 2052
* 2056
* 2060
* 2064
* 2068
* 2072
* 2076
* 2080
* 2084
* 2088
* 2092
* 2096

```

Secondly, create the following three static functions: `pbs.Date.areEqual()`, `pbs.Time.areEqual()`, and `pbs.DateTime.areEqual()`. Each of these functions should take two or more instances of the relevant prototype as arguments, and check whether or not they are all equal to each other, returning `true` if they are, and `false` in all other cases. You can test your functions with the code below:

```javascript
// PBS 31 - Part 2a
var t1 = new pbs.Time();
var t2 = new pbs.Time();
var t3 = new pbs.Time(15);
var t4 = new pbs.Time(15);
var t5 = new pbs.Time(15);
console.log(pbs.Time.areEqual(t1, t2)); // true
console.log(pbs.Time.areEqual(t1, t2, t3)); // false
console.log(pbs.Time.areEqual(t3, t4, t5)); // true

// PBS 31 - Part 2b
var d1 = new pbs.Date();
var d2 = new pbs.Date();
var d3 = new pbs.Date(25, 12, 1980);
var d4 = new pbs.Date(25, 12, 1980);
var d5 = new pbs.Date(25, 12, 1980);
console.log(pbs.Date.areEqual(d1, d2)); // true
console.log(pbs.Date.areEqual(d1, d2, d3)); // false
console.log(pbs.Date.areEqual(d3, d4, d5)); // true

// PBS 31 - Part 2c
var dt1 = new pbs.DateTime();
var dt2 = new pbs.DateTime();
var dt3 = new pbs.DateTime(d5, t5);
var dt4 = new pbs.DateTime(d5, t5);
var dt5 = new pbs.DateTime(d5, t5);
console.log(pbs.DateTime.areEqual(dt1, dt2)); // true
console.log(pbs.DateTime.areEqual(dt1, dt2, dt3)); // false
console.log(pbs.DateTime.areEqual(dt3, dt4, dt5)); // true
```

You can use your own version of our three prototypes as your starting point, or you can use the file `pbs31-challengeStartingPoint.js` in this instalment’s ZIP file.

## Final JavaScript Prototype Algorithm

Given all we have learned over the past few instalments, we need to update our original six-step process for creating prototypes one last time to the following nine-step process:

1.  Gather your requirements, specifically:
    1.  What data do your objects need to store
    2.  What instance functions need to be provided
    3.  What static functions need to be provided
2.  Initialise your namespace and start a self-executing anonymous function within which you’ll define your prototype.
3.  Write your constructor. In general, your constructor should accept initial values for all your object’s pieces of data, and if none are provided, a sane default should be used. You should validate all data from the user and throw an exception if it’s not usable.
4.  Write your accessor methods – one for each piece of data your objects need to store. When called with no arguments, the accessor methods should get the current value, when called with an argument, they should set the value. Again, when setting, validate the data and throw an exception if the passed value is unusable.
5.  Provide a `.clone()` function.
6.  Provide comparison functions (`.equals()` & `.compareTo()`).
7.  Write the instance functions you need to provide.
8.  Write the static functions you need to provide.
9.  Provide a `.toString()` function.

## HTML Form-related ARIA Roles & Fieldsets

Switching our focus back to HTML forms, we need to lay a little more generic groundwork before we can look at checkboxes and radio buttons.

ARIA recommends that regions of a page that together make up a form should be contained inside an element with the ARIA landmark role `form`, unless the form’s purpose is to provide a search box, in which case it should get the ARIA landmark role `search`.

If your form is complex, containing groups of related form inputs, you should group them inside elements with the ARIA role `group`.

If you add `form`, `search`, or `group` roles to elements, you should also provide labels for those elements, and tie them to the landmark with the `aria-labelledby` attribute. Note that we mean _label_ in the generic sense. You don’t have to use the `<label>` tag. Other tags are often more appropriate, e.g. `<h3>`.

To use `aria-labelledby`, you need to give the element that will act as the label an ID. You then add the `aria-labelledby` attribute to the element that has the role, and use the ID of the label element as the value of the attribute. This is very similar to how the `<label>` tag’s `for` attribute works.

One pair of related HTML tags lends itself to this kind of form grouping and labelling particularly well – the `<fieldset>` and `<legend>` tags. The `<fieldset>` tag is a block-level tag that can contain pretty much any other tags you like, including other `<fieldset>` tags. A fieldset can have one legend. If present, the legend must be the first element within the fieldset. Legends are defined with the `<legend>` tag. By default, fieldsets are rendered as a box with a border, and if present, the legend is inset into the top border of the box. The `<fieldset>` tag is well suited for the ARIA roles `form`, `search`, and `group`, and the `<legend>` tag is well suited to acting as the matching label.

Many screen readers will automatically assume a legend describes the fieldset it belongs to. So it could be argued that the `aria-labelledby` attribute is redundant when using these tags. However, I couldn’t find anything in the ARIA spec to indicate that relying on this default behaviour complies with the spec. So I’ll be adding the `aria-labelledby` attribute in my examples.

We’ll see an example use of both the `<fieldset>` and `<legend>` tags shortly.

## HTML Form Data

Before we look at how to add form inputs of various kinds to our forms, we should take a moment to remember the origins of HTML forms, because those origins still have implications for how form inputs behave today.

As we mentioned before, originally, forms were designed to be submitted to a server for processing – when a submit button is pushed, all the data in the form is encoded and sent to the URL specified by the `action` attribute. Today, many forms are never submitted anywhere, but instead are processed on the client-side using JavaScript. This is what we’ll be doing in this series, at least for the short to medium term.

When forms are submitted, the data the form represents is encoded as name-value pairs. That means that all the various types of form input – checkboxes, radio buttons, drop-downs, text fields, etc. – must produce name-value pairs.

There are multiple different mechanisms for submitting form data to a server, but one of them (GET) involves adding the encoded data to the end of the URL, using the `?` character to mark the start of the form data, the `=` character to separate the names from the values within each name-value pair, and the `&` character to separate the name-value pairs from each other. You may well recognise this description. You’ve probably seen many thousands of URLs with form data encoded into them in your life! An example is in the URL for Allison’s Amazon affiliate link: `https://www.amazon.com/?tag=httppodfeecom-20`.

## Checkboxes & Radio Buttons

Let’s look at two related form input types – checkboxes and radio buttons. These two inputs have a lot in common, and yet, are also distinctly different beasts.

A checkbox is a stand-alone binary input. It has two states, checked, and unchecked. A single radio button is also a binary input that is either checked or unchecked, but radio buttons don’t come in ones, they come in groups. At any one time, no more than one radio button in a group can be checked. If one is already checked, and you check another, the one that was checked gets automatically unchecked. The channel selection buttons on vintage car radios behave like this, hence the name.

### Checkboxes in HTML

We use the `<input>` tag with the `type` attribute set to `checkbox` to create a checkbox. The `name` attribute is used to specify the name part of the associated name-value pair and the `value` attribute to specify the value part. If you don’t plan to submit your form, you can safely leave out the `name` and `value` attributes.

Here’s a simple sample checkbox:

```html
<input type="checkbox" name="tos_agree" value="yes" />
```

A checkbox without a label is useless to everyone, sighted and visually impaired alike, so remember to add labels to your checkboxes. You can either wrap a `<label>` tag around your checkbox, or have the `<label>` tag be separate, but linked by ID using the `for` attribute:

```html
<!-- either -->
<label>
  <input type="checkbox" name="tos_agree" value="yes" />
  I agree to something
</label>

<!-- or -->
<input type="checkbox" name="tos_agree" value="yes" id="cbk1" />
<label for="cbk1">I agree to something</label>
```

Note that when a form containing a checkbox is submitted, the name-value pair is entirely omitted when the checkbox is not checked. If a name is specified, but no value, the value defaults to `'on'`.

### Radio Buttons in HTML

Radio buttons are very similar to checkboxes – they’re also created using the `<input>` tag, but with a value of `radio` for the `type` attribute. For radio buttons, the `name` attribute is required.

You use one `<input>` tag for each radio button in a group. The `name` attribute is used to tie the separate radio buttons together into a radio button group – all `<input>` tags with a `type` of `radio` that share the same `name` are interpreted as belonging to the same radio button group.

When a form containing a radio button group is submitted while none of the radio buttons in the group are checked, the name-value pair is entirely omitted, as with checkboxes. However, if one of the radio buttons in the group is checked, then that radio button’s value is used (along with the group’s shared name).

Each radio button in a group should be labeled using either of the two techniques shown above for checkboxes – i.e. by wrapping the radio button and the text that describes it in a `<label>` tag, or by giving the radio button an ID and linking `<label>` tag elsewhere in the document to the radio button using the `for` attribute (on the `<label>` tag).

To make your radio button groups accessible, all the radio buttons that make up a group should be enclosed within a single tag of your choice, and that tag should be given the ARIA role `radiogroup`. Finally, ARIA recommends that a label be added for the entire radio group. This is done by giving the label an ID, and adding that ID as the value for the `aria-labelledby` attribute on the element with the role `radiogroup`. I’m using the world _label_ in the descriptive sense here – you can use the `<label>` tag if you like, but you can also use any other tag that makes sense, e.g. `<h3>`.

Below is a sample radio button group:

```html
<div role="radiogroup" aria-labelledby="tos_radgrp_desc">
  <label id="tos_radgrp_desc">Do you agree to our TOS?</label>
  <label>
    <input type="radio" name="tos_radgrp" value="yes" /> Yes
  </label>
  <label>
    <input type="radio" name="tos_radgrp" value="no" /> No
  </label>
</div>
```

### The `checked` Property

Both checkboxes and radio buttons default to not being checked. You can have individual checkboxes or radio buttons default to being checked using the `checked` attribute and giving it the value `checked`.

For example, the following checkbox would be checked by default:

```html
<label>
  <input type="checkbox" name="tos_agree" value="yes" checked="checked" />
  I agree to something
</label>
```

There is also a matching CSS pseudo-class `:checked`, which matches only checkboxes or radio buttons that are checked.

## A Checkbox & Radio Button Example

Below is the code for a simple HTML document containing a single form which contains a checkbox and a radio button group. I’ve also added a button that will show the form data associated with the form. Try checking the checkbox and then pushing the button to see the effect that has on the form data. You’ll also find a copy of this code in the file `pbs31.html` in this instalment’s ZIP file.

```html
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8" />
	<title>PBS 31 - Checkboxes &amp; Radio Buttons Example</title>
	<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
	<script type="text/javascript">
		// the DOM ready event handler
		$(function(){
			// add a click handler to the button
			$('#show_btn').click(function(){
				$('#formdata_out').text($('#pbs31_fm').serialize());
			}).click();
		});
	</script>
</head>
<body>
<h1>Checkboxes &amp; Radio Buttons Example</h1>

<form action="javascript:void();" id="pbs31_fm">
<fieldset role="form" aria-labelledby="pbs31_fm_desc">
  <legend id="pbs31_fm_desc">A Simple Form</legend>

  <ul>
    <li>
      <label>
        <input type="checkbox" name="tos_agree" value="yes" id="tos_agree_cb" />
        I agree to something or other
      </label>
    </li>
    <li role="radiogroup" aria-labelledby="nerd_desc">
      <label id="nerd_desc">Are you are Nerd?</label>
      <label>
        <input type="radio" name="nerd" value="yes" checked="checked" id="nerd_yes_rb" />
        yes
      </label>
      <label>
		<input type="radio" name="nerd" value="no" id="nerd_no_rb" />
		no
	  </label>
	  <label>
	    <input type="radio" name="nerd" value="maybe" id="nerd_maybe_rb" />
		maybe a little
	  </label>
    </li>
  </ul>

  <p><button type="button" id="show_btn">(re)Generate Form Data</button></p>
</fieldset>
</form>
<h2>The Form Data</h2>
<pre id="formdata_out"></pre>
</body>
</html>
```

We’re not going to focus on it now, but in case you’re curious, you can use the jQuery function `.serialize()` to extract the form data from a form – that’s how the button on this page works.

### jQuery & Checkboxes

When it comes to interacting with both checkboxes and radio buttons, the three most important aspects are the names, the values, and the checked status. We can use jQuery to both get and set all three of these things.

To play along with the examples in this section, open `pbs31.html` in the browser of your choice and activate the web/javascript console.

We can use jQuery’s `.val()` function to get or set the value associated with a checkbox or an individual radio button. For example, we can get the value associated with the checkbox on our example page by entering the following in the console:

```javascript
$('#tos_agree_cb').val()
```

Before we continue, be sure the checkbox is checked, and then press the button. You should see that the form data contains `tos_agree=yes` because the checkbox with the name `tos_agree` and the value `yes` is checked (it has the ID `tos_agree_cb`).

Now, let’s change the value associated with this checkbox by entering the following in the console:

```javascript
$('#tos_agree_cb').val('boogers')
```

Now, push the button again, and notice that `tos_agree=yes` has become `tos_agree=boogers`.

Before we continue, do a shift+refresh on the page to get everything back to normal.

To get or set the name associated with a checkbox or a radio button, we need to use jQuery’s `.attr()` function with `'name'` as the first argument.

We can get the name associated with the checkbox with the ID `tos_agree_cb` by entering the following in the console:

```javascript
$('#tos_agree_cb').attr('name')
```

Before continuing, check the checkbox and press the button. Note that the form data again contains `tos_agree=yes`.

We can change the name associated with this checkbox by entering the following in the console:

```javascript
$('#tos_agree_cb').attr('name', 'boogers_agree')
```

If we hit the button again, we can see that `tos_agree=yes` has become `boogers_agree=yes`.

We can also make use of the CSS attribute selectors we learned about in [instalment 28](https://pbs.bartificer.net/pbs28) to search for elements in the page by name. For example, enter the following in the console to see how many inputs on the page have the name `nerd`:

```javascript
$('input[name="nerd"]').length
```

In a small document like this example, that is more than specific enough, but in a larger document we might want to be a little more specific, and limit our search to just radio buttons. We could do that like so:

```javascript
$('input[type="radio"][name="nerd"]').length
```

We can also use the CSS pseudo-class `:checked` to count the number of inputs (checkboxes or radio buttons) that are currently checked:

```javascript
$('input:checked').length
```

While the `:checked` pseudo-class is often very useful, there is a more powerful way to interact with the checked status – jQuery’s `.prop()` function with `'checked'` as the first argument. jQuery considers whether or not a checkbox or a radio button is checked a property rather than an attribute, hence the use of `.prop()` rather than `.attr()`.

Before we continue, shift+refresh the page so you have a fresh copy going forward.

We can check whether or not a given input is checked by entering the following in the console:

```javascript
$('#tos_agree_cb').prop('checked')
```

Try checking the checkbox and then running the same code again.

We can also set the current checked state of a checkbox or radio button like so:

```javascript
$('#nerd_maybe_rb').prop('checked', true)
```

Notice that the nerd radio button group changed from _yes_ to _maybe a little_.

We can also use the CSS attribute selector to change the selected value in a radio button group based on the value we want (this will only work if one of the radio buttons has the desired value assigned):

```javascript
$('input[type="radio"][name="nerd"][value="yes"]').prop('checked', true)
```

Finally, we can also use the attribute selector to get the value of the currently selected radio button in a radio button group:

```javascript
$('input[type="radio"][name="nerd"]:checked').val()
```

## Final Thoughts

Now that we’ve learned about static functions, and updated our algorithm for creating prototypes to the final nine-step version, we are finished with our second look at JavaScript prototypes. Before we are ready to look at test-driven-development (TDD), we need to revisit JavaScript’s exception handling features – specifically the `throw`, `try`, and `catch` keywords. This is what we’ll do in the JavaScript portion of the next instalment.

On the HTML side we have now learned a little more about forms in general, and how to add checkboxes and radio button groups into our forms. In the next instalment we’ll look at adding drop-down menus to our forms, and perhaps some of the many text-based inputs supported by HTML 5.
