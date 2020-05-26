# PBS 97 of X — Class Data Attributes & Functions

In this instalment we'll be introducing the penultimate concept for this series-within-a-series on Object Oriented programming in JavaScript.

We started our OO journey with the concept of encapsulation — wrapping data and the functions for manipulating that data into a single object. Next we learned that classes are used to represent abstract concepts. We saw how those classes are used to build encapsulated objects representing specific instance of the abstract concepts. We used the class `ImaginaryCurrency` to build objects representing Monopoly Money, Ferrengi bars of Gold-Pressed-Latinum, and other imagined currencies. Each specific imaginary currency is an instance of the class, and each has its own copy of each named data attributes. Each instance also effectively has its own copy of each of the instance functions.

With those core concepts under our proverbial belts we moved on to looking at how to make our classes more robust, first by making better constructor functions, and then learning how to use so-called *getters* and *setters* to make better data attributes.

So far our data attributes have belongs to the instances of our classes — each circle has its own radius, etc.. Similarly, our functions have all been encapsulated into the instances, or, they have been so-called constructor functions. We've referred to these pieces of data, and these functions, as *instance data attributes* and *instance functions*. We access the data through the instances, and we invoke the functions on the instances.

The data attributes and functions defined in a class don't have to be associated with the instances and encapsulated into them, it is possible to add data attributes and functions classes themselves. Such *class variables* are accessed via the class, and such *class functions* are called on the class themselves.

## Class Data Attributes in JavaScript

TO DO

## Class Functions in JavaScript

TO DO