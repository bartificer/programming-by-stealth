# PBS 44 of x – ES6 Arguments & Objects

In [the previous instalment](https://bartificer.net/pbs43) we started our exploration of the new features ES6 brought to JavaScript with a look at block scoped variables. We learned that `var` will continue to work as it always has, defining function-scoped variables, but that we can now use `let` and `const` to define block-spoped variables and constants.

We’ll continue our exploration of ES6 today by looking at how function arguments have been improved, and learning about a new type of loop designed to make looping over object properties easier.

There is no ZIP file for this instalment, instead, I’ve published my solution to the challenge from the previous instalment (which is also the starting point for the next challenge) as [a tagged release on GitHub](https://github.com/bbusschots/bartificer_ca_js/tree/PBS43-Challenge-Solution). You can download it using the big green button labeled _Clone or Download_.

# Matching Postcast Episode 511

Listen Along: Chit Chat Accross the Pond Episode 511

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_11_26.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_11_26.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 43 Challenge Solution

The challenge set at the end of the previous instalment was very simple — update the `bartificer.ca` prototypes to use ES6’s `let` and `const` keywords as appropriate, using the test suite to ensure you don’t introduce any bugs in the process. This kind of internal change without a change in functionality is known in software engineering jargon as _code refactoring_. Any bugs you add when doing this kind of work would be know as _regressions_. The fact that we have a test suite makes regressions much easier to find and fix before release.

I’ve published my sample solution to GitHub as [the tagged release `PBS43-Challenge-Solution` of `bartificer.ca.js`](https://github.com/bbusschots/bartificer_ca_js/tree/PBS43-Challenge-Solution).

For the most part this was simply a matter of replacing the `var` keyword with the `let` keyword, but there were a few subtitles that I want to draw your attention to.

Firstly, safely declaring shared global namespaces like `bartificer` still needs to be done with `var`. Why? Because the same namespace is used as the parent namespace for many separate APIs, and it needs to be possible to use multiple such APIs within a single page.

In other words, this line needs to remain as it is:

```JavaScript
var bartificer = bartificer ? bartificer : {};
```

You can try re-write it with `let` or `const`, but you’ll run into a brick wall

If you were to try do the following, what would happen?

```JavaScript
let bartificer = bartificer ? bartificer : {};
```

You’ll get an error. Why? Because, as we learned last time, `let` declarations don’t get hoisted.

Remember, the assignment operator (`=`) has the lowest precedence (we learned about operator precedence way back in [instalment 12](https://www.bartbusschots.ie/s/2016/04/01/programming-by-stealth-12-of-x-javascript-intro/)), so it happens after the ternary operator. That means the ternary operator tries to access the `bartificer` variable before it’s been declared. The reason this weird line of code works with `var` is that `var` declarations do get hoisted.

Even if `let` variables were hoisted, there would be an even bigger problem with using `let` to conditionally initialise a shared global namespace that may already be initialised like `bartificer` — `let` throws an error if you try to use it to re-declare an already declared variable!

The second subtly I want to draw your attention to is that there were opportunities to reduce the scope of some variables, which is generally better. It’s a good rule of thumb that you want the scope of your variables to be as small as needed, but no smaller.

As an example, let’s look at `bartificer.ca.Automaton.prototype.step()`:

```JavaScript
/**
 * Step the automaton forward by one step.
 *
 * @returns {bartificer.ca.CellylarAutomaton} Returns a reference to self.
 */
bartificer.ca.Automaton.prototype.step = function(){
    // first calcualte the next state of each cell
    var x, y;
    for(x = 0; x < this.cols(); x++){
        for(y = 0; y < this.rows(); y++){
            // get a reference to the current cell
            var c = this.cell(x, y);
                
            // calculate the next state
            var ns = this._stepFn(c.state(), this.cellNeighbourStates(x, y));
                
            // set the cell's next state to the newly calculated value
            c.nextState(ns);
        }
    }
        
    // next move each cell forward into its next state and re-render it
    for(x = 0; x < this.cols(); x++){
        for(y = 0; y < this.rows(); y++){
            this.cell(x, y).advance();
            this._renderFn(this.cell(x, y).$td(), this.cell(x, y).state());
        }
    }
        
    // finally, increment the generation counter
    this._generation++;
    this.generationChange();
        
    // return a reference to self
    return this;
};
```

Because `var` is function-scoped, the two sets of for loops share the same `x` and `y` variables. That’s not something we want, we just didn’t have a choice in the matter with `var`.

We could just replace `var` with `let`, and leave the scope as-is, but while that would result in working code, it wouldn’t be in keeping with the spirit of ES6, or our aim of minimising variable scope. So, instead, we should create separate instances of `x` and `y` for each set of loops:

```JavaScript
/**
 * Step the automaton forward by one step.
 *
 * @returns {bartificer.ca.CellylarAutomaton} Returns a reference to self.
 */
bartificer.ca.Automaton.prototype.step = function(){
    // first calcualte the next state of each cell
    for(let x = 0; x < this.cols(); x++){
        for(let y = 0; y < this.rows(); y++){
            // get a reference to the current cell
            let c = this.cell(x, y);
              
            // calculate the next state
            let ns = this._stepFn(c.state(), this.cellNeighbourStates(x, y));
                
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
};
```

For clarity, I’ve highlighted the scopes of the two separate `x` variables in the snippet above.

## ES6 — Improved Function Arguments

ES6 improves function argument handling in two important ways. Firstly, it allows default values to be specified for optional arguments, and secondly, it provides a nice new mechanism for capturing arbitrarily many arguments.

### Default Argument Values

It’s quite common to have functions with optional arguments. When the function is called without an optional argument your code needs to provide a default value to use instead. In previous versions of JavaScript you had to do this defaulting within the body of the function, so default values were not easy to see at a glance.

Let’s use a trivially simple example to illustrate the point — a function to increment a value. The first argument must be the value to increment, and the second optional argument is the amount to increment by, which defaults to one:

```JavaScript
function inc(n, i){
    if(typeof i === 'undefined'){
        i = 1;
    }
    return n + i;
}
```

A seasoned programmer might shorten that function to:

```JavaScript
function inc(n, i){
    return n + (typeof i === 'undefined' ? 1 : i);
}
```

However, regardless of which of those implementations you choose, the fact that `i` defaults to `1` is not immediately obvious at a glance — you have to work through the logic of the function to figure that out. This is a contrived overly simple example with just one optional argument, in reality the code for defaulting arguments will be mixed in with many more lines of code, so the default values will be even less obvious.

With ES6 we can give default values right within the function declaration, so our function now becomes just:

```JavaScript
function inc(n, i = 1){
    return n + i;
}
```

I think you’ll agree that’s much clearer!

### _Variadic_ AKA _Rest_ Arguments

Way back in [instalment 16](https://www.bartbusschots.ie/s/2016/06/08/programming-by-stealth-16-of-x-javascript-function-objects/) we learned how to write functions that can process arbitrarily many arguments by looping over the special `arguments` object that exists within each function. We illustrated the point with this sample function which multiplies together arbitrarily many numbers:

```JavaScript
function product(){
    // if there are no arguments, return 0
    if(arguments.length == 0){
        return 0;
    }
  
    // loop over the arguments
    var ans = 1;
    for(var i = 0; i < arguments.length; i++){
        ans = ans * arguments[i];
    }
  
    // return the final answer
    return ans;
}
```

You can see the function in action with calls like these:

```JavaScript
console.log(product(3, 4)); // 12
console.log(product(1, 2, 3, 4, 5)); // 120
```

The above code works, but it’s not at all clear from the function declaration what arguments the function expects — you have to read the code to figure that out.

ES6 adds a feature some other languages have had for many years, so-called _variadic_ or _rest_ arguments. A function can only define a single variadic argument, and it has to be the last argument. Why? Because a variadic argument collects all the remaining arguments together into a single array. You can think of a variadic argument as _‘all the rest of the arguments’_, hence the nickname _rest arguments_.

In ES6 you define an argument as being variadic by pre-fixing the name with three periods. So, we could re-write the above example like so:

```JavaScript
// define the product function
function product(...n){
    // if there are no arguments, return 0
    if(n.length === 0){
        return 0;
    }
  
    // loop over the numbers
    let ans = 1;
    n.forEach(function(num){ ans *= num; });
  
    // return the final answer
    return ans;
}

// call the prodcut function
console.log(product(3, 4)); // 12
console.log(product(1, 2, 3, 4, 5)); // 120
```

This has two obvious advantages. Firstly, the fact that this function accepts arbitrarily many arguments is now obvious from the function declaration, and secondly, because `n` is now a true array, we can use functions from the `Array` prototype on it (like `.forEach()`).

In the above example the variadic argument is the only argument, but that doesn’t have to be the case, the variadic argument just has to be last.

For example, the following function takes an operator as the first argument, and then applies that operator to all the other arguments passed. So, it has one regular argument, and then all other arguments passed get collapsed into the variadic argument:

```JavaScript
// declare function
function prefixOp(op, ...n){
    if(n.length === 0) return NaN;
    if(n.length === 1) return n[0];
    let ans = n[0];
    for(let i = 1; i < n.length; i++){
        switch (op){
            case '+':
                ans += n[i];
                break;
            case '-':
                ans -= n[i];
                break;
            case '*':
            case 'x':
                ans *= n[i];
                break;
            case '/':
                ans /= n[i];
                break;
            default:
                throw new Error("unknown operator '" + op + "'");
        }
    }
    return ans;
}

// use function
console.log(prefixOp()); // NaN
console.log(prefixOp('/', 1)); // 1
console.log(prefixOp('-', 12, 4)); // 8
console.log(prefixOp('+', 2, 4, 8)); // 14
console.log(prefixOp('*', 3, 5, 2, 10)); // 300
```

Note that you can’t assign a default value to a variadic argument.

## ES6 — Looping Over Objects with `for ... in` Loops

Way back in [instalment 17](https://bartificer.net/pbs17) we learned how to loop over objects with the help of the `Object.keys()` function. We used the following example to illustrate the point:

```JavaScript
// create an object representing three letter acronyms
var tlaLib = {
  rpm: 'Revolutions per Minute',
  mph: 'Miles per Hour',
  rms: 'Root Mean Square'
};

// list the known acronyms
pbs.say('The following acronyms are defined: ' + Object.keys(tlaLib));

// loop through the object to print all known acronyms
Object.keys(tlaLib).forEach(function(tla){
  pbs.say(tla + ": " + tlaLib[tla]);
});
```

Note that this example is designed to be run inside the [PBS JavaScript playground](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/), hence the calls to `pbs.say()`.

With ES6 there’s an easier way — the so-called `for ... in` loop:

```JavaScript
// create an object representing three letter acronyms
const tlaLib = {
  rpm: 'Revolutions per Minute',
  mph: 'Miles per Hour',
  rms: 'Root Mean Square'
};

// list the known acronyms
pbs.say('The following acronyms are defined: ' + Object.keys(tlaLib));

// loop through the object to print all known acronyms
for(let tla in tlaLib){
  pbs.say(tla + ": " + tlaLib[tla]);
}
```

The example above uses a plain object (`tlaLib`), but things get a little more complicated when looping over prototyped objects. Why? Because prototyped objects can contain both _instance properties_ and _static properties_.

> ### Revision — Instance -v- Static Properties
> 
> Prototyped objects can have two distinct kinds of property — those that belong to the instance itself, and those that belong to the prototype.
> 
> Each instance of a prototype has its own separate copy of each instance property, hence the name.
> 
> Properties that belong to the prototype itself are different. There’s just a single copy of those properties that all instances share. We’ve been referring to these as _static properties_, but you may also see them referred to as _prototype properties_, or even _class properties_).
> 
> The following simple prototype contains one of each kind of property:
> 
> ```JavaScript
> // declare a simple prototype with:
> // One instance property (colour),
> // and one static property (aka)
> function Booger(c = 'green'){
>     this.colour = c;
> }
> Booger.prototype.aka = 'Bogey';
> ```
> 
> We can create two instances of this prototype with the following:
> 
> ```JavaScript
> // create two Boogers
> let bogey1 = new Booger();
> let bogey2 = new Booger('yellow');
> ```
> 
> Each of these instances has their own copy of the instance property `colour`, as demonstrated by the following code snippet:
> 
> ```JavaScript
> // show both colours
> console.log(bogey1.colour); // green
> console.log(bogey2.colour); // yellow
> 
> // change the colour of bogey1
> bogey1.colour = 'white';
> 
> // show both colours again
> console.log(bogey1.colour); // white
> console.log(bogey2.colour); // yellow
> ```
> 
> However, both instances share a reference to the single static property `aka`, as illustrated by the following:
> 
> ```JavaScript
> // show both aka properties
> console.log(bogey1.aka); // Bogey
> console.log(bogey2.aka); // Bogey
> 
> // change the static aka property
> Booger.prototype.aka = 'Snot';
> 
> // show both aka properties
> console.log(bogey1.aka); // Snot
> console.log(bogey2.aka); // Snot
> ```

When iterating over an object’s properties, `for ... in` will iterate over both the instance and static properties. You may or may not want that behaviour!

If you only want to iterate over an object’s instance properties, sometimes referred to as an object’s _own properties_, you need to make use of the `.hasOwnProperty()` function provided by the built-in `Object` prototype.

This function takes a string as an argument and returns `true` if the object has an instance property with that name, and `false` otherwise.

You can see this in action with the following code snippet:

```JavaScript
// declare a simple prototype with:
// one instance property (colour),
// and one static property (aka)
function Booger(c = 'green'){
	this.colour = c;
}
Booger.prototype.aka = 'Bogey';

// create a Booger
let bogey1 = new Booger();

// test which are own properties
console.log(bogey1.hasOwnProperty('colour')); // true
console.log(bogey1.hasOwnProperty('aka')); // false
```

There’s one final complication with `for ... in` loops — they only iterate over so-called _enumerable properties_. In practice what that means is that `for ... in` loops ignore standard properties like `length` provided by the built-in prototypes like `Object` and `Array`.

To illustrate this point, an array containing one element has two instance properties, `0`, and `length`, but only the `0` property is enumerable:

```JavaScript
// craete an Array object with one element
let a = ['boogers'];

// this object has two properties
console.log('property 0=' + a[0]); // enumerable
console.log('property length=' + a['length']); // not enumerable

// print all enumerable properties
console.log('All enumerable properties:');
for(let prop in a){
	console.log('* ' + prop + ': ' + a[prop]);
}

// Output:
// -------
// property 0=boogers
// property length=1
// All enumerable properties in a:
// * 0: boogers
```

## A Challenge

Using my solution from the previous instalment as your starting point, update the test suite (`test/tests.js`) to use the ES6 features we’ve learned so far.

## Final Thoughts

Having learned about `let` and `const`, default argument values, variadic arguments, and `for ... in` loops, we’re not even half way through all the cool feature ES6 added to JavaScript. We’ll continue our exploration of ES6 next week with a look at how arrays and strings have been improved.