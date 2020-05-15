# PBS 13 of X – JS Conditionals

In [the previous instalment](https://www.bartbusschots.ie/s/2016/04/01/programming-by-stealth-12-of-x-javascript-intro/) we got our first taste of JavaScript. We learned about variables, literal data types, and some basic string and arithmetic operators. In this instalment we’re going to focus on booleans. We’ll look at how non-boolean values get converted to booleans when needed (e.g. is `'boogers'` `true` or `false`?), we’ll learn about some comparison operators that result in boolean values, and we’ll learn about some logical operators. At that stage we’ll have all the knowledge we need to learn about our third fundamental programming concept – branching.

# Matching Podcast Episode 434

Listen Along: Chit Chat Across the Pond Episode 434

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_04_12.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_04_12.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Our New Playground

Like with the previous instalment, we’ll be working in our JavaScript playground. However, since the last instalment, the playground has gotten a bit of an upgrade. No more popup windows, so it now works on tablet devices as well as traditional computers.

The basic operation remains the same, but now when you click `Run` the output will appear at the bottom of the page instead of in a new window.

You can download this code for this updated playground [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/04/pbs-JavaScriptPlayground-v2.1.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs-JavaScriptPlayground-v2.1.zip), or, you can use the online version at [www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground/](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/).

## Boolean Conversions

When needed, JavaScript can convert any value to a boolean, i.e. to `true` or `false`. It’s important to understand the _truthiness_ of values.

All numbers, with the exception of zero and `NaN`, evaluate to `true`, including the negative numbers.

All strings with the exception of the empty string evaluate to `true`.

The special values `undefined` and `null` evaluate to `false`. (`null` is a literal value that can be used when you want a variable to be defined, but not hold a real value).

As you can see, the vast majority of values convert to `true`, so my advice is to try remember that the following convert to `false`: `undefined`, `null`, `0`, `NaN`, and `''` (the empty string).

A little gotcha here is that the string `'false'` evaluates to `true`!

```javascript
pbs.say("0 is\t\t\t" + Boolean(0));
pbs.say("1 is\t\t\t" + Boolean(1));
pbs.say("-2.6 is\t\t\t" + Boolean(-2.6));
pbs.say("3.1416 is\t\t" + Boolean(3.1416));
pbs.say("NaN is\t\t\t" + Boolean(NaN));
pbs.say("null is\t\t\t" + Boolean(null));
pbs.say("undefined is\t\t" + Boolean(undefined));
pbs.say("'' (empty string) is\t" + Boolean(''));
pbs.say("'true' is\t\t" + Boolean('true'));
pbs.say("'false' is\t\t" + Boolean('false'));
pbs.say("'boogers' is\t\t" + Boolean('boogers'));
pbs.say("' ' (space) is\t\t" + Boolean(' '));
```

## Comparison Operators

JavaScript supports a number of operators for comparing values. What all these operators have in common is that they evaluate to a boolean value – a comparison is either `true`, or `false`.

### Equality

Let’s start with equality, which is not as simple as you might think.

The `===` operator checks for exact equality. It’s very strict – `true` is only returned if the two values are identical – same type and all. This is why I suggest you get into the habit of referring to this operator as _is exactly equal to_. This strict equality check has some implications that you may find counter-intuitive:

```javascript
pbs.say("4 === 4 is\t\t" + (4 === 4));
pbs.say("'4' === '4' is\t\t" + ('4' === '4'));
pbs.say("'4' === 4 is\t\t" + ('4' === 4));
pbs.say("true === true is\t" + (true === true));
pbs.say("'true' === 'true' is\t" + ('true' === 'true'));
pbs.say("'true' === true is\t" + ('true' === true));
pbs.say("true === 1 is\t\t" + (true === 1));
pbs.say("NaN === NaN is\t\t" + (NaN === NaN));
```

Notice that `NaN` is not considered to be exactly equal to `NaN`.

In many situations, most in fact, this level of equality checking is simply too precise. In the general case, we probably do want the string `'4'` to be considered equal to the number `4`. This is where the `==` operator comes in.

`==` is a more liberal equality operator that does type conversions before comparing values. My advice is to think of this operator as _is effectively equal to_.

By default, the `==` operator works in numeric mode, converting the values to numbers as needed before doing the comparison. However, in the case where both values are strings, a string comparison is performed instead. This simple rule results in behaviour that is almost always sensible, as demonstrated by the example below:

```javascript
pbs.say("4 == 4 is\t\t" + (4 == 4));
pbs.say("'4' == '4' is\t\t" + ('4' == '4'));
pbs.say("'4' == 4 is\t\t" + ('4' == 4));
pbs.say("true == true is\t\t" + (true == true));
pbs.say("'true' == 'true' is\t" + ('true' == 'true'));
pbs.say("'true' == true is\t" + ('true' == true));
pbs.say("true == 1 is\t\t" + (true == 1));
pbs.say("NaN == NaN is\t\t" + (NaN == NaN));
```

However, all is not perfectly logical – again, notice that `NaN` is not considered to be effectively equal to `NaN`.

The other outlier in the example above is `'true' == true`. The value on both sides is not a string, so, the operator works numerically – `true` is converted to `1`, and `'true'` to `NaN`, hence, the result of the comparison is `false`.

I’m repeating myself here, but I think it’s important to hammer home the importance of keeping `=`, `==`, and `===` straight in your head. To that end, I strongly suggest you develop the habit of mentally reading these three operators as follows:

`=`

_is assigned the value of_

`==`

_is effectively equal to_

`===`

_is exactly equal to_

### Comparisons

As well as checking for equality as described above, JavaScript also supports the following comparison operators:

`<`

_is less than_

`>`

_is greater than_

`<=`

_is less than or equal to_

`>=`

_is greater than or equal to_

Just like `==`, these operators work in one of two modes – _numerically_, or, _lexically_ (alphabetic comparisons).

The default behaviour is to convert the values on both sides of the operator to numbers, and compare them mathematically. Any comparison to `NaN` evaluates to `false`.

Only when **both** of the values are strings do the operators switch to lexical mode – that is to say, comparing the values alphabetically. One string is less than another if it would appear in the dictionary before the other.

```javascript
pbs.say("2 < 4 is\t\t" + (2 < 4));
pbs.say("'2' < 4 is\t\t" + ('2' < 4));
pbs.say("4 < 4 is\t\t" + (4 < 4));
pbs.say("'boogers' < 'nose' is\t" + ('boogers' < 'nose'));
pbs.say("'boogers' > 'nose' is\t" + ('boogers' > 'nose'));
pbs.say("'boogers' < 4 is\t" + ('boogers' < 4));
pbs.say("'boogers' > 4 is\t" + ('boogers' > 4));
pbs.say("'12' < '4' is\t\t" + ('12' < '4'));
pbs.say("2 <= 4 is\t\t" + (2 <= 4));
pbs.say("'2' <= 4 is\t\t" + ('2' <= 4));
pbs.say("4 <= 4 is\t\t" + (4 <= 4));
pbs.say("NaN < NaN is\t\t" + (NaN < NaN));
pbs.say("NaN > NaN is\t\t" + (NaN > NaN));
pbs.say("NaN <= NaN is\t\t" + (NaN <= NaN));
pbs.say("NaN >= NaN is\t\t" + (NaN >= NaN));
```

## Logical Operators

The logical operators work on booleans, so all values they operate on get converted to booleans before the operator is applied, and, the outcome is always a boolean. There are just three logical operators:

`&&`

A logical AND – only evaluates to `true` when both values are `true`

`||`

A logical OR – evaluates to `true` when one or both values are `true`

`!`

A logical NOT – this is a unary operator that inverts the value it’s applied to – it should be placed in front of the value to be inverted

In terms of precedence, `!` has the highest precedence, then `&&`, and finally `||`.

```javascript
pbs.say('false && false is\t' + (false && false));
pbs.say('false && true is\t' + (false && true));
pbs.say('true && false is\t' + (true && false));
pbs.say('true && true is\t\t' + (true && true));
pbs.say('');
pbs.say('false || false is\t' + (false || false));
pbs.say('false || true is\t' + (false || true));
pbs.say('true || false is\t' + (true || false));
pbs.say('true || true is\t\t' + (true || true));
pbs.say('');
pbs.say('!false is\t\t' + (!false));
pbs.say('!true is\t\t' + (!true));
```

## Playground Inputs

Before we look at branching, let’s look at how to read values out of the input fields in our playground.

You can read the value from the first input with `pbs.input(1)`, the second with `pbs.input(2)`, and the third with `pbs.input(3)`.

Because of how HTML text fields work, the value returned by `pbs.input()` is always a string. This means that you need to explicitly convert to a number before doing arithmetic, or making numeric comparisons.

```javascript
pbs.say(parseInt(pbs.input(1)) + parseInt(pbs.input(2)));
```

## Branching – the `if` Statement

Up until now all our mini examples have just been a series of statements that get executed one after the other in the order they appear in the script. Every line always gets executed. The path through the code is always the same.

Branching is the act of altering the path through code depending on some condition. If this condition is met, do this, otherwise, do that.

JavaScript implements this concept with the `if` statement. An `if` statement takes the following form:

```javascript
if(condition) statement_1; else statement_2;
```

If the `condition` evaluates to `true`, then `statement_1` will execute, otherwise, `statement_2` will execute. The `else` part is optional. If you omit it, and the `condition` evaluates to `false`, `statement_1` is simply skipped.

The following two coding styles are entirely in keeping with the spec:

```javascript
if(parseInt(pbs.input(1)) % 2 == 0) pbs.say('EVEN');
else pbs.say('ODD');
```

```javascript
if(parseInt(pbs.input(1)) % 2 == 0)
  pbs.say('EVEN');
else
  pbs.say('ODD');
```

You **can** write code like this, but **please don’t**! Develop the good habit now of always using code blocks in `if` statements. That is to say, wrap the statement(s) in curly braces. This will allow you to execute multiple statements on `true` or `false` evaluation instead of just one, and it will protect you from a whole class of subtle but very dangerous bugs creeping into you code. Had Apple’s developers followed this simply piece of advice, the famous [GO TO FAIL bug](https://nakedsecurity.sophos.com/2014/02/24/anatomy-of-a-goto-fail-apples-ssl-bug-explained-plus-an-unofficial-patch/) would never have happened!

This is how you should write your `if` statements, even when you only want to execute one statement on `true` and/or `false` evaluation of the condition:

```javascript
if(parseInt(pbs.input(1)) % 2 == 0){
  pbs.say('EVEN');
}else{
  pbs.say('ODD');
}
```

This is also a good time to mention code layout again. It’s universally agreed that code blocks should be indented, so that you can easily see where the `if` and `else` parts begin and end. What’s nowhere near universally agreed on is where the curly braces should go. What you see above is my preferred style – a variant of the [K&R style](https://en.wikipedia.org/wiki/Indent_style#K.26R_style).

Some people prefer to have the braces on new lines, the so-called _[Allman style](https://en.wikipedia.org/wiki/Indent_style#Allman_style)_ (AKA _BSD style_), like so:

```javascript
if(parseInt(pbs.input(1)) % 2 == 0)
{
  pbs.say('EVEN');
}
else
{
  pbs.say('ODD');
}
```

There are also more or less _cuddled_ variants to all these styles, that is to say, more or less optional white space included. The canonical K&R style is less cuddled than what I use (has more white space):

```javascript
if ( parseInt( pbs.input( 1 ) ) % 2 == 0 ) {
  pbs.say( 'EVEN' );
} else {
  pbs.say( 'ODD' );
}
```

There is no right answer – pick one, and be consistent!

All examples in this series will use the style I prefer – a cuddled variant of K&R.

## Checking for `NaN`

We have one more new thing to learn before we can move on to our final example for this instalment. We need to learn about the built-in JavaScript function for checking if a value is not a number. The function is very well named – `isNaN()`. It behaves pretty much as you would expect:

```javascript
pbs.say("isNaN(4) returns " + isNaN(4));
pbs.say("isNaN(3.14159) returns " + isNaN(3.14159));
pbs.say("isNaN(-2.6) returns " + isNaN(-2.6));
pbs.say("isNaN(-2.6e3) returns " + isNaN(-2.6e3));
pbs.say("isNaN('6') returns " + isNaN('6'));
pbs.say("isNaN('boogers') returns " + isNaN('boogers'));
pbs.say("isNaN(true) returns " + isNaN(true));
pbs.say("isNaN(NaN) returns " + isNaN(NaN));
```

## Worked Example

As a final example to tie everything together, let’s write a more robust odd/even checker than the one in the examples above.

We’ll need to take our input from the first input text box, make sure it’s a number, and then check whether it’s odd or even.

```javascript
// get the input and convert to an integer
var rawInput = pbs.input(1);
var inputNum = parseInt(rawInput);

// validate the input and proceed accordingly
if(isNaN(inputNum)){
  // not a number, so print an error
  pbs.say("'" + rawInput + "' is not a number, so it's neither ODD nor EVEN");
}else{
  // the input is a number, so test for eveness
  var ans = inputNum + ' is ';
  if(inputNum % 2 == 0){
    ans += 'EVEN';
  }else{
    ans += 'ODD';
  }

  // print the answer
  pbs.say(ans);
}
```

## Conclusions

We have now learned about three core concepts all programming languages share – variables, operators, and branching. In the next instalment we’ll learn about two more core concepts – arrays, and loops. This will give us the ability to store lists of values, and to processes them.
