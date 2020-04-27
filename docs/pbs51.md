# PBS 51 of x — Cellular Automata Wrap-up

This instalment will be the last before we go on hiatus for a few weeks while Allison goes off exploring Europe. When Allison comes back we’ll be changing gears and switching for focusing on JavaScript to focusing on HTML and CSS. We’ll learn about the free and open source Bootstrap 4 CSS library. This library provides many useful features, but we’ll start simple. Firstly, the library providers modern and elegant default styles for all the HTML elements we already know and love. It also provides a handful of simple CSS classes for defining page layouts (columns, rows, that kind of thing), and thirdly, it provides simple CSS classes for creating so-called _responsive_ web pages, i.e. pages who’s layout changes automatically depending on screen size.

As this is the last instalment before the hiatus we’ll use it to wrap up our work on the Cellular Automata prototypes. We’ll start with a sample solution to the challenge from the previous instalment, and finish with a worked example where we use our prototypes to create three distinct CAs.

The final code for the worked example is included in [this instalment’s ZIP file which you can download here](https://www.bartbusschots.ie/s/wp-content/uploads/2018/03/pbs51.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs51.zip).

# Matching Podcast Episode 530

Listen along to this instalment on [episode 530 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2018/03/ccatp-530/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_03_03.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_03_03.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

Since episode 50 was a special episode, it’s been a while since we last looked at these prototypes, so let’s take a moment for a quick summary of what we’re trying to achieve.

Conceptually, a Cellular Automaton (CA) is a grid of cells, each of which is on one of a finite set of states. CAs move from a current state to a next state in lock-step, that is to say, all the cells change from their current state to their next state in one step. Each CA defines its own set of rules for how the next state of each cell should be calculated. This set of rules has only two inputs — the current state of the cell itself, and the current state of all neighbouring cells. Practically, we need a way of seeing our automaton, so each CA also needs to define a set of rules for how to display a given state.

An example of a specific cellular automaton is [Conway’s Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). In this specific example there are only two possible states for each cell — _alive_ & _dead_, and the set of rules for calculating the next state of each cell are:

1.  Any live cell with fewer than two live neighbours dies
2.  Any live cell with two or three live neighbours lives on
3.  Any live cell with more than three live neighbours dies
4.  Any dead cell with exactly three live neighbours becomes a live cell

We’ve modelled the abstract concept of Cellular Automata with three prototypes — one to represent a CA as a whole (`bartificer.ca.Automaton`), one to represent a single cell (`bartificer.ca.Cell`), and one to represent a cell state (`bartificer.ca.State`). Every Automaton contains a grid of Cells, and every Cell has a current State.

Within the Automaton prototype we store the set of rules for calculating the next state of each cell as a reference to a function, and we refer to it as the _step function_.

We also store the set of rules for displaying a state as a reference to a function, and we refer to that as the _render function_.

As things stand at the start of the challenge, we do not store the set of allowed states at all, and since we don’t even store it, we definitely can’t enforce it. That’s the problem the challenge asked you to solve.

## PBS 49 Challenge Sample Solution

You’ll find the full source code for my sample solution as [the named release PBS49-Challenge-Solution on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS49-Challenge-Solution).

### Part 1 — Add a `.equals()` Function to `bartificer.ca.State`

We get started with a quick and easy little function. Since this is an instance function, it will be invoked on an instance of the class bartificer.ca.State. The function will take one argument, and should compare the instance it was called on (`this`) to that one argument. If the passed value is a `bartificer.ca.State`, and, has the same value and label as the instance itself, it should return `true`, otherwise, it should return `false`:

```JavaScript
/**
 * Compare this instance to a given object and determine whether or not
 * the passed object should be considered equal to the instance itself.
 *
 * For an object to be considered equal it must be an instance of this
 * class, and, must have the same value and label as the instance
 * itself.
 *
 * @param {*} Obj - the object to compare to self.
 * @returns {boolean}
 */
equals(obj){
    // if not State instance, return false
    if(!(obj instanceof bartificer.ca.State)) return false;

    // if the values and labels are not the same, return false
    if(this.value() !== obj.value() || this.label() !== obj.label()) return false;

    // if we got here all is well, so return true
    return true;
}
```

While I didn’t explicitly request it in the assignment, I also created a test for this new function:

```JavaScript
QUnit.test('.equals()', (a)=>{
    a.expect(9);
    a.strictEqual(typeof bartificer.ca.State.prototype.equals, 'function', 'function exists');
    const s1 = new bartificer.ca.State(true, 'Alive');
    a.strictEqual(s1.equals(), false, 'no arguments returns false');
    a.strictEqual(s1.equals(new Date()), false, 'non-State object not considered equal');
    a.strictEqual(s1.equals(new bartificer.ca.State(false, 'Dead')), false, 'different value and label not considered equal');
    a.strictEqual(s1.equals(new bartificer.ca.State(42, 'Alive')), false, 'different value but same label not considered equal');
    a.strictEqual(s1.equals(new bartificer.ca.State(true, 'very alive')), false, 'same value but different label not considered equal');
    a.strictEqual(s1.equals(new bartificer.ca.State('true', 'Alive')), false, 'different types of same and same label not considered equal');
    a.strictEqual(s1.equals(s1), true, 'reference to self considered equal to self');
    a.strictEqual(s1.equals(new bartificer.ca.State(true, 'Alive')), true, 'new State with same value and label considered equal');
});
```

### Part 2 — Re-factor the `bartificer.ca.Automaton` constructor

The first step in refactoring the constructor is to convert the renderFn argument from required to optional by adding a default render function that renders _truthy_ states as green, and _falsy_ states as red.

This is simply a matter of changing this section of the constructor:

```JavaScript
if(typeof renderFn !== 'function'){
    throw new TypeError('the fifth argument must be a callback');
}
```

To this:

```JavaScript
if(typeof renderFn === 'undefined'){
    renderFn = function($td, s){
        // render a true state as green, and false as red
        if(s.value() == true){
             $td.css('background-color', 'Green');
        }else{
             $td.css('background-color', '#ff9999');
        }
    };
}else{
    if(typeof renderFn !== 'function'){
        throw new TypeError('if present, the fifth argument must be a callback');
    }
}
```

Now we’re ready to collapse all the optional arguments into a single object. This involves a lot of changes to the constructor, so I’ve included the complete constructor below with the modified regions marked:

```JavaScript
/**
 * The constructor expects to be passed a jQuery object representing a
 * sigle container element. That element will be emptied, and the table
 * representing the automaton will then be added to it. The class
 * `bartificer-ca-container` will be added to the conainer, and the
 * generated table will have the class `bartificer-ca-automaton` added.
 * The table. A reference to the constructed object will be added to
 * both the container and the table as the data attribute
 * `data-bartificer-object` (`bartificerObject` from JavaScipt's point
 * of view).
 *
 * @param {jQuerySingleContainer} $container - A jQuery object
 * representing the container that will be converted into the cellular
 * automaton.
 * @param {GridDimension} rows - the number of rows to build the
 * automaton with.
 * @param {GridDimension} cols - the number of columns to build the
 * automaton with.
 * @param {stepFunction} stepFn - a callback that will be used to
 * calcualte the next state of each cell for each step the automaton
 * takes.
 * @param {object} [opts={}] - a plain object specifying any desired
 * optional arguments.
 * @param {renderFunction} [opts.renderFunction] - a callback that will be
 * used to render the state of each cell. If none is passed, states
 * with a *truthy* value will be rendered in green, and states with a
 * *falsey* in red.
 * @param {(bartificer.ca.State|bartificer.ca.State[]|initialisationFunction)} [opts.initialState] - the
 * automaton's initial state. The state can be specified in three
 * different ways:
 * 1. a single state - each cell in the automaton will be initialised
 *    with this state.
 * 2. an array of states. The array must have the same dimensions as
 *    the automaton.
 * 3. an intialisation callback. The callback will be used to calculate
 *    the initial state of each cell given its coordinates.
 * @throws {TypeError} An error is thrown if the first five arguments
 * are not present and valid, and if the sixth argument is present but
 * not valid.
 * @throws {Error} An error is thrown if the table has already been
 * initialised as an automaton.
 */
constructor($container, rows, cols, stepFn, opts){
    // validate args
    if(!isJQuerySingleContainer($container)){
        throw new TypeError('the first argument must be a jQuery object representing exactly one valid container element');
    }

    if(!isGridDimension(rows)){
        throw new TypeError('the second argument must be a valid grid dimension');
    }
    if(!isGridDimension(cols)){
        throw new TypeError('the third argument must be a valid grid dimension');
    }
    if(typeof stepFn !== 'function'){
        throw new TypeError('the fourth argument must be a callback');
    }
    if(typeof opts === 'undefined'){
        opts = {};
    }else{
        if(typeof opts !== 'object'){
            throw new TypeError('if present, the fifth argument must be a plain object');
        }
    }
    if(typeof opts.renderFunction === 'undefined'){
        opts.renderFunction = function($td, s){
            // render a true state as green, and false as red
            if(s && s.value() == true){
                $td.css('background-color', 'Green');
            }else{
                $td.css('background-color', '#ff9999');
            }
        };
    }else{
        if(typeof opts.renderFunction !== 'function'){
            throw new TypeError("if present, the 'renderFunction' option must be a callback");
        }
    }
    if(typeof opts.initialState !== 'undefined' && !isAutomatonState(opts.initialState, rows, cols)){
        throw new TypeError("if present, the 'initialState' option must be a bartificer.ca.State object, an array of state objects with the same dimensions as the automaton, or, a callback");
    }

    // make sure the container has not been initialised into an Automaton already
    if($container.hasClass('bartificer-ca-container') || $container.data('bartificerObject')){
        throw new Error('cannot use the same container to represent multiple cellular automata');
    }

    // initialise the container
    $container.empty().addClass('bartificer-ca-container').data('bartificerObject', this);

    // save the passed properties

    /**
     * A jQuery object representing the container for the automaton.
     * @private
     * @type {jQuerySingleContainer}
     */
    this._$container = $container;

    /**
     * The number of rows in the automaton. This property is forced to be a
     * number before being stored.
     * @private
     * @type {GridDimension}
     */
    this._rows = parseInt(rows); // force to number

    /**
     * The number of columns in the automaton. This property is forced to be a
     * number before being stored.
     * @private
     * @type {GridDimension}
     */
    this._cols = parseInt(cols); // force to number

    /**
     * The callback used to calculate the next state of each cell each time
     * the automaton steps forward.
     * @private
     * @type {stepFunction}
     */
    this._stepFn = stepFn;

    /**
     * The callback used to style a given cell so it represents the
     * appropriate state.
     * @private
     * @type {renderFunction}
     */
    this._renderFn = opts.renderFunction;

    /**
     * The genreation counter.
     * @private
     * @type {number}
     */
    this._generation = 0;

    /**
     * The callbacks to execute when ever the generation changes.
     * @private
     * @type {function[]}
     * @default
     */
    this._generationChange = [];

    /**
     * The ID of the timeout for the next automatic step, or zero if there
     * is no running timeout (the automaton is not in automatic mode).
     * @private
     * @type {IntervalMS}
     * @default
     */
    this._autoStepID = 0;

    /**
     * The number of milliseconds between automated steps.
     * @private
     * @default
     * @type {number}
     */
    this._autoStepMS = 500;

    // initialise the grid and table

    /**
     * A 2D array of bartificer.ca.Cell objects representing the cells in
     * the automaton.
     * @private
     * @type {bartificer.ca.Cell[][]}
     */
    this._grid = [];
    for(let x = 0; x < this._cols; x++){
        this._grid[x] = [];
    }

    /**
     * A jQuery object representing the table that represents the automaton.
     * @private
     * @type {jQuerySingleTable}
     */
    this._$table = $('<table></table>').addClass('bartificer-ca-automaton');
    this._$table.data('bartificerObject', this);

    // actually build the table and grid together
    const $tbody = $('<tbody></tbody>');
    for(let y = 0; y < this._rows; y++){
        let $row = $('<tr></tr>');
        for(let x = 0; x < this._cols; x++){
            const $td = $('<td></td>');
            this._grid[x][y] = new bartificer.ca.Cell($td, x, y);
            this._renderFn($td, this._grid[x][y].state());
            $row.append($td);
        }
        $tbody.append($row); // add the row into the table body
    }

    // inject the table into the DOM
    this._$table.append($tbody); // add the table body into the table
    this._$container.append(this._$table); // add the table into the container

    // initialise the state if the initialState option was passed
    if(typeof opts.initialState !== 'undefined'){
        this.setState(opts.initialState);
    }
}
```

Changing how the constructor works also required much of the test suite to be re-written, not just the tests for the constructor itself, but all calls to the constructor in all tests. The changes are too extensive to include in the show notes, but they are all committed to GitHub.

Finally, with the constructor refactored, we now need to update the call to the constructor in `sample.html`:

```JavaScript
// use the constructor to build an automaton
sampleCA = new bartificer.ca.Automaton(
    $('#game_of_life_container'), // use the div as the container
    100, 200, // make it a 200x100 grid
    lifeStep, // pass the game of life step function
    {
        renderFunction: renderRedGreen, // pass our red/green render function
        initialState: randomState // initialise each cell to a random boolean
    }
);
```

### Part 3 — Add a List of Supported States as an Instance Property to `bartificer.ca.Automaton`

The idea here to add the ability of a cellular automata to know what states are and are not valid within its universe.

The first step is to update the constructor so it performs the following two tasks:

1.  Stores a set of states in a private instance variable named `._cellStates`. These states can come from the user via the `cellStates` key in the `opts` argument, or, a default set of _Alive_ and _Dead_ can be used.
2.  Builds a matching looking table named `._statesByValue`.

Below is my updated constructor with the changes highlighted:

```JavaScript
/**
 * The constructor expects to be passed a jQuery object representing a
 * sigle container element. That element will be emptied, and the table
 * representing the automaton will then be added to it. The class
 * `bartificer-ca-container` will be added to the conainer, and the
 * generated table will have the class `bartificer-ca-automaton` added.
 * The table. A reference to the constructed object will be added to
 * both the container and the table as the data attribute
 * `data-bartificer-object` (`bartificerObject` from JavaScipt's point
 * of view).
 *
 * @param {jQuerySingleContainer} $container - A jQuery object
 * representing the container that will be converted into the cellular
 * automaton.
 * @param {GridDimension} rows - the number of rows to build the
 * automaton with.
 * @param {GridDimension} cols - the number of columns to build the
 * automaton with.
 * @param {stepFunction} stepFn - a callback that will be used to
 * calcualte the next state of each cell for each step the automaton
 * takes.
 * @param {object} [opts={}] - a plain object specifying any desired
 * optional arguments.
 * @param {renderFunction} [opts.renderFunction] - a callback that will be
 * used to render the state of each cell. If none is passed, states
 * with a *truthy* value will be rendered in green, and states with a
 * *falsey* in red.
 * @param {(bartificer.ca.State|bartificer.ca.State[]|initialisationFunction)} [opts.initialState] - the
 * automaton's initial state. The state can be specified in three
 * different ways:
 * 1. a single state - each cell in the automaton will be initialised
 *    with this state.
 * 2. an array of states. The array must have the same dimensions as
 *    the automaton.
 * 3. an intialisation callback. The callback will be used to calculate
 *    the initial state of each cell given its coordinates.
 * @param {bartificer.ca.State[]} [opts.cellStates] - the set of
 * allowed cell states. No two states within the set can have the same
 * value. Defaults to a pair of states with the values `true` & `false`
 * and the labels *Alive* & *Dead*.
 * @throws {TypeError} An error is thrown if the first five arguments
 * are not present and valid, and if the sixth argument is present but
 * not valid.
 * @throws {Error} An error is thrown if the table has already been
 * initialised as an automaton.
 */
constructor($container, rows, cols, stepFn, opts){
    // validate args
    if(!isJQuerySingleContainer($container)){
        throw new TypeError('the first argument must be a jQuery object representing exactly one valid container element');
    }

    if(!isGridDimension(rows)){
        throw new TypeError('the second argument must be a valid grid dimension');
    }
    if(!isGridDimension(cols)){
        throw new TypeError('the third argument must be a valid grid dimension');
    }
    if(typeof stepFn !== 'function'){
        throw new TypeError('the fourth argument must be a callback');
    }
    if(typeof opts === 'undefined'){
        opts = {};
    }else{
        if(typeof opts !== 'object'){
            throw new TypeError('if present, the fifth argument must be a plain object');
        }
    }
    if(typeof opts.renderFunction === 'undefined'){
        opts.renderFunction = function($td, s){
            // render a true state as green, and false as red
            if(s && s.value() == true){
                $td.css('background-color', 'Green');
            }else{
                $td.css('background-color', '#ff9999');
            }
        };
    }else{
        if(typeof opts.renderFunction !== 'function'){
            throw new TypeError("if present, the 'renderFunction' option must be a callback");
        }
    }
    if(typeof opts.initialState !== 'undefined' && !isAutomatonState(opts.initialState, rows, cols)){
        throw new TypeError("if present, the 'initialState' option must be a bartificer.ca.State object, an array of state objects with the same dimensions as the automaton, or, a callback");
    }
    const statesMsg = "if present, the 'cellStates' option must be an array of bartificer.ca.State objects, containing at least two distinct states";
    if(typeof opts.cellStates === 'undefined'){
        opts.cellStates = [
            new bartificer.ca.State(true, 'Alive'),
            new bartificer.ca.State(false, 'Dead')
        ];
    }else{
        if(!($.isArray(opts.cellStates) && opts.cellStates.length >= 2)){
            throw new TypeError(statesMsg);
        }
        for(const cs of opts.cellStates){
           if(!isCellState(cs)) throw new TypeError(statesMsg);
        }
    }

    // make sure the container has not been initialised into an Automaton already
    if($container.hasClass('bartificer-ca-container') || $container.data('bartificerObject')){
        throw new Error('cannot use the same container to represent multiple cellular automata');
    }

    // initialise the container
    $container.empty().addClass('bartificer-ca-container').data('bartificerObject', this);

    // save the passed properties

    /**
     * A jQuery object representing the container for the automaton.
     * @private
     * @type {jQuerySingleContainer}
     */
    this._$container = $container;

    /**
     * The number of rows in the automaton. This property is forced to be a
     * number before being stored.
     * @private
     * @type {GridDimension}
     */
    this._rows = parseInt(rows); // force to number

    /**
     * The number of columns in the automaton. This property is forced to be a
     * number before being stored.
     * @private
     * @type {GridDimension}
     */
    this._cols = parseInt(cols); // force to number

    /**
     * The callback used to calculate the next state of each cell each time
     * the automaton steps forward.
     * @private
     * @type {stepFunction}
     */
    this._stepFn = stepFn;

    /**
     * The callback used to style a given cell so it represents the
     * appropriate state.
     * @private
     * @type {renderFunction}
     */
    this._renderFn = opts.renderFunction;

    /**
     * The set of allowed states for cells within this automaton.
     * @private
     * @type {bartificer.ca.State[]}
     */
    this._cellStates = [];

    /**
     * A lookup table of allowed cell states by value.
     * @private
     * @type {object}
     */
    this._statesByValue = {};

    // store the allowed states and make sure no two have the same value
    for(const cs of opts.cellStates){
        if(typeof this._statesByValue[cs.value()] === 'undefined'){ // duplicate check
            const csc = cs.clone();
            this._cellStates.push(csc); // store the state
            this._statesByValue[cs.value()] = csc; // add it to the lookup
        }else{
            throw new TypeError(statesMsg); // duplicate - throw error
        }
    }

    /**
     * The genreation counter.
     * @private
     * @type {number}
     */
    this._generation = 0;

    /**
     * The callbacks to execute when ever the generation changes.
     * @private
     * @type {function[]}
     * @default
     */
    this._generationChange = [];

    /**
     * The ID of the timeout for the next automatic step, or zero if there
     * is no running timeout (the automaton is not in automatic mode).
     * @private
     * @type {IntervalMS}
     * @default
     */
    this._autoStepID = 0;

    /**
     * The number of milliseconds between automated steps.
     * @private
     * @default
     * @type {number}
     */
    this._autoStepMS = 500;

    // initialise the grid and table

    /**
     * A 2D array of bartificer.ca.Cell objects representing the cells in
     * the automaton.
     * @private
     * @type {bartificer.ca.Cell[][]}
     */
    this._grid = [];
    for(let x = 0; x < this._cols; x++){
        this._grid[x] = [];
    }

    /**
     * A jQuery object representing the table that represents the automaton.
     * @private
     * @type {jQuerySingleTable}
     */
    this._$table = $('<table></table>').addClass('bartificer-ca-automaton');
    this._$table.data('bartificerObject', this);

    // actually build the table and grid together
    const $tbody = $('<tbody></tbody>');
    for(let y = 0; y < this._rows; y++){
        let $row = $('<tr></tr>');
        for(let x = 0; x < this._cols; x++){
            const $td = $('<td></td>');
            this._grid[x][y] = new bartificer.ca.Cell($td, x, y);
            this._renderFn($td, this._grid[x][y].state());
            $row.append($td);
        }
        $tbody.append($row); // add the row into the table body
    }

    // inject the table into the DOM
    this._$table.append($tbody); // add the table body into the table
    this._$container.append(this._$table); // add the table into the container

    // initialise the state if the initialState option was passed
    if(typeof opts.initialState !== 'undefined'){
        this.setState(opts.initialState);
    }
}
```

Next we need a simple read-only accessor for `._cellStates`. This is pretty much just like all the others with the small exception that it returns a fresh array rather than a reference to the original. This is to prevent _spooky action at a distance_. If we returned a reference to the internal array the user could inadvertently alter it and cause very weird and difficult to track down bugs.

```JavaScript
/**
 * A read-only accessor function for the set of allowed states.
 *
 * @returns {bartificer.ca.State[]}
 * @throws {Error} An error is thrown if the accessor is called with
 * arguments.
 */
cellStates(){
    if(arguments.length > 0){
        throw new Error('read-only acessor called with arguments');
    }
    const ans = [];
    for(const s of this._cellStates){
        ans.push(s);
    }
    return ans;
}
```

We can now add the special accessor `.stateFromValue()`:

```JavaScript
/**
 * Get the cell state for a given value.
 *
 * @param {PrimitiveValue} val - the value to get the state for.
 * @returns {(bartificer.ca.State|undefined)} If the automaton has a
 * state with the given value then that state is returned, otherwise
 * `undefined` is returned.
 * @throws {TypeError} A type error is thrown if invalid args are
 * passed.
 */
stateFromValue(val){
    if(!isPrimitiveValue(val)){
        throw new TypeError('the first argument must be a primitive value (boolean, number, or string)');
    }
    return this._statesByValue[val];
}
```

Finally, we can add the `.hasState()` utility function:

```JavaScript
/**
 * Determine whether or not the CA allows a given state.
 *
 * @param {(PrimitiveValue|bartifier.ca.State)} val - the value to
 * test.
 * @returns {boolean} Returns `true` if the given state is supported,
 * or `false` otherwise.
 */
hasState(val){
    let tVal = undefined;
    if(val instanceof bartificer.ca.State){
        tVal = val.value();
    }else if(isPrimitiveValue(val)){
        tVal = val;
    }else{
        // received an invalid state, so return false
        return false;
    }
    return typeof this._statesByValue[tVal] !== 'undefined' ? true : false;
}
```

Note that while I’m not including the code here, the GitHub release also contains an updated version of the test suite with updated tests for the constructor, and new tests for the newly added functions.

### Part 4 — Improve `.step()` in `bartificer.ca.Automaton`

At this stage our automaton can store a set of allowed states, but it doesn’t in any way enforce them. Our step function is literally anarchy, it will accept any value what so ever returned by the instance’s user-supplied step function:

```JavaScript
// calculate the next state
let ns = this._stepFn(c.state(), this.cellNeighbourStates(x, y));

// set the cell's next state to the newly calculated value
c.nextState(ns);
```

This might seem forgiving, but it’s not, because the `.nextState()` function rigidly enforces discipline:

```JavaScript
nextState(ns){
    // if in setter mode, try set
    if(arguments.length >= 1){
        if(!(typeof ns === 'undefined' || isCellState(ns))){
            throw new TypeError('if present, the first argument must be a valid cell state (boolean, number, or sting), or the value undefined');
        }
        this._nextState = ns;
    }

    // always return the current next state
    return this._nextState;
}
```

What we need if for our `.step()` function to be as helpful as possible and pass what the user meant to `.nextStep()` rather than the exact value they returned. In CS jargon, our `.step()` function should _coerce_ the value returned by the user’s step function into a `bartificer.ca.State` object if possible.

Let’s illustrate this point with a hypothetical example. Imagine the user of our API has created a CA and specified that it supports following two states:

1.  _Alive_ (`true`)
2.  _Dead_ (`false`)

If the user’s step function `true` or `false`, then there is no ambiguity, so our `.step()` function should be able to translate those primitive values into their matching `bartificer.ca.State` objects, and pass those objects on to `.nextState()` rather than the original primitive value.

Because we’ve already added the `.stateFromValue()` function, there’s not actually much more we need to do:

```JavaScript
/**
 * Step the automaton forward by one step.
 *
 * @returns {bartificer.ca.CellylarAutomaton} Returns a reference to self.
 */
step(){
    // first calcualte the next state of each cell
    for(let x = 0; x < this.cols(); x++){
        for(let y = 0; y < this.rows(); y++){
            // get a reference to the current cell
            let c = this.cell(x, y);

            // calculate the next state
            let ns = this._stepFn(c.state(), this.cellNeighbourStates(x, y));

            // coerce the next state if needed and possible
            if(!isCellState(ns) && this.hasState(ns)){
                ns = this.stateFromValue(ns);
            }

            // set the cell's next state to the newly calculated value
            c.nextState(ns);
        }
    }

    // next move each cell forward into its next state and re-render it
    for(let x = 0; x < this.cols(); x++){
        for(let y = 0; y < this.rows(); y++){
            this.cell(x, y).advance();
            this._renderFn(this.cell(x, y).$td(), this.cell(x, y).state());
        }
    }

    // finally, increment the generation counter
    this._generation++;
    this.generationChange();

    // return a reference to self
    return this;
}
```

Again, I updated the test suite for the `.step()` function so it checks that coercions are being applied, and you can find that code in [the git release](https://github.com/bbusschots/bartificer_ca_js/tree/PBS49-Challenge-Solution).

## A Final Example — Multiple Different CAs

While we’ve focused on Conway’s Game of Life, that is not the only CA in town. Firstly, there are a myriad of simple variations of the Game of Life where you keep the concept of two states, but change the number of neighbours needed to be born or to die, together, all these rule sets are known the _Life_ class of CAs, [you can see man of them described here](http://www.mirekw.com/ca/rullex_life.html). We’ll implement one of these, the so-called _Maze Rule_.

But of course, there’s no need to limit yourself to just two states! To prove that point we’ll implement the best known of the three-state rules, _Brian’s Brain_.

Let’s start with a basic HTML 5 page that loads jQuery and our bartificer.ca prototypes, includes some very basic CSS for styling our automata (copied directly from `sample.html`), and creates placeholders for our three CAs:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
    <title>bartificer.ca.Automaton Demo - 3 CAs</title>

    <!-- Load jQuery 3 from the official CDN -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>

    <!-- load the bartificer.ca API from GitHub (via RawGit CDN) -->
    <script type="text/javascript" src="https://cdn.rawgit.com/bbusschots/bartificer_ca_js/PBS49-Challenge-Solution/lib/bartificer.ca.js"></script>

    <!-- Initialise the CAs -->
    <script type="text/javascript">
        // the jQuery Doument Ready Handler
        $(function(){
            // Create CAs here
        });
    </script>

    <!-- Style the Automata -->
    <style type="text/css">
        table.bartificer-ca-automaton{
            border-collapse: collapse;
            border: 1px solid black;
            margin: 3px;
        }
        td.bartificer-ca-cell{
            width: 5px;
            height: 5px;
        }
    </style>
</head>
<body>
<h1>Three Cellular Automata</h1>

<h2>Conway's Game of Life</h2>
<div id="life_container"></div>

<h2>The Maze Rule</h2>
<div id="maze_container"></div>

<h2>Brian's Brain</h2>
<div id="brain_container"></div>

</main>
</body>
</html>
```

Let’s start on familiar territory and create the Game of Life CA. To do that we’ll need three things:

1.  A set of allowed states (alive & dead)
2.  A render function that can render aliveness and deadness
3.  A step function that implements the rules of the game of life
4.  A function to randomly return alive or dead to initialise the grid with

Let’s start with the set of allowed states:

```JavaScript
const lifeStates = [
    new bartificer.ca.State(true, 'Alive'),
    new bartificer.ca.State(false, 'Dead')
];
```

Next, let’s define a simple rendering function:

```JavaScript
function renderLife($td, s){
    // render alive as green and dead as red
    if(s && s.value() == true){
        $td.css('background-color', 'Green');
    }else{
        $td.css('background-color', '#ff9999');
    }
}
```

Next, let’s write the step function for the Game of Life:

```JavaScript
function lifeStep(currentState, neighbourStates){
    // calcualte the number of live neighbours
    let numLiveNeighbours = 0;
    neighbourStates.forEach(function(s){
        if(s !== null && s.value() == true) numLiveNeighbours++;
    });

    // apply the rules based on the current state
    if(currentState.value() == true){
        // currently alive - apply rules 1 to 3

        // rule 1
        if(numLiveNeighbours < 2) return false;

        // rule 3
        if(numLiveNeighbours > 3) return false;
    }else{
        // currently dead - apply rule 4
        if(numLiveNeighbours === 3) return true;
    }

    // default to no change (incorporates rule 2)
    return currentState;
}
```

Finally, the easy part, a function to generate a random boolean:

```JavaScript
function randomAliveness(){
    return Math.random() < 0.5 ? lifeStates[0] : lifeStates[1];
}
```

We’re now ready to create the Game of Life CA and set it running. Because the constructor interacts with the DOM (inserts a table) we have to do this inside the jQuery document ready handler:

```JavaScript
// declare variables to hold references to the CAs
let lifeCA;

// the jQuery Doument Ready Handler
$(function(){
    //
    // Create the three CAs
    //
    lifeCA = new bartificer.ca.Automaton(
        $('#life_container'),
        100, 200, // make it a 200x100 grid
        lifeStep,
        {
            cellStates: lifeStates, // allow alive and dead states
            renderFunction: renderLife,
            initialState: randomAliveness // initialise each cell to be randomly alive or dead
        }
    );

    //
    // Start the three CAs running
    //
    lifeCA.autoStepIntervalMS(100);
    lifeCA.start();
});
```

At this stage our sample page loads the game of life and starts it running. Nothing really new so far. Now, let’s implement the Maze!

The Maze uses the same set of allowed states, so we don’t need to define a new set of states, or create a new rendering function, or create a new function for generating random states, we can re-use those we already created. All we need to do is create a new step function that implements the rules for the Maze:

1.  If alive, must have between 1 and 5 live neighbours to stay alive, otherwise, die
2.  If dead, must have exactly 3 live neighbours to come to life, otherwise, stay dead

We can code this up as:

```JavaScript
function mazeStep(currentState, neighbourStates){
    // calcualte the number of live neighbours
    let numLiveNeighbours = 0;
    neighbourStates.forEach(function(s){
        if(s !== null && s.value() == true) numLiveNeighbours++;
    });

    // apply the rules based on the current state
    if(currentState.value() == true){
        // currently alive, die unless 1-5 live neighbours
        if(numLiveNeighbours >= 1 || numLiveNeighbours <= 5) return true;
        return false;
    }

    // currently dead - stay that way unless 3 live neighbours
    if(numLiveNeighbours === 3) return true;
    return false;
}
```

We can then create our second CA similarly to the first:

```JavaScript
// declare variables to hold references to the CAs
let lifeCA;
let mazeCA;

// the jQuery Doument Ready Handler
$(function(){
    //
    // Create the three CAs
    //
    lifeCA = new bartificer.ca.Automaton(
        $('#life_container'),
        100, 200, // make it a 200x100 grid
        lifeStep,
        {
            cellStates: lifeStates, // allow alive and dead states
            renderFunction: renderLife,
            initialState: randomAliveness // initialise each cell to be randomly alive or dead
        }
    );
    mazeCA = new bartificer.ca.Automaton(
        $('#maze_container'),
        100, 200, // make it a 200x100 grid
        mazeStep,
        {
            cellStates: lifeStates, // allow alive and dead states
            renderFunction: renderLife,
            initialState: randomAliveness // initialise each cell to be randomly alive or dead
        }
    );

    //
    // Start the three CAs running
    //
    lifeCA.autoStepIntervalMS(100);
    lifeCA.start();
    mazeCA.autoStepIntervalMS(100);
    mazeCA.start();
});
```

Now let’s really shake things up with Brian’s Brain.

Brian’s Brain doesn’t have live and dead cells, instead, each cell is imagined to be a neurone in Brian’s Brain, so it’s in on of three states:

1.  Ready to Fire
2.  Firing
3.  Recharging

Given those three states the following rules apply:

1.  All cells cycle from ready, to firing, to recharging and back to ready, no other transitions are possible
2.  A cell only fires when exactly two of its neighbours are firing
3.  When a cell fires it stays in that state for exactly one step
4.  When a cell is re-charging it also stays in that state for exactly one step

So let’s translate that into code. First, the set of states:

```JavaScript
const brainStates = [
    new bartificer.ca.State(0, 'Ready'),
    new bartificer.ca.State(1, 'Firing'),
    new bartificer.ca.State(2, 'Recharging')
];
```

Now, the set of rules (i.e. the step function):

```JavaScript
function brainStep(currentState, neighbourStates){
    // decide what to do based on the current state

    // if firing, move to recharing
    if(currentState.value() === 1) return 2;

    // if recharing move to ready
    if(currentState.value() === 2) return 0;

    // if we got here we are ready, so figure out how many neighbours are firing
    let numFiringNeighbours = 0;
    neighbourStates.forEach(function(s){
        if(s !== null && s.value() === 1) numFiringNeighbours++;
    });

    // if we have exactly two firing neighbours, fire!
    if(numFiringNeighbours === 2) return 1;

    // otherwise, remain ready
    return 0;
}
```

Now we need to get practical — our existing render function can only deal with two states, so we need to write another one for dealing with three states:

```JavaScript
function renderNeuron($td, s){
    // render ready as yellow, firings as green and recharging as red
    if(!s || !s.value()){
        $td.css('background-color', 'Yellow');
    }else if(s && s.value() === 1){
        $td.css('background-color', 'Green');
    }else{
        $td.css('background-color', '#ff9999');
    }
}
```

And now we need a function to return a random brain state:

```JavaScript
function randomBrainState(){
    return brainStates[Math.round(Math.random() * 10000) % 3];
}
```

And now, we’re ready to add our final CA:

```JavaScript
// declare variables to hold references to the CAs
// ...
let brainCA;

// the jQuery Doument Ready Handler
$(function(){
    //
    // Create the three CAs
    //
    // ...
    brainCA = new bartificer.ca.Automaton(
        $('#brain_container'),
        100, 200, // make it a 200x100 grid
        brainStep,
        {
            cellStates: brainStates, // allow the three brain states
            renderFunction: renderNeuron,
            initialState: randomBrainState // initialise each cell to be in a random brain state
        }
    );

    //
    // Start the three CAs running
    //
    // ...
    brainCA.autoStepIntervalMS(100);
    brainCA.start();
});
```

And that’s all there is to it!

I’ve included the entire file as `pbs51.html` in this instalment’s ZIP file.

## A Challenge

Given that we’ve just wrapped up one chapter, and will be starting something completely fresh next time, there isn’t really an obvious challenge to set. But, if you would like to practice your coding skills while we’re on hiatus, I suggest you set yourself the same challenge I set myself for [instalment 50](https://bartificer.net/pbs50).

## Final Thoughts

At this stage we’ve come a very long way indeed. We’ve learned how to define the structure of a web page with HTML, how to alter the presentation of a page with CSS, and how bring that page to life with JavaScript. We’ve learned how to use jQuery to interact with the DOM, and how to create our own classes. We’ve now put all that together to create an API for building Cellular Automata. We’ve not just created a web app, we’ve created an API that enables others to create web apps of their own which can display any 2D cellular automaton they care to dream up!

When we return we’ll switch our focus away from JavaScript and back onto HTML and CSS with an introduction to the popular and powerful open source CSS library [Bootstrap 4](https://getbootstrap.com).
