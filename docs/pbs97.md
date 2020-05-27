# PBS 97 of X — Class Data Attributes & Functions

In this instalment we'll be introducing the penultimate concept for this series-within-a-series on Object Oriented programming in JavaScript.

Before we move forward, let's take a moment to summarise where we've gotten to.

We have learned to use classes to allow us to construct concrete examples of abstract concepts. Each concrete example taking the form of an encapsulated object — that is to say, an object that contains both data, and, the functions to manipulate that data. We call these encapsulated objects *instances* of the class that constructed them. Because the data attributes and functions are encapsulated within each instance, we refer to them as *instance data attributes*, and *instance functions*.

Instance attributes and functions are accessed using the dot notation on instances of a class, so it's `someInstance.someAttribute` or `someInstance.someFunction()`.

Instance attributes are designed to hold information that is unique to each instance, and instance functions are designed to operate on a specific instance's data. What if you have some data that is relevant to all instances of a class, but does not vary from instance to instance? Or what if you have functions that are related to the abstract concept a class represents, but not applicable to a single instance of the class. Where where should such data and functions go?

## Class Data Attributes & Functions

Well, if something is better associated with the abstract concept that with individual instances, they should be added to the class, not encapsulated into the instances. Rather unimaginatively, we refer to data attributes associated directly with a class as *class data attributes*, and functions associated directly with a class as *class functions*. Perhaps a little too imaginatively, many programmers also refer to class data attributes and class functions as *static data attributes*, and *static functions*, and many languages use the keyword `static` to mark an attribute or function as belonging to the class.

**Class data attributes and class functions do not get encapsulated into instance of a class**, this means they cannot be accessed via an instance of the class. Class data attributes and functions are instead accessed via the class, i.e. `SomeClass.someData` and `SomeClass.someFunction()`.

If this all sounds a little too abstract, let's consider a class to represent circles again (like we did in the previous instalment). The value of Pi is clearly associated with the concept of a circle, but is it a property that varies from circle to circle? No it is not! It's related to all circles, and all circles have its one value in common. This means it should be added as a class data attribute, not an instance data attribute (like we did in the previous instalment).

Similarly, a function for testing whether of not a given value is a reference to an instance of our circle class is clear related to our circle class. However, it would make no sense to add it as an instance function, because it would not be encapsulated into anything that was not an instance of our class! Clearly, this should be a class function.

## Class Data Attributes in JavaScript

In this series-within-a-series we are confining ourselves to the modern JavaScript OO syntax, so, in our world, the correct way to add class data attributes is with getters and setters that have been pre-fixed with the keyword `static`.

In the most advanced version of our example `Circle` class from the previous instalment we used getters and setters to create a read-only instance data attribute named `π`:

```js
class Circle{
  // …
  
  get π(){
    return 3.1415;
  }
  
  set π(pi){
    throw new Error('π is a read-only attribute');
  }
  
  // …
}
```

To convert π from an instance data attribute to a class data attribute we simple add the keyword `static` before the `get` and `set` keywords:

```js
class Circle{
  // …
  
  static get π(){
    return 3.1415;
  }
  
  static set π(pi){
    throw new Error('π is a read-only attribute');
  }
  
  // …
}
```

// TO DO create and link circle5.js and pbs97a.html

Using the JavaScript console we can demonstrate that our `Circle` class now has a data attribute named π:

```js
console.log( Circle.π ); // logs 3.1415
```

We can also prove that this data attribute is no longer encapsulated into instances of our class:

```js
const unitCircle = new Circle(1);
console.log(unitCircle.π); // logs undefined
```

## Class Functions in JavaScript

Functions within classes are also marked as being class functions rather than instance functions by pre-fixing them with the keyword `static`.

For example, we can create a class function named `isCircle()` like so:

class Circle{
  // …
  
  static isCircle(val){
    if(val instanceof Circle){
      return true;
    }
    return false;
  }
  
  // …
}
```

We can now use this function like so:

```js
const unitCircle = new Circle(1);
const boogers = 42;
console.log(Circle.isCircle(unitCircle)); // logs true
console.log(Circle.isCircle(boogers)); // logs false
```