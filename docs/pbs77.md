# PBS 77 of X — More Callbacks & More AJAX

My plans for this instalment were to quickly demonstrate so-called _callback hell_, and then move on to the solution, JavaScript Promises, but in light of some listener feedback I changed my plans a little. There was some confusion in the community about what callbacks really are, so, now seemed like an opportune moment to spend a little time re-familiarising ourselves with some callback basics. This sets things up for a bit of a teaser-ending because we’ll get as far as demonstrating callback hell, but not as far as using Promises to get back out of hell, that will have to wait until the following instalment!

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/05/pbs77.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs77.zip).

# Matching Podcast Episode 592

Listen along to this instalment on [episode 592 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/05/ccatp-592/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_05_04.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_05_04.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Callbacks Re-visited

So-called _callbacks_ have been an important concept at a few stages of this series, but we’ve not focused on them for a while. They are now freshly important, and its become clear that some listeners are struggling a little with the concept. Before we get stuck into this instalment, let’s take a fresh look at what exactly callbacks are, and how exactly they work.

I’ve included the code snippets below in the file `pbs77a.html` in this instalment’s ZIP file, and the examples should be executed from the JavaScript console on this page. This page includes the function `showToast()`from the sample solution to the challenge set in instalment 73.

The sample file declares a very simplistic function named `saySomething()`:

```JavaScript
function saySomething(something){
  showToast('Saying …', something);
}
```

You can see this function in action by executing the following in the JavaScript console:

```JavaScript
saySomething('boogers')
```

What can we say about `saySomething()`? We can say it is a function, and that it’s a function that expects one argument. We can tell by reading the function that it will take that one argument and use it as the text for a toast-style popup.

Now let’s look at another function definition:

```JavaScript
function doSomethingRandom(someFn){
  // generate a random number
  const randNum = Math.ceil(Math.random()*100);

  // call the passed function with the random number
  someFn(randNum);
}
```

What does this function do?

For starters, it names the first argument passed to it `someFn`. The first thing the function does is generate a random integer between 1 and 100 (inclusive) and stores that number in a local variable named `randNum`. Then, it treats `someFn` as a function and calls it with the random number as the first and only argument.

To see this function in action, let’s call it form the JavaScript console with the previously defined function as the only argument:

```JavaScript
doSomethingRandom(saySomething)
```

Note that we are passing the name of the function as the argument, not the result of executing it. How can we tell? It is just a bare name, there are no parentheses with zero or more arguments after it. `saySomething` is a variable that is a function, `saySomething('boogers')` executes that function with one argument.

We can pass any function that does something sensible with a single argument to the `doSomethingRandom()` function. Again, try executing the following on the console:

```JavaScript
doSomethingRandom(window.alert)
```

So far we have see three functions: `saySomething()`, `doSomethingRandom()`, and `window.alert()`. The first two are defined within `pbs77a.html`, and the last is a standard JavaScript function.

The function `doSomethingRandom()` expects a function as its first argument. How do we know that? In this case, because we read the code, and we see it executing the first argument as a function. When using some one else’s code, for example, when using a third-party API like jQuery, we won’t be looking at the code, so how can we know what the first argument should be? The only solution is to read the documentation. You simply cannot know without either reading the function’s code, or, the function’s documentation.

Because the idea of accepting a function as an argument and then executing it is a very common design pattern, developers have come up with a descriptive piece of jargon for describing this situation — _callback_.

When you pass a function as an argument to another function, the function that is being passed is referred to as a _callback_. There is nothing about the function itself that makes it a callback. No function is or is not a callback. Instead, **any function can be used as a callback**.

We can say that `doSomethingRandom()` expects a callback as the first argument.

Given the line `doSomethingRandom(saySomething)` we can say that the function `saySomething()` is being used as a callback by the function `doSomethingRandom()`.

Similarly, given the line `doSomethingRandom(window.alert)`, we can say that `window.alert` is being used as a callback.

So far we have been using named functions as callbacks. In reality, the function being passed is only needed once, so declaring it with a name and then passing that name would be a waste of time, and make our code less efficient and more difficult to maintain. For this reason, anonymous functions are often used as callbacks.

Consider the following example:

```JavaScript
doSomethingRandom(function(rn){
  saySomething(`${rn - 1}, ${rn}, ${rn + 1}`);
});
```

In this case we are using an anonymous function as the callback being passed to `doSomethingRandom()`. That anonymous function names its first argument `rn`, then puts up a toast consisting of the number before the random number, the random number, and the number after the random number.

These are obviously very contrived examples, so how are callbacks commonly used in the real world? There are myriad possibilities, but two very common uses stand out above the rest — making code more generic so as to avoid code duplication, and event handling.

### Using Callbacks to Make Code More Generic

Consider the following array of people objects:

```JavaScript
const peopleObjects = [
  {
    firstName: 'Bart',
    surname: 'Busschots',
    displayName: 'Bart',
    email: 'podcasting@bartificer.net',
    url: 'https://bartb.ie/',
    twitter: 'bbusschots'
  },
  {
    firstName: 'Allison',
    surname: 'Sheridan',
    displayName: 'Allison',
    email: 'allison@podfeet.com',
    url: 'https://www.podfeet.com/',
    twitter: 'pod feet'
  },
  {
    firstName: 'William',
    surname: 'Butler',
    displayName: 'Bill',
    email: 'bill@some.tld',
    url: 'https://www.some.tld/',
    twitter: 'therealwb'
  }
];
```

Imagine we needed to sort this array by surname ignoring case. We could do a little googling, find our favourite sorting algorithm (say [Quick Sort](https://en.wikipedia.org/wiki/Quicksort)), and implement it using a comparison of the `surname` property as the test for whether or not any two items should come before or after each other in the sorted list.

Imagine then a few days later we find out we need to sort this same list by `displayName` (again ignoring case). We could copy-and-paste our first sorting function, find the line where we compare base on the `surname` property, and replace that with the `displayName` property. This is starting to smell bad!

But things can quickly get smellier — next, imagine we need to sort based on the URL, but we want to ignore the www part, and again, ignore the case. Like before, we can copy-and-paste our original function, find the line where we compare the values of the `surname` property, and replace it with the few lines of code needed to break apart the `url` property, extract the domain part, remove the www part if present, and then do the comparison.

We now have three functions that are almost identical except for a few lines of code in the middle where they compare two values. We then find a bug in our implementation of Quick Sort. We now have to fix it in three places. This is a brittle solution, and definitely a _bad smell_ in software engineering terms. There must be a better way!

The solution would be to re-write our first Quick Sort function so it takes a function as an argument, i.e. a callback, and uses that function to do the needed comparisons.

This is such a good idea that this is actually how JavaScript’s native `.sort()` function in the Array prototype works!

If you don’t give `.sort()` a callback as an argument, then it will compare values using a simple string comparison, i.e. it will do a lexical comparison. But if you do give it a callback you are effectively saying “sort the array using this comparison logic”.

If you read [the documentation for `.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) you’ll see that the callback should accept two arguments, two values to compare, and return a negative integer, zero, or a positive integer where negative means the first value should come before the second, zero means they can remain in their current order, and a positive value means the first should come after the second.

Rather than writing our own functions, we can sort our objects using the built-in `.sort()` function and a callback for comparing values (you can enter the examples into the console).

To sort by surname while ignoring case:

```JavaScript
Array.from(peopleObjects).sort(function(a, b){
  const snA = a && a.surname ? String(a.surname).toLowerCase() : '';
  const snB = b && b.surname ? String(b.surname).toLowerCase() : '';
  if(snA == snB) return 0;
  return snA < snB ? -1 : 1;
});
```

Note that the `.sort()` function does not duplicate the array, but sorts it in place. To avoid destroying the sample array, the code snippet uses `Array.from()` to create a fresh copy of the array and then sorts that copy.

Similarly, the following snippet will sort on `displayName` in a case-insensitive way:

```JavaScript
Array.from(peopleObjects).sort(function(a, b){
  const dnA = a && a.displayName ? String(a.displayName).toLowerCase() : '';
  const dnB = b && b.displayName ? String(b.displayName).toLowerCase() : '';
  if(dnA == dnB) return 0;
  return dnA < dnB ? -1 : 1;
});
```

And for completeness, the following snippet will sort on domain in a case-insensitive way ignoring the www part if present:

```JavaScript
Array.from(peopleObjects).sort(function(a, b){
  const urlToDomain = function(u){
    const urlMatch = String(u).toLowerCase().match(/^http(?:s)?[:]\/\/([^\/]+)/);
    let domain = urlMatch ? urlMatch[1] : '';
    domain = domain.replace(/^www[.]/, '');
    return domain;
  }
  const dA = urlToDomain(a.url);
  const dB = urlToDomain(b.url);
  if(dA == dB) return 0;
  return dA < dB ? -1 : 1;
});
```

There are many other standard JavaScript functions which provide generic functionality using callbacks including the [`.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) and [`.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) function from the Array prototype.

### Event Handling with Callbacks

Literally every event handler we’ve used in this series uses functions as arguments, in other words, all event handlers we’ve seen use callbacks. Just within `pbs77a.html` we see two examples of this.

Firstly, The document ready handler takes the form:

```JavaScript
$(function(){
  // …
});
```

That’s an anonymous function being passed as the only argument to the `$()` function, i.e. an anonymous function used as a callback.

Secondly, the click handler for the button takes the following form:

```JavaScript
$('#ajax_btn').click(function(){
  // …
});
```

Again, we see an anonymous function being passed to the `.click()` function, i.e. an anonymous function used as a callback.

AJAX is also event-driven, so, callbacks can also be used to process the responses from the HTTP request AJAX triggers.

### Using `$.ajax()` with Callbacks

Let’s bring this back around to jQuery’s `$.ajax()` function. This function expects all its arguments to be passed as a single object defining multiple name-value pairs. Of all the possible name-value pairs supported by the function that we have seen, three of them expect the value to be a function. Specifically, the `success`, `error`, and `complete` keys. Because these are in effect three named arguments to a function that expects their value to be a function, we can describe them as callbacks (as the jQuery documentation does in places).

The jQuery documentation tells us that the `success` callback gets executed if the AJAX HTTP request succeeds, and that it will be passed the data returned by the server as the first argument when it’s called. The jQuery documentation also tells us that the `error` callback gets executed if the AJAX HTTP request fails. And finally, the jQuery documentation also tells us that regardless of success or failure, the `complete` callback will always be executed when the AJAX HTTP request completes, and that will happen after either the `success` or `error` callbacks finish executing.

As an example, the click handler for the button in `pbs77a.html` makes the following AJAX HTTP request to a URL on my server that returns a random number between 1 and 100 as a string:

```JavaScript
$.ajax({
  url: 'https://www.bartbusschots.ie/utils/fakerWS/numberBetween/1/text',
  method: 'GET',
  cache: false,
  data: {
    arg1: 1,
    arg2: 100
  },
  dataType: 'text',
  success: saySomething,
  error: function(){
    saySomething('The AJAX Call failed 😢');
  },
  complete: function(){
    saySomething('The AJAX call completed');
  }
});
```

Notice that we used a named function (`saySomething`) for the `success` callback, and anonymous functions for the `error` and `complete` callbacks.

## PBS 76 Challenge Solution

The challenge set at the end of [the previous instalment](https://bartificer.net/pbs76) was simply to convert the solution from the previous challenge to using AJAX to fetch the Mustache template rather than having it hard-coded into the document using a script tag with a custom MIME-Type. For bonus credit, there was an additional challenge, move the JSON data out into a separate file and load it via AJAX too.

It sounds like the bonus credit is easy to earn, just do the same thing twice, but that’s absolutely not the case! Why? Because there is a dependency between the two AJAX calls — both have to complete before the template can be rendered. Callbacks are a very poor model for dealing with these kinds of interdependencies, but they’re all we’ve covered to date.

Interdependent AJAX calls definitely can be handles using callbacks. That’s how the web worked for years! But, it was always an unpleasant experience, hence the common complaint from web developers about being stuck in _callback hell_!

I’m going to start with my sample solution to the actual challenge, and then I’m going to use my solution for the extra credit to illustrate callback hell. With that done, I can then share your salvation from callback hell, JavaScript promises!

### The Basic Solution

The first thing I needed to do was create a blank file, give it the name `contacts.tpl.txt` (explicitly specified in the challenge text), and copy the content of the script tag containing the template into that file. Note that only the content of the script tag should be copied, not the script tag itself! Once the new file is created, I deleted the entire script tag from the HTML file.

At this stage everything breaks, because the document ready handler currently fetches the template string using the following line of code:

```JavaScript
const contactTpl = $('#contact_card_tpl').html();
```

This needs to be removed, and replaced with an AJAX call.

The other change that’s needed is that the code to render the template can’t execute until the AJAX query returns, so it needs to move from the body of the document ready event handler into the AJAX call’s success callback.

The code for generating the view objects can remain un-altered.

Let’s add the AJAX call to the bottom of the document ready handler, after the code that generates the view objects:

```JavaScript
const $contactCardHolder = $('#contact_cards');
$.ajax({
  url: './contacts.tpl2.txt',
  method: 'GET',
  dataType: 'text', // the template is a string
  error: function(){
    $contactCardHolder.append($('<div>').addClass('col-12 text-danger').text('AJAX ERROR'));
  },
  success: function(contactTpl){
    // render the contact cards
    for(const person of people){
      $contactCardHolder.append(Mustache.render(
        contactTpl, // the template, passed as first arg
        person, // the view
        partials // the partials
      ));
    }
  }
});
```

I’d like to draw your attention to a few key points:

*   We are making an AJAX call to the relative URL `./contacts.tpl2.txt` using the HTTP `GET` method.
*   Since we are just fetching a file, we don’t need to send any parameters, so there is no `data` option present at all.
*   Since the template is just a string, we don’t want jQuery to do any pre-processing on the value returned by the AJAX call, hence, the `dataType` option is set to `'text'` rather than `'json'`.
*   The `error` callback simply inserts a crude error message into the grid row where the contact cards should have gone.
*   The code within the success callback is copied-and-pasted un-changed from the bottom of the original document ready handler. Since we can name the first argument to a function anything we like, I chose to name mine `contactTpl` since the first argument is the data returned by the server, which in this case is the template string.

At this point we have completed the assignment, but there is extra credit available if we can update our code to load both the data and the template via AJAX. While it’s tempting to think this is the easiest extra credit offered in the history of this series, there is an important subtlety that puts the lie to that assumption.

This is not simply a case of doing the same thing a second time. Why? Because there is an inter-dependency between the two AJAX calls. The template cannot be rendered until both calls complete. It’s this interdependency that cracks open the gates to _callback hell_!

## AJAX Requests in Series

The simplest approach to dealing with the dependency between our two AJAX calls is to ensure they always happen in the same order, one, then the other. In other words, we want to arrange the AJAX requests in series.

The first thing we need to do is move the JSON data from the `<script>` tag into a separate file, let’s name it `people.json.txt`. Like with the HTML template, we want to copy the contents of the `<script>` tag containing the JSON data, but not the opening and closing tags themselves.

Next, let’s do a little house keeping and move the error handling code from the existing AJAX call into a separate function so we can use it for both calls without duplicating code:

```JavaScript
const showAJAXError = function(){
  $contactCardHolder.append($('<div>').addClass('col-12 text-danger').text('AJAX ERROR'));
};
```

We also need to move the declaration of the variable that will hold the generated view objects (`people`) into the global scope so the `success` callback for this AJAX request can write to it, and, the `success` callback for the second AJAX request to fetch the template can read from it:

```JavaScript
var people = [];
```

Finally, we can now create an AJAX request to fetch the JSON data, and move literally all the remaining code in the document ready handler into the success callback for this new AJAX request, including the AJAX request to fetch the template.

In other words, our document ready handler now does the following:

1.  Initialise some helper variables and helper functions.
2.  Make an AJAX call to fetch the JSON data, and within that request’s `success` handler/callback do the following:

    1.  Build the view objects from the data.
    2.  Make an AJAX call to fetch the template, and within that request’s `success` handler/callback do the following:

        1.  Look through the view objects, rendering the template for each and appending the resulting contact cards into the appropriate Bootstrap grid row.

Since the code for this success handler is quite long, I’ve not included it directly into the post, you’ll find it in `pbs76-challenge-solution/extraCredit-1-Series.html` in this instalment’s ZIP file.

Notice that because we created a helper function to render the AJAX error messages, the error callback for both AJAX requests is simply `error: showAJAXError`.

Also notice the use of `dataType: 'json'` in the AJAX request to fetch the JSON data from the file. This tells jQuery to automatically convert the contents of the file to a JavaScript object using `JSON.parse()`.

The critical point to note though is the order in which things are guaranteed to happen with this solution. The second AJAX query is initialised from within the `success` handler/callback for the first, and the rendering of the template, which requires both AJAX requests to have completed successfully is performed within the `success` handler of the inner AJAX query.

Clearly, this solution works, but, it’s not very efficient. Our browsers are capable of doing two things at once, but we force it to do these two AJAX calls one after the other. This is fine for a simple page like this, but it’s a very poor model in the real world!

Ideally, we would like both AJAX requests to be performed simultaneously, and then, when both have succeeded, for the rendering of the data to be somehow triggered.

## AJAX Requests in Parallel

Running the two AJAX queries in parallel adds some extra complexity — the template can’t be rendered until both the JSON data and the template string have been successfully fetched. There’s no way to know which AJAX request will return complete first, so the template can’t be rendered within either event handler, at least not directly.

The key to getting this to work is to move the code for rendering the template into a separate function, and to add tests to the start of this new function to check if all the needed data has arrived, and to return without doing anything if that’s not the case. This new function can then be called as the last line in both success callbacks. The first time it gets called it will do nothing, since either the data or the template will be absent, but the second time all the needed variables will be populated, so the template can be rendered.

We already have a globally scoped variable for holding the view objects, we now also need one for the template string, so it’s start by declaring that variable:

```JavaScript
var contactCardTpl = '';
```

Next, let’s define the function for rendering the contact cards:

```JavaScript
const renderContactCards = function(){
  // make sure the view objects are ready
  if(people.length < 1) return;

  // make sure the template is ready
  if(contactCardTpl.length < 1) return;

  // render the contact cards
  for(const person of people){
    $contactCardHolder.append(Mustache.render(
      contactCardTpl, // the template
      person, // the view
      partials // the partials
    ));
  }
};
```

We now need to refactor our AJAX calls so they are no longer nested, and so they call this newly created function. Because the code for the updated document ready handler is quite long, I’ve not embedded it into the post. You’ll find the full source in the file `pbs76-challenge-solution/extraCredit-2-parallel.html` in this instalment’s ZIP file.

You’ll notice that the document ready handler now does the following:

1.  Initialise some helper variables and helper functions.
2.  Make an AJAX call to fetch the JSON data, and within that request’s `success` handler/callback do the following:

    1.  Build the view objects from the data.
    2.  Try render the contact cards.

3.  Make an AJAX call to fetch the template, and within that request’s `success` handler/callback do the following:

    1.  Look through the view objects, rendering the template for each and appending the resulting contact cards into the appropriate Bootstrap grid row.
    2.  Try render the contact cards.

## Callback Hell

In this very simplistic example where we have just two AJAX requests in the entire page, and a very simply relationship between them there is already a lot of work to do to coordinate the rendering of the contact cards. We needed to define a whole new function, and to move two variables out into the global scope. When you try scale this approach to a more real-world scenario where page might make use of multiple templates and multiple data sources, this becomes utterly unwieldy very quickly! You simply end up with too many dependencies to keep in your mind at the same time. It’s literally fatiguing to code like that, and that’s before we get into the idea of having to maintain such complicated code. As bad as it is keeping these interdependencies straight in your mind while you write them, try debugging them six months or a year later!

It’s these challenges that have lead to the \*callback hell\* moniker.

## A Challenge

I’ve made a web service available on my website that returns random data or various forms. Using the following URL that web service will generate a random number between 1 and 100 (inclusive) and return it as a plain-text string:

`https://bartbusschots.ie/utils/fakerWS/numberBetween/1/text?arg1=1&arg2=100`

The challenge is to use this web service as the data source for a simple number-guessing game. Users should be able to start (and later re-start) the game by hitting a button. As they guess they should be told if their guess is correct, too low, or too high. They should then get to keep guessing numbers until they guess the right one. When they do eventually get it right they should be told how many guesses it took them.

The design of the UI (user interface) and UX (user experience) are entirely up to you, build the game’s interface such that it makes the most sense to you.

## Final Thoughts

We’ve seen a hint of what callback hell might be like on a large project. Obviously, there must be a better way, and of course there is. Our route out of callback hell is a relatively new abstraction known as a _promise_. Initially promises were implemented as 3rd-party libraries ([bluebird](http://bluebirdjs.com/docs/getting-started.html) being a particularly popular one), but as of ECMAScript 2017 we now have an official implementation of promises in JavaScript. You might think the coming of official promises would mean the end of the 3rd-party implementations, but you’d be wrong. For various reasons you’ll still find a lot of 3rd-party implementations in use today. What’s happened instead is that all the implementations have coalesced around the official promises API, resulting in a new piece of jargon — _thenable_. Any object that’s compatible with the official JavaScript promises API is said to be a _thenable_ object. One of the places you’ll find thenables is in jQuery, specifically, the `jqXHR` objects returned by `$.ajax()` are thenables!

In the next instalment we’ll learn how to use promises to side-step callback hell and make our AJAX code easier to write and to maintain.
