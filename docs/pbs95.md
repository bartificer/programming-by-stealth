# PBS 95 of X — Better JavaScript Class Attributes

This is the third instalment of our step-by-step introduction to Object Oriented (OO) programming, and OO in JavaScript in particular. We started by looking at the foundation upon which OO is built — encapsulation. Encapsulation allows us to combine all the data and functions related to a concept or thing into a single object.  In the previous instalment we looked at how we can use classes to construct arbitrarily many similar objects. In effect, a class represents a concept or thing in the abstract, and each object constructed by that class is a concrete example of the concept or thing. To illustrate this point we created a class to represent imaginary currencies, and then used it to built objects representing the Ferengi Bar of Gold-pressed Latinum the Quatloo, both from the Star Trek universe.

Last time we focused almost entirely on the most important function within any class — the constructor. We started with a very simple constructor that required all supported attributes be passed, and we did no error checking. We steadily improved our constructor until we had one that implemented data coercion, data validation, default values, and multiple function signatures. The final example really was the proverbial Rolls Royce of constructors!

There is of course more to classes than their constructor functions, so we ended the last instalment by demonstrating how vulnerable our data attributes were to *dirty data*. While the constructor did great data validation, there was no validation at all on future assignments of new values to any of the data attributes.

This instalment is entirely dedicated to giving our classes better data attributes through a very powerful JavaScript feature — *getters and setters*.

## Instalment Resources

This instalment uses 8 example files:

* [Download ZIP File](https://rawcdn.githack.com/bartificer/programming-by-stealth/768996abb5fcc057af01b0593ab50c8a4af6149d/instalmentZips/pbs95.zip)
* [View source code online at GitHub](https://github.com/bartificer/programming-by-stealth/tree/master/instalmentResources/pbs95)
* View the four HTML files in your browser:
	* [`pbs95a.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/f8650097b4e2fc0952eca4d15343d185a4bd22cc/instalmentResources/pbs95/pbs95a.html)
  * [`pbs95b.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/f8650097b4e2fc0952eca4d15343d185a4bd22cc/instalmentResources/pbs95/pbs95b.html)
  * [`pbs95c.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/f8650097b4e2fc0952eca4d15343d185a4bd22cc/instalmentResources/pbs95/pbs95c.html)
  * [`pbs95d.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/f8650097b4e2fc0952eca4d15343d185a4bd22cc/instalmentResources/pbs95/pbs95d.html)

## Matching Podcast Episode

Listen along to this instalment on [episode 637 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2020/05/ccatp-637/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_05_02.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_05_02.mp3" >Download the MP3</a>

## The Problem to be Solved

As we've already described, the final implementation of the `ImaginaryCurrency` class from the previous instalment (`ImaginaryCurrency4.js`) implements a best-practices constructor that's  both flexible and robust.

We can demonstrate the flexibility using the JavaScript console in the file `pbs94d.html` from the previous instalment:

```js
// call the constructor without any arguments
const genericImaginaryCurrency = new ImaginaryCurrency();
$OUT_HTML.append(genericImaginaryCurrency.describeHTML());

// call the constructor specifying only 2 most common attributes
const monopolyDollar = new ImaginaryCurrency(
    'Monopoly Dollar',
    'the currency from the board game <a href="https://en.wikipedia.org/wiki/Monopoly_(game)" target="_blank" rel="noopener">Monopoly</a>'
);
$OUT_HTML.append(monopolyDollar.describeHTML());

// call the constructor specifying some attributes
const buck = new ImaginaryCurrency({
    name: 'Buck',
    descriptionHTML: 'the US Dollar really',
    symbolHTML: '💵'
});
$OUT_HTML.append(buck.describeHTML());

// call the constructor specifying all values
const iou = new ImaginaryCurrency({
    name: 'IOU',
    descriptionHTML: 'money borrowed with every good intention to replay it in the vague future',
    symbol: '💸',
    symbolHTML: '<i class="fas fa-comment-dollar mx-1" title="$" aria-hidden></i><span class="sr-only">$</span></i>',
    numDecimalPlaces: 1
});
$OUT_HTML.append(iou.describeHTML());
```

We can also demonstrate the constructor's robustness:

```js
// numbers are coerced when posible
const bitcoin = new ImaginaryCurrency({
    name: 'Bitcoin',
    descriptionHTML: 'the leading crypto-currency',
    symbol: 'BTC',
    symbolHTML: '<i class="fab fa-bitcoin mx-1" title="BTC" aria-hidden></i><span class="sr-only">BTC</span></i>',
    numDecimalPlaces: "8" // string not number
});
$OUT_HTML.append(bitcoin.describeHTML());
const mathGeekDollar = new ImaginaryCurrency({
    name: 'Math Geek Dollar',
    descriptionHTML: 'the US Dollar as used by math geeks',
    numDecimalPlaces: Math.PI // decimal number not integer
});
$OUT_HTML.append(mathGeekDollar.describeHTML());

// errors are thrown when un-coerceably-invalid values are passed
const imaginaryDollar = new ImaginaryCurrency({
	numDecimalPlaces: '√-1'
});
// throws TypeError since '√-1' is a string that doesn't parseInt()
// message: 'if passed, details.numDecimalPlaces must be an integer greater than or equal to one'
const negativeDollar = new ImaginaryCurrency({
	numDecimalPlaces: -2
});
// throws RangeError since -2 is a number, but not valid
// message: 'details.numDecimalPlaces cannot be less than zero'
```

Clearly, the constructor is doing a good job of protecting the integrity of the data attributes it adds into the instance objects it constructs.

However, if we access the attributes directly, this version of the class produces instances that are powerless to protect themselves from invalid changes to attribute values:

```js
const evilDollar = new ImaginaryCurrency('Evil Dollar');
evilDollar.numDecimalPlaces = '😈'; // invalid value!!!
$OUT_HTML.append(evilDollar.describeHTML());
$OUT_HTML.append(`PI as evil dollars is ${evilDollar.asHTML(Math.PI)}`);
```

The constructor would never have let us set the number of decimal places to an emoji, but we can easily bypass that protection by simply setting the number of decimal places after the constructor has finished creating the instance. As things stand we can protect the initial values of our attributes, but they're defenceless after that. **We need to give our attributes perpetual protection from invalid values!**

## *Getters & Setters* — Functions in Disguise!

The concept of *getters & setters* is not unique to JavaScript, but it's also far from ubiquitous. Some languages have them, but many (including PHP) don't.

Both getters and setters are functions masquerading as data attributes. From the point of view of the programmer _writing_ the class, a getter is a function that takes no arguments and returns a value, and a setter is a function that takes exactly one argument, and doesn't return a value. But, from the point of view of a programmer _using_ a class with getters and setters, each pair behaves like a single data attribute, but not just any data attribute, a data attribute with super-powers 🙂

Without knowing it, we've been interacting with getters and setters when using built-in JavaScript classes. As an example, we think of `Math.PI` as a data attribute because we simply use it like any other variable. We don't treat `Math.PI` like a function, if we did, we would write `Math.PI()`! No, we treat `Math.PI` like a variable that someone else happened to define for us and make available to us in the global scope. If we wanted to simulate the behaviour we could do something like:

```js
var NaiveMath = { PI: Math.PI };
console.log(`Naive π is ${NaiveMath.PI} and real π is ${Math.PI}`);
```

Unsurprisingly, this will log:

 ```
 Naive π is 3.141592653589793 and real π is 3.141592653589793
 ```

Now let's try to be evil 😈

```js
NaiveMath.PI = 4;
Math.PI = 4;
```

Neither of the above lines threw an error, so you might assume both had the same effect. Let's test that assumption:

```
console.log(`Naive π is ${NaiveMath.PI} and real π is ${Math.PI}`);
```

You probably expected to see:

```
Naive π is 4 and real π is 4
```

But that's not what happened! What actually got logged was:

```
Naive π is 4 and real π is 3.141592653589793
```

The data attribute `Math.PI` has a superpower — it appears to be immutable. How is that possible? If you were to peek under the hood what you would find is that Math.PI is actually a function not a data attribute, but it's being disguised using a JavaScript *getter*!

We'll look at the getter and setter syntax in detail in a moment, but for now, let's quickly prove that `Math.PI` is not magical because it's part of a built-in object, it's just using a standard language feature that we're free to use in our code too. Here's a `SmartMath` object written using a getter which behaves just like the built-in `Math` object:

```js
const SmartMath = {
    get PI(){ return Math.PI; }
};
console.log(`Smart π is ${SmartMath.PI} and real π is ${Math.PI}`);
```

As you probably expected, this logged:

```
Smart π is 3.141592653589793 and real π is 3.141592653589793
```

Now let's try be evil again:

```js
SmartMath.PI = 4;
Math.PI = 4;
```

Again, no errors were thrown, so, have we actually altered a fundamental constant of the universe? Nope!

```js
console.log(`Smart π is ${SmartMath.PI} and real π is ${Math.PI}`);
```

Even after we apparently changed both `PI` attributes to four, the above still logged:

```
Smart π is 3.141592653589793 and real π is 3.141592653589793
```

We've produced what appears to be a data attribute with super-powers!

### Getters & Setters Can be Used in Any Encapsulated Object

JavaScript getters and setters pre-date ES6, and hence, pre-date the `class` keyword. They can be used within any encapsulated object.

However, in this instalment we're only going to look at their use in class definitions.

## Robust JavaScript Class Attributes with Getters and Setters

Getters and setters have all kinds of uses in JavaScript, but we're going to use them first and foremost to protect our classes' data attributes.

When I first introduced the concept of encapsulation I mentioned that in some languages, encapsulation provides access control to data attributes, but that JavaScript is not one of those languages. Protection of attributes is what we're trying to achieve, but the language doesn't support that, so we have to make do with an approximation 🙁 We can come close to true access control by combining the power of JavaScript getters and setters with a commonly accepted convention.

### Thou Shalt Pretend Underscores Bestow Invisibility!

Since JavaScript does not support actual access control to data attributes or instance functions, a near-universally accepted convention has emerged — the authors of JavaScript classes name attributes and functions not intended for direct access by users of their classes with names pre-fixed with the underscore character. They also omit all such attributes and functions from their API documentation. This means that unless you read the source of third party libraries, you'll never know that they contain a whole bunch of *'private'* attributes and functions who's names all start with underscores.

**If you want JavaScript classes written by others to behave reliably when you use them, never ever access any attribute or call any instance function with a name starting with an underscore.**

Conversely, **when writing your own classes, always mark data attributes and instance functions that you want others to avoid directly accessing or calling by naming them with a leading underscore**.

### Creating Attributes with Getters & Setters

To add a single attribute with the potential to develop superpowers to a class you need three things:

1. A *'private'* data attribute to store the sanitised value.
2. A *getter* to publish the value of the attribute.
3. A *setter* to intelligently update the value of the attribute.

Let's demonstrate the concept with a very simple class, one to represent a circle. You'll find a version of the code for this class with comments in the file `Circle1.js`, but I've included it below without comments to help show the structure.

```js
class Circle{
    constructor(radius=1){
        const radiusNumber = parseFloat(radius);
        if(isNaN(radiusNumber)){
            throw new TypeError('radius must be a number greater than or equal to zero');
        }
        if(radiusNumber < 0){
            throw new RangeError('radius cannot be negative');
        }
        this._radius = radiusNumber;
    }
    
    get radius(){
        return this._radius;
    }
    
    set radius(radius){
        this._radius = radius;
    }
}
```

Notice that the syntax for the getter is just like that of an instance function that takes no arguments, but pre-fixed with the keyword `get`. Similarly, the syntax for the setter is like that for an instance function that takes one argument, but pre-fixed with the keyword `set`.

To users of the class, the `radius` attribute behaves like any other data attribute. You can interact with this class by opening a JavaScript console on the file `pbs95a.html`:

```
const circle1 = new Circle(5);
console.log(`radius=${circle1.radius}`);
circle1.radius = 3;
console.log(`radius=${circle1.radius}`);

// output:
// -------
// radius=5
// radius=3
```

Note that this attribute has not developed any superpowers yet:

```
const circle2 = new Circle();
console.log(`radius=${circle2.radius}`);
circle2.radius = '😈';
console.log(`radius=${circle2.radius}`);
// output:
// -------
// radius=1
// radius=😈
```

Let's add the needed super powers by simply moving the data validation code from the constructor to the setter. You'll find the code for this updated version of the class in the file `Circle2.js`. Again, the version in the file is well commented, but I've included an un-commented version below which shows the structure more clearly:

```js
class Circle{
    constructor(radius=1){
        this.radius = radius;
    }
    
    get radius(){
        return this._radius;
    }
    
    set radius(radius){
        const radiusNumber = parseFloat(radius);
        if(isNaN(radiusNumber)){
            throw new TypeError('radius must be a number greater than or equal to zero');
        }
        if(radiusNumber < 0){
            throw new RangeError('radius cannot be negative');
        }
        this._radius = radiusNumber;
    }
}
```

Notice that the entire body of the original constructor has been moved to the setter, and the entire constructor has been replaced by a single use of the setter.

This simple re-structuring of the code has made the class much more robust, and ensures that the identical data validation code is always applied to the radius, regardless of whether it was passed as an argument to the constructor, or set later using the assignment operator (`=`).

Using the JavaScript console on the file `pbs95b.html` we can now see that our attribute has gained the desired superpowers:

```
const myCircle = new Circle();
console.log(`radius=${myCircle.radius}`);
myCircle.radius = '😈'; // throws an error!
```
## Getters & Setters Can Do Much More Than Data Validation

We've now solved the obvious shortcoming we ended the previous instalment describing, but that's not all we can use getters and setters for when defining classes. They provide us with two more very powerful features — what I refer to as *derived data attributes*, and of course, *read-only* data attributes.

### Derived Data Attributes with Getters & Setters

It's not unusual for a class to need to represent two pieces of data that are directly related to each other. Circles have a radius and a diameter, and one is always twice the other. You could leave it to users of your class to know that relationship, and, to add the maths to do the conversion into their code, but that doesn't seem very user-friendly. What's the point of writing a circle class at all if it can't handle the math! One approach to adding the math to the class might be to add functions to calculate and return the diameter, and to set the radius based on a given diameter. You could do this with two separate instance functions named something like `.getDiameter()` and `.setDiameter()`, but you could also use a single function with two signatures. Below is an example of a single function which performs both tasks. You could add this into the `Circle` class as an instance function:

```js
diameter(d){
  // if no args were passed, return the current diameter
  if(arguments.length === 0) return 2 * this.radius;
  
  // otherwise set the radius to half the diameter
  this.radius = d/2;
}
```

This would work, but users of your class would need to remember that `radius` is a data attribute, but `diameter()` is an instance function. Your users would need to write code something like this:

```js
const myCircle = new Circle();
myCircle.radius = 5;
console.log(`radius=${myCircle.radius} & diameter=${myCircle.diameter()}`);
myCircle.diameter(6);
console.log(`radius=${myCircle.radius} & diameter=${myCircle.diameter()}`);
```

Notice that the code has to treat the radius like it's a data attribute, i.e. `myCircle.radius` to get the value, and `myCircle.radius = newValue` to set the value. But, the code has to treat the diameter as a two-signature function. To get the current diameter we have to use `myCircle.diameter()`, and to set it, myCircle.diameter(newValue).

What we have here is an opportunity or getters and setters to shine!

Multiple pairs of getters and setters can update the value of the same *'private'* data attribute! In this case, we can add a second set of getters and setters named `diameter` to apply the appropriate math and then update the _radius *'private'* data attribute:

```js
get diameter(){
  return this._radius * 2;
}

set diameter(diameter){
  const diameterNumber = parseFloat(diameter);
  if(isNaN(diameterNumber)){
    throw new TypeError('diameter must be a number greater than or equal to zero');
  }
  if(diameterNumber < 0){
    throw new RangeError('diameter cannot be negative');
  }
  if(diameterNumber === 0){
    this._radius = 0; // avoid divide-by-zero error
  }else{
    this._radius = diameterNumber / 2;
  }
}
```

We can do something similar for any other derived property of a circle, thing like the circumference and area. You'll find all three derived attributes implemented with getters and setters in `Circle3.js`, and you can interact with this version of the class using the JavaScript console on `pbs95c.html`:

```js
const c1 = new Circle();
c1.diameter = 4;
console.log(`a circle with a diameter of 4 has a radius of ${c1.radius}, a circumference of ${c1.circumference}, and an area of ${c1.area}`);

const c2 = new Circle();
c2.circumference = 4;
console.log(`a circle with a circumference of 4 has a radius of ${c2.radius}, a diameter of ${c2.diameter}, and an area of ${c2.area}`);

const c3 = new Circle();
c3.area = 4;
console.log(`a circle with an area of 4 has a radius of ${c3.radius}, a diameter of ${c3.diameter}, and a circumference of ${c3.circumference}`);
```

### Read-Only Data Attributes with Getters & Setters — Be Assertive or Tell White Lies?

We'll end this instalment by circling back to where we started, and taking another look at read-only data attributes. The initial example used a getter to add a read-only attribute to an encapsulated object, now let's look at how to use getters and setters to add read-only attributes to classes.

The file `Circle4.js` contains an updated version of our `Circle` class with two read-only attributes added. The first additional attribute represents the value of π the instance functions will use for their calculations, and the second adds a credit for the class author. Also note that the getters and setters for all the derived attributes have been updated to use the class's new read-only π attribute rather than `Math.PI`.

For the credit I chose to take the same approach `Math.PI` does, and silently ignore attempts to assign a new value to the read-only attribute. This is done by providing a getter, but no matching setter:

```js
get classAuthor(){
  return 'Bart Busschots of Bartificer Creations at https://bartificer.net/';
}
```

 We can interact with this updated version of the class using the JavaScript console on the file `pbs95d.html`:
 
 ```js
 const c1 = new Circle();
 console.log(`The Circle class is by ${c1.classAuthor}`);
 c1.classAuthor = 'pesky plagerist';
 console.log(`The Circle class is by ${c1.classAuthor}`);
 ```
 
 I think of this approach as being a kind of programming *white lie*. Why a lie? Because if you look at the code above, an assignment operator was executed but it neither assigned a value, nor, threw an error.  The assignment operator is supposed to assign, but it didn't, and it was silent about that fact — that's dishonest! I call it a *white lie* because in an example like this, it really doesn't matter that the assignment was silently ignored.
 
If the attempted assignment is consequential, i.e. an attempt is made to alter an attribute who's value is expected to have an effect on the class's behaviour, is it still OK to silently ignore the assignment attempt? I would argue that it's not, because it could easily confuse users of the class. And worse still, this kind of white lie can lead to some extremely frustrating and difficult to track down bugs. When you're debugging code, how often do you even consider the idea that an assignment can silently fail? I think most programmers implicitly assume that an operator as fundamental as the assignment operator will always do its job, or, throw an error if it can't. I really don't think most programmers expect assignments to silently fail to assign!

My implementation of the read-only PI property in `Circle4.js` illustrates a more assertive alternative approach — don't omit the setter, define one that always throws an error instead:

```js
get π(){
  return 3.1415;
}
	
set π(pi){
  throw new Error('π is a read-only attribute');
}
```

> Note that JavaScript is fully UTF-8 aware, so you can use symbols (and even emoji) in/as variable names! To illustrate this point I named my Pi attribute `π` 🙂
{: .aside}

Now let's see what happens when we try change the value of the `π` data attribute:

```js
const c2 = new Circle();
c2.π = 3.14; // throws an error!
```

As you can see, the attempt to assign a new value to π throws an error.

So, should your classes provide forgiving but dishonest read-only attributes like `Math.PI`, or should they be assertive like the example above `π` attribute above? My advice is to **make inconsequential read-only attributes forgiving, but consequential read-only attributes assertive**.

## Final Thoughts — Where This Series is Going

We've now covered everything I had planned to cover in this third attempt at explaining OO programming in JavaScript. Because I was so afraid of failing to explain this concept a third time, my plan was to completely ignore two of the fundamental concepts of object-oriented programming — class attributes and functions, and inheritance. Since this third attempt has been a success, I'd like to round out our exploration of JavaScript with two additional OO instalments, one of class attributes and functions, and one on inheritance. As well as giving a more rounded understanding of JavaScript, this will also better prepare us for the up-coming move to PHP, because PHP's classes support both of these features too.

The next instalment will be built around my sample solution to the challenge set in PBS 92. That instalment will set a new challenge, so the following two instalments will round out our look at OO Programming JavaScript, then we'll finish our JavaScript series with a final challenge solution instalment.

So far in this series we've looked at HTML, CSS, and JavaScript. Together these three languages provide the client-side of the internet — HTML defines that structure of webpages, CSS their visual style, and JavaScript brings them to life. The world wide web is built around a client-server model, so the languages we've looked at are literally only half of the story, what about the server side? That's where PHP comes in. While there are only three prominent client-side languages, just about any language can be used on the server side. Believe it or not, you can write server-side web code in shell script, or even with Windows Batch files! So while I could pick literally any language for our move to the server (including JavaScript), I've chosen the one that's most popular in the open-source world, PHP.

It will take us some months to get comfortable on the server side, and with PHP, but when we do the next big area we'll be venturing into is data storage. Probably the single most important role server-side code plays is that of a data broker — server side web code spends the vast majority of its time reading data from a database of some kind, or writing data to a database of some kind. Databases come in all shapes and sizes, so that leaves a lot of room for future exploration!

But, before all that, our challenges are now getting big enough that you'd get real genuine value from source control. So, I'm going to insert a short diversion between JavaScript and PHP, and spend a few instalments explaining the most popular open-source source control system in use today, GIT.
