---
title: Introducing JavaScript
instalment: 12
creators: [bart, allison]
date: 2016-04-01
opengraph:
  audio: http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_04_01.mp3
---

With this instalment we’re starting into a whole new phase of the series. We’ve looked at using HTML to define the structure of an HTML document. Then we moved on to looking at CSS for defining the look of an HTML document. Now we’re going to move on to JavaScript to add interactivity to HTML documents.

Learning the basics of JavaScript and learning how to connect JavaScript into the browser environment are two very different tasks. So we’re going to separate them. We’ll start by learning some JavaScript fundamentals in a JavaScript playground I’ve created. Only when we know enough JavaScript for the mechanics of the browser’s JavaScript integration to make sense will we move tackle the so-called DOM, and the browser event model.

## Matching Podcast Episode 432

Listen Along: Chit Chat Across the Pond Episode 432

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_04_01.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_04_01.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## A Little History and Context

[JavaScript](https://en.wikipedia.org/wiki/JavaScript) was developed by Netscape in the very early days of the web. The first version was released in 1995. While the name makes it sound like JavaScript is in some way related to Java, it isn’t. Java was a big buzzword in the 1990s. It seems the name JavaScript was just Netscape’s way of cashing in on some of the Java hype. JavaScript’s syntax is actually based on C rather than Java.

Originally, JavaScript was a by-the-book interpreted language. However, in their relentless drive for speed, browser authors have muddied the waters quite a bit. Modern browsers now use a technique known as [Just-in-time Compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation), or JIT, to convert JavaScript code into native byte code, like you’ll find in a regular compiled app. However, from the programmer’s point of view, JavaScript continues to behave like an interpreted language – we write it, and we run it – we never have to compile it.

JavaScript was born in the web browser, but it’s spread its wings over the last two decades. JavaScript is used as a scripting language in modern operating systems like OS X. It’s used as a scripting language within apps (e.g. TextExpander). It’s used to program web services (using [Node.js](https://en.wikipedia.org/wiki/Node.js)). And it can be used to develop mobile apps. While we still call it JavaScript, the language has been formalised as [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript). Browser vendors, and other users of JavaScript, use the ECMAScript specification as the standard for developing their products. The ECMAScript 6 specification was released last May, but most browsers don’t support it yet. They are still using ECMAScript 5, which is what we’ll be using in this series.

JavaScript is a language on the rise – now is a great time to learn it.

## Hello World in Our JavaScript Playground

So, we’re going to take our first steps into JavaScript in a little playground I’ve created. BTW, the playground is entirely written in HTML, CSS, and JavaScript. So when we’ve learned a little more JavaScript, you’ll be able to go back and look under the hood and understand exactly how it works. You can download the code for the playground [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/04/pbs-JavaScriptPlayground.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs-JavaScriptPlayground.zip). You can run the playground from your local server or you can use an online version at [www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground-v1](http://www.bartb.ie/pbsdemos/pbs-JavaScriptPlayground-v1/).

The playground has a text region for entering your code, some text boxes you can use to send inputs to your code, and a button to run your code. The code region uses the open source JavaScript library [CodeMirror](https://codemirror.net) to do syntax highlighting.

When you click the `Run` button, your code will execute. The output will appear in a new popup window (so allow popups from this page when your browser asks).

Let’s start in the traditional way – with a _Hello World_ program.

In our playground, and only in our playground, the function for writing a line of output is `pbs.say()`. So, in this case our code is very simple – we just want to output the string of text “Hello World!”, so we just need this one line of code:

```javascript
pbs.say("Hello World!");
```

(This code is pre-populated into the code region by default)

To run this simple little script click the `Run` button. A new window will pop up with one line of output – the string _Hello World!_.

## JavaScript Basics

JavaScript uses the `;` character to represent the end of a statement. The exact spacing of things does not matter, as long as there is at least one space character between things that need to be separated from each other. Single statements can be spread over multiple lines.

Multiple statements can be grouped together by enclosing them between `{` and `}` characters – these groupings are referred to as _code blocks_. These code blocks will become very important as we learn more. Wherever the JavaScript spec says you can use a statement, you can also use a code block. This will make more sense to you as we move through the series.

JavaScript supports two styles for code comments – so-called _single-line comments_, and _multi-line comments_ (which can be used on a single line, just to confuse you).

A single-line comment starts with the symbols `//`, everything on the line from those two slashes on is considered a comment.

A multi-line comment starts with the symbols `/*` and ends with the symbols `*/`. Those two sequences, and everything in between is interpreted as a comment. Comments of this kind can extend over multiple lines.

```javascript
pbs.say('boo!'); // this is a single-line comment at the end of a line

// this on the other hand is a single-line comment covering the entire line

pbs.say('who?'); /* this is a multi-line comment on a single line */

/*
This is a more normal use of the multi-line comment style.

Why? because it spreads over multiple lines of course!
*/
```

There are an infinity of possible coding and commenting styles. The only cardinal rule is consistency – whatever way you choose to lay out your code: be consistent!

<!-- vale Vale.Spelling = NO -->

We’ll talk more about code layout later in the series, when we’ve learned more about code blocks. For now I’ll just say that, while you are free to lay out your code however you wish, and while the most important rule is to be consistent, you should probably adopt one of the standard(ish) styles in common use. All my examples will use a variant of the so-called K&R style (named for the authors of the legendary book _The C Programming Language_, Kernighan and Ritchie). True K&R uses more spaces than I do. I hate horizontal scrolling, so I _cuddle_ my braces which is something K&R don’t do in their book.

<!-- vale Vale.Spelling = YES -->

There is no right answer, and all the popular styles have sound logic behind them. It’s all about which considerations you find most important, and what your brain finds the easiest to interpret. The goal is clarity: so if a style doesn’t look clear to you, don’t use it!

Even though there is no one right answer, that doesn’t stop programmers having religious wars over this stuff – put three programmers into a room, and you’ll get five opinions on the matter!

## JavaScript Variables

A variable is simply a named place to store a value. Because JavaScript is an untyped language, JavaScript variables don’t have a type associated with them – you can store any valid value in any variable. This is very different to how strongly-typed languages like C work. If you’re coming to JavaScript from a strongly-typed language, this will take some getting used to!

There are rules governing variable names in JavaScript, but they are complex and difficult to understand because they use obscure Unicode terminology. My advice is to stick to the following simplified rules:

1.  The first character must be a letter, a dollar symbol (`$`), or an underscore (`_`)
2.  The remainder of the name can contain those same symbols, as well as digits
3.  You can’t use reserved words as variable names – you can get a full list of reserved words [here](http://www.javascripter.net/faq/reserved.htm) (as well as a list of words you should avoid)

These rules will ensure that all your variable names are valid, though there are valid variable names that break these rules.

The JavaScript spec allows you to use a variable without declaring it, but never ever do this! **Always declare your variables** – it’s best practice, and it will save you from some very subtle and frustrating bugs!

To declare a variable, use the keyword `var`, followed by a space, followed by a valid name, optionally followed by an equals symbol, another space, and a value, and always terminated with a `;` character. For example:

```javascript
// a variable declaration without a value
var x;

// a variable declaration with a value
var y = 4;
```

You declare a variable once. Then you use it as often as you need (it’s actually a little more complicated than that, but we’ll ignore that complexity for now).

Variables can be used anywhere values can be used. The `pbs.say()` function prints a value,so, we can pass it a variable and it will print the value contained in that variable:

```javascript
var x = 100;
pbs.say(x);
```

Variables can hold either literal values, or references to objects. For now, we’re going to ignore object references and focus on literals.

Fundamentally, JavaScript variables can hold three types of literal data, described below. This might seem a little confusing; JavaScript is an untyped language, so how can it have types of literal?

For data to be stored, it must be encoded in some kind of reliable way. Different types of data need to be encoded differently. So, when you assign a literal value to a variable, JavaScript has to decide how to store it. JavaScript does so by encoding it as one of the three literal types – number, boolean, and string.

So, while a variable is not bound to a specific data type, under the hood, each piece of data is still represented as a specific type. Because JavaScript is untyped, the type conversions are automated, and any variable can store data of any type. The same variable could hold a number for a while, then a string, then a boolean, then another number, and so on.

### Numbers

All the following are valid numerical literal values in JavaScript:

```javascript
var a = 4;
var b = -42;
var c = 3.1415;
var d = -4.56;
var e = 0xff; // the hex value ff
var f = 2.41e4; // 2.41 x 10^4
var g = -2.3e-3; // -2.3 x 10^-3
```

### Booleans

There are just two boolean literal values:

```javascript
var x = true;
var y = false;
```

Notice that there are no quotation marks around the boolean literals.

### Strings

A string represents a series of zero or more characters of text. JavaScript allows strings to be wrapped in either double or single quotes. The two notations have no difference in meaning. The reason for the duplication is to minimise the need for escape sequences. If a string contains double quotes, but no single quotes, then you can enclose it in single quotes and avoid needing to escape the double quotes, and _vice versa_. Only when a string contains both kinds of quotes do you need to resort to escaping one of them.

In JavaScript, the escape character is the backslash (`\`). To include a backslash in a string you need to write it as `\\`. If you do need to escape a quotation mark of either kind, you do so by prefixing it with a backslash, so `\"`, or `\'`.

Two other escape characters you should know about are `\n` for the newline character, and `\t` for the tab character.

```javascript
var a = "a simple string";
var b = 'another simple string';
var c = 'so, she said "look how easy it is to avoid escaping things sometimes!"';
var d = 'he replied, "but it\'s not always that simple!"';
var e = "line 1\nline 2\nline3";
```

## Operators

Operators apply an action to one or more values or variables. We’ve already met one operator so far today, `=`, which is the _assignment operator_. For reasons that will become clear later, you should get into the habit of mentally reading something like `x = 4` as _`x` is assigned the value of `4`_. Do not under any circumstances get into the dangerously bad habit of mentally reading that line as _`x` equals `4`_.

In this instalment we’re just going to look at one string operator, and the numeric operators.

### Concatenating Strings

Combining two strings together to form a longer string is referred to as _string concatenation_ in computer science. In JavaScript, the operator for concatenating strings is the plus symbol (`+`).

You can use it to concatenate literal strings, or strings stored in variables, e.g.

```javascript
pbs.say("You've gotta have a bowl" + " of coco pops");

var vessel = 'bowl';
var food = 'coco pops';
pbs.say("You've gotta have a " + vessel + " of " + food);

vessel = 'cup';
food = 'coffee';
pbs.say("You've gotta have a " + vessel + " of " + food);
```

### Arithmetic Operators

Most operators in JavaScript work on two values, and the operator goes between the values being operated on. However, there are some exceptions: one we’ll meet in the future commonly known as _the ternary operator_, which uses three values, and the two unary operators we’re about to look at here. Unary operators work on just one input.

The `++` operator adds one to the value it is applied to. In other words, the value is incremented. And similarly, the `--` operator subtracts one from the value it is applied to. The value is decremented.

```javascript
var x = 4;
pbs.say(x);
x++;
pbs.say(x);
```

The other arithmetic operators behave like you would probably expect:

<dl>
<dt><code>+</code></dt>

<dd>addition</dd>

<dt><code>-</code></dt>

<dd>subtraction</dd>

<dt><code>*</code></dt>

<dd>multiplication</dd>

<dt><code>/</code></dt>

<dd>division</dd>

<dt><code>%</code></dt>

<dd>modulus (remainder after integer division)</dd>

<dt><code>**</code></dt>

<dd>raise to the power of</dd>
</dl>

Operators are applied in a given order, their order of _precedence_. For the arithmetic operators, that order is the same as you learned in maths class back in your school days – multiply and divide before you add and subtract. Just like in mathematics, you can ensure the order of precedence you want by using round brackets.

Very sensibly, the assignment operator has the lowest precedence. All the operations are completed before the value is assigned to the variable.

One confusing point is that the increment and decrement operators have a higher precedence than the multiplication and division operators.

### Assignment Operators (Convenient Shortcuts)

We’ve already met the basic assignment operator, `=`, but it’s not the only one.

The following assignment operators also exist, and you can think of them as shortcuts, as shown below:

*   `x += y;` is equivalent to `x = x + y;` (works for both addition and concatenation)
*   `x -= y;` is equivalent to `x = x - y;`
*   `x *= y;` is equivalent to `x = x * y;`
*   `x /= y;` is equivalent to `x = x / y;`
*   `x %= y;` is equivalent to `x = x % y;`
*   `x **= y;` is equivalent to `x = x ** y;`

### Concatenation or Addition?

So, the `+` symbol is used for both string concatenation and addition. How do you know which one will happen? If there is a string on either side of the plus, concatenation will happen.

This behaviour is quite logical, and most of the time, you get the behaviour you want and expect, but there are some subtleties, as illustrated in the examples below;

```javascript
pbs.say(1 + 2);
var x = 4;
var y = 5;
pbs.say(x + y);
var z = '$';
pbs.say("the price was $" + x);
pbs.say(4 + '5');
pbs.say('4' + '5');
pbs.say(true + false);
pbs.say(true + 4);
pbs.say(false + 4);
var a = true;
pbs.say("a is " + a);
```

Notice that the boolean literals are treated as numbers, with `false` being treated as 0, and `true` as `1`.

### Forcing the Types

When you try concatenate a number to a string, what is happening under the hood is that JavaScript converts the number to a string automatically, and then concatenates the strings.

A lot of the time it’s perfectly fine to allow JavaScript do the conversions for you – it usually gets it right, and does what make sense. Usually, but not always!

You can force an explicit conversion from one type to another using a number of standard functions:

<dl>
<dt><code>String()</code></dt>

<dd>Converts a value to a string – useful if you want to concatenate numbers instead of adding them.</dd>

<dt><code>parseInt()</code></dt>

<dd>Converts a value to a whole number (i.e. an integer).</dd>

<dt><code>parseFloat()</code></dt>

<dd>Converts a value to a decimal (AKA floating point) number.</dd>

<dt><code>Boolean()</code></dt>

<dd>Converts a value to a boolean value (<code>true</code> or <code>false</code>)</dd>

</dl>

A lot of the time these conversions have a sensible outcome – it makes sense to convert the string `"34"` to the number `34`, and the number `3.1415` to the integer `3`. When a conversion to a number does not make sense though, JavaScript returns a very special value, `NaN`, which stands for _not a number_ (though under the hood, `NaN` is considered a number, go figure!). `NaN` is also used to represent infinity. So when you divide by zero, you get `NaN`. When you apply any arithmetic operator to `NaN`, the result is `NaN`, so `NaN + 4` is `NaN`.

You’ll also get `NaN` at times you might hope not to. Sadly, `parseInt('four')` gives you `NaN`. Also, `parseInt('$4')` gives you `NaN`, but, `parseInt('4 things')` gives you `4`.

Every value collapses into either `true` or `false` when needed. Anything can be turned to a string, even if it isn’t always a very meaningful string. The rules for collapsing down to boolean values are a little complex, so we’ll leave them be until the next instalment.

```javascript
var x = 4;
var y = 2;
pbs.say(x + y); // default behaviour
pbs.say(String(x) + String(y)); // force concatenation
var a = '4';
var b = '2';
pbs.say(a + b); // default behaviour
pbs.say(parseInt(a) + parseInt(b)); // force addition
```

### Undefinedness

JavaScript has a special literal value for representing true nothingness – `undefined`. When a variable has no value, it is said to be undefined. So, if you try use a variable x before you declare it and give it a value, it will evaluate to `undefined`.

You can also explicitly set a variable to be `undefined` using the assignment operator.

```javascript
pbs.say(a);
var a = 42;
pbs.say(a);
a = undefined;
pbs.say(a);
```

## Conclusions

So far we’ve learned how to store values in variables, and, how to manipulate values with string and arithmetic operators. Variables and operators are core concepts in all programming languages. The exact syntax will vary from language to language, but the concept is universal.

Another one of these universal concepts is decision making or branching, and that’s what we’ll be looking at in the next instalment. We’ll be learning about comparison operators, boolean operators, and finally, `if` statements.

 - [← PBS 11 — Tables](pbs11)
 - [Index](index)
 - [PBS 13 — JS Conditionals →](pbs13)