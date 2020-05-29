# PBS 97 of X — Class Data Attributes & Functions

In this instalment we'll be introducing the penultimate concept for this series-within-a-series on Object Oriented programming in JavaScript.

Before we move forward, let's take a moment to summarise where we've gotten to.

We have learned to use classes to allow us to construct concrete examples of abstract concepts. Each concrete example taking the form of an encapsulated object — that is to say, an object that contains both data, and, the functions to manipulate that data. We call these encapsulated objects *instances* of the class that constructed them. Because the data attributes and functions are encapsulated within each instance, we refer to them as *instance data attributes*, and *instance functions*.

Instance attributes and functions are accessed using the dot notation on instances of a class, so it's `someInstance.someAttribute` or `someInstance.someFunction()`.

Instance attributes are designed to hold information that is unique to each instance, and instance functions are designed to operate on a specific instance's data. What if you have some data that is relevant to all instances of a class, but does not vary from instance to instance? Or what if you have functions that are related to the abstract concept a class represents, but not applicable to a single instance of the class. Where where should such data and functions go?

## Class Data Attributes & Functions

Well, if something is better associated with the abstract concept that with individual instances, they should be added to the class, not encapsulated into the instances. Rather unimaginatively, we refer to data attributes associated directly with a class as *class data attributes*, and functions associated directly with a class as *class functions*. Perhaps a little too imaginatively, many programmers also refer to class data attributes and class functions as *static data attributes*, and *static functions*, and many languages use the keyword `static` to mark an attribute or function as belonging to the class.

**Class data attributes and class functions do not get encapsulated into instance of a class**, this means they cannot be accessed via an instance of the class. Class data attributes and functions are instead accessed via the class, i.e. `SomeClass.someData` and `SomeClass.someFunction()`.

If this all sounds a little too abstract, let's consider a class to represent circles again (like we did in the previous instalment). The value of Pi is clearly associated with the concept of a circle, but is it a property that varies from circle to circle? No it is not! It's a single value that all circles have in common. This means it should be added as a class data attribute, not an instance data attribute (like we did in the previous instalment).

Similarly, a function for testing whether of not a given value is a reference to an instance of our circle class is clear related to our circle class. However, it would make no sense to add it as an instance function, because it would not be encapsulated into anything that was not an instance of our class! Clearly, this should be a class function.

## Class Data Attributes & Functions in JavaScript — The `static` Keyword

In this series-within-a-series we're confining ourselves to the modern JavaScript OO syntax, so, in our world, the correct way to add class data attributes is with getters and setters.

To mark a getter or setter as being for a class data attribute rather than an instance data attribute, simply pre-fix the declaration with the keyword `static`.

Similarly, to mark a function defined within a class as being a class function rather than an instance function, simply pre-fix the declaration with the keyword `static`.

Because the keyword `static` is used to mark attributes and functions as belonging to the class, many developers use *static data attribute* as a synonym for *class data attribute*, and *static function* as a synonym for *class function*.

## The Keyword `this` Within Class (AKA Static) Functions

We've already learned that within instance functions the keyword `this` is a reference to *the instance object I belong to*. Similarly, within class functions, the keyword `this` is a reference to *the class I belong to*. This means that class functions can access other class functions and class data attributes using `this`.

## Accessing Class Functions from Within Instance Functions

In JavaScript, every object constructed by a constructor, i.e. every instance of any class, automatically gets an instance data attribute named `constructor`. This automatically created data attribute will be a reference to the class the object is an instance of. That means that within instance functions, the class they belong to can be accessed with `this.constructor`. Since class data attributes belong to the class, they can be accessed via `this.constructor.someClassAttribute`. Similarly, class functions can be accessed via `this.constructor.someClassFunction()`.

## A Worked Example — the `Nerdtouche` Class

This all sounds very abstract, so let's create a worked example — a class to represent a modern-day nerd-equivalent of the [cartouches](https://en.wikipedia.org/wiki/Cartouche) ancient Egyptian pharos used. The names of pharos were recorded in inscriptions as groups of pictograms encapsulated in a pill-shaped grouping.

In my imagination, a modern nerd equivalent would be a grouping of three emoji a person uses to represent themselves — I've decided to call them *Nerdtouches* 🙂

Since my biggest nerd loves are science, computing, and photography, I've chosen (🔭🖥️📷) as mine.

Let's build a class to represent this nutty invention of mine.

### A Class Function

TO DO

### Three Class Data Attributes

TO DO

### Two Instance Data Attributes

TO DO

### The Constructor

TO DO

