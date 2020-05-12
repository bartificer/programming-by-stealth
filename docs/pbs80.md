# PBS 80 of X — JavaScript Promise Chains

In the previous instalment we got our first introduction to the concept of _promises_ in JavaScript. By the end of the instalment we’d learned how to use promises to deal with single asynchronous tasks, but not how to use promises to deal with multiple interdependent asynchronous tasks. That’s what we’ll be focusing on in this instalment. In the previous instalment we looked at the arguments to `.then()`, but we ignored its return value. It’s the return value from `.then()` that this instalment revolves around. That return value is the key to dealing with interdependent asynchronous tasks by combining multiple promises into so-called _promise chains_.

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/06/pbs80.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs80.zip).

# Matching Podcast Episode 597

Listen along to this instalment on [episode 597 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/07/ccatp-602/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_06_14.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_06_14.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## A Quick Promise Refresher

Before we expand our understanding of promises, let’s just remind ourselves about what we covered in the previous instalment.

We learned that promises are objects for representing the outcome of asynchronous actions, and that they have a life-cycle that starts as _unresolved_, and then depending on whether the asynchronous action succeeds or fails, move to either _resolved_ of _rejected_.

We also learned that promises are not ephemeral — they continue to exist as long as we keep the variable(s) we stored them in around.

Finally we learned that we can use the `.then()` function to attach callbacks which will execute as soon as possible. If the promise is unresolved the callbacks will execute when the promise resolves or rejects, and if the promise is already resolved or rejected they will execute immediately. The `.then()` function can take two callbacks, one to execute if the promise resolved, and one if it rejected. The resolved callback is passed the data returned from the asynchronous action as the first argument, and the rejected callback is passed an object representing the error as the first argument.

What we did not mention at all last time was the value returned by `.then()`.

## A Note on This Instalment’s Examples

The examples below are intended to be executed from the JavaScript console on the file `PBS80a.html` from this instalment’s ZIP file. This file provides some utility variables and functions that will help keep our examples simple and easy to understand.

Firstly, there are two variables defined in the global scope that we’ll use to store our promises:

```JavaScript
var originalPromise = null;
var chainedPromise = null;
```

Secondly, the file provides some pre-written functions for use as callbacks to `.then()`:

```JavaScript
var RESOLVED_CB = function(val){
  console.log(`Yay! 🙂 The promise resolved to the value:\n${val}`);
};
var REJECTED_CB = function(val){
  console.log(`🙁 The promise rejected with:\n${val}`);
}
```

Thirdly, the file provides a function named `promisedConfirm()`. This function imitates the standard `window.confirm()` function but uses a nice Bootstrap Modal, and immediately returns a promise rather than waiting for the user to respond like `window.confirm()` does. _Note that this is a utility function defined within the file, not a standard JavaScript, jQuery, or Bootstrap function._

The function accepts up to three arguments:

1.  The text for the confirm dialogue as a string.
2.  The value the returned promise should resolve to when the user clicks the _OK_ button (defaults to `true`).
3.  The value the returned promise should reject with when the user clicks the _Cancel_ button (defaults to `false`).

You can see the function in action (with default values for all arguments) by entering the following in the console on `PBS80a.html`:

```JavaScript
promisedConfirm().then(RESOLVED_CB, REJECTED_CB)
```

Or, with each of the three possible arguments passed:

```JavaScript
promisedConfirm('Will you have a slice of cake?', 'Yes please!', 'No').then(RESOLVED_CB, REJECTED_CB)
```

## The Value Returned by `.then()` (and `.catch()`)

Before we get stuck in, just a quick reminder that `.catch()` is just an alias for `.then()` with a second argument but no first argument. This means that the return value for `.catch()` is the same as that for `.then()`.

**A promise’s `.then()` function always returns a new promise**! The callbacks passed to `.then()` determine the fate of this new promise — i.e. whether it will resolve or reject.

The fact that calling .then() on a promise creates a new promise means there will be two promises at play for much of our discussions. This could easily get very confusing, so let’s try nip that in a bud! **I’ll always refer to the promise that `.then()` was called on as _the original promise_, and the new promise created and returned by `.then()` as _the chained promise_. I’ll also always refer to the first argument to `.then()` as _the resolved callback_, and the second as _the rejected callback_**.

For extra clarity, let’s illustrate this naming convention with a code snippet:

```JavaScript
const chainedPromise = originalPromise.then(resolvedCallback, rejectedCallback);
```

At this point I want to stress that exactly one of the two callbacks passed to `.then()` will get executed because a promise always resolves or rejects — it can never do both!

Whether and when the chained promise resolves or rejects will be determined by the behaviour of whichever of the two callbacks gets executed. The chained promise’s behaviour is determined in exactly the same way regardless of which of the two callbacks gets executed. **If the executed callback returns a value, then the chained promise will resolve to that value. If the executed callback throws an error, the chained promise will reject with that error.**

The importance of the previous paragraph can’t be over-stated — it’s absolutely central to understanding this entire instalment, and indeed, promise interdependencies in general.

### Basic Promise Chain Example

Let’s illustrate this behaviour with some examples.

Start by creating a promise that’s controlled by a confirmation dialogue. Enter the command in the console, but don’t click either of the buttons in the dialogue just yet!

```JavaScript
originalPromise = promisedConfirm();
```

Next, we’ll create a chained promise using `.then()` in which we’ll change the data returned and the error thrown:

```JavaScript
chainedPromise = originalPromise.then(
  function(originalData){ // resolved callback
    console.log(`The original promise resolved with: ${originalData}`);
    return 'I am new data!';
  },
  function(originalError){ // rejected callback
    console.log(`The original promise rejected with: ${originalError}`);
    throw new Error('A new error!');
  }
);
```

Finally, we can add callbacks to the chained promise so we can see its state when it finally resolves:

```JavaScript
chainedPromise.then(
  function(chainedData){ // resolved callback
    console.log(`The chained promise resolved with: ${chainedData}`);
  },
  function(chainedError){ // rejected callback
    console.log(`The chained promise rejected with: ${chainedError}`);
  }
)
```

We now have an original promise that remains unresolved because we have not clicked either button on the dialogue yet. We also have a chained promise that is also unresolved because its fate will be determined by the callbacks added to the original callback with `.then()`. When we now press the _OK_ button the original promise will resolve, and the resolved callback will execute. This callback logs the data it received and returns a value (the string `'I am new data!'`), and does not throw an error, so the chained promise will then resolve to the returned value. Finally, when the chained promise resolves, its resolved callback will execute, logging the second message to the console.

So, when you click OK two messages should get logged to the console:

```
The original promise resolved with: true
The chained promise resolved with: I am new data!

```

What we did here is build up a _promise chain_ — the resolution of one promise triggered the resolution on another. We built out chain in steps using separate variables, but that’s not how it would normally be done. We can build our entire chain at once like so:

```JavaScript
promisedConfirm().then(
  function(d){
    console.log('original promise resolved with: ', d);
    return 'New data!';
  },
  function(e){
    console.log('original promise rejected with: ', e);
    throw new Error('New Error!');
  }
).then(
  function(d){
    console.log('chained promise resolved with: ', d);
  },
  function(e){
    console.log('chained promise rejected with: ', e);
  }
);
```

Again, none of the callbacks will execute until you resolve or reject the promise by clicking the _OK_ or _Cancel_ buttons. Run the command twice, clicking _OK_ the first time and _Cancel_ the second.

In this case we turned a successful promise for one piece of data into a successful promise for another, but there’s no need for success to be converted to success, or an error to an error.

### Turning Rejection into Resolution

Within a promise chain you can convert a rejection into resolution by having your rejected callback return a value rather than throwing an error. Let’s ensure our chain always ends in a promise that resolves, no matter which button we click:

```JavaScript
promisedConfirm().then(
  function(d){
    console.log('original promise resolved with: ', d);
    return d; // pass the original value through
  },
  function(e){
    console.log('original promise rejected with: ', e);
    return true; // return a new value
  }
).then(
  function(d){
    console.log('chained promise resolved with: ', d);
  },
  function(e){
    console.log('chained promise rejected with: ', e);
  }
);
```

If you click _OK_ the original promise will resolve and its resolved callback will log that fact, and then return the value it was passed to the chained promise. The chained promise will then resolve to that same value.

If you click _Cancel_ the original will reject and its rejected callback will log that fact, and then return `true` to the chained promise. Because this callback returned a value rather than throwing an error, the chained promise will resolve, not reject!

Try it — if you click _OK_ you’ll see the following two messages logged:

```
original promise resolved with: true
chained promise resolved with: true

```

If you click _Cancel_ you’ll see the following two messages logged:

```
original promise rejected with: false
chained promise resolved with: true

```

## Passthrough by Default

At each point in a promise chain, there could be a callback defining what to do if the original promise resolved, and what to do if it rejected. Both callbacks are optional, so what happens if you omit one? What will the chained promise resolve to or reject with?

There are two scenarios at play here — the original promise rejected and the call to `.then()` only passed one argument, so there is no callback specified to handle rejection. Or, the original promise resolved, and the call was to `.catch()` rather than to `.then()`, so there is no callback specified to handle resolution.

In both cases `.then()` and `.catch()` do the sensible thing — they simply pass the value or the error through un-altered. So, in the first scenario, the chained promise resolves to the same value the original resolved to, and in the second scenario, the chained promise rejects with the same error the original rejected with.

In other words, **if you don’t specify a handler, the data or error gets passed through un-altered**.

## Avoid Unhandled Rejections!

We now know rejections that are not explicitly dealt with by a callback will continue to ripple down promise chains all the way to the end. What happens when we get to the end of the chain and we still haven’t provided a callback for dealing with the rejection (either by passing a second argument to `.then()` or a single argument to `.catch()`)?

The answer is that JavaScript gets cranky! The exact level of crankiness will be determined by the context in which you’re using JavaScript (web browser, command-line, server-side, in-app etc.), but in all cases it’s considered a no-no, you need to handle your rejections!

If you want to respond differently to rejections at different points of the chain you should pass a second argument to `.then()` at that point in the chain. I.e., you should do something like:

```JavaScript
aPromise.then(
  function(){
    // resolved action 1
  },
  function(){
    // rejection action 1
  }
).then(
  function(){
    // resolved action 2
  },
  function(){
    // rejection action 2
  }
).then(
  function(){
    // resolved action 3
  },
  function(){
    // rejection action 3
  }
);
```

In situations where you want to do the same thing no matter what when wrong, regardless of where in the chain the rejection occurred, you should add a final `.catch()` to the end of the chain and use that to deal with the rejection. I.e., you should do something like:

```JavaScript
aPromise.then(
  function(){
    // resolved action 1
  }
).then(
  function(){
    // resolved action 2
  }
).then(
  function(){
    // resolved action 3
  }
).catch(
  function(){
    // single reject action
  }
);
```

## Promises of Promises

Remember that `.then()` (and `.catch()`) return promises to any data returned within the callbacks they are passed. What if your callbacks return a promise? Won’t you end up with a promise of a promise? At a fundamental level that is indeed what will happen, but JavaScript’s promise implementation is smart enough to deal with that situation in a sensible way.

There are now three promises in the mix, so let’s describe the scenario in more detail. We have an original promise, and we call `.then()` on that original promise to create a chained promise. In either the resolved or rejected callbacks passed to `.then()` we create a new promise and return it. We’ll refer to this newly created promise as _the returned promise_. The chained promise is not a promise to the returned promise, so, a promise to a promise. How does the chained promise behave?

The chained promise will not resolve or reject until the returned promise does. When the returned promise does reject or resolve, that rejection or resolution will be immediately passed through to the chained promise, resolving/rejecting it with the same value/error as the returned promise did.

**From our view as a programmer, when a resolved or rejected callback returns a promise, the chained promise effectively becomes that returned promise.**

## Key Points

*   The resolution or rejection of each promise in the chain triggers the execution of the next set of callbacks, and that in turn triggers the resolution or rejection of the next promise …
*   Whether the next promise in the chain resolves or rejects (and what values/errors are passed down the chain) is determined by the callback(s) passed to `.then()` or `.catch()`. If the executed callback returns a value, the next promise in the chain resolves to that value, if the executed callback throws an error that next promise in the chain rejects with that error.
*   The value being passed down the chain can be altered by each link in the chain.
*   Rejections can be converted to resolutions at any point in the chain (and _vice-versa_).
*   Un-handled resolutions and rejections propagate to the next link in the chain un-altered.
*   You can return promises from within your callbacks, and those promises effectively become the next promise in the chain.
*   You should always handle promise rejections.

## Practical Example — A Promise Chain for Serial AJAX Calls

Before we get build our promise chain, let’s define a problem to solve, and, the resources available to us to solve that problem.

What we want to do is get a local weather forecast. That’s a two-part process. We need to use a geolocation service to convert the user’s IP address into a city, and then a weather service to get the weather for that city. We can’t get the weather until we know the city, so we have a serial dependency between two AJAX requests.

### A Free-to-Use HTTP Geolocation API

There are lots of APIs out there for geolocation, but most require that you register to get an API key, and many also require that you sign up for a paid subscription! With a little persistence I was able to find a free-to-use HTTP-based geolocation service that doesn’t require registration, at least for non-commercial use — [http://ip-api.com/](http://ip-api.com).

We can use this API to get geolocation data for the user’s current IP address in JSON format by submitting an HTTP GET request to the URL `http://ip-api.com/json/`. (We can get the same data for a specific URL by adding it after the trailing slash, e.g. `http://ip-api.com/json/37.139.7.12` to get details on the server that hosts this website.)

Passing the result of an AJAX request for the URL `http://ip-api.com/json/` to JSON.parse() should produce an object something like:

```JavaScript
{
  "as": "AS14061 DigitalOcean, LLC",
  "city": "Amsterdam",
  "country": "Netherlands",
  "countryCode": "NL",
  "isp": "DigitalOcean, LLC",
  "lat": 52.2977,
  "lon": 4.9562,
  "org": "Digital Ocean",
  "query": "37.139.7.12",
  "region": "NH",
  "regionName": "North Holland",
  "status": "success",
  "timezone": "Europe/Amsterdam",
  "zip": "1105"
}
```

From our point of view we are interested in two of these key-value pairs. Firstly, we should check that `status` has the value `success`, and secondly, the value we really want is available via the key `city`.

### A Free-to-Use HTTP Weather API

Similarly, there are many weather APIs out there that require registration and possibly payment, but we want one that requires no registration, no API key, and no payment. I didn’t have to go looking for this one — I’ve known about the wonderful [wttr.in](https://github.com/chubin/wttr.in) for many years now.

We can get a one-line summary of the weather (complete with emoji) for any city by making an HTTP GET request to a URL of the form `http://wttr.in/City?format=3` (replacing `City` with the city of your choice), e.g. you can get the weather in Maynooth from `http://wttr.in/Maynooth?format=3`.

This web service does not return JSON, but a simple UTF-8 string, that looks something like this:

```
Maynooth: 🌦 +11°C

```

By default the API will use Celsius for all locals other than `en-US`, but if your browser isn’t configured to use US English and you absolutely must know how cold it is in June in Ireland in Fahrenheit you can add an HTTP request parameter with the name `u` (for _USA_) and no value, i.e. `http://wttr.in/Maynooth?format=3&u`:

```
Maynooth: 🌦 +52°F

```

While this wonderful free API works great directly in a browser, via a command-line HTTP client like curl, or even via an HTTP API from within an app, it does not work via AJAX because the server does not set the appropriate HTTP headers to permit cross-origin AJAX calls.

To work around this limitation I’ve written a very simple PHP proxy script which can be used to access the API from the same origin as `pbs80a.html`. This script is named `wttr.in.proxy.php`, and it accepts two query parameters — city to pass the city you would like the weather for, and units to specify the desired temperature units. To get Fahrenheit use `units=f`. In all other situations the proxy script defaults to Celsius.

**For this proxy script to work you’ll need to access `php80a.html` via a web server that supports PHP, like MAMP.**

> ### Aside
>
> In case you’re curious and you’d like to see another language in action, this is the code for the proxy script:
>
> ```PHP
> <?php
> # Set the MIME-Type to text/plain
> header('Content-Type: text/plain');
>
> # build the URL
> $url = 'http://wttr.in/'.urlencode($_REQUEST['city']).'?format=3';
> $url .= $_REQUEST['units'] == 'f' ? '&u' : '&c';
>
> # fetch and output the URL
> echo file_get_contents($url);
> ```
>
> Apart from the fact that comments start with # instead of //, that strings are concatenated with . instead of +, and that variable names all start with a \$, the code actually looks very similar to JavaScript. That’s because both PHP and JavaScript are very heavily inspired by the venerable [C programming language](<https://en.wikipedia.org/wiki/C_(programming_language)>).

### Some Helper Variables & Utility Functions

Like the other examples earlier in this instalment, this example is intended to be run from the JavaScript console on the file `pbs80a.html`. Because of the need for the PHP file to access the weather API, you’ll need to run this file through a local web server (like MAMP) for this example to work.

To help make the example easier to read, it makes use of the following variables defined in the global scope:

```JavaScript
// variables for use in the practical example
var DEFAULT_CITY = 'Brussels';
var GEOLOCATION_URL = 'http://ip-api.com/json/';
var WEATHER_URL = './wttr.in.proxy.php';
var cityPromise = null;
var weatherPromise = null;
```

It also makes use of a utility function `outputMessage(message, theme)` which renders a message to the output area of the page as a dismissible alert in one of four styles — `text` for plain text, `console` for fixed-width text, `warning` for a warning message, and `error` for an error message.

You can see what this function does by entering the following four examples into the console:

```
outputMessage('Just so you know, I ❤️ 🍰', 'text');
outputMessage("curl 'http://wttr.in/Dublin'", 'console');
outputMessage('The practical example only works via web server!', 'warning');
outputMessage('Something went wrong 🙁', 'error');

```

### Building Our Promise Chain

Before we begin — I’m going to build this chain step-by-step, storing the key promises in named variables. This is not necessary — a promise chain can be built up in one massive step. I’ll demonstrate this at the end of the example.

Let’s start with the first link in our chain — we need a promise for the user’s city:

```JavaScript
cityPromise = $.ajax({
  url: GEOLOCATION_URL,
  method: 'GET',
  dataType: 'json'
}).then(
  function(data){ // resolved callback
    console.log('received the following data from the geolocation API: ', data);

    // make sure we got a successful response, otherwise, use the default city
    if(data.status !== 'success'){
      console.log(`failed to geolocate, defaulting to '${DEFAULT_CITY}'`);
      return DEFAULT_CITY;
    }

    // use the received city
    console.log(`successfully geolocated to '${data.city}'`);
    return data.city;
  },
  function(err){ // rejected callback
    console.log(`failed to geolocate with error (appended), defaulting to '${DEFAULT_CITY}'`, err);
    return DEFAULT_CITY; // converting failure into success!
  }
);
```

Notice that even now we’ve already created a small promise chain. The variable `cityPromise` doesn’t contain the promise returned by `$.ajax()`, instead it holds a chained promise created by calling `.then()` on the promise returned by `$.ajax()`.

Also notice that we have used the callbacks to transform the value the chained promise resolves to. The original promise resolved to a big object with many keys, but the chained promise resolves to just a city.

Finally, notice that we have used the rejection callback to convert a rejection of the original promise to a resolution of the chained promise. When the original promise rejects, the chained promise resolves to the default city.

The next step in our chain is to make a new AJAX call to the weather API:

```JavaScript
weatherPromise = cityPromise.then(
  function(city){ // resolved callback
    return $.ajax({
      url: WEATHER_URL,
      method: 'get',
      dataType: 'text',
      data: {
        city: city,
        units: 'c' // change if you prefer 🙂
      }
    }).then(
      function(data){ // resolved callback
        console.log(`successfully fetched the following weather: ${data}`);
        return data; // propagate the weather data down the chain
      },
      function(err){ // rejected callback
        console.log(`failed to get the weather for the city '${city}' with error: `, err);
        throw err; // propagate the rejection down the chain
      }
    );
  }
  // no rejected callback since we've ensured cityPromise always resolves
);
```

Notice that we are calling `.then()` on the city promise, so the data passed to the resolved callback will be the city geolocated to previously. For this reason I chose to name the first argument to the resolved callback `city`.

Because of how we constructed `cityPromise`, we know that promise will always resolve, so there is no need to pass a second argument (a rejected callback) to `.then()`.

Finally, notice the resolved callback returns the result of `$.ajax()`, i.e., it returns a promise. This means we have a promise to a promise, but as we learned a few minutes ago, that’s not a problem.

At this stage we have a promise for the weather, so we should out-put it to the user. We can use the utility function `outputMessage()`:

```JavaScript
weatherPromise.then(
  function(weather){ // resolved callback
    outputMessage(weather, 'console');
  },
  function(){ // rejected callback
    outputMessage('Failed to retrieve your weather 🙁', 'error');
  }
);
```

As mentioned previously, in the real world you would probably create this entire promise chain in one go and not store individual promises within the chain in named variables.

We can see this same functionality as a single anonymous promise chain in the click handler for the _Get My Weather_ button:

```JavaScript
// add a click handler to the weather button
$('#weather_btn').click(function(){
  $.ajax({
    url: GEOLOCATION_URL,
    method: 'GET',
    dataType: 'json'
  }).then(
    function(data){ // resolved callback
      // make sure we got a successful response, otherwise, use the default city
      if(data.status !== 'success'){
        console.log(`failed to geolocate, defaulting to '${DEFAULT_CITY}'`);
        return DEFAULT_CITY;
      }

      // use the received city
      return data.city;
    },
    function(err){ // rejected callback
      outputMessage(`failed to geolocate, defaulting to '${DEFAULT_CITY}'`, 'warning');
      return DEFAULT_CITY; // converting failure into success!
    }
  ).then(
    function(city){ // resolved callback
      return $.ajax({
        url: WEATHER_URL,
        method: 'get',
        dataType: 'text',
        data: {
          city: city,
          units: 'c' // change if you prefer 🙂
        }
      });
    }
  ).then(
    function(weather){ // resolved callback
      outputMessage(weather, 'console');
    },
    function(){ // rejected callback
      outputMessage('Failed to retrieve your weather 🙁', 'error');
    }
  );
});
```

## Promise Chains -v- Callbacks

So, how do promise chains compare to the traditional callback approach that results in _callback hell_? The fundamental difference is that with traditional callbacks each new asynchronous task to be performed in series results in a deeper level of nesting. By the time you are dealing with the 4th task you’re in a success callback within a success callback within a success callback within a success callback! Promise chains are not nested, so whether you’re on the 4th or the 40th serial asynchronous task, you are in a top-level resolved callback.

Error handling is also much easier with promise chains. With nested traditional callbacks you have to deal with each error separately. With promise chains you can deal with any individual error you want, but you don’t have to, you can let them all propagate to the end of the chain and deal with all problems in the final `.then()` (or `.catch()`) at the end of the chain.

As a illustration of these two points, this is the bare minimum structure for four serial asynchronous tasks using traditional callbacks:

```JavaScript
asyncTask1(
  // …
  function(){ // task 1 success callback
    asyncTask2(
      // …
      function(){ // task 2 success callback
        asyncTask3(
          // …
          function(){ // task 3 success callback
            asyncTask4(
              // …
              function(){ // task 4 success callback
                // …
              },
              function(){ // task 4 error callback
                // …
              }
            );
          },
          function(){ // task 3 error callback
            // …
          }
        );
      },
      function(){ // task 2 error callback
        // …
      }
    );
  },
  function(){ // task 1 error callback
    // …
  }
);
```

Notice that as well as being deeply nested, the callbacks are out of order — the error callback for the first task is all the way at the very bottom of the snippet!

Contrast that with the same minimal structure for a promise chain:

```JavaScript
asyncPromiser1().then(
  function(){ // task 1 resolved callback
    // …
    return asyncPromiser2();
  }
).then(
  function(){ // task 2 resolved callback
    // …
    return asyncPromiser3();
  }
).then(
  function(){ // task 3 resolved callback
    // …
    return asyncPromiser4();
  }
).then(
  function(){ // task 4 resolved callback
    // …
  },
  function(){ // any task rejected callback
    // …
  }
);
```

Notice there is no ever-increasing nesting here. We could continue this sequence indefinitely without ending up with more indentation that we can see on the screen! Also, if we wanted to add a rejected handler for any task in the chain, it would remain in sequence, right after its matching resolved handler.

You may or may not like this syntax, but it sure seems a lot less hellish to me!

## A Challenge

Update a version of the number guessing game described in challenge set in instalment 79 as described below. You can use your own solution to that challenge, or my sample solution as included in the ZIP file for instalment 80.

Firstly, update the code that fetches the random number via AJAX to use a promise.

Secondly, if the version of the game you are using as your starting point does not already do so, edit it so it uses at least two Mustache templates. This is to prepare your code for the challenge we’ll set in the next instalment.

## Final Thoughts

At this point in our exploration of JavaScript promises we’ve described what an individual promise is, the life-cycle it will go through, and how we can attach callbacks to process its output (be that data or an error). In this instalment we’ve taken that understanding a little further and looked how promises can be chained together to ensure inter-related asynchronous operations happen in the desired order. We used a promise chain to geolocate an IP address into a city, and then to get the weather for that city. Obviously we can’t get the weather until we know the city, so there is an interdependence there, and promise chains allowed us to express that in a simple and straightforward-forward way, with the output of each link in the chain acting as the input to the next.

Simple promise chains allow us to execute asynchronous command in series, but that’s not always the most efficient way to do things. Sometime we want to do things in parallel, or, perhaps partially in parallel and partial in series. JavaScript’s native Promise class provides is with the utility functions we need to construct these kinds of complex flows. For example, we might want to fetch all our Mustache templates in parallel, and also fetch the data for our view at the same time, then, when all those parallel tasks have completed, render our templates to build our UI. That’s exactly what we’ll be able to do by the end of the next instalment.
