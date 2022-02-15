# PBS 43 of x – Introducing JavaScript ES6

Because it's been a while since we focused on JavaScript, the bulk of this instalment will focus on solving the challenge set at the end of the previous instalment. We’ll work through the solution in detail, step-by-step.

We’ll finish the instalment by making a start on moving from JavaScript version 5 to JavaScript version 6, or ECMAScript 6, usually just called ES6. When we started our look at JavaScript about a year and a half ago, it made sense to use JavaScript 5, but now it’s time to upgrade our knowledge. ES6 was a very big change indeed, so we won’t bite it all off at once. Instead, we’ll focus on just one very important change in this instalment — ES6’s new take on variables.

There’s no zip file for this instalment as such. Instead, I’ve published [my sample solution as a tagged release on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS42-Challenge-Solution) instead. You can use the big green _clone or download_ button to either copy the code using GIT, or download it as a ZIP file.

## Matching Podcast Episode 509

Listen Along: Chit Chat Across the Pond Episode 509

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_11_12.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_11_12.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 42 Challenge Sample Solution

The [starting point for the challenge](https://github.com/bbusschots/bartificer_ca_js/tree/PBS42-Challenge-StartingPoint) was a working initial version of the Cellular Automata prototypes and web app (HTML page) that uses those prototypes to implement Conway’s Game of Life. The only UI on the page was a single button to move the CA one step forward.

### Part 1 — An Automatic Step Mode

The first part of the challenge was to add an automatic mode to the page, so the user can click a button to start the Game of Life running. It should then keep running until the user stops it.

This feature is not in any way specific to the game of life, but something you’d want to be able to do to any CA. So it makes sense to add the functionality into the prototypes rather than into the Game of Life web app.

There’s no single correct way to implement an automated mode like this. Two obvious options spring to mind — an interval that calls the `.step()` function repeatedly, or a recursive timeout that calls the `.step()` function and then calls itself again. (For documentation on both, see [MDN’s article on JavaScript Timers](https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers)).

This is one of those situations where there is no obvious right answer. Both an interval and a recursive timeout can be made to work, and indeed, to work well. It comes down to preference really.

When you take into account the fact that, as well as starting and stopping the automation, we also want the ability to control its speed, our two options boil down to the following big-picture algorithms:

For an interval:

*   The start button starts a new interval and saves the ID
*   The stop button cancels the interval and blanks the ID
*   Changing the speed cancels the interval and then restarts it with new settings and saves the new ID

For a recursive timeout:

*   The start button sets a flag to indicate automatic mode is active, takes a step, then sets a timeout (based on the current speed) that calls a helper function which does the following:
    *   Checks the auto-run flag, if not present, does nothing
    *   If the auto-run flag was present, it sets a new timeout to call itself with the delay being based off the currently selected speed.
*   The stop button removes the auto-run flag — the next time the timeout executes, it will do nothing, so execution will stop
*   Changing the speed doesn’t require any action — the next time the timeout executes, it will use the new speed automatically

There is no right answer. It’s purely down to preference. I like recursion, so I consider the second option easier, so that’s what I chose. Many of you probably made the other choice. As long as your code works, no problem!

Regardless of which approach you chose, the ultimate goal will be to add two functions to the `bartificer.ca.Automaton` prototype, `.start()` and `.stop()`.

Before implementing those two functions I added two new private instance variables to the prototype:

1.  A simple flag to keep track of whether or not the CA is in automatic mode
2.  The number of milliseconds to pause between automatic steps

Like the other instance variables that already exist in the prototype, these variables will be initialised within the constructor:

```javascript
/**
 * The ID of the timeout for the next automatic step, or zero if there
 * is no running timeout (the automaton is not in automatic mode).
 * @private
 * @type {number}
 * @default
 */
this._autoStepID = 0;

/**
 * The number of milliseconds between automated steps.
 * @private
 * @default
 * @type {IntervalMS}
 */
this._autoStepMS = 500;
```

Whenever we add new functionality, we should add matching tests to our test suite. So, let’s do that by adding the following two assertions to the bottom of the _‘bartificer.ca.Automaton prototype > constructor: argument processing’_ test:

```javascript
// make sure the auto-step variables initialise to the expected default values
a.strictEqual(ca1._autoStepID, 0, 'auto step timout ID initialised to zero');
a.strictEqual(ca1._autoStepMS, 500, 'auto step timout initialised to 500MS');
```

Our `.start()` and `.stop()` functions will take care of the value stored in `._autoStepID`, but we need to provide a public accessor function for the delay between automatic steps (`._autoStepMS`).

I’v chosen to store the delay between automatic steps as a whole number of milliseconds. Before we write the public accessor, we should create a private validation function to test if an arbitrary value is valid as a delay:

```javascript
/**
 * Test if a given value is a valid time period in milliseconds, i.e. a
 * whole number grater than zero.
 *
 * @memberof bartificer.ca
 * @inner
 * @private
 * @param  {*} ms - The value to test.
 * @return {boolean} `true` if the value is valid, `false` otherwise.
 * @see {@link IntervalMS}
 */
function isIntervalMS(ms){
    // make sure we got a number
    if(typeof ms !== 'number') return false;

    // make sure we have a whole number
    if(!String(ms).match(/^\d+$/)) return false;

    // return based on the size relative to zero
    return ms > 0 ? true : false;
};
```

We’re now ready to add the accessor:

```javascript
/**
 * Get or set the number of milliseconds between automatic steps.
 *
 * @param {IntervalMS} [ms] - if passed, the number of milliseconds to
 * pause between automatic steps.
 * @returns {IntervalMS}
 * @throws {TypeError} If an argument is passed and it's not valid, an error
 * is thrown.
 */
bartificer.ca.Automaton.prototype.autoStepIntervalMS = function(ms){
    // if in setter mode, try set
    if(arguments.length >= 1){
        if(!isIntervalMS(ms)){
            throw new TypeError('if present, the first argument must be a whole number greater than zero');
        }
        this._autoStepMS = ms;
    }

    // always return the current auto step interval
    return this._autoStepMS;
};
```

Again, we’ve added new functionality to our prototype. So, we need to update our test suite: this time by adding a whole new test:

```javascript
QUnit.test('.autoStepIntervalMS()', function(a){
    var mustThrow = dummyBasicTypesExcept('num');
    a.expect(7 + mustThrow.length);

    var ca = new bartificer.ca.Automaton($('<div></div>'), 5, 5, function(s){ return s + 1; }, function(){ });

    // make sure the accessor exists
    a.strictEqual(typeof ca.autoStepIntervalMS, 'function', 'function exists');

    // check that the getter fetches the default value
    a.strictEqual(ca.autoStepIntervalMS(), 500, 'get mode returns expected default value');

    // set a new valid interval and make sure we get it back
    a.strictEqual(ca.autoStepIntervalMS(100), 100, 'successfully set a new interval');

    // make sure all the disallowed basic types throw an error
    mustThrow.forEach(function(tn){
        var t = DUMMY_BASIC_TYPES[tn];
        a.throws(
            function(){
                ca.autoStepIntervalMS(t);
            },
            TypeError,
            'interval cannot be ' + t.desc
        );
    });

    // make sure non-integers throw an error
    a.throws(
        function(){
            ca.autoStepIntervalMS(Math.PI);
        },
        TypeError,
        'interval cannot be a non-integer'
    );

    // make sure negative numbers throw an error
    a.throws(
        function(){
            ca.autoStepIntervalMS(-1);
        },
        TypeError,
        'interval cannot be negative'
    );

    // make sure zero throws an error
    a.throws(
        function(){
            ca.autoStepIntervalMS(0);
        },
        TypeError,
        'interval cannot be zero'
    );

    // make sure one doesn't throw an error
    a.ok(ca.autoStepIntervalMS(1), 'interval can be one');
});
```

Now that we have the instance variables and accessors, we need to store the data that will control our automatic mode. We’re ready to implement it. Let’s start with the `.start()` function::

```javascript
/**
 * Start automatically stepping the automaton.
 *
 * If the automaton is already in automatic mode, this function does
 * nothing.
 *
 * @param {IntervalMS} [ms] - An optional interval between steps in
 * milliseconds.
 * @returns {bartificer.ca.CellylarAutomaton} Returns a reference to self.
 * @throws {TypeError} A type error is thrown if the optoinal parameter is
 * present, but not a whole number greater than zero.
 */
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
    var self = this;
    var autoStepFn = function(){
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

This function is perhaps surprisingly short, but because it contains recursion, it might make your brain hurt a little. Yes, the `autoStepFn` callback does indeed call itself, assuming automatic execution hasn’t been cancelled.

We can now test our new function by opening `sample.html` in our browser, enabling the developer tools, and entering `sampleCA.start()` in the console. That should start the game of life going, stepping forward twice a second. We haven’t written a stop function yet, so the only way to stop it for now is to refresh the page!

So, let’s resolve that obvious shortcoming by implementing `.stop()`:

```javascript
/**
 * Stop automatically stepping the automaton.
 *
 * @returns {bartificer.ca.CellylarAutomaton} Returns a reference to self.
 */
bartificer.ca.Automaton.prototype.stop = function(){
    // if we're not stepping, just do nothing
    if(!this._autoStepID) return this;

    // stop the timeout
    window.clearTimeout(this._autoStepID);

    // blank the stored timeout ID
    this._autoStepID = 0;

    // return a reference to self
    return this;
};
```

Our prototype now has the ability to run automatically, but we have no UI to allow the user to control it yet.

Let’s start with the HTML:

```html
<button type="button" id="start_btn">Start Auto Run</button>
<button type="button" id="stop_btn">Stop Auto Run</button>
```

And now let’s add event handlers (within the document ready handler):

```javascript
// add a click handler to the play and stop buttons
$('#start_btn').click(function(){
    sampleCA.start();
});
$('#stop_btn').click(function(){
    sampleCA.stop();
});
```

If you refresh `sample.html` you’ll see that we now have working play and stop buttons.

### Part 2 — A Generation Counter

The second part of the challenge was to implement a counter showing the current generation of the automaton (each step is a generation).

The first step is obviously to add another instance variable to the `bartificer.ca.Automaton` prototype to store the generation count. Here it is initialised in the constructor:

```javascript
/**
 * The genreation counter.
 * @private
 * @type {number}
 */
this._generation = 0;
```

As before, we should add a test case to the _bartificer.ca.Automaton prototype > constructor: argument processing_ test:

```javascript
// make sure the generation counter initialise to the expected initial value
a.strictEqual(ca1._generation, 0, 'generation counter initialised to zero');
```

We also need a read-only accessor function for this value:

```javascript
/**
 * A read-only accessor function to get the automaton's current generation
 * number.
 *
 * @returns {number}
 * @throws {Error} An error is thrown if the accessor is called with
 * arguments.
 */
bartificer.ca.Automaton.prototype.generation = function(){
    if(arguments.length > 0){
        throw new Error('read-only acessor called with arguments');
    }
    return this._generation;
};
```

Again, we need to add a test for this function to our test suite:

```javascript
QUnit.test('.generation()', function(a){
    a.expect(3);

    // make sure the accessor exists
    a.strictEqual(typeof this.ca1.generation, 'function', 'function exists');

    // make sure the accessor returns the correct value
    a.strictEqual(this.ca1.generation(), 0, 'returns the expected value');

    // make sure attempts to set a value throw an Error
    a.throws(
        function(){ this.ca1.generation(5); },
        Error,
        'attempt to set throws error'
    );
});
```

At this stage we have a variable for holding our generation count and a function for accessing it, but we’re not yet actually counting the generations! Clearly, we need to increment the counter whenever we move from one step to the next, and we need to set it back to zero whenever we reset the automaton to a fresh state.

To do that we need to add the following line to `bartificer.ca.Automaton.prototype.step()`:

```javascript
// finally, increment the generation counter
this._generation++;
```

And, the following to `bartificer.ca.Automaton.prototype.setState()`:

```javascript
// set the generation counter back to zero
this._generation = 0;
```

We should now add a test to verify that generation counting is working as expected:

```javascript
QUnit.test('Generation Counting', function(a){
    a.expect(3);

    var ca = new bartificer.ca.Automaton($('<div></div>'), 3, 3, function(){ return true; }, function(){}, true);

    // make sure the count starts at zero
    a.strictEqual(ca.generation(), 0, 'Automaton starts at generation zero');

    // step forward three times
    ca.step().step().step();

    // make sure the generation is now three
    a.strictEqual(ca.generation(), 3, 'generation correctly incremented');

    // set to a new state
    ca.setState(true);

    // make sure the counter was re-set to zero
     a.strictEqual(ca.generation(), 0, 'Setting new state re-sets the generation to zero');
});
```

Now that our prototype can count its generations, how do we show that count in the UI?

A good prototype is generic and reusable, so we absolutely don’t want to hard-code the counter UI into the `bartificer.ca.Automaton` prototype. What we need is functionality to allow developers using the prototype to pass the prototype a callback that the prototype will then promise to execute each time the generation changes. In other words, we need to add basic support for events.

Let’s start by adding another instance variable to the `bartificer.ca.Automaton` prototype to store a reference to the function to execute whenever the generation changes. Mind you — why only add support for a single callback? Why not allow developers to add as many listeners as they like to our generation change event? How? With an array!

As with all other instance variables, we need to initialise this new variable within the constructor:

```javascript
/**
 * The callbacks to execute whenever the generation changes.
 * @private
 * @type {function[]}
 * @default
 */
this._generationChange = [];
```

Again, we should update the test for our constructor to make sure this variable gets properly initialised by adding the following assertion:

```javascript
// make sure the generation change event handler array initialised correctly
a.deepEqual(ca1._generationChange, [], 'generation change event handler list initialised to empty array');
```

Now we need to write a function for adding callbacks into our array. Given that our prototypes rely on jQuery, it probably makes sense to copy jQuery’s convention when it comes to event handlers. Have the function add an event handler when passed a callback and execute all currently registered callbacks when called with no parameters (like `.click()` etc.):

```javascript
/**
 * A function for adding a callback to be executed whenever the generation
 * changes, or, to execute all registered geneation-change callbacks.
 *
 * When called with no parameters all callbacks are execute, when called
 * with a callback as the first parameter, that callback is registered.
 *
 * @param {function} [fn]
 * @returns {bartificer.ca.CellularAutomaton} Returns a reference to self.
 * @throws {TypeError} An error is thrown if called with parameters, and the
 * first parameter is not a callback.
 */
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
        for(var i = 0; i < this._generationChange.length; i++){
            this._generationChange[i]();
        }
    }

    // return a reference to self
    return this;
};
```

All we need to do now is call our new function with no parameters from within both the `.step()` and `.setState()` functions:

```javascript
this.generationChange();
```

Now that we have this functionality implemented, we need to add a test for it to our test suite:

```javascript
QUnit.test('Generation Change Event Handling', function(a){
    var mustThrow = dummyBasicTypesExcept('fn', 'undef');
    a.expect(mustThrow.length + 6);

    var ca = new bartificer.ca.Automaton($('<div></div>'), 3, 3, function(){ return true; }, function(){}, true);

    // make sure the function exists
    a.ok(typeof ca.generationChange === 'function', 'the .generationChange() function exists');

    // make sure running the function with no parameters when there are no registered handlers does not throw an error
    a.ok(ca.generationChange(), 'execution when no handlers are added does not throw an error');

    // make sure adding handlers works
    var cb1Execed = false;
    var cb2Execed = false;
    var cb1 = function(){ cb1Execed = true; };
    var cb2 = function(){ cb2Execed = true; };
    ca.generationChange(cb1);
    ca.generationChange(cb2);
    a.deepEqual(ca._generationChange, [cb1, cb2], 'callbacks successfully registered');

    // check parameter validation
    mustThrow.forEach(function(tn){
        var t = DUMMY_BASIC_TYPES[tn];
        a.throws(
            function(){
                ca.generationChange(t.val);
            },
            TypeError,
            "generation change callback can't be " + t.desc
        );
    });

    // make sure direct execution of all callbacks works
    ca.generationChange();
    a.ok(cb1Execed && cb2Execed, 'direct execution of generation change callbacks works as expected');

    // make sure execution via the step function works
    cb1Execed = false;
    cb2Execed = false;
    ca.step();
    a.ok(cb1Execed && cb2Execed, '.step() calls the generation change callbacks');

    // make sure execution via .setState() works
    cb1Execed = false;
    cb2Execed = false;
    ca.setState(true);
    a.ok(cb1Execed && cb2Execed, '.setState() calls the generation change callbacks');


    // make sure a reference to self is returne for function chaining
    a.strictEqual(ca.generationChange(), ca, 'returns reference to self when executing registered callbacks');
    a.strictEqual(ca.generationChange(function(){}), ca, 'returns reference to self when adding a callback');
});
```

Now that we have an event handler at our disposal we can add a generation counter to our UI. First, we’ll need to add some simple HTML markup:

```html
<label id="game_of_life_generation">Generation: <tt></tt></label>
```

Then, we need to add an event handler to our new generation change event by adding the following to the page’s document ready handler:

```javascript
// add a generation change event handler to update the counter
sampleCA.generationChange(function(){
    $('#game_of_life_generation > tt').text(sampleCA.generation());
}).generationChange();
```

### Part 3 (for extra credit) — Variable Speed

The final, optional, part of the challenge was to add a control to the UI to allow users to vary the speed of the automatic mode. In my opinion, a slider seems like the most intuitive UI for this kind of functionality, so that’s how I choose to do it. You could just as well have chosen a numeric field, a radio button group, or even a drop-down menu.

I chose to have my slider represent the speed in frames per second, that way sliding right increases the speed. Here’s the HTML markup for my slider:

```javascript
<label>Speed <input type="range" id="speed_rng" min=1 max=10 step="0.01"></label>
```

All that remains to be done at that stage is to add an event handler to this slider that converts frames per second into the number of milliseconds to pause between steps, and then sets the auto-execution timeout appropriately (again, within the document ready event handler):

```javascript
// add a change handler to the speed slider
$('#speed_rng').change(function(){
    var fps = $(this).val(); // read the frames per sec from the slider
    var ms = Math.round(1000 / fps); // convert fps to milliseconds delay
    sampleCA.autoStepIntervalMS(ms); // save the new step into the CA
}).change();
```

### A Few Other Tweaks

While I was editing the code I chose to make a few other cosmetic changes to my game of life implementation. Specifically, I added some CSS to the table representing the automaton to collapse the spacing between the cells, add a border around the automaton as a whole, add a small margin, and shrink the cells so I could make a bigger automaton:

```css
/* style the cells in the automaton */
table.bartificer-ca-automaton{
    border-collapse: collapse;
    border: 1px solid black;
    margin: 3px;
}
td.bartificer-ca-cell{
    width: 5px;
    height: 5px;
}
```

To get more cells I simply altered the call to the constructor:

```javascript
// use the constructor to build an automaton
sampleCA = new bartificer.ca.Automaton(
    $('#game_of_life_container'), // use the div as the container
    100, 200, // make it a 200x100 grid
    lifeStep, // pass the game of life step function
    renderRedGreen, // pass our red/green render function
    randomBoolean // initialise each cell to a random boolean
);
```

With the cells touching directly the patterns became more visible, but the red and green became utterly overpowering, so I changed the render function to render _dead_ cells in a lighter shade of red:

```javascript
// a render function to render live cells green and dead cells red
function renderRedGreen($td, s){
    // render a true state as green, and false as red
    if(s == true){
        $td.css('background-color', 'Green');
    }else{
        $td.css('background-color', '#ff9999');
    }
}
```

Finally, when I started to really play with the Game of Life, I found myself wanting a button to reseed the game to a fresh random state, so I added a button for that:

```html
<button type="button" id="respawn_btn">Respawn</button>
```

With a matching event handler:

```javascript
// add a click handler to the respawn button
$('#respawn_btn').click(function(){
    sampleCA.setState(randomBoolean);
});
```

The final version of this code with all the changes mentioned is [published on GitHub as a tagged release](https://github.com/bbusschots/bartificer_ca_js/tree/PBS42-Challenge-Solution).

## Introducing JavaScript ES6 (EMAScript Version 6)

When we started our exploration of JavaScript back in [instalment 12](https://pbs.bartificer.net/pbs12), I had to make a decision — what version of JavaScript should we use? ES6 was out, but browser support was patchy at best, so I chose to stick with the previous version — ECMAScript 5. So, all the JavaScript you’ve seen in this series to date has been ES5.

Well — a year and a half is a long time in tech, and things have moved on. ES7 is now the new kid on the block with the patchy support, and ES6 is now well supported in all modern browsers. So, I think the time has come to embrace ES6, and to abandon some old practices. ES6 was a very substantial upgrade to the language. It’s going to take us a few instalments to make the transition.

## Good Bye `var`, Hello `let` & `const`

In my opinion, the most significant change brought by ES6 is a complete rethink on scope, bringing JavaScript into line with just about every other language I’ve ever used. For backwards compatibility reasons, the old behaviour is not going away, but you can choose not to use it anymore by abandoning the `var` keyword. In ES6, when you use `var`, the old rules apply. However, when you use either of the new declaration keywords (`let` & `const`), the new rules apply. In very rare occasions you may actually want the old behaviour, in which case you should make the conscious decision to use `var`, but 99.9% of the time you almost certainly don’t want to do that.

### What’s Wrong with `var`?

JavaScript is generally described as being _a C-style language_. Indeed, JavaScript is very C-like in many ways, but the big exception is variable scope.

Pre-ES6 JavaScript uses _function scope_ — i.e., when you declare a variable, it exists within the function it was declared within. The other C-style languages have a narrower concept of scope — variables exist within the code block they’re declared within (_block scope_). In other words, each time you group one or more statements together within curly braces, you create a new scope.

ES6 moves JavaScript into line with the norm by moving from function scope to block scope. For backwards compatibility reasons, the change is not total. ES6 lets us have our cake and eat it by adding two new variable declaration keywords — `let` and `const`.

If you use `var`, you get a function-scoped variable, but, if you use `let` or `const`, you get a block-scoped variable.

I now have to make a confession — I’ve been perpetuating a white lie through omission. ES5 variables are not just function scoped, they are also _hoisted_. Most of the time, variable hoisting has no noticeable effect on your code, and many people find it very confusing, so, I’ve simply avoided mentioning it.

However, in ES6, variables declared with `var` will continue to be hoisted, but variables defined with `let` or `const` won’t. Now it becomes important to understand that difference.

Rather than tell you what hoisting does, I’ll show you with this very simple contrived example:

```javascript
// declare a global variable
var msg = "I'm a global!";

// declare a function with a local variable with the same name
function fn(){
    console.log(msg);
    var msg = "now I'm local!";
    console.log(msg);
}

// execute the function
fn();
```

What do you expect the output to be when this little snippet is run?

Those of you not familiar with the subtleties of variable hoisting are probably expecting it to be:

```
I'm a global!
now I'm local!
```

But, if you pop that code into a JavaScript console and run it, you’ll get the following instead:

```
undefined
now I'm local!
```

Huh? What’s going on here?

Variable hoisting means that JavaScript effectively rewrote the function above to the following before executing it:

```javascript
function fn(){
    var msg;
    console.log(msg);
    msg = "now I'm local!";
    console.log(msg);
}
```

So, **if you use `var` to declare a variable anywhere within a function, then that local variable exists within the entire function, even on the lines above your declaration!**

I tend to avoid expressing strong opinions in this series, but I’ll make an exception here — I think `var`‘s behaviour is as nutty as squirrel poop!

## Declaring Variables with `let`

My single favourite ES6 feature is the keyword `let`. That’s mainly because it makes JavaScript variables behave like variables in all the other languages I use, but also because it makes code read more intuitively — `let x = 4;` can very easily be mentally read as _‘let x become equal to four’_.

`let` is just like `var` except that it creates variables that are block-scoped, and don’t get hoisted.

Let’s revisit our example from above, but replace `var` with `let`:

```javascript
// declare a global variable
let msg = "I'm a global!";

// declare a function with a local variable with the same name
function fn(){
    console.log(msg);
    let msg = "now I'm local!";
    console.log(msg);
}

// execute the function
fn();
```

Executing the function now gives us an error: _“ReferenceError: can’t access lexical declaration \`msg’ before initialization”_.

Why? Because even in ES6, you can’t have your cake and eat it. Within any single scope a variable has to be either local or from a containing scope; it can’t be both.

With block-level scopes we do have a simple solution though, just make another scope!:

```javascript
// declare a global variable
let msg = "I'm a global!";

// declare a function with a local variable with the same name
function fn(){
    console.log(msg);

    // a new code block, hence a new scope
    {
        let msg = "now I'm local!";
        console.log(msg);
    }
}

// execute the function
fn();
```

Running this we finally get what we wanted:

```
I'm a global!
now I'm local!

```

One final thing to note is that redeclaring the same variable within the same scope with `let` will generate an error. Redeclaration isn’t something you’d ever want to do. It’s always a bug, so having ES6 throw an error when it happens is a good thing IMO.

## Declaring Constants with `const`

Before ES6 JavaScript had no concept of a constant. Anything you declared with `var` could have its value changed later in the code. In other C-style languages there is generally a mechanism for marking a ‘variable’ as being unchangeable, or as being _constant_. For example, the value of the gravitational constant (G) doesn’t change. So if your code were to be doing gravitational calculations, it would be good to be able to store G in a variable where accidentally attempting to change it would result in an error being thrown. That would nip all sorts of subtle bugs in the bud!

That’s what the `const` keyword is for. It behaves just like `let`, except that any attempt to alter the value after declaration will result in an error.

Here’s a simple example:

```javascript
// declare the gravitational constant
const G = 6.7e-11;

// declare a function for calculating the force due to gravity between two planets
function gravitationalForce(mass1KG, mass2KG, distanceM){
    return G * ( ( mass1KG * mass2KG ) / ( distanceM * distanceM ) );
}

// print the graviational attraction between the earth and Moon
console.log(gravitationalForce(6e24, 7.35e22, 384400000));
```

Remember, variables hold primitive values and references to objects. So if you declare an object with `const`, you can still alter the contents of the object. But you can never change the object that variable points to.

To illustrate the point, this will generate an error:

```javascript
const x = 2;
x = 3; // throws error
```

But this won’t:

```javascript
// declare a constant object with one key
const x = {y: 4};

// change the value of the key
x.y = 5; // no error

// add another key
x.z = 6; // also no error
```

## Aside — Function Hoisting

Since we’ve now mentioned the concept of hoisting, I should point out that variables aren’t the only things that get hoisted in JavaScript. Function declarations do too, and that hasn’t changed in ES6.

The following works in all versions of JavaScript, including ES6:

```javascript
// call a function declared later
fn();

// declare the function using a function statement
function fn(){
    console.log('I got hoisted!');
}
```

## A Challenge

In the real world, you often need to change the internals of a library of code without altering how the code behaves. Software engineers refer to this kind of _code renovation_ as _refactoring_.

Over the next few instalments we’re going to refactor our cellular automaton prototypes into ES6 classes. As a first step, the challenge for this week is to refactor the prototypes so they use `let` and/or `const` as appropriate.

It’s very easy to accidentally break code while refactoring. That’s where the test suite we’ve been building up concurrently with the code comes in. Be sure to test your refactored code as you go; that way you should be able to avoid introducing new bugs.

## Final Thoughts

While the change from `var` to `let` and `const` is significant, it’s just the beginning of our journey into the joys of ES6. In the next instalment we’ll learn about new types of loops, and about default values for function arguments.

 - [← PBS 42 — Playing the Game of Life](pbs42)
 - [Index](index)
 - [PBS 44 — ES6 Arguments & Objects →](pbs44)
