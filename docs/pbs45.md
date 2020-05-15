# PBS 45 of x – ES6 Arrays & Strings

We’ll start this instalment be re-visting the question of when to use `let` and when to use `const` for variable declarations. My initial advice was to default to using `let`, but based on some great feedback from the community, I’ve changed my mind, and will be defaulting to `const` going forward. I’ll explain why I changed my mind.

Next we’ll have a quick look at my sample solution to the challenge set at the end of the previous instalment, before moving on to some new material. Specifically, we’ll look at some of the ways in which ES6 has improved arrays and strings.

# Matching Podcast Episode 514

Listen Along: Chit Chat Across the Pond Episode 514

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_12_11.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_12_11.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Re-thinking `const` -v- `let`

Let’s get started, and re-visit the question of when to use `let`, and when to use `const`.

When I first introduced these two new keywords I suggested you mentally replace `var` with `let` unless you were defining a document-wide constant _‘like the gravitational constant’_. Lots of resources online give similar advice, but, on reflection, and with the help of some very thoughtful feedback from readers/listeners (special shout-out to listener Jill), I’ve changed my mind.

My advice now, and what I will be doing for the remainder of this series, is to **default to using `const`, unless you intend to assign multiple values to the variable**.

The reasoning behind this advice is convert as many potential bugs as possible into errors.

As an example, let’s look at one specific way in which Allison’s solution to the PBS 43 challenge was better than mine.

This was the original function before converting to ES6:

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
    var self = this;
    var autoStepFn = function(){
    if(self._autoStepID){
        // take a step
        self.step();

        // set a fresh timeout - CAUTION: recursive code!
        self._autoStepID = window.setTimeout(autoStepFn, self.autoStepIntervalMS());
    }
};
```

My sample solution changed this function to:

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
    let self = this;
    let autoStepFn = function(){
    if(self._autoStepID){
        // take a step
        self.step();

        // set a fresh timeout - CAUTION: recursive code!
        self._autoStepID = window.setTimeout(autoStepFn, self.autoStepIntervalMS());
    }
};
```

But Allison changed the function to:

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
```

Which is better?

Well, the function of the `self` variable is to act as a proxy for the outer function’s `this` within the callback (which has its own `this`). That means `self` should, by definition never change. So, any attempt to change the value of `self` must be a mistake. If I define `self` with `let` then that mistake becomes a weird bug, if I define `self` with `const`, that mistake becomes an error, which means it can be quickly and easily fixed.

This is why I’m choosing to change my use of `let` and `const` — I like programming practices that surface my mistakes as errors, because mistakes that get to live on as bugs cause me nothing but pain!

Before moving off this topic, I want to remind you about how JavaScript variables treat objects, and, take another look at `for` and `for...in` loops.

If you declare a variable with `const` then its value can’t be changed. But what is actually stored in a variable? Only one of four possible things — a boolean value, a numeric value, a string value, or a **reference** to an object. So, when you use `const` to define a variable that points to an object you are saying that the variable can never point to another object, not that the values of the keys within the object can’t change.

Let’s look at traditional `for` loops again, can we replace `var` with `const` here? Consider this loop:

```javascript
for(var i = 1; i <= 10; i++){
    console.log('4 x ' + i + ' = ' + (4 * i));
}
```

That is really just _syntactic sugar_ for (a nicer way of writing) the following:

```javascript
var i = 1;
while(i <= 10){
    console.log('4 x ' + i + ' = ' + (4 * i));
    i++;
}
```

So, `i` contains numeric values that change each time the loop executes. That means we cannot use `const`, and must use `let`, so the loop becomes:

```javascript
for(let i = 1; i <= 10; i++){
    console.log('4 x ' + i + ' = ' + (4 * i));
}
```

Now let’s look at the `for...in` loop. Again, we’ll use a simple example to illustrate the point:

```javascript
var tlaLib = {
    mph: 'miles per hour',
    mpg: 'miles per gallon',
    kmh: 'kilometers per hour'
};
for(var tla in tlaLib){
    console.log(tla + ': ' + tlaLib[tla]);
}
```

This is really syntactic sugar for something like:

```javascript
var tlaLib = {
    mph: 'miles per hour',
    mpg: 'miles per gallon',
    kmh: 'kilometers per hour'
};
Object.keys(tlaLib).forEach(function(){
    var tla = arguments[0];
    console.log(tla + ': ' + tlaLib[tla]);
});
```

This means that each time you go around a `for...in` loop you get a completely new `tla` variable that comes into existence at the start of the iteration, and ends at the end. Since our example object has three keys, that means three different `tla` variables come into being, last for a few lines of code, and then cease to exist. Changing the value of the current key within the body of a loop will always be a mistake, so, they should be declared with `const`. Hence, I would re-write this example as:

```javascript
const tlaLib = {
    mph: 'miles per hour',
    mpg: 'miles per gallon',
    kmh: 'kilometers per hour'
};
for(const tla in tlaLib){
    console.log(tla + ': ' + tlaLib[tla]);
}
```

Based on this re-thinking of `const` and `let`, I’ve updated my sample solution to the challenge set in instalment 43, and published it as [the tagged release `PBS43-Challenge-Solution-v2` on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS43-Challenge-Solution-v2).

## PBS 44 Challenge Solution

The challenge set at the end of the previous instalment was simply to update the test suite for our cellular automata to use all the ES6 we had learned about at that point. The starting point was the [tagged release `PBS42-Challenge-Solution` on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS42-Challenge-Solution).

Ordinarily I would draw your attention to a few key points in my solution, but this challenge really was pure repetition, so there’s nothing I want to highlight.

## ES6 Arrays

There are two array-related ES6 features I want to draw attention to, but I do want to point out that ES6 contains many more array-related goodies than just these two.

### Conversion of Array-like Objects to Arrays

A real annoyance in earlier versions of JavaScript is that there are objects that looks like arrays, and behave like arrays in some ways, but are not actually arrays, and hence, don’t have the `Array` prototype. The best example of this is the special `arguments` object that exists inside each function. The first argument is at `arguments[0]`, the second at `arguments[1]`, and the number of arguments is at `arguments.length`. That sure looks array-like! However, because `arguments` is not really an array it doesn’t have a `.forEach()` function.

ES6 solves this problem with the addition of the `Array.from()` function (a static function provided by the `Array` prototype). You pass this function an array-like object as the first argument, and it returns a true array containing the same values as the original.

```javascript
function argsArrayTest(){
    Array.from(arguments).forEach(function(a, i){
        console.log('arg' + i + '=' + a);
    });
}
argsArrayTest('boogers');
argsArrayTest('bogies', 'snot');

// outputs:
// --------
// arg0=boogers
// arg0=bogies
// arg1=snot
```

### Looping Through Arrays with `for...of` Loops

Looping over all the elements in an array is a really common thing to want to do, and ES6 makes that much cleaner with the addition of the `for...of` loop.

To illustrate how `for...of` loops work, let’s start with a simple example — a tradition `for` loop iterating over an array:

```javascript
var mucusSynonyms = ['boogers', 'bogies', 'snot'];

console.log("Synonyms for 'dried nasal mucus':");
for(var i = 0; i < mucusSynonyms.length; i++){
    console.log('* ' + mucusSynonyms[i]);
}

// outputs:
// --------
// Synonyms for 'dried nasal mucus':
// * boogers
// * bogies
// * snot
```

We can simplify this with a `for...of` loop like so:

```javascript
const mucusSynonyms = ['boogers', 'bogies', 'snot'];

console.log("Synonyms for 'dried nasal mucus':");
for(const synonym of mucusSynonyms){
	console.log('* ' + synonym);
}

// outputs:
// --------
// Synonyms for 'dried nasal mucus':
// * boogers
// * bogies
// * snot
```

Without having to manually update the value of a counter variable (`i` in the example above), the possibility of a mistake leading to our code running off the end of the array, or of accidentally creating an infinite loop has been removed. As well as being more robust, the `for...of` loop is also more concise and easier to read, and hence, understand.

## ES6 Strings

Again, like with arrays, I just want to draw your attention to two new string-related features, but be aware that ES6 offers more in this area too.

### Looping over Strings with `for...of` Loops

With previous versions of JavaScript, looping over every character in a string was tedious at best:

```javascript
var myString = 'boogers';

var randomCase = '';
for(var i = 0; i < myString.length; i++){
    var c = myString.charAt(i);
    randomCase += Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase();
}
console.log(randomCase);
```

But now we can use the same `for...of` loop we use for arrays:

```javascript
const myString = 'boogers';

let randomCase = '';
for(const c of myString){
    randomCase += Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase();
}
console.log(randomCase);
```

### Template Literals (AKA Template Strings)

Until now the only option we’ve seen for building strings from the values in variables is string concatenation. This is tedious, and results in very messy and difficult to read code.

Thanks to template strings in ES6, you never have to concatenate again if you don’t want to!

A template string is surrounded by so-called back-ticks rather than single or double quotation marks. Within a template string you can insert a value from an expression by including the expression in the string wrapped between `${` and `}`. Any valid JavaScript expression can be included in this way, but in reality you’ll mostly just be including a single variable, or perhaps a function call on a variable, or maybe an arithmetic expression, e.g.:

```javascript
let r = 4;
console.log(`Given a radius of ${r}, the circumfrence is ${2 * r * Math.PI}`);
```

For comparison, in the past I would have written that above simple and easy to read code like so:

```javascript
var r = 4;
console.log('Given a radius of ' + r + ', the circumfrence is ' + (2 * r * Math.PI});
```

If you need to include an actual back-tick inside a template string you have to escape it with a backslash, and, if you need to include a backslash you need to escape that too, so `becomes` , and `\\` becomes `\`. Finally, you should you need the string `${` in your output, the you need to escape it, so `\${` becomes `${`.

## Challenge

Apply what we learned to both the bartificer.ca prototypes (`lib/bartificer.ca.js`) and the test suite (`test/tests.js`). Use my sample solution to the previous instalment ([the release tagged `PBS44-Challenge-Solution` on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS44-Challenge-Solution)) as your starting point.

To avoid introducing bugs into the code, my advice is to update one file, make sure all tests still pass, and then the other, again, making sure all tests still pass.

## Final Thoughts

We’ve now learned about how ES6 has improved variable scoping with lexical scopes, function argument handling with default values and variadic arguments, arrays, and strings. Next time we’ll discover a whole new type of function, and, how it can save us from the need for declaring variables named `self` to preserve access to the containing function’s `this` within callbacks, and we’ll make a start on our exploration of _classes_, which provide a more human-friendly mechanism for defining our own prototypes.
