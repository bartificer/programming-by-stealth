# PBS 18 of X – JS Miscellany

We’ve now covered most of the core JavaScript language. We’ve learned that variables can store literal values, or references to objects. We’ve learned there are three types of literal values – numbers, booleans, and strings. We’ve learned about operators. We’ve learned about conditionals. We’ve learned about loops of various sorts, and we’ve learned about objects. We’ve learned that in JavaScript, arrays are implemented as objects with the prototype `Array`, and that functions are also implemented as objects.

Before we can leave the playground and head off into the world of the browser, we just have a few more loose ends to tie up, which we’ll take care of in this instalment.

Now that we know about objects, we need to re-visit the `arguments` object present in every JavaScript function. We need to take a detailed look at the `typeof` operator, and we need to look at some built-in objects and functions JavaScript provides.

We also need to look at how JavaScript handles regular expressions, and finally, we need to introduce the concept of exception handling.

# Matching Podcast Episode 446

Listen Along: Chit Chat Across the Pond Episode 446

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_07_08.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_07_08.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Our Playground

This is the final instalment for which we’ll be using our JavaScript playground. You can download the code for the playground [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/04/pbs-JavaScriptPlayground-v2.1.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs-JavaScriptPlayground-v2.1.zip), or, you can use the online version at [www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground/](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/).

## A Solution to the PBS 17 Challenge

In short, the challenge was to create prototypes for objects representing quotations, and a random quotation generator, and then to use these prototypes to print out three random quotations.

Again, I want to stress that there is no such thing as a definitive correct answer – there are an infinity of correct solutions to this challenge. My solution is shown below.

```JavaScript
//
// === Create Quotation Prototype ===
//

// -- Function --
// Purpose    : Constructor
// Returns    : NOTHING
// Arguments  : 1) A quotation as a string
//              2) A name as a string
//              3) OPTIONAL - a note as a string
function Quotation(q, b, n){
  // store the quotation and name
  this._quote = String(q); // force to a string
  this._by = String(b); // force to a string

  // if provided, store the note
  this._note = undefined;
  if(typeof n !== 'undefined'){
    this._note = String(n);
  }
}

// -- Function --
// Purpose    : Accessor method for the quote
// Returns    : The quote stored within the object
// Arguments  : 1) OPTIONAL - a new quote value to save
Quotation.prototype.quote = function(){
  // Set a new value if one was passed
  if(arguments.length > 0){
    this._quote = String(arguments[0]);
  }

  // always return the current value
  return this._quote;
};

// -- Function --
// Purpose    : Accessor method for the name
// Returns    : The name stored within the object
// Arguments  : 1) OPTIONAL - a new name value to save
Quotation.prototype.by = function(){
  // Set a new value if one was passed
  if(arguments.length > 0){
    this._by = String(arguments[0]);
  }

  // always return the current value
  return this._by;
};

// -- Function --
// Purpose    : Accessor method for the note
// Returns    : The note stored within the object (could be undefined)
// Arguments  : 1) OPTIONAL - a new note to save
// Notes      : To remove a note from the object, pass undefined or the
//              empty string as the first argument
Quotation.prototype.note = function(){
  // Set a new value if one was passed
  if(arguments.length > 0){
    if(typeof arguments[0] === 'undefined' || arguments[0] === ''){
      this._note = undefined; // allows the note to deleted
    }else{
      this._note = String(arguments[0]);
    }
  }

  // always return the current value
  return this._note;
};

// -- Function --
// Purpose    : Render the quotation as a string
// Returns    : A string
// Arguments  : NONE
Quotation.prototype.toString = function(){
  var ans = '"' + this._quote + '" - ' + this._by;
  if(typeof this._note !== 'undefined'){
    ans += ' (' + this._note + ')';
  }
  return ans;
};

//
// === Create RandomQuoter Prototype ===
//

// -- Function --
// Purpose    : Constructor
// Returns    : NOTHING
// Arguments  : OPTIONAL - an arbitrary number of Quotation objects
// Notes      : Any arguments that are not Quotation objects will be
//              ignored.
function RandomQuoter(){
  // initialise the quotation list
  this._quotes = [];

  // let the setter deal with any arguments
  // convert them to a traditional array first
  var argArray = [];
  for(var i = 0; i < arguments.length; i++){
    argArray[i] = arguments[i];
  }
  this.add(argArray);
}

// -- Function --
// Purpose    : Empty the object of any quotations
// Returns    : A refrerence to self to facilitate function chaining
// Arguments  : NONE
RandomQuoter.prototype.empty = function(){
  // blank the array of quotes
  this._quotes = [];

  // return a reference to self to enable function chaining
  return this;
};

// -- Function --
// Purpose    : Add quotations into the object
// Returns    : A refrerence to self to facilitate function chaining
// Arguments  : 1...n) An arbitrary number of Quotation Objects
//                 -OR-
//              1) An array of Quotation objects
RandomQuoter.prototype.add = function(){
  // read the arguments
  var argsToProcess = [];
  if(arguments[0] instanceof Array){
    // the first argument is an array, process that
    argsToProcess = arguments[0];
  }else{
    // convert that arguments object to a true array
    for(var i = 0; i < arguments.length; i++){
      argsToProcess[i] = arguments[i];
    }
  }

  // add all valid quotes received
  var self = this; // grab a reference to this for use in callback
  argsToProcess.forEach(function(q){
    // only store if valie
    if(q instanceof Quotation){
      self._quotes.push(q);
    }
  });

  // return a reference to self to enable function chaining
  return this;
};

// -- Function --
// Purpose    : Return a random quote as a string
// Returns    : A string
// Arguments  : NONE
RandomQuoter.prototype.quote = function(){
  var randIndex = Math.floor(Math.random() * this._quotes.length);
  return this._quotes[randIndex].toString();
};

//
// === Use The Random Quoter ===
//

// first, create a random quotation object
var rq = new RandomQuoter();

// then, add 10 Oscar Wilde Quotes, and print two
var author = 'Oscar Wilde';
rq.add(
  new Quotation('America had often been discovered before Columbus, but it had always been hushed up.', author),
  new Quotation('Consistency is the last refuge of the unimaginative.', author),
  new Quotation("If you want to tell people the truth, make them laugh, otherwise they'll kill you.", author),
  new Quotation('To disagree with three-fourths of the British public is one of the first requisites of sanity.', author),
  new Quotation('When the gods wish to punish us, they answer our prayers.', author, 'An Ideal Husband, 1893'),
  new Quotation('The truth is rarely pure and never simple.', author, 'The Importance of Being Earnest, 1895'),
  new Quotation('The unspeakable, in full pursuit of the uneatable.', author, 'on Fox Hunting'),
  new Quotation('I think that God, in creating man, somewhat overestimated his ability.', author),
  new Quotation('Some cause happiness wherever they go; others whenever they go.', author),
  new Quotation("All women become like their mothers. That is their tragedy. No man does. That's his.", author)
);
pbs.say(rq.quote());
pbs.say(rq.quote());

// then, blank the quotation bank, and add 10 Churchill Quotes, and print one
author = 'Winston S. Churchill';
rq.empty().add( // example of function chaining
  new Quotation('To build may have to be the slow and laborious task of years. To destroy can be the thoughtless act of a single day.', author),
  new Quotation('To improve is to change, so to be perfect is to change often.', author),
  new Quotation('The farther backward you can look, the farther forward you are likely to see.', author),
  new Quotation('Men occasionally stumble over the truth, but most of them pick themselves up and hurry off as if nothing ever happened.', author),
  new Quotation('Success is the ability to go from one failure to another with no loss of enthusiasm.', author),
  new Quotation('History will be kind to me, for I intend to write it.', author),
  new Quotation("You have enemies? Good. It means you've stood up for something, sometime in your life.", author),
  new Quotation("Politics is the ability to foretell what is going to happen tomorrow, next week, next month and next year. And to have the ability afterwards to explain why it didn't happen.", author),
  new Quotation('In finance, everything that is agreeable is unsound and everything that is sound is disagreeable.', author),
  new Quotation('The problems of victory are more agreeable than those of defeat, but they are no less difficult.', author)
);
pbs.say(rq.quote());
```

I want to draw your attention to a few key points in this solution.

Firstly, you can see that in the constructor for the `RandomQuoter` (starting on line 93), I explicitly convert the `arguments` object into a true array before passing it on to the `.add()` function. The same is also done inside the `.add()` function (starting at line 124).

Secondly, within the `.add()` function in the `RandomQuoter`, I need to access a property of a `RandomQuoter` object from within a callback. To enable this, I had to create an alias to `this` (at line 124), which, following convention, I named `self`.

Finally, I wrote the `.empty()` and `.add()` functions in the `RandomQuoter` prototype in such a way that they can be chained together. That is to say, you can can call `.empty()` and `.add()` one after the other by appending the function calls together. You can see this in action on line 185. This is only possible because both of those functions return a reference to `this` (lines 115 & 147). This very commonly used technique is referred to as _function chaining_.

## The `arguments` Keyword Re-visited

In the previous instalment we learned that functions contain a variable called `arguments` that provides direct access to the function’s arguments. We described this object as an array, because it behaves like one, and, we had not yet learned enough about objects to be totally honest about its nature.

`arguments` objects sure look like arrays, allowing you to access the first argument to a function as `arguments[0]`, the second as `arguments[1]`, etc.. Also, `arguments` objects have a `.length` property, just like true arrays do.

However, `arguments` objects do not have the `Array` prototype, so they don’t support functions provided by that prototype, like `.forEach()` & `.sort()`, and, applying `instanceof Array` to an `arguments` object will evaluate to `false`, so it fails our test for whether or not something is an array.

In version 5 of ECMAScript (and older), you have to manually convert this object to a true array if you want to use it as one. You would do so using code something like:

```JavaScript
var argsArray = [];
for(var i = 0; i < arguments.length; i++){
  argsArray[i] = arguments[i];
}
```

In version 6 of ECMAScript, a better solution has been provided, but, it will not work in IE, so, it’s probably too early to start using this feature on the web. However, if you are using JavaScript in other environments, and those environments are at ECMAScript version 6 or newer, you can safely use this technique. As you can see, it is much shorter than the old manual approach:

```JavaScript
var argsArray = Array.from(arguments);
```

## The `typeof` Operator

This operator has a long history, hence, it has some rather odd behaviours, but it’s still very useful.

As we’ve already seen, the syntax for this operator is `typeof value_to_test`, and it will always return a string. The string will be one of the following:

*   `'number'` – the value is a number literal
*   `'boolean'` – the value is a boolean literal
*   `'string'` – the value is a string literal
*   `'undefined'` – the value is undefined
*   `'function'` – the value is a reference to a function object
*   `'object'` – the value is a reference to an object that is not a function object

```JavaScript
pbs.say("typeof undefined is\t'" + typeof undefined + "'");
pbs.say("typeof null is\t\t'" + typeof null + "'");
pbs.say("typeof 4 is\t\t'" + typeof 4 + "'");
pbs.say("typeof '4' is\t\t'" + typeof '4' + "'");
pbs.say("typeof 'boogers' is\t'" + typeof 'boogers' + "'");
pbs.say("typeof true is\t\t'" + typeof true + "'");
pbs.say("typeof false is\t\t'" + typeof false + "'");
pbs.say("typeof parseInt is\t'" + typeof parseInt + "'");
pbs.say("typeof [1, 2, 3] is\t'" + typeof [1, 2, 3] + "'");
pbs.say("typeof {x: 2, y: 1} is\t'" + typeof {x: 2, y: 1} + "'");
```

The most obvious shortcoming is that arrays are simply returned as `'object'`, this is why we have to rely on the `instanceof` operator to determine if something is an array.

## Built-in Objects & Functions

JavaScript comes with a whole bunch of useful pre-defined object prototypes and stand-alone functions built in. We couldn’t possibly go through an exhaustive list, but we will look at some common ones, grouped by topic.

### String Functions

Strings are literal values, but under the hood, JavaScript converts them to objects of prototype `String` as needed.

The `String` prototype provides a property called `.length`, which tells you the number of characters in a string. The `String` prototype also provides two functions for manipulating the case of a string – `.toUpperCase()` and `.toLowerCase()`, both of which return a new string with the changes applied, rather than changing the value in the string they are called on.

```JavaScript
var myString = 'Hello World!';
pbs.say(myString);
pbs.say(myString.length);
pbs.say(myString.toUpperCase());
pbs.say(myString.toLowerCase());
pbs.say(myString); // to prove it has not been altered
pbs.say('boo!'.toUpperCase());
```

As you can see in the last line of the example above, string functions and properties can be accessed directly from string literals.

Another useful string function is `.charAt()`, which allows you to access individual characters within a string, almost as if the string were an array of characters. The following example uses `.charAt()` in conjunction with a loop to reverse a string:

```JavaScript
function reverseString(s){
  s = String(s); // force s to be a String
  var ans = '';
  for(var i = s.length; i >= 0; i--){
    ans += s.charAt(i);
  }
  return ans;
}
pbs.say(reverseString("Hello World!"));
```

This above example illustrates a very important point – before using a string function on a variable, you need to be sure it really is a string, otherwise, you’ll get an error, as demonstrated by this code:

```JavaScript
var x = 4;
pbs.say(x.toUpperCase());
```

You can protect yourself from this kind of error by explicitly converting the variable to a string before applying the function. You can do that like shown in the reverse example, or, you can do it in such a way that it does not affect the value stored in the variable as show below:

```JavaScript
var x = 4;
pbs.say(typeof x);
pbs.say(String(x).toUpperCase());
pbs.say(typeof x);
```

Finally, the `String` prototype provides a function `.split()` which allows a string to be exploded into an array based on a given separator. The separator can be a string, or a regular expression (see below for details on regular expressions in JavaScript).

As an example, we can split a time string into an array of hour, minute, and second values by splitting it on the string `:`, as shown below:

```JavaScript
var t = "15:45:01";
pbs.say("the time " + t + " splits into the following parts:");
var timeParts = t.split(':'); // returns an array
timeParts.forEach(function(tp){
  pbs.say('* ' + tp);
});
```

### Array Functions

As we already know, in JavaScript, arrays are implemented as objects with the `Array` prototype. This prototype brings along the useful `.length` property, as well as the `.forEach()` function, both of which we have already seen. The `Array` prototype brings along more functions than that though, and we’ll look at some of those now. Bear in mind that unlike with strings, some of these functions do alter the array itself, rather than returning an altered clone.

We’ll start with four related functions for adding and removing items from the ends of arrays. You can add one or more values to the end of an array with `.push()`, and to the front of an array with `.unshift()`. You can remove and return the last element of an array with `.pop()`, and the first element with `.shift()`. These four operators allow you to use arrays as stacks or queues.

```JavaScript
var a = ['apple', 'orange', 'pear'];
pbs.say('initial array: ' + a);
a.push('banana');
pbs.say("afer pushing 'banana': " + a);
a.unshift('peach');
pbs.say("afer unshifting 'peach': " + a);
pbs.say("pop gives: '" + a.pop() + "' - array now: " + a);
pbs.say("shift gives: '" + a.shift() + "' - array now: " + a);
```

There are also functions for altering the order of elements in an array – `.reverse()`, and `.sort()`. `.reverse()` does what you expect, and mirrors the entire array. By default, `.sort()` will do a lexical sort, but you have the power to sort by any rule you like thanks to the power of callbacks.

To create your own sort order, define a function that takes two arguments – if the first argument should be sorted before the second, return -1, if the second should be sorted before the first return 1, and if the two should be considered equal, return 0.

As an example, the following code shows how a default lexical sort does a terrible job of sorting numbers, and, how a callback can be used to do a numeric sort:

```JavaScript
var a = [1, 5, 2, 7, 16, 25];
pbs.say('initial array: ' + a);
a.sort();
pbs.say('after default sort: ' + a);
a.sort(function(a, b){
  if(a < b) return -1;
  if(b < a) return 1;
  return 0;
});
pbs.say('after sorting with callback that does arithmetic comparison: ' + a);
```

Finally, I also want to mention a very convenient function for joining all the elements of an array into a single string. By default, `.join()` will return a string representing all the values in the array, separated by a comma. You can specify your own separator by passing a string as an argument.

```JavaScript
var a = ['Allison', 'likes', 'boogers'];
pbs.say(a.join());
pbs.say(a.join(', '));
pbs.say(a.join(' '));
pbs.say(a.join('_'));
pbs.say(a.join('\n'));
```

### Mathematical Functions & Values

As well as the basic arithmetic operators we’ve already seen, JavaScript also includes a standard object called `Math`, which provides a number of constants and mathematical functions. This is not an exhaustive list, but here are some commonly used values and functions.

Firstly, the object has values for common mathematical constants including, `Math.PI` for pi, `Math.LN10` for the natural log of 10, `Math.LN2` for the natural log of 2, and `Math.E` for Euler’s constant.

The `Math` object also provides functions for applying common mathematical operators that are not covered by the builtin operators. For example, the trigonometric functions – `Math.cos()`, `Math.sin()` & `Math.tan()`.

There are also many useful functions for rounding numbers, including `Math.floor()` to round down, `Math.ceil()` to round up, and `Math.round()` to round to the nearest integer. There is also `Math.abs()` to get the absolute value of a number (remove the minus if present).

Also worth mentioning is `Math.sqrt()`, for getting the square roots of numbers.

Something that’s worth focusing on in more detail is JavaScript’s random number generator, which is also provided by the `Maths` object. `Math.random()` will return a random floating point number between zero and one. The number returned can be exactly, zero, but cannot be exactly one. By combining this function with some simple arithmetic and the rounding functions mentioned above, we can generate random numbers in any range we need.

E.g. we can generate a random integer between zero and 99 (inclusive) with the following simple code:

```JavaScript
var randomInt = Math.floor(Math.random() * 100);
pbs.say(randomInt);
```

Or, between 1 an 100 inclusive with the following code:

```JavaScript
var randomInt = Math.floor(Math.random() * 100) + 1;
pbs.say(randomInt);
```

## Regular Expressions

I’m going assume you know what regular expressions are. If not, please see [instalment 17](https://www.bartbusschots.ie/s/2014/04/27/taming-the-terminal-part-16-of-n-regular-expressions/) and [instalment 18](https://www.bartbusschots.ie/s/2014/05/10/taming-the-terminal-part-18-of-n-more-res/) of the [Taming the Terminal series](http://www.bartb.ie/ttt) for an explanation. Like `egrep`, JavaScript uses Perl-style regular expressions.

In JavaScript, regular expressions are represented as objects with the prototype `RegExp`. Like strings, arrays, and objects, you don’t have to use the `new` keyword to create regular expression objects, you can use the following special syntax instead:

```JavaScript
var myRE = /regexp_here/optional_flags_here;
```

For example, you can create a regular expression that matches positive integers like so:

```JavaScript
var posIntRE = /^\d+$/;
```

The `RegExp` prototype provides a number of useful functions that we should take a look at.

First, you can use the `.test()` function to test if a string matches a regular expression:

```JavaScript
var posIntRE = /^\d+$/;
pbs.say(posIntRE.test(42));
pbs.say(posIntRE.test('42'));
pbs.say(posIntRE.test(-42));
pbs.say(posIntRE.test(Math.PI));
pbs.say(posIntRE.test('boogers'));
pbs.say(posIntRE.test('3 boogers'));
```

Secondly, you can use the `.exec()` function to do more detailed matching, including accessing sub-matches, and iterating over multiple matches within the same string.

Let’s start with the simplest example – using `.exec()` to access sub matches. Reminder – you create sub-matches within a regular expression using parentheses. If the test string does not match the regular expression at all, `.exec()` returns `null`, and if the string does match, a results object is returned. If a results object is returned, the entire matched text will be in `results[0]`, the first sub-match will be in `results[1]`, the second in `results[2]`, and so on.

```JavaScript
var s = "That lunch was delicious, but it cost €50.43, which is a bit steep!";
var moneyRE = /([£$€])(\d+([.]\d\d)?)/;
var res = moneyRE.exec(s);
if(res !== null){
  pbs.say('res[0] is: ' + res[0]);
  pbs.say('res[1] is: ' + res[1]);
  pbs.say('res[2] is: ' + res[2]);
  pbs.say('res[3] is: ' + res[3]);
}
```

Notice that it is the order of the opening parentheses that defines the order of the sub-matches – hence the decimal part of the amount being third.

If our regular expression has the `g` flag (for a global match), `.exec()` will remember where it left off, and next time you call it, it will give you the next result, so, you can loop through all the matches like so:

```JavaScript
var s = "That lunch was delicious, but it cost €50.43, which is a bit steep! I guess I'd happily have paid €30 for it. Mind you, nothing is as bad as that £100 lunch in London last year!";
var moneyRE = /([£$€])(\d+([.]\d\d)?)/g;
var res;
while((res = moneyRE.exec(s)) !== null){
  pbs.say('Found money amount: ' + res[0]);
}
```

When you think about it, regular expressions are very closely related to strings. To make code simpler, JavaScript includes a number of regular expression related functions in the `String` prototype. This allows you to reverse the logic, instead of calling a function on an RE that you pass a string, you can call a function on a string that you pass an RE. There are two such functions in the `String` prototype.

You can test if a string matches a given regular expression with the `.match()` function. The function takes an RE as an argument, and returns `null` if the string does not match, and an array of matches and sub-matches if it does.

Because `null` evaluates to `false`, you can do simple testing like so:

```JavaScript
var intRE = /^[-]?\d+$/;
var inputs = pbs.inputs();
if(inputs.length > 0){
  inputs.forEach(function(i){
    // inputs are always stings, so we don't need to explicitly convert to a string
    if(i.match(intRE)){
      pbs.say("'" + i + "' IS an integer");
    }else{
      pbs.say("'" + i + "' is NOT an integer");
    }
  });
}else{
  pbs.say("Enter values in the inputs to test if they are integers");
}
```

If your RE has the `g` flag, you can also use `.match()` to find all matches like so:

```JavaScript
var s = "If I have 5 apples, and I sell 3, how many do I have left? ... correct, 2";
var res = s.match(/[-]?\d+/g);
if(res === null){
  pbs.say("There were no matches");
}else{
  pbs.say("There were " + res.length + " matches:");
  res.forEach(function(m){ pbs.say('* ' + m); });
}
```

Finally, the `String` prototype also contains a function `.replace()`, which searches a string for a given RE, and then replaces the matching text in the string with a given substitution. The first argument passed to `.replace()` is the regular expression, the second, the substitution. The function does not alter the string it’s called on, instead, it returns a new string with the replacements in place.

The specified replacement can take one of two forms – a string, or, a callback.

If you pass a string as the replacement, you can use `$1`, `$2` etc. to reference any sub-matches. If you want your replacement to contain an actual $ symbol, you need to write it as `$$`. You can use `$&` to include the entire matched string.

The following replacement will find all currency values of the form `€1.23`, and replace them with the form `1.23EUR`.

```JavaScript
var s = "I have €1.27 in my pocket today, but I had €2.22 yesterday. I must have spent €0.95 in the last day.";
pbs.say("BEFORE: " + s);
s = s.replace(/[€](\d+[.]\d\d)/g, "$1EUR");
pbs.say("AFTER: " + s);
```

Note that if you leave off the `g` flag, only the first match will get replaced.

Now lets look at the more complex option for the replacement, a callback. The callback will be run once for every match (if the RE does not have a `g` flag only one match will be found). It will be called with the full matching string as the first argument, followed by each sub-match as subsequent arguments. The callback should return the replacement text as a string.

We can use this technique to do mathematical calculations in our replacement, e.g., the following will replace all Fahrenheit temperatures with their celsius equivalents:

```JavaScript
var s = "It's 104F today - that's just too hot. 80F is hot enough for me!";
pbs.say("BEFORE: " + s);
s = s.replace(/([-]?\d+)F/g, function(str, sub1){
  return Math.round((sub1 - 32) * (5 / 9)) + "C";
});
pbs.say("AFTER: " + s);
```

## Error Handling with Exceptions

When writing re-usable code, like functions, it is good practice to test assumptions made about the inputs/arguments before using them in the code. This approach tends to lead to robust code, and for that reason, the examples in this series use that approach. What I want to look at now is different approaches for what to do when you detect an error. So far in the series we have been returning some kind of special value to indicate failure. Depending on the situation, perhaps `NaN`, or zero, or `false`.

This approach works, but, it has a distinct drawback. When your function is used, the only way to get value out of all that error checking is to test the output for the special value that indicates failure.

There is a better way. When something goes wrong, we should not return a special value, instead, we should use JavaScript’s in-built mechanism for raising the alarm that something has gone wrong. Specifically, we should _throw_ an exception. This mechanism is known as _exception handling_. JavaScript’s implementation of exception handling is very heavily influenced by Java, so Java programmers should feel right at home with it.

Exception handling is very much a game of two halves, and, one of those halves is optional.

When something goes wrong, your code should use the JavaScript keyword `throw` to throw an `Error` object. For example, we could re-write our factorial function from previous instalments to be exception-aware like so:

```JavaScript
// -- Function --
// Purpose    : Calcualtes the factorial of an integer number
// Returns    : An integer number
// Arguments  : 1) an integer number
// Throws     : An error on invalid arguments
// Notes      : This function implemnts factorial recursively
function factorial(n){
  // make sure we got a positive integer
  if(!String(n).match(/^\d+$/)){
    throw new Error('factorial must be called with a positive integer number as the first argument');
  }

  // the factorial of 0 or 1 is 1, so return 1 if appropriate
  if(n <= 1){
    return 1;
  }

  // return n times the factorial of n - 1 (i.e. recurse)
  return n * factorial(n - 1);
}

// test the function
pbs.say(factorial(5));
pbs.say(factorial('boogers'));
pbs.say(factorial(3));
```

As you can see, this function correctly calculates the factorial, and, when given valid input, behaves normally.

However, when we give it bogus input (the string _boogers_ in this case), it triggers an error, and, execution of the code stops (the last line never happens).

In this case, we did not make any kind of effort to catch the error that was thrown, so, the error was handed up to the playground, and the playground dealt with it as best it could – by putting up a red message with a warning triangle, and ceasing execution. As far as the playground is concerned, this error is no different to a syntax error, like forgetting to close a bracket. An error is an error is an error.

The second part to exception handling is catching what you throw. Rather than letting the playground catch the errors we throw, we can catch them in our own code, and then deal with them in a sensible way. The syntax for this is a so-called _try-catch block_. The syntax takes the following form:

```JavaScript
try{
  // code that could trigger an error goes here
}catch(err){
  // what to do if there is an error
  // note that err is a name of our choosing, and will contain
  // a reference to the Error object that was caught
}
```

The error message within an `Error` object can be accessed using its `.message` property.

We can now use the `try` and `catch` keywords to safely call our `factorial()` function with the values entered in the playground inputs as show below (the function itself has not been changed):

```JavaScript
// -- Function --
// Purpose    : Calcualtes the factorial of an integer number
// Returns    : An integer number
// Arguments  : 1) an integer number
// Throws     : An error on invalid arguments
// Notes      : This function implemnts factorial recursively
function factorial(n){
  // make sure we got a positive integer
  if(!String(n).match(/^\d+$/)){
    throw new Error('factorial must be called with a positive integer number as the first argument');
  }

  // the factorial of 0 or 1 is 1, so return 1 if appropriate
  if(n <= 1){
    return 1;
  }

  // return n times the factorial of n - 1 (i.e. recurse)
  return n * factorial(n - 1);
}

//
// === Cal Factorial on all the inputs ===
//
var ipts = pbs.inputs();
if(ipts.length > 0){
  // loop through the inputs
  ipts.forEach(function(ipt){
    // try calculate the factorial, and fail gracefully if needed
    try{
      pbs.say("The factorial of " + ipt + " is " + factorial(ipt));
    }catch(err){
      pbs.say("Failed to calcualte the factorial of '" + ipt + "' with error: " + err.message);
    }
  });
}else{
  // all inputs were empty, so put up a human-friendly message
  pbs.say("Enter positive integer numbers in the inputs to calcualte their factorials");
}
```

Try running this code with no inputs, all valid inputs, and then a mix of valid and invalid inputs. You’ll see that the code behaves nicely in all those situations.

You’ll also notice that by catching the errors thrown within `factorial()`, they never make it to the playground, so no red error messages, and an error while calculating the factorial on one input does not stop the remainder of the code from running.

## PBS JavaScript Cheat-Sheet

The [JavaScript cheat-sheet](https://www.bartbusschots.ie/pbsdemos/PBS-JS-CheatSheet.html) has been updated to include the what we learned in this instalment.

## A Challenge

Create a prototype called `IP` that will represent an IP address. Internally, the IP address should be stored as an array of four integers. The constructor should default to the IP `0.0.0.0`, but should optionally accept an IP address as an argument, either as a string, or, as an array of integers.

Add a function to the `IP` prototype named `.parse()` – this function should take a string or an array as an argument, and, if the passed value is a valid IP, set the internally stored IP to the given IP address. The function should throw an error if it receives invalid arguments

Add another function to the `IP` prototype named `.toArray()`. This function requires no arguments, and should return the IP address as a fresh array (not a reference to the internal array, i.e. a clone).

Finally, add a third function to the `IP` prototype named `.toString()`. This function should return the IP as a string in the normal dotted format.

Reminder – an IP address consists of four positive integer numbers between 0 and 255 inclusive, separated by period (full stop) symbols.

Next, create a prototype called `Subnet`. The constructor should require two arguments – the network address for the subnet as an `IP` object, and the class for the subnet as a string – valid classes are A, B, and C. If the constructor receives invalid arguments, it should throw an error.

Add a function named `.toString()` to the `Subnet` prototype which will return a string consisting of the IP address as a string, followed by a forward slash, and then `255.0.0.0` for class A subnets, `255.255.0.0` for class B subnets, and `255.255.255.0` for class C subnets.

Finally, add a function named `.test()` to the `Subnet` prototype for testing if a given IP is within the represented subnet. The function should require one argument, an IP object. If the subnet is a class A, check that the first part of the given IP matches the first part of the internal IP of the subnet. If class B, check the first two parts, and if class C, the first three. The function should return `true` if the IP is within the subnet, and `false` otherwise, including on invalid arguments.

Finally, test your prototypes by creating a subnet from playground inputs 1 and 2, and testing it against an IP address from playground input 3.

## Conclusions

We’ve now built up a very robust understanding of the core JavaScript language. That knowledge is not application-specific, but can be used in any of the many contexts JavaScript is used in today. In this series, we’re going to use this knowledge to learn how to do client-side scripting on web pages. In other words, we’ll be using JavaScript to bring web pages to life.
