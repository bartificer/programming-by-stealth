# PBS 86 of X — JavaScript Function Objects (Redux & Update)

This is the third instalment in a mini-series within the PBS series looking at the many different roles objects fulfil in JavaScript. I’ve been describing these roles as _hats_, so up to this point we’ve looked at how JavaScript objects have a _dictionary hat_ and an _array hat_. In future instalments we’ll see that JavaScript objects also have regular expression and string hats. Today though, we’ll start a two-part look at what is probably the most un-expected hat of all — the _function hat_. Yes, JavaScript uses objects to implement functions. That is to say, every JavaScript function is an object!

Because functions are so important, and because there is a lot of ground to cover, I’ve spread this topic over two instalments. This first instalment will be mostly (but not entirely) a redux, and most of the new content will be covered in the next instalment.

You can [download this instalment’s ZIP file here](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs86.zip) or [here on GitHub](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentZips/pbs86.zip) (now via the JSDelivr CDN). If you prefer, you can access this instalment’s resources directly at the following links:

*   `pbs86a.html`:  
    [View Page](https://rawcdn.githack.com/bbusschots/pbs-resources/5ddb3466abe64963a57daf09692b366fa845e483/instalmentResources/pbs86/pbs86a.html) or  
    [View Source](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs86/pbs86a.html)

# Matching Postcast Episode 615

Listen along to this instalment on [episode 615 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/11/ccatp-615)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_11_14.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_11_14.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Functions (Redux)

Like dictionaries and arrays, functions are a feature common to just about every language. Functions serve a very important role in programming — they allow programmers to create re-usable chunks of code, and give them names of some kind. Without functions you’d be spending 90% of your time copying-and-pasting chunks of code all over the place!

Functions also allow for a demarcation of responsibilities — you don’t have to know how a function works to use it. Only a function’s author needs to understand how it does what it does, users just need to know what it does, what inputs it expects, and what outputs will be produced. Once written a function can be thought of as a black box that takes zero or more inputs, known as _arguments_, and produces zero or one outputs, known as a _return value_. In many languages, including JavaScript, function can also throw errors, which you can think of as an output of sorts.

One of the most powerful features of JavaScript is that functions can be treated as data. Anywhere you can use a value, you can use a reference to a function. You can store them in variables, and you can pass them as arguments to other functions (callbacks). JavaScript is by no means alone in this, but the ability to treat functions like data isn’t universal among all languages.

The reason JavaScrip can treat functions as data is because JavaScript functions are implemented as objects! To be specific, **JavaScript functions are instances of the built-in class/prototype `Function`**. Because functions are objects, they’re always stored and passed as references (just like dictionaries and arrays).

While it is important to know that functions are objects and can be treated like data, the actual `Function` class/prototype provides no properties or functions you’ll need on a regular basis. It does provide a few properties and functions, and they are very powerful, but they’re very much for power users rather than for daily use. We will take a brief look at them near the end of the instalment, but only from the point of view of knowing what’s possible.

## 3 Syntaxes for Defining JavaScript Functions (Redux)

It often comes as a surprise to novice JavaScript programmers that there is no single way of defining a function. Throughout this series we’ve me the three commonly used syntaxes for defining functions, but I want to re-visit them as a group so as to point out how they’re similar, and more importantly, how they differ from each other. For completeness I should also mention that a 4th method of creating functions does exist, but it’s more theoretical than practical, and I’ve never seen it used anywhere but in the documentation! If you’re curious, I’m referring to the [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function). We’ve ignored it so far in this series, and I’m going to continue to do so 🙂

Before we go any further, just a quick note on the example code snippets. These can be run in the JavaScript console on any page, but have been tested in the console on the file `pbs86a.html` in this instalment’s ZIP. Note that for clarity, the examples have all been simplified to omit the argument checking you should carry out when writing production code.

### Function Statements

The original syntax for defining JavaScript functions is the [function statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) (also called the _function declaration_):

```JavaScript
function nameOfFunction(nameOfFirstArg, nameOfSecondArg){
  // ...
}
```

We get to choose the name of the function, and the names the arguments will get within the function’s body.

As a basic example, let’s write a function to raise one number to the power of another:

```JavaScript
function raiseTo(num, pow){
  let ans = num;
  for(let i = 2; i <= pow; i++){
    ans *= num;
  }
  return ans;
}
```

This will create an object named `raiseTo` in the scope containing the statement. Within the function the value passed as the first argument will have the name `num`, and the value passed as the second argument will have the name `pow`.

Note that the keyword for returning a value from a function is `return`. Once a `return` statement is encountered execution of the function stops.

Also note that **the function definition will be hoisted**, that is to say, it will be as if the function was declared at the top of the scope.

Hoisting can make things behave a little unexpectedly, as illustrated by this example:

```JavaScript
// declare the demo function (creates a new scope)
function hoistDemo(){
  // call the function we'll declare lower in this scope
  hoistedFunction();

  // declare the function after we appear to use it
  function hoistedFunction(){
    console.log('I exist already!');
  }
}

// call the demo function
hoistDemo();
```

When you run the above code the `hoistDemo()` function will be called, creating a new scope. Inside that scope the first line of code (ignoring comments) calls a function named `hoistedFunction()`. The second line of actual code declares that function. You might imagine that means the first line will fail. But, when you run the entire code snippet in a JavaScript console you’ll see that it doesn’t throw an error, and, that the string `'I exist already!'` will get logged. How? Hoisting!

Under-the-hood the JavaScript interpreter re-ordered the contents of the function `hoistDemo()` so that all function declarations are at the top, so the code is, in effect, silently transformed into the following:

```JavaScript
function hoistDemo(){
  function hoistedFunction(){
    console.log('I exist already!');
  }
  hoistedFunction();
}
```

### Function Expressions/Literals

A [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function), also known as a _function literal_ is a syntax for defining a function without giving it a name. Function expressions/literals can be used anywhere a JavaScript value can be used. Because they don’t inherently have a name, they’re often referred to as _anonymous functions_. Note that you can assign a function literal/expression to a variable name, so you can name an anonymous function if you like!

The syntax is simply:

```JavaScript
function(nameOfFirstArg, nameOfSecondArg){
  // ...
}
```

We can re-write our example `raiseTo()` function using the function expression/literal syntax like so:

```JavaScript
const raiseTo = function(num, pow){
  let ans = num;
  for(let i = 2; i <= pow; i++){
    ans *= num;
  }
  return ans;
};
```

Note that we name our anonymous function by assigning it to a variable. Because functions are objects, the variable `raiseTo` actually contains a reference to the function object, not the object itself.

Also note that **function expressions/literals are not hoisted**. We can prove this by re-writing our hoisting example from above using a literal:

```JavaScript
// declare the demo function (creates a new scope)
function unHoistedDemo(){
  // try call the function we'll declare lower in this scope
  unHoistedFunction(); // throws error

  // declare the function after we try to use it
  const unHoistedFunction = function(){
    console.log("I won't get run!");
  };
}

// call the demo function
unHoistedDemo();
```

When you try run the above snippet you’ll get a reference error because within the `function unHoistedDemo()` the variable `unHoistedFunction` will not contain a reference to the anonymous function until that line of code has executed. So, when we try to call the function `unHoistedFunction()` as the first line within the containing function, that variable doesn’t contain a reference to a function yet, so the attempt to call the function fails with a reference error.

### (Fat) Arrow Functions

ES6 introduced a new syntax for declaring functions that’s shorter to write, but mostly similar in effect to function expressions/literals. So-called [fat arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), or _arrow function expressions_ can be used anywhere a JavaScript value can be used. Note that like function expressions, **fat arrow functions are not hoisted**.

Ignoring the visual differences for now, the big differentiation between arrow functions and regular functions is that arrow functions do not get their own `this` variable, instead, they inherit their `this` from their containing scope. (More on the often confusing `this` keyword in the up-coming instalment on objects as prototype/class instances.)

With all that said, let’s look at the fat arrow syntax:

```JavaScript
(nameOfFirstArg, nameOfSecondArg)=>{
  // ...
}
```

As you can see, the syntax is very abbreviated, it’s simply an argument list within parentheses followed by the so-called _fat arrow_ construction (`=>`) followed by a code block containing the function body.

Let’s re-write our example `raiseTo()` function one more time:

```JavaScript
const raiseTo = (num, pow)=>{
  let ans = num;
  for(let i = 2; i <= pow; i++){
    ans *= num;
  }
  return ans;
};
```

### The Abbreviated Fat Arrow Syntax (New)

The fat arrow syntax is already quite concise, but in the special case where a function takes exactly one argument it can be condensed even more.

To illustrate this point let’s define another function, this time one that raises the number two to a give power. For simplicity we’re use our existing `raiseTo()` function to implement this new function’s functionality:

```JavaScript
// make sure you declare raiseTo() from above before trying to use this function!
const twoTo = (pow)=>{
  return raiseTo(2, pow);
};
```

Since this function takes exactly one argument we can omit the parentheses:

```JavaScript
const twoTo = pow => {
  return raiseTo(2, pow);
};
```

Because this is just a one-line function we can omit the semi-colon within the function body and collapse it all onto one line:

```JavaScript
const twoTo = pow => { return raiseTo(2, pow) };
```

Finally, and also because this is a one-line function, we can omit the `return` keyword and curly braces:

```JavaScript
const twoTo = pow => raiseTo(2, pow);
```

As you can see, in the very common special case where you need an anonymous function that takes one argument and can be expressed on a single line, the fat arrow syntax can be substantially abbreviated!

## Function Scope (Redux)

Every function defines its own scope, and, has access to variables in the scopes that are outside of it.

We can see this in action in the following example:

```JavaScript
// declare 3 variable in the global scope
var [a, b, c] = ['Global a', 'Global b', 'Global c'];

// define a global function
function scopeDemo(){
  // override two of the global variables in a function scope
  var [b, c] = ['scopeDemo b', 'scopeDemo c'];

  // define a nested function
  function nestedScopeDemo(){
    // override a global variable in a nested function scope
    var c = 'nestedScopeDemo c';

    // show the value of all three variables
    console.log(`a='${a}'`);
    console.log(`b='${b}'`);
    console.log(`c='${c}'`);
  }

  // call the nested function
  nestedScopeDemo();
}

// call the global function which calls the nested function
scopeDemo();
```

In this demo we create two functions, a global function named `scopeDemo()` which contains a nested function named `nestedScopeDemo()`. There are three variables declared in the global scope named `a`, `b` & `c`.

The global function does not declare its own `a`, so it sees the global `a`. It does declare its own `b` & `c` though, so within the global function the global `b` & `c` are not accessible and are replaced with the local `b` & `c` instead.

The nested function does not declare its own `a` or `b`, but it does declare its own `c`. That means that it has access to the global `a`, the `b` from the its containing function (the global function), and its own `c`.

## Advanced Arguments (Redux)

While most of the time simply naming our arguments is all we need to do, we can do a little more when needed.

### The `arguments` Variable & Processing Arbitrarily Many Arguments

Within every function JavaScript provides a special object named `arguments`. This is an array-like object with a `.length` property and numbered entries for each argument passed to a function (including un-named arguments). So, the first argument to a function will always be accessible as `arguments[0]`, the second as `arguments[1]`, and so on. Also, `arguments.length` will always contain the total number of arguments passed.

Note that this is an array-like object, not an array, but as of ES6 you can convert it to a true array with the `Array.from()` function mentioned in the previous instalment should you wish to.

This object can be used to write functions that accept arbitrarily many arguments. As an example, the function below will return the sum of all passed arguments:

```JavaScript
function sumAll(){
  let ans = 0;
  for(let i = 0; i < arguments.length; i++){
    ans += arguments[i];
  }
  return ans;
}
```

Notice that we did not name any of the arguments. We can see this function in action like so:

```JavaScript
sumAll(); // 0
sumAll(1, 2); // 3
sumAll(10, 20, 30); // 60
```

While the `arguments` object is not an array, it is array-like enough that it can be used within `for...of` loops, so since ES6 we can shorten the above example like so:

```JavaScript
function sumAll(){
  let ans = 0;
  for(num of arguments){
    ans += num;
  }
  return ans;
}
```

(Note that `arguments` is actually a so-called _itrerable_, which is why `for...of` works on `arguments` objects. We’ll be looking at iterables in the next instalment)

### Default Argument Values

Since ES6 JavaScript allows named arguments to have default values. The syntax simply uses the `=` operator within the argument list when defining the function to specify the default values.

For example, the following function will repeat a given string an arbitrary number of times, defaulting to two:

```JavaScript
function repeatString(str, num = 2){
  ans = '';
  for(let i = num; i > 0; i--){
    ans += str;
  }
  return ans;
}
```

If we call the function with just one argument the default value is used for the second argument, doubling the string:

```JavaScript
repeatString('boogers'); // boogersboogers
```

But if we call the function with two arguments the specified value is used instead of the default:

```JavaScript
repeatString('boogers', 3); // boogersboogersboogers
```

### The Rest Operator

Since ES6 we can use the rest operator (`...`) to collect all arguments after a given point in the argument list into an array with a name of our choosing.

You can see this in action in the following example:

```JavaScript
// define the demo function
function restDemo(namedArg1, namedArg2, ...namedRest){
  console.log(`namedArg1='${namedArg1}'`);
  console.log(`namedArg2='${namedArg2}'`);
  console.log(`namedRest contains ${namedRest.length} values(s):`);
  for(const restVal of namedRest){
    console.log(`* '${restVal}'`);
  }
}

// call the demo function with 4 arguments
restDemo('boogers', 'snot', 'goop', 'nose jelly');
```

## The `Function` Prototype/Class (New)

As mentioned before, every JavaScript function is an instance of the built-in prototype/class `Function`. This prototype doesn’t provide any properties or functions that you’re likely to use regularly. These function and properties are very powerful, but only useful for some advanced techniques. Many JavaScript programmers will simply never use them! Having said that, I think it’s worth knowing what’s possible so you know what’s possible, even if I’ll leave it entirely to you to go read the fine manual should the need arise 🙂 To that end, [here’s the link to MDN’s page detailing the `Function` prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).

When it comes to properties there are just two I’ll mention. Firstly, every function has a `.length` property which contains the number of named arguments in the function’s definition. Secondly, functions have a `.name` property which contains their name as a string, unless they’re anonymous that is.

When it comes to functions provided by the `Function` prototype there are a few I think its worth being aware of.

Firstly, the `Function` prototype defines a pair of functions (`.apply()` & `.call()`) which allow a specific function to be called with a specified value for the special `this` variable. It’s this functionality that enables third-party APIs like jQuery to ensure that the value of `this` is a reference to the appropriate DOM object within its many callbacks and functions.

Secondly, the function `.bind()` can be used to programatically create shortcut functions. These are functions that call existing functions with hard-coded arguments. Again, this is the kind of thing API writers make use of more than regular developers.

Finally, you can get the code for any user-created (not built-in) JavaScript function as a string with `.toString()`. This might be useful when building error messages that relate to callbacks.

## Final Thoughts

Most of what we covered in this instalment was simply a redux of spread throughout previous instalments. ES6 introduced a whole new type of function to JavaScript, so-called _generator functions_, and we’ll introduce those for the first time in the next instalment. In order to understand generator functions we need to first understand another new ES6 feature — iterators. So, the next instalment will start by introducing iterators, and then move on to introduce generator functions.