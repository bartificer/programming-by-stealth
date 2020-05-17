# PBS 16 of X – JS Callbacks

In the previous instalment we introduced the concept of JavaScript functions. We learned how to call existing functions, and how to create our own.

In this instalment, we’re going to take our understanding of functions to the next level. The techniques we encounter today would be considered advanced techniques in most other languages. You could spend years developing in Java and never encounter an anonymous function. However, because of how JavaScript is integrated into HTML documents, these techniques are considered fundamental in JavaScript, and anonymous functions are a dime a dozen!

Before we delve into anonymous functions, we’ll start by taking a deeper look at how JavaScript deals with function arguments.

## Matching Podcast Episode 442

Listen Along: Chit Chat Across the Pond Episode 442

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_06_10.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_06_10.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Our Playground

For this instalment we will yet again be using our JavaScript playground. You can download the code for the playground [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/04/pbs-JavaScriptPlayground-v2.1.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs-JavaScriptPlayground-v2.1.zip), or, you can use the online version at [www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground/](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/).

## PBS JavaScript CheatSheet

At Allison’s suggestion, I’ve created a [JavaScript cheatsheet](https://www.bartbusschots.ie/pbsdemos/PBS-JS-CheatSheet.html) which you can use as a quick reminder when working on the challenges. The cheatsheet reminds you of the core concepts through a series of code samples and links back to the relevant PBS instalments.

I’ll update the cheatsheet as we continue to learn more.

## Solution to Instalment 15 Challenge

At the end of the previous instalment, I set an optional challenge, and promised to provide a possible solution next time. The challenge was to create a function for calculating the average of an arbitrarily long array of numbers and use this function to average numbers entered into the inputs in the playground.

There are infinitely many correct solutions to any programming problem, so this is just one possible solution:

```javascript
// define the averaging function
function avg(a){
  // check that we got an array - if not, return NaN
  if(!(a instanceof Array)){
    return NaN;
  }

  // check that the array is not empty - if it is, return NaN
  // this is required to avoid a divide by zero error later in the function
  if(!a.length){ // 0 evaluates to false
    return NaN;
  }

  // calcualte the sum of all the values in the array
  var aSum = 0;
  for(var i = 0; i < a.length; i++){
    aSum += parseFloat(a[i]); // convert strings to numbers before adding
  }

  // calcuate the average by dividing the sum by the amount of numbers
  var ans = aSum / a.length;

  // return the average
  return ans;
}

// read the inputs
var theInputs = pbs.inputs();

// check if we got any inputs - if we did, average them, if we didn't - whine!
if(theInputs.length){
  // get the average and print it
  pbs.say(avg(theInputs));
}else{
  // no inputs, so whine
  pbs.say('Enter numbers into the inputs to average them');
}
```

## Detecting Undefinedness

It should be easy to tell whether or not a given argument was passed to a function, but sadly it’s not.

We know that undefined evaluates to false; so you might think to do something like this:

```javascript
function doubler(n){
  if(n){
    return parseFloat(n) * 2;
  }
  return undefined;
}
pbs.say('calling doubler() with no args results in ' + doubler());
pbs.say('calling doubler() with 0 as the first arg results in ' + doubler(0));
pbs.say('calling doubler() with the empty string as the first arg results in ' + doubler(''));
pbs.say('calling doubler() with 8 as the first arg results in ' + doubler(8));
pbs.say("calling doubler() with the string '8' as the first arg results in " + doubler('8'));
```

This does work correctly when no argument is passed, but it can’t tell the difference between no argument and any other argument that evaluates to false.

What we need is a proper test for undefinedness. This is where the `typeof` operator comes in.

If a variable is undefined, then applying the `typeof` operator to it will result in the string `'undefined'` – `typeof x === 'undefined'`. Knowing this, we can rewrite our function from above like so:

```javascript
function doubler(n){
  if(typeof n !== 'undefined'){
    return parseFloat(n) * 2;
  }
  return undefined;
}
pbs.say('calling doubler() with no args results in ' + doubler());
pbs.say('calling doubler() with 0 as the first arg results in ' + doubler(0));
pbs.say('calling doubler() with the empty string as the first arg results in ' + doubler(''));
pbs.say('calling doubler() with 8 as the first arg results in ' + doubler(8));
pbs.say("calling doubler() with the string '8' as the first arg results in " + doubler('8'));
```

## Getting Clever with Function Arguments

So far, all we know about arguments is that we give them a name in the function definition. Then we access them by that name within the body of the function. Let’s look a little more deeply.

### Optional Arguments

It is often the case that the task performed by a function needs some arguments, while other arguments have a sensible default; so it makes sense to have them be optional.

A somewhat contrived simple example would be a function called `incrementor()`. By default it will increment values by 1, but it can increment by a different amount if desired. In other words, it requires one argument, the number to increment, and optionally supports a second, the amount to increment by. You could implement that function like so:

```javascript
// define the incrementor function
function incrementor(n, i){
  // make sure we got a valid number to increment
  if(isNaN(n)){
    return NaN;
  }

  // deal with the optional incrementor
  var inc = 1; // the default value
  if(!isNaN(i)){
    inc = i;
  }

  // increment and return
  return n + inc;
}

// call the increment or with various arguments
pbs.say(incrementor());
pbs.say(incrementor(1));
pbs.say(incrementor('donkey'));
pbs.say(incrementor(3.1416));
pbs.say(incrementor(5, 5));
pbs.say(incrementor(5, 'donkey'));
pbs.say(incrementor(3.146, 5.2));
```

As you can see, our function behaves in a sensible way, regardless of the number of arguments provided.

### An Arbitrary Number of Arguments

Optional arguments are very useful, but sometimes you need to write a function that can take any number of arguments – say a function to get the product of any amount of numbers.

A hack you could perform would be to force the caller of the function to pass all the numbers as a single array. This gets messy though – it would be much nicer if you could write a function that would work properly in all these scenarios:

```javascript
product(2, 4);
product(2, 4, 6, 7, 11);
product(2, 4, 6, 7, 11, 234, 1, 43, 66);
```

This is where the `arguments` array comes to your rescue. The argument names we have been using up until this point are completely optional – they are a convenience rather than a requirement. JavaScript actually stores all arguments in a locally scoped array called `arguments`. We already know how to loop over arrays. So we can use that knowledge to loop over arguments:

```javascript
// define the product function
function product(){
  // if there are no arguments, return 0
  if(arguments.length == 0){
    return 0;
  }

  // loop over the arguments
  var ans = 1;
  for(var i = 0; i < arguments.length; i++){
    ans = ans * arguments[i];
  }

  // return the final answer
  return ans;
}

// call the product function
pbs.say(product());
pbs.say(product(2));
pbs.say(product(2, 4));
pbs.say(product(2, 4, 6, 7, 11));
pbs.say(product(2, 4, 6, 7, 11, 234, 1, 43, 66));
```

## In JavaScript, Functions are Objects

We already know that variables can contain literal values or references to objects. We have learned that, in JavaScript, arrays are objects. In JavaScript, functions are objects too. Because variables can hold references to objects, and because functions are objects, variables can hold references to functions, and, functions can be passed to other functions as arguments.

The `function` keyword creates function objects. So far, we have been creating and naming our functions in one go using a convenient shortcut notation – let’s strip the shortcut away. When you write this:

```javascript
function doubler(x){
  return x += x;
}
```

You are really doing this:

```javascript
var doubler = function(x){
  return x += x;
};
```

Each time we have created a function, we have simply been creating a variable with the name we gave our function, and setting the value of that variable to be a reference to the function we created.

We can us this variable just like we can any other variable.

To prove this point, let’s create a function, and copy the reference into another variable name, giving us two references to the same function:

```javascript
// define a function, and save a referene to it into the variable doubler
var doubler = function(x){
  return x * 2;
};

// copy a reference into a new variable simply called d
var d = doubler;

// we can now call the function both ways
pbs.say(doubler(4));
pbs.say(d(4));
```

### Checking if a Variable Contains a Reference to a Function

To make our code robust, we’ll need to check if a variable does or does not contain a reference to a function. We can do this using the `typeof` operator. If a variable contains a reference to a function, then applying the `typeof` operator to it will result in the string `'function'`. So, we can test if something is a function with code like `typeof x === 'function'`:

```javascript
// create a function using the shortcut notation
function doubler(n){
  return n * 2;
}

// show its type
pbs.say(typeof doubler);

// create a function the explicit way
var tripler = function(n){
  return n * 3;
};

// show its type
pbs.say(typeof tripler);
```

### Functions as Arguments

To illustrate the power of function references as arguments, let’s create a function to apply an arbitrary function to every element of an array. Our function will take two arguments, a reference to an array and a reference to a function.

```javascript
// define a function to apply a function to every element in an array
function arrayApply(a, fn){
  // validate the arguments
  if(!(a instanceof Array)){
    pbs.say('ERROR - arrayApply called without an array as the first argument - doing nothing');
    return; // just leave the function
  }
  if(typeof fn !== 'function'){
    pbs.say('ERROR - arrayApply called without a function as the second argument - doing nothing');
    return; // just leave the function
  }

  // apply the function to all emements of the array
  for(var i = 0; i < a.length; i++){
    a[i] = fn(a[i]);
  }
}

// define a function for incrementing a value
function incrementer(n){
  return n + 1;
}

// define a function for doubling a value
function doubler(n){
  return n * 2;
}

// apply both functions to an array
var a = [1, 2, 3, 4];
pbs.say('initial array: ' + a);
arrayApply(a, incrementer);
pbs.say('incremented array: ' + a);
arrayApply(a, doubler);
pbs.say('doubled array: ' + a);
```

Having to declare and name the functions we want to apply to the array seems wasteful – why don’t we just create the function as we need it, and not name it?

```javascript
// define a function to apply a function to every element in an array
function arrayApply(a, fn){
  // validate the arguments
  if(!(a instanceof Array)){
    pbs.say('ERROR - arrayApply called without an array as the first argument - doing nothing');
    return; // just leave the function
  }
  if(typeof fn !== 'function'){
    pbs.say('ERROR - arrayApply called without a function as the second argument - doing nothing');
    return; // just leave the function
  }

  // apply the function to all emements of the array
  for(var i = 0; i < a.length; i++){
    a[i] = fn(a[i]);
  }
}

// apply two anonymous functions to an array
var a = [1, 2, 3, 4];
pbs.say('initial array: ' + a);
arrayApply(a, function(n){return n + 1;});
pbs.say('incremented array: ' + a);
arrayApply(a, function(n){return n * 2;});
pbs.say('doubled array: ' + a);
```

The functions we dynamically created inside the call to `arrayApply()` were created without giving them a name. This is why they are known as _anonymous functions_. When a function reference is passed as an argument to another function, it is known as a _callback_. A JavaScript aficionado may say that `arrayApply()` function uses callbacks to apply a function to every element in an array.

## Iterating Over Arrays with Callbacks

What we have done above is such a common thing to want to do that there is a built-in JavaScript function for doing it.

Array objects contain a reference to a function called `forEach()`, which calls a callback with each element of the array as an argument. This is by far the easiest way to loop through an array.

The `forEach()` function calls the callback with two arguments: first, the value of the element in the array, and second, the position in the array.

Let’s illustrate this with a simple example:

```javascript
var a = ['Allison', 'Likes', 'Boogers'];
a.forEach(function(w, i){
  pbs.say(i + ': ' + w);
});
```

## A Challenge

Create a function called `inputTransformer()`. This function will accept a single argument – a reference to a function object, aka callback. The callback can be assumed to take one argument and return a value.

`inputTransformer()` should loop through all the inputs with values entered in the PBS playground and apply the passed function to each value. `inputTransformer()` should print the value of each input and the result of passing that value to the callback.

`inputTransformer()` should check that it was passed a valid argument and print an error message if it was not.

Test `inputTransformer()` by calling it with an anonymous function that squares the inputs, and another that cubes them.

## Conclusions

Because of how JavaScript has been integrated into HTML documents, it’s impossible to overstate the importance of anonymous functions and callbacks. If you’ve come to this series with knowledge of more traditional languages like C or Java, you may well be having a harder time of things than those coming to the series with no pre-existing knowledge. This way of working with functions is very different to how you would normally work in other languages.

At this stage we’ve learned almost all the basic building blocks we need to move out of the playground and into the browser proper – we’ve learned about variables, operators, branching, arrays, loops, and functions. In the process we’ve touched on, but never explained, objects. That’s the next thing we need to do. Then, we’ll look at some built-in objects and functions provided by JavaScript.
