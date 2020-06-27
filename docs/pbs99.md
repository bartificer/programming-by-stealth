# PBS 98 of X — Building with Classes Part 2: *Is-A*

In this instalment we're wrapping up our third look at Object Oriented (OO) programming in JavaScript. In the previous instalment we introduced the idea that defining relationships between classes allows for the construction of object oriented code for representing complex concepts and things in our code. If a class represents a concept or thing, then a collection of related classes can represent a collection of related concepts and things. As mentioned in the previous instalments, there are two ways in which classes can be related to each other. The simplest by far is the so-called *has-a* relationship. This is simply the situation where instance of one class have instances of another as data attributes. This instalment is dedicated to the second type of relationship, the so-called *is-a* relationship, the mechanism for which is the OO concept of *class inheritance*. Using inheritance we can build hierarchies of classes, and in so doing, remove a lot of duplication, and make our code easier to write and maintain, and easier to build on. Inheritance really is at the very heart of good object oriented design.

We're also going to meet a very misunderstood word — *polymorphism*. This is one of those words that sounds way more complicated than it actually is.

The previous instalment was built around a worked example, this one will be the same. In fact, we will be building on the example from the previous instalment.

## Instalment Resources

This instalment uses 3 example files:

* [Download ZIP File]()
* [View source code online at GitHub](https://github.com/bartificer/programming-by-stealth/tree/master/instalmentResources/pbs99)
* View the HTML file in your browser:
	* [`pbs99.html`]()

## Matching Podcast Episode

Listen along to this instalment on [episode ?? of the Chit Chat Across the Pond Podcast]().

<audio controls src="?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="" >Download the MP3</a>

## Class Inheritance

Imagine you were writing a class to represent the people in a company. You would have managers and workers. As you started to implement these two classes you'd soon realise that while there are many differences, for example, managers have people reporting to them, workers don't, there are also many similarities. Like workers managers have names, genders, ages, and so on.

By this stage in the series I hope you can recognise the kind of code duplication that implementing these two classes separately would require as being a so-called *bad smell*. Code duplication should always be a signal to stop and think — am I doing this right?

The root-cause of this code duplication is that both managers and workers can be described in terms of a more generic concept — they are both people!

The solution to this code duplication is to start by creating a class that captures everything managers and workers have in common, and then to build two new classes that inherit everything from the first, and only implement the things that are unique to managers and workers.

The mechanism for importing the functionality from one class into another is *inheritance*. In this case the manager and worker classes would inherit from the person class. 

### Class Hierarchies and Inheritance Jargon

While it would be entirely correct to say that one class *inherits from* another, for example, our hypothetical manager and worker classes would inherit from our person class, you'll hardly ever hear inheritance described like that. What you'll tend to hear instead is developers describing one class as *extending* another. The reason for this is quite simple, the keyword for implementing inheritance in many languages (including JavaScript) is `extends`. In our hypothetical example you could say that the manager and worker classes *extend* the person class.

Another source of much inheritance-related jargon is the implicit hierarchy inheritance creates. The very term *inheritance* sets up a family-tree-like mental model, and developers have absolutely run with that concept.

A class that is inherited from is often referred to as a *parent class*, and the classes that inherit from another are often referred to as *child classes*. In the past the terms *super class* and *sub class* were also popular, but they have fallen out of favour. Some hints of this older convention do remain in many language though, with `super` being a commonly used keyword.

With the exception of a few more exotic languages, classes can only inherit from one other class, but there is no limit on how many classes can inherit from any give class. It's also important to understand that a class that inherits from another can itself be inherited from, so inheritance can be nested. Going back to our hypothetical manager and worker example — both managers and workers are employees, and employee's next-of-kin are also people, so we could expand our hypothetical model to one where we have a class representing any person. That class would then be extended to create employee and next-of-kin classes. The employee class would then be extended to create manager and worker classes.

As you can see, we are starting to build a tree-like structure with ever expanding nested branches spreading out from a single root. This structure is often referred to as an *inheritance tree* or a *class hierarchy*.

### The *is-a* Relationship

Every link in an inheritance tree is an *is-a* relationship. So, we can say that a manager *is an* employee, and and employee *is a* person. However, we can merge connected links in the tree together, and we can also say that a manager *is a* person. So, there exists a direct or indirect *is-a* relationship between a class and ever class between it and the root of the inheritance tree.

## What Inheritance Gives Us

A parent class can provide some or all of the following for its child classes:

1. Implementation of shared functionality (data attributes & functions).
2. Default implementations of functionality that can be inherited as-is, or expanded on by child classes (functions).
3. Define functionality child classes must provide.

Before we look in more detail at how inheritance achieves these three goals, let's give ourselves a mental model for how to think about inheritance.

Our journey towards OO started with the concept of encapsulation — a single object containing both data and the functions to manipulate that data. We learned that classes can be used to stamp out lots of similar encapsulated objects. Mentally, you can imagine the constructor building the encapsulated object by adding data, and copying all the instance functions defined in the class into the object. The end result is an encapsulated object with data and functions.

The same model holds true with inheritance, but you should imagine a production line of constructors each adding their pieces of data and copying in their functions. This process does not start with the child class, but with the parent class at the very top of the hierarchy. If class `C` extends class `B` which extends class `A`, and you call the constructor for class `C`, that's actually the last constructor to get called! The first constructor to add data and functions will be the constructor for `A`, then the constructor for `B`, and only then does the constructor you directly called get to do its thing!

This ordering is very important, because it explains what happens when there is a conflict. I classes `A`, `B`, and `C` all provide an instance function named `.d()` that each do something different, which `.d()` ends up in the final encapsulated object outputted by the constructor? Simply put — the last constructor to execute wins!

When a child class replaces functionality provided by a parent class it is said to *override* the parent class's functionality.

With this mental model in mind you can see how a parent class can provide shared functionality — it simply defines functions and data attributes that the child classes do not override.

You can also see how default functionality can be provided — if a parent class implements a function that some of the child classes choose to override but others don't then the functionality in the parent class can best be described as default functionality!

You might imagine that in this case, you as a programmer have to decide whether to eat your cake or have it — do you take the functionality from your parent class, or do you implement your own? In most OO programming languages that's not actually a choice you have to make! While the mechanism varies from language to language, there is generally a mechanism for accessing the original version of an overridden function from within a child class. Many languages (including JavaScript) implement this by using the `super` keyword for this.

The final feature provided by inheritance is the ability to set constraints, to specify that every child class must implement a given instance of class function. Languages vary widely in their support for this feature, some have very rigid enforcement, usually with the keyword `abstract`, and some have no actual enforcement all, relying on agreed convention or creative hackery instead. Sadly, JavaScript falls into the latter category 🙁

## Inheritance in JavaScript

For the most part inheritance in JavaScript ES6 and beyond is very straight forward and works pretty much as you would expect. The one glaring short-coming being the complete lack of support for specifying constraints on child classes. There is a work-around, but it's a little kludgy!

### The  `extends` Keyword

Inheritance is specified when declaring a class. You simply use the `extends` keyword to specify the class you wish to inherit from:

```js
class UberString extends String{
	// …
}
```

The declaration above defines a new class `UberString` which will inherit from the built-in class `String`.

### The `super` Keyword

We've already seen that within classes the keyword `this` is used in three ways:

1. Within the constructor it references the instance object under construction.
2. Within a class function it represents *the class I belong to*.
3. Within an instance function it represents *the instance I belong to*.

JavaScript uses the keyword `super` in very similar ways, but instead of providing access to a sensible *self*, it provides access to a sensible *parent*.

The `super` keyword has three different meanings depending on context:

1. Within a child class's constructor, `super()` is used to execute the parent class's constructor. There are some important subtleties in how this works, so put a pin in this for a few minutes!
2. Within the child class's class functions `super` is a reference to the parent class, providing access to all the class functions and class data attributes the parent class defines, regardless of whether or not the child class chooses to override them.
3. Within the child class's instance functions `super` refers to the instance itself, but as it was before it overrode any instance functions provided by the parent class. This sounds a little strange, but it acts as a mechanism for by-passing function overriding.

### The `super` Keyword Within Constructors

Let's return to the subtleties of using the `super()` keyword within constructors.

When describing the mental model for inheritance I said to imagine all the constructors for all parent classes getting execute in order, starting at the top of the tree and working down until you get to the constructor actually invoked by the programmer. I'm afraid things are not quite that simple in reality, at least not in JavaScript.

The instance functions provided by the parent classes do alway get copied in, but the actual constructor functions do not execute automatically, you have to make that happen, and you can choose not to!

To execute the parent classes constructor, call `super()` with any arguments you wish to pass to that constructor. If you choose to call the parent class's constructor **you must call `super()` before the first time you use the `this` keyword!**

### Working Around the Lack of an `abstract` Keyword

Many languages provide a mechanism for parent classes to specify functions all child classes must implement. In such languages, trying to extend a class without implementing the required functions will result in a compiler error. This means programmers can be guaranteed that every child class will provide a given function.

JavaScript simply does not provide this functionality. There is no JavaScript version of Java's `abstract` keyword. We can't even fully fake it 🙁

The best we can do is work around this shortcoming by implementing a default version of the function in the parent class that always throws an error. If the child class doesn't override the function the error will get thrown, if the child class does override the function it won't.

### Inheritance and the `instanecof` Operator

JavaScript's `instanceof` operator is aware of inheritance. If class `B` extends class `A`, and object `b` is an instance of class `B`, them both of the following will evaluate to `true`:

```js
b instanceof A;
b in stanceof B;
```

## A Worked Example — Monetary Amounts Revisited

In this example we'll expand the suite of classes we built in the previous instalment to represent amounts of money in specific currencies.

As a quick reminder, we chose to model monetary amounts using three interrelated concepts.  *Amounts of money* have a given *currency*, and a *currency* has one or two *denominations*. We represented these three concepts with three classes — `MonetaryAmount`, `Currency`, and `Denomination`.

There were two *has-a* relationships between those classes — monetary amounts had a currency, and currencies had one or two denominations.

Our `Currency` class from the previous instalment can not be used to represent currencies with more than two denominations. If you're a Harry Potter fan and want to implement Wizarding Money, you're out of luck because J.K. Rowling's wizards use Gallions, which divide into Sickles, which divide into Knuts. Similarly, Star Trek fans know the Frengi use Gold Pressed Latinum as their currency, and it consists of Bars, which divide into Strips, which divid into Slips.

What we need is another class to represent this other type of currency, but that class would share a lot of code with our existing class.

Inheritance to the rescue!

My process was to re-name my existing `Currency` class to `DecimalCurrency`, create a new class for the new type of currency named `DenominatedCurrency`, and then to create a new parent class for both of these classes named `Currency`.

The functionality shared by `DecimalCurrency` and `DenominatedCurrency` was moved to the new `Currency` parent class, freeing the two child classes to implement only the things that differentiate them.

This set up two *is-a* relationships — `DecimalCurrency` is a `Currency`, and `DenominatedCurrency` is a `Currency`.

As you can see, the code in `money.js` is long! The intention is not to go through every line of the fine in detail, but instead, to focus on a few highlights that serve to illustrate important concepts. I commented the code heavily in the hope that it would make sense by itself.

Note that the code in `money.js` assumes that three open-source libraries have been loaded before loading `money.js`:

1. The [is.js](https://is.js.org) type-checking library.
2. The [numeral.js](http://numeraljs.com) number formatting library.
3. My open-source [humanJoin.js](https://github.com/bbusschots/human-join#readme) array-joining library.

### Implementing Inheritance — The Design of the 3 Currency Classes

Let's start with the very big picture — we'll be implementing the following three classes:

1. `Currency` — the parent class for all currency types.
2. `DecimalCurrency` — a child class of `Currency` representing the typical currencies we use in the modern world, usually with 2 denominations (like Sterling with Pounds & Pence, and the US Dollar with Dollars Cents), but occasionally with just one (like the Japanese Yen).
3. `DenominatedCurrency` — a child class of `Currency` representing currencies with arbitrarily many denominations like those commonly seen in various fictional genres like sci-fi & fantasy.

This simple class hierarchy (one parent two children) is created with the following class definitions:

```js
class Currency{
  // …
}

class DecimalCurrency extends Currency{
  // …
}

class DenominatedCurrency extends Currency{
  // …
}
```

Before we go any further, let's look in detail at the contents of these three classes:

Let's take a closer look at the structure our three classes:
1. The parent class `Currency` provides:
	* The shared class  function `static coerceAmount(amount)`
	* The shared class function `static amountAsHumanInt(amount)`
	* The shared instance attribute `name`
	* The shared instance attributes `imaginary` & `real`
	* The requirement that all child-classes provide an instance data attribute named `length` (i.e. an *abstract* instance data attribute)
	* A constructor
	* The default instance function `amountAsHumanFloat(amount)`
	* The default instance function `splitAmount(amount)`
	* The requirement that all child-classes provide an instance function `amountAsString(amount)` (i.e. and *abstract* instance function)
	* The requirement that all child-classes provide an instance function `amountAsHumanString(amount)` (i.e. and *abstract* instance function)
	* The requirement that all child-classes provide an instance function `amountAsEnglishString(amount)` (i.e. and *abstract* instance function)
2. The child class `DecimalCurrency` Provides:
	* The instance data attribute `denomination`
	* The instance data attribute `subDenomination`
	* The instance data attribute `subDenominationOrder`
	* An implementation of the mandated instance attribute `length`
	* A constructor which calls the parent class's constructor
	* A custom version of the instance function `amountAsHumanFloat(amount)` replacing the default from `Currency`
	* An implementation of the mandated instance function `splitAmount(amount)`
	* An implementation of the mandated instance function `amountAsString(amount)`
	* An implementation of the mandated instance function `amountAsHumanString(amount)`
	* An implementation of the mandated instance function `amountAsEnglishString(amount)`
3. The child class `DenominatedCurrency` provides:
	* The class function `coerceDenominationRate(rate)`
	* The class function `coerceDenominationRateList(list)`
	* The instance data attributes `denominations`, `denomination`, `denominationList` & `rateList`
	* An implementation of the mandated instance attribute `length`
	* A constructor which calls the parent class's constructor
	* A custom version of the instance function `amountAsHumanFloat(amount)` replacing the default from `Currency` (calls the version from the parent class using `super`)
	* An implementation of the mandated instance function `splitAmount(amount)`
	* An implementation of the mandated instance function `amountAsString(amount)`
	* An implementation of the mandated instance function `amountAsHumanString(amount)`
	* An implementation of the mandated instance function `amountAsEnglishString(amount)`

### Inheritance in Action

Before we peep under the hood, let's demonstrate the three goals of inheritance in action.

All the examples in this section are intended to be run from the JavaScript console on the file `pbs99.html`, and you should not refresh the page between the examples.

Let's start by creating instances of all three classes:

```js
const uselessCurrency = new Currency({
  name: 'Useless Currency',
  imaginary: true
});
const sterling = new DecimalCurrency({
  name: 'Sterling',
  imaginary: false,
  denomination: new Denomination('£', 'Pound'),
  subDenomination: new Denomination('p', 'Penny', 'Pence')
});
const wizardingMoney = new DenominatedCurrency({
  name: "Wizarding Money",
  imaginary: true,
  denominations: [
    new Denomination('G', 'Galleon'),
    17, new Denomination('S', 'Sickle'),
    29, new Denomination('K', 'Knut')
  ]
});
```

#### 1. Shared Functionality

The class `Currency` defines a class function `coerceAmount(amount)` and this function is not re-defined in either of the child classes.

As expected, it continues to work when called on the parent class:

```js
console.log(Currency.coerceAmount("42")); // 42
console.log(Currency.coerceAmount("boggers")); // throws TypeError
```js

Thanks to inheritance, both child classes got a copy of this function automatically:

```js
console.log(DecimalCurrency.coerceAmount("42")); // 42
console.log(DecimalCurrency.coerceAmount("boggers")); // throws TypeError
console.log(DenominatedCurrency.coerceAmount("42")); // 42
console.log(DenominatedCurrency.coerceAmount("boggers")); // throws TypeError
```

The class `Currency` defines a getter and setter for the instance data attribute `name`, and these getters and setters are not re-defined in either child class. Again, the attribute exists on instances of the parent class as expected, but also on instances of the child classes:

```js
console.log(uselessCurrency.name); // Useless Currency
console.log(sterling.name); // Sterling
console.log(wizardingMoney.name); // Wizarding Money
```

#### 2. Default Implementations

TO DO

#### 3. Requirements Child Classes Must Meet

TO DO

### Illustrate `instanceof` & Polymorphism

### Illustrate Shared Class Functions

### Illustrate Shared Instance Functions

## Final Thoughts

TO DO

The next instalment will be our final JavaScript instalment, at least for now, and will focus on my sample solution to the challenge set at the end of [instalment 96](https://bartificer.net/pbs96).