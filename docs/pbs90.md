# PBS 90 of X — JavaScript Wrapper Objects

In this instalment we return to our on-going mini-series looking at each of the proverbial hats JavaScript objects wear. We've seen [objects used as dictionaries](https://bartificer.net/pbs84), [as arrays](https://bartificer.net/pbs85), [as functions](https://bartificer.net/pbs86), [as iterators and generators](https://bartificer.net/pbs87), and [as DOM and jQuery objects](https://bartificer.net/pbs88).

In this instalment we'll see how JavaScript uses a technique known as *automatic boxing* (AKA *auto-boxing*, *automatic wrapping* & *auto-wrapping*) to automatically temporarily convert primitive values into objects when needed. We'll also see how auto-boxing was extended in ES 6 to make it easier to work with string literals.

## Matching Podcast Episode TO DO

Listen along to this instalment on [episode TO DO of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/TO DO/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_TO_DO.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_TO_DO.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Primitives & Objects

Before we look at boxing/wrapping let's remind ourselves of the differences between primitives and objects in JavaScript.

At the most fundamental level JavaScript objects can only store two things — primitive values, and references to objects.

We've expressly described the three most common primitive types as primitives throughout our exploration of JavaScript — booleans, numbers, & strings. We've also met two additional special primitive values without describing them as such — `undefined` & `null`.

I should mention that `null` is a very strange beast indeed — it's a primitive value that represents the absence of an object, and as such, the `typeof` operator returns `'object'` for `null`, even though it's a primitive.

For completeness I'll mention that there are two more lesser-used primitive types in JavaScript which we have been ignoring in this series (big int & symbol), and we're going to continue to ignore them, at least for now 🙂

So, when we assign a variable equal to a primitive value, the actual value gets copied into the variable. However, **when you assign a variable equal to an object, what gets stored in the variable is a reference to the object, not the object itself**.

This one level of indirection has two very significant implications.

### Primitives Copy on Assignment, Objects Don't

Consider this simple code code snippet:

```js
let x = 4; // a primitive value
let y = x;
x += 2;
console.log(`x=${x} & y=${y}`);
```

As you probably expect, the string that gets logged is `x=6 & y=4`.

When `y` was assigned to be equal to `x` it received a copy of the then current value of `x`, the primitive value `4`. When `x` was altered to point to a different primitive value, `6`, `y`'s copy was unaffected.

Now consider this similar snippet:

```js
let x = [1, 2]; // an array object
let y = x;
x.push(3);
console.log(`x=[${x.join()}] & y=[${y.join()}]`);
```

This snippet logs `x=[1,2,3] & y=[1,2,3]`. This time, altering `x` did alter `y` through some kind of *spooky action at a distance*, why? Since JavaScript variables store reference to objects rather than the objects themselves, what was copied to `y` was not an array, but a reference to an array. The end result of the assignment is not two arrays, but a single array with two names!

### Primitives are *Passed by Value*, Objects are *Passed by Reference*

Like with the assignment operator, passing a variable as an argument to a. function results in its value being copied.

Consider the following simple snippet:

```js
function doubler(val){
	val += val;
	return val;
}
let x = 4;
let y = doubler(x);
console.log(`x=${x} & y=${y}`);
```

The output produced is `x=4 & y=8`.

When `x` is passed to the `doubler()` function its value gets copied into `val`. In this case that means `val` gets a copy of the primitive value `4`. The value of `val` is then altered to generate the function's output, but that alteration has no effect on the primitive value stored in `x`.

Now consider the following similar snippet:

```js
function arrayDoubler(arr){
	arr.push(...arr);
	return arr;
}
let x = [1, 2];
let y = arrayDoubler(x);
console.log(`x=[${x.join()}] & y=[${y.join()}]`);
// outputs: x=[1, 2, 1, 2] & y=[1, 2, 1, 2]
``` 

This snippet outputs `x=[1,2,1,2] & y=[1,2,1,2]`.

Because `x` contained a reference to an array object, when its was passed as an argument to the `arrayDoubler()` function its values was copied, that means `arr` received a copy of the reference to the array, so `x` and `arr` become **two difference names for the same array**. This is why the line `arr.push(...arr)` within the function results in more *spooky action at a distance*.

Regardless of the programming language, we refer to the behaviour JavaScript displays with primitive values as *passing by value*, and the behaviour JavaScript displays with object references as *passing by reference*.

### Objects can have Properties, Primitives Can't

The following snippet compiles and runs just fine:

```js
console.log([1, 2].toString());
```
But the following generates an error:

```js
console.log(42.toString());
```
Why? Because all objects have a property named `toString` that is a reference to a function (they get this from JavaScript's built-in `Object` prototype). Literals on the other hand can't have properties, so `42.toString()` is nonsense.

We can also add any property we like to an object and retrieve its value later:

```js
let x = [1, 2];
x.adams = 42;
console.log(`x=[${x.join()}] & x.adams=${x.adams}`);
```

This outputs `x=[1,2] & x.adams=42`, proving that the arbitrarily named property was indeed added to the array object referenced by `x`.

### Variables Containing Primitives do Something Odd

So, variables store primitive values or references to objects, and primitive values can't have properties, so logically, the following snippet should not work, right?

```js
let x = 4; // a primitive value
console.log(x.toString()); // property access on a primitive
```

When you execute the snippet you see that not only does it not throw an error, but instead, it simply outputted `4`. How is that possible?

The answer is that **JavaScript automatically boxed the primitive value**!

## Automatic Boxing/Wrapping

When you explicitly try to access a variable containing a primitive value in a *objecty* way, JavaScript steps in and silently converts the primitive value into a temporary object that represents the same value, but never gets stored. This automatic conversion of primitives to objects representing the same value is referred to as *boxing* or *wrapping*.

### The Primitive Wrapper Classes

To facilitate boxing, JavaScript has built in classes for most of the primitive data types (the exceptions being `undefined` & `null`). Boolean primitives are represented by instances of the `Boolean` class, numbers by instances of the `Number` class, and strings by instances of the `String` class.

### How Auto-Boxing Works

So, when we do something like:

```
let x=4;
let y = x.toString();
```

What is really happening?

The dot operator on the second line is an attempt to read a property named `toString` from `x`, so `x` is being using in an explicitly *objecty* way, so JavaScript steps in and boxes the variable. In effect, the second line is silently transformed into:

```js
let y = (new Number(x)).toString();
```

It's important to remember that the **objects created by auto-boxing are temporary**.

Consider the following snippet:

```js
let x = 4;
x.adams = 42; // no error because of auto-boxing
console.log(`x=${x} & x.adams=${x.adams}`);
```

This produces the output `x=4 & x.adams=undefined`. So, auto-boxing prevented an error by creating a temporary object, but that object was not retained!

This is effectively what happened:

```js
let x = 4;
(new Number(x)).adams = 42;
console.log(`x=${x} & x.adams=${(new Number(x)).adams}`);
```

So, one temporary object was created on the second line, a property named `adam` was added to that object, and then that object disappeared. On the next time another entirely new object was created, and when asked for its `adam` property there was none set, hence the `undefined` in the output.

## The `Boolean` Class

This class provides literally nothing of interest — no properties worth mentioning, no static functions worth mentioning, and not instance functions worth mentioning!

## The `Number` Class

While this class it not much more interesting than the `Boolean` class it does provide a few static properties and function worth mentioning.

For example, the smallest and largest integers JavaScript numbers can represent are `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`, and the largest floating point number that can be represented is `Number.MAX_VALUE`. There is also `Number.MIN_VALUE`, but it isn't quite what you probably expect — it's the smallest positive non-zero floating point number JavaScript can represent. I.e. the smallest step above zero JavaScript can represent.

The class also provides static properties representing special numbers, specifically `Number.NaN` for non-numbers, and `Number.POSITIVE_INFINITY` & `Number.NEGATIVE_INFINITY`.

The class also provides four useful static testing functions:

| Static Function | Description |
| :---: | :--- |
| `Number.isNaN()` | Test if a given value is the special number representing non-numbers (*is not-a-number*). |
| `Number.isFinite()` | Is the number anything but infinity or `NaN`? |
| `Number.isInteger()` | Is a given value an integer? |
| `Number.isSafeInteger()` | Is the number an integer within the range `Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER` |

## The `String` Class

Of the three wrapper classes we'll be looking at, `String` is by far the one with the most useful functions. In fact, we have already used many of these functions throughout this series.

Rather than posting an exhaustive list here I'll link to [the relevant section of the MDN's excellent JavaScript documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_instances). We will look at a few of the highlights though.

The only instance property provided by the class is `.length`, and there are no static properties at all.

There are no static functions of note, but many very useful instance functions, including the list below.

| Function | Description |
| :---: | :--- |
| `.match()` | Test a string against a regular expression. |
| `.replace()` | Replace all instances of a pattern within a string with a replacement string. |
| `.split()` | Split a string into an array based on a delimiter of some kind. |
| `.toLowerCase()` | Return a new string with all letters converted to lower case. |
| `.toUpperCase()` | Return a new string with all letters converted to upper case. |
| `.trim()` | Return a new string with all trailing and leading white space removed. |

## Auto-boxing of String Literals

One of the many useful improvements brought by ES6 is the introduction of auto-boxing for string literals. Even in ES6 the two boolean literals `true` and `false` are not auto-boxed, and neither are numbers, but string literals are. This allows us to take very useful shortcuts like:

```js
const words = "some words in a sentence".split(' ');
```

## Final Thoughts

We've now covered the majority of hats JavaScript objects wear. There are just two left to cover, regular expressions and classes/prototypes.