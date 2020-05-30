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

We'll start with a basic implemenation of the idea. You'll find the full code for this first pass at the problem in the file `Nerdtouche1.js`, and you can interact with the class via the JavaScript console on `pbs97a.html`.

### A Class Function

Let's start by laying a useful foundation — a function for testing if a given value is a single emoji. This functionality is clearly related to the set of all Nerdtouches, and not specific to any given Nerdtouche, so it should be added as a class function.

Emoji are not characters in the traditional sense, they are Unicode graphemes, and because Unicode is ... well ... Unicode, that means you can't use string length to test for the presence of a single grapheme. You can prove this to yourself using the JavaScript console on any web page:

```js
'⛔'.length // 1
'💩'.length // 2
'🤦🏼‍'.length // 5
```
It's also really hard to tell which unicode grapheme is an emoji, and which is some other symbol, so I made two decisions:

1. For the purposes of this class, any single grapheme will count as an emoji.
2. I won't even try to write my own code for counting graphemes in a string, I'll use a third-party library.

After a little Googling I decided to use [grapheme-splitter](https://github.com/orling/grapheme-splitter/) which provides exactly the function I need — `.countGraphemes()`!

```js
class Nerdtouche{

  // …

  static isEmoji(val){
    if(is.not.string(val)){
      return false;
    }
    return (new GraphemeSplitter()).countGraphemes(val) === 1;
  }
	
  // …
}
```

Because we pre-fixed the function definition with the `static` keyword we access our function via the class, not via an instance, so this function is `Nerdtouche.isEmoji()`. We can see this function in action on the JavaScript console in `pbs97a.html`:

```
Nerdtouche.isEmoji('💩') // true
Nerdtouche.isEmoji('🐎💩') // false
```

### A Read-only Class Data Attribute

Next let's add a read-only class data attribute to provide access to the number of emoji that make up a Nerdtouche:

```js
class Nerdtouche{

  // …

  static get length(){
    return 3;
  }

  static set length(l){
    throw new Error(`Nerdtouches will always be ${this.length} emoji long!`);
  }
	
  // …
}
```

The only difference between this read-only class data attribute and a read-only instance data attribute is that both the getter and setter are pre-fixed with the keyword `static`.

We can see this property in action in the console:

```js
Nerdtouche.length // 3
Nerdtouche.length = 4 // throws Error
```

### Read/Write Class Data Attributes

Next let's add a pair of class data attributes to store editable default values for the user's handle and the emoji.

TO DO — LEFT OFF HERE!!!



### Two Instance Data Attributes

TO DO

### The Constructor

TO DO

