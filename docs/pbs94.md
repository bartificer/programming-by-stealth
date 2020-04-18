# PBS 94 of X — Basic JavaScript OO with Class

This instalment bring us close to the end of a long series of instalments focusing on the many proverbial *hats* JavaScript makes objects wear. In JavaScript, just about everything is an object, including [dictionaries](https://bartificer.net/pbs84), [arrays](https://bartificer.net/pbs85), [functions](https://bartificer.net/pbs86) of [all kinds](https://bartificer.net/pbs87), and [regular expressions](https://bartificer.net/pbs91). In the browser the entire structure of web pages is also represented as a massive collection of objects — the so-called [DOM](https://bartificer.net/pbs88). Really, in JavaScript, if it's not a boolean, number, or string, it's an object. In fact, objects are so import in JavaScript that the language even provides [wrapper objects](https://bartificer.net/pbs90) for booleans, numbers, and strings so they can be interacted within object-like ways.

We're now starting on the grand finale of this journey — the ability to define our own object classes. In the previous instalment we took the first, and vitally important, step on the journey — we learned about [encapsulation](https://bartificer.net/pbs93). We learned that encapsulation is a universal concept shared by all languages that support object-oriented programming, and that JavaScript uses dictionaries to implement it. We saw how we could use a dictionary to encapsulate all the information and functions related to an imaginary currency, the Hoonyaker, into a single object. We then saw how creating a similar object for another imaginary currency, the Squid, was so similar that it actually involved copying-and-pasting all the property names and the entire contents of all the functions without editing a single character. The only thing that changed was the data. Obviously there had to be a better way, and of course, there is — the fundamental atom of the Object Oriented world-view, the class!

## What are Classes?

Object Orientation (OO) is a philosophy for building software, a way of thinking about the world, and how we should handle information, and the functions that transform that information. Computer Scientists use the fancy term *paradigm*, but really, it's just a mental model. The previous instalment was dedicated to the first of two fundamental concepts in OO, *encapsulation*. There is great value in bundling a collection of data, and all the functions that transform that data, into a single object.

We saw how encapsulation helped make our code easier to understand, maintain, re-use, and share. Just encapsulation is already a big win over a plethora of independent variables and functions representing different concepts all mixed up together in the one name-space.

Once you start encapsulating your data and functions into objects you soon realise that, like the physical things all around us, objects in our computer code fall into related groups of similar things. An object representing one imaginary currency is as much like an object representing another as my bicycle is to yours!

This is where the concept of a class comes in. A class defines the names of the pieces of data needed to represent a collection of related objects, and, the functions that will operate on that data.

In the case of imaginary currencies, a class could specify that all imaginary currencies have properties named `name`, `descriptionHTML`, `symbol`, `symbolHTML`, and `numDecimalPlaces`. The class could then define all the functions that all imaginary currency objects will contain, for example `describe()`, `describeHTML()`, `as()`, and `asHTML()`.

And finally, a class must specify the mechanism for constructing objects based on a description. In our hypothetical example, our imaginary currency class would need to provide a function for turning a list of data about a specific imaginary currency into an object that represents that imaginary currency. Quite wisely, computer scientists call these functions *constructors*.

The constructor for an imaginary currency class would need to accept a name, an HTML description, plain-text & HTML symbols, and a number of decimal places as arguments. The constructor would then use that information to build and return an object representing that imaginary currency.

### What are Instances? Are they Objects? How are they Related to Classes?

A very common source of confusion for people new to the OO philosophy is the distinction between the words *object*, *instance*, and *class*.

In the OO world-view, **an object is a data structure that encapsulates data and functions**. (In JavaScript that means a dictionary that encapsulates data and functions.)

**If we have a class that represents an idea or thing, then every object constructed by that class is said to be an *instance* of that class.**

So, that means that **all instances** of any class **are objects**.

The way to think of it is that **a class represents an abstract concept, and instances represent specific manifestations of that concept**.

If we define a class to represent imaginary currencies, then each imaginary currency object is an instance of that class.

### Two Kinds of Function — *Constructors* & *Instance Functions*

Regardless of the specific programming language, when defining a class you'll be defining two distinct kinds of functions — one or more *constructor functions*, or *constructors*, and an arbitrarily number of *instance functions*.

We know that classes are used as blueprints for objects that are instances of that class. **The function** (or functions) **a class defines for the purpose of constructing instances is** (or are) **known as *constructor functions*, or simply *constructors***. Some programming languages allow a single class to define arbitrarily many constructors, while others only allow classes to define a single constructor function.

We know that instances of classes encapsulate data and functions. **The functions encapsulated into all instances of a class are known as *instance functions***. If a class defines 5 instance functions then every instance of that class will have those five functions encapsulated into it.

> Those of you familiar with OO theory have probably noticed that I've not mentioned a third kind of function that classes can define — so-called *static functions*. That's not an omission, it's a conscious choice I've made in the interest of minimising confusion and focusing tightly on the most important principles. We did actually look at static functions on our  first attempt at covering JavaScript classes back in [instalment 48](https://bartificer.net/pbs48).
{: .aside}

### *Attribute* is a Fancy Name for a Piece of Encapsulated Data

If a class encapsulates three pieces of data named `name`, `description`, and `symbol`, then developers would say that *'the class defines three attributes'*, and, that *'each instance of the class has three attributes'*. Developers will also use the word *attribute* to describe specific pieces of encapsulated data, e.g. *'you should convert the `name` attribute to Title Case before using in as the section title'*.

### *Type* is Just a Synonym for *Class*

Regardless of the language, developers often use the word *type* to describe the class an object belongs to.

If we take our imaginary currency as an example, if we named that class `ImaginaryCurrency`, then developers would describe instances of that class as having the *type* `ImaginaryCurrency`. So you might hear them say that *'the variable `hoonyaker` is of type `ImaginaryCurrency`'*, or *'the variables `hoonyaker` and `squid` have the same type'*.

**When developers refer to *types*, they mean *classes***.

## Object Orientation Jargon Buster

In an attempt to save your sanity, here's a quick summary of all the OO jargon you've had to absorb so far:

| Term | Meaning |
|---:|:--- |
| **Object** | A data structure that contains named pieces of data and functions. |
| **Encapsulation** | The act of collecting the data and functions related to a concept or thing in an object. |
| **Object Orientation** (OO) | A *paradigm* (or design philosophy) built around the concept of related groups of encapsulated objects. |
| **Class** (or **Type**) | A definition that can be used to construct objects representing specific incarnations of a concept or thing. |
| **Instance** | An encapsulated object built by a class that represents a specific incarnation of a concept or thing. |
| **Constructor** | A function defined within a class that initialises instances of that class. |
| **Attribute** | A piece of data data encapsulated within an instance. |
| **Instance Function** | A function encapsulated within an instance. |

## JavaScript's Implementation of OO

Nothing so far in this instalment has been language-specific. The same concepts are implemented in every language that supports object-oriented programming. Now it's time to change gears, and to focus on JavaScript's specific implementation of these ideas.

First and foremost — **JavaScript classes define a single constructor function**. I mentioned above that some languages allow classes to define arbitrarily many constructor functions, JavaScript is not one of those. In JavaScript, classes have exactly one constructor function.

### ES6 Changed Everything

Under the hood, JavaScript has a *unique* implementation of OO. It has a certain elegance, but it's extremely esoteric, and it can be very confusing to those coming to JavaScript from more traditional OO languages like C++ or Java.

Before the release of ES6, JavaScript programmers had no choice but to interact directly with JavaScript's unique implementation. There was no way to avoid knowing about the idiosyncratic details if you wanted to write your own classes.

The single most significant change ES6 brought to the language was an abstraction layer on top of JavaScript's unusual OO implementation which relieved developers of the need to understand what's really going on under the hood. Developers can now use familiar keywords to define their classes. Some scoffed at this change saying it was *'just syntactic sugar'* because nothing changed under the hood. The word *just* utterly misses the point IMO — that layer of new syntax made JavaScript look like a normal OO language, making it infinitely easier to write your own classes, and infinitely less confusing for developers coming to JavaScript from other language. As an added bonus, it also made it easier for JavaScript developers who learned the new way of doing things to move to other languages, much like we'll shortly be doing in this series!

It's very important to understand this history for two reasons:

1. The internet has not forgotten about the pre-ES6 ways of doing things. When you search the web for answers to JavaScript OO questions, you'll still find pages, tutorials, and articles describing the old, pre-ES6, way of doing things. This has the potential to really confuse you!
2. Some of the under-the-hood terminology has leaked out into the jargon still used by JavaScript developers, even when they're describing the post-ES6 world. The single biggest example of this is the word *prototype*. Deep down under the hood, in that place we're not going, JavaScript implements OO concepts using *prototypes*. Before ES6 developers didn't just need to know that, they needed to understand it. Now we don't, but the word has seeped out into the JavaScript zeitgeist, so you'll still find it all over the web, even in descriptions of modern JavaScript. All you need to know is that, effectively, ***prototype* is used by some JavaScript developers as a synonym for *class***.

So, when searching the web, know that any OO advice that doesn't use the key-word `class` is probably describing the pre-ES6 universe, and any time you see *prototype*, mentally replace it with *class*.

Note that when this series began, ES6 was still new, and I made the decision not to adopt it within the series until it had wide-spread browser support. That means that when we first looked at object orientation starting way back in [instalment 17](https://bartificer.net/pbs17)  we did things the pre-ES6 way. The same is true of instalments [27](https://bartificer.net/pbs27), [28](https://bartificer.net/pbs28), [29](https://bartificer.net/pbs29), [30](https://bartificer.net/pbs30), and [31](https://bartificer.net/pbs31).

Later in the series we did introduce the new ES6 approach to classes (instalments [46](https://bartificer.net/pbs46), [47](https://bartificer.net/pbs47) & [48](https://bartificer.net/pbs48)), but we did so from the point of view of transitioning from the old representation to the new, and I honestly don't think those instalments worked well. In this instalment we're going to start over from scratch and pretend the old way never existed 🙂

## Creating JavaScript Classes with the `class` Keyword

The way ES6 changed everything was with the introduction of a new keyword — `class`. Like we use the keyword `function` to define functions, we now use the keyword `class` to define classes.

A JavaScript class creates a code block within which you define a constructor function and the instance functions. Unlike in many other languages, you don't define the class's attributes directly, you create them within the constructor.

Big-picture-wise your code will look something like:

```js
class AClassName{
	// define the constructor — the name is not optional
	constructor(){
		// define and initialise the data attributes here
	}
	
	// define the instance functions — you choose the names
	
	nameOfAFunction(){
		// …
	}
	
	nameOfAnotherFunction(){
		// …
	}
	
	// …
}
```

### Understanding `this` Within Class Definitions

Before we can start writing constructors and instance functions we need to re-visit the vitally important keyword `this`.

We learned in the previous instalment that inside functions encapsulated within an object, the special variable `this` is a reference to the object containing the function. We suggested mentally thinking of `this` as *'the object I belong to'*. This holds true for instance functions defined within classes because those effectively get encapsulated into every instance object constructed by the class. (I say *effectively*, because if you insist on peering under the hood you'll see there's a little more to it than that, but there's absolutely no reason to confuse things with that kind of low-level implementation detail, so we won't 😉)

It's important to note that an instance function defined within a class will only ever be executed on a specific instance via the dot notation, e.g. `someObject.someInstanceFunction()`. In this example we would refer to `someObject` as *the calling object* or *the object that invoked the function*, or *the object on which the function was called*.

So, **when an instance function executes,  `this` will always be a reference to a specific instance of the class that defined the function**.

Things are quite different within constructor functions. The reason is actually quite logical when you think about it — instance functions are intended to interact with the data they are encapsulated with, constructor functions are intended to initialise the data within a fresh instance object.

Since the job of a constructor function is to build an instance object, you need a way of referencing the object that's under construction, and JavaScript chose to use the keyword `this` for that purpose.

So, **within constructors, `this` is a reference to the instance object under construction**.

### A practical Example — A Basic `ImaginaryCurrency` Class

Let's put all this theory into practice with a practical example. Building on our examples of the imagined Hoonyaker and Squid currencies from [the previous instalment](https://bartificer.net/pbs93), let's create a class that can be used to create objects representing any possible imagined currency.

The file `ImaginaryCurrency1.js` contains the code for this basic first implementation of the class, replete with many comments. However, to more clearly see the structure, I've included a version of the code below with all comments removed:

```js
class ImaginaryCurrency{
	constructor(details){
		this.name = details.name;
		this.descriptionHTML = details.descriptionHTML;
		this.symbol = details.symbol;
		this.symbolHTML = details.symbolHTML;
		this.numDecimalPlaces = numDecimalPlaces;
	}
	
	describe(){
		const plainTextDesc = $(`<p>${this.descriptionHTML}</p>`).text();
		return `The ${this.name} is ${plainTextDesc}. Its symbol is ${this.symbol}, and it has ${this.numDecimalPlaces} decimal places.`;
	}

	describeHTML(){
		return `<p>The ${this.name} is ${this.descriptionHTML}. Its symbol is ${this.symbolHTML}, and it has ${this.numDecimalPlaces} decimal places.</p>`
	}

	as(amount){
		// format the number
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbol}${formattedAmount}`;
	}

	asHTML(amount){
		// format the number
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbolHTML}${formattedAmount}`;
	}
}
```

If you look at the code from `hoonyaker3.js` (and indeed `squid1.js`) from the previous instalment you'll see how similar this is in structure. Instead of defining our data attributes directly we now define them inside the constructor function, but their names remain un-changed. Also notice that the names and contents of all the functions remain the same too.

Notice that I chose to write the constructor function in such a way that it expects to be passed the currency's details in a single dictionary argument named `details`. For simplicity, the constructor expects this dictionary to use the same property names that the class will provide.

> # The Three-Argument 'Rule'
> 
> As a general rule, if a function needs more than three arguments you should refactor it to accept a single dictionary argument with named values.
{: .aside}

### Creating Instances of Classes with the `new` keyword

We've now defined a class, so how do we use it?

In JavaScript we use a class's constructor function to create an instance of that class. We do this with the keyword `new` followed by a space, then the name of the class followed by the arguments to be passed to the constructor function within parenthesis. I.e., something of the form:

```js
const myInstanceObject = new NameOfClass(constructorArg1, constructorArg2);
```

The file `pbs94a.html` includes the file `ImaginaryCurrency1.js`, so we can open that file in our browser and use the JavaScript console to create objects representing imaginary currencies.

As a practical example, let's create an object representing the Bars of Gold-Pressed Latinum the Ferengi in Star Trek are so fond of acquiring 🙂

```js
// create a Gold-Pressed Latinum object
const goldPressedLatinum = new ImaginaryCurrency({
	name: 'Gold Pressed Latinum Bar',
	descriptionHTML: 'a bar of Gold Pressed Latinum, a material that for inexplicable reasons can\'t be replicated even though pretty much anything else in the <a href="https://en.wikipedia.org/wiki/Star_Trek" target="_blank" rel="noopener">Star Trek</a> universe can',
	symbol: '₤',
	symbolHTML: '<i class="fas fa-lira-sign mx-1" title="₤" aria-hidden></i><span class="sr-only">₤</span>',
	numDecimalPlaces: 0
});

// use our new object
$OUT_TEXT.append(goldPressedLatinum.describe());
$OUT_HTML.append(goldPressedLatinum.describeHTML());
$OUT_TEXT.empty().append(goldPressedLatinum.as(Math.PI));
$OUT_HTML.empty().append(goldPressedLatinum.asHTML(Math.PI));
```

### Better Constructors with Default Values

The first implementation above is extremely demanding of the programmer — to create a currency they must specify a value for every property, there's no concept of a default. This is generally considered bad practice — you should usually write your constructors so they can default as many values as possible. If fact, if possible, you should write your classes so their constructor builds a usable object, even when passed no arguments at all!

The file `ImaginaryCurrency2.js` defines an improved version of the class which is identical to the first implmentation except that the constructor now supports default values for all the currency details:

```js
class ImaginaryCurrency{
	//
	// Define the Constructor
	//
	
	/**
	 * @param {Object} [details={}] - a dictionary of initial values for the currency's properties.
	 * @param {string} [details.name='Imaginary Dollar'] - the currency's name.
	 * @param {string} [details.descriptionHTML='an imaginary currency'] - a description of the currency, optionally including HTML tags.
	 * @param {string} [details.symbol='$'] - a plain-text version of the currency's symbol.
	 * @param {string} [details.symbolHTML='<i class="fas fa-dollar-sign mx-1" title="$" aria-hidden></i><span class="sr-only">$</span>'] - an HTML version of the currency's symbol.
	 * @param {number} [numDecimalPlaces=2] - the number of decimal places the currency usually displays.
	 */
	constructor(details){
		// ensure details is a dictionary
		if(typeof details !== 'object') details = {};
		
		// initialise all the data attributes
		// use the passed value if possible, otherwise, use a default
		if(typeof details.name === 'string'){
			this.name = details.name;
		}else{
			this.name = 'Imaginary Dollar';
		}
		if(typeof details.descriptionHTML === 'string'){
			this.descriptionHTML = details.descriptionHTML;
		}else{
			this.descriptionHTML = 'an imaginary currency';
		}
		if(typeof details.symbol === 'string'){
			this.symbol = details.symbol;
		}else{
			this.symbol = '$';
		}
		if(typeof details.symbolHTML === 'string'){
			this.symbolHTML = details.symbolHTML;
		}else{
			this.symbolHTML = '<i class="fas fa-dollar-sign mx-1" title="$" aria-hidden></i><span class="sr-only">$</span>';
		}
		// best-effort to convert the number of decimal places to a number
		const numDecimalPlaces = parseInt(details.numDecimalPlaces);
		if(!isNaN(numDecimalPlaces) && numDecimalPlaces >= 0){
			this.numDecimalPlaces = numDecimalPlaces;
		}else{
			this.numDecimalPlaces = 2;
		}
	}
	
	// …
}
```

Notice that for each data attribute the constructor checks to see if a valid value was passed — if one was, it gets used, otherwise a default value is used. Also notice the code makes a reasonable effort to coerce the number of decimal places into a valid value. Finally, notice that the [doc comments](https://bartificer.net/pbs37) above the function document the default values.

The file `pbs94b.html` loads this improved class, so we can experiment with it by opening that file in our favourite browser and entering the following into the JavaScript Console:

```js
// create an object with all the default values
const defaultyDollars = new ImaginaryCurrency();

// use our new object
$OUT_TEXT.append(defaultyDollars.describe());
$OUT_HTML.append(defaultyDollars.describeHTML());
$OUT_TEXT.empty().append(defaultyDollars.as(Math.PI));
$OUT_HTML.empty().append(defaultyDollars.asHTML(Math.PI));
```

In general developers will use a mix of default and custom values, so let's make use of our new support for defaults to create an object representing the Quatloo, the currency the aliens in the [Star Trek original series](https://en.wikipedia.org/wiki/Star_Trek:_The_Original_Series) episode [*The Gamesters of Triskelion*](https://en.wikipedia.org/wiki/The_Gamesters_of_Triskelion) used when betting on fights. Like many Earth currencies, the Quatloo has two decimal places, which also happens to be the default provided by our improved `ImaginaryCurrency` class:

```js
// create the quatloo object
const quatloo = new ImaginaryCurrency({
	name: 'Quatloo',
	descriptionHTML: 'a currency from the planet <a href="https://memory-alpha.fandom.com/wiki/Triskelion" target="_blank" rel="noopener">Triskelion</a>',
	symbol: '₸',
	symbolHTML: '<i class="fas fa-tenge mx-1" title="₸" aria-hidden></i><span class="sr-only">₸</span>'
});

// use the quatloo object
$OUT_TEXT.append(quatloo.describe());
$OUT_HTML.append(quatloo.describeHTML());
$OUT_TEXT.empty().append(quatloo.as(Math.PI));
$OUT_HTML.empty().append(quatloo.asHTML(Math.PI));
```

While this implementation is clearly more advanced, it's actually overly forgiving, resulting in the kind of silent errors that will drive developers nuts!

Take this simple example:

```js
const woopsie = new ImaginaryCurrency({numDecimalPlaces: '-3'});
$OUT_TEXT.empty().append(quatloo.as(Math.PI));
```

This will print out `$3.14`, because the invalid value of `'-3'` was silently ignored and the default of `2` used instead.

### Even Better Constructors with Error Throwing

While we do want defaults when values are not passed at all, we also want to throw errors when invalid values are passed. In the file `ImaginaryCurrency3.js` you'll find another improved implementation, again, the only thing that's changed is the constructor.

Below is a snippet of the constructor's code showing the improved logic used for each data attribute:

```js
/**
class ImaginaryCurrency{
	//
	// Define the Constructor
	//
	
	 * @param {Object} [details={}] - a dictionary of initial values for the currency's properties. If passed, must be an object.
	 * …
	 * @param {number} [numDecimalPlaces=2] - the number of decimal places the currency usually displays. If present, must be a number greater than or equal to zero. The value will be coerced to an integer if possible.
	 * @throws {TypeError} A Type Error is thrown when the details parameter is not an object, or, if any of the named properties are defined but of the wrong type. 
	 * @throws {RangeError} A Range Error is thrown when any of the named properties of the passed details object have the correct type, but an invalid value.
	 */
	constructor(details){
		// ensure details is a dictionary
		if(typeof details === 'undefined'){
			details = {};
		}else{
			if(typeof details !== 'object') throw new TypeError('details must be an object');
		}
		
		// initialise all the data attributes
		// validate any passed values, and use the default for unspecified values
		if(typeof details.name === 'undefined'){
			this.name = 'Imaginary Dollar';
		}else{
			if(typeof details.name === 'string'){
				if(details.name.length > 0){
					this.name = details.name;
				}else{
					throw new RangeError('details.name cannot be empty');
				}
			}else{
				throw new TypeError("if passed, details.name must be a non-empty string");
			}
		}
		
		// …
		
		if(typeof details.numDecimalPlaces === 'undefined'){
			this.numDecimalPlaces = 2;
		}else{
			// best-effort to convert the number of decimal places to a number
			const numDecimalPlaces = parseInt(details.numDecimalPlaces);
			if(isNaN(numDecimalPlaces)){
				throw new TypeError('if passed, details.numDecimalPlaces must be an integer greater than or equal to one');
			}else{
				if(numDecimalPlaces >= 0){
					this.numDecimalPlaces = numDecimalPlaces;
				}else{
					throw new RangeError('details.numDecimalPlaces cannot be less than zero');
				}
			}
		}
	}
	
	// …
}
```

Notice that as well as updating the logic, the documentation comments at the top of the constructor were also updated to reflect the new error handling behaviour.

The file `pbs94c.html` includes this improved imaginary currency class, so you can open that file in your favourite browser and use the JavaScript console to see our new error-handling code in action:

```js
// trigger a type error
const oopsie1 = new ImaginaryCurrency('Monopoly Dollar');
const oopsie2 = new ImaginaryCurrency({ name: true });

// trigger a range error
const oopsie3 = new ImaginaryCurrency({ name: '' });
const oopsie4 = new ImaginaryCurrency({ numDecimalPlaces: -8 });
```

### Multi-Signature Constructors

When writing any function it's possible to offer the users of your function some choices when it comes to the arguments your function will accept. This is an extremely commonly used technique, and the term developers use to describe each choice is a *signature*.

The jQuery API is replete with examples of this technique. Consider jQuery's `.css()` function — it supports the following three signatures:

| Arguments (`{Type} Name`) | Resulting Behaviour | Example | 
|---:|--- |:--- |
| {string} propName  | Returns the value of the CSS property `propName`. | `console.log($('p').css('color'));` |
| {string} propName, {*} newVal | Sets the value of the CSS property `propName` to `newVal`. | `$('p').css('color', 'purple');` |
| {dictionary} newVals | Sets the CSS properties corresponding to the keys in `newVals` to their corresponding values. | `$('p').css({ color: 'orange', border: '1px solid red'});` |

Any function can be written to support an arbitrary number of signatures, but for constructors a very common pattern is to support three signatures:

1. No arguments.
2. A list of up to 3 optional arguments for the three attribures most likely to need non-default values.
3. A single dictionary defining as many attribute values as desired.

As a concrete example, let's create a final version of the `ImaginaryCurrency` constructor that supports the following three signatures:

1. No arguments, e.g.:
	```js
	const defCur = new ImaginaryCurrency();
	```
2. A name as the first argument, and optionally a description as the second, e.g.:
	```js
	const fancyDollar = new ImaginaryCurrency('Fancy Dollar');
	const monopolyDollar = new ImaginaryCurrency('Monopoly Dollar', 'the currency from the board game Monopoly');
	```
3. A dictionary with some or all of `name`, `descriptionHTML`, `symbol`, `symbolHTML`, and `numDecimalPlaces` as the only argument.
	```js
	const quatloo = new ImaginaryCurrency({
	name: 'Quatloo',
	descriptionHTML: 'a currency from the planet <a href="https://memory-alpha.fandom.com/wiki/Triskelion" target="_blank" rel="noopener">Triskelion</a>',
	symbol: '₸',
	symbolHTML: '<i class="fas fa-tenge mx-1" title="₸" aria-hidden></i><span class="sr-only">₸</span>'
});
	```

Our existing code is built around the third signature, so that already works. The fact that we have an `if` statement that sets the details dictionary to an empty dictionary when no arguments are passed covers the first signature too. So the only question is, how do we add support for the second?

As a general rule, you want to transform all signatures (other than the one that expects a single dictionary) into a dictionary, then write your code to process that dictionary. We can do that by testing the type of the arguments and building our dictionary appropriately. For the first signature, that simply means creating an empty dictionary. For the second it means creating a dictionary that defines  `name`, and optionally also `descriptionHTML`.

You can see this approach in `ImaginaryCurrency4.js`. Again, the class is entirely unchanged except for the constructor:

```js
class ImaginaryCurrency{
	//
	// Define the Constructor
	//
	
	/**
	 * @signature Name & Description
	 * @param {string} details - the currency's name. If passed, must be a non-empty string.
	 * @param {string} [descHTML='an imaginary currency'] - the currency's description, including HTML tags. If passed, must be a non-empty string.
	 * @throws {TypeError} A Type Error is thrown when the name or description are not strings. 
	 * @throws {RangeError} A Range Error is thrown when the name or description are empty strings.
	 * 
	 * @signature Details
	 * Same as before …
	 */
	constructor(details, descHTML){
		// figure out which argument option was used
		// ensure details will always be an object before it is processed
		if(typeof details === 'undefined'){
			details = {};
		} else if(typeof details === 'string'){
			if(details === ''){
				throw new RangeError('the first argument cannot be an empty string');
			}else{
				details = { name: details};
				if(typeof descHTML !== 'undefined'){
					if(typeof descHTML === 'string'){
						if(descHTML === ''){
							throw new RangeError('the second argument cannot be an empty string');
						}else{
							details.descriptionHTML = descHTML
						}
					}else{
						throw new RangeError('if passed, second argument must be a non-empty string');
					}
				}
			}
		}else if(typeof details !== 'object'){
			throw new TypeError('if passed, first argument must be an object or a non-empty string');
		}
		
		// Remainder of constructor un-altered
		// …
	}
	
	// …
}
```

The file `pbs94d.html` imports this updated version of the `ImaginaryCurrency` class. We can use the JavaScript console to make use of the added signature like so:

```js
// create a monopoloy dollar object using the new signature
const monopolyDollar = new ImaginaryCurrency('Monopoly Dollar', 'the currency from the Monopoly board game');

// use the monopolyDollar
$OUT_TEXT.append(monopolyDollar.describe());
$OUT_HTML.append(monopolyDollar.describeHTML());

// demonstrate that the original signature still works
const dummyDollar = new ImaginaryCurrency({ name: 'Dummy Dollar' });
$OUT_TEXT.empty().append(dummyDollar.describe());
$OUT_HTML.empty().append(dummyDollar.describeHTML());
```

## The `instanceof` Operator

Once you start creating your own classes you're likely to start writing functions that expect instances of your classes as arguments. To validate those arguments you'll need to test if the given value is a reference to an instance of one of your classes. You can do this using the `instanceof` operator. This operator will evaluate to a boolean, and has the following syntax:

```js
testObject instanceof SomeClass
```

If `testObject` is an instance of the class `SomeClass` then the above expression will evaluate to `true`, otherwise, it will evaluate to `false`.

We can demonstrate this operator by executing the following on the JavaScript console on `pbs94d.html`:

```js
const imaginaryDollar = new ImaginaryCurrency();
console.log(imaginaryDollar instanceof ImaginaryCurrency); // true
console.log(imaginaryDollar instanceof Date); // false
```

## Naming Conventions for Classes

One final point to note before wrapping up this instalment — by convention, **JavaScript classes are always named in so-called *CamelCase* with a leading capital**, hence my choice to name our example class `ImaginaryCurrency`.

This is not a rule, but it is a very widely adopted convention, and as such I strongly recommend you treat it as a rule. Abiding by language conventions like this will make your code easier for others to understand and re-use.

## Final Thoughts —  A Lot Done, but More to Do!

We can now create classes which allow us to construct encapsulated objects as needed. 

Throughout this instalment we've been steadily improving our example `ImaginaryCurrency` class. So far we've been focusing on improving the constructor. In the next instalment, we'll shift our focus to the data encapsulated by instances of our class. At the moment our classes are still very brittle, we need to add a lot more data validation and error checking to make them more robust.

For now, the following won't throw an error:

```js
const imaginaryDollar = new ImaginaryCurrency();
imaginaryDollar.numDecimalPlaces = 'boogers';
```

But, it will stop our instance working properly:

```js
$OUT_TEXT.empty().append(imaginaryDollar.describe());
$OUT_TEXT.empty().append(imaginaryDollar.as(Math.PI));
```

We need to make our data attributes as robust as our constructor, and the key to doing this efficiently are so-called *getters and setters*. Those will be the focus of the next instalment.