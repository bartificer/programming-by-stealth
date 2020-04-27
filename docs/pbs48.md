# PBS 48 of x – A Closer Look at ‘this’ and ‘static’

I had initially planned to return to our Cellular Automata classes and Conway’s Game of Life for this instalment, but based on some listener feedback I’ve decided to delay that by at least one instalment and dedicate this entire instalment to a closer look at just two JavaScript keywords – `this` and `static` instead. The two are more closely related that you might think.

[The ZIP file for this instalment](https://www.bartbusschots.ie/s/wp-content/uploads/2018/01/pbs48.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs48.zip) contains my sample solution to the challenge set at the end of [the previous instalment](https://bartificer.net/pbs47), the starting point for the next challenge, and a JavaScript file containing all the example code snippets that appear in this instalment.

# Matching Podcast Episode 519

Listen Along: Chit Chat Accross the Pond Episode 519

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_01_20.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_01_20.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Challenge Solution

The challenge set at the end of the previous instalment consisted of making four changes to the farm animals polymorphism demo built up as part of that instalment. You’ll find the full source code for my sample solution in this instalment’s ZIP file, but I’ll highlight the more interesting parts of the code below.

### Part 1 — Create a `Chicken` Class

This is very straight forward, it really is just about choosing some emoji really:

```JavaScript
class Chicken extends Animal{
    constructor(){
        super('🐓', '🌽', 'Cluck!');
    }
}
```

You can then add a chicken to the farm by adding an instance of this new class to the call to the `Farm` constructor in the document ready handler:

```JavaScript
$(function(){
    // initialise the farm with one animal of each kind
    bartFarm = new Farm(
        $('#the_farm'),
        new Cow(),
        new Duck(),
        new Turkey(),
        new Chicken()
    );
});
```

### Part 2 — Add a Form for Adding Animals

Adding a form is a game of two halves — first the HTML markup, perhaps including a little CSS, and then event handlers to make the form actually do something.

Let’s start with the HTML markup:

```XHTML
<form action="javascript:void(0);">
<fieldset role="form" aria-labelledby="the_farm_fm_desc">
        <legend id="the_farm_fm_desc">Add Animals</legend>
        <ul>
            <li><button type="button" id="add_cow_btn" aria-label="Add a Cow">🆕🐄</button></li>
            <li><button type="button" id="add_duck_btn" aria-label="Add a Duck">🆕🦆</button></li>
            <li><button type="button" id="add_chicken_btn" aria-label="Add a Chicken">🆕🐓</button></li>
            <li><button type="button" id="add_turkey_btn" aria-label="Add a Turkey">🆕🦃</button></li>
        </ul>
</fieldset>
</form>
```

Basically, we have a form containing a list of four buttons grouped together within a field set. To make this look decent there is also a little CSS added via a `style` tag within the head section:

```CSS
fieldset > ul {
  padding-left: 0px;
}
fieldset > ul > li {
  display: inline;
  list-style-type: none;
}
button {
  font-size: larger
}
```

All I’m doing here is rendering the list inline, and making the buttons a little larger than they would be by default so the icons within the buttons become easier to see.

Finally, we need to update the document ready handler to add click handlers to our four buttons:

```JavaScript
$(function(){
    // initialise the farm with one animal of each kind
    bartFarm = new Farm(
        $('#the_farm'),
        new Cow(),
        new Duck(),
        new Turkey(),
        new Chicken()
    );

    // add click handlers to the buttons
    $('#add_cow_btn').click(()=>{ bartFarm.addAnimal(new Cow()) });
    $('#add_duck_btn').click(()=>{ bartFarm.addAnimal(new Duck()) });
    $('#add_chicken_btn').click(()=>{ bartFarm.addAnimal(new Chicken()) });
    $('#add_turkey_btn').click(()=>{ bartFarm.addAnimal(new Turkey()) });
});
```

### Part 3 — Create an `EggLayer` Class and Re-factor `Duck` & `Chicken` to Inherit from it

Again, this is very straight forward:

```JavaScript
class EggLayer extends Animal{
    constructor(i, e, s){
        super(i, e, s);
    }
}

class Duck extends EggLayer{
    constructor(){
        super('🦆', '🐌', 'Quack!');
    }
}

class Chicken extends EggLayer{
    constructor(){
        super('🐓', '🌽', 'Cluck!');
    }
}
```

### Part 4 — Override `.getProduce()` so Egg Layers Produce Eggs

Were the challenge simply to be to get egg layers to produce eggs on demand every time the code would simply be:

```JavaScript
class EggLayer extends Animal{
    constructor(i, e, s){
        super(i, e, s);
    }

    getProduce(){
        return '🥚';
    }
}
```

However, that’s not exactly what was asked. To make things a little more complex, egg laying should be rate-limited so no single egg layer will produce an egg unless it’s been at least 100 seconds since that last time it produced an egg.

The first thing we’ll need is a new instance property to keep track of when an egg was last produced:

```JavaScript
class EggLayer extends Animal{
    constructor(i, e, s){
        super(i, e, s);
        this._lastEggAt = false;
    }

    getProduce(){
        return '🥚';
    }
}
```

I decided to represent no egg having been laid yet as false, and the last time an egg was laid as a unix timestamp (number of seconds since midnight January 1 1970).

Now we need to update `.getProduce()` to implement the rate limiting. Key to all this is the built-in function `Date.now()`, which returns the number of milliseconds since midnight on 1 January 1970. That’s almost a Unix Time Stamp, but no quite — a UTS is the number of seconds, not milliseconds, so that needs to be divided by 1,000.

We now have all we need to implement our rate limiting:

```JavaScript
class EggLayer extends Animal{
    constructor(i, e, s){
        super(i, e, s);
        this._lastEggAt = false;
    }

    getProduce(){
        const nowUTS = Math.floor(Date.now() / 1000);
        const secsSinceLastEgg = nowUTS - this._lastEggAt;
        if(this._lastEggAt === false || secsSinceLastEgg > 100){
            this._lastEggAt = nowUTS;
            return '🥚';
        }
    }
}
```

## A Closer Look at `this`

I firmly believe that the `this` keyword is one of the most challenging things for novice programmers to get their heads around. When you get fluent at programming you’ll intuitively get what `this` will mean in any given context, but, if someone asks you to explain it in one sentence, or even one paragraph, you’ll be totally flummoxed. With my excuses made up front, I’m going to try explain the `this` keyword as best as I can.

Firstly, **`this` only makes sense within functions**, so, when talking about `this`, we will always be talking about it from the point of view of the function it’s being used within.

Secondly, **`this` is a placeholder**, and its value is determined at the moment a function is executed. If the same function executes multiple times, its this placeholder can have a different value each time. What determines that value? Context, or more specifically, the way in which the function is invoked (much more on this shortly).

At various points in this series I’ve described functions as blackboxes with the arguments forming the inputs, and the return value the outputs. To understand `this` you need to broaden the analogy to allow for two separate types of input — the arguments object, and the value of `this`.

### Determining the Value of `this`

As stated previously, the value of the `this` placeholder is determined at the moment a function is invoked (executed), and it’s the way the function is invoked that determines the value. There are four ways in which a function can be invoked, three of which we’ve seen before, and one of which I’ll be introducing you to for the first time in a moment:

1.  **Direct Invocation (AKA Simple Call)**, e.g. `myFunction()` — the value of `this` will be determined by the JavaScript engine. In the web browser the global variable `window` is used. Also, note that if strict mode is enabled (we haven’t covered strict mode yet) the value will be different, probably `undefined`. To avoid weird bugs it’s best not to use `this` when writing functions designed to be directly invoked.
2.  **Indirect Invocation** (with the `.` operator), e.g. `myObject.myFunction()`, or `MyClass.myFunction()` — `this` will be a reference to the object to the left of the `.` operator. For instance functions that will be a reference to an instance of a class, and for static functions that will be a reference to the class/prototype the function belongs to (remember, in JavaScript just about everything is an object, including functions and classes/prototypes).
3.  **Constructor Invocation** (with the `new` keyword), e.g. `new MyClass()` — the value of `this` within a constructor is a reference to the object (instance) being constructed.
4.  **Programmatic Invocation** (with `.apply()` or `.call()`) — the value for `this` is directly specified while invoking the function. Don’t worry if this doesn’t look familiar to you, there’s a very good reason for that — we haven’t covered these functions yet in this series!

### Programmatic Function Invocation with `.call()` and `.apply()`

All functions in JavaScript are objects, and more specifically, all function are instances of the class/prototype `Function`. The `Function` class/prototype provides two functions which can be used to execute a function with specific values for that function’s `this` placeholder and `arguments` object. These two functions are `.apply()` and `.call()`.

The `.apply()` and `.call()` functions are extremely similar — both take the value to use for the function being invoked’s `this` placeholder as the first argument, and then the values to for the function’s `arguments` object. The difference is in how the argument values are specified.

The `.apply()` function expects the values for the arguments object to be passed as an array, while the `.call()` function expects the values for the arguments object to be passed as zero or more separate values (variadic). Assuming a function named `myFunction` exists, the following two lines of code have the identical effect:

```JavaScript
myFunction.apply('dummy this value', ['arg 1', 'arg 2', 'arg 3']);
myFunction.call('dummy this value', 'arg 1', 'arg 2', 'arg 3');
```

It’s the existence of `.apply()` and `.call()` that make it possible for 3rd party libraries like jQuery to control the value of `this` within callbacks.

Let’s look at an example:

```JavaScript
// define a function that prints its this value & args
function selfConfess(){
	console.log('called with this value:', this);
	console.log('called with arguments:', Array.from(arguments));
}

// invoke the function programmatically with .apply()
let argsArray = ['first arg', 'second arg'];
selfConfess.apply('this value', argsArray);

// invoke the function programmatically with .call()
selfConfess.call('this value', 'first arg', 'second arg');

// outputs:
// --------
// called with this value: [String: 'this value']
// called with arguments: [ 'first arg', 'second arg' ]
// called with this value: [String: 'this value']
// called with arguments: [ 'first arg', 'second arg' ]
```

## Revision: Instance -v- Static

Before we look at why you would choose to use a static function instead of an instance function when designing a class/prototype, let’s start by re-visiting the difference between these two species of function.

Both instance and static functions will always be called indirectly, that is to say, with the `.` (dot/period) operator. What differentiates them is what’s to the left of that operator. If the thing to the left is a class/prototype then you are explicitly calling a static function, and if the thing to the left is an instance of a class/prototype then you’re explicitly calling an instance function. The biggest difference between static and instance functions is the value of their `this` placeholder. Within a static function `this` is always a reference to the class/prototype the function belongs to. Within an instance function `this` will be a reference to which ever instance the function was invoked on.

Let’s build up a little dummy class to illustrate these points. Our class will have one instance property, one static property, one instance function, and one static function:

```JavaScript
// define the class
class Explainer{
	constructor(n){
		// initialise an instance variable
		this.instanceName = n ? n : 'Jane Doe';
	}

	// add an instance function
	instanceFn(){
		console.log(`instance name = '${this.instanceName}'`);
	}

	// add a static function
	static staticFn(){
		console.log(`static name = '${this.staticName}'`);
	}
}

// add a static property to the class
Explainer.staticName = 'the explainer class';
```

The key thing to remember is that static functions and static properties are properties of the class/prototype, not of instances of that class/prototype, so, we can use them without ever instantiating a single instance of the class:

```JavaScript
// demo static property and function
console.log(Explainer.staticName);
Explainer.staticFn();

// outputs:
// --------
// the explainer class
// static name = 'the explainer class'
```

Notice that the call to the static function is an indirect call, and that the thing to the left of the the `.` (dot/period) operator is the class/prototype itself (`Explainer`). This means that when the function `staticFn()` executes, its `this` placeholder will be a reference to `Explainer`, hence, `this.staticName` is a placeholder for `Explainer.staticName`.

What happens if we try to call an instance function in a static context:

```JavaScript
Explainer.instanceFn();

// Throws error:
// -------------
// TypeError: Explainer.instanceFn is not a function
```

Instance functions can’t be called on the class/prototype itself, they have to be called on an instance of the class/prototype. You can’t call instance functions without an instance!

Let’s create two instances and access our instance property and function on each:

```JavaScript
// demo instance property and function
const firstInstance = new Explainer('Alice');
const secondInstance = new Explainer('Bob');
console.log(firstInstance.instanceName);
firstInstance.instanceFn();
console.log(secondInstance.instanceName);
secondInstance.instanceFn();

// outputs:
// --------
// Alice
// instance name = 'Alice'
// Bob
// instance name = 'Bob'
```

Notice that each instance gets its own independent `instanceName` property — `firstInstance.instanceName` is `'Alice'` while `secondInstance.instanceName` is `'Bob'`. Also notice that each time the instance function executed, its `this` placeholder contained a reference to a different object.

Both times the instance function is called indirectly, but each time the thing on the left of the `.` (dot/period) operator is different. On the first call (`firstInstance.instanceFn()`) the thing to the left of the `.` is `firstInstance`, so within the function `this.instanceName` becomes `firstInstance.instanceName`. On the second call (`secondInstance.instanceFn()`) the thing to the left of the `.` is `secondInstance`, so within the function `this.instanceName` becomes `secondInstance.instanceName`. This underlines the point that the value of a function’s `this` placeholder is determined at the moment the function executes, and it changes depending on how the function is called.

Just like we can’t call an instance function in a static context (on a class/prototype), you can’t call a static function on an instance:

```JavaScript
firstInstance.staticFn();

// Throws Error:
// -------------
// TypeError: firstInstance.staticFn is not a function
```

In this initial simple example I chose not to name any static and instance properties or functions with the same name as each other. However, since they are actually completely different things, there is no reason not use the same name. A static property named `myName` and an instance property named `myName` are completely different things, as are a static function named `logName` and an instance function named `logName`. We can illustrate this point with an updated dummy class:

```JavaScript
class BetterExplainer{
	constructor(n){
		// set an instance property named myName
		this.myName = n ? n : 'Jane Doe';
	}

	// an instance function to log the instance's name
	logMyName(){
		console.log(`instance name is '${this.myName}'`);
	}

	// a static function to log the class's name
	static logMyName(){
		console.log(`static name is '${this.myName}'`);
	}
}

// set a static property named myName
BetterExplainer.myName = 'the better explainer class';
```

Again, we can interact with the static property and function without needing to instantiate an instance of the class:

```JavaScript
console.log(BetterExplainer.myName);
BetterExplainer.logMyName();

// outputs:
// --------
// the better explainer class
// static name is 'the better explainer class'
```

Clearly, based on the output, it was the static function named `logMyName` that was called, not the instance function with the same name. Why? Because the function was executed in a _static context_, that is to say, the thing to the left of the `.` (`BetterExplainer` in this case) is a class/prototype.

Now let’s instantiate two instances of our new class and interact with the instance properties and features:

```JavaScript
const firstBetterInstance = new BetterExplainer('Alicia');
const secondBetterInstance = new BetterExplainer('Robbert');
console.log(firstBetterInstance.myName);
firstBetterInstance.logMyName();
console.log(secondBetterInstance.myName);
secondBetterInstance.logMyName();

// outputs:
// --------
// Alicia
// instance name is 'Alicia'
// Robbert
// instance name is 'Robbert'
```

Again, as you can see from the output, it was the instance function named `logMyName` that was called, not the static function with the same name. Why? Again, because of context, in this case, the thing on the left of the `.` is an instance, not a class/prototype.

### Accessing a Class’s Name

At the point you declare a class, JavaScript stores the name you created it with as a string accessible via a read-only property of the class (static property) named `name`. Anonymous classes get the name `'anonymous'`.

We can see this in action with the following simple snippet:

```JavaScript
console.log(Explainer.name);
console.log(BetterExplainer.name);

// outputs:
// --------
// Explainer
// BetterExplainer
```

_**Aside:** this is why I had to call the example static and instance properties in the explainer classes `myName` rather than simply `name`._

This doesn’t look very useful at first glance, but it becomes much more so when we add inheritance into the mix.

### Inheritance and Static Functions

Firstly, static functions are inherited.

Secondly, when the static function is run, its `this` placeholder will contain a reference to the class it was called on. Why? Because it will be the thing to the left of the `.` (dot/period) operator. Perhaps somewhat counter-intuitively, this means that if you call a static function that is defined in the parent class on the child class, the function’s `this` placeholder will not hold a reference to the class that defined it, but instead, to the class that inherited it!

To illustrate this let’s first create a third even better explainer class that contains a static function that logs its class name to the console:

```JavaScript
class EvenBetterExplainer{
	constructor(n){
		// set an instance property named myName
		this.myName = n ? n : 'Jane Doe';
	}

	// an instance function to log the instance's name
	logMyName(){
		console.log(`instance name is '${this.myName}'`);
	}

	// a static function to log the class's name
	static logClassName(){
		console.log(`my class name is '${this.name}'`);
	}
}
```

Note the use of the `this` placeholder in the static function for accessing the class’s name.

We can see our new static function in action like so:

```JavaScript
EvenBetterExplainer.logClassName();

// outputs:
// --------
// my class name is 'EvenBetterExplainer'
```

Now let’s extend our even better explainer in the simplest way possible — we’ll inherit everything and add nothing:

```JavaScript
class PointlessSubClass extends EvenBetterExplainer{
	constructor(n){
		super(n);
	}
}
```

We can now prove both that static functions are inherited, and, that the `this` placeholder within them behaves as described like so:

```JavaScript
PointlessSubClass.logClassName();

// outputs:
// --------
// my class name is 'PointlessSubClass'
```

### Determining an Instance’s Class Name

Remember that the new `class` syntax is nothing more than syntactic sugar for producing a prototype. As you may remember from before we learned about the `class` keyword (or you may have purged it from your mind since the new `class` syntax is so much nicer), the constructor for a prototype is a function with the same name as the prototype itself.

When you use the keyword `new` to create an instance of a prototype JavaScript inserts a reference to the constructor function used into the instance as an instance property named `constructor`.

Because, within an instance function, `this` is a placeholder for the instance itself, you can access the constructor function that was used to create the instance with `this.constructor`. And because this function has the same name as the prototype (by definition), `this.constructor.name` will give you access to the name of an instance’s class.

We can prove this by creating one last explainer class which includes an instance method named `logClassName` that logs the name of the class an instance belongs to:

```JavaScript
class BestExplainer{
	constructor(n){
		// set an instance property named myName
		this.myName = n ? n : 'Jane Doe';
	}

	// an instance function to log the instance's name
	logMyName(){
		console.log(`instance name is '${this.myName}'`);
	}

	// an instance function to log the instance's class
	logClassName(){
		console.log(`${this.myName} is an instance of the class '${this.constructor.name}'`);
	}

	// a static function to log the class's name
	static logClassName(){
		console.log(`my class name is '${this.name}'`);
	}
}
```

We can see this instance function in action by creating an instance of this class and calling the function on it:

```JavaScript
let bestInstance = new BestExplainer('Allison');
bestInstance.logClassName();

// outputs:
// --------
// Allison is an instance of the class 'BestExplainer'
```

This will also work with inheritance. To prove that, let’s first create one final very simple subclass:

```JavaScript
class BestSubclass extends BestExplainer{
	constructor(n){
		super(n);
	}
}
```

This subclass will have inherited `BestExplainer`‘s `.logClassName()` function, and because of the power of the `this` placeholder, it will show the correct class:

```JavaScript
let bestSubclassInstance = new BestSubclass('Roberta');
bestSubclassInstance.logClassName();

// outputs:
// --------
// Roberta is an instance of the class 'BestSubclass'
```

For your convenience I’ve collected all the above snippets together into a single file named `pbs48a.js` and included it in this instalment’s ZIP file.

### Exercise — Instance or Static?

To better understand the difference between instance and static functions, let’s look at some built-in JavaScript functions we’ve been using throughout this series and try figure out which kind they are:

1.  `.reverse()`, e.g. `let myArray = [1, 2, 3]; console.log(myArray.reverse());`

    Instance or Static?

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `Array`

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `Array`

2.  `.test()`, e.g. `let myRE = /\bbooger(s)?\b/gi; console.log(myRE.test('I like boogers!'));`

    Instance or Static?

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `RegExp`

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `RegExp`

3.  `.from()`, e.g. `let myArray = Array.from(arguments);`

    Instance or Static?

    **Static** — because the thing on the left of the `.` is the built-in class `Array`

    **Static** — because the thing on the left of the `.` is the built-in class `Array`

4.  `.toUpperCase()`, e.g. `let myString = 'boogers'; console.log(myString.toUpperCase());`

    Instance or Static?

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `String`

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `String`

5.  `.push()`, e.g. `let myArray = [1, 2, 3]; myArray.push(4);`

    Instance or Static?

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `Array`

    **Instance** — because the thing on the left of the `.` is an instance of the built-in class `Array`

### Static or not?

I know what Allison and others were hoping for was a little one-line rule to tell them when to use `static`. I don’t think that’s possible. At the end of the day programming remains an art — as programmers we have a range of well-defined building-blocks at our disposal, but we still have to creatively assemble those blocks into a whole that meets our needs. What I can do in this series is strive to explain what each building block does and how it works, but I can’t give you a universal set of rules for assembling the blocks that will allow you to solve any problem — if that were possible, all programmers could be replaced with a single program that implements that algorithm!

The best I can do is offer some guidance for the use of `static`.

Firstly, in general, your classes will have much fewer static functions than instance functions. So, I’d suggest you assume an instance function until you find a reason to question that assumption.

Secondly, if your function is implementing some kind of action that’s applied to a specific instance of your class, then it is, by definition, not static.

Finally, it can be very helpful when designing a function to imagine how it will be used. Would your function make sense in a static context? Or would it only make sense when applied to a specific instance?

## A Challenge

Using the files in the folder `pbs48ChallengeStartingPoint` in this instalment’s ZIP file as your starting point, complete the tasks listed below. The starting point is simply my sample solution to the previous instalment with a few cosmetic tweaks to remove all references to PBS47.

1.  Add an instance function to the `Animal` class named `species` that returns any animal’s class name.
2.  Add an instance function to the `Farm` class named `speciesInventory` that returns a plain object where the keys are species names and the values are the number of animals of that species present. Be sure to use the `.species()` function created in the previous task to build this inventory. If your farm has three cows, one duck, two turkeys and five chickens `.speciesInventory()` should return: `{ Cow: 3, Duck: 1, Turkey: 2, Chicken: 5 }`. Remember that the object representing the farm you see on the page is stored in the global variable `bartFarm`, and that you can access that variable from your browser’s JavaScript console.
3.  Update the `Farm` class’s constructor so it creates an additional `<div>` inside the farm’s existing container `<div>` (using jQuery). You should give the `<div>` you create the class `farm_inventory`. (hint, the constructor already creates two similar `<div>`s with the classes `farm_pasture` & `farm_shed`.)
4.  Update the `Farm` class’s `.addAnimal()` function so it writes the current inventory to the farm’s inventory `<div>`.
5.  Add a static function named `isAnimal()` to the Animal class. This function should take one argument, and return `true` if the object passed is an instance of the class `Animal`, or any subclass of that class. You should use the `instanceof` operator. Be careful not to use the `this` placeholder this time – we always want to check against the `Animal` class, even when invoked via a subclass.
6.  Add a static function to the `Animal` class named `areSameSpecies`. This function should take two arguments. If either argument is not an `Animal`, the function should return `false`. If both are `Animals` it should return `true` if both are of the same species, and `false` otherwise.

## Final Thoughts

Hopefully this instalment has helped you get a better grip on the role `this` plays in JavaScript, and on just what it means for a function to be declared as `static`. If not, please leave some constructive feedback to that effect below.

I haven’t fully decided on what we’ll do in the next instalment, but it will definitely be focused on knowledge consolidation rather than learning new concepts.
