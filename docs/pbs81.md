# PBS 81 of X — The JavaScript Promise Utilities

So far in our exploration of promises we’ve learned the core concept — a promise is an object that represents the status and/or result of an asynchronous task. Asynchronous tasks are inherently parallel, but we’ve learned how to use `.then()` and `.catch()` to create so-called _promise chains_, allowing promises to be executed in series. What we’ve not looked at yet is JavaScript’s native `Promise` class. This class is primarily used to create promises, but it also provides some useful utility functions. For now at least, we’re focusing on using promises rather than creating them; so we won’t be digging into how the `Promise` class’s contractor works. However, some of the utility functions are designed to help developers use promises in more powerful ways. Those will be our focus for this instalment. The most powerful of these utilities is `Promise.all()`, a function that allows us to create promise chains that perform some tasks in series, and others in parallel, allowing us to efficiently manage our asynchronous tasks.

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/07/pbs81.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs81.zip).

## Matching Podcast Episode 602

Listen along to this instalment on [episode 602 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/07/ccatp-602/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_07_12.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_07_12.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 80 Challenge Solution

The challenge set at the end of [the previous instalment](https://pbs.bartificer.net/pbs80) was to update either your number guessing game or mine so it uses a promise to fetch the random number, and so it uses at least two Mustache templates.

My sample solution already used Mustache templates. So I didn’t have to make any changes at all for the second part of the challenge 🙂

The only change I needed to make was to alter the AJAX request for a random number so it used promises rather than the `success` and `error` callbacks. In my code this functionality was all contained within the function `resetGame()`. Before I started my alterations, the basic structure of that function could be summarised with the following pseudo-code:

```javascript
function resetGame(){
  // set the game on flag to false
  GAME_ON = false;

  // blank and hide the modal
  // …

  // set the game UI to the loading spinner & empty $GAME_MESSAGE_CONTAINER & $GUESSES_DISPLAY
  // …

  // fetch a random number via AJAX
  $.ajax({
    // …
    success: function(rn){
      // save the random number
      RANDOM_NUMBER = rn;

      // blank the guesses
      // …

      // reset the game UI
      resetGameUI();

      // game on!
      GAME_ON = true;
    },
    error: function(){
      // show error
      // …
    }
    // …
  });
}
```

Notice that the return value from `$.ajax()` is being ignored, that the successful fetching of a random number is being dealt with in the `success` callback passed as an option to `$.ajax()`, and that the failure to fetch a random number is being dealt with in the `error` callback passed as an option to `$.ajax()`.

The return value from `$.ajax()` is a promise, so we should not ignore it!

The first step is to make use of that value. For now, let’s store it in a sensibly named variable:

```javascript
const randNumPromise = $.ajax({
  // …
});
```

Next, we need to use `.then()` to respond to the promise’s resolution or rejection:

```javascript
randNumPromise.then(
  function(rn){ // resolved
    // copy & paste the code from the success callback here
  },
  function(){ // rejected
    // copy & paste the code from the error callback here
  }
);
```

Of course there is no need to do this as two separate statements. We can collapse this into a single statement of the form:

```javascript
$.ajax({
  // …
}).then(
  function(rn){ // resolved
    // copy & paste the code from the success callback here
  },
  function(){ // rejected
    // copy & paste the code from the error callback here
  }
);
```

With that done, the `success` and `error` callbacks need to be removed from the options passed to `$.ajax()`.

Putting it all together, my finished `resetGame()` function looks like this:

```javascript
function resetGame(){
  // set the game on flag to false
  GAME_ON = false;

  // blank and hide the modal
  $MODAL.modal('hide');
  $MODAL_CONTENT.empty();

  // set the game UI to the loading spinner & empty $GAME_MESSAGE_CONTAINER & $GUESSES_DISPLAY
  $GAME_INTERFACE.html(SPINNER_HTML);
  $GAME_MESSAGE_CONTAINER = null;
  $GUESSES_DISPLAY = null;

  // fetch a random number via AJAX
  $.ajax({
    url: 'https://bartbusschots.ie/utils/fakerWS/numberBetween/1/text',
    data: {
      arg1: MIN,
      arg2: MAX
    },
    method: 'GET',
    cache: false,
    dataType: 'text'
  }).then(
    function(rn){ // resolved
      // save the random number
      RANDOM_NUMBER = rn;

      // blank the guesses
      GUESSES = [];
      MIN_POSSIBLE_GUESS = MIN;
      MAX_POSSIBLE_GUESS = MAX;

      // reset the game UI
      resetGameUI();

      // game on!
      GAME_ON = true;
    },
    function(){ // rejected
      $GAME_INTERFACE.empty().html(Mustache.render(
        TEMPLATES.gameInitError
      ));
    }
  );
}
```

You’ll find my full solution in the folder `pbs80-challengeSolution` in this instalment’s ZIP file.

## JavaScript’s Native `Promise` Class

We’ve already learned that JavaScript can treat any object that behaves like a promise as a promise, and that we refer to those promise-like objects as _thenables_ because they provide a `.then()` function.

While JavaScript is happy to use any thenable, it does provide a native promise implementation through the built-in class `Promise`. You can use this class to build your own promises, but that’s not what we’ll be doing today. Instead, we’ll be looking at some of the static utility functions this class offers.

There are not many of these functions, but they’re extremely useful, particularly when it comes to parallelising interdependent asynchronous tasks.

## Creating Immediately Resolved/Rejected Promises

There are times when it’s convenient to instantly create a resolved or rejected promise for a given piece of data or error. Perhaps an API requires a promise as an argument, and you already have the data you need to promise, or perhaps you want to start a promise chain with a default state. The `Promise` class provides the two functions we need to achieve this:

<dl>
<dt><code>Promise.resolved(val)</code></dt>

<dd>This function returns a native JavaScript promise that has resolved to <code>val</code> (i.e. to whatever was passed as the first argument). For example, <code>Promise.resolved('boogers')</code> will return a <code>Promise</code> that has already resolved to the string <code>'boogers'</code>.</dd>

<dt><code>Promise.rejected(err)</code></dt>

<dd>This function returns a native JavaScript promise that has rejected with the error <code>err</code> (i.e. whatever was passed as the first argument).</dd>
</dl>

## Controlling Parallelisation

Note that you’ll find all the examples for this section in the file `pbs81a.html` in this instalment’s ZIP file. You’ll need to open this file in a browser to see the demos in action.

When you open this file, you’ll find two columns, one with buttons for launching each demo, and one with an output area where the demos will write their output using the utility function `outputMessage()` which is defined within the file.

The file also defines a utility function named `randomPromise()` which returns a promise that always resolves, but does so in a random amount of time (between 1 and 10 seconds). The promises this function creates resolve to the number of seconds they randomly hung around before resolving.

### Promises Execute Fully in Parallel by Default

Before going any further, it’s important to remind ourselves that the only reason we’re using promises is to make our asynchronous code easier to manage; and the only reason we’re using asynchronous code is to avoid blocking IO. The whole point of asynchronous code is that it allows the browser to process multiple tasks effectively simultaneously.

By default, this is how promises behave.

We can see this behaviour in action with Demo 1 in `pbs81a.html`. The click handler for that button (shown below) starts three unrelated promises, one after the other. You’ll see all three log that they are starting. Then each will resolve or reject randomly in a random amount of seconds.

```javascript
$('#demo1_btn').click(function(){
  outputMessage('Starting Promise 1');
  randomPromise().then(function(s){
    outputMessage(`Promise 1 resolved in ${s}sec`);
  });
  outputMessage('Starting Promise 2');
  randomPromise().then(function(s){
    outputMessage(`Promise 2 resolved in ${s}sec`);
  });
  outputMessage('Starting Promise 3');
  randomPromise().then(function(s){
    outputMessage(`Promise 3 resolved in ${s}sec`);
  });
});
```

### Promise Chains are Fully Serial

Sometimes the input to one task depends on the output from another. In this situation we have no choice but to perform those tasks one after the other, i.e. in series. As we learned in [the previous instalment](https://pbs.bartificer.net/pbs80), promise chains allow us to do this.

We can see this behaviour in action with Demo 2 in `pbs81a.html`. The click handler for this button (code below) starts three chained promises where the resolution of the first triggers the start of the second, and the resolution of the second triggers the start of the third.

```javascript
$('#demo2_btn').click(function(){
  outputMessage('Starting Promise 1');
  randomPromise().then(function(s){
    outputMessage(`Promise 1 resolved in ${s}sec`);
    outputMessage('Starting Promise 2');
    return randomPromise();
  }).then(function(s){
    outputMessage(`Promise 2 resolved in ${s}sec`);
    outputMessage('Starting Promise 3');
    return randomPromise();
  }).then(function(s){
    outputMessage(`Promise 3 resolved in ${s}sec`);
  });
);
```

### Mixing Series & Parallel

So, we can deal with tasks that can be run completely in parallel, and with tasks that can be run completely in series. What we can’t do yet is deal with situations where we can do some tasks in parallel, but then we need to wait for all of those to finish before starting another task.

In the abstract this may not sound all that useful, but it’s actually a very common problem. A great real world example is UI rendering based on templates. To use a templating engine like Mustache without embedding all the templates and data directly into the HTML file, we need to make many AJAX calls to fetch the template strings and the data to be displayed. Only when all those queries have completed, should we render our UI using the templates and the data. There’s no reason the AJAX calls to fetch all the needed components shouldn’t run in parallel. In fact we want them to, but we need the final rendering of the UI to happen in series after all the parallel requests complete.

With what we know so far we can’t do that — for now the best we can do is build a promise chain that fetches each template one after the other, and then each piece of data one after the other, and then finally renders the UI at the of that very long chain. This is clearly inefficient!

This is where the `Promise.all()` function comes to the rescue!

### Using `Promise.all()`

This function takes an array of promises as the first argument, and returns a chained promise that will resolve when all the promises passed to it resolve, and reject when a single promise passed to it rejects. Assuming all the passed promises resolve, the chained promise will resolve to an array containing all the values the passed promises resolved to. The moment a single passed promise rejects, the chained promise will reject with the error that first rejecting promise rejected with. Note that the ordering of the values in the array the chained promise resolves to is determined by the ordering of the promises passed to `Promise.all()`, not by the order in which the promises resolve.

We can use this function to wait for all parallel tasks to complete before moving on to another task that depends on the values they resolve to.

In the case of our hypothetical template use-case, we would structure our code like this:

```javascript
const tpl1Promise = $.ajax({
  // …
});
const tpl2Promise = $.ajax({
  // …
});
const tpl3Promise = $.ajax({
  // …
});
const data1Promise = $.ajax({
  // …
});
const data2Promise = $.ajax({
  // …
});

const allTplAndDataPromise = Promise.all([tpl1Promise, tpl2Promise, tpl3Promise, data1Promise, data2Promise]);

allTplAndDataPromise.then(
  function(){
    // render UI
  },
  function(){
    // render Error
  }
);
```

Rather than create all those variables, we can do this as a single anonymous promise chain like so:

```javascript
Promise.all([
  $.ajax({
    // template 1 AJAX request
  }),
  $.ajax({
    // template 2 AJAX request
  }),
  $.ajax({
    // template 3 AJAX request
  }),
  $.ajax({
    // data 1 AJAX request
  }),
  $.ajax({
    // data 2 AJAX request
  }),
]).then(
  function(){
    // render UI
  },
  function(){
    // render Error
  }
);
```

Demo 3 in `pbs81a.html` shows `Promise.all()` in action. The callback for the demo 3 button (code below) creates three promises which run in parallel, then passes all three of them to `Promise.all()` to create a fourth promise which won’t resolve until all three of the original promises have resolved.

```javascript
$('#demo3_btn').click(function(){
  outputMessage('Starting Promise 1');
  const p1 = randomPromise().then(function(s){
    outputMessage(`Promise 1 resolved in ${s}sec`);
    return s;
  });
  outputMessage('Starting Promise 2');
  const p2 = randomPromise().then(function(s){
    outputMessage(`Promise 2 resolved in ${s}sec`);
    return s;
  });
  outputMessage('Starting Promise 3');
  const p3 = randomPromise().then(function(s){
    outputMessage(`Promise 3 resolved in ${s}sec`);
    return s;
  });
  outputMessage('Starting Promise.all() with Promises 1 to 3');
  Promise.all([p1, p2, p3]).then(function(secs){
    outputMessage(`Promise.all() resolved. The 3 original promises resolved in ${secs[0]}s, ${secs[1]}s & ${secs[2]}s`);
  });
});
```

Since `Promise.all()` takes promises as arguments and returns a promise, you can pass a call to `Promise.all()` as an argument to `Promise.all()`, allowing you to construct extremely complex nested branching and merging promise chains.

While you _can_ nest calls to `Promise.all()` as deeply as you like, you probably shouldn’t get carried away — you don’t want to make your promise chains more complex than our little human brains can handle!

## A Challenge

Using either your solution to the previous challenge or mine, update the code so the templates are stored in separate files rather than embedded in the HTML. Then, use `Promise.all()` to fetch all the templates in parallel before initialising the game once all the templates have been fetched.

## Final Thoughts

At this stage in our exploration of Promises, we’ve learned how to uses promises to perform tasks in series, in parallel, and a mixture of both. We’ve learned all the core concepts JavaScript’s first release of the promises concept brought to the table. In other words, we’ve made it as far as 2015! JavaScript hasn’t stood still since then, and promises got a significant upgrade in 2017 with the addition of two new keywords to the language — `async` and `await`.

With JavaScript’s original 2015 implementation of promises, you always had to use `.then()` to make use of promises. The introduction of `async` and `await` changed all that. These two keywords provide a whole new syntax for dealing with promises. I find that the new `async`/`await` syntax often results in much more readable code, making it easier to write and easier to maintain. You can of course continue to use `.then()` when it suits, but you don’t have to if you don’t want to.

So, in the next instalment, we’ll meet two new friends — `async` and `await`.
