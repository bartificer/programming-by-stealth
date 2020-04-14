# PBS 14 of X – JS Loops & Arrays

At this stage we’ve learned about three of the key components common to just about every programming language, and how they’re implemented in JavaScript – variables, operators, and branching. Now it’s time to add two more – arrays, and loops.

Arrays store a list of related data in a single variable, and loops allow us to apply the same action over and over again. To process an arbitrarily long array, you need some kind of iteration, and loops are the simplest way of achieving that.

# Matching Postcast Episode 438

Listen Along: Chit Chat Accross the Pond Episode 438

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_05_13.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_05_13.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Our Playground

For this instalment we’ll be using our JavaScript playground again. You can download the code for the playground [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/04/pbs-JavaScriptPlayground-v2.1.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs-JavaScriptPlayground-v2.1.zip), or, you can use the online version at [www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground/](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/).

## Arrays – The Basics

You can think of an array as a single row of old-fashioned pigeon holes that are numbered from zero up. You can put a value in box 0, and another in box 1, and another in box 2, and so on and so forth.

Because JavaScript is an untyped language, you can mix and match data types within a single array. If you’re coming to JavaScript from a strongly typed language like C or Java, this will take some getting used to.

In JavaScript, you create an array of values like this:

```JavaScript
var myArray = ['a string', 42, true];
```

The above code creates an array containing three values, element 0 contains the string `'a string'`, element 1 contains the number `42`, and element 2 contains the boolean `true`.

We can access the values stored in these array elements like so:

```JavaScript
var firstVal = myArray[0];
var secondVal = myArray[1];
var thirdVal = myArray[2];
```

We refer to the number inside the square brackets as an _index_. So, we say that in JavaScript, arrays are indexed from zero up. We also talk about the element at index 0, or the element at index 1, etc..

You can add more values into an array after it has been created by simply assigning a value to the desired array index. Note that in JavaScript, arrays can have gaps.

```JavaScript
var myArray = [1, 2];
myArray[42] = 11; // array now has elements 0, 1, and 42
```

You don’t have to add any values into an array as you create it – you can create a completely empty array like so:

```JavaScript
var myEmptyArray = [];
```

For those of you coming to JavaScript from strongly typed languages, you’ll be happy to know that JavaScript arrays shrink and grow as needed – you don’t have to declare their size as you create them.

Arrays have a `length` property which you can assess by appending `.length` to the array name. Because array indexes start at zero, the length is one greater than the highest defined index. Note that that is exactly how the length is calculated, so an array with just one defined element at index 100 has a length of 101. This concept is demonstrated below:

```JavaScript
var a1 = ['a', 'b'];
pbs.say(a1.length);
a1[9] = 'j';
pbs.say(a1.length);
var a2 = [];
pbs.say(a2.length);
a2[100] = 'boo!';
pbs.say(a2.length);
```

Back in the first instalment, I mentioned that in JavaScript, variables hold either a literal value (number, string, or boolean), or, a reference to an object. We’ve not looked at objects in any kind of detail yet, and we’re not going for some time yet, but, I do want to flag the fact that in JavaScript, arrays are implemented as objects. This will become important later on in the series.

## Loops

Loops allow a block of code to be repeated until a given condition is met. JavaScript supports a number of looping constructs, but we’re just going to focus on the two most common ones in this instalment – the `while` and `for` loops.

### `while` Loops

We’ll start with the most generic kind of loop – the `while` loop. A `while` loop takes the following form:

```JavaScript
while(condition) statement;
```

The condition is checked, if it evaluates to `false`, execution jumps beyond the loop, if it evaluates to `true`, the statement gets executed, then the loop repeats, checking the condition again.

As with `if` statements, the spec talks about a statement, but, anywhere you can have a statement, you can have a code block, and, just like with `if` statements, I strongly suggest you get into the habit of always using a code block with your `while` loops. This is how I suggest you always write your `while` loops:

```JavaScript
while(condition){
  statement; // one ore more statements in the loop
}
```

As a simple example, let’s use a while loop to total all the elements in an array.

```JavaScript
var a = [1, 2, 3, 4, 5];

// loop through the array to sum the values
var total = 0;
var i = 0; // a counter for use in the loop
while(i < a.length){
  total += a[i]; // update the sum
  i++; // move on to the next array element
}

// print the results
pbs.say(total);
```

This is a very common code pattern – declare a counter before the loop, increment the counter at the end of the loop, and keep going until some number is reached. This code pattern is so common in fact, that a new looping construct was developed to make the code cleaner – the `for` loop.

### `for` Loops

`for` loops were designed to make iterating over a range of numbers easier, and to make such code more easily readable. There is nothing you can do with a `for` loop that you can’t do with a `while` loop.

The `for` loop takes the following form:

```JavaScript
for(initialisation_statement; condition; increment_statement) looped_statement;
```

Again, you should get into the habit of a using a code block for `for` loops, so I suggest you always use the following form:

```JavaScript
for(initialisation_statement; condition; increment_statement){
  looped_statement; // one or more statements here
}
```

The `initialisation_statement` gets executed once, and once only, when the loop initiates, then the condition is checked, if it evaluates to `false`, then execution jumps past the loop, if it evaluates to `true`, the `looped_statement` is executed, then the `increment_statement`, and then we jump back to checking the condition.

If we re-write the above `while` loop as a `for` loop you’ll see how much easier it becomes to read

```JavaScript
var a = [1, 2, 3, 4, 5];

// loop through the array to sum the values
var total = 0;
for(var i = 0; i < a.length; i++){
  total += a[i]; // update the sum
}

// print the results
pbs.say(total);
```

It’s much easier to see that this loop iterates over values of `i` between zero and the length of the array, because everything relating to the variable being iterated is together on the same line.

You don’t have to call your iteration variable `i`, but most people do – it’s a convention that even transcends programming languages.

The counter doesn’t have to start at zero, and the updating of the counter doesn’t have to be a simple increment. The following example prints out all odd factors of 13 that are less than 1000 in reverse order:

```JavaScript
for(var i = 999; i > 0; i -= 2){
  if(i % 13 == 0){
    pbs.say(i);
  }
}
```

### Watch out for Infinite Loops

When looping in any way, be careful that the loop will always end, otherwise you have what is called an _infinite loop_, and your script will never get beyond that line of code. It will be doomed to repeat itself for ever! Some browsers will eventually detect that a script has been running for an abnormally long time, and offer to kill it, but others won’t. Your only choice then will be to close the tab/window and start over!

If you’d like to intentionally create an infinite loop, just to see what happens, the following will do it:

```JavaScript
// AN INFINITE LOOP - WILL KILL YOUR BROWSER TAB
while(1 == 1){
  ; // do nothing
}
```

You’re very unlikely to do something like the above example by accident, but you could easily make a simple mistake like the one below:

```JavaScript
var a = [1, 2, 3, 4, 5];

// loop through the array to sum the values
// THIS CREATES AN INFINITE LOOP!!!
var total = 0;
var i = 0; // a counter for use in the loop
while(i < a.length){
  total += a[i]; // update the sum
}

// print the results
pbs.say(total);
```

Why is this an infinite loop? We forgot to increment `i` at the bottom of the loop, so, `i` will remain zero for ever, and the loop will never end.

Another common mistake is to try loop through an array backwards, but type `i++` out of habit, instead of `i--`:

```JavaScript
var a = [1, 2, 3, 4, 5];

// loop through the array to sum the values
var total = 0;
// THIS CREATES AN INFINITE LOOP!!!
for(var i = a.length - 1; i >= 0; i++){
  total += a[i]; // update the sum
}

// print the results
pbs.say(total);
```

Since `i` will keep getting bigger, and the loop will only terminate when `i` becomes less than zero, it will never end.

## Checking if a Variable Contains a Reference to an Array

To check if a variable contains an array reference or not, we need to check if it is an object with the `Array` prototype (for now, this is technobabble, but it will make sense a few instalments from now). We can do this with the `instanceof` operator. We’ll revisit this operator later in the series, so for now I’ll just say that the following only evaluates to `true` when `x` contains a reference to an array: `x instaceof Array`.

```JavaScript
var a = [1, 2, 3];
var b = 'boogers';
pbs.say(a instanceof Array);
pbs.say(b instanceof Array);
```

## The _truthiness_ of Arrays

As we learned in the previous instalment, all variables can be collapsed to `true` or `false` when needed. For example, we know that all numbers other than zero evaluate to `true`, and zero to `false`. All array references evaluate to `true`, even references to empty arrays.

```JavaScript
pbs.say("[] evaluates to\t\t" + Boolean([]));
pbs.say("['boo!'] evaluates to\t" + Boolean(['boo!']));
```

## Worked Example 1 – Product of Inputs

Our first worked example will multiply together the contents of all the non-empty inputs in the playground.

The playground defines a function `pbs.inputs()`, which returns an array of values from all the non-empty inputs in the interface. This array can be anywhere from zero to three long, depending on how many inputs are left empty.

```JavaScript
// get all non-empty inputs
var rawInputs = pbs.inputs();

// check whether we got any inputs or not
if(rawInputs.length){
  // the array is not empty, so do the multiplcation
  var prod = 1; // because 1 * x == x
  for(var i = 0; i < rawInputs.length; i++){
    prod *= parseInt(rawInputs[i]);
  }
  
  // build a string representing the raw inputs nicely
  var inputString = '';
  for(var i = 0; i < rawInputs.length; i++){
    // add a separator as appropriate
    if(i > 0){
      // we are not the first elent, so add a separator of some kind
      if(i == rawInputs.length - 1){
        // we are the last element, so separate with an &
        inputString += ' & ';
      }else{
        // we are not the last element, so separate with a comma
        inputString += ', ';
      }
    }
    
    // add the value
    inputString += rawInputs[i];
  }
  
  // print the answer
  pbs.say("The integer product of " + inputString + " is " + prod);
}else{
  // the array is empty, so print that fact
  pbs.say('no inputs - enter numbers to calculate their integer product');
}
```

## Worked Example 2 – Print all Multiplication Tables Up to the N-Times Tables

What we’d like to do is print out the multiplication tables for all numbers between 1 and a given number.

Let’s start by writing the code to print the table for any given number:

```JavaScript
// get the number to do the tables for
var rawInput = pbs.input(1);
var n = parseInt(rawInput);

// validate the input
if(isNaN(n) || n < 1){
  // we're not a valid number, so whine
  pbs.say('invalid input: input 1 must be a positive integer');
}else{
  // valid input, so print the table
  for(var i = 1; i <= 12; i++){
    pbs.say(n + ' x ' + i + ' = ' + (n * i));
  }
}
```

Now, we can add a second loop around the first loop to go from 1 up to n:

```JavaScript
// get the number of tables to do
var rawInput = pbs.input(1);
var n = parseInt(rawInput);

// validate the input
if(isNaN(n) || n < 1){
  // we're not a valid number, so whine
  pbs.say('invalid input: input 1 must be a positive integer');
}else{
  // valid input, so print the tables
  for(var i = 1; i <= n; i++){
    for(var j = 1; j <= 12; j++){
      pbs.say(i + ' x ' + j + ' = ' + (i * j));
    }
    // inject a blank line unless we've just done the last table
    if(i != n){
      pbs.say('');
    }
  }
}
```

## Conclusions

We’re now well on the way to learning about the most important building blocks that are common to all languages. We’ve learned about variables, operators, branching, arrays, and looping. Next on the agenda is functions – named chunks of re-usable code.