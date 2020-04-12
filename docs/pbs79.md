# PBS 79 of X — Introducing Javascript Promises

Finally, after much teasing, we get our first taste of JavaScript Promises! This will just be a taste though, Promises are simultaneously really simple and really counter-intuitive. In many ways teaching promises reminds me a lot if teaching recursion — there is a tipping point where the concept goes from infuriatingly mind-bending to obvious and logical. Getting to that tipping point can be quite the challenge though.

So, we’re going to take it slow with promises. They will provide us with a way out of callback hell, but that path to salvation is unlikely to be obvious to you by the end of this instalment. It will take one or two more instalments until we get that far. All I can ask is that you please trust, me, how ever bumpy the journey gets, the destination is worth the struggle!

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/05/pbs79.zip) or [here on GitHub](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentZips/pbs79.zip).

# Matching Postcast Episode 595

Listen along to this instalment on [episode 595 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/05/ccatp-595/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_05_31.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_05_31.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 78 Challenge Solution

The challenge set at the end of the previous instalment was to update either your number guessing game or my sample solution from the previous challenge to transform it into a tool to help teach the binary search algorithm.

Two things were required for this transformation — some way of showing the user what guesses have become impossible because of the guess they just made, and the addition of some text to the game over message to tell them how well they did compared to the binary search algorithm.

The approach I chose to take is to disable the buttons in my grid as they get ruled out by guesses. My first step towards this was to create two new global variables to track the lowest and highest possible valid guesses:

```JavaScript
var MIN_POSSIBLE_GUESS = MIN; // the minimum possible value based on guesses to date
var MAX_POSSIBLE_GUESS = MAX; // the maximum possible value based on guesses to date
```

These variables need to be re-set each time the game is reset, so I updated the `success` handler for the AJAX call that fetch a new random number in my `resetGame()` function:

```JavaScript
success: function(rn){
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
}
```

The next step was to update my `guessNumber()` function to update these global variables as appropriate on each guess. This the relevant part of the function:

```JavaScript
// figure out what direction we're wrong
const tooLow = num < RANDOM_NUMBER ? true : false;
				
// update the lowest/highest possible guesses
const prevMinPos = MIN_POSSIBLE_GUESS;
const prevMaxPos = MAX_POSSIBLE_GUESS;
if(tooLow){
  if(num > MIN_POSSIBLE_GUESS){
    MIN_POSSIBLE_GUESS = num + 1;
  }
}else{
  if(num < MAX_POSSIBLE_GUESS){
    MAX_POSSIBLE_GUESS = num - 1;
  }
}
```

Notice that I chose to record the previous values for the minimum and maximum possible guesses. This allowed me to optimise the disabling of buttons in the game grid (later within the same function):

```JavaScript
// disable any buttons that have become impossible
for(let n = prevMinPos; n < MIN_POSSIBLE_GUESS; n++){
  $GUESS_BUTTONS_BY_NUMBER[n].prop('disabled', true);
}
for(let n = prevMaxPos; n > MAX_POSSIBLE_GUESS; n--){
  $GUESS_BUTTONS_BY_NUMBER[n].prop('disabled', true);
}
```

Finally, just to make the code a little more robust, I added this code near the start of my `guessNumber()` function:

```JavaScript
//short-circuit guesses that are impossible
if(num < MIN_POSSIBLE_GUESS || num > MAX_POSSIBLE_GUESS){
  showGameMessage(
    `Impossible Guess, ${num} was ruled out by previous guesses`,
    ICONS.notice,
    'danger'
  );
  return;
}
```

That takes care of the first part of this challenge — players can now clearly see the implications of their guesses.

The second part is to show the user how they compared to the binary search algorithm. The first step to facilitating that was to write a function to do a binary search for the answer:

```JavaScript
function binarySearch(){
  const guesses = [];
			
  // start the range of possible guesses at the extremes of the grid
  let min = MIN;
  let max = MAX;
			
  // guess the half way point until the answer is found
  let g;
  do{
    // guess the half way point and save
    g = Math.round((min + max) / 2);
    guesses.push(g);
				
    // update min or max as appropriate
    if(g < RANDOM_NUMBER) min = g + 1;
    if(g > RANDOM_NUMBER) max = g - 1;
  }while(g != RANDOM_NUMBER);
			
  // return all the guesses
  return guesses;
}
```

The last step was to update the guessNumber() function to include the binary search information into the `game won` modal dialogue. First, I added the following to the relevant template (the `<script>` tag with the ID `gameWonTemplate`):

```XHTML
<p>For reference, the <i>binary search</i> algorithm would have guessed the number in the following <strong>{{binarySearch.guessCount.total}}</strong> guesse(s):</p>
<p>
  {{#binarySearch.guesses}}
  <kbd>{{.}}</kbd>
  {{/binarySearch.guesses}}
  <kbd class="bg-success">{{randomNumber}}</kbd>
</p>
```

Finally, I added the following line to the part of the `guessNumber()` function that executes when the player guesses correctly:

```JavaScript
const binSearchGuesses = binarySearch();
```

And then updated the view object for the template as follows:

```JavaScript
{
  guesses: GUESSES,
  guessCount: {
    incorrect: GUESSES.length,
    total: GUESSES.length + 1
  },
  randomNumber: RANDOM_NUMBER,
  binarySearch: {
    guesses: binSearchGuesses.slice(0, -1), // remove successful guess
    guessCount: {
      incorrect: binSearchGuesses.length - 1,
      total: binSearchGuesses.length
    }
  }
}
```

That’s it! You can see my full sample solution in action in the `pbs78-challengeSolution` folder in this instalment’s ZIP file.

## JavaScript Promises

I’ve been teasing JavaScript Promises as the solution to _callback hell_ for some time now, so let’s finally get stuck in!

Firstly, Promises remove the _hell_ from _callback hell_, they don’t replace callbacks!

Before we can truly understand promises, we need to remind ourselves what it is about callbacks that can make them so hellish to begin with. After all, that was literally the problem Promises were designed to solve!

For individual asynchronous tasks callbacks work just fine. When the user clicks this, do that. When the server replies with an AJAX response put the returned HTML into that `<div>` over there. No problem! Where you run into problems is when there are interdependencies between your asynchronous tasks. Imagine you have a UI to render that requires three templates and four pieces of data to be loaded via AJAX. You can easily write a callback to actually render the UI, but what event do you attach it to? You have no way of telling JavaScript to execute your callback when all of the needed AJAX requests have finished.

You may also have interdependencies over time. when you make an AJAX request you need to attach the callback at the point in time that you submit the request to the server. If, later in your code, you need to add another action, you can’t do so reliably. If you get it attached before the server replies then your code will work, but if the server is very efficient, the new event handler will be attached after the event has fired, and it will never fire again! These kinds of timing issues lead to bugs that are extremely difficult and frustrating to track down.

Between dependencies and timing issues callbacks without Promises really are hellish 🙂

### Promises and so-called _Thenables_

As of ES2017, JavaScript now has built-in Promises. You’ll see these referred to as _Native Promises_. ES2017 did not invent the promise, instead it adopted the community consensus and codified it into an official version of a broader context. Before ES2017, there were lots of 3rd-party implementations of the same idea. A particularly popular one was [Bluebird](http://bluebirdjs.com/). Even today there are very good reasons to use 3rd party implementations of the Promise idea.

To allow Promises of all kinds to co-exist in harmony, JavaScript’s Promise functionality does not insist you use native Promises, instead, you can use any type of Promise you like, as long as they provide a `.then()` function. For this reason, the term _thenable_ is often used to refer to any Promise of any kind that can interoperate with JavaScript’s Promise functionality.

### What is a Promise?

A Promise is an object that permanently represents the outcome of an asynchronous task. A promise starts off as a kind of digital IOU representing a future outcome, and then transforms into a permanent record of that outcome.

Formally, a Promise in _IOU-mode_ is _unresolved_. When the asynchronous task completes, the Promise will move into one of two permanent states — if the task completed successfully the Promise becomes _resolved_, and if it failed, the Promise becomes _rejected_.

In other words, **all Promises start as _unresolved_, and then become to either _resolved_ or _rejected_**.

You don’t read values directly from Promises, instead, you attach callbacks to them using their `.then()` function. If a promise is unresolved when you call `.then()` then the callback is queued for execution when the Promise resolves or rejects. But, if the Promise is already resolved or rejected then the callback gets executed immediately.

### The `.then()` Function

Before we begin, if you’d like to play along with the examples in this section, open the file `pbs79a.html` from this instalment’s ZIP file and bring up the JavaScript console.

To make the examples easier to read, `pbs79a.html` defines some global variables for us to use:

```JavaScript
// the JS Faker web service on www.bartbusschots.ie
var FAKERWS_BASE = 'https://www.bartbusschots.ie/utils/fakerWS/';
	
// utility variables for an AJAX call to get a randomly generated
// fake corporate record
var CORP_REC_URL = `${FAKERWS_BASE}records.php`;
var CORP_REC_DATA = {
  locale: 'en-US', // set the locale to the US
  type: 'jsonText', // set the return type to pretified JSON
  f1: 'company', // request a random company name
  f2: 'catchPhrase', // request a random company catch phrase
  f3: 'address', // request a random postal address
  f4: 'tollFreePhoneNumber' // request a random toll-free number
};
```

We’ll be using these variables to make AJAX requests to a web service running on www.bartbusschots.ie that generates fake/random data. In this case we’ll be asking for a randomly generated record containing four fields — a company name, a corporate catch phrase, a postal address, and a telephone number. The web service’s `locale` and `type` options are used to specify that we want the address and phone number to be in US format, and that we want the returned data as a multi-line human-readable JSON string.

jQuery’s `$.ajax()` function will convert these variables into the following URL:

```undefined
https://www.bartbusschots.ie/utils/fakerWS/records.php?locale=en-US&type=jsonText&f1=company&f2=catchPhrase&f3=address&f4=tollFreePhoneNumber
```

Before we go any further I want to explicitly separate two very different but potentially confusing concepts:

1.  The data returned by the web server in response to the AJAX request
2.  The return value of the `$.ajax()` function

Until now we have been making our AJAX requests in the following way:

```JavaScript
$.ajax({
  url: CORP_REC_URL,
  method: 'GET',
  cache: false,
  dataType: 'text',
  data: CORP_REC_DATA,
  success: function(data){
    console.log(`The web server replied with the following data:\n${data}`);
  }
});
```

Note that **the data returned by the web server** in response to the AJAX request is passed to the `success` callback as the first argument (which we have chosen to name `data` in this example).

More importantly, note that **we are ignoring the value returned by the `$.ajax()` function**. We are not assigning any variable equal to the returned value, and we are not using the returned value as an argument to another function call. We are totally ignoring it. We are treating `$.ajax()` as if it returns nothing.

We’ll now transform the above example to an equivalent example that uses promises.

The first and most important thing to note is that the $.ajax() function does return a value, specifically, it returns a [`jqXHR` object](http://api.jquery.com/jQuery.ajax/#jqXHR).

As we discussed in the previous episode, `jqXHR` objects are jQuery’s way of representing an AJAX request and response. These objects try to be everything to everyone, they are a super-set of an impressive array of things. Last time we learned that jqXHR objects offer all the same properties and functions as the underling core JavaScript XHR objects that are actually used by browsers to make AJAX requests.

This time the important thing to know is that **`jqXHR` objects are also _thenables_, so we can use them as JavaScript promises**.

As mentioned before, what makes a promise a promise is the fact that it provides a `.then()` function (hence the name _thenable_).

So, the first important takeaway is that `$.ajax()` returns a promise. We can save that promise into a variable:

```JavaScript
let corpPromise = $.ajax({
  url: CORP_REC_URL,
  method: 'GET',
  cache: false,
  dataType: 'text',
  data: CORP_REC_DATA
});
```

Note that this time, there is no `success` callback (nor are there `error` or `complete` callbacks either).

Much more importantly, note that this time, we have not ignored the value returned by the `$.ajax()` function, we have saved it into the variable `corpPromise`.

The promise we have stored in corpPromise now represents the anticipated result of the AJAX request. At the instance the promise was created, it was effectively an IOU for the data, i.e. it was an unresolved promise. At some later time the web server responded to the AJAX request and the promise either resolved to the value returned by the web server or rejected.

Remember that AJAX queries are asynchronous, so we can’t know when the promise will resolve or reject.

So, how do we get at the value returned by the server? Or, how do we deal with an AJAX error?

The answer to both questions is the same — we use `.then()` to tell the promise what we’d like to do with the data or the error.

**The `.then()` function takes two arguments, a callback to execute when the promise has successfully resolved, and a callback to execute when the promise has rejected.** Both arguments are optional, and you can use null as a placeholder if you only want to specify what to do in the case of a rejected promise.

At the point in time we call the `.then()` function exactly one of the following will be true, and the function will act accordingly:

Case 1 — The Promise is Unresolved

In this case, nothing will happen immediately, instead, the callbacks will be queued until the promise either resolves or rejects.

Case 2 — The Promise has either Resolved or Rejected

The appropriate callback will be executed immediately.

**Regardless of when it’s executed, the first argument to the resolved callback will be the value the promise resolved to**. In the case of an AJAX request that will be the value returned by the web sever.

Again, regardless of when it’s executed, **the first argument to the rejected callback will be an object representing the error**. Usually that’s an Error object, but jQuery is a little bit unusual sometimes, so rather than passing an Error object, the promise returned by the `$.ajax()` function passes a `jqXHR` object to the rejected callback.

Let’s get back to our promise — we can now use .then() to specify what we should do with the data returned by the web server, and what we should do if there’s a problem fetching the data:

```JavaScript
corpPromise.then(
  function(data){ // the resolved callback
    console.log(`Yay! 🙂 The promise resolved to the value:\n${data}`);
  },
  function(){ // the rejected callback
    console.log(`🙁 The promise rejected`);
  }
);
```

To make our code more readable, `pbs79a.html` defines two functions we can use as our callbacks:

```JavaScript
var RESOLVED_CB = function(val){
  console.log(`Yay! 🙂 The promise resolved to the value:\n${val}`);
};
var REJECTED_CB = function(){
  console.log(`🙁 The promise rejected`);
}
```

To demonstrate the use of these utility functions, and to demonstrate that promises act as permanent records of the data they resolved to, let’s call `.then()` on our same promise again:

```JavaScript
corpPromise.then(RESOLVED_CB, REJECTED_CB);
```

In order to demonstrate the rejected callback, let’s intentionally make an AJAX request that will fail!

```JavaScript
let failedPromise = $.ajax({
  url: CORP_REC_URL + 'boogers', // a nonsense URL!
  method: 'GET',
  cache: false,
  dataType: 'text',
  data: CORP_REC_DATA
});
```

We can now see the rejected callback in action by calling `.then()` on our failed promise:

```JavaScript
failedPromise.then(RESOLVED_CB, REJECTED_CB);
```

If we only care about rejection, and not success we can use `null` as the resolved callback:

```JavaScript
corpPromise.then(null, REJECTED_CB);
failedPromise.then(null, REJECTED_CB);
```

Because this looks a bit odd, JavaScript Promises also provide a `.catch()` function which takes a single argument, a callback to execute on rejected promises, so the following two lines do exactly the same thing:

```JavaScript
failedPromise.then(null, REJECTED_CB);
failedPromise.catch(REJECTED_CB);
```

Finally for this instalment, while you can assign a promise to a variable and store it for later use, you don’t have to. If you know you only want to use a promise once you can create it and call its `.then()` all in one go like so:

```JavaScript
$.ajax({
  url: CORP_REC_URL,
  method: 'GET',
  cache: false,
  dataType: 'text',
  data: CORP_REC_DATA
}).then( // call .then() on the promise returned by $.ajax()
  function(d){ // the resolved callback
    console.log('The promise that was never saved resolved and triggered this callback!');
  } // note no rejected callback (they're optional)
);
```

## Final Thoughts

We’ve now had our first glimpse of promises. We know how to use `.then()` to respond to the resolution of a promise, and, to deal with its rejection. Up to this point there’s not much of an obvious advantage over basic callbacks. Sure, we’ve seen that a promise lives indefinitely, and that you can use .then() to access the value it resolved to as often as you like, that’s not much different to storing the value in a variable and then accessing that variable later. What we’ve not seen so far is any mechanism for creating relationships between asynchronous actions.

The key to creating relationships between promises is the value returned by `.then()` (and `.catch()`). Just like we were ignoring the value returned by `$.ajax()` before this instalment, we’re now ignoring the value returned by `.then()`. That return value is the key to unlocking the power of promises, so that’s where we’ll pick up our journey next time.