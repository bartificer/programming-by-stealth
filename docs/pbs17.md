# PBS 17 of X – JS Objects

At this stage in the series we have made very good progress towards understanding the core JavaScript language. However, there is still one very important piece missing – objects. We have mentioned them in passing in almost every instalment, and each time, we put them off until later. We finally remedy that in this instalment.

# Matching Postcast Episode http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_06_24.mp3

Listen along to this instalment on [episode http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_06_24.mp3 of the Chit Chat Across the Pond Podcast](http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_06_24.mp3)

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_06_24.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_06_24.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Our Playground

This is the penultimate instalment for which we’ll be using our JavaScript playground. You can download the code for the playground [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/04/pbs-JavaScriptPlayground-v2.1.zip) or [here on GitHub](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentZips/pbs-JavaScriptPlayground-v2.1.zip), or, you can use the online version at [www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground/](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/).

## Solution to Instalment 16 Challenge

At the end of the previous instalment, I set an optional challenge, and promised to provide a possible solution in the next instalment. The challenge was to write a function for transforming the inputs in the PBS playground by applying a callback to every value, and to test that function by calling it with callbacks for squaring and cubing the inputs.

Remember, there are infinitely many correct solutions to any programming problem, so this is just one possible solution:

```JavaScript
// -- Function --
// Purpose    : Apply a function to all PBS playground inputs
// Returns    : VOID
// Arguments  : 1) a reference to a function object (callback)
function inputTransformer(fn){
  // make sure we were called with valid args, if not, print a message and return
  if(typeof fn !== 'function'){
    pbs.say('inputTransformer() called with invalid args - requires a function reference as the first argument');
    return;
  }
  
  // get a reference to the inputs
  var theInputs = pbs.inputs();
  
  // if there were no inputs, print a message and return
  if(theInputs.length < 1){
    pbs.say('add a value to at least one input to transform it');
    return;
  }
  
  // loop through the inputs
  theInputs.forEach(function(ipt){
    pbs.say(ipt + ' becomes ' + fn(ipt));
  });
}

//
// === Use function to square and cube inputs ===
//

// call with an anonymous function that squares the input
inputTransformer(function(n){return n * n});

// call with an anonymous function that cubes the input
inputTransformer(function(n){return n * n * n });
```

## Plain Objects

The simplest objects are so-called plain objects – they are data structures for holding data. If you know JSON, they will look very familiar to you indeed, because JSON stands for JavaScript Object Notation! The JSON standard has drifted a little away from pure JavaScript, so JavaScript objects are not identical to JSON anymore, but they are still extremely similar.

An object is a collection of name-value pairs. You declare an empty object like so:

```JavaScript
var myObject = {};
```

You can then add keys using either of the following notations:

```JavaScript
myObject.someProperty = 4;
myObject['someOtherProperty'] = 5;
```

If the name of your property meets the rules for the names of variables, then both notations will work. If your have a property name that does not meet the rules for variable names, say, it stats with a digit, or has a space in it, then you must use the second notation (the one with the square brackets).

You don’t have to add the properties one-by-one after you create the object, you can add properties as you create an object using the following notation:

```JavaScript
var myObject = {
  property_name_1: "value 1",
  property_name_2: 42
};
```

If a property’s name doesn’t obey the rules for variable names, you must write the property name as a string:

```JavaScript
var myObject = {
  "a property name with spaces": "a value",
  anotherPropterty: true,
  "another property name with spaces": 42
};
```

Like a variable, the values stored in objects can be literal values or references to other objects, so you can store objects in objects, arrays in objects, objects in arrays, and so on – allowing you to build up very complex data structures indeed.

The following incomplete (because I’m too lazy to type it all) data structure gives you an idea of what is possible:

```JavaScript
// build a data structure with US state data
var statesData = {
  ca: {
    name: 'California',
    demonyms: ['Californian'],
    iso3166: 'US-CA',
    type: 'state'
  },
  ct: {
    name: 'Connecticut',
    demonyms: ['Connecticuter', 'Connecticutian', 'Nutmegger'],
    iso3166: 'US-CT',
    type: 'state'
  },
  ma: {
    name: 'Massachusetts',
    demonyms: ['Bay Stater', 'Massachusite', 'Massachusettsian'],
    iso3166: 'US-MA',
    type: 'commonwealth'
  }
};

// access some of the data
pbs.say('Someone from ' + statesData.ma.name + ' is a ' + statesData.ma.demonyms[0]);
pbs.say(statesData.ca.name + ' is a ' + statesData.ca.type + ", its ISO3166 abbreviation is " + statesData.ca.iso3166);
pbs.say(statesData.ma.name + ' is a ' + statesData.ma.type + ", its ISO3166 abbreviation is " + statesData.ma.iso3166);
pbs.say("It's OK to call someone from " + statesData.ct.name + " any of the following:");
statesData.ct.demonyms.forEach(function(d){
  pbs.say('*' + d);
});
```

## Looping Through an Object

The `Object.keys()` function returns an array of keys (property names) for a given object. `Object.keys()` was introduced in ECMAScript 5.1, so it is now supported in all major browsers.

```JavaScript
// create an object representing three letter acronyms
var tlaLib = {
  rpm: 'Revolutions per Minute',
  mph: 'Miles per Hour',
  rms: 'Root Mean Square'
};

// list the known acronyms
pbs.say('The following acronyms are defined: ' + Object.keys(tlaLib));

// loop through the object to print all known acronyms
Object.keys(tlaLib).forEach(function(tla){
  pbs.say(tla + ": " + tlaLib[tla]);
});
```

## Plain Objects & JSON

What makes an object plain is that it contains only data. Plain objects can be converted into JSON strings, and, JSON strings can be converted into JavaScript plain objects.

JavaScript has built-in support for JSON – to go from a plain object to JSON use `JSON.stringify()`, and to go from a JSON string to a plain object use `JSON.parse()`.

```JavaScript
// create an object representing three letter acronyms
var tlaLib = {
  rpm: 'Revolutions per Minute',
  mph: 'Miles per Hour',
  rms: 'Root Mean Square'
};

// convert the TLA object to JSON
var tlaJSON = JSON.stringify(tlaLib);
pbs.say(tlaJSON);

// create a new copy of the TLS object from JSON
var tlaLibCopy = JSON.parse(tlaJSON);
```

## ‘Un-Plain’ Objects

Plain objects are a sub-set of all objects. What makes them plain is that they only contain data, that is to say, literals, arrays, and other plain objects. Once you add something to an object that is not a literal, array, or plain object, it ceases to be a plain object.

The most obvious thing you can add to objects other than literals, arrays, or plain objects are functions. As soon as you add a function to an object, is ceases to be plain.

Thanks to JSON, plain objects have become a big thing in JavaScript, but they are actually the exception rather than the norm.

Philosophically, object oriented programming is about bundling data and the code that manipulates that data, into a single entity. For example, in JavaScript the `.forEach()` function comes bundled with an array, giving you the data, and a function for manipulating that data, all contained in a single object.

When you add a function to an object, that function can access the object it belongs to with the keyword `this`. When you see `this`, mentally think of it as `"the object this function belongs to"`. `this` allows a function attached to an object to access the data within the object, and, to invoke other functions are are also attached to the object.

We’ll start with a really simple example – an object to represent a counter.

```JavaScript
// create a counter object
var myCounter = {
  _count: 0, // data - the current count, initialised at 0
  reset: function(){ // function to zero the counter
    this._count = 0;
  },
  increment: function(){ // function to increment the counter
    this._count++;
  },
  getCount: function(){ // function to return the current count
    return this._count;
  }
};

// show the current value of the counter
pbs.say(myCounter.getCount());
// increment the counter 10 times
for(var i = 0; i < 10; i++){
  myCounter.increment();
}
//show the count again
pbs.say(myCounter.getCount());
// reset the counter
myCounter.reset();
//show the counter again
pbs.say(myCounter.getCount());
```

As you can see, the data, and the functions for manipulating that data, are contained within a single structure. You can also see how the keyword `this` is used to access the object’s data from within the object’s functions.

This is an un-prototyped object – we have built it entirely from scratch, making it a bespoke, one-off object. If we wanted a second counter, we would have to completely re-create it, duplicating all our code. Duplicating code is always a bad thing. Firstly, it’s wasted time and effort, and secondly, if you find a bug you have to remember to fix it in lots of different places.

What we need is sets of instructions for assembling multiple copies of the same kinds of objects. What we need are prototypes of some kind!

## Prototyped Objects

Different programming languages implement objects in different ways. JavaScript does it in its own unique and special way – it is a prototype-based object oriented languages. If you are used to thinking of objects in terms of _classes_, like you would in Java or C++, JavaScript’s paradigm will take some getting used to. Beginners are very much at an advantage here – a lack of misleading pre-conceptions is definitely helpful when it comes to JavaScript objects.

If you want to create lots of similar objects, you start by defining a so-called _constructor function_, which will create the data elements for your objects. JavaScript will automatically associate a prototype with that constructor function, and you then add your functions to that prototype.

So, in JavaScript, defining a custom object prototype is a two-step process:

1.  Define a constructor function – the name of that function will be the name of your prototype. This function should initialise any data attributes objects created from this prototype will contain (using the `this` keyword.
2.  Add functions to the prototype that belongs to your constructor function.

By convention, JavaScript constructor functions, and hence, prototypes, are named in camel case with a leading capital, hence the built-in prototypes `Array`, `String`, `Boolean`, and `Object`.

The constructor function and its accompanying prototype act as a blueprint that can be used to build as many objects as you like. Each object built with a given constructor is said to be an _instance_ of that constructor’s _prototype_.

You build an object from a prototype using the keyword `new`, using the following syntax

```JavaScript
// instance_name is the name of your new object
// Prototype_name is the name of the prototype the object should be constructed from
// optional_arguments can be empty, or, one or more values passed to the constructor function
var instance_name = new Prototype_name(optional_arguments);
```

As a simple example, let’s convert our bespoke counter above into a prototype we can use over and over again, which we’ll name `Counter`.

```JavaScript
//
// === Define the Counter Prototype ===
//

// define the countructor
function Counter(){ // constructor has name of prototype being created
  // default the counter to zero
  this._count = 0;
  
  // if a value was passed, use it as the initial value of the counter
  if(arguments.length){
    this.count(arguments[0]); // validation done inside the function
  }
}

// add a reset function to the prototype
Counter.prototype.reset = function(){
  this._count = 0;
};

// add an increment function to the prototype
Counter.prototype.increment = function(){
  this._count++;
};

// add an accessor function to the prototype
Counter.prototype.count = function(){
  // if there were arguments, set the count to the given value
  // (assuming it is a number)
  if(arguments.length){
    var newCount = parseInt(arguments[0]);
      if(!isNaN(newCount)){
        this._count = newCount;
      }
  }
  
  // always return the count
  return this._count;
};

//
// === Use our Counter Prototype ===
//

// create 2 counters
var counter1 = new Counter(); // no arguments, will default to starting at 0
var counter2 = new Counter(4); // argument passed, will start at 4
pbs.say('counter 1 = ' + counter1.count() + ', counter 2 = ' + counter2.count());

// increment counter 1
counter1.increment();
pbs.say('counter 1 = ' + counter1.count() + ', counter 2 = ' + counter2.count());

// increment counter 2 5 times
for(var i = 0; i < 5; i++){
  counter2.increment();
}
pbs.say('counter 1 = ' + counter1.count() + ', counter 2 = ' + counter2.count());

// jump counter 1 to 11
counter1.count(11);
pbs.say('counter 1 = ' + counter1.count() + ', counter 2 = ' + counter2.count());

// reset counter 2
counter2.reset();
pbs.say('counter 1 = ' + counter1.count() + ', counter 2 = ' + counter2.count());
```

Notice that we can pass values to the constructor function to set defaults. Also, notice that the behaviour of the `count()` function changes depending on whether or not you pass it arguments – it allows you to get and/or set the value in the counter. This is a very common design pattern in JavaScript. Finally, notice the inner variable is pre-fixed with an `_`. This is a convention for marking the variable as private. It does not actually prevent access to the variable, but serves as an indication to programmers using your prototype that they are using it incorrectly (there are advanced techniques for creating truly private variables, but we’ll leave those for another day).

### Accessing `this` from Within Anonymous Functions

When building up a prototype, we can use `this` to access both properties and functions belonging to the objects created with our prototype. You can see examples throughout the previous example.

However, beware that you can’t use `this` to access your object’s properties or functions from within anonymous functions within functions belonging to your prototype. Those anonymous functions will have a variable called `this` in scope, but it will not point to the prototyped object.

If you want to reach your object’s properties from within an anonymous function, you need to wrap it in a different name that is not part of the core JavaScript language. By convention, the name `self` is used. In other words, before defining the first callback within a function belonging to a prototype, add this line:

```JavaScript
var self = this;
```

Then, within the callback, you can access your object’s properties and functions using `self` instead of `this`.

This technique works because the callback has access to the scope belonging to the function within which it was created. This access to the creating scope is known as a _closure_. Because integrating JavaScript into the web makes heavy use of callbacks, closures are important in the browser environment.

This sounds more complicated than it is – let’s illustrate the technique with an example.

```JavaScript
//
// === Create a GuessingGame Prototype ===
//

// -- Function --
// Purpose    : constructor
// Returns    : A GuessingGame object
// Arguments  : NONE
function GuessingGame(){
  // pick a random number between 1 and 10, and store it
  this._value = Math.floor(Math.random() * 10) + 1;
  
  // store whether or not the game is over
  this._over = false;
  
  // store whether or not the game has been won
  this._won = false;
}

// -- Function --
// Purpose    : Make one or more guesses
// Returns    : true if you guesses correctly, false otherwise
// Arguments  : 1) an integer
//                --OR--
//              1) an array of integers
GuessingGame.prototype.guess = function(g){
  // deal with the arguments - always make them into an array
  var guesses = [];
  if(g instanceof Array){
    guesses = g; // is an array, so just store reference
  }else{
    guesses[0] = g; // not an array, so store in element 0
  }
  
  // if the game is over, say so and leave
  if(this._over){
    pbs.say("Sorry - the game is over - too later to guess now!");
    return false;
  }
  
  // loop through the guesses
  var self = this; // alias this for use in callback
  var guessedRight = false;
  guesses.forEach(function(guess){
    // if the game is not over, make a guess
    if(!self._over){
      if(isNaN(guess)){
        pbs.say('Invalid Guess - ' + guess + ' is not a number');
      }else if(guess == self._value){
        pbs.say('CORRECT - the secret number is ' + guess);
        self._over = true;
        self._won = true;
        guessedRight = true;
      }else if(guess < self._value){
        pbs.say(guess + ' is too low');
      }else{
        pbs.say(guess + ' is too high');
      }
    }
  });
  
  // return how we did
  return guessedRight;
};

// -- Function --
// Purpose    : Give up - will print the answer
// Returns    : A reference to self to facilitate function chaining
// Arguments  : NONE
GuessingGame.prototype.quit = function(){
  // if the game is already over, say so, and leave
  if(this._over){
    if(this._won){
      pbs.say('Game already over - you WON!');
    }else{
      pbs.say('Game already over - you lost :(');
    }
    return this;
  }
  
  // end the game and reveal the answer
  this._over = true;
  pbs.say("Game Over - the secret number was " + this._value);
  
  // return a reference to self
  return this;
};

//
// === Use or GuessingGame Prototype ===
//

// create a new guessing game
var myGame = new GuessingGame();

// guess or give an error message
var guesses = pbs.inputs();
if(guesses.length == 0){
  pbs.say('Try guess a number between 1 and 10 (inclusive) - enter your guesses in the inputs');
}else{
  var gotIt = myGame.guess(guesses);
  
  // if we didn't guess right, quit so we see the answer
  if(!gotIt){
    myGame.quit();
  }
}
```

Notice that within the `guess()` function of the `GuessingGame` prototype, we have a callback that needs to access some of the object’s properties. We create a variable named `self`, and assign it the value `this`. Then, within the callback, we use `self` where ever we would normally use `this`.

### Testing if an Object has a Prototype

The `instanceof` operator can be used to test if a variable has a given prototype. You put the item to test before the operator, and the prototype to test against after the operator, and it will evaluate to `true` if the object contains the given prototype, and `false` otherwise. You may remember that we’ve already used this operator to test if a variable contains a reference to an array by checking the variable against the prototype `Array`.

We can use this operator to test any variable against any prototype, including prototypes we have created ourselves:

```JavaScript
//
// === Define our Counter Prototype ===
//

// define the countructor
function Counter(){
  // default the counter to zero
  this._count = 0;
  
  // if a value was passed, use it as the initial value of the counter
  // (assuming it is valid)
  if(arguments.length){
    this.count(arguments[0]);
  }
}

// add a reset function to the prototype
Counter.prototype.reset = function(){
  this._count = 0;
};

// add an increment function to the prototype
Counter.prototype.increment = function(){
  this._count++;
};

// add an accessor function to the prototype
Counter.prototype.count = function(){
  // if there were arguments, set the count to the given value
  // (assuming it is a number)
  if(arguments.length){
    var newCount = parseInt(arguments[0]);
    if(!isNaN(newCount)){
      this._count = newCount;
    }
  }
  
  // always return the count
  return this._count;
};

//
// === Use our Counter Prototype ===
//

// create 2 variables - a counter and an Array
var ctr = new Counter();
var a = [1, 4, 8];

// check if either is a Counter
pbs.say(ctr instanceof Counter);
pbs.say(a instanceof Counter);
```

## PBS JavaScript Cheat-Sheet

The [JavaScript cheat-sheet](https://www.bartbusschots.ie/pbsdemos/PBS-JS-CheatSheet.html) has been updated to include the contents of this instalment.

## A Challenge

First, build a prototype called `Quotation`. `Quotation` objects should contain two pieces of data, a quotation, and a name. The constructor should require two arguments, both strings, the first a quotation, the second the name the person who said it. The prototype should also provide accessor methods allowing the quotation and name be updated. Name these functions `.quote()` and `.by()`. The prototype should also contain a function which returns the quotation as a nicely formatted string – the quotation appearing first and surrounded by quotation marks, then a dash, and then the name of the person. Call this function `.toString()`.

Secondly, build a second prototype called `RandomQuoter`. `RandomQuoter` objects should contain a single piece of data, an array of `Quotation` objects. The constructor should optionally be able to take an arbitrary number of arguments, and any of them that are `Quotation` objects should get stored. The prototype should contain a function named `.empty()` that blanks the stored array of quotations. The prototype should also contain a function named `.add()`, which should take an arbitrary number of `Quotation` objects as arguments, and append them to the stored quotations. For convenience, you might want to write `.add()` so it can also accept quotes in an array passed as the first argument. Finally, the prototype should contain a function named `.quote()` which returns a random quotation from the set of stored quotations as a string. If the object does not contain any quotations, `.quote()` should return `undefined`.

Test your prototypes by building an object containing some of your favourite quotations, and printing three of them at random.

For extra credit, add the ability for your `Quotation` objects to store an optional explanatory note. Your constructor should accept such a note as a third optional argument, there should be an accessor function for it named `.note()`, and, the `.toString()` function should render the note in parenthesis after the name.

## Conclusions

Our understanding of the core JavaScript language is coming on nicely now. We’ve learned all the basics – variables, conditionals, loops, arrays, functions, callbacks, and objects, and just have a few more loose ends to tie up before we are ready to leave the playground and move into the browser.