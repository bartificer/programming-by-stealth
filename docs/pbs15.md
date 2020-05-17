# PBS 15 of X – JS Functions

At this stage we’ve learned about five key components to any programming language, and how they are implemented in JavaScript – variables, operators, branching, arrays, and loops. Now it’s time to add another – functions.

A function is a collection of statements that is given a name so it can be easily reused. We’ve already used functions, but without knowing that’s what we’ve been doing.

## Matching Podcast Episode 440

Listen Along: Chit Chat Across the Pond Episode 440

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_05_27.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_05_27.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Our Playground

For this instalment we will be using our JavaScript playground yet again. You can download the code for the playground [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/04/pbs-JavaScriptPlayground-v2.1.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs-JavaScriptPlayground-v2.1.zip), or, you can use the online version at [www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground/](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/).

## You’ve Already Used Functions

In JavaScript, you execute, _call_, or _invoke_, a function by giving its name, and adding two brackets after it. Those two brackets can optionally contain a list of one or more inputs to the function, known as _arguments_. Functions can optionally return an output.

Throughout all our JavaScript examples we’ve been using the `pbs.say()` function to write text to our playground’s output area. We’ve been passing the function a single argument, the text to be printed. This function takes one argument, and returns nothing. Functions that return nothing are sometimes referred to as being _void_. The `pbs.inputs()` function on the other hand takes no arguments, and returns an array. Finally, the `pbs.input()` function takes one argument, the number of the input to get the value from, and returns the content of the requested input.

We have also encountered some built-in JavaScript functions, including `parseInt()`, `parseFloat()`, `isNaN()`, `String()`, and `Boolean()`.

## Creating Your Own Functions

You can create your own functions using the `function` keyword:

```javascript
function name(argument_list){
  statements;
}
```

The rules for function names are the same as the rules for variable names that we learned in [instalment 12](https://pbs.bartificer.net/pbs12).

The argument list takes the form of zero or more argument names separated by commas. These will be the variable names by which you can address the arguments within your function.

Finally, if you want your function to return a value, use the keyword `return`. When an executing function meets a `return` statement, execution of the function stops, even if there are more lines of code after the `return` statement. This can be very useful, and allows for error handling without deeply nested `if` statements.

As an example, let’s write a function to calculate the factorial of a number, and use it to calculate the factorials of all non-empty inputs:

```javascript
// define the factorial function
function factorial(n){
  // convert n to an integer number
  n = parseInt(n);

  // validate n
  if(isNaN(n) || n < 1){
    // n is invalid, so return NaN
    return NaN;
  }

  // do the calculation
  var ans = 1;
  for(var i = n; i > 1; i--){
    ans *= i;
  }

  // return the answer
  return ans;
}

// call the factorial function on each filled input
var rawInputs = pbs.inputs();
if(rawInputs.length){
  for(var i = 0; i < rawInputs.length; i++){
    pbs.say(rawInputs[i] + ' factorial is ' + factorial(rawInputs[i]));
  }
}else{
  pbs.say('enter at least one input to calculate one or more factorials');
}
```

## Variable Scope

A scope is a namespace for variables. There is a global scope, which is what we’ve been using in all examples previous to this instalment. Every function creates its own scope and has access to the scopes that contain it.

The scope of a variable is determined by where in the code it’s created – i.e., the location of the `var` keyword within your code. When you use `var` outside of any function, you are adding a variable to the global scope. When you use `var` within a function, you are adding that variable to the function’s scope. The names you give your arguments are also added to the function’s scope. When you declare a function in the global scope (as we are doing in all our examples today), the function’s scope is a child scope of the global scope.

Whenever you use a variable name in your code, JavaScript looks for a variable of that name in the nearest scope to the executing line of code. If it finds one, it stops looking. If not, it tries the parent scope. When your code gets more complicated, there could be many scopes nested inside each other, so JavaScript may have a long way to go to finally find the variable. If the JavaScript interpreter makes it to the global scope and still doesn’t find a variable with the requested name, it assumes the variable is undefined.

In real terms, what this means is that functions can access global variables, but, as long as you remember to always declare your local variables with the `var` keyword, global variables can’t unexpectedly interfere with the innards of a function, and functions should not unexpectedly interfere with global variables. If you assume a variable is local, but forget to use `var` to declare it, and there is a variable with the same name in the global scope, you can end up with very strange and difficult to find bugs. A function that unintentionally uses a global variable can have ‘spooky action at a distance’. The offending function could be hundreds of lines of code away from the variable it’s interfering with. This is why the `var` keyword is so important.

Some examples may help this subtle but important concept sink in. Firstly, let’s do what you’ll want to do more often than anything else – protect the variables within a function from globally scoped variables with the same name by diligently using `var` within the function:

```javascript
// declare a function that creates a local variable x
function dummyFn(){
  var x = 5; // only exists within this function
  pbs.say('x inside dummyFn() has the value ' + x);
}

// declare a globally scoped variable x
var x = 6; // global scope
pbs.say('x in the global scope has the value ' + x);

// call the function to print the value of its local x
dummyFn();

// double the globally scoped x
x *= 2;
pbs.say('x in the global scope has been doubled to ' + x);

// call the function to print the value of its local x again
dummyFn();
```

Sometimes you intentionally want to access a global variable from within a function – you do this by intentionally not declaring the the variable inside the function:

```javascript
// declare a globally scoped accumulator
var ACCUMULATOR = 1;

// declare a function which doubles the accumulator each time it is called
function doubleAccumulator(){
  pbs.say('doubling the value in the global accumulator');
  ACCUMULATOR *= 2;// intentionally using a globally scoped variable
}

// call the function a few times
pbs.say('The value of the globally scoped accumulator is now ' + ACCUMULATOR);
for(var i=0; i < 5; i++){
  doubleAccumulator();
  pbs.say('The value of the globally scoped accumulator is now ' + ACCUMULATOR);
}
```

So, in the global scope, our rule from instalment 12 remains – ‘always user `var`‘; but within functions we now need a little more nuance. We should always use `var` unless we are intentionally reaching out to a global variable.

To help make accidental omissions of `var` within functions easier to spot, some programmers adopt the convention of using all caps for the names of globally scoped variables that will be accessed from within functions.

Something to note is that each time a function runs, a new scope is created for it, so, if there are multiple instances of the same function running at the same time, each has its own scope, so each has its own copy of the variables it creates.

This facilitates a programming technique that divides people like no other – recursion.

## Recursion (Optional)

Recursion is when a function calls itself. To some people this is a really intuitive solution to many problems, and to others it makes their heads explode. For that reason, this section is entirely optional. I’m going to describe recursion. If it makes your head explode, just skip this section and don’t worry about it.

Recursion works very well on certain data structures like trees, and in problems that can be expressed in a self referential way. The canonical example is calculating factorials – the factorial of 4 is 4 times the factorial of 3. The factorial of 3 is 3 times the factorial of two, and so on. This means you can define a factorial with two simple rules:

1.  The factorial of 1 is 1
2.  The factorial of n, where n is an integer greater than 1, is n times the factorial of n – 1

You can translate those two rules into a very simple piece of recursive code:

```javascript
function factorial(n){
  var intN = parseInt(n);

  // deal with the case where we received a nonsense argument
  if(isNaN(intN) || intN < 1){
    return NaN;
  }

  // implement rule 1
  if(intN == 1){
    return 1;
  }

  // implement rule 2
  return intN * factorial(intN - 1);
}
pbs.say(factorial(pbs.input(1)));
```

Recursion is actually another form of looping. We step through the values of `intN` by subtracting one from it each time we make a recursive call. We also have a terminating condition – when `intN` gets down to 1, the recursion stops.

This is an advanced technique, and one that comes with a health warning – deep recursion is very RAM hungry – each recursive call creates a new scope, so each recursive call uses a finite amount of memory – that will add up if you go nuts.

Secondly, it’s easy to make a mistake and end up with the recursive equivalent of an infinite loop – this will not only consume CPU, but also RAM. You can crash your browser very badly if you make a boo boo.

The key thing to watch out for is that you update your value before making the recursive call, and that your terminating condition will always be met.

Just a reminder – you can consider recursion an optional bonus topic – it’s not a technique we’ll be relying on in this series. If it doesn’t make sense to you, don’t worry about it.

## Object References & Functions

When we first learned about variables, I made a point of saying that in JavaScript, a variable can hold a literal value or a reference to an object. When we learned about arrays, I made a point of highlighting that, in JavaScript, arrays are objects. This becomes very important when it comes to using arrays with functions.

Whatever you pass to a function, or return from a function, gets copied. When you pass a variable that contains a literal value, the literal value gets copied. But, when you pass a variable that contains a reference to an array, the reference gets copied – not the array – so there is only ever one copy of the array. You must bear this in mind when altering arrays within functions – you are not altering a copy of the array!

To illustrate the difference, let's first pass a literal value to a function, alter it within the function, and see what happens:

```javascript
function doubler(x){
  x += x; // double the varible
  return x;
}

var a = 4;
pbs.say('the value of a before being passed to doubler(): ' + a);
var b = doubler(a);
pbs.say('the value of a after being passed to doubler(): ' + a);
```

As you can see when you run the above code – altering the passed value inside the function has no effect outside the function, because `a` contained a literal value. So the function was manipulating a copy of that value.

Now let’s see what happens when we pass an array:

```javascript
function arrayDoubler(x){
  for(var i = 0; i < x.length; i++){
    x[i] += x[i]; // double the value
  }
  // no need for a return - we only ever got a reference to the array anyway
}

var a = [1, 2 ,3];
pbs.say('the value of a before being passed to arrayDoubler(): ' + a);
arrayDoubler(a);
pbs.say('the value of a after being passed to arrayDoubler(): ' + a);
```

It is perfectly valid to write a function that intentionally alters an object, like in the above example. The thing to watch out for is that you should never alter an object unintentionally. If you do, your code will develop very strange bugs indeed, as function calls start to have unexpected side effects.

## A Challenge

Rather than a final worked example, I’m including a challenge instead. If you’d like to test your understanding of the concepts we’ve covered so far, this challenge is for you. I’ll include a solution at the start of the next instalment.

Write a function that returns the average value of an arbitrarily long array of numbers. Use that function to average up to three numbers entered in the input fields in the PBS playground, and print out the result. Your solution should also behave sensibly if the user executes the code without entering values into any of the inputs.

In case you’re a little rusty, just a reminder that you calculate the average of a set of numbers by adding them all together, and then dividing the result of that addition by the amount of numbers being averaged.

## Conclusions

This introduction to functions has given us a basic understanding of how they work. However, we still have more to learn about them. Firstly, we can be a lot cleverer about how we deal with arguments – we can make our functions do different things depending on how many arguments were passed. We can even make our functions accept an arbitrary number of arguments. Secondly, we’ll discover that, like arrays in JavaScript, functions are objects too. This simple fact has some very significant implications – including the related concepts of anonymous functions and callbacks. The latter two are central to JavaScript’s integration into the browser.
