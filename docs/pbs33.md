# PBS 33 of x – JS Testing with QUnit

I had intended to continue running parallel JavaScript and HTML streams for this instalment, but when preparing the notes for the JavaScript stream it became obvious I’d need the dedicate the entire instalment to JavaScript.

What we’ll be doing in this instalment is taking a first look at the concept of software testing. Testing is a vital tool in a software developer’s toolbox. In particular we’ll be looking at two useful concepts, and a tool to help us build and run our test suites. We’ll be looking at the concepts of Test Driven Development (TDD), and Unit Testing (UT). We won’t be religiously adhering to either – instead, I want to encourage you to pick and choose the aspects of these things that work for you.

The tool we’ll be looking at to implement our JavaScript test suites is [QUnit](http://qunitjs.com). This is a Unit Testing framework developed by the jQuery project, and used by them for jQuery’s test suite.

All code files used in this instalment are contained in a single ZIP file which you can download [here](https://www.bartbusschots.ie/s/wp-content/uploads/2017/04/pbs33.zip) or [here on GitHub](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentZips/pbs33.zip).

# Matching Postcast Episode https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_04_14.mp3

Listen along to this instalment on [episode https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_04_14.mp3 of the Chit Chat Across the Pond Podcast](https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_04_14.mp3)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_04_14.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_04_14.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to PBS 32 Challenge

In [the previous instalment](https://bartificer.net/pbs32) we looked at using `throw`, `try` & `catch` for error handling in JavaScript.

The assignment was to create a web page that contains five dropdown menus allowing the user to select an hour, minute, day, month, and year, and a button that when pushed renders the selected date and time in ISO8601 format (the format outputted by `pbs.DateTime.prototype.toString()`), as well as all permutations of American and European date formats and 12 and 24 hour time formats. When the user chooses an impossible date, the page should handle that error in a sane way.

Below is my solution, which you’ll also find in this instalment’s ZIP file as `pbs32-challenge-solution/index.html`:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8" />
	<title>PBS 32 Challenge</title>
	
	<!-- Import the jQuery library -->
	<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
	
	<!-- Import our Date & Time prototypes -->
	<script src="./pbs.datetime.js" type="text/javascript"></script>
	
	<!-- Add event handlers to our page -->
	<script type="text/javascript">
		// the DOM ready event handler
		$(function(){
			// add the options to the hour select
			var $hours = $('#hour_sel');
			for(var h = 0; h <= 23; h++){
				$hours.append($('<option>').text(h < 10 ? '0' + h : h).val(h));
			}
			$('option[value="0"]', $hours).prop('selected', true);
			
			// add the options for the minute select
			var $mins = $('#min_sel');
			for(var m = 0; m <= 59; m += 5){
				$mins.append($('<option>').text(m < 10 ? '0' + m : m).val(m));
			}
			$('option[value="0"]', $mins).prop('selected', true);
			
			// add the options to the day select
			var $days = $('#day_sel');
			for(var d = 1; d <= 31; d++){
				$days.append($('<option>').text(d).val(d));
			}
			$('option[value="1"]', $days).prop('selected', true);
			
			// add the options to the month select
			var month_abbrev_lookup = {
				1: 'Jan',
				2: 'Feb',
				3: 'Mar',
				4: 'Apr',
				5: 'May',
				6: 'Jun',
				7: 'Jul',
				8: 'Aug',
				9: 'Sep',
				10: 'Oct',
				11: 'Nov',
				12: 'Dec',
			}
			var $months = $('#month_sel');
			for(var m = 1; m <= 12; m++){
				$months.append($('<option>').text(month_abbrev_lookup[m]).val(m));
			}
			$('option[value="1"]', $months).prop('selected', true);
			
			// add the options to the year select
			var $years = $('#year_sel');
			for(var y = 2000; y <= 2100; y++){
				$years.append($('<option>').text(y).val(y));
			}
			$('option[value="2000"]', $years).prop('selected', true);
			
			// add a click  handler to the button
			$('#render_btn').click(function(){
				// assume there will be no error, so blank the error message
				var $error = $('#error_out');
				$error.text('').hide();
				
				// create a date object
				var dt = new pbs.DateTime();
				
				// try set it to the value represented by the form
				try{
					var d = new pbs.Date();
					d.year($years.val());
					d.month($months.val());
					d.day($days.val());
					dt.date(d);
					dt.time(new pbs.Time($hours.val(), $mins.val()));
				}catch(err){
					$error.text('Failed to interpret date with error: ' + err.message);
					$error.show();
					$('#dates_list dd').text('???');
					return;
				}
				
				// render the date
				$('#inter_out').text(dt.toString());
				$('#eur12_out').text(dt.european12Hour());
				$('#eur24_out').text(dt.european24Hour());
				$('#usa12_out').text(dt.american12Hour());
				$('#usa24_out').text(dt.american24Hour());
			}).click();
		});
	</script>
	
	<!-- Define local styles -->
	<style type="text/css">
		/* Use Helvetica as the default font */
		body {
			font-family: Helvetica, Arial, sans;
		}
		
		/* Hide labels for ARIA-only from the browser */
		.aria-only {
			display: none;
		}
		
		/* Make headers bold */
		legend, dt {
			font-weight: bold;
		}
		
		/* Style the formatted dates */
		#dates_list dd {
			color: DimGrey;
			font-family: Courier New, Courier, monospace;
		}
		#dates_list #eng_out {
			font-family: cursive;
		}
		
		/* style errors */
		#error_out {
			color: DarkRed;
			background-color: Cornsilk;
			border: 1px dotted DarkRed;
			border-radius: 10px;
			margin: 10px;
			padding: 10px;
		}
	</style>
</head>
<body>
<h1>JS Error Handling Example</h1>

<form action="javascript:void();" id="dt_fm">
<fieldset role="form" aria-labelledby="dt_fm_desc">
	<legend id="dt_fm_desc">Date/Time Renderer</legend>
	
	<ul>
		<li role="group" aria-labelledby="dt_time_lbl">
			<label id="dt_time_lbl">Time: </label>
			<label for="hour_sel" class="aria-only">Hours</label>
			<select id="hour_sel"></select>
			<span aria-hidden="true">:</span>
			<label for="min_sel" class="aria-only">Minutes</label>
			<select id="min_sel"></select>
		</li>
		<li role="group" aria-labelledby="dt_date_lbl">
			<label id="dt_date_lbl">Date:</label>
			<label for="day_sel" class="aria-only">Day of Month</label>	
			<select id="day_sel"></select>
			<label for="month_sel" class="aria-only">Month</label>
			<select id="month_sel"></select>
			<label for="year_sel" class="aria-only">Year</label>
			<select id="year_sel"></select>
		</li>
	</ul>

	<p><button type="button" id="render_btn">Render Date &amp; Time</button></p>
	
	<div id="error_out"></div>
	<dl id="dates_list">
	  <dt>International (ISO8601) Format:</dt>
	  <dd id="inter_out"></dd>
	  <dt>European Format (12 Hour):</dt>
	  <dd id="eur12_out"></dd>
	<dt>European Format (24 Hour):</dt>
	  <dd id="eur24_out"></dd>
	  <dt>American Format (12 Hour):</dt>
	  <dd id="usa12_out"></dd>
	  <dt>American Format (24 Hour):</dt>
	  <dd id="usa24_out"></dd>
	</dl>
</fieldset>
</form>
</body>
</html>
```

My solution is largely similar to the example `pbs32a.html` from the previous instalment’s zip file. The biggest difference being the addition of more dropdown menus to allow the time to be chosen as well as the date. One difference is that for clarity, I choose to group the date and time dropdown menus into separate list items, and, to mark them up as form groups using the relevant ARIA markup – `role="group"` and the `aria-labelledby` attribute.

## Test Driven Development (TDD)

TDD is a methodology for writing code. The basic process involves repeating the following steps over and over again until the code is done:

1.  Write new tests
2.  Run the new tests and make sure they all fail – if a test passes before you’ve written the code, then that test is probably flawed!
3.  Write some code
4.  Run all your tests (repeat this step and the one above until all new tests pass)
5.  From time-to-time, refactor your code if it starts to get needlessly complicated

There are all sorts of advantages to TDD. Firstly, it forces you to stop and think before you write a single line of code. It makes you decide on what to do about edge cases as you write the tests, and, as your code base develops over time, the library of tests should prevent you from accidentally breaking things that worked before, i.e. to avoid regressions.

In order to make use of the TDD methodology, you need some kind of testing framework/API which allows you to define and run your tests in an orderly manner. You could write your own testing functions from scratch, but that would be re-inventing the wheel, and I’m not generally in favour of doing that – I think it’s much better to use an existing framework instead.

## Introducing QUnit – a JS Unit Testing Framework

TDD is a design philosophy or process, unit testing is an approach to running tests. Unit Testing involves atomising your tests so that previous tests have no effect on future tests. Basically, you define a set of initial conditions, known as your _fixture_, and you run each test against a new clone of that fixture. A lot of the time, the fixture is actually totally empty BTW.

[QUnit](https://qunitjs.com) is an open source framework for unit-testing JavaScript code that has been developed by the jQuery people, who use it for all the various jQuery projects like the core jQuery library and jQuery UI. QUnit can be run in two modes – on the command line through NodeJS, or, in the browser. We’ll be using QUnit in the browser.

When doing testing, you don’t want to include your tests in the same file as your code – you don’t want your tests included in your live running code. Instead, you want to add your tests to a separate file, or set of files, that sits next to your code in your development environment, and is never copied to your live website.

When using QUnit in the browser you’ll end up with three files:

1.  A `.js` file containing the API (or other JS code) you’re testing
2.  A `.js` file containing your tests (for big projects you might split this file up into multiple files for convenience)
3.  A simple HTML page that imports QUnit, imports the `.js` files above, and, defines your fixture. QUnit will automatically inject a form into this page that that will allow you to run your defined tests, and, see the results

### Assertions

Each of your tests will contain one or more _assertions_. You can think of assertions as statements of expected fact – if your code is working correctly, all your assertions will be true.

QUnit ships with an impressive collection of ready-to-use assertions, and, it provides the functionality for adding your own custom assertions too. For now, we’ll limit ourselves to just a few of the most basic assertions:

`assert.ok(state [, message])`

This is the simplest of the assertions, it passes if the first argument evaluates to any truthy value of any kind.

`assert.equal(actual, expected [, message])`

Tests `actual` against `expected` using the `==` operator and if that comparison returns `true`, the assertion passes.

`assert.strictEqual(actual, expected [, message])`

Tests `actual` against `expected` using the `===` operator and if that comparison returns `true`, the assertion passes.

`assert.notEqual(actual, expected [, message])`

This test is the inverse of `assert.equal()` – it tests `actual` against `expected` using the `!=` operator.

`assert.notStrictEqual(actual, expected [, message])`

This test is the inverse of `assert.strictEqual()` – it tests `actual` against `expected` using the `!==` operator.

`assert.deepEqual(actual, expected [, message])`

Like `assert.equal()`, but for comparing nested data like arrays rather than single values.

`throws(blockFn, [expected , message])`

Tests whether the callback `blockFn` throws the `expected` error. You can accept any error at all by omitting `expected`. You can specify the error string you expect, a regular expression, or, the prototype of the expected error.

### A Worked Example

Let’s work through a simple practical example – let’s develop a very basic API that collects together a few maths functions using the following specification:

> The API should be named `pbs.math`, and should provide the following functions:
> 
> `factorial(n)`
> 
> The function should return the factorial of `n` (the first argument) as an integer. The function should throw a new `Error` if `n` is not a positive integer. You’ll find a [definition of factorials on Wikipedia](https://en.wikipedia.org/wiki/Factorial).
> 
> `fibonacciSeries(n)`
> 
> The function should return the fibonacci series up to and possibly including `n` as an array of integers. The function should throw an error if `n` is not a number, and return an empty array if `n` has a value below 0. You should use the modern variant of the sequence which uses `[0, 1]` as the starting point for the series. You’ll find a [definition of the Fibonacci Series on Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number).

We’ll start with by creating the following three blank files (paths relative to the base folder for the project):

1.  `pbs.math.js` – the file that will contain our API.
2.  `test/index.html` – the QUnit test runner.
3.  `test/pbs.math.test.js` – the file that will contain our tests.

Remember, with TDD you shouldn’t write code until you’ve defined some tests for that code to pass, so once we have the three blank files created, the next step is to set up our QUnit test runner in `test/index.html`:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
    <title>pbs.math.js Test Suite</title>
    
    <!-- load the QUnit style sheet from the jQuery CDN -->
    <link rel="stylesheet" type="text/css" href="https://code.jquery.com/qunit/qunit-2.3.0.css" />
    
    <!-- load the API to be tested -->
    <script type="text/javascript" src="../pbs.math.js"></script>
</head>
<body>

<!-- Set up the DIVs required by QUnit -->
<div id="qunit"></div> <!-- This DIV will be transformed into the QUnit UI -->
<div id="qunit-fixture"></div> <!-- This DIV will serve as the fixture (empty this time) -->

<!-- Now that all the requirements are in place, load QUnit from the jQuery CDN -->
<script type="text/javascript" src="https://code.jquery.com/qunit/qunit-2.3.0.js"></script>

<!-- Finally, load our test suite -->
<script type="text/javascript" src="pbs.math.test.js"></script>
</body>
</html>
```

You should now see a page like the following when you load `index.html` in your browser (or run it within CodeRunner):

![Basic QUnit Test Runner](https://www.bartbusschots.ie/s/wp-content/uploads/2017/04/Screen-Shot-2017-04-08-at-15.33.16-e1491662047256.png)

Next, we need to write some tests. Let’s start with a general test to be sure our namespace exists. Use the following as the initial content of `test/pbs.math.test.js`:

```JavaScript
//
// === QUnit Tests for pbs.math API ==========================================
//

//
// -- General Tests --
//

// make sure our namespaces exist
QUnit.test( "namespaces exist", function( assert ) {
    assert.ok(pbs, "expect pbs namespace to exist" );
    assert.ok(pbs.math, "expect pbs.math namespace to exist" );
});
```

Let’s take a moment to break this down. Firstly, we said earlier that tests consist of one or more assertions – in this case, you can see two assertions inside one test.

The function `QUnit.test()` adds a test into the test suite. The first argument is the title of the test. The second argument is a callback or anonymous function which defines the code for the test. The anonymous function names the first argument `assert`. The QUnit documentation specifies that the callback/anonymous function will be called with a reference to `QUnit.assert`, an object that defines all the standard assertion functions. We could name this first argument anything we liked, but, what ever we chose to name it, we would have to use that name instead of `assert` when calling any of the assertion functions. Hence, I strongly recommend you stick with QUnit convention, and name the first argument to the callback/anonymous function in calls to `QUnit.test` `assert`, or, at least something sensible like `a`.

Finally, within our anonymous function we call two assertions, first, we check that the outer namespace `pbs` exists using the simple `ok()` assertion function, then we check that the nested namespace `pbs.math` exists in the same way.

The `ok()` assertion function expects two arguments, the value to test for truthiness, and a string describing the test.

OK – let’s refresh our test runner (`test/index.html`) and see what we get:

![QUnit showing a failing test](https://www.bartbusschots.ie/s/wp-content/uploads/2017/04/Screen-Shot-2017-04-08-at-15.43.23-e1491663195812.png)

As expected, we see a big red error message (since we haven’t added anything into `pbs.math.js` yet, not even the namespace declaration). But, look a little closer and you might notice something unexpected – the summary says:

> 1 tests completed in 4 milliseconds, with 1 failed, 0 skipped, and 0 todo.  
> 0 assertions of 1 passed, 1 failed.

The first line is fine, we do indeed only have one test. But the second line, that looks odd – it says 0 assertions of 1 passed. But there are two assertions in the test, what gives?

All QUnit assertions throw an error when they fail, so, because there was no `pbs` namespace, the first assertion failed, an exception was thrown, and execution of the anonymous function ended there, with only one assertion seen by QUnit. To get sane error reporting, you need to tell QUnit in advance how many assertions to expect within a given test. You can do this with the `.expect()` pseudo-assertion like so:

```JavaScript
QUnit.test( "namespaces exist", function( assert ) {
    assert.expect(2);
    assert.ok(pbs, "expect pbs namespace to exist" );
    assert.ok(pbs.math, "expect pbs.math namespace to exist" );
});
```

If you save the file and re-refresh the test suite you’ll now see the expected summary:

> 1 tests completed in 4 milliseconds, with 1 failed, 0 skipped, and 0 todo.  
> 0 assertions of 2 passed, 2 failed.

OK – now that our tests are working as we want, we can finally start writing some code for our API. We need to start with the boiler-plate to set up our name spaces. Let’s start by setting up just the `pbs` namespace. Use the following as the initial content of `pbs.math.js`:

```JavaScript
// A simple API containing miscellaneous mathematical functions
// This is sample code from the Programming By Stealth series on www.bartb.ie,
// as such it is not intended for production use.

//
// === Initialise the pbs namespace ===========================================
//
var pbs = pbs ? pbs : {};
```

After saving `pbs.math.js`, refresh your test runner page (you need to refresh or the test runner will not have a current copy of your `.js` files). You should still see 1 test failing, but within that 1 test you should now have 1 assertion passing, and one failing.

Lets’s now add the definition of the `pbs.math` nested namespace to `pbs.math.js`:

```JavaScript
// A simple API containing miscellaneous mathematical functions
// This is sample code from the Programming By Stealth series on www.bartb.ie,
// as such it is not intended for production use.

//
// === Initialise the pbs namespace ===========================================
//
var pbs = pbs ? pbs : {};

//
// === Wrap the API in a self-executing anonymous function ===
//
(function(pbs, undefined){
    //
    // -- initialise the pbs.math namespace
    //
    pbs.math = {};
})(pbs);
```

After saving `pbs.math.js`, refresh your test runner to see the current result of all your tests. All the evil red should have vanished from the interface, and the summary should read something like:

> 1 tests completed in 2 milliseconds, with 0 failed, 0 skipped, and 0 todo.  
> 2 assertions of 2 passed, 0 failed.

Below that you will find a small subtle blue line with a 1 before it followed by the title of our only test, followed by 2 within parentheses. The number in parentheses is the number of assertions in the test. To save on space as your test suite grows, QUnit minimises passing tests. You can expand them out by clicking on the title of the test. When you do that you see the two assertions with a green bar in front of them, indicating they both passed.

We have now done our first cycle through the process – we have written some tests, then written code until those tests pass.

Let’s start the next cycle by defining our test for the first of our two functions by appending the following to `test/pbs.math.test.js`:

```JavaScript
QUnit.test("factorial() argument validation", function(assert){
    assert.expect(9);
    assert.throws(
        function(){
            pbs.math.factorial();
        },
        Error,
        "throws Error when called without arguments"
    );
    assert.throws(
        function(){
            pbs.math.factorial('boogers');
        },
        Error,
        "throws Error when called with a string"
    );
    assert.throws(
        function(){
            pbs.math.factorial(true);
        },
        Error,
        "throws Error when called with a boolean"
    );
    assert.throws(
        function(){
            pbs.math.factorial({a: 'boogers'});
        },
        Error,
        "throws Error when called with a plain object"
    );
    assert.throws(
        function(){
            pbs.math.factorial(new Error('dummy'));
        },
        Error,
        "throws Error when called with a prototyped object"
    );
    assert.throws(
        function(){
            pbs.math.factorial([1, 2, 3]);
        },
        Error,
        "throws Error when called with an array object"
    );
    assert.throws(
        function(){
            pbs.math.factorial(function(){});
        },
        Error,
        "throws Error when called with a function object"
    );
    assert.throws(
        function(){
            pbs.math.factorial(Math.PI);
        },
        Error,
        "throws Error when called with a non-integer number"
    );
    assert.throws(
        function(){
            pbs.math.factorial(-42);
        },
        Error,
        "throws Error when called with a negative integer number"
    );
});
```

This is our first use of the `.throws()` assertion. This assertion expects three arguments, a callback/anonymous function containing the code that is expected to throw an error, the expected error, and a text description. The expected error can be defined in many ways including; a string to compare to the thrown error object’s `.message` property, a regular expression to compare to the thrown error object’s `.message` property, or the error prototype the thrown error object is expected to have. The above code uses the last of these, specifying the `Error` prototype as the second argument.

Notice that we have not yet tested that valid values do not throw errors. That will be covered by our tests to make sure valid inputs give expected outputs.

OK, now that we have some more tests written, we can write some more code.

BTW, if you’re wondering how many tests it’s OK to write before writing the code that gets them to pass – that’s up to you, but TDD fundamentalists will insist it’s one test, then code, then one test etc.. I don’t find that at all practical – instead, I take what I consider a _mouthful-sized_ number of tests approach – when I think the tests I’ve written make a nice easy to chew mouthful, I switch from tests to code. The exact number depends on the complexity of the tests. Basically, I make a judgement call each time.

Let’s add the stub of our function to our API, and include the code for argument validation. Add the following into `pbs.math.js` by appending it to the self-exectuting anonymous function:

```JavaScript
    //
    // -- define the functions --
    //
    
    // -- Function --
    // Purpose    : Calculate the factorial of a given number
    // Returns    : An integer
    // Arguments  : 1) an integer number >= 0
    // Throws     : Throws an Error on invalid arguments
    // Notes      :
    // See Also   : https://en.wikipedia.org/wiki/Factorial
    pbs.math.factorial = function(n){
        // validate and process args
        if(!arguments.length >= 1){
            throw new Error('first agument is required, and must be a positive integer (>= 0)');
        }
        if(!String(n).match(/^\d+$/)){
            throw new Error('invalid first argument - must be a positive integer (>= 0)');
        }
        var intN = parseInt(n); // force to typeof number
    };
```

Well, that completes another cycle, so let’s define some more tests. This time, our tests should check that valid inputs give expected outputs. In this kind of testing, be sure to check the inside edges of the range of valid values (if that’s applicable in the given situation).

Append the following to the file `test/pbs.math.test.js`:

```JavaScript
QUnit.test("inputs to pbs.math.factorial() give expected outputs", function(assert){
    assert.expect(2);
    
    // check the lowest valid number
    assert.strictEqual(pbs.math.factorial(0), 1, 'the factorial of 0 is 1');
    
    // check a larger valid number
    assert.strictEqual(pbs.math.factorial(5), 120, 'the factorial of 5 is 120');
    
    // no maximum, so no need to test the upper bound of the valid range
});
```

This is our first use of the `.strictEqual()` assertion. This assertion expects three arguments, the value to test, the expected answer, and a text description. To pass, the first argument must `===` the second. (BTW, `.equal()` works the same way, but using `==`.)

Now we can update our `pbs.math.factorial()` function so it actually calculates factorials!

Below is the updated version of the `pbs.math.factorial()` function in `pbs.math.js`:

```JavaScript
    // -- Function --
    // Purpose    : Calculate the factorial of a given number
    // Returns    : An integer
    // Arguments  : 1) an integer number >= 0
    // Throws     : Throws an Error on invalid arguments
    // Notes      :
    // See Also   : https://en.wikipedia.org/wiki/Factorial
    pbs.math.factorial = function(n){
        // validate and process args
        if(!arguments.length >= 1){
            throw new Error('first agument is required, and must be a positive integer (>= 0)');
        }
        if(!String(n).match(/^\d+$/)){
            throw new Error('invalid first argument - must be a positive integer (>= 0)');
        }
        var intN = parseInt(n); // force to typeof number
        
        // short-circuit the trivial answers
        if(intN == 0 || intN == 1){
            return 1;
        }
        
        // do the calculation
        var ans = intN;
        var ctr = intN - 1; // initialise a counter to one less than n
        while(ctr > 1){ // no point in multiplying anything by 1, hence > not >=
            ans *= ctr; // multiply the answer by the counter
            ctr--; // decrement the counter
        }
        
        // return the answer
        return ans;
    };
```

Refreshing the test suite shows that this function now works as expected, so we can move on to the next cycle, and develop some initial tests for the next function, `pbs.math.fibonacciSeries()`.

Append the following to `test/pbs.math.test.js`:

```JavaScript
// -- test the factorial function --

QUnit.test("pbs.math.fibonacciSeries() exists", function(assert){
    assert.strictEqual(typeof pbs.math.fibonacciSeries, 'function', "function exists");
});

QUnit.test("fibonacciSeries() argument validation", function(assert){
    assert.expect(7);
    assert.throws(
        function(){
            pbs.math.fibonacciSeries();
        },
        Error,
        "throws Error when called without arguments"
    );
    assert.throws(
        function(){
            pbs.math.fibonacciSeries('boogers');
        },
        Error,
        "throws Error when called with a string"
    );
    assert.throws(
        function(){
            pbs.math.fibonacciSeries(true);
        },
        Error,
        "throws Error when called with a boolean"
    );
    assert.throws(
        function(){
            pbs.math.fibonacciSeries({a: 'boogers'});
        },
        Error,
        "throws Error when called with a plain object"
    );
    assert.throws(
        function(){
            pbs.math.fibonacciSeries(new Error('dummy'));
        },
        Error,
        "throws Error when called with a prototyped object"
    );
    assert.throws(
        function(){
            pbs.math.fibonacciSeries([1, 2, 3]);
        },
        Error,
        "throws Error when called with an array object"
    );
    assert.throws(
        function(){
            pbs.math.fibonacciSeries(function(){});
        },
        Error,
        "throws Error when called with a function object"
    );
});
```

With our tests written, we can now create the stub of our `pbs.math.fibonacciSeries()` function, including the code for argument validation. Append the following to the self-executing anonymous function in `pbs.math.js`:

```JavaScript
    // -- Function --
    // Purpose    : Calculate the fibonacci series up to a given number
    // Returns    : An array of integers
    // Arguments  : 1) a number
    // Throws     : Throws an Error on invalid arguments
    // Notes      :
    // See Also   : https://en.wikipedia.org/wiki/Fibonacci_number
    pbs.math.fibonacciSeries = function(n){
        // validate and process args
        if(!arguments.length >= 1){
            throw new Error('first agument is required, and must be a positive integer (>= 0)');
        }
        if(typeof n !== 'number'){
            throw new Error('invalid first argument - must be a number');
        }
    };
```

All tests should now pass, so we are ready for the next loop of the cycle. Let’s write the tests for checking that valid inputs result in expected outputs.

Append the following to `test/pbs.math.test.js`:

```JavaScript
QUnit.test("inputs to pbs.math.fibonacciSeries() give expected outputs", function(assert){
    assert.expect(5);
    
    // check a number below zero - should return an empty array
    assert.deepEqual(pbs.math.fibonacciSeries(-42), [], '-42 evaluates to an empty array');
    
    // check that 0 returns [0] - we have implmented the modern alogrithm not the classical one
    assert.deepEqual(pbs.math.fibonacciSeries(0), [0], 'the series up to 0 evaluates to [0]');
    
    // check that 1 returns [0, 1] - the start of the classical algorythm
    assert.deepEqual(pbs.math.fibonacciSeries(1), [0, 1], 'the series up to 1 evaluates to [0, 1]');
    
    // check a larger valid number that is in the series
    assert.deepEqual(pbs.math.fibonacciSeries(8), [0, 1, 1, 2, 3, 5, 8], 'the series up to 8 is [0, 1, 1, 2, 3, 5, 8]');
    
    // check a larger valid number that is not in the series
    assert.deepEqual(pbs.math.fibonacciSeries(25.6), [0, 1, 1, 2, 3, 5, 8, 13, 21], 'the series up to 25.6 is [0, 1, 1, 2, 3, 5, 8, 13, 21]');
    
    // no maximum, so no need to test the upper bound of the valid range
});
```

Notice that this test uses an assertion function we’ve not seen before – `.deepEqual()`. This assertion function allows us to use more complex data structures in the expected field. The QUnit docs say the function supports potentially nested data of the following types: primitive types, arrays, objects, regular expressions, dates and functions. In this case, we are using `.deepEqual()` because the `pbs.math.fibonacciSeries()` returns an array of numbers.

The first argument is the values to test, the second is the expected value, and the final argument is a textual description of the test.

Now that we have our tests written, we can finish our implementation of the `pbs.math.fibonacciSeries()` function in `pbs.math.js`:

```JavaScript
    // -- Function --
    // Purpose    : Calculate the fibonacci series up to a given number
    // Returns    : An array of integers
    // Arguments  : 1) a number
    // Throws     : Throws an Error on invalid arguments
    // Notes      :
    // See Also   : https://en.wikipedia.org/wiki/Fibonacci_number
    pbs.math.fibonacciSeries = function(n){
        // validate and process args
        if(!arguments.length >= 1){
            throw new Error('first agument is required, and must be a positive integer (>= 0)');
        }
        if(typeof n !== 'number'){
            throw new Error('invalid first argument - must be a number');
        }
        
        // short-circuit the trivial values of the series so we can be sure there
        // are always two previous values to add together get the next value later
        if(n < 0){
            return [];
        }
        if(n < 1){
            return [0];
        }
        if(n < 2){
            return [0, 1];
        }
        
        // do the calculation
        var ans = [0, 1]; // start with the two seed values of the modern algorythm
        while(ans.slice(-1)[0] <= n){ // while the value of the last item in the ans array is <= n
            var lastTwo = ans.slice(-2);
            ans.push(lastTwo[0] + lastTwo[1]); // append the sum of the last two values to the ans array
        }
        
        // because we check before we calculate, we have gone one calculation too far,
        // so remove the last value from the array
        ans.pop();
        
        // return the answer
        return ans;
    };
```

This implementation passes all our tests.

> ### Asside – the JavaScript `.slice()` Function
> 
> Notice that the function makes use of the `.slice()` function from the `Array` prototype. I know Allison has been using this function in her code for some time, but it’s not one we’ve ever discussed as part of the series.
> 
> What this function does is return a sub-set, or slice, of an array. You can use no arguments at all, in which case you’ll get the whole array back.
> 
> If you choose to pass it, the first argument will be interpreted as your starting point – use a value of 0 to begin at the start of the array. Positive integer values will move the starting array index forward, so `.slice(2)` will exclude the first three items of the array from the result (remember, arrays are zero-indexed). You can also use negative numbers to work from the back of the array forwards when defining your start point. The last element in the array is considered to be at index -1. The returned array is still in the normal forward order. So, `.slice(-3)` returns the last three elements in the array in the same order they were originally present in the array.
> 
> Finally, if you choose to pass it, the second argument sets the index **before** which to stop the returned array at. So, `.slice(1, 3)` returns the second and third elements of the array (those at indexes 1 & 2). You can also use negative indexes in the second argument. To slice everything but the first and last elements, you could use `.slice(1, -1)`. If you don’t specify and second argument, the length of the array is used, i.e. the slice runs to the end of the array.

So far, because we’ve been working on quite simplistic code, there has been no need to do any refactoring at the end of any of our cycles. This time though, there is some room for refactoring, though it’s in the test code, not the API itself.

### Grouping QUnit Tests

Right now, all our tests are together in one big group. It would be great if we could group the tests related to the factorial function into one group, and the tests for the Fibonacci function into another. Well, we can! QUnit calls groups of tests _modules_, and to define them you use the `QUnit.module()` function.

`QUnit.module()` expects three arguments, a name for the module as a string, an object which can be used to define hooks (we’ll have a look at some of those in the next instalment), and a callback/anonymous function within which all the tests for the group should be defined. You can also define modules within the callback of another module to create nested modules, and your nesting can go as deep as you like. Obviously, the smaller the project the less need there is for nesting. A project as small as our sample here doesn’t require nesting of modules within modules.

So, let’s refactor our test suite so it groups the tests for each function together. Since we’ll only be editing `test/pbs.math.test.js`, we’ll know we got it right if the same number of total tests and assertions are executed before and after we make our changes, and, if they all continue to pass.

While editing the code I’m also going to tidy up some other little cosmetic things that I’ve changed my mind on as I worked up the example.

So, this is the final version of our test suite:

```JavaScript
//
// === QUnit Tests for pbs.math API ==========================================
//

//
// -- General Tests --
//

// make sure our namespaces exist
QUnit.test('namespaces exist', function(assert){
    assert.expect(2);
    assert.ok(pbs, 'pbs namespace exists' );
    assert.ok(pbs.math, 'pbs.math namespace exists' );
});

//
// -- Function Tests (grouped) --
//

QUnit.module('pbs.math.factorial()', {}, function(){
    QUnit.test('function exists', function(assert){
        assert.strictEqual(typeof pbs.math.factorial, 'function', 'function exists');
    });
    
    QUnit.test('invalid arguments throw Errors', function(assert){
        assert.expect(9);
        assert.throws(
            function(){
                pbs.math.factorial();
            },
            Error,
            'throws Error when called without arguments'
        );
        assert.throws(
            function(){
                pbs.math.factorial('boogers');
            },
            Error,
            'throws Error when called with a string'
        );
        assert.throws(
            function(){
                pbs.math.factorial(true);
            },
            Error,
            'throws Error when called with a boolean'
        );
        assert.throws(
            function(){
                pbs.math.factorial({a: 'boogers'});
            },
            Error,
            'throws Error when called with a plain object'
        );
        assert.throws(
            function(){
                pbs.math.factorial(new Error('dummy'));
            },
            Error,
            'throws Error when called with a prototyped object'
        );
        assert.throws(
            function(){
                pbs.math.factorial([1, 2, 3]);
            },
            Error,
            'throws Error when called with an array object'
        );
        assert.throws(
            function(){
                pbs.math.factorial(function(){});
            },
            Error,
            'throws Error when called with a function object'
        );
        assert.throws(
            function(){
                pbs.math.factorial(Math.PI);
            },
            Error,
            'throws Error when called with a non-integer number'
        );
        assert.throws(
            function(){
                pbs.math.factorial(-42);
            },
            Error,
            'throws Error when called with a negative integer number'
        );
    });
    
    QUnit.test('inputs give expected outputs', function(assert){
        assert.expect(2);
        
        // check the lowest valid number
        assert.strictEqual(pbs.math.factorial(0), 1, 'the factorial of 0 is 1');
        
        // check a larger valid number
        assert.strictEqual(pbs.math.factorial(5), 120, 'the factorial of 5 is 120');
        
        // no maximum, so no need to test the upper bound of the valid range
    });
});

QUnit.module('pbs.math.fibonacciSeries()', {}, function(){
    QUnit.test('function exists', function(assert){
        assert.strictEqual(typeof pbs.math.fibonacciSeries, 'function', 'function exists');
    });
    
    QUnit.test('invalid arguments throw Errors', function(assert){
        assert.expect(7);
        assert.throws(
            function(){
                pbs.math.fibonacciSeries();
            },
            Error,
            'throws Error when called without arguments'
        );
        assert.throws(
            function(){
                pbs.math.fibonacciSeries('boogers');
            },
            Error,
            'throws Error when called with a string'
        );
        assert.throws(
            function(){
                pbs.math.fibonacciSeries(true);
            },
            Error,
            'throws Error when called with a boolean'
        );
        assert.throws(
            function(){
                pbs.math.fibonacciSeries({a: 'boogers'});
            },
            Error,
            'throws Error when called with a plain object'
        );
        assert.throws(
            function(){
                pbs.math.fibonacciSeries(new Error('dummy'));
            },
            Error,
            'throws Error when called with a prototyped object'
        );
        assert.throws(
            function(){
                pbs.math.fibonacciSeries([1, 2, 3]);
            },
            Error,
            'throws Error when called with an array object'
        );
        assert.throws(
            function(){
                pbs.math.fibonacciSeries(function(){});
            },
            Error,
            'throws Error when called with a function object'
        );
    });
    
    QUnit.test('inputs give expected outputs', function(assert){
        assert.expect(5);
        
        // check a number below zero - should return an empty array
        assert.deepEqual(pbs.math.fibonacciSeries(-42), [], '-42 evaluates to an empty array');
        
        // check that 0 returns [0] - we have implmented the modern alogrithm not the classical one
        assert.deepEqual(pbs.math.fibonacciSeries(0), [0], 'the series up to 0 evaluates to [0]');
        
        // check that 1 returns [0, 1] - the start of the classical algorythm
        assert.deepEqual(pbs.math.fibonacciSeries(1), [0, 1], 'the series up to 1 evaluates to [0, 1]');
        
        // check a larger valid number that is in the series
        assert.deepEqual(pbs.math.fibonacciSeries(8), [0, 1, 1, 2, 3, 5, 8], 'the series up to 8 is [0, 1, 1, 2, 3, 5, 8]');
        
        // check a larger valid number that is not in the series
        assert.deepEqual(pbs.math.fibonacciSeries(25.6), [0, 1, 1, 2, 3, 5, 8, 13, 21], 'the series up to 25.6 is [0, 1, 1, 2, 3, 5, 8, 13, 21]');
        
        // no maximum, so no need to test the upper bound of the valid range
    });
});
```

Notice that because we have no need for any hooks, we use an empty function literal (`{}`) as the second argument to `QUnit.module()`.

At this stage our three files are complete. You can find the final versions of all three in the instalment’s ZIP file in the `pbs33a` folder.

Within our source code we now have our tests sorted into nice clear groupings. But, the benefits of creating those groupings also follows us into the test runner GUI.

Let’s have a more detailed look at the test runner now that we have a pretty full-featured test suite. Between the title of the test suite and the output of the tests is a toolbar, marked in red on the screenshot below:

[![](https://www.bartbusschots.ie/s/wp-content/uploads/2017/04/Screen-Shot-2017-04-14-at-15.24.32-300x103.png)  
Click to Enlarge](https://www.bartbusschots.ie/s/wp-content/uploads/2017/04/Screen-Shot-2017-04-14-at-15.24.32.png)

The first thing I want to draw your attention to is the drop-down at the right of the tool bar labeled _Module_. Using this dropdown we can instruct QUnit to only run the tests for a given sub-set of modules, allowing us to cut down on clutter as we focus on specific parts of our code.

![QUnit Modules Dropdown](https://www.bartbusschots.ie/s/wp-content/uploads/2017/04/Screen-Shot-2017-04-14-at-15.35.33.png)

Next to that dropdown is a text box labeled _Filter_, this allows us to show only tests that match a given search string. You apply the filter by clicking the _Go_ button next to the text box. Again, this is a mechanism to allow us to filter out clutter and help focus our attention. The bigger your code base, and hence your test suite, the more valuable this filter box becomes.

![QUnit Filter Text Box](https://www.bartbusschots.ie/s/wp-content/uploads/2017/04/Screen-Shot-2017-04-14-at-15.39.14.png)

Finally, the tool bar contains a collection of three checkboxes:

_Hide passed tests_

Pretty self explanatory, again, a way of cutting down clutter so you can see all your failing tests more easily.

_Check for Globals_

If you’ve written your tests properly, then all test should be completely atomic, they should have no effect on the global scope at all. If you suspect one of your tests might be leaking stuff into the global scope, check this checkbox to test for that. How this works is that a snapshot is taken of the global scope before and after each test runs, if the global scope has changed, then that fact is flagged by failing the test, and appending a message to it specifying which variables within the global scope have been altered by the test. This checkbox comes with a bit of a health warning, it adds overhead to every test, so it could have a noticeable effect on the execution time of large test suites.

_No try-catch_

Ordinarily, QUnit wraps every test in a try/catch block so it can continue beyond tests that throw errors. If you check this text box, that wrapper is removed, so, the test runner will stop the first time an error is thrown. This can actually be a useful way to work through the failing tests one-by-one.

## An (Optional) Challenge

If you’ve like a challenge, and it really is a challenge, write a test suite and test runner for the date and time prototypes we’ve been building up over recent instalments. If this seems like too much work (and it is a lot of work), perhaps just write tests for either one of `pbs.Date` or `pbs.Time`.

## Final Thoughts

We now have an introduction to some testing concepts, and, some experience with the QUnit testing framework. So far, we’ve only used QUnit to test JavaScript code that does not interact with the DOM, and does not use the fixture, or, any hooks. In the next instalment we’ll take our testing up a notch by looking at how you can use QUnit to test code that interacts with the DOM using things like jQuery, and how you can save yourself a lot of code repetition within your test suite by using event handlers and hooks.