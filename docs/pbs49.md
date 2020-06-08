# PBS 49 of x — Improving Our Cellular Automata

In this instalment we’re going to continue to consolidate our understanding of JavaScript classes by improving the Cellular Automaton classes we built together in previous instalments. This time we’ll make a start on improving how the classes represent and deal with cell states. The challenge will be to finish the task.

We’ll also take some time to revise the basics of JavaScript objects.

[The ZIP file for this instalment](https://www.bartbusschots.ie/s/wp-content/uploads/2018/02/pbs49.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs49.zip) contains my sample solution to the previous challenge.

Note that this instalment is split over two podcast episodes, only one has been recorded to date.

## Matching Podcast Episode 521 & 522

Listen Along (Part 1 of 2): Chit Chat Across the Pond Episode 521

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_02_03.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_02_03.mp3?autoplay=0&loop=0&controls=1" >Download the MP3 for Part 1</a>

Listen Along (Part 2 of 2): Chit Chat Across the Pond Episode 522

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_02_10.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_02_10.mp3?autoplay=0&loop=0&controls=1" >Download the MP3 for Part 2</a>

## Challenge Solution

At the end of [the previous instalment](https://pbs.bartificer.net/pbs48), I set a challenge based on our farm from the previous challenge. Six changes were requested, so let’s go through them one by one. Reminder, the full source code for my sample solution is in this instalment’s ZIP file.

### Part 1 — Add a `.species()` function to `Animal`

The first part of the challenge was simply to add an instance function named `.species()` to the `Animal` class that will return the name of the Animal’s class as a string. Based on what we learned about the `.constructor` and `.name` properties last time, this is a very short little function indeed:

```javascript
species(){
    return this.constructor.name;
}
```

We can test our function by opening `index.html` in our favourite browser and entering `bartFarm._animals[0].species()` in the JavaScript console. It should return the species of the first animal in the farm – `'Cow'`.

### Part 2 — Add a `.speciesInventory()` function to `Farm`

The second part of the challenge was to make use of the `.species()` function we just added to `Animal` to add an instance function to the `Farm` class named `.speciesInventory()` which will return a plain object where the keys are species names, and the values head-counts for that species.

This function is a little longer, but not much more complicated. The key is that instances of the Farm class store their list of animals in an instance variable named `._animals` that is an array. We simply need to loop over this array and count how many of each species we meet:

```javascript
speciesInventory(){
    // start with an empty object
    const ans = {};

    // loop through all the animals in the farm and tally their species
    for(const a of this._animals){
        // get the species
        const s = a.species();

        // check if we've met this species before
        if(ans[s]){
            // we have met this species before, so increment the count
            ans[s]++;
        }else{
            // we've not met this species before, so start counting at 1
            ans[s] = 1;
        }
     }

    // return the head count
     return ans;
}
```

Again, we can test our function by entering `bartFarm.speciesInventory()` into the JavaScript console.

### Part 3 — Add a `.farm_inventory` `<div>` to the `Farm`

The third part of the challenge was extremely simply — update the `Farm` class’s constructor so it creates an empty `<div>` with the class `farm_inventory`:

```javascript
constructor($container, ...animals){
    // initialise the DOM
    this._$container = $container.empty();
    $container.append($('<div>').addClass('farm_pasture'));
    $container.append($('<div>').addClass('farm_shed'));
    $container.append($('<div>').addClass('farm_inventory'));

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
```

### Part 4 — Show the Inventory

The fourth part of the challenge was to add code to the `.addAnimal()` function in the `Farm` class to render the current inventory each time an animal is added.

This involves calling the function from part 3, and then using jQuery to build and inject DOM elements:

```javascript
addAnimal(a){
    // store the animal
    this._animals.push(a);

    // add the animal to the DOM
    a.$dom().data('animalObj', a);
    $('.farm_pasture', this._$container).append(a.$dom());

    // render the current inventory
    const $inventory = $('.farm_inventory', this._$container).empty();
    const $ul = $('<ul>');
    const inventory = this.speciesInventory();
    for(const s of Object.keys(inventory).sort()){
        const $li = $('<li>');
        $li.append($('<strong>').text(`${s}:`));
        $li.append(` ${inventory[s]}`);
        $ul.append($li);
    }
    $inventory.append($ul);
}
```

### Part 5 — Add a Static `isAnimal()` to `Animal`

The penultimate part of the challenge was to add a static function named `isAnimal()` to the `Animal` class which expects one argument, and returns `true` if that argument is an instance of `Animal` or any subclass thereof, and `false` otherwise.

They key here is to understand that the `instanceof` operator is aware of inheritance, and will follow the inheritance tree. In our farm example, an instance of `Cow` would be an instance of `Animal` because the class `Cow` extends the class `Animal`. Similarly, an instance of `Duck` would also be an instance of `Animal` because `Duck` extends `EggLayer` which extends `Animal`.

Once you understand that, the function becomes very easy to write indeed:

```javascript
static isAnimal(a){
    return a instanceof Animal ? true : false;
}
```

We can use the JavaScript console to test this function:

*   `Animal.isAnimal(bartFarm._animals[0])` should return `true`
*   `Animal.isAnimal('boogers')` should return `false`

### Part 6 — Add a Static `areSameSpecies()` function to `Animal`

The final part of the challenge is to add another static function to the `Animal` class, but this one should be named `areSameSpecies()`. As the name suggests, this function should take two arguments, and only return `true` if both are animals of the same species.

The only small complication is that you need to be a little careful in how you structure your tests so as to avoid generating errors when passed non-objects to test. The key is to first make sure both arguments are instance of the `Animal` class using the static function we created in step 5 before calling the `.species()` instance function on both arguments and comparing the results:

```javascript
static areSameSpecies(a1, a2){
    if(!(Animal.isAnimal(a1) && Animal.isAnimal(a2))) return false;
    return a1.species() === a2.species() ? true : false;
}
```

Again, we can use the console to test our code:

*   Refresh the page to get a default farm where the first animal is a cow and the second a duck, then the following should evaluate to `false`: `Animal.areSameSpecies(bartFarm._animals[0], bartFarm._animals[1])`
*   Now add a cow as a 5th animal and the following should evaluate to `true`: `Animal.areSameSpecies(bartFarm._animals[0], bartFarm._animals[4])`

You’ll find my full sample solution in a folder named `pbs48ChallengeSolution` in the ZIP file for this instalment.

_**Note:** This is the point in the notes where the first podcast episode ends and the second will begin._

## Revision — JavaScript Object Basics

**A JavaScript object is a collection of key-value pairs**. You’ll also see the _keys_ are often referred to as _names_, so _name-value pair_ is synonymous with _key-value pair_. Each key-value pair is referred to as a _member_ of the object.

The keys can, in theory, be any JavaScript string. If you try use a key that’s not a string, like a number, it will be automatically converted to a string before use. So, when you try to access the key `1`, you are actually accessing the key `"1"`. I don’t know why you’d want to, but you can use the empty string as a key within an object!

**Objects are _namespaces_**. That is to say, they are self-contained universes of names. If you have two objects, `obj1` & `obj2`, then the key `x` within `obj1` is completely unrelated to the key `x` within `obj2`.

### Object Literals

The object literal syntax lets you create an object and its members in one go, the syntax is as follows:

```javascript
const myObject = {
    "key1": "a value for key 1",
    "key2": 42,
    "key3": { "subkey1": 1, "subkey2": 2 },
    "key4": [1, 2, 3, 4],
    "key_5": new Date(),
    "key 6": function(){ console.log('boogers'); },
    "key-7": /\bbooger(s)?\b/g
};
```

The keys are the items to the left of the colon, and the values are the items to the right. The values can be primitives like numbers or strings, or they can be references to objects. Since just about everything in JavaScript is an object, that means you can store references to things like arrays, functions, or even regular expressions within objects.

If a key is a valid JavaScript variable name (as described way back in [instalment 12](https://pbs.bartificer.net/pbs12)), then it doesn’t have to be quoted. But, if the key contains even a single character that can’t appear in a variable name, then it must be quoted. So, we can rewrite the above sample as:

```javascript
const myObject = {
    key1: "a value for key 1",
    key2: 42,
    key3: { subkey1: 1, subkey2: 2 },
    key4: [1, 2, 3, 4],
    key_5: new Date(),
    "key 6": function(){ console.log('boogers'); },
    "key-7": /\bbooger(s)?\b/g
};
```

Notice that `"key 6"` and `"key-7"` are still quoted, because neither spaces nor dashes are permitted within variable names.

In reality, keys are usually valid variable names, so you rarely see the quoted form.

### Accessing Members

The primary way of accessing the members of an object is with the square bracket notation. Given our example above, we can access each element as follows:

```javascript
// access a value directly
const x = myObject['key1'];

// access a value indirectly
const desiredKey = 'key2';
const xx = myObject[desiredKey];

// access a primitive value in a nested object
const y = myObject['key2'] + myObject['key3']['subkey1'];

// access an element in an array member
console.log(myObject['key4'][0]);

// run an instance function on an object member
const nowISO8601 = myObject['key_5'].toISOString();

// execute a function member
myObject['key 6']();

// use the RE member
const beforeString = "I hate boogers!";
const afterString = beforeString.replace(myObject['key-7'], 'snot'); // use RE
```

The square bracket works for all keys in an object. Keys that have not had a value assigned to them evaluate to the special value `undefined`, which evaluates to `false` when cast to a boolean.

Hence, you may be tempted to test for the presence of a key like so:

```javascript
const anObj = {
    someVal: true,
    someOtherVal: false
};

if(anObj['someVal']){
    console.log('the key someVal HAS been defined');
}else{
    console.log('the key someVal has NOT been defined');
}
```

That will behave as expected for the key `someVal`, but not for the key `someOtherVal`! To be sure a key really is undefined you have to check its type:

```javascript
if(typeof anObj['someOtherVal'] !== 'undefined'){
    console.log('the key someOtherVal HAS been defined');
}else{
    console.log('the key someOtherVal has NOT been defined');
}
```

For the subset of keys that are valid JavaScript names, you can use the shorter dot notation to access object members. The above access examples can be rewritten like so:

```javascript
// access a value directly
const x = myObject.key1;

// access a value indirectly (CANNOT use dot notation)
const desiredKey = 'key2';
const xx = myObject[desiredKey];

// access a primitive value in a nested object
const y = myObject.key2 + myObject.key3.subkey1;

// access an element in an array member
console.log(myObject.key4[0]); // CANNOT use dot for array element

// run an instance function on an object member
const nowISO8601 = myObject.key_5.toISOString();

// execute a function member
myObject['key 6'](); // CANNOT use dot notation because of space

// use the RE member (CANNOT use dot notation because of -)
const beforeString = "I hate boogers!";
const afterString = beforeString.replace(myObject['key-7'], 'snot'); // use RE
```

We were able to use the dot notation a lot of the time, but not all the time. Indirect access always has to be via the square bracket notation, and you can’t use the dot for keys that are not valid variable names like `0`, `'key 6'` & `'key-7'`.

### Get a List of Keys

Given an object, you can use the static `keys()` function from the `Object` class to get a list of all the keys it contains as an array:

```javascript
const myObj = { k1: 'a', k2: 'b', k3: 'c'};

const myKeys = Object.keys(myObj);
// myKeys gets value: ['k1', 'k2', 'k3']
```

### Looping Through Objects

Looping over an object means looping through each of the keys it contains. If you don’t care about the order in which you process the keys you can use a `for...in` loop directly:

```javascript
const myObj = {
    x: 'y',
    a: 42,
    boogers: false
};

for(const k in myObj){
    console.log(`key ${k} maps to value: ${myObj[k]}`);
}

// outputs:
// --------
// key x maps to value: y
// key a maps to value: 42
// key boogers maps to value: false
```

If you need to process the keys in order, you need to first extract them from the object with `Object.keys()` which returns an array, then sort that array with the instance function `.sort()` which returns another array, and only then can you loop over the keys with a `for...of` loop.

Explicitly, this is what you need to do:

```javascript
const myObj = {
    x: 'y',
    a: 42,
    boogers: false
};

// extract the keys
const myObjKeys = Object.keys(myObj);
// myObjKeys now has the value ['x', 'a', 'boogers']

// sort the keys
const myObjSortedKeys = myObjKeys.sort();
// myObjSortedKeys now has the value ['a', 'boogers', 'x']

// loop over the sorted keys
for(const k of myObjSortedKeys){
    console.log(`key ${k} maps to value: ${myObj[k]}`);
}

// outputs:
// --------
// key a maps to value: 42
// key boogers maps to value: false
// key x maps to value: y
```

In the real world, we would never write the whole process out so explicitly. We would instead collapse it to simply:

```javascript
const myObj = {
    x: 'y',
    a: 42,
    boogers: false
};

// loop over the sorted keys
for(const k of Object.keys(myObj).sort()){
    console.log(`key ${k} maps to value: ${myObj[k]}`);
}

// outputs:
// --------
// key a maps to value: 42
// key boogers maps to value: false
// key x maps to value: y
```

### Object Quiz

What will the following code snippets output to the console?

1.  What will the value of `midTotal` be at the end of this code snippet?

    ```javascript
    const salesData = {
      mon: 10,
      tue: 12,
      wed: 9,
      thur: 18,
      fri: 20,
      sat: 21,
      sun: 0
    };
    const midTotal = salesData.mon + salesData.tue + salesData.wed;
    ```

    Click to show Answer

    `31` (`10 + 12 + 9`)

2.  What will the value of z be at the end of this code snippet?

    ```javascript
    const x = {y: 'x', x: 'boogers'};
    const z = x[x.y];
    ```

    Click to show Answer

    Answer: `boogers`

    ```
    // Explanation:
    const z = x[x.y];
    //  |
    // x.y == 'x'
    //  ↓
    const z = x['x'];
    //  |
    // x['x'] == 'boogers'
    //  ↓
    const z = 'boogers';

    ```

3.  What will the following snippet write to the console?

    ```javascript
    const stuff = 'thingy';
    const whatchamagig = {
    	stuff: 'what?',
    	thingy: 'come again?'
    };
    console.log(whatchamagig['stuff']);
    ```

    Click to show Answer

    `what?`

4.  What will the following snippet write to the console?

    ```javascript
    const stuff = 'thingy';
    const thingy = 'huh?';
    const whatsit = thingy;
    const whatchamagig = {
    	stuff: 'what?',
    	thingy: 'come again?',
    	whatsit: { thingamabob: 'huh?' }
    };
    console.log(whatchamagig[thingy]);
    ```

    Click to show Answer

    Answer: `undefined`

    ```
    // Explanation:
    console.log(whatchamagig[thingy]);
    //  |
    // thingy == 'huh?'
    //  ↓
    console.log(whatchamagig['huh?']);
    //  |
    // whatchamagig['huh?'] == undefined
    //  |
    //  V
    console.log(undefined);

    ```

5.  What will the value of `yokie` be after this snippet executes?

    ```javascript
    const whatchamagig = {
    	stuff: 'what?',
    	thingy: 'come again?',
    	whatsit: { thingamabob: 'huh?' }
    };
    const yokie = whatchamagig[whatchamagig.stuff.replace(/[?]/, '') + 'sit'].thingamabob;
    ```

    Click to show Answer

    `huh?`

    ```
    // Explanation:
    const yokie = whatchamagig[whatchamagig.stuff.replace(/[?]/, '') + 'sit'].thingamabob;
    //  |
    // whatchamagig.stuff == 'what?'
    //  ↓
    const yokie = whatchamagig['what?'.replace(/[?]/, '') + 'sit'].thingamabob;
    //  |
    // 'what?'.replace(/[?]/, '') == 'what'
    //  ↓
    const yokie = whatchamagig['what' + 'sit'].thingamabob;
    //  |
    // 'what' + 'sit' == 'whatsit'
    //  ↓
    const yokie = whatchamagig['whatsit'].thingamabob;
    //  |
    // whatchamagig['whatsit'] == { thingamabob: 'huh?' }
    //  ↓
    const yokie = { thingamabob: 'huh?' }.thingamabob;
    //  |
    // { thingamabob: 'huh?' }.thingamabob == 'huh?'
    //  ↓
    const yokie = 'huh?';

    ```

6.  What does the following snippet write to the console?

    ```javascript
    const stuff = 'whatsit';
    const thingy = 'yoke';
    const whatsit = thingy;
    const whatchamagig = {
    	stuff: 'what?',
    	thingy: 'come again?',
    	whatsit: { thingamabob: 'huh?', yoke: 'srsly?' }
    };
    console.log(whatchamagig[stuff][whatsit]);
    ```

    Click to show Answer

    `srsly?`

    ```
    // Explanation:
    console.log(whatchamagig[stuff][whatsit]);
    //  |
    // stuff == 'whatsit'
    //  ↓
    console.log(whatchamagig['whatsit'][whatsit]);
    //  |
    // whatchamagig['whatsit'] == { thingamabob: 'huh?', yoke: 'srsly?' }
    //  ↓
    console.log({ thingamabob: 'huh?', yoke: 'srsly?' }[whatsit]);
    //  |
    // whatsit == thingy == 'yoke'
    //  ↓
    console.log({ thingamabob: 'huh?', yoke: 'srsly?' }['yoke']);
    //  |
    // { thingamabob: 'huh?', yoke: 'srsly?' }['yoke'] == 'srsly?'
    //  ↓
    console.log('srsly?');

    ```

## Worked Example — Improving Our Cellular Automata with more Classes

To continue our knowledge consolidation, let’s return to our [cellular automata classes](https://github.com/bbusschots/bartificer_ca_js). Specifically, I’ll be using my sample solution to the challenge set in instalment 46 as the starting point for our enhancements [tagged release `PBS46-Challenge-Solution` on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS46-Challenge-Solution).

### Better States

At the moment the definition of a cell’s state within the code is extremely loose. Basically, any value is fine, and given an instance of `bartificer.ca.Automaton`, there’s no way to tell what values are and are not considered valid.

When you think about it, for any given CA, the set of possible states is as much a property of that CA as the rules for moving from one state to the next, but as they stand, our prototypes don’t reflect that fact. We should update the API to make that possible.

The first step is to write a simple new class to represent an individual state. It will need just two properties — the state’s underlying value, and a label. The value should be primitive (boolean, number, or string), and the description a string. I’m going to name the class `bartificer.ca.State`.

However, before we can write the class itself we should to lay some groundwork. We’ll need validation functions for primitive values and non-empty strings, so let’s add those:

```javascript
/**
 * Test if a given value is a primitive value.
 *
 * @memberof bartificer.ca
 * @inner
 * @private
 * @param  {*} v - The value to test.
 * @return {boolean} `true` if the value is a boolean, number, or string,
 * `false` otherwise.
 * @see {@link PrimitiveValue}
 */
function isPrimitiveValue(v){
    const vType = typeof v;
    if(vType === 'boolean') return true;
    if(vType === 'number') return true;
    if(vType === 'string') return true;
    return false;
}

/**
 * Test if a given value is a string that's not empty.
 *
 * @memberof bartificer.ca
 * @inner
 * @private
 * @param  {*} v - The value to test.
 * @return {boolean} `true` if the value is a string of length at least
 * one, `false` otherwise.
 * @see {@link NonEmptyString}
 */
function isNonEmptyString(v){
    if(typeof v !== 'string') return false;
    if(v.length < 1) return false;
    return true;
}
```

We can now make use of these functions when writing our simple `bartificer.ca.State` class:

```javascript
/**
 * A prototype to represent a cell state. A state consists of a value and a
 * label.
 */
bartificer.ca.State = class{
    /**
     * The constuctor expects to be passed a value and a label.
     *
     * @param {PrimitiveValue} value
     * @param {NonEmptyString} label
     * @throws {TypeError} A type error is thrown if invalid arguments are
     * passed.
     */
    constructor(value, label){
        // validate the args
        if(!isPrimitiveValue(value)){
            throw new TypeError('the value for a state must be a primitive (boolean, number, or string)');
        }
        if(!isNonEmptyString(label)){
            throw new TypeError('the label for a state must be a string, and must be at least one character long');
        }

        /**
         * The state's value.
         *
         * @private
         * @type {PrimitiveValue}
         */
        this._value = value;

        /**
         * The state's label.
         *
         * @private
         * @type {NonEmptyString}
         */
        this._label = label;
    }

    /**
     * Get the state's value.
     *
     * @returns {PrimitiveValue}
     * @throws {Error} An error is thrown if the accessor is called with
     * arguments.
     */
    value(){
        if(arguments.length > 0){
            throw new Error('read-only acessor called with arguments');
        }
        return this._value;
    }

    /**
     * Get the state's label.
     *
     * @returns {NonEmptyString}
     * @throws {Error} An error is thrown if the accessor is called with
     * arguments.
     */
    label(){
        if(arguments.length > 0){
            throw new Error('read-only acessor called with arguments');
        }
        return this._label;
    }

    /**
     * Get a string representation of the state.
     *
     * @returns {string}
     */
    toString(){
        return `${this._label} (${this._value})`;
    }

    /**
     * Generate a clone of this instance.
     *
     * @returns {bartificer.ca.State}
     */
    clone(){
        return new bartificer.ca.State(this._value, this._label);
    }
};
```

That looks like a lot of code, but really, most of it’s JSDoc comments. On closer inspection all we really have is a class with two private instance properties (`._value` & `._label`), a pair of matching read-only accessor instance functions (`.value()` & `.label()`), a constructor, and the customary `.toString()` and `.clone()` instance functions.

I also added tests for this new class to the test suite, but I won’t clutter this post by copying-and-pasting them here. They’re available via the GitHub repository.

Now that we’ve created this class to represent a state, we need to update the `isCellState()` function so it only considers instances of `bartificer.ca.State` to be valid states:

```javascript
/**
 * Test if a given value is a valid cell state (an instance of
 * {@link bartificer.ca.State}).
 *
 * @memberof bartificer.ca
 * @inner
 * @private
 * @param  {*} s The value to test.
 * @return {boolean} `true` if the value is a valid cell state, `false`
 * otherwise.
 */
function isCellState(s){
    return s instanceof bartificer.ca.State ? true : false;
}
```

With the exception of a little rewording in the JSDoc comments, no changes are needed to either the `bartificer.ca.Cell` or `bartificer.ca.Automaton` classes.

While no changes were needed to the two main classes themselves, huge changes needed to be made to their QUnit test modules. Each test that used a state had to be updated from using a dummy value like `true` to using an instance of `bartificer.ca.State`. Again, I’m not going to clutter this post by pasting in a copy of the test suite. It’s available on GitHub.

Finally, we need to update the `sample.html` page. Specifically, we need to update the initialisation, step, and render functions so they use each state’s `.value()` function to get at a state’s underlying value, and return `bartificer.ca.State` objects as appropriate.

```javascript
// state objects to represent alive and dead
const alive = new bartificer.ca.State(true, 'Alive');
const dead = new bartificer.ca.State(false, 'Dead');

// a render function to render live cells green and dead cells red
function renderRedGreen($td, s){
    // render a true state as green, and false as red
    if(s.value() == true){
        $td.css('background-color', 'Green');
    }else{
        $td.css('background-color', '#ff9999');
    }
}

// an initialisation function to randomly set each cell to alive or dead
function randomState(){
     return Math.random() < 0.5 ? alive : dead;
}

// a step function that implements Conway's game of life
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
        if(numLiveNeighbours < 2) return dead;

        // rule 3
        if(numLiveNeighbours > 3) return dead;
    }else{
        // currently dead - apply rule 4
        if(numLiveNeighbours === 3) return alive;
    }

    // default to no change (incorporates rule 2)
    return currentState;
}
```

For the most part this was just a case of replacing comparisons to a state to use the state’s `.value()` accessor, and returning `bartificer.ca.State` objects instead of raw values. There is one subtlety I do want to draw your attention to. The `neighbourStates` array uses `null` to represent a non-existent neighbour for cells at the edge of the grid. `null` evaluates to `false` without error, but `null.value()` throws an error, hence the need to add a check for `null` on line 25 above.

I’ve published an updated version of this code, including the updated test suite, [on GitHub as the tag release `PBS49-Challenge-StartingPoint`](https://github.com/bbusschots/bartificer_ca_js/tree/PBS49-Challenge-StartingPoint).

## A Challenge

Using [the tagged release `PBS49-Challenge-StartingPoint` on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS49-Challenge-StartingPoint) as a starting point, make the improvements described below.

### Part 1 — Add a `.equals()` Function to `bartificer.ca.State`

An instance function named `.equals()` should be added to the `bartificer.ca.State` class. The function should take one argument, the thing to test. If the thing to test is an instance of `bartificer.ca.State`, and, it has the same value and label as the instance the function was called on, then it should return `true`, otherwise, it should return `false`.

### Part 2 — Refactor the `bartificer.ca.Automaton` constructor

**Note:** *updated 19 Feb 2018 to correctly reflect the fact that the constructor in the starting point code has 5 required arguments, not three like original stated.*

At the moment the constructor in the `bartificer.ca.Automaton` class takes 6 arguments, five required arguments, and one optional. We’re going to need to add another argument to allow a set of allowed states to be passed, so that would take the constructor to a whopping 7 arguments. Any more than 5 arguments is generally considered confusing and a bad smell, so even before we add another we’ve already got a problem. What can we do?

The first thing we can do is reduce the number of required arguments by implementing a default render function. I suggest using a function that colours states with a truthy value one colour, and a falsy value another.

Since name-value pairs are much less confusing to look at than long lists of anonymous values, it’s common practice to collapse some or all of the arguments into an object that can then be passed as a single argument. A pattern you’ll often see is that required arguments are passed directly, and all optional arguments collapsed into a plain object, often named `opts`. That’s the approach we’ll take here.

So, the four required arguments should be left as-is, and the remaining two optional arguments collapsed into a single optional object named `opts` which will expect zero or more of the keys `renderFunction` and `initialState`.

This means that the first line of the constructor needs to change from:

```javascript
constructor($container, rows, cols, stepFn, renderFn, s){
```

to:

```javascript
constructor($container, rows, cols, stepFn, opts){
```

As an example of how the refactored constructor would be used, the call to the constructor in `sample.html` will become:

```javascript
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

The `bartificer.ca.Automaton` constructor should be updated to accept an optional argument (via the `opts` object) named `cellStates`. If this option is passed, the constructor should check that it is an array of `bartificer.ca.State` objects, and if not, throw a `TypeError`. The constructor should also check that no two states in the array contain the same value, and if a clash is found, also throw a `TypeError`. Assuming the value is valid, each element in the array should be cloned into a new array named `this._cellStates`. The reason for the cloning is to avoid _spooky action at a distance_.

If no states are passed `this._cellStates` should be defaulted to `[new bartificer.ca.State(true, 'Alive'), new bartificer.ca.State(false, 'dead')]`.

Finally, the constructor should build a lookup table to allow states be looked up by their value and save it as `this._statesByValue`.

A read-only accessor function named _.cellStates()_ should be added. This accessor should return a new array containing references to the values in the internal array (to avoid _spooky action at a distance_).

A special read-only accessor named `.stateFromValue()` should be added. This function required one argument, a valid state value. It should use the `._statesByValue` lookup table to get the matching state and return it. If there is no matching state, `undefined` should be returned.

Finally, an instance function named `.hasState()` should be added. This function should accept one argument. If the value is passed is an instance of `bartificer.ca.State`, then `true` should be returned if a state exists in the `._cellStates` array that’s equal to the passed state, otherwise `false` should be returned. If the value is not a `bartificer.ca.State` object, then `true` should be returned if one of the states in `._cellStates` has a value that’s equal to the passed argument, otherwise `false` should be returned.

### Part 4 — Improve `.step()` in `bartificer.ca.Automaton`

The `.step()` function in the `bartificer.ca.Automaton` class uses the step function to calculate the next state for every cell in the automaton. The function needs to be improved in two ways.

Firstly, if the step function returns something other than an instance of `bartificer.ca.State`, it should try to convert it to a state using the `.stateFromValue()` function you created earlier. If this fails, a `TypeError` should be thrown.

Secondly, the next state needs to be checked against the list of allowed states (`._cellStates`), thowing a `TypeError` if not found.

## Final Thoughts

This time we made a start on improving how our Cellular Automaton classes represent cell states, and you’ll be finishing off those improvements as your _‘homework’_. Next time we’ll tackle the rendering of states so as to be sure that our prototypes enforce accessibility.
