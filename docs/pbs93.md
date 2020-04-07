# PBS 93 of X — Encapsulation with JavaScript Objects

Since [instalment 84](https://bartificer.net/pbs84) we've been slowly making our way through all the different proverbial *hats* JavaScript objects wear. We started by reminding ourselves how JavaScript uses [objects as hashtables/dictionaries](https://bartificer.net/pbs84), then we looked at how [JavaScript uses objects to implement arrays](https://bartificer.net/pbs85). In [instalment 86](https://bartificer.net/pbs86) we looked at how [JavaScript functions are actually objects](https://bartificer.net/pbs86), and in [instalment 87](https://bartificer.net/pbs87) we we learned about Iterators, a new type of object added to JavaScript in ES6, and Generators, a related new type of function. In [Instalment 88](https://bartificer.net/pbs88) we reminded ourselves of how our browsers use objects to represent the structure of web pages using the DOM, and how jQuery objects give us a more developer-friendly way of interacting with the DOM. Next we learned about how [JavaScript provides wrapper-objects for the native types](https://bartificer.net/pbs90) (Boolean, String & Number), and finally, we learned about how [JavaScript uses objects to implement Regular Expressions](https://bartificer.net/pbs91).

This leaves just one proverbial *hat* to explore — JavaScript's rather unique use of objects to support object oriented programming. Because this is both an important and a somewhat complex topic, we're going to split it into two parts. In this instalment we'll focus on a core principle that forms the foundation of object oriented programming — *encapsulation*.

## Instalment Resources

This instalment uses 8 example files:

* [Download ZIP File](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentZips/pbs93.zip)
* [View source code online at GitHub](https://github.com/bartificer/programming-by-stealth/tree/master/instalmentResources/pbs93)
* View the four HTML files in your browser:
	* [`pbs93a.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93a.html)
	* [`pbs93b.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93b.html)
	* [`pbs93c.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93c.html)
	* [`pbs93d.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93d.html)

## Matching Podcast Episode

Listen along to this instalment on [episode 632 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2020/04/ccatp-632/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_04_04.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_04_04.mp3" >Download the MP3</a>

## The Problem Encapsulation Solves

At its most fundamental level, programming is about representing information and transforming it. The various types of variables allow us to store information, and functions allow us to transform or process that information.

In a simplistic script you might only be dealing with a single collection of related variables and functions that together represent a single concept. IT doesn't take long until that ceases to be true though. You very quickly find that your web apps have to represent multiple concepts, so you end with a handful of variables and functions that handle one concept, then another handful of variables and functions that deal with something else. The individual variables and functions that deal with any single concept are not related in any way. Looking at your code you just see a mix of variables and functions, and it gets very confusing very quickly. Sure, diligently following naming schemes and commenting your code can help add some order to the chaos, but surely, there must be a better way?

## The Concept of Encapsulation

[Encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) is one of those core concepts of computer science that span languages. If a language supports object orientation, then it must implement encapsulation in some way.

All encapsulation must allow related variables and functions to be combined into a single entity that can represent both information, and the functions for processing or transforming that information.

Many programming languages go a step further, and include access control in their implementation of encapsulation. The idea being that some information can be labeled as purely internal or private, and that no functions outside the encapsulation can access such information.

Dictionaries are commonly used for encapsulation, especially in languages where functions, or references to functions, can be stored as the values within dictionaries.

## Encapsulation in JavaScript

Because JavaScript functions are objects, and hence, references to them can be stored in variables, we can implement basic encapsulation in JavaScript using objects with their dictionary hat on.

We can **store both information and references to functions as key/values pairs within JavaScript objects**.

Note that I described JavaScript's implementation of encapsulation as *basic* in this section's opening sentence. There's a good reason for that — **JavaScript's implementation of encapsulation does not provide any form of access control**. We won't encounter an implementation of that concept until we move on to PHP in future instalments.

> JavaScript's lack of support for encapsulation access control is one of the reasons C++ and Java programmers tend to look down on JavaScript and often refer to it pejoratively as a *toy language* or *just a scripting language*. When you come from a world where you can use keywords like `private` and `protected` to block access to internal variables, the idea that any script using your code can reach in and mess with any of your variables behind your back is horrifying — how can you write robust code if the developers using your API can tinker with all your variables behind your back?
> 
> Since Java was my first language, and hence, my introduction to encapsulation and object orientation focused heavily on access control, I too looked down my nose at JavaScript for a long time. I'm well and truly over my dumb prejudice now, but it took years, so I empathise with those who haven't yet seen the light 😉
{: .aside}

## A Simplistic Worked Example — The Hoonyaker

> When recording reviews for the [NosillaCast](https://www.podfeet.com/blog/category/nosillacast/), listener Kaylee likes to use a currency she invented and named the Hoonyaker that just happens to be worth about one US dollar.
{: .aside}

To understand encapsulation we'll start with a completely unencapsulated collection of a data and related functions. We'll then encapsulate just the data, and finally, the data and the functions.

### The Unencapsulated Hoonyaker

Our starting point will be a collection of variables that describe the fictitious Hoonyaker currency and a collection of functions for interacting with this fictitious currency.

You'll find the code for this naive representation of the Hoonyaker in `hoonyaker1.js`. You can interact with these variables and functions by opening `pbs93a.html` ([view](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93a.html)|[source](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentResources/pbs93/pbs93a.html)) in your favourite browser and using the JavaScript console. The examples below are intended to be executed there. Note that the page defines two global variables which contain reference to jQuery objects representing the two output areas on the page, `$OUT_TEXT` & `$OUT_HTML`, and that we'll use these variables to display the output from the various functions.

So, let's look at our starting point:

```js
//
// Define the data related to the Hoonyaker
//

const hoonyakerName = 'Hoonyaker';
const hoonyakerDescriptionHTML = 'a fictitious currency invented by podcast listener and <em>Nosillacastaway</em> Kaylee that happens to equal about one US Dollar';
const hoonyakerSymbol = '₪'; // think 'n' for NosillaCast (ignore that it's a Shekel)
const hoonyakerSymbolHTML = '<i class="fas fa-shekel-sign mx-1" title="₪" aria-hidden></i><span class="sr-only">₪</span>';
const hoonyakerNumDecimalPlaces = 3;

//
// Define the functions related to the Hoonyaker
//

/**
 * Generate a plain-text description of the Hoonyaker.
 * 
 * @return {string}
 */
function describeHoonyaker(){
	// use jQuery to convert HTML to text
	const plainTextDesc = $(`<p>${hoonyakerDescriptionHTML}</p>`).text();
	return `The ${hoonyakerName} is ${plainTextDesc}. Its symbol is ${hoonyakerSymbol}, and it has ${hoonyakerNumDecimalPlaces} decimal places.`;
}

/**
 * Generate an HTML description of the Hoonyaker.
 * 
 * @return {string}
 */
function describeHoonyakerHTML(){
	return `<p>The ${hoonyakerName} is ${hoonyakerDescriptionHTML}. Its symbol is ${hoonyakerSymbolHTML}, and it has ${hoonyakerNumDecimalPlaces} decimal places.</p>`
}

/**
 * Render an amount in Hoonyakers as plain text.
 * 
 * @param {number} amount
 * @return {string}
 */
function asHoonyakers(amount){
	// format the number
	const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(hoonyakerNumDecimalPlaces)}`);
	return `${hoonyakerSymbol}${formattedAmount}`;
}

/**
 * Render an amount in Hoonyakers as HTML.
 * 
 * @param {number} amount
 * @return {string}
 */
function asHoonyakersHTML(amount){
	// format the number
	const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(hoonyakerNumDecimalPlaces)}`);
	return `${hoonyakerSymbolHTML}${formattedAmount}`;
}
```

As you can see, the code simply defines a few variables and functions. We can see these functions in action like so:

```js
// output the descriptions
$OUT_TEXT.append(describeHoonyaker());
$OUT_HTML.append(describeHoonyakerHTML());

// output some formatted amounts
$OUT_TEXT.empty().append(asHoonyakers(Math.PI));
$OUT_HTML.empty().append(asHoonyakersHTML(Math.PI));
```

### Step 1 — Encapsulate the Data

What we're looking for is a mechanism for collecting all the named pieces of information describing the Hoonyaker into a single variable. Does that sound like a problem we've solved before? Yes! That's literally what dictionaries are for!

The file `pbs93b.html` ([view](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93b.html)|[source](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentResources/pbs93/pbs93b.html)) is almost identical to `pbs93a.html`, the only significant difference is that it loads `hoonyaker2.js`, which contains an encapsulated version of the Hoonyaker data.

Looking in that file you can see how the data has now been wrapped up in a single dictionary:

```js
const hoonyaker = {
	name: 'Hoonyaker',
	descriptionHTML: 'a fictitious currency invented by podcast listener and <em>Nosillacastaway</em> Kaylee that happens to equal about one US Dollar',
	symbol: '₪',
	symbolHTML: '<i class="fas fa-shekel-sign mx-1" title="₪" aria-hidden></i><span class="sr-only">₪</span>',
	numDecimalPlaces: 3
};
```

Changing how we store the information requires us to also change how we access the data in the functions, so hoonyaker2.js contains the same functions as the original file, but each piece of Hoonyaker data is now accessed by a different name. Every reference to `hoonyakerName` becomes `hoonyaker.name`, every reference to `hoonyakerSymbol` becomes `hoonyaker.symbol`, and so on.

Here's the updated `describeHoonyaker()` function to illustrate the point:

```js
/**
 * Generate a plain-text description of the Hoonyaker.
 * 
 * @return {string}
 */
function describeHoonyaker(){
	// use jQuery to convert HTML to text
	const plainTextDesc = $(`<p>${hoonyaker.descriptionHTML}</p>`).text();
	return `The ${hoonyaker.name} is ${plainTextDesc}. Its symbol is ${hoonyaker.symbol}, and it has ${hoonyaker.numDecimalPlaces} decimal places.`;
}
```

Using the JavaScript console from `pbs93b.html` we can see that our functions behave in exactly the same way they did before:

```js
// output the descriptions
$OUT_TEXT.append(describeHoonyaker());
$OUT_HTML.append(describeHoonyakerHTML());

// output some formatted amounts
$OUT_TEXT.empty().append(asHoonyakers(Math.PI));
$OUT_HTML.empty().append(asHoonyakersHTML(Math.PI));
```

### Step 2 — Encapsulate the Functions Too

The next step is to get the functions out of the global name space and get them encapsulated into the dictionary along with the data.

Since JavaScript dictionaries can store anything a variable can store, including references to objects, and since JavaScript functions are objects, we can embed the functions straight into the dictionary using [function expressions](https://developer.mozilla.org/en/docs/web/JavaScript/Reference/Operators/function).

You might hope the next step is as simply as copying-and-pasting the functions into the dictionary, but there's just a little more to it than that. 

When we encapsulated the data we needed to change how the functions accessed the data, now that we are encapsulating them both, we need to change how we access data again.

#### The Importance of `this` for Function Encapsulation

When we move the functions into the dictionary they will effectively become peers within the dictionary's name space. We need a way of expressing the concept of *"the dictionary I belong to"*, and that's where the `this` keyword comes in.

**Within functions embedded in dictionaries, the special variable `this` is a reference to the dictionary.**

That sounds complicated, but it looks a lot simpler in actual code.

The file `pbs93c.html` ([view](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93c.html)|[source](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentResources/pbs93/pbs93c.html)) is effectively identical to `pbs93b.html`, but it imports a fully encapsulated version of the Hoonyaker code from `hoonyaker3.js`.

The code in `hoonyaker3.js` is fully commented, but those comments distract from the structure of the code, so below is the fully encapsulated Hoonyaker with all comments removed:

```js
const hoonyaker = {
	name: 'Hoonyaker',
	descriptionHTML: 'a fictitious currency invented by podcast listener and <em>Nosillacastaway</em> Kaylee that happens to equal about one US Dollar',
	symbol: '₪',
	symbolHTML: '<i class="fas fa-shekel-sign mx-1" title="₪" aria-hidden></i><span class="sr-only">₪</span>',
	numDecimalPlaces: 3,
	describe: function(){
		const plainTextDesc = $(`<p>${this.descriptionHTML}</p>`).text();
		return `The ${this.name} is ${plainTextDesc}. Its symbol is ${this.symbol}, and it has ${this.numDecimalPlaces} decimal places.`;
	},
	describeHTML: function(){
		return `<p>The ${this.name} is ${this.descriptionHTML}. Its symbol is ${this.symbolHTML}, and it has ${this.numDecimalPlaces} decimal places.</p>`
	},
	as: function(amount){
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbol}${formattedAmount}`;
	},
	asHTML: function(amount){
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbolHTML}${formattedAmount}`;
	}
};
```

Notice the use of `this` to access the data from within all the functions.

Since we have now moved our functions into the dictionary, we need to change how we call them. They are now entries in a dictionary, so we call them using the dot syntax. For example, what was `describeHooneyaker()` has now become `hoonyaker.describe()`;

The code below is intended to be run the JavaScript console from `pbs93c.html`, and calls each of our functions in turn:

```js
// output the descriptions
$OUT_TEXT.append(hoonyaker.describe());
$OUT_HTML.append(hoonyaker.describeHTML());

// output some formatted amounts
$OUT_TEXT.empty().append(hoonyaker.as(Math.PI));
$OUT_HTML.empty().append(hoonyaker.asHTML(Math.PI));
```

## What has Encapsulation Given Us?

The file `hoonyaker3.js` defines just a single well named globally scoped variable, and that variable contains all the information and functions that together describe the Hoonyaker. This file is easy to share between pages, projects, and even people. There is no pollution of the global name space, and the syntax for calling the functions reads well — I would argue code of the form `hoonyaker.as(42)` is very clear and understandable!

So we're done? Not quite, encapsulation is just the first step towards truly object oriented code, there are more problems to be solved yet!

## The Next Problem — Generalisation

Using a dictionary we were able to create a beautifully encapsulated representation of the Hoonyaker, but what if we want to describe another fictitious currency?

### Encapsulating the *Squid* (Bart's Imaginary Currency)

The file `squid1.js` contains the code to represent this currency, and the examples are intended to be run from the JavaScript console from `pbs93d.html` ([view](https://rawcdn.githack.com/bartificer/programming-by-stealth/0a781116a0c53f6368505f07a50f88e9f5d49247/instalmentResources/pbs93/pbs93d.html)|[source](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentResources/pbs93/pbs93d.html)).

Looking at `squid1.js` the first thing I want to draw your attention to is that while the content of the data entries is obviously different than it was for the Hoonyaker, the names are the same!

```js
const squid = {
	name: 'Squid',
	descriptionHTML: 'a fictitious currency invented by <a href="https://bartb.ie/">Bart</a> that happens to equal about one Euro these days, even though it started life being about equal to an Irish Punt 🙂',
	symbol: '₴',
	symbolHTML: '<i class="fas fa-hryvnia mx-1" title="₴" aria-hidden></i><span class="sr-only">₴</span>',
	numDecimalPlaces: 2,
	// …
}
```

The second thing I want to draw your attention to is that the functions are not just similar, they are **identical**!

You can see that the code works the same though by executing the following in the JavaScript console on `pbs93d.html`:

```js
// output the descriptions
$OUT_TEXT.append(squid.describe());
$OUT_HTML.append(squid.describeHTML());

// output some formatted amounts
$OUT_TEXT.empty().append(squid.as(Math.PI));
$OUT_HTML.empty().append(squid.asHTML(Math.PI));
```

### A Code Duplication Disaster

So, **both currency objects have data entries with the same names, and identical functions**.

Copying-and-pasting the functions once is bad enough, but imagine trying to build encapsulated objects to represent each of the currencies in the [recent currency converter challenge](https://bartificer.net/pbs92)!

This level of duplication is beyond a so-called *software engineering bad smell*, and deserves to be called a *software engineering stench*!

### A Wasted Opportunity for Generalisation

Let's set the code duplication problem aside for a moment and look at whole other shortcoming of simple encapsulation like this.

We have effectively solved the currency problem in the abstract. Our functions will work for any currency anyone could dream up, but it's very difficult for others to make use of those very general functions for their own imagined currencies.

The instructions would need to be:

1. Download the code for the Hoonyaker (or Squid).
2. Create an empty object named for your own currency.
3. Copy-and-paste the names of the data fields into your object and enter the data.
4. Copy-and-paste the functions into your object.

That's not worthless, but it's hardly a developer-friendly solution, and of course, if we stop ignoring the code duplication, it also stinks!

## Classes to the Rescue!

If we look at object orientation as a philosophy (computer scientists use the term *paradigm*), then we can ask the question, what problem do classes solve?

Well, we can now answer that — classes provide a mechanism for defining the structure and functionality of a collection of objects that represent instances of a single idea.

What we need to avoid the problems with our Hoonyaker and Squid implementations is a class that represents the structure and functionality of any invented currency. We could then use that class ourselves to create Hoonyaker and Squid objects without any code duplication, but we could also share that class with other developers so they could build objects for their own imagined currencies without having copy-and-paste any of our code.

## Final Thoughts

This instalment ends on a cliff hanger! We've seen the value encapsulation brings, but we need to take things a step further by looking at how classes build on the concept of encapsulation to provide a mechanism for building encapsulated objects on demand.

You write classes to represent abstract concepts, and you then use those classes to quickly and easily construct encapsulated objects without any need for code duplication or tedious copying-and-pasting. And what's more, classes allow you to do it all in an easily re-usable and sharable way!