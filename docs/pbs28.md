# PBS 28 of x – JS Prototype Revision | CSS Attribute Selectors & Buttons

In this instalment we’ll continue our parallel streams of JavaScript prototype revision, and web forms.

We’ll start by looking at a sample solution to the challenge set at the end of [the previous instalment](https://bartificer.net/pbs27). We’ll look at what is good about the solution, and where it falls short. We’ll then improve the prototypes through the user of private helper functions.

Before moving on to look at HTML buttons in detail, we’ll learn some new CSS selectors that are particularly useful for styling web forms.

# Matching Podcast Episode 472

Listen Along: Chit Chat Across the Pond Episode 472

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_01_20.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_01_20.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to the PBS 27 Challenges

```javascript
// init name space - commented out in playground
// var pbs = pbs ? pbs : {};

// define all prototypes within an anonymous self executing fuction
(function(pbs, undefined){
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
    if(!(String(h).match(/^\d+$/) && h >= 0 && h <= 23)){
      throw new TypeError('the hours value must be an integer between 0 and 23 inclusive');
    }
    this._hours = h;
    return this;
  };
  pbs.Time.prototype.minutes = function(m){
    if(arguments.length === 0){
      return this._minutes;
    }
    if(!(String(m).match(/^\d+$/) && m >= 0 && m <= 59)){
      throw new TypeError('the minutes value must be an integer between 0 and 59 inclusive');
    }
    this._minutes = m;
    return this;
  };
  pbs.Time.prototype.seconds = function(s){
    if(arguments.length === 0){
      return this._seconds;
    }
    if(!(String(s).match(/^\d+$/) && s >= 0 && s <= 59)){
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
    ans += ':';
    if(this._minutes < 10){
      ans += '0';
    }
    ans += this._minutes + ':';
    if(this._seconds < 10){
      ans += '0';
    }
    ans += this._seconds;
    ans += this._hours < 12 ? 'AM' : 'PM';
    return ans;
  };
  pbs.Time.prototype.time24 = function(){
    var ans = '';
    if(this._hours < 10){
      ans += '0';
    }
    ans += this._hours + ':';
    if(this._minutes < 10){
      ans += '0';
    }
    ans += this._minutes + ':';
    if(this._seconds < 10){
      ans += '0';
    }
    ans += this._seconds;
    return ans;
  };

  // define a toString function
  pbs.Time.prototype.toString = pbs.Time.prototype.time24;

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
    if(!(String(d).match(/^\d+$/) && d >= 1 && d <= 31)){
      throw new TypeError('the day must be an integer between 1 and 31 inclusive');
    }
    this._day = d;
    return this;
  };
  pbs.Date.prototype.month = function(m){
    if(arguments.length === 0){
      return this._month;
    }
    if(!(String(m).match(/^\d+$/) && m >= 1 && m <= 12)){
      throw new TypeError('the month must be an integer between 1 and 12 inclusive');
    }
    this._month = m;
    return this;
  };
  pbs.Date.prototype.year = function(y){
    if(arguments.length === 0){
      return this._year;
    }
    if(!String(y).match(/^-?\d+$/)){
      throw new TypeError('the year must be an integer');
    }
    this._year = y;
    return this;
  };

  // define needed functions
  pbs.Date.prototype.american = function(){
    var ans = '';
    ans += this._month + '/' + this._day + '/';
    if(this._year <= 0){
      ans += (Math.abs(this._year - 1)) + 'BC';
    }else{
      ans += this._year;
    }
    return ans;
  };
  pbs.Date.prototype.european = function(){
    var ans = '';
    if(this._day < 10){
      ans += '0';
    }
    ans += this._day + '-';
    if(this._month < 10){
      ans += '0';
    }
    ans += this._month + '-';
    if(this._year <= 0){
      ans += Math.abs(this._year - 1) + 'BCE';
    }else{
      ans += this._year;
    }
    return ans;
  };

  // provide a toString
  pbs.Date.prototype.toString = function(){
    var ans = '';
    ans += this._year + '-';
    if(this._month < 10){
      ans += '0';
    }
    ans += this._month + '-';
    if(this._day < 10){
      ans += '0';
    }
    ans += this._day;
    return ans;
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
      return this._date;
    }
    if(!(d instanceof pbs.Date)){
      throw new TypeError('require an instance of the pbs.Date prototype');
    }
    this._date = d;
    return this;
  };
  pbs.DateTime.prototype.time = function(t){
    if(arguments.length === 0){
      return this._time;
    }
    if(!(t instanceof pbs.Time)){
      throw new TypeError('require an instance of the pbs.Time prototype');
    }
    this._time = t;
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
})(pbs);

//
// === Test Code ===
//

// part 1 tests
var lunchTime = new pbs.Time();
lunchTime.hours(13);
pbs.say(lunchTime.toString());
var dinnerTime = new pbs.Time(17, 30);
pbs.say("I have my lunch at " + lunchTime.time24() + " each day");
pbs.say("I have my dinner at " + dinnerTime.time12() + " each evening");

// part 2 tests
var nextAprilFools = new pbs.Date();
nextAprilFools.day(1).month(4).year(2017);
pbs.say("In America the next April Fools Day is " + nextAprilFools.american());
pbs.say("In Europe the next April Fools Day is " + nextAprilFools.european());

// part 3 tests
var gonnaPrankBart = new pbs.DateTime(new pbs.Date(1, 4, 2017), new pbs.Time(15));
pbs.say('Gonna prank Bart good on ' + gonnaPrankBart.european24Hour() + ' his time');
```

My sample solution follows the template described at the end of [the previous instalment](https://bartificer.net/pbs27).

I’d like to draw your attention to a few aspects of the solution – firstly, the `pbs.DateTime` prototype is by far the simplest of the three, because it leverages the code in the other two. Because the data attributes (`this._date` & `this._time`) are instances of the `pbs.Date` and `pbs.Time` prototypes, the functions from those prototypes can be leveraged. You really see this in action in the implementations of functions like `american24Hour()`:

```javascript
pbs.DateTime.prototype.american24Hour = function(){
  return this._date.american() + ' ' + this._time.time24();
};
```

When it comes to the years, I have implemented them as a whole number, which I allow to be negative or zero. In our day-to-day way of writing years, there is no year zero. The year before 1CE (or 1AD if you prefer the Christian-centric view of time) was not 0CE, or 0BCE (or indeed 0AD or 0BC), it was 1BCE (or 1BC).

We could store our year as a whole number with a sign, and throw an error if someone tries to use zero, but then maths stops behaving properly. You’d like to be able to subtract two years from each other to determine how far apart they are. If you implicitly skip zero then you start to get the wrong answer from simple subtractions when ever one number is positive and the other is negative.

The solution to this dilemma is to use so-called [Astronomical Year Numbering](https://en.wikipedia.org/wiki/Astronomical_year_numbering), and that’s what my code does. When storing dates, you store them as whole numbers with a sign, and allow zero. All positive numbers represent CE years, and all negative numbers and represent BCE years plus one. So 1 is 1AD, 0 is 1BCE, and -1 is 2BCE and so on.

Internally, my solution stores years as astronomical years so that maths works, but, when generating strings, my code renders years in CE or BCE. This is done by checking whether or not the year is less than of equal to zero, and if it is, subtracting one get the correct BCE year. You can see an example of this in my implementation of the `.european()` function:

```javascript
pbs.Date.prototype.european = function(){
  var ans = '';
  if(this._day < 10){
    ans += '0';
  }
  ans += this._day + '-';
  if(this._month < 10){
    ans += '0';
  }
  ans += this._month + '-';
  if(this._year <= 0){
    ans += Math.abs(this._year - 1) + 'BCE';
  }else
    ans += this._year;
  }
  return ans;
};
```

Now lets look at what’s not so good about my solution.

Firstly, this code has a number of so-called _bad smells_ (an actual software engineering term). My solution contains a lot of duplicated code, and yours probably does too. There is definitely scope for re-organising some of that repeated code into helper functions, or, to use the fancy software engineering term, for _refactoring_ the repeated code into a number of helper functions.

There’s a lot of testing to see whether a given value is an integer within a given range – we need to make sure hours are whole numbers between 1 and 23, minutes and seconds are whole numbers between 0 and 59, and so on. Let’s write a little helper function to take care of all those cases in one go.

```javascript
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
```

We can now refactor our accessor methods to use this function, e.g. the accessors from `pbs.Time` could be re-written like so:

```javascript
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
```

I’ve shown this function in isolation, but that still leaves us with a really important question – where should you place it within your code?

We could place it at the very top of our code, above the namespace and the self-executing anonymous function within which we define our prototypes, or, we could put it as the first thing within the self-executing anonymous function. In both cases, the code would run, so which is the right thing to do?

If we place it outside the self-executing anonymous function, it will be in the global scope. It’s precisely to avoid this kind of littering of the global scope that we introduced the concept of self-executing anonymous functions, so, the correct place to put these kinds of helper functions is inside the self-executing anonymous function.

Also notice that I have placed all three of my prototypes within the same self-executing anonymous function. If you placed each in its own function, then they would not share a scope, so you couldn’t use the same helper functions within all three prototypes. It’s for exactly this reason that I placed the three prototypes within the same self-executing anonymous function.

The next big issue we have is with validation of the days in the `pbs.Date` prototype. The following does not currently throw an exception, and it really should:

```javascript
var impossibleDate = new pbs.Date(31, 2, 2017);
```

How can we resolve this? Clearly, there is going to have to be some kind of linkage between the month and day parts of the date. When changing the month or the day, we need to check that the pair together are valid, and if not, we need to act.

The first thing we’ll want to create is a private lookup table storing the number of days in each month. Like with the helper functions, we don’t want this littering the global scope, so it too should be defined within the self-executing anonymous function:

```javascript
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
```

This will allow us to deal with 11 of the 12 months in the year quite easily, but what about February? We need to know the year to know how many days there are in February! So, we actually need to validate the combination of day, month and year each time we update any one of them.

This calls for another helper function!

[According to WikiPedia](https://en.wikipedia.org/wiki/Leap_year), the Gregorian Calendar we use today came into use in 1582. We could write our code so it uses the Julian calendar for years before 1582, but that would get very complex very quickly, instead, we’ll use the [Proleptic Gregorian calendar](https://en.wikipedia.org/wiki/Proleptic_Gregorian_calendar), that is, our modern calendar projected backwards as if it had always been in use.

That gives us the following rules for calculating leap years:

1.  A year divisible by 4 is a leap year (has 29 days in February)
2.  Years divisible by 100 are exceptions to rule 1, and not leap years
3.  But years divisible by 400 are exceptions to rule 2, and actually are leap years

Below is a sample implementation:

```javascript
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

Notice that I have not added any data validation on the arguments to this private helper function. This is because it is impossible for an end-user of our prototypes to access this function directly – it exists only within the self-executing anonymous function.

We can now go back and alter our accessor functions so they prevent invalid dates from being added. While in there, we can also fix another subtle bug – we should ensure that the data is all saved as numbers, not as string representations of valid numbers.

```javascript
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
```

This now brings along a new problem – at the moment our prototype only allows days, months, and years to be set one, by, one, so there are edge cases where converting from one valid date to another valid date in one order will fail, but doing the same conversion in another order will succeed.

E.g. The following code looks perfectly valid, but will throw an exception:

```javascript
var myDate = new pbs.Date();
myDate.day(29).month(2).year(2016);
```

However, the following will succeed:

```javascript
var myDate = new pbs.Date();
myDate.year(2016).month(2).day(29);
```

Why?

The reason is subtle, but important, and shows a shortcoming in our current prototype design.

When you call the constructor with no arguments, the date is set to 1 Jan 1970. When you call `.day(29)` on that object, you are setting the date to 29 Jan 1970, which is fine, but when you call `.month(2)`, you are setting the date to 29 Feb 1970, which is invalid because 1970 is not a leap year!

Why does the same thing in a different order succeed? By changing the year, then month, then day the object goes from 1 Jan 1970, to 1 Jan 2016, to 1 Feb 2016, to 29 Feb 2016, so it never passed through an invalid state.

How can we update our prototype to address this limitation?

We clearly need some kind of accessor function that accepts three arguments, validates the three together, then updates the three internal values (`this._day`, `this._month`, and `this._year`).

The solution is to write a new accessor method that accepts three arguments, allowing all three values to be updated and validated in one go. We could write a whole new function, but we already have two functions for reading the entire date, `.american()` and `.european()`, so why not update those to optionally accept three arguments in the appropriate order?

Notice that in the above samples we use code like `myDate.year(2016).month(2).day(29)`, this is an example of so-called function chaining, and it is only possible because our accessors return `this` when used to set a value.

Remember that we evaluate from left to right, so the first thing to happen is that `myDate` is looked up. It is a reference to an object with the prototype `pbs.Date`. Next, the dot operator applies the function `year()` from the `pbs.Date` prototype to what ever is to its left, i.e. the `myDate` object. The `year()` function returns `this`, so, `myDate.year()` returns the `myDate` object. At this stage in the evaluation, the line has effectively become `myDate.month(2).day(29)`. The dot operator happens again, and the month() function from the pbs.Date prototype gets applied to the myDate object. Again, because `myDate` is the object on which the function is being invoked, within the function, `this` is a reference to the `myDate` object. So, when `month()` again returns `this`, the value being returned is a reference to the `myDate` object yet again. The line has now become equivalent to `myDate.day(29)`. The dot operator fires one last time, and applies the `day()` function from the `pbs.Date` prototype to the myDate object.

So, because we return this within all our accessors when setting a value, and only because we do that, the single line `myDate.year(2016).month(2).day(29)` is entirely equivalent to:

```javascript
myDate.year(2016);
myDate.month(2);
myDate.day(29);
```

## A Challenge

Using either your own solution to the previous challenge, or my sample solution above as your starting point, and make the following changes.

First, add private helper functions to do the following, and re-factor your code to make use of them:

*   A function to validate integers – it should accept optional upper and lower bounds on the values (you can use the sample function above)
*   A function that takes a number and converts it into a string of a given length – if the length is greater than the number of digits, zeros should be added to the front of the string until it is long enough. Update the various functions for rendering dates and times as strings to make use of this function

You’ll know you have succeeded if the test code from the three sections of the previous challenge continues to work:

```javascript
// instalment 27 part 1 tests
var lunchTime = new pbs.Time();
lunchTime.hours(13);
pbs.say(lunchTime.toString());
var dinnerTime = new pbs.Time(17, 30);
pbs.say("I have my lunch at " + lunchTime.time24() + " each day");
pbs.say("I have my dinner at " + dinnerTime.time12() + " each evening");

// instalment 27 part 2 tests
var nextAprilFools = new pbs.Date();
nextAprilFools.day(1).month(4).year(2017);
pbs.say("In America the next April Fools Day is " + nextAprilFools.american());
pbs.say("In Europe the next April Fools Day is " + nextAprilFools.european());

// instalment 27 part 3 tests
var gonnaPrankBart = new pbs.DateTime(new pbs.Date(1, 4, 2017), new pbs.Time(15));
pbs.say('Gonna prank Bart good on ' + gonnaPrankBart.european24Hour() + ' his time');
```

Next, update the `pbs.Date` prototype so both the `.american()` and `.european()` functions continue to work as they do now when called with no arguments, but update the internally stored date (with validation) when called with three arguments. You should update `.american()` so it accepts the arguments in the American order (M, D, Y), and `.european()` so it accepts them in the European order (D, M, Y). When called with three arguments, both functions should return a reference to `this` so as to enable function chaining. Try writing your code in such a way that you avoid code duplication. An productive approach would be to implement one of these functions, and then call that one from the other when called with arguments.

You’ll know your updated prototype is working when the following test code succeeds:

```javascript
var testDate = new pbs.Date(1, 1, 1970);
testDate.european(29, 2, 2016);
pbs.say('successfully converted 1 Jan 1970 to ' + testDate.toString());
```

Finally, add two more functions to your `pbs.Date` prototype with the following details:

*   A function named .international() that behaves like the updated versions of `.american()` and `.european()`, but orders the date as Y, M, D.
*   A function named `.english()` that returns the date as a human-friendly string like _2nd of March 2016_. Unlike `.american()` etc., this function does not need to allow the currently stored date be updated. You may find it helpful to add some private lookup tables to aid you in your work.

You can test your functions with the following code:

```javascript
var nextXMas = new pbs.Date();
nextXMas.international(2017, 12, 25);
pbs.say("I'm looking forward to getting presents on the " + nextXMas.english());
```

## The CSS Attribute Selectors

It’s been a long time since we’ve learned a new CSS selector, but now that we’re moving on to HTML forms, there’s a whole class of CSS selector that it would be good to know about – the attribute selectors.

### Attribute Presence (`[attribute_name]`)

The simplest attribute selector is `[attribute_name]` – it will match all elements with a value for the attribute `attribute_name`. So, to add a green border around all images that have a title you could use CSS something like:

```css
img[title]{
  border: 1px solid green;
}
```

### Attribute Value Equals (`[attribute_name="some_value"]`)

You can style elements based on a given attribute having an exact value with this selector. For example, to turn all links with a `target` of `_blank` purple we could use something like:

```css
a[target="_blank"]{
  color: purple;
}
```

### Attribute Value Begins With (`[attribute_name^="some_value"]`)

You can style elements based on the value for a given selector beginning with a given value. For example, you could turn any link with an href that begins with `https://` green with something like:

```css
a[href^="https://"]{
  color: green;
}
```

### Attribute Value Ends With (`[attribute_name$="some_value"]`)

You can style elements based on the value for a given selector ending with a given value. For example, you could add a red border to any image with an `src` attribute that ends in `.gif` red with something like:

```css
img[src$=".gif"]{
  border: 1px solid red;
}
```

### Attribute Value Contains (`[attribute_name*="some_value"]`)

You can style elements based on the value of a given attribute containing a given value as a sub-string using this selector. For example, you could add a green border to any image who’s `alt` attribute contains the word `boogers` with something like:

```css
img[alt*="boogers"]{
  border: 1px green;
}
```

### Attribute Value Contains Word (`[attribute_name~="some_word"]`)

Some HTML attributes can contain a space-delimited list of values. For example, the `rel` attribute on links. We know it can contain `noopener` to specify that a window opened by clicking the link should not get a JavaScript `opener` object. But we can also set the `rel` attribute to `nofollow` to tell search engines not to follow the link when crawling the site. To specify that a link should have rel values of both noopener and nofollow, you would place both values into the same attribute separate by a space, like so:

```html
<a href="http://www.bartb.ie/" rel="noopener nofollow">Bart's Home Page</a>
```

If we want to make all links with a `rel` of `nofollow` grey, regardless of whether they also specified other values, and regardless of the order those values were specified in, we would use the `[attribute_name~="some_word"]` selector like so:

```css
a[rel~="nofollow"]{
  color: grey;
}
```

The above selector would turn all the following links grey:

```html
<a href="http://www.bartb.ie/" rel="nofollow">Bart's Home Page</a>
<a href="http://www.bartb.ie/" rel="noopener nofollow">Bart's Home Page</a>
<a href="http://www.bartb.ie/" rel="nofollow noopener">Bart's Home Page</a>
```

Like with all other selectors, the attribute selectors can be combined with the selectors we already know, so you could style all links with the class `pbs` that have a `href` attribute that starts with `https://` with be the selector `a.pbs[href^="https://"]`.

## The HTML 5 `button` Tag

A button is a clickable inline element. In general, most buttons just contain text, but they can contain other HTML elements.

You should always specify a `type` attribute on your buttons. You can choose from the following values:

`type="submit"` (the default)

Clicking on the button will submit the form it belongs to.

`type="reset"`

Clicking on the button will reset all form inputs within the form the button belongs to to their initial values.

`type="button"`

A plain button that will do nothing unless a JavaScript event handler is added to it.

As mentioned in the previous instalment, if no type is supplied, or an invalid value is specified, `type="submit"` is assumed.

Buttons can also contain a `value` attribute. This attribute has no visible effect on the button, but it can be accessed via JavaScript and jQuery, and it will be passed to server when a form is submitted.

Buttons can be styled with CSS, and the CSS attribute selectors can be used to style different types of button differently. It’s common to use different colours for the different types of button, and, to use a bold font on submit buttons.

In [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2017/01/pbs28.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs28.zip) you’ll find just one HTML page, and a few images. Below is the code for the page, which contains nine buttons in three sets of three. First, un-styled examples of each of the three kinds of button, then styled examples of each kind of button, and finally, one of each kind of button where images are used to make the buttons easier to understand.

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8" />
  <title>PBS 28 - Buttons</title>
  <style type="text/css">
    /* dim the text on reset buttons */
    button.pbs[type="reset"]{
    	color: dimgrey;
    }

    /* make the text on ordinary buttons blue */
    button.pbs[type="button"]{
    	color: DarkBlue;
    }

    /* bold the text on submit buttons and make it dark green */
    button.pbs[type="submit"]{
    	font-weight: bold;
    	color: DarkGreen;
    }

    /* style images within buttons */
   button.pbs img{
   	height: 0.9em;
   	vertical-align: baseline;
   }
  </style>
</head>
<body>
<h1>PBS 28 - Example Buttons</h1>

<h2>Basic Buttons</h2>
<p>Below are un-styled buttons of all three types:</p>
<form action="javascript:void(0);">
<p style="text-align: center">
<button type="reset">A Reset Button</button>
<button type="button">A Button</button>
<button type="submit">A Submit Button</button>
</p>
</form>

<h2>Styled Buttons</h2>
<p>The buttons below have been styled, with different styles for each type of button using the attribute selectors:</p>
<form action="javascript:void(0);">
<p style="text-align: center">
<button type="reset" class="pbs">A Reset Button</button>
<button type="button" class="pbs">A Button</button>
<button type="submit" class="pbs">A Submit Button</button>
</p>
</form>

<h2>Buttons With Images</h2>
<p>The buttons below include images to make it clearer what they do:</p>
<form action="javascript:void(0);">
<p style="text-align: center">
<button type="reset" class="pbs">
  <img src="contrib/famfamfam_silk_icons_v013/icons/arrow_rotate_clockwise.png" alt="Reset" />
  Reset
</button>
<button type="button" class="pbs">
  <img src="contrib/famfamfam_silk_icons_v013/icons/cancel.png" alt="Cancel" />
  Cancel
</button>
<button type="submit" class="pbs">
  <img src="contrib/famfamfam_silk_icons_v013/icons/disk.png" alt="Save" />
  Save
</button>
</p>
</form>

</body>
</html>
```

## Final Thoughts

We have still only touched the tip of the web form iceberg. We’ll start the next instalment by showing some draw-backs to using image files for icons within buttons and other form elements. There is a better way to include useful pictograms, and we’ll learn all about it. We’ll also learn how to tell a screen reader that a piece of a web page is just decoration, and that it should be hidden from screen readers so as to give visually impaired users a better experience.

We’ll also continue on our revision of JavaScrip prototypes in parallel with all that.
