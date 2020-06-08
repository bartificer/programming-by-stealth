# PBS 46 of x – ES6 Spread Operator, Arrow Functions & Classes

We’ll start this instalment by having a look at my sample solutions to the previous two instalments. Then we’ll move on to looking at three ES6 features, two of which are extremely significant. We’ll start by addressing an accidental oversight from the previous instalment when we looked at arrays. I had intended to cover the so-called _spread operator_ together with `Array.from()` and the `for...of` loop, but it slipped my mind. Once we’ve dealt with my little oversight, we’ll introduce an entirely new type of function that removes the need for the `const self = this` kludge for callbacks. So-called _arrow functions_ greatly simplify the use of the callback in JavaScript, and in modern JavaScript, callbacks are everywhere!

Finally, we’ll make a start on my personal favourite new feature in ES6 — classes. This major change brings JavaScript into line with the other C-style languages, and, more importantly, into line with how most programmers are used to working. This takes JavaScript objects from weird esoteric things only those initiated into the JS cult can understand at a glance to intuitively understandable constructs. For those of you for whom JavaScript is your first language, classes will be nice, but for those of you coming to JavaScript form other languages, classes will be a blessed relief!

We’ll only be covering the basics of the class keyword in this instalment. In the next instalment we’ll take things up a notch when we finally explore the concept of _polymorphism_, the heart and soul of object oriented programming.

## Matching Podcast Episode 516

Listen Along: Chit Chat Across the Pond Episode 516

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_12_21.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_12_21.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 44 Challenge Solution Update

Podcast listener Dorothy got in touch to suggest an improvement to my sample solution to the challenge set at the end of PBS 44, to begin the process of converting the test suite to ES6.

Dorothy suggested that my solution missed a golden opportunity to make use of variadic arguments, and she was completely correct!

The function in question is `dummyBasicTypesExcept()` in the test suite (`test/test.js`). In my original sample solution it looked like this:

```javascript
function dummyBasicTypesExcept(){
    // build and exclusion lookup from the arguments
    const exclude_lookup = {};
    for(let i = 0; i < arguments.length; i++){
        exclude_lookup[arguments[i]] = true;
    }

    // build the list of type names not excluded
    const ans = [];
    Object.keys(DUMMY_BASIC_TYPES).sort().forEach(function(tn){
        if(!exclude_lookup[tn]){
            ans.push(tn); // save the type name if not excluded
        }
    });

    // return the calculated list
    return ans;
}
```

This function loops over the arguments object, so it’s a perfect candidate for conversion to variadic arguments. As it stands, the function signature (`function dummyBasicTypesExcept()`) really isn’t in any way self-documenting.

So, let’s do the conversion:

```javascript
function dummyBasicTypesExcept(...excludeTypes){
    // build and exclusion lookup from the arguments
    const exclude_lookup = {};
    excludeTypes.forEach(function(et){
        exclude_lookup[et] = true;
    });

    // build the list of type names not excluded
    const ans = [];
    Object.keys(DUMMY_BASIC_TYPES).sort().forEach(function(tn){
        if(!exclude_lookup[tn]){
            ans.push(tn); // save the type name if not excluded
        }
    });

    // return the calculated list
    return ans;
}
```

The new function signature (`function dummyBasicTypesExcept(...excludeTypes)`) makes things much clearer.

I’ve published an updated version of my sample solution to GitHub as a [release tagged `PBS44-Challenge-Solution-v2`](https://github.com/bbusschots/bartificer_ca_js/tree/PBS44-Challenge-Solution-v2).

## PBS 45 Challenge Solution

The challenge was to apply our new knowledge of ES6 arrays and strings to both the `bartificer.ca` prototypes, and to the test suite.

The most common opportunity for change I found was  to replace ugly string concatenation with template literals. The following test from the test suite serves as a nice example, going from:

```javascript
a.ok(
    new bartificer.ca.Automaton($('<' + t + '></' + t + '>'), 10, 10, function(){}, function(){}),
    '$container can be a ' + t
);
```

To the much clearer:

```javascript
a.ok(
    new bartificer.ca.Automaton($(`<${t}></${t}>`), 10, 10, function(){}, function(){}),
    `$container can be a ${t}`
);
```

The `.generationChange()` instance function from the `bartificer.ca.Automaton` prototype provides an opportunity to replace a traditional `for` loop over an array with a `for...of` loop. Before the change the function looked like this:

```javascript
bartificer.ca.Automaton.prototype.generationChange = function(fn){
    // check the number of parameters
    if(arguments.length >= 1){
        // at least one parameter was passed - validate and store it

        // make sure the first parameter is a callback
        if(typeof fn !== 'function'){
            throw new TypeError('if present, the first parameter must be a callback');
        }

        // store the callback
        this._generationChange.push(fn);
    }else{
        // no parameters were passed, so execute all callbacks
        for(let i = 0; i < this._generationChange.length; i++){
            this._generationChange[i]();
        }
    }

    // return a reference to self
    return this;
};
```

This gets converted to:

```javascript
bartificer.ca.Automaton.prototype.generationChange = function(fn){
    // check the number of parameters
    if(arguments.length >= 1){
        // at least one parameter was passed - validate and store it

        // make sure the first parameter is a callback
        if(typeof fn !== 'function'){
            throw new TypeError('if present, the first parameter must be a callback');
        }

        // store the callback
        this._generationChange.push(fn);
    }else{
        // no parameters were passed, so execute all callbacks
        for(const genChangeCB of this._generationChange){
            genChangeCB();
        }
    }

    // return a reference to self
    return this;
};
```

I’ve published my sample solution to GitHub as a [release tagged `PBS45-Challenge-Solution`](https://github.com/bbusschots/bartificer_ca_js/tree/PBS45-Challenge-Solution).

## The Spread Operator (`...`)

Imagine you have an array and you want to create a new array that consists of some new elements and all the elements from the first array. To do that with pre-ES6 versions of JavaScript, you would need to do something like:

```javascript
const firstArray = ['boogers', 'snot'];
const secondArray = ['bogies'];
firstArray.forEach(function(elem){
    secondArray.push(elem);
});

console.log(firstArray);
console.log(secondArray);

// outputs:
//---------
// [ 'boogers', 'snot' ]
// [ 'bogies', 'boogers', 'snot' ]
```

Wouldn’t it be great to be able to just include the elements of the first array in the second as you declare it? Let’s try just including the first array in the second without the new spread operator and see what happens.

```javascript
const firstArray = ['boogers', 'snot'];
const secondArray = ['bogies', firstArray];

console.log(firstArray);
console.log(secondArray);

// outputs:
//---------
// [ 'boogers', 'snot' ]
// [ 'bogies', [ 'boogers', 'snot' ] ]
```

Oh dear — we get partially 2D array — the new array does not contain three strings, but instead, one string, and one array which in turn contains two strings. That’s not what we wanted!

This is where the spread operator (`...`) can help — as its name suggests, the spread operator breaks an array into pieces so each piece is seen as a separate value.

We can use the spread operator to simplify our example like so:

```javascript
const firstArray = ['boogers', 'snot'];
const secondArray = ['bogies', ...firstArray];

console.log(firstArray);
console.log(secondArray);

// outputs:
//---------
// [ 'boogers', 'snot' ]
// [ 'bogies', 'boogers', 'snot' ]
```

A particularly common use of the spread operator is to clone a simple flat array. Remember, arrays are objects, so variables hold references to arrays, not the arrays themselves. If you have an array, you can’t just make a copy like you would with a number or a string:

```javascript
const firstArray = ['boogers', 'snot'];
const secondArray = firstArray;
secondArray.push('bogies');

console.log(firstArray);
console.log(secondArray);

// outputs:
//---------
// [ 'boogers', 'snot', 'bogies' ]
// [ 'boogers', 'snot', 'bogies' ]
```

As you can see, I have not created a copy of the array, but simply created two references to the same array.

Before ES6 you had to manually clone arrays:

```javascript
const firstArray = ['boogers', 'snot'];

// clone the first array
const secondArray = [];
firstArray.forEach(function(elem){
    secondArray.push(elem);
});

// alter only the clone
secondArray.push('bogies');

console.log(firstArray);
console.log(secondArray);

// outputs:
//---------
// [ 'boogers', 'snot' ]
// [ 'boogers', 'snot', 'bogies' ]
```

With the spread operator we can simplify this code:

```javascript
const firstArray = ['boogers', 'snot'];

// clone the first array
const secondArray = [...firstArray];

// alter only the clone
secondArray.push('bogies');

console.log(firstArray);
console.log(secondArray);

// outputs:
//---------
// [ 'boogers', 'snot' ]
// [ 'boogers', 'snot', 'bogies' ]
```

## Arrow Functions (AKA _Fat Arrow Functions_)

In JavaScript, every regular function gets two special variables of its own within its scope — `arguments` and `this`.

The second of these two can be a little inconvenient. For example, when defining an instance function within a prototype, the `this` variable is a reference to the object (an instance of the prototype) the function was invoked on. Modern JavaScript makes heavy use of callbacks, so you often end up defining anonymous functions within instance functions. Within the anonymous function, `this` is no longer a reference to the object the instance function was called on, because every regular function gets its own `this`. To get around this problem a convention has become established: before defining any anonymous functions within instance functions, define a variable named `self` and assigned equal to `this`:

```javascript
var self = this;
```

Because of how scopes get nested in JavaScript, the `self` variable is available within the anonymous function. So it can then be used as a reference to the object the instance function was called on.

This is messy, and, worse still error-prone. Each time you go to type `this`, you remember to ask yourself whether or not you should be using `self` instead.

This is where arrow functions come to the rescue!

An arrow function does have its own `arguments` object, but it doesn’t have its own `this`. Instead, it inherits its `this` from the nearest regular function that contains it.

The syntax for an arrow function takes the following form (which explain the name):

```
(ARGUMENT_LIST)=>{FUNCTION_CODE}
```

As an example, let’s look at the `.start()` instance function from the `bartificer.ca.Automaton` prototype:

```javascript
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

As shown in the highlighted lines, we use a variable named `self` to preserve access to the outer `this` within the anonymous function.

With arrow functions we can simplify this code to:

```javascript
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
            this._autoStepID = window.setTimeout(autoStepFn, this.autoStepIntervalMS());
        }
    };

    // set the ball rolling
    this._autoStepID = window.setTimeout(autoStepFn, this.autoStepIntervalMS());

    // return a reference to self
    return this;
};
```

It’s only one line less of code, but now all code within the `.start()` function shares the same `this` variable, making the code a lot easier to understand and to maintain.

## Introducing Classes

JavaScript is a prototyped language. You can define your own object types by creating a custom prototype. In versions of JavaScript prior to ES6 you had to assemble the prototype from scratch without the help of any special syntax. ES6 does not in any way change how prototypes work, but it does provide a nicer syntax for defining them. You can now create prototypes using the `class` keyword.

To see how this works, let’s consider a very simplistic prototype written in the way we’re used to seeing:

```javascript
/**
 * A prototype representing a booger.
 *
 * @constructor
 * @param {string} colour - the colour of the booger. Defaults to `'green'`.
 */
function Booger(colour){
	this._colour = 'green';
	if(typeof colour === 'string'){
		this.colour(colour);
	}
}

/**
 * Get or set the booger's colour.
 *
 * @param {string} [colour] - a new colour for the booger.
 * @returns {string} the booger's colour.
 * @throws {TypeError} A type error is thrown if the `colour` paramter is
 * present but not a string.
 */
Booger.prototype.colour = function(colour){
	if(arguments.length >= 1){
		if(typeof colour !== 'string'){
			throw new TypeError('if present, the first parameter must be a string');
		}
		this._colour = colour;
	}
	return this._colour;
};

/**
 * Generate a string representation of the booger.
 *
 * @returns {string}
 */
Booger.prototype.toString = function(){
	return 'a ' + this._colour + ' booger';
};

/**
 * Get a list of synonyms for boogers.
 *
 * @returns {string[]}
 */
Booger.synonyms = function(){
	return ['snot', 'bogie', 'nasal mucus'];
};
```

The above code defines a prototype named Booger with one private property (`_colour`), one accessor method (`.colour()`), one instance function (`.toString()`), and one static function (`Booger.synonyms()`).

The sample code below uses this prototype to create and manipulate an object that is an instance of the `Booger` prototype:

```javascript
// create a yellow Booger and print it
let myBooger = new Booger('yellow');
console.log(myBooger.toString());

// change the colour and print again
myBooger.colour('yellowey-green');
console.log(myBooger.toString());

// use the static function
console.log('there are ' + Booger.synonyms().length + " synonyms for 'booger'");

// outputs:
// --------
// a yellow booger
// a yellowey-green booger
// there are 3 synonyms for 'booger'
```

With ES6 we can rewrite the prototype definition using the `class` keyword instead:

```javascript
/**
 * A class representing a booger.
 */
class Booger{
    /*
     * @param {string} colour - the colour of the booger. Defaults to `'green'`.
     */
    constructor(colour){
        this._colour = 'green';
        if(typeof colour === 'string'){
            this.colour(colour);
        }
    }

    /**
     * Get or set the booger's colour.
     *
     * @param {string} [colour] - a new colour for the booger.
     * @returns {string} the booger's colour.
     * @throws {TypeError} A type error is thrown if the `colour` paramter is
     * present but not a string.
     */
    colour(colour){
        if(arguments.length >= 1){
            if(typeof colour !== 'string'){
                throw new TypeError('if present, the first parameter must be a string');
            }
            this._colour = colour;
        }
        return this._colour;
    }

    /**
     * Generate a string representation of the booger.
     *
     * @returns {string}
     */
    toString(){
    	return 'a ' + this._colour + ' booger';
    }

    /**
     * Get a list of synonyms for boogers.
     *
     * @returns {string[]}
     */
    static synonyms(){
    	return ['snot', 'bogie', 'nasal mucus'];
    };
}
```

I want to draw your attention to three things.

Firstly, notice that all the code for the prototype is contained within a single code block, making it much easier to see where a prototype definition starts and ends, especially in files that define multiple prototypes.

Secondly, the name of the constructor function is not arbitrary. The constructor for an ES6 class must be named `constructor`.

Finally, by default, all functions are assumed to be instance functions, unless they’re explicitly marked as static functions by prefixing their definition with the keyword `static`.

### Classes & Namespaces

The `class` keyword, like the `function` keyword, can be used in two ways. As a reminder, you can declare a function like this:

```javascript
// declare a function
function sayBoogers(){
    console.log('Boogers!!! :oP');
}

// execute the function
sayBoogers();

// outputs:
// --------
// Boogers!!! :oP
```

Or like this:

```javascript
// declare a function
const sayBoogers = function(){
    console.log('Boogers!!! :oP');
}

// execute the function
sayBoogers();

// outputs:
// --------
// Boogers!!! :oP
```

The same is true of the `class` keyword, which comes in handy when working with namespaces:

```javascript
// declare a class within a nested namespace
var bartificer = bartificer ? bartificer : {};
((bartificer, undefined)=>{
    bartificer.demo = {};

    bartificer.demo.Booger = class{
        constructor(colour){
            this._colour = 'green';
            if(typeof colour === 'string'){
                this.colour(colour);
            }
        }

        colour(colour){
            if(arguments.length >= 1){
                if(typeof colour !== 'string'){
                    throw new TypeError('if present, the first parameter must be a string');
                }
                this._colour = colour;
            }
            return this._colour;
        }

        toString(){
        	return 'a ' + this._colour + ' booger';
        }

        static synonyms(){
        	return ['snot', 'bogie', 'nasal mucus'];
        };
    };
})(bartificer);

// use that class
const myBooger = new bartificer.demo.Booger('bright green');
console.log(myBooger.toString());

// outputs:
// --------
// a bright green booger
```

By the way, notice the use of an arrow function when defining the self-executing anonymous function.

## Challenge

Using your own code or [my solution to the previous challenge](https://github.com/bbusschots/bartificer_ca_js/tree/PBS45-Challenge-Solution) as your starting point, convert the `bartificer.ca` prototypes to ES6 classes, and convert the many callbacks in both the prototypes and the test suite to arrow functions as appropriate.

When it comes to converting functions to arrow functions, how many you convert is largely a matter of taste. The only ones that absolutely should be converted are the ones that use the old `const self = this` anti-pattern. Similarly, there are anonymous functions that absolutely cannot be changed to arrow functions because they need to have their own `this`.

## Final Thoughts

We’ve now covered the majority of the major changes brought to JavaScript by ES6. Most significantly we have new variable scopes, better argument handling, a whole new type of function, new types of loops, a replacement for tedious string concatenations, and an entirely new mechanism for defining prototypes. That really is quite the overhaul! Some time within the next year we’ll make the move into ES7, but don’t expect the changes to be anything even nearly as dramatic as this.

JavaScript has always had the ability to support _polymorphism_, a concept at the very heart of object oriented programming, but the syntax was so counterintuitive before ES6 that I’ve simply avoided the whole topic for fear it would alienate every reader/listener we have! The `class` keyword in combination with the `extends` keyword we’ll meet in the next instalment changes all that. We’re now finally ready to explore proper object orientation, and that’s exactly what we’ll be doing next time.
