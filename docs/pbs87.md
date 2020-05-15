# PBS 87 of X — JavaScript Iterators Objects & Generator Functions

In the previous instalment we started our redux and update of function objects in JavaScript. This fits into a larger mini-series within the larger series looking at all the different proverbial hats objects wear in JavaScript. The previous instalment was almost all redux, this one by contrast will be entirely dedicated to updated features added in ES6 that we’ve not seen before.

The instalment has a some-what strange structure because I felt it best to change my plans a little and extend the existing challenge by another week. Hopefully you won’t mind the slightly different flow of the sections compared to the norm.

You can [download this instalment’s ZIP file here](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs87.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs87.zip). If you prefer, you can access this instalment’s resources directly at the following links:

*   `pbs87a.html`:  
    [View Page](https://rawcdn.githack.com/bbusschots/pbs-resources/d5b05df809ead7deeb189618480d16ed1017efb5/instalmentResources/pbs87/pbs87a.html) or  
    [View Source](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs87/pbs87a.html)
*   `pbs87b.html`:  
    [View Page](https://rawcdn.githack.com/bbusschots/pbs-resources/d5b05df809ead7deeb189618480d16ed1017efb5/instalmentResources/pbs87/pbs87b.html) or  
    [View Source](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs87/pbs87b.html)

# Matching Podcast Episode 615

Listen along to this instalment on [episode 615 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/11/ccatp-615)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_11_30.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_11_30.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 85 Challenge Update

It had been my intention to include the sample solution to the challenge set at the end of [instalment 85](https://bartificer.net/pbs85) at the start of this instalment, and to end with a new challenge, but I’ve changed my mind on that. As I was working on my sample solution two things became clear to me — the challenge was a lot more difficult that I had intended, and, a good solution will rely heavily on jQuery, so it will make the perfect hook for a redux and update of our look at DOM objects and jQuery objects.

### A Top-up for Extra Credit

If you’ve already completed the challenge and are very disappointed not to be getting any new ‘homework’, I offer a little top-up to this challenge for some proverbial extra credit.

If you can, add some extra UI to allow users to decide which currencies should be shown as the rows within the cards. Remember that each card represents a currency’s rate against a list of other currencies. So far those ‘other currencies’ have been hard-coded. The primary challenge is to simply add control over the cards, not to add control over the rows within the cards, so this literally adds an extra dimension to the problem.

## Iterators

As you’ve probably noticed over these past few instalments, ES6 brought absolutely massive changes to JavaScript. Iterators are yet another new feature introduced to the language in ES6. We’ve actually already used iterators, but we’ve done so implicitly rather than explicitly.

Let’s start with the problem to be solved — it is often necessary to perform an action on a series of values, i.e., it is often necessary to iterate over a series of values. ES6 added the so-called _iterator protocol_ to provide a standard mechanism for iteration. We won’t be going into the details here, but we do need to understand the official JavaScript terminology.

**An object which can be iterated over can be said to be _iterable_.** All JavaScript Arrays are iterable, as are JavaScript strings (one character at a time).

**All iterables can produce an _iterator object_ on demand.**

Iterator objects provide a `.next()` function for iterating over the values represented by the iterator object. Each time you call `.next()` a dictionary (plain object) with two keys is returned — the first key is `value`, and will be the current value in the sequence, and the second key is `done`, a boolean indicating whether or not the end of the sequence has been reached.

Note that iterator objects are designed to be used once and then discarded, they are not intended as permanent references to the underlying data. When an iterator reaches the end of its sequence it is useless, there is no `.previous()` function, and there is no way to re-start the sequence!

As of ES6, a number of JavaScript objects are now iterable, including arrays, strings, and the special `arguments` objects within functions. Iterating over arrays and arguments seems obvious, but iterating over strings may seem a little stranger at first glance. The iterator objects produced from strings iterate over the string one character at a time. The developers of third-party libraries can also implement the iterator protocol, making their objects iterable too if they so desire. Modern versions of jQuery have added iterator support, so the objects returned from the `$()` function are now iterable, producing iterators that iterate one tag at a time.

### Iterator Object Example

To play along with these examples, open a JavaScript console on the file `pbs87a.html`.

This all sounds very abstract, so let’s create an iterator object and interact with its `.next()` function. To do this we’ll use an array, and we’ll make use of the fact that as of ES6 the `Array` class/prototype provides a `.values()` function which returns a fresh iterator object representing the array’s current values.

```javascript
// create an array
const myArray = ['first val', 'second', '3rd'];

// create an iterator object for the values in the array
const myIterator = myArray.values();

// call the iterator object's .next() function four times
console.log(myIterator.next()); // {value: "first val", done: false}
console.log(myIterator.next()); // {value: "second", done: false}
console.log(myIterator.next()); // {value: "3rd", done: false}
console.log(myIterator.next()); // {value: undefined, done: true}
```

### Iterators and the `for...of` Loop

To date, when describing what the `for...of` loop does I’ve used vague language like _`for...of` loops can iterate over arrays_ and _`for...of` loops can iterate over array-like objects_. We can now be exact! Both iterables and `for...of` loops were introduced in ES6, and that’s no coincidence — the truth is that **`for...of` loops can iterate over any iterable**.

While you can use `.next()` in a `while` loop to iterate over an iterable, in reality you’ll usually use `for...of` loops.

Let’s take a moment to look at `for...of` iterating over things other than arrays.

Firstly, we can use `for...of` to iterate over the special arguments variable that exists within all functions:

```javascript
// define a function that iterates over it arguments
function argLister(){
  console.log(`Received the following ${arguments.length} args(s)`);
  for(const arg of arguments){
    console.log(`* ${arg}`);
  }
}

// call the function with 2 arguments
argLister('howdy', 'doody');

// call the function with 4 arguments
argLister('howdy', 'doody', 'boogers', 'snot');
```

Now let’s iterate over a string:

```javascript
for(const l of "boogers!"){
  console.log(`l=${l}`);
}
```

Finally, let’s demonstrate iterating over a jQuery object. The file `pbs87a.html` contains an un-ordered list with the ID `jq_iter_demo` that contains 3 list items. We can iterate over it like so:

```javascript
// define an array of colour classes
const colourClasses = ['text-primary', 'text-success', 'text-danger'];

// randomly colour each list item
for(const li of $('#jq_iter_demo li')){
  // get a random number between 0 and 2 inclusive
  const randIdx = Math.floor(Math.random() * 1000) % 3;

  // remove all classes then add a random class
  $(li).removeClass().addClass(colourClasses[randIdx]);
}
```

We need to break this very short snippet down to understand it.

The first thing to note is that the iterator objects created by jQuery iterate over native DOM objects, not jQuery objects. This is consistent with how callbacks work in jQuery, so while people may quibble with that choice, it is at least consistent. This means that to treat each iterated value as a jQuery object we have to pass it to the `$()` function. In the example I chose to name the values produced by the iterator `li`, but before I can call jQuery’s `.addClass()` function I have to convert it from a native DOM object to a native DOM object with `$(li)`.

Note that `'#jq_iter_demo li'` is a CSS selector that selects all `<li>` tags within an element with the id `jq_iter_demo`.

Finally, also note the use of jQuery function chaining to first remove all classes with `.removeClass()`, and then add in the randomly chosen class.

This is a very contrived example, but it does show how you use `for...of` loops with jQuery, and it’s all thanks to iterators 🙂

## Generator Functions

Iterable objects are very useful for storing ordered data, but there are more things you may wish to iterate over than stored data. You may wish to iterate over a series of results from some kind of calculation. This is where so-called _generator functions_ come in.

Generator functions can be used to create so-called _generator objects_, and those generator objects are iterable. As well as being iterable, generator objects also have a directly accessible `.next()` function so there is no need for an extra step to get from an iterable to an iterator object (i.e. no equivalent to `myArray.values()`). In effect, a generator object does triple-duty as a generator object, an iterable, and an iterator object.

In practice, **generator functions are used to create generator objects, and their values are iterated over using `.next()` or `for...of` loops**.

If it helps, you can think of generator functions as iterator object factories.

### Creating Generator Functions with `*` and `yield`

Before we look at the exact syntax for creating a generator function, we need to explain a new concept — resumable functions.

So far in everything we’ve seen throughout this series, functions are black boxes that take an arbitrary amount of arguments, execute a sequence of instructions in order, optionally return a single value, and end. They are completely linear, and once a function starts executing it continues until it finishes.

Generator functions are difference! They still take arbitrarily many arguments, they are still executed in order, and they can still return a single value if desired, but they can also pause execution at any time by _yielding_ a value. Yielding is very similar to returning except that it doesn’t end the function, instead, it pauses it. A yield can emit a value, like return does, but it can also receive new arguments when execution resumes. A generator function’s scope is not destroyed when it yields, so when execution resumes all local variables will be just as they were when the function yielded.

The keyword `yield` is used to yield values from and to a generator function.

Generator functions are special functions, so you create them using a special syntax. The idea is similar to how async functions are defined, but a little different, instead of a keyword like async, generator functions are pre-fixed with the `*` character.

You can create generator functions using function statements like so:

```javascript
function* myFirstGenerator(){
  yield 'boogers';
  return 'snot';
}
```

You can also create generator functions using function literals like so:

```javascript
const mySecondGenerator = function*(){
  yield 'boogers';
  return 'snot';
};
```

Note that you can use loops within generator functions, and, that it is perfectly acceptable to have a generator function with an intentional infinite loop that will keep yielding values for ever. Such infinite generator functions will yield, but not return.

### Using Generator Functions

Generator functions are called to create generator objects, and those objects are then interacted with to step through a sequence of values.

Let’s consider the very simple sample generator included in pbs85a.html:

```javascript
function* basicGenerator(){
  console.log('basic generator: started to execute');
  yield 'first yielded value';
  console.log('basic generator: resumed after first yield');
  yield 'second yielded value';
  console.log('basic generator: resumed after second yield');
  return 'final returned value';
}
```

This function yields two strings, then returns a string.

To use this generator function we first call it to create a generator object and store it in the global variable `myGeneratorObj`, then call `.next()` on that generator object.

```javascript
// call the generator function to create a new generator object
myGeneratorObj = basicGenerator();

// call next on the generator object 3 times
console.log(myGeneratorObj.next()); // {value: "first yielded value", done: false}
console.log(myGeneratorObj.next()); // {value: "second yielded value", done: false}
console.log(myGeneratorObj.next()); // {value: "final returned value", done: true}
```

The first thing to note here is that creating the generator object does not execute the generator object. Nothing gets logged until the first time we call `.next()` on the generator object.

The second thing to note is that when a value is yielded `done` is `false`, but when a value is returned, `done` is `true`.

Calling generators directly can be useful, but you can also iterate over all their values with a `for...of` loop. Because generator objects are also iterator objects they can be used directly within a `for...if` loop, but there is a caveat, `for...of` loops only iterate over yielded values, they ignore returned values:

```javascript
// create a generator object
myGeneratorObj = basicGenerator();

// iterate over it
for(const val of myGeneratorObj){
  console.log(`got: ${val}`);
}

// logs:
// -----
// got: first yielded value
// got: second yielded value
```

So, there are two things of note here. Firstly, the `for...of` loop automatically unpacks the dictionaries actually returned by `.next()`, so `val` contains the actual value yielded. And secondly, only the yielded values are included in the loop, the returned value is ignored. I honestly have no idea what it works like this, but it does!

### Generator Function Arguments

Generator functions can accept arguments in the same way any other functions can.

Let’s illustrate this by looking at a more practical example that is designed to play nice with `for...of` loops. Our generator will produce a series of random numbers of a requested length. The number of random numbers desired will be passed as the first argument to the generator function. You’ll find this function defined in `pbs87a.html`, but I’m including the full code below:

```javascript
// basic random number generator
function* basicRNG(n){
  while(n > 0){
    yield Math.random();
    n--;
  }
}
```

Note that the function only uses `yield`, and does not use `return`. This is to ensure `for...of` loops see all the random numbers.

We can now use this generator like so:

```javascript
// create a generator object for 5 random numbers
myGeneratorObj = basicRNG(5);

// iterate over the random numbers and print them
for(const rn of myGeneratorObj){
  console.log(rn);
}
```

There is of course no need to create a separate variable, so we can collapse this down like so:

```javascript
// iterate over 5 random numbers and print them
for(const rn of basicRNG(5)){
  console.log(rn);
}
```

### Infinite Generators

Our examples so far have all been finite series of values, but in reality many series go on for ever.

While infinite series make no sense in a `for...of` loop, they can be very useful in other contexts, particularly interactive contexts where a user can keep performing an action as often as they like.

To illustrate this point let’s look at a more real-world random number generator. Again, this function is defined in `pbs87a.html`, but included below for convenience.

This better random number generator will be able to provider either a finite or infinite number of random numbers, depending on how it’s called. If called with no arguments it will produce an infinite stream, if called with a number as the first argument it will produce that many random numbers.

```javascript
// better random number generator
function* rng(n=0){
  if(n > 0){
    // generate a finite number of random numbers
    while(n > 0){
      yield Math.random();
      n--;
    }
  }else{
    // generate an infinite stram of random numbes
    while(true) yield Math.random();
  }
}
```

This improved generator can still be used within `for...of` loops to generate finite series:

```javascript
// iterate over 3 random numbers and print them
for(const rn of rng(3)){
  console.log(rn);
}
```

But it can now also be used with `.next()` to generate infinite series:

```javascript
// create a new generator object for an infinite series
myGeneratorObj = rng(); // no args

// call .next(as often as desired)
console.log(myGeneratorObj.next());
```

To make this example a little more real-world, `pbs87a.html` contains a web UI for generating random numbers using this generator. The HTML markup is quite straight forward:

```html
<div class="card">
  <h1 class="card-header  h4">Random Number Generator</h1>
  <div class="card-body">
    <form action="javascript:void(0);">
      <div class="form-group">
        <button class="btn btn-primary form-control" id="rng_btn">
          Generate Random Number
        </button>
      </div>
      <div class=form-group>
        <input type="text" class="form-control" id="rng_tb">
      </div>
    </form>
  </div>
</div>
```

This is basically just a Bootstrap card containing a bootstrap form consisting of a button to generate a random number, and a text box to show it. The key points to note are that the button has the ID `rng_btn`, and the text box has the ID `rng_tb`.

This UI is brought to life in the document ready handler by creating an infinite RNG generator object and adding a click handler to the button:

```javascript
// create an infinite RNG generator object
const rngObj = rng();

// add a click handler to the randon number button
$('#rng_btn').click(function(){
  $('#rng_tb').val(rngObj.next().value).select();
});
```

As you can see, the code to bring this form to life is very short. The key things to note are that `rngObj.next().value` will always evaluate to the next random number, and the jQuery `.val()` and `.select()` functions are used to set the content of the text box and then select. The reason I chose to select the newly generated number is to make it easier for users to copy-and-paste the number somewhere.

### Passing Values Back to `yield`

I mentioned previously that `yield` can receive as well as emit values. This might seem like a strange concept at first — `return` is very much a one-way street after all! But, since the `yield` keyword is used to pause **and resume** the function, it does actually make sense. When `yield` triggers a pause can emit a value, and when execution is resumed it can receive a value.

The data flow to and from `yield` statements is handled by the `.next()` function.

I like to think of the `yield` keyword and the `.next()` function as two end of a wormhole — when you `yield` a value it gets returned by `.next()`, and when you pass a value to `.next()` it gets emitted by `yield`.

This might all sound a little confusing, so let’s look at a practical example. We can use a generator function to implement an accumulator — a counter that can be incremented by an arbitrary amount, and can be asked for its current value at any time.

Again, you’ll find the code in `pbs87a.html`, but I’m also including it here:

```javascript
// an acumulator implemented with a generator function
function* accumulator(initVal){
  // if an initial value was passed, store it
  // otherwise start at zero
  const initValNum = Number(initVal); // force to number
  let balance = initValNum ? initValNum : 0;

  // keep updating the balance for ever
  while(true){
    // yield the current balance and accept an increment
    const incBy = yield balance;
    const incByNum = Number(incBy); // force to number

    // if a valid increment was passed to next(), apply it
    if(incByNum){
      balance += incByNum;
    }
  }
}
```

The important thing to note here is the use of the value potentially emitted by `yield`:

```javascript
const incBy = yield balance;
```

The value to the right of the `yield` keyword will be returned by `.next()`, and the `yield` operation will evaluate to value passed to `.next()`. In this case that means that the value passed to `.next()` will get stored in the variable `incBy`.

To use this generator function we first create a generator object with it, and we can then read out the current value by calling `.next()` with no arguments, and update the value by calling `.next()` with a number as the only argument.

Because a generator function does not even start to execute until the first time `.next()` is called, the first call `.next()` cannot be connected to a `yield` statement, so, any value passed to it will vanish into the ether. For this reason we need to _prime the pump_ on our accumulator by calling `.next()` once after we create it:

```javascript
// create a fresh accumulator
accumulatorGenObj = accumulator();
accumulatorGenObj.next(); // step the generator forward to the first yield

// read out the current value
console.log(accumulatorGenObj.next().value);

// increment the value by 10 and read out the new total
console.log(accumulatorGenObj.next(10).value);

// increment the value by 2 and read out the new total
console.log(accumulatorGenObj.next(2).value);

// read out the total one last time
console.log(accumulatorGenObj.next().value);
```

As with the random number generator example, it’s easy to build a simple UI for an accumulator using jQuery and Bootstrap. You’ll find such a UI in `pbs87a.html`.

The markup for the form is very simple:

```html
<div class="card">
  <h1 class="card-header  h4">Accumulator</h1>
  <div class="card-body">
    <form id="accumulator_fm" action="javascript:void(0);">
      <div class=form-group>
        <div class="input-group">
          <input type="number" class="form-control" placeholder="Increment by ..." aria-label="Increment by ..." id="accumulator_inc_tb">
          <div class="input-group-append">
            <button class="btn btn-success" type="submit">Add</button>
          </div>
        </div>
      </div>
      <div class=form-group>
        <input type="text" class="form-control" id="accumulator_out_tb" value="0">
      </div>
    <div class=form-group>
      <button class="btn btn-danger form-control" type="reset">Reset</button>
    </div>
  </form>
</div>
```

As you can see, it’s a Bootstrap card with an input group consisting of a text box and a submit button, a text box, and a reset button. The two text boxes have IDs so their values can be read and written, and the form as a whole has an ID so its submit and reset events can be reacted to.

The code to bring this basic UI to life is entirely contained within the document ready handler, and is quite short:

```javascript
// variable to store the accumulartor generator object
let accumulatorGenObj = null;

// add event handlers to the accumulator UI
// and when done, call the reset event
$('#accumulator_fm').on('reset', function(){
  // create a new accumulator generator object
  accumulatorGenObj = accumulator();

  // call .next() once to get the accumulator to
  // yield its initial balance
  accumulatorGenObj.next();
}).on('submit', function(){
  // call next with the appropriate value
  let incBy = $('#accumulator_inc_tb').val();
  if(!incBy) incBy = 0;
  const newTotal = accumulatorGenObj.next(incBy).value;

  // update the display
  $('#accumulator_out_tb').val(newTotal);
}).trigger('reset');
```

This code creates a variable to store the generator object for accumulator, then adds submit and reset event handlers to the form, and triggers a reset event to get everything initialised properly.

The reset event handler simply creates and stores a new accumulator and calls `.next()` on it once to get it ready to accept values.

The submit event handler simply reads the value from the input text box (defaulting to 0), then passes it to `.next()` and stores the result in a variable named `newTotal`. It then simply writes `newTotal` to the output text box.

The only other thing to note is the use of function chaining to add the two event handlers and to trigger the event in a single statement.

## Final Example/Optional Challenge

You can choose to treat this final example as an example, or, to treat it like a challenge and attempt to create your own solution before opening `pbs87b.html` to see my implementation.

Infinite generator functions are extremely well suited to user-driven sequences of arbitrary length like the famous [Fibonacci series](https://en.wikipedia.org/wiki/Fibonacci_number).

The first two numbers in the sequence are 0 and 1, and from then on the next number in the sequence is the result of adding the two previous numbers together.

The example/challenge implements the Fibonacci series as a generator function, and creates a simple UI for it using Bootstrap and jQuery.

Since it is effectively a spoiler for those who want to treat this example as a challenge, my sample solution is included below the final thoughts.

## Final Thoughts

We’ve now re-visited all the various kinds of functions we’d met before thought this series, and, learned about the new generator functions ES6 brought to the language. That wraps up our redux and update on function objects. In the next instalment we’ll re-visit DOM and jQuery objects, and we’ll use my sample solution to the challenge set at the end of instalment 85 as the hook for that. In the following instalments we’ll continue to look at the different hats objects can wear in JavaScript, focusing on strings and then regular expressions.

## Final Example/Bonus Challenge Solution (Spoilers 🙂)

You can see my sample solution in action [here](https://rawcdn.githack.com/bbusschots/pbs-resources/af4f8f08f02c8628048199f1e253be41b293cd63/instalmentResources/pbs87/pbs87b.html).

In my solution I chose to make use of [Bootstrap](https://getbootstrap.com/), [jQuery](https://jquery.com/), [Mustache](https://mustache.github.io/), and [Numeral.js](http://numeraljs.com/) to build a solution that works well and a looks good but has only a small amount of quite straightforward and understandable code.

Before looking at the UI, let’s look at the implementation of the Fibonacci series itself:

```javascript
function* fibonacci(){
  // variable for the previous state
  // set to zero per the rules
  let prev = 0;

  // yield the first value in the series
  yield prev;

  // variable for the current state
  // set to 1 per th rules
  let cur = 1;

  // yield the second value in the series
  yield cur;

  // keep calculating the next value for ever
  while(true){
    // calcualte the next value
    const newVal = cur + prev;

    // update the previous value
    prev = cur;

    // update and yield the current value
    cur = newVal;
    yield cur;
}
```

The comments hopefully make it clear how this function implements the Fibonacci algorithm. Notice that we yield the initial two values which the algorithm hard-codes before we start the infinite loop that then continues to apply the algorithm for ever.

We can use this function from the console like so:

```javascript
// create a generator object
const fibGen = fibonacci();

// call .next() to step through the series
console.log(fibGen.next().value); // 0
console.log(fibGen.next().value); // 1
console.log(fibGen.next().value); // 1
console.log(fibGen.next().value); // 2
console.log(fibGen.next().value); // 3
console.log(fibGen.next().value); // 5
```

With the generator working we’re ready to build a UI around it.

I chose to use a Bootstrap card to contain the UI as a nice little widget. I chose to have two buttons — one to generate the next value, and one to re-set the UI back to the start of the series. Between the two buttons I added a paragraph into which each number will be appended. Because this is a series I thought it was important to retain a running history of previous values rather than having a single number change each time the button is pushed.

Given those requirements I came up with the following markup for the UI:

```html
<div class="card">
  <h1 class="card-header  h4">Fibonacci Stepper</h1>
  <div class="card-body">
    <form id="fib_fm" action="javascript:void(0);">
      <div class=form-group>
        <button class="btn btn-success form-control" type="submit">Next</button>
      </div>
      <div class=form-group>
        <p class="form-text" id="fib_out"></p>
      </div>
      <div class=form-group>
        <button class="btn btn-danger form-control" type="reset">Reset</button>
      </div>
    </form>
  </div>
</div>
```

Note that I gave the form the ID `fib_fm` to facilitate access via jQuery to attach submit and reset handlers later.

Once I had a basic solution working it became clear that there was a need to highlight the current value, so I chose to do that by making the most recent number larger than the others, and different in colour. I used Bootstrap’s primary colour for the current value, and secondary for all the others. To highlight the numbers I rendered them as Bootstrap badges, and to make the current number bigger I wrapped it in a span with the class `h4`.

Since there would be lots of numbers to render, I chose to create a Mustache template for rendering one number. Because I only needed this one template, and because it is a very small template, I chose to embed it right into the document using a `<script>` tag:

```html
<script type="text/html" id="fib_num_tpl">
  <span class="h4"><span class="badge badge-primary fib_val fib_val_current">{{num}}</span></span>
</script>
```

To facilitate access via jQuery I gave the badge two additional classes of my own choosing — `fib_val` & `fib_val_current`.

With the markup and template taken care of, the final piece of the puzzle is the event handlers to bring the UI to life. All of the code to do this is contained within a jQuery document ready event handler.

First, I declared some variables in the document ready event handler’s scope to facilitate the event handlers themselves:

```javascript
// load the template for rendering a number in the series
const fibNumTpl = $('#fib_num_tpl').html();

// variable to store the Fibonacci generator object
let fibGenObj = null;

// variables for storing the needed page elements
const $fibOut = $('#fib_out');
```

Next, I added reset and submit handlers to the form, and triggered the reset handler to initialise the UI. I used function chaining to collapse this down into one multi-line statement:

```javascript
// add event handlers to the Fibonacci UI
// and when done, call the reset event
$('#fib_fm').on('reset', function(){
  // create a new accumulator generator object
  fibGenObj = fibonacci();

  // empty the output area
  $fibOut.empty();

  // step to the first value
  $(this).trigger('submit');
}).on('submit', function(){
  // get the next value in the sequence
  const newVal = fibGenObj.next().value;

  // generate the markup for the new value
  const newValHTML = Mustache.render(fibNumTpl, {
    num: numeral(newVal).format('0,0')
  });

  // un-highlight the previous value
  $('.fib_val.fib_val_current', $fibOut)
    .removeClass('badge-primary fib_val_current')
    .addClass('badge-secondary')
    .unwrap();

  // append the new value
  $fibOut.append(newValHTML);
}).trigger('reset');
```

Hopefully the comments are sufficient to make the code self-documenting.

One thing I do want to draw attention to though is the code for un-highlighting the previous value:

```javascript
$('.fib_val.fib_val_current', $fibOut)
  .removeClass('badge-primary fib_val_current')
  .addClass('badge-secondary')
  .unwrap();
```

The difference between the highlighted current value and the un-highlighted previous values is three-fold. Firstly, the current value has the class `badge-primary` while the previous values have `badge-secondary` instead. Secondly, the current value has the additional class `fib_val_current`. And finally, the current value is wrapped in a `<span>` with the class `h4` that the other value are not wrapped in.

Firstly, the `$()` function is passed a CSS selector that looks for any tag with both the classes `fib_val` and `fib_val_current`, and confines it’s search within the output area (stored in `$fibOut`).

The un-needed classes are then removed using jQuery’s `.removeClass()` function, and the needed additional class added with jQuery’s `.addClass()` function.

That leaves just the un-wanted wrapping of the value in the span with the class `h4`. I wasn’t sure how best to do this so I googled for “unwrap tag with jQuery”, and was immediately led to [the documentation for jQuery’s `.unwrap()` function](https://api.jquery.com/unwrap/). This function does exactly what’s needed, so it was literally as simple as adding `.unwrap()` into the function chain.
