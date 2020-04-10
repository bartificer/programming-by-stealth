# PBS 94 of X — Basic JavaScript OO with Class

This instalment bring us to the end of a long series of instalments focusing on the many proverbial *hats* JavaScript makes objects wear. In JavaScript, just about everything is an object, including dictionaries, arrays, functions of all kinds, and regular expressions. Really, in JavaScript, if it's not a boolean, number, or string, it's an object. In fact, objects are so import in JavaScript that the language even provides wrapper objects for booleans, numbers, and strings so they can be interacted within object-like ways.

We're now approaching the grand finale of this journey — the ability to define our own object classes. In the previous instalment we took the first, and vitally important, step on the journey — we learned about encapsulation. Encapsulation exists in all languages that can support object-oriented programming, and in JavaScript it's implemented with dictionaries. We saw how we could use a dictionary to encapsulate all the information and functions related to an imaginary currency, the Hoonyaker, in a single object. We then saw how creating a similar object for another imaginary currency, the Squid, was so similar that it actually involved copying-and-pasting all the property names and the entire contents of all the functions without editing a single character. The only thing that changed was the data. Obviously there had to be a better way, and of course, there is — the fundamental atom of the Object Oriented world-view, the class!

## What are Classes?

Object Orientation (OO) is a philosophy for building software, a way of thinking about the world, and how we should handle information, and the functions that transform that information. Computer Scientists use the fancy term *paradigm*, but really, it's just a mental model. The previous instalment was dedicated to the first of two fundamental concepts in OO, *encapsulation*. There is great value in bundling a collection of data, and all the functions that transform that data, into a single object.

We saw how encapsulation helped make our code easier to understand, maintain, re-use, and share. Just encapsulation is already a big win over a plethora of independent variables and functions representing different concepts all mixed up together in the one name-space.

Once you start encapsulating your data and functions into objects you soon realise that, like the physical things all around us, objects in our computer code fall into related groups of similar things. An object representing one imaginary currency as as much like an object representing another as my bicycle is to yours!

This is where the concept of a class comes in. A class defines the names of the pieces of data needed to represent a collection of related object, and, the functions that will operate on that data.

In the case of imaginary currencies, a class could specify that all imaginary currencies have properties named `name`, `descriptionHTML`, `symbol`, `symbolHTML`, and `numDecimalPlaces`. The class could then define all the functions that all imaginary currency objects will contain, for example `describe()`, `describeHTML()`, `as()`, and `asHTML()`.

And finally, the class must specify the mechanism for constructing objects based on a description. In other words, the class must provide a function for turning a list of data about an imaginary currency into an object that represents that imaginary currency. Quite wisely, computer scientists call these functions *constructors*.

The constructor for an imaginary currency class would need to accept a name, an HTML description, plain-text and HTML symbols, and a number of decimal places as arguments, and it would then use that data to build and return an object representing that imaginary currency.

## What are Instances? Are they Objects? How are they Related to Classes?

A very common source of confusion for people new to the OO philosophy is the distinction between the words *object*, *instance*, and *class*.

In the OO world-view, **an object is a variable that encapsulates data and functions**.

**If we have a class that represents an idea or thing, then every object constructed by that class is said to be an instance of that class.**

So, that means that **all instances of any class are objects**.

The way to think of it is that **a class represents an abstract concept, and instances represent specific manifestations of that concept**.

If we define a class to represent imaginary currencies, then each imaginary currency object is an instance of that class.

## Object Types?

Regardless of the language, developers often use the word *type* to describe the class an object belongs to.

If we take our imaginary currency as an example, if we named that class `ImaginaryCurrency`, then developers would describe instances of that class as having the *type* `ImaginaryCurrency`. So you might hear them say that *'the variable `hoonyaker` is of type `ImaginaryCurrency`'*, or *'the variables `hoonyaker` and `squid` have the same type'*.

**When developers refer to *types*, they mean *classes***.

## JavaScript's Implementation of OO

Nothing so far in this instalment has been language-specific. The same concepts are implemented in every language that supports object-oriented programming. Now it's time to change gears, and to focus on JavaScript's specific implementation of these ideas.

### ES6 Changed Everything

Under the hood, JavaScript has a *unique* implementation of OO. It has a certain elegance, but it's extremely esoteric, and it can be very confusing to those coming to JavaScript from more traditional OO languages like C++ or Java.

Before the release of ES6 JavaScript programmers had no choice but to interact directly with JavaScript's unique implementation. There was no way to avoid knowing about the esoteric details if you wanted to write your own classes.

The single most significant change ES6 brought to the language was an abstraction layer over that esoteric implementation that allows developers to define classes without needing to look under the hood. Some scoffed at this change saying it was *'just syntactic sugar'* because nothing changed under the hood, but that totally misses the point IMO. The word *just* utterly misses the point — that layer of new syntax made JavaScript look like a normal OO language, making it infinitely easier to write your own classes, and infinitely less confusing for developers coming to JavaScript from other language, and, developers moving to other languages from JavaScript (like we will be in this series).

It's very important to understand this history for two reasons:

1. The internet has not forgotten about the pre-ES6 ways of doing things. When you search the web for answers to JavaScript OO questions, you will still find pages, tutorials, and articles describing the old, pre-ES6, way of doing things. This has the potential to really confuse you!
2. Some of the under-the-hood terminology has leaked out into the jargon used by JavaScript developers, even when they are describing the post-ES6 world. The single biggest example of this is the word *prototype*. Deep down under the hood, in that place we'er not going, JavaScript implements OO concepts using *prototypes*. Before ES6 developers didn't just need to know that, they needed to understand it. Now we don't, but the world has seeped out into the JavaScript zeitgeist, so you'll still find it all over the web, even in descriptions of modern JavaScript. All you need to know is that, effectively, ***prototype* is used by some JavaScript developers as a synonym for *class***.

So, when searching the web, know that any OO advice that does not use the key-word `class` is probably describing the pre-ES6 universe, and any time you see *prototype*, mentally replace it with *class*.

### The `class` Keyword

The way ES6 changed everything was with the introduction to the language of a new keyword — `class`. Like we use the keyword `function` to define functions, we now use the keyword `class` to define classes.

LEFT OFF HERE!!!