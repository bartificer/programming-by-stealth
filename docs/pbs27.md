# PBS 27 of x – JS Prototype Revision | HTML Forms

In this instalment we’ll make a start on a large topic which we have intentionally ignored until now – taking user input on the web. The way this is done is through HTML forms. It will take us a few instalments to learn all about them, so we’ll start with the basics in this instalment.

The code for the examples in this instalment has been collected into a single ZIP file which you can download [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/12/pbs27.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs27.zip).

# Matching Podcast Episode 470

Listen Along: Chit Chat Across the Pond Episode 470

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_01_02.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_01_02.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to PBS 26 Challenge

At the end of the previous instalment, we had created a third iteration of our world clock API. This iteration was object oriented, allowed for clocks to be automatically created when the page loads without the need to write any JavaScript, and it allowed the timezone to be altered at any stage, even after the page was loaded.

The challenge was to use that as a starting point, and add the ability to customise each clock by specifying whether it should show 12 or 24 hour time, whether the separators should blink, and whether or not to show seconds. Each of these options, like the timezone in our starting code, should be configurable in three ways – via the constructor, via an accessor method, and via a data attribute.

Finally, the option was given to use a namespace of your own choosing instead of `pbs`.

I wrote my solution as a finished API that I’ve released as open source on GitHub – [bartificer.worldclock.js](https://github.com/bbusschots/bartificer_worldclock_js).

I decided to take things a little further, and make even more things about the clocks configurable – the length of time any animations should happen over, the opacity the separators should be shown when they are _‘on’_ and _‘off’_, and whether or not to show AM or PM when showing the time in 12 hour format.

In the example API, only `span` elements could be transformed into clocks. My API allows `span`s, `divs`, paragraphs (`p`), and headings (`h1` … `h6`) to be transformed into clocks.

I also added support for showing a clock in the timezone of the visitor’s browser by setting the timezone to the special string `LOCAL`.

Finally, I added some additional functions to allow clock objects to be queried for the current time in their configured timezone in various formats, including [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).

The entire API is available on GitHub, along with detailed documentation. The code is also heavily commented. Rather than work through it all, I just want to draw your attention to three aspects of my solution.

Firstly, I’d like to highlight the approach I took to items that may or may not be visible like the seconds, their separator, and the AM/PM region. I decided to create a span for every element that might possibly be needed, and to hide any spans that were not needed. That way, when the user changes their mind, and decides they do want seconds after all, it’s merely a matter of showing the hidden spans. The render function also always writes the seconds to the seconds span, even when it’s hidden. The alternative was to use jQuery’s `.after()` and `.remove()` functions to add and remove the seconds region as needed, but that seemed a lot more work than simply hiding and showing pre-existing elements as needed.

Secondly, rather than dealing with each possible option individually by adding an argument to the constructor for each, and adding a separate accessor method for each, I choose to collapse all the options into a single argument and a single accessor method (`.option()`). I did this by altering the constructor so it accepts a single plain object as the second argument (the first argument remains a reference to a jQuery object representing the element to be transformed into a clock). Users can then pass as many or as few options as they want in this single optional second argument.

All the options can be accessed via a single `.options()` accessor function that behaves a lot like jQuery’s `.css()` function. The first argument it expects is a string with the name of the option to be accessed. If there is no second argument, the function returns the current value of the option, if there is a second argument, the value of the option is updated to the value of that second argument.

Rather than using a long cascade of `if` statements, (or a long complex `switch` statement) within the `.option()` function to deal with every possible option, I defined a private object named `optionDetails` to store the information about all the supported options.

For each possible option three key-value pairs are always defined – `description` (an English-language description of what makes a value valid), `default` (the value to use for the option when none is provided by the user), and `validator` (a reference to a function to validate values for the option). The definition for the timezone option is a nice example of this:

```javascript
var optionDetails = {
  // ...
  timezone: {
    description: "the timezone for the clock as an IANA string, or, the special value 'LOCAL'",
    default: 'LOCAL',
    validator: isTimezone // a reference to a previously defined function
  },
  // ...
}
```

Two optional additional key-value pairs are also supported – `coerce` (a reference to a function to transform invalid values for the option into valid ones), and `onChange` (a reference to a function which should be executed each time the value of the option changes).

The constructor makes use of the defaults specified in the `optionDetails` data structure, and both the constructor and the accessor method make use of the rest of the information. Both the constructor and the accessor method use the validator and coercion function references (or callbacks if you prefer) to validate all values that come from the user. There is only one coercion used – a function that turns any value into `true` or `false` based on its truthiness. This allows the boolean options to be more forgiving to users, while still ensuing the values stored inside the objects are always actual booleans.

The `onChange` callbacks are called once at the end of the constructor to make sure everything is correct when a new clock is created, and each time the value of an option is altered using the `.option()` accessor method. It’s these callbacks that do things like hide and show the seconds or the AM/PM region as needed.

The big advantage to this approach is that the logic related to each option is collected together into just two regions within the code – the `optionDetails` data structure, and the `renderClock()` function. Adding a new option does not require either the constructor or the accessor method to be altered in any way. This makes the code much easier to maintain, and, to expand and enhance with additional options in the future.

The final thing I want to draw your attention to is the way in which both the `.option()` accessor function and the constructor invoke the `onChange` callbacks defined in the `optionDetails` data structure. The callbacks are invoked in such a way that within them, the special `this` variable will be a reference to the clock object on which the value of the option is being altered. This allows the code within the callbacks to access all the data within the object being updated, including the value of all other options, and, references to all the spans that make up the clock. For example, the `onChange` callback for the `use12HourFormat` option accesses the value of the `showAmpm` option, and sets the visibility of span containing the AM/PM part of the time:

```javascript
var optionDetails = {
  // ...
  use12HourFormat: {
    description: "whether or not to render the time in 12 hour format",
    default: false,
    validator: isBoolean,
    coercion: coerceToBoolean,
    onChange: function(newVal){
      if(newVal && this._options.showAmpm){
        this._$ampm.show(this._options.animationTime);
      }else{
        this._$ampm.hide(this._options.animationTime);
      }
    }
  },
  // ...
}
```

We have come across this kind of behaviour before – within callbacks passed to jQuery’s `.each()` function, the special `this` variable is always a reference to the HTML element currently being iterated over. This very useful behaviour is achieved using the `.call()` function which is part of JavaScript’s `Function` prototype.

When we first learned about functions we learned that in JavaScript, functions are objects. We didn’t dwell on that fact, but it bears a closer look now. JavaScript functions are not just objects, they are objects with the prototype `Function`. That prototype brings with it a number of functions that can be applied to any/every function. One of those functions is `.call()`. As its name suggest, `.call()` calls (or invokes) the function, but it does so in a very useful way – the first argument you pass to `.call()` will be used as the special `this` variable within the function as it executes. The second argument to `.call()` will be passed as the first argument to the function, the third argument to `.call()` as the second argument to the function, and so on.

So – given all that, this is how the `.option()` accessor method actually sets the new value of an option:

```javascript
// update the value and call the change handler if appropriate
this._options[optName] = usableNewValue;
if(typeof optionDetails[optName].onChange === 'function'){
    optionDetails[optName].onChange.call(this, usableNewValue);
}
```

Within the `.option()` function, where the above code snippet exists, `this` is a reference to the clock object who’s option is being altered. By passing `this` as the first argument to `.call()`, the `this` variable within the callback also becomes a reference to the clock who’s option is being updated.

## Introducing Web Forms

User input within web pages is collected into groups known as forms. A single form contains one or more inputs of one kind or another, and a single page can contain arbitrarily many forms. Forms can’t be nested within each other, so each input belongs to exactly one form.

The HTML tag to represent a form is simply `<form></form>`.

### Our First Form (Doing it Wrong)

To get the ball rolling on user input, let’s create a simple web page containing a very naive and simple form. It will contain just one text box, and one button. The text box will allow you to enter your name, and when you click the button, a paragraph will be appended to the end of the page saying hello to you.

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS27 - Example 1a (BAD Form)</title>

  <!-- include jQuery -->
  <script src="http://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- add our local scripts -->
  <script type="text/javascript">
    // add an event handler to the button when the DOM becomes ready
    $(function(){
    	$('#hello_button').click(function(){
    		// create a new paragraph that says hello
    		var $hello = $('<p />');

    		// set the text of the paragraph using the value of the text box
    		$hello.text('Hello there ' + $('#hello_name').val() + '!');

    		// append the paragraph to the end of the page
    		$('#hellos_region').append($hello);
    	});
    });
  </script>
</head>
<body>
<h1>Our First Form (BAD)</h1>
<form>
<p>Name: <input type="text" id="hello_name" /></p>
<p><button type="button" id="hello_button">Say Hello</button></p>
</form>
<div id="hellos_region" />
</body>
</html>
```

You’ll find the above code in the instalment’s ZIP file as `pbs27-1a.html`. Try loading this page in your browser, typing your name, and then clicking on the button. At first glance this page appears to work as expected.

We can see that the HTML tag for representing a text box is <input type=”text” />. Note that `input` is a void tag, so there is no closing `input` tag. We can also see that from a jQuery perspective we can access the value of the text box with the `.val()` function. In typical jQuery fashion, `.val()` is both a getter and a setter. If you call `.val()` on a jQuery object representing a text box without any arguments it will return the contents of the text box as a string. If you call `.val()` on a jQuery object representing a text box with a string as the first argument, it will put the given string into the text box. You can see this in action by opening a web console on the example page above, and executing the following JavaScript:

```javascript
$('#hello_name').val('Boogers');
```

We can also see that the HTML tag for a button is `<button type="button">Some Text</button>`. Unfortunately, the default value for the `button` tag’s `type` attribute is `submit`. We’ll see why we want to override that default with the rather dumb looking `type="button"` in a moment. We can also see that you can add click handlers to buttons in exactly the same way we added them to things like paragraphs many instalments ago – by using jQuery’s `.click()` function.

So, what’s wrong with this naive first form? Well – let’s break it by doing something very simple and natural – type some text into the text box, and, while your cursor is still in the text box, hit `enter`.

Huh? What just happened there?

It may not be immediately obvious, but the page reloaded when you hit enter. Why? That would be because the `form` tag comes with some serious historical baggage.

## The `form` Tag’s `action` Attribute

When the Word Wide Web was born, there was no such thing as client-side scripting, hence, no JavaScript. However, even in these early days, there were web forms. The way all forms worked originally is that one URL contained the `form` tag, all its inputs, and a submit button. The user would fill in the form, and when they were done, they would press the submit button. This would cause the browser to submit the form data to a URL. The web server would receive that data, and respond with a whole new web page. So, clicking submit would always result in a page change or reload.

On the modern web, few forms still behave like this. Instead, we click on buttons, and without the browser browsing to another URL or reloading the current URL, something happens. This is because most modern web pages use JavaScript to process the forms within our browsers (i.e. on the client side) rather than submitting them to a server to be dealt with by some kind of server-side scripting.

BTW – we will be covering server-side scripting much later in this series, but for now, we will be exclusively using JavaScript to process our forms on the client side.

While most forms are now processed by JavaScript, the form tag’s default behaviour has not changed – if you don’t explicitly specify that a form should not submit to a URL, it will. In addition the `form` tag’s out-dated default, many browsers also implement keyboard shortcuts that submit forms. This is what caused the strange behaviour we saw with our naive first form. When your cursor is active within a text box, hitting enter will trigger the browser to submit the form the text box belongs to.

So, if forms were initially designed to submit their data to a URL – how do we specify this URL, and what’s the default? Where a `form` submits is controlled by its `action` attribute. What ever value you place in a `form` tag’s `action` attribute will be interpreted as a URL by the browser. The default value of this attribute is an empty string. When you interpret an empty string as a URL, what you get is the relative URL to the current page. So, by default, submitting a form will refresh the current URL.

Now that we know why hitting enter caused the page to refresh, how do we stop this unwanted behaviour? We simply give the `action` attribute the special value `javascript:void(0);`. For now, always write your `form` tags like so:

```html
<form action="javascript:void(0);">
<!-- inputs go here -->
</form>
```

### A Better First Form

Given what we’ve just learned, let’s update our first form so its `form` tag has an `action` of `javascript:void(0);`:

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS27 - Example 1b (Better Form)</title>

  <!-- include jQuery -->
  <script src="http://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- add our local scripts -->
  <script type="text/javascript">
    // add an event handler to the button when the DOM becomes ready
    $(function(){
    	$('#hello_button').click(function(){
    		// create a new paragraph that says hello
    		var $hello = $('<p />');

    		// set the text of the paragraph using the value of the text box
    		$hello.text('Hello there ' + $('#hello_name').val() + '!');

    		// append the paragraph to the end of the page
    		$('#hellos_region').append($hello);
    	});
    });
  </script>
</head>
<body>
<h1>Our First Form (Better)</h1>
<form action="javascript:void(0);">
<p>Name: <input type="text" id="hello_name" /></p>
<p><button type="button" id="hello_button">Say Hello</button></p>
</form>
<div id="hellos_region" />
</body>
</html>
```

You’ll find this code in the instalment’s ZIP file as `pbs27-1b.html`.

If you load this page in your browser you’ll find you can no longer make the form act strangely by hitting `enter` while the text box is focused.

At this stage you might think we’re done, but there’s still something wrong with this form. On well written web forms, you can focus an input of any kind by clicking on its name. This is especially useful for checkboxes and radio buttons, but it’s always helpful. More importantly, a form that does not explicitly map textual labels to the inputs they describe is simply not accessible. Screen readers depend on developers to properly label form inputs.

## Labeling Form Inputs

We can explicitly label a form input using the `<label>` tag. This tag can be used in one of two ways.

The simplest usage is to wrap both the text describing the input, and the input itself in a single `<label>` tag like so:

```html
<label>Name: <input type="text" id="hello_name" /></label>
```

There are often reasons why you may want to separate out the input and the matching label within your HTML. In these situations, the solution is to give the input an ID, and then use the `<label>` tag’s `for` attribute to map the label to the input by its ID:

```html
<label for="hello_name">Name:</label> <input type="text" id="hello_name" />
```

Let’s put it all together and create a final, good, version of our first form:

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS27 - Example 1c (GOOD Form)</title>

  <!-- include jQuery -->
  <script src="http://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- add our local scripts -->
  <script type="text/javascript">
    // add an event handler to the button when the DOM becomes ready
    $(function(){
    	$('#hello_button').click(function(){
    		// create a new paragraph that says hello
    		var $hello = $('<p />');

    		// set the text of the paragraph using the value of the text box
    		$hello.text('Hello there ' + $('#hello_name').val() + '!');

    		// append the paragraph to the end of the page
    		$('#hellos_region').append($hello);
    	});
    });
  </script>
</head>
<body>
<h1>Our First Form (GOOD)</h1>
<form action="javascript:void(0);">
<p><label for="hello_name">Name:</label> <input type="text" id="hello_name" /></p>
<p><button type="button" id="hello_button">Say Hello</button></p>
</form>
<div id="hellos_region" />
</body>
</html>
```

If you load this page in your browser you’ll find that you can now focus the text box by clicking on its label (the word _Name_).

## A Challenge

Because we have not yet learned enough about web forms to set a meaningful challenge, I’m going to use this opportunity for some revision.

Feedback from readers/listeners suggests that many are still struggling a little with JavaScript prototypes, which we learned about back in [instalment 17](https://bartificer.net/pbs17), and re-visited in the Complex Number challenge in [instalment 19](https://www.bartbusschots.ie/s/2016/07/14/some-javascript-challenges/).

I believe the only way to get comfortable creating your own prototypes is to create your own prototypes – so let’s get some practice in!

I’ve chosen dates and times as the basis for these challenges because everyone understands what they are without my needing to explain them. JavaScript has its own prototypes for dealing with these things, and those prototypes are infinitely superior to those we will be creating here. The point here is not to create better date or time prototypes than JavaScript provides, but to practice creating prototypes.

To avoid clashing with the names of JavaScript’s built in prototypes, we’ll be working inside the `pbs` namespace, and we’ll go back to using the [PBS JavaScript playground](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/).

Before we get stuck in, let’s remind ourselves what prototypes are for, and how we create our own.

A prototype defines a kind of object. All objects with a given prototype will contain certain named pieces of data, and provide certain functions. All prototypes have a constructor, which is used to initialise the data within objects of the prototype, and it’s good practice to implement an accessor method for each piece of data, and to implement a `.toString()` function for generating a string representation of objects with your prototype. So – when ever you want to build a prototype, you need to work through the following steps:

1.  Gather your requirements, specifically, what data do your objects need to store, and, what functions need to be provided.
2.  Initialise your namespace and start a self-executing anonymous function within which you’ll define your prototype.
3.  Write your constructor. In general, your constructor should accept initial values for all your object’s pieces of data, and if none are provided, a sane default should be used. You should validate all data from the user and throw an exception if it’s not usable.
4.  Write your accessor methods – one for each piece of data your objects need to store. When called with no arguments, the accessor methods should get the current value, when called with an argument, they should set the value. Again, when setting, validate the data and throw an exception if the passed value is unusable.
5.  Write the functions you need to provide.
6.  Provide a `.toString()` function.

Let’s put this algorithm into use with a simple example – we’ll write a prototype named `pbs.Name` to represent a person’s name.

**Step 1 (gather requirements)** – for our purposes, name objects will contain two pieces of data – a first name and last name, and provide just two functions (on top of the accessors and `.toString()`); `.fullName()` and `.initials()`, which will both return strings.

**Step 2 (set up your namespace etc.):** Normally, when not in the playground, the first step would look like this:

```javascript
// init the name space
var pbs = pbs ? pbs : {};

// define the prototype inside a self-executing anonymous function
(function(pbs, undefined){
  // INSERT REST OF CODE FOR PROTOTYPE HERE
})(pbs);

// INSERT CODE THAT USES YOUR PROTOTYPE HERE
```

**However, because of how the PBS playground works, your code will not work if you include the first line in the above snippet. So, when working in the playground, and ONLY when working in the playground, comment it out:**

```javascript
// init the name space - skip within PlayGround
//var pbs = pbs ? pbs : {};

// define the prototype inside a self-executing anonymous function
(function(pbs, undefined){
  // INSERT REST OF CODE FOR PROTOTYPE HERE
})(pbs);

// INSERT CODE THAT USES YOUR PROTOTYPE HERE
```

**Step 3 (Create the Constructor):** Remember that your constructor is a function with the same name as your prototype – in our case, `pbs.Name`. Also remember that you can avoid sloppy code duplication by making use of the accessor functions you know you will be writing later from within your constructor.

```javascript
pbs.Name = function(fn, ln){
  // initialise all data with default values
  this._firstName = 'John';
  this._lastName = 'Doe';

  // if any arguments were passed, use the accesor
  // functions to set the values
  if(typeof fn !== 'undefined'){
    this.firstName(fn);
  }
  if(typeof ln !== 'undefined'){
    this.lastName(ln);
  }
};
```

**Step 4 (Create the Accessor Methods)**:

```javascript
pbs.Name.prototype.firstName = function(fn){
  // if we are a getter, return the current value
  if(arguments.length === 0){
    return this._firstName;
  }

  // otherwise, validate the data before setting
  if(!(typeof fn === 'string' && fn.length > 0)){
    throw new Error('A first name must be non-empty string');
  }

  // set the value
  this._firstName = fn;

  // return a reference to self to facilitate function chaining
  return this;
};
pbs.Name.prototype.lastName = function(ln){
  if(arguments.length === 0){
    return this._lastName;
  }
  if(!(typeof ln === 'string' && ln.length > 0)){
    throw new Error('A last name must be non-empty string');
  }
  this._lastName = ln;
  return this;
};
```

**Step 5 (Create the Needed Functions):**

```javascript
pbs.Name.prototype.fullName = function(){
  return this._firstName + ' ' + this._lastName;
};
pbs.Name.prototype.initials = function(){
  return this._firstName.charAt(0).toUpperCase() + '.' + this._lastName.charAt(0).toUpperCase() + '.';
};
```

**Step 6 (Provide a `.toString()` Function):** In this case, we don’t need to do much work here. A sane way to convert a name to a string would be to return the full name as a string. We already have a function that does that (`.fullName()`) – so why not just re-use it?

```javascript
pbs.Name.prototype.toString = pbs.Name.prototype.fullName;
```

We have now created a prototype to represent a name. Below is some sample code that makes use of our prototype to create some actual objects with it:

```javascript
var name1 = new pbs.Name();
pbs.say(name1.toString());
var name2 = new pbs.Name('Robert', 'Zimmerman');
pbs.say(name2.fullName());
pbs.say(name2.initials());
name2.firstName('Bob');
pbs.say(name2.fullName());
name2.lastName('Dylan');
pbs.say(name2.fullName());
```

Putting it all together, we get the following code for running within the playground:

```javascript
// init the name space - skip within PlayGround
//var pbs = pbs ? pbs : {};

// define the prototype inside a self-executing anonymous function
(function(pbs, undefined){
  // The constructor
  pbs.Name = function(fn, ln){
    // initialise all data with default values
    this._firstName = 'John';
    this._lastName = 'Doe';

    // if any arguments were passed, use the accesor
    // functions to set the values
    if(typeof fn !== 'undefined'){
      this.firstName(fn);
    }
    if(typeof ln !== 'undefined'){
      this.lastName(ln);
    }
  };

  // The accessor methods
  pbs.Name.prototype.firstName = function(fn){
    // if we are a getter, return the current value
    if(arguments.length === 0){
      return this._firstName;
    }

    // otherwise, validate the data before setting
    if(!(typeof fn === 'string' && fn.length > 0)){
      throw new Error('A first name must be non-empty string');
    }

    // set the value
    this._firstName = fn;

    // return a reference to self to facilitate function chaining
    return this;
  };
  pbs.Name.prototype.lastName = function(ln){
    if(arguments.length === 0){
      return this._lastName;
    }
    if(!(typeof ln === 'string' && ln.length > 0)){
      throw new Error('A last name must be non-empty string');
    }
    this._lastName = ln;
    return this;
  };

  // implement needed functions
  pbs.Name.prototype.fullName = function(){
    return this._firstName + ' ' + this._lastName;
  };
  pbs.Name.prototype.initials = function(){
    return this._firstName.charAt(0).toUpperCase() + '.' + this._lastName.charAt(0).toUpperCase() + '.';
  };

  // provide a toString() method
  pbs.Name.prototype.toString = pbs.Name.prototype.fullName;
})(pbs);

// use the prototype
var name1 = new pbs.Name();
pbs.say(name1.toString());
var name2 = new pbs.Name('Robert', 'Zimmerman');
pbs.say(name2.fullName());
pbs.say(name2.initials());
name2.firstName('Bob');
pbs.say(name2.fullName());
name2.lastName('Dylan');
pbs.say(name2.fullName());
```

### Challenge 1 – A Simple Time prototype

Create a prototype named `pbs.Time` to represent arbitrary times. Each time object will contain three pieces of data – the number of hours (in 24 hour format), the number of minutes, and the number of seconds. The prototype should implement the following functions; `.time12()` which will return the time as a string in 12 hour format, and `.time24()`, which will return it in 24 hour format.

You can test your prototype with the following code:

```javascript
var lunchTime = new pbs.Time();
lunchTime.hours(13);
pbs.say(lunchTime.toString());
var dinnerTime = new pbs.Time(17, 30);
pbs.say("I have my lunch at " + lunchTime.time24() + " each day");
pbs.say("I have my dinner at " + dinnerTime.time12() + " each evening");
```

### Challenge 2 – A Simple Date prototype

Create a prototype named `pbs.Date` to represent arbitrary dates. Each date object will contain a day, month, and year. The prototype should implement the functions `.american()` and `.european()` to return the date in MM/DD/YYYY format and DD/MM/YYYY format respectively.

You can test your prototype with the following code:

```javascript
var nextAprilFools = new pbs.Date();
nextAprilFools.day(1).month(4).year(2017);
pbs.say("In America the next April Fools Day is " + nextAprilFools.american());
pbs.say("In Europe the next April Fools Day is " + nextAprilFools.european());
```

### Challenge 3 – A Simple Date/Time prototype

Make use of your previous two prototypes to create a third prototype named `pbs.DateTime` to represent arbitrary times on arbitrary dates.

Each Date/Time will have a date, and a time. The prototype should provide the following functions; `.american12Hour()`, `.american24Hour()`, `.european12Hour()`, and `.european24Hour()` which will return the date/time as an appropriately formatted string.

You can test your prototype with the following code:

```javascript
var gonnaPrankBart = new pbs.DateTime(new pbs.Date(1, 4, 2017), new pbs.Time(15));
pbs.say('Gonna prank Bart good on ' + gonnaPrankBart.european24Hour() + ' his time');
```

## Conclusions

In this instalment we made a start on the basics of using web forms with JavaScript. We learned that inputs go inside `form` tags, and that inputs should be labeled with `label` tags. We’ve also seen how to create basic text boxes and buttons, and how to interact with them in basic ways using jQuery. This is just the beginning – we need to learn a lot more about buttons and text boxes, then we need to learn about other inputs like checkboxes, radio buttons, dropdowns, date pickers etc., and we need to learn a lot more about how jQuery can interact with forms. That’s what we’ll be spending the next few instalments on.
