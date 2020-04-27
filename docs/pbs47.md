# PBS 47 of x – ES6 Polymorphism

In this instalment we’ll wrap up our look at new features added to JavaScript with the release of ES6. We haven’t come even close to looking at all the new features brought by ES6, instead, we’ve just looked at a curated selection of some of the most useful new features.

Thanks to the power of the new class syntax introduced as part of ES6, we can now learn about two really important object oriented concepts which I had previously been avoiding because of how horrible the old syntax was. What we’ll be looking at are the very closely related concepts of inheritance and polymorphism.

To illustrate the concepts, and to lay the ground work for this instalment’s challenge, we’ll be making our way through a worked example. You can find the code in this instalment’s ZIP file, which you can [download here](https://www.bartbusschots.ie/s/wp-content/uploads/2017/12/pbs47.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs47.zip).

# Matching Podcast Episode 517

Listen Along: Chit Chat Across the Pond Episode 517

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_01_06.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_01_06.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Challenge Solution

The challenge set at the end of the previous solution was to update both the `bartifier.ca` prototypes and the matching test suite so they both make us of arrow functions and the `class` keyword as appropriate.

I’ve published my sample solution to GitHub as the [`PBS46-Challenge-Solution` release](https://github.com/bbusschots/bartificer_ca_js/tree/PBS46-Challenge-Solution).

### The Test Suite

There are no prototypes defined within the test suite, so there were no opportunities to use the `class` keyword. However, since QUnit relies very heavily on callbacks, there were a lot of anonymous functions to be considered for conversion to arrow functions.

Remember that the defining feature of an arrow function is that it does not get its own `this`, but instead shares it’s nearest containing true function’s `this`. Sometimes that behaviour is a help, sometimes it’s a hindrance, and sometimes it’s irrelevant. Each anonymous function definition had to be evaluated on its own merit.

Most of the anonymous functions in the test suite make no use of `this` at all, so they’ll work just the same as regular functions or arrow functions. In those situations I chose to convert because the arrow function syntax is shorter, but that’s just a preference for shorter code on my part.

I just find this:

```JavaScript
a.throws(
    ()=>{ const c1 = new bartificer.ca.Automaton(); },
    TypeError,
    'throws error when called with no arguments'
);
```

Easier to read than:

```JavaScript
a.throws(
    function(){
        const c1 = new bartificer.ca.Automaton();
    },
    TypeError,
    'throws error when called with no arguments'
);
```

There were of course anonymous functions within the test suite where conversion to arrow functions was not an option. A recurring example is QUnit modules that make use of the `beforeEach` hook to re-initilaise some sample data before each test. The sample data initialised within that hook needs to be saved into `this`, and it needs to be accessed via `this` within the module’s tests, so, neither the callback for the hook itself, nor, the callbacks for the tests can be converted to arrow functions. For example, the following regular functions remain in my sample solution:

```JavaScript
QUnit.module(
    'read-only accessors',
    {
        beforeEach: function(){
            this.$td = $('<td></td>');
            this.x = 10;
            this.y = 20;
            this.c1 = new bartificer.ca.Cell(this.$td, this.x, this.y);
        }
    },
    ()=>{
        QUnit.test('.$td()', function(a){
            a.expect(3);

            // make sure the accessor exists
            a.strictEqual(typeof this.c1.$td, 'function', 'function exists');

            // make sure the accessor returns the correct value
            a.strictEqual(this.c1.$td(), this.$td, 'returns the expected value');

            // make sure attempts to set a value throw an Error
            a.throws(
                ()=>{ this.c1.$td($('<td></td>')); },
                Error,
                'attempt to set throws error'
            );
        });

        // ... more tests

    }
);
```

Notice that we do choose to use an arrow function for the callback within the `throws` test, because we actually want the test’s `this` here.

In fact, making this change highlighted a repeated hidden bug in my test suite.

A `throws` test passes if an error is thrown. This means that if you make a syntax mistake inside one that causes an error to be thrown, the test will pass, but for the wrong reason. The original code for this test looked like this:

```JavaScript
a.throws(
    function(){ this.c1.$td($('<td></td>')); },
    Error,
    'attempt to set throws error'
);
```

This test passed, because the code above will always throw an error. Why? Because it tries to use the test’s `this` from within a regular function, not an arrow function! For this code to work properly without the use of an arrow function it should read:

```JavaScript
const self = this;
a.throws(
    function(){ self.c1.$td($('<td></td>')); },
    Error,
    'attempt to set throws error'
);
```

This subtle bug was repeated throughout my test suite, but has now been fixed where ever I found it.

### The Prototypes

Before converting the prototypes to classes I started by looking for potential arrow functions, I found just two, the self-executing anonymous function that creates our names space, and a perfect example of arrow functions removing the need for a temporary `self` variable.

The self executing function simply becomes:

```JavaScript
((bartificer, $, undefined)=>{
  // ...
})(bartificer, jQuery);
```

The `self` example is more interesting, and can be found in the `bartificer.ca.Automaton`‘s `.start()` function:

```JavaScript
bartificer.ca.Automaton.prototype.start = function(ms){
    // if we are already in stepping mode, do nothing
    if(this._autoStepID) return this;

    // if we were passed an interval, set it
    if(arguments.length >= 1){
        this.autoStepIntervalMS(ms); // could throw an error
    }

    // take one step
    this.step();

    // define a callback to automatically take a step
    const self = this;
    const autoStepFn = function(){
        if(self._autoStepID){
            // take a step
            self.step();

            // set a fresh timeout - CAUTION: recursive code!
            self._autoStepID = window.setTimeout(autoStepFn, self.autoStepIntervalMS());
       }
    };

    // set the ball rolling
    this._autoStepID = window.setTimeout(autoStepFn, this.autoStepIntervalMS());

    // return a reference to self
    return this;
};
```

This is a classic example of the `const self = this` anti-pattern.

The reason we have to declare `self` is so we can access the outer function’s `this` from within the anonymous function. If we replace the anonymous function with an arrow function we get access to the outer `this` automatically, so the code becomes simpler and more readable:

```JavaScript
bartificer.ca.Automaton.prototype.start = function(ms){
    // if we are already in stepping mode, do nothing
    if(this._autoStepID) return this;

    // if we were passed an interval, set it
    if(arguments.length >= 1){
        this.autoStepIntervalMS(ms); // could throw an error
    }

    // take one step
    this.step();

    // define a callback to automatically take a step
    const autoStepFn = ()=>{
        if(this._autoStepID){
            // take a step
            this.step();

            // set a fresh timeout - CAUTION: recursive code!
            this._autoStepID = window.setTimeout(autoStepFn, self.autoStepIntervalMS());
        }
    };

    // set the ball rolling
    this._autoStepID = window.setTimeout(autoStepFn, this.autoStepIntervalMS());

    // return a reference to self
    return this;
};
```

## Inheritance & Polymorphism

JavaScript is, and will always remain, a prototyped language, so technically speaking we should describe what would be classes in other languages as _prototypes_. However, since the introduction of the `class` keyword for creating prototypes in ES6, it’s become acceptable to talk about _JavaScript classes_, so from now on I’ll use the word _class_ as a synonym for _prototype_. But, I must stress the point that **in JavaScript, classes are prototypes**.

Before we begin, I also want to note that what we’re about to discuss now is not in any way specific to JavaScript — the related concepts of inheritance and polymorphism are universal within Object Oriented Programming.

### Some Revision — Basic Classes (AKA Prototypes)

Object Orientation is not new to us. We’ve been doing it for months now. An object is a data structure that somehow encapsulates some data, and, some code for manipulating that data in some way. It is possible to build bespoke single-instance objects, but it’s much more useful to define templates from which arbitrarily many objects of the same kind can be created.

That’s what a class/prototype is — a template for building objects. Each object built from a given class is said to be an instance of that class. If we defined a class named `Booger`, and used it to create an object named `bigBooger`, then we would say that _`bigBooger` `is a` `Booger`_.

Classes define the named pieces of data that every instance of that class will have — these are known as _instance properties_, or more commonly just _properties_. For example, our `Booger` class’s constructor may create a `._colour` property within each instance. Instance properties are accessed via specific instances of a class. For example, so if you had an object named `bigBooger` that was an instance of the class `Booger`, then you would address its `._colour` property as `bigBooger._colour`. Every instance of a class gets its own entirely separate copy of every instance property. So, if we had two instance of the `Booger` class, one named `bigBooger` and one named `littleBooger`, then `bigBooger._colour` and `littleBooger._colour` would be entirely independent variables, assigning a new value to one would have no effect on the other.

Classes also define functions that can be applied to every instance of that class — these are known as _instance functions_. For example, our `Booger` class might define a `.toString()` instance function. Instance functions are always called on instances of a class. For example, if `bigBooger` was an instance of the class `Booger`, then you would call the `.toString()` function on that instance like so: `bigBooger.toString()`.

Finally, classes can define variables and functions that belong to the class itself and not to instances of the class. These are known as _static properties_, and _static functions_. Static properties and functions are accessed via the class name. For example, if our `Booger` class defined a static property named `synonyms`, then it would be accessed as `Booger.synonyms`, and if our `Booger` class defined a static function named `.isBooger()`, then it would be accessed as `Booger.isBooger()`.

### Relationships Between Classes

Object oriented programming is not just about building stand-alone classes, it’s just as much about defining relationships between classes.

The simplest of these relationships is the so-called _“has a”_ relationship.

We’ve already been creating _has a_ relationships between our classes, I just haven’t been using that term to describe such relationships.

As an example, let’s look at the [bartificer.ca API](https://github.com/bbusschots/bartificer_ca_js) for creating cellular automata. This API defines two classes, `bartificer.ca.Cell`, and `bartificer.ca.Automaton`.

The constructor for `bartificer.ca.Automaton` initialises an instance property named `._grid`. This property is a 2D array of instances of the `bartificer.ca.Cell` class. By doing so, the constructor created an implicit `has a` relationship between the two classes, specifically, _`bartificer.ca.Automaton` has a `bartificer.ca.Cell`_.

### Extending Classes (Creating _Is a_ Relationships)

In the real world we are used to the concept of there being general types of a thing, and then, more specific sub types, and perhaps even sub-sub types, or sub-sub-sub types ….

We get that there are vehicles, and that all vehicles have some things in common (they all move), and that there are cars and trucks, both of which are vehicles. Both of those types of vehicle can be further sub-divided into perhaps articulated and non-articulated trucks, and SUVs, saloons (sedans for those in the US), coupés, and so on.

If we wanted to model vehicles in Object Oriented code we would start by defining a class named `Vehicle`, and adding all the properties and functions that are common to all vehicles to it. We would then create two other classes named `Car` and `Truck`, and we would establish an _is a_ relationship between `Car` and `Vehicle`, and `Truck` and `Vehicle` using _inheritance_ (AKA _subclassing_ or _extension_).

We would say that class `Car` inherits from class `Vehicle`, and class `Truck` also inherits from class `Vehicle`. It would be entirely synonymous to say that class `Car` extends class `Vehicle`, and class `Truck` also extends class `Vehicle`. Also, in this example, `Vehicle` can be descried as the _parent class_ of both `Car` and `Truck`, and both `Car` and `Truck` can be described as _child classes_ of `Vehicle`. Finally, we can say that any instance of the `Car` class _is a_ `Car`, and also, that any instance of the `Car` class _is a_ `Vehicle`.

What does it mean for one class to extend another? It means that all instance properties and all instance functions defined in the parent class are inherited by the child class. They get them for free, without having to re-define them!

So, if our _Vehicle_ class defines an instance function named `.canCarryPassegers()`, then that function can be applied to all instances of both the `Car` and `Truck` classes too. Those two classes have inherited that function from their parent class.

### Polymorphism

Inheritance is very cool and very useful, but it’s also optional! Every child class is free to re-define anything inherited from the parent.

As an example, let’s say our `Vehicle` class defines a generic instance function named `.toString()`. Both of our child classes are free to define their own `.toString()` instance function if they desire. The `Vehicle` class’s `.toString()` might simply return the string `'a generic vehicle'`, while the `Car` class’s `.toString()` function might return a string based on the car’s make and model, so perhaps something like `'a Honda Accord'`. Similarly, the `Truck` class might also define its own `.toString()` function that returns something like `'a 16-wheeler'`.

At this stage all objects that are vehicles, whether they be instances of `Vehicle` itself, or of either of the child classes (`Car` or `Truck`), have a function named `.toString()`, but what that function does depends on which class was used to build the object. So, all vehicles have a `.toString()` function, but not all vehicles have the same `.toString()` function — this makes `.toString()` _polymorphic_.

## Class Inheritance in ES6

Along with the addition of the `class` keyword, ES6 also gives us the `extends` and `super` keywords. Together, `extends` and `super` allow us to create sub-classes in JavaScript.

Let’s look at a very simplistic example to see how it works:

```JavaScript
// define a parent class
class Creature{
    constructor(n, l){
        this._name = typeof n === 'string' ? n : 'Bob';
        this._numLegs = parseInt(l) === l ? l : 4;
    }

    toString(){
        return `a ${this._numLegs} legged animal named '${this._name}'`;
    }

    pairsOfShoesNeeded(){
        return Math.ceil(this._numLegs / 2);
    }
}

// define two child classes that extend the parent
class Centipede extends Creature{
    constructor(n){
        super(n, 100);
    }
}
class Millipede extends Creature{
    constructor(n){
        super(n, 1000);
    }
}

// created instances of all three classes
const randomer = new Creature();
const charlie = new Centipede('charlie');
const mike = new Millipede('mike');

// show that all three classes share the same instance functions
console.log(`${randomer.toString()} needing ${randomer.pairsOfShoesNeeded()} pair(s) of shoes`);
console.log(`${charlie.toString()} needing ${charlie.pairsOfShoesNeeded()} pair(s) of shoes`);
console.log(`${mike.toString()} needing ${mike.pairsOfShoesNeeded()} pair(s) of shoes`);

// outputs:
// --------
// a 4 legged animal named 'Bob' needing 2 pair(s) of shoes
// a 100 legged animal named 'charlie' needing 50 pair(s) of shoes
// a 1000 legged animal named 'mike' needing 500 pair(s) of shoes
```

The following creates a class named `Millipede` that extends the class `Creature`:

```JavaScript
class Millipede extends Creature{
    // ...
}
```

In JavaScript, you **must** call the parent class’s constructor from within the child class’s constructor, because until you do, the special `this` variable remains undefined. You call the parent class’s constructor using the `super` keyword, and you can pass arguments to the parent class’s constructor, as you can see in both the `Centipede` and `Millipede` classes above.

In the example above, the parent class’s constructor instantiates two instance properties, `._name` and `._numLegs`. This means that all instances of the two child classes also get instance properties with the same names. The parent class also defines two instance methods, `.toString()` and `.pairsOfShoesNeeded()`, so those two functions can also be called on all instances of the two child classes.

Finally, with reference to the sample code above, we can say all of the following:

*   _`randomer` is a `Creature`_
*   _`charlie` is a `Creature`_
*   _`charlie` is a `Centipede`_
*   _`mike` is a `Creature`_
*   _`mike` is a `Millipede`_

So far, there is no polymorphism in our simplistic example, only inheritance.

Let’s make our `.toString()` function polymorphic:

```JavaScript
// define a parent class
class Creature{
    constructor(n, l){
        this._name = typeof n === 'string' ? n : 'Bob';
        this._numLegs = parseInt(l) === l ? l : 4;
    }

    toString(){
        return `a ${this._numLegs} legged animal named '${this._name}'`;
    }

    pairsOfShoesNeeded(){
        return Math.ceil(this._numLegs / 2);
    }
}

// define two child classes that extend the parent
class Centipede extends Creature{
    constructor(n){
        super(n, 100);
    }

    toString(){
        return `a centipede named '${this._name}'`;
    }
}
class Millipede extends Creature{
    constructor(n){
        super(n, 1000);
    }

    toString(){
        return `a millipede named '${this._name}'`;
    }
}

// created instances of all three classes
const randomer = new Creature();
const charlie = new Centipede('charlie');
const mike = new Millipede('mike');

// show that all three classes share the same instance functions
console.log(`${randomer.toString()} needing ${randomer.pairsOfShoesNeeded()} pair(s) of shoes`);
console.log(`${charlie.toString()} needing ${charlie.pairsOfShoesNeeded()} pair(s) of shoes`);
console.log(`${mike.toString()} needing ${mike.pairsOfShoesNeeded()} pair(s) of shoes`);

// outputs:
// --------
// a 4 legged animal named 'Bob' needing 2 pair(s) of shoes
// a centipede named 'charlie' needing 50 pair(s) of shoes
// a millipede named 'mike' needing 500 pair(s) of shoes
```

Before we move on to a more advanced example, just two things to note:

1.  While the constructor in a child class has to call `super()` first, that doesn’t have to be the only thing it does. Constructors in child classes can go on to initialise any additional properties they wish, or, to change the values of properties created by the parent class’s constructor.
2.  The super keyword is not just for calling the parent class’s constructor, it can be used to access any instance function defined by the parent class. For example, within any instance function in the `Centipede` class above, the `Creature` class’s `toString()` function can be accessed via `super.toString()`.

## A Worked Example

This example is somewhat contrived, but it’s cute, so hopefully that makes it memorable 🙂

With the aid of some emoji rendered at large font sizes, we’re going to build a little farm together. We’ll need a class to represent the farm as a whole, and we’ll need some classes for the different species of animal that will inhabit this farm.

Let’s start with an initial version of this little project. You’ll find all the code for it in the `pbs47a-v1` folder in this instalment’s ZIP file.

Let’s start with a very quick look at `pbs47a-v1/index.html`:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
    <title>PBS 47 — Polymorphism Demo</title>

    <!-- Import jQuery -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>

    <!-- Import the JavaScript for this Example -->
    <script type="text/javascript" src="pbs47a.js"></script>
</head>
<body>
<h1>PBS 47 — Polymorphism Demo</h1>
<h2>Bart's Farm</h2>
<div id="the_farm"></div>
</body>
</html>
```

This is a very straight-forward HTML 5 document, but I do want to draw your attention to three things:

1.  The page loads the jQuery API from the official jQuery CDN.
2.  The page loads `pbs47a.js`, which will contain all the JavaScript for this little project.
3.  The page contains an empty `div` with the ID `the_farm`.

Next, let’s look at the JavaScript file (`pbs47a-v1/pbs47a.js`).

Ahead of the `Farm` class you’ll find the definition of the variable `bartFarm` (which will hold a reference to a farm object when the page loads), then a constant `SINGLE_EMOJI_RE` (a really ugly RE which matches strings consisting of a single emoji), and finally the utility function `isSigleEmoji()`.

The file then defines the `Farm` class. A farm consists of two things, a collection of animals, and a collection of produce produced by those animals. The animals are stored in an array named `._animals`, and will be rendered to the screen in a `div` created by the constructor. The produce will simply be represented as a string inside a `div`, and again, the `div` will be created by the constructor.

The `Farm` constructor expects to be passed a jQuery object representing the container within which it should create the `div`s for the animals and the produce, and optionally, one or more animals.

Finally, the `Farm` class provides two instance methods, `.addAnimal()`, and `.collectProduce()`. The first adds an animal to the farm, and the second attempts to collect produce from each animal on the farm. Any produce collected will be appended to the produce `div`.

Here’s the code for the class:

```JavaScript
class Farm{
    constructor($container, ...animals){
        // initialise the DOM
        this._$container = $container.empty();
        $container.append($('<div>').addClass('farm_pasture'));
        $container.append($('<div>').addClass('farm_shed'));

        // initialise the animals
        this._animals = [];
        for(const a of animals){ this.addAnimal(a) ; }

        // start trying to collect produce
        this.collectProduce();
        this._productionInterval = window.setInterval(
            ()=>{ this.collectProduce(); },
            30 * 1000 // 30 seconds
        );
    }

    addAnimal(a){
        this._animals.push(a);
        a.$dom().data('animalObj', a);
        $('.farm_pasture', this._$container).append(a.$dom());
    }

    collectProduce(){
        for(const a of this._animals){
            const p = a.getProduce();
            if(p && isSigleEmoji(p)){
                $('.farm_shed', this._$container).append(p);
            }
        }
    }
}
```

Skipping to the bottom of the file, the document ready handler simply initialises the variable `bartFarm` with a new `Farm` object using the `div` with the ID `the_farm`. The call to the constructor also passes in three newly created animals:

```JavaScript
$(function(){
    bartFarm = new Farm($('#the_farm'), new Cow(), new Duck(), new Turkey());
});
```

With the ground-work laid, let’s make a start on building a collection of classes to represent the farm animals.

Since animals have many things in common, we’ll start by building a parent class to represent a generic animal, which we’ll rather un-imaginatively name `Animal`. The idea is that we’ll extend this class to create classes for specific animal species.

For the purposes of this example, animals will be represented by an emoji, they will make a given sound, and they’ll eat a single food, again, represented by an emoji. Animal objects will build their own DOM objects to represent themselves — specifically a single `div` containing multiple `span`s, one to represent the animal itself, one to represent the noise it makes, and one to represent what it eats. Clicking on the animal’s icon will cause it to make its characteristic noise by showing and then hiding a speech bubble.

Here’s the complete code for the `Animal` class:

```JavaScript
class Animal{
    constructor(i, e, s){
        // initialise the instance properties
        this._icon = isSigleEmoji(i) ? i : '🥚';
        this._eats = isSigleEmoji(e) ? e :'❓';
        this._says = typeof s === 'string' && s.length ? s : '???';

        // initialise the DOM rendering

        // start with the outter div
        this._$dom = $('<div>').css({
            display: 'inline-block',
            position: 'relative',
            width: '100px',
            height: '80px',
            margin: '10px'
        });

        // add an icon for the animal
        const $icon = $('<span>').addClass('animal-icon').text(this._icon);
        $icon.css({
            fontSize: '50px',
            position: 'absolute',
            top: '25px',
            right: '5px',
            cursor: 'pointer'
        });
        $icon.click(()=>{ this.makeNoise() });
        this._$dom.append($icon);

        // add the speech bubble (hidden)
        const $bubble = $('<span>').addClass('animal-speech-bubble').text('🗨');
        $bubble.css({
            display: 'none',
            position: 'absolute',
            top: '0px',
            left: '0px',
            fontSize: '50px'
        });
        $bubble.append($('<span>').addClass('animal-noise').text(this._says).css({
            color: 'white',
            position: 'absolute',
            fontSize: '10px',
            top: '20px',
            left: '10px',
            textAlign: 'center',
            width: '30px'
        }));
        this._$dom.append($bubble);

        // add the food icon
        const $food = $('<span>').addClass('animal-food-icon').text(this._eats);
        $food.css({
            position: 'absolute',
            bottom: '0px',
            left: '20px',
            fontSize: '15px'
        });
        this._$dom.append($food);
    }

    $dom(){ return this._$dom; }

    makeNoise(){
        if(!this._noiseTimeout){
            const $bubble = $('.animal-speech-bubble', this._$dom);
            $bubble.show();
            this._noiseTimeout = window.setTimeout(()=>{ this._noiseTimeout = 0; $bubble.hide() }, 1000);
        }
    }

    getProduce(){
        return ''; // default to delivering no produce
    }
}
```

I want to draw your attention to a few key points:

*   While the code looks quite long, most of it is just jQuery code for building the DOM elements to represent the animal.
*   Notice the use of arrow functions when adding the click handler to the animals and setting the timeout to hide the speech bubble.
*   Notice that generic animals don’t produce anything because the `.getProduce()` function returns an empty string.

We don’t want a farm full of generic animals, we want a farm with animals of a specific species, so let’s extend this base class to create classes for three species of animal:

```JavaScript
class Cow extends Animal{
    constructor(){
        super('🐄', '🌾', 'Moo!');
    }
}

class Duck extends Animal{
    constructor(){
        super('🦆', '🐌', 'Quack!');
    }
}

class Turkey extends Animal{
    constructor(){
        super('🦃', '🌽', 'Gobble!');
    }
}
```

Notice that, at least for now, our child classes are extremely simplistic — each containing only a constructor, and each constructor containing only a call to the parent class’s constructor with the appropriate arguments (using the `super` keyword).

You can now load the HTML file (`pbs47a-v1/index.html`) in your favourite browser to see our little farm, and you can click on any of the animals to get them to make their characteristic noise.

There is no polymorphism here yet, just simple inheritance, but let’s now change that and build a better version 2 of this example.

There’s something about turkeys that’s a little different to cows and ducks. It doesn’t seem wrong for the cow to just say _Moo!_, or for the duck to just say _Quack!_, but it seems weird to _‘hear’_ a turkey gobble only once. We should add a custom `.makeNoise()` function to the `Turkey` class so turkeys always gobble twice.

As it stands, the `Turkey` class doesn’t define its own `.makeNoise()` function, so the one being used is the one inherited from the `Animal` class. Once we go ahead an add a `.makeNoise()` function into the `Turkey` class, all turkeys will use this more local function instead of the one provided by `Animal`. Adding a function to a child class to replace one defined in a parent class is known as _overriding_ a function. So, in this case we want to override `Animal`‘s `.makeNoise()` function in `Turkey`.

When overriding a function it’s often useful to be able to call the original function from the parent class from within the overriding function. The `super` keyword makes this possible. As it happens (or more correctly, because I engineered it to be so), this is such a case — the code in the parent class allows us to gobble once, so rather than re-inventing the wheel, we should call that function twice from within our overriding function.

Here’s our updated Turkey class with the overriding `.makeNoise()` function marked:

```JavaScript
class Turkey extends Animal{
    constructor(){
        super('🦃', '🌽', 'Gobble!');
    }

    makeNoise(){
        if(!this._double_timeout){
            super.makeNoise();
            this._double_timeout = window.setTimeout(
                ()=>{
                    this._double_timeout = 0;
                    super.makeNoise();
                },
                1250
            );
        }
    }
}
```

Notice the two calls to `super.makeNoise()` — this is the overriding function calling the original function from the parent class.

We now have a polymorphic `.makeNoise()` function. All animals can make noise, but they don’t all do so in the same way anymore.

At the moment, no animals produce anything, because none of the child classes override `.getProduce()` from `Animal`, and that function returns an empty string.

Let’s have Cows produce milk on demand by overriding `.getProduce()` in the `Cow` class:

```JavaScript
class Cow extends Animal{
    constructor(){
        super('🐄', '🌾', 'Moo!');
    }

    getProduce(){
        return '🥛';
    }
}
```

If you load this updated version into your browser (`pbs471-v2/index.html`) you’ll see a glass of milk appear in the produce lineup below the animals. One glass will show up immediately, then another every 30 seconds after that, i.e. each time the produce interval started by the `bartFarm` object (an instance of `Farm`) runs.

## A Challenge

Using the code in the `pbs471-v2` folder in this instalment’s ZIP file as your starting point, make the following improvements and additions:

1.  Create a new class `Chicken` which extends `Animal`. Use the emojis of your choice for the needed icons, and use a sensible string for the sound.
2.  Add a web form which allows users to add animals to the farm. The form should enable the user to add arbitrarily many animals of each species.
3.  Create a new class `EggLayer` which extends `Animal`, and re-factor both the `Duck` and `Chicken` classes to extend this new class rather than `Animal`.
4.  Override the `.getProduce()` function in the `EggLayer` class so it returns an egg emoji if, and only if, it’s been at least 100 seconds since the last time an egg was was produced by that specific egg layer (**Hint:** google JavaScript’s built-in `Date.now()` function).

## Final Thoughts

In the last few instalments we’ve focused heavily on learning new things:

*   How to use `let` and `const` to create lexically scoped variables
*   How to set default values on function arguments
*   How to use variadic arguments
*   How to convert array-like objects such as the `arguments` object into true arrays with `Array.from()`
*   How to explode an array with the spread operator (`...`)
*   How to iterate over arrays and strings with `for...of` loops
*   How to iterate over object keys with `for...in` loops
*   How to avoid tedious string concatenations with template literals
*   How to define classes with the `class` and `static` keywords
*   How to implement inheritance and polymorphism with the `extends` and `super` keywords

Next time we’ll pause for a little knowledge consolidation, and move back to finishing off our game of life by giving it a nicer and more capable UI.