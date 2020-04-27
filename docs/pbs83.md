# PBS 83 of X — Bootstrap Cards

In this instalment we’ll finish our first exploration of Bootstrap 4 with a look at one its most versatile components, the so-called _Card_. This is one of those components that’s so generic it’s hard to describe, but once you learn about it you’ll start seeing it all over the web. Cards really are ubiquitous!

It’s important to stress that while we’re wrapping up our exploration of Bootstrap 4 with this instalment, that does not mean we’ve come close to covering every feature this impressive library offers. Instead, the aim was to cover the big-picture items, and leave you with enough experience to be able to learn the rest independently by reading [Bootstrap’s excellent documentation](https://getbootstrap.com/docs/).

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/10/pbs83.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs83.zip).

# Matching Podcast Episode 610

Listen along to this instalment on [episode 610 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/10/ccatp-610/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_10_04.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_10_04.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 82 Challenge Solution

The challenge set at the end of the previous instalment was to update the number guessing game we’ve been working on for many of the recent challenges so it uses an async function to load all its needed bootstrap templates and initialise the game.

The first step I chose to take in migrating my version of the game to using async functions is to make the function `loadTemplates()` async. Since I had already written the function to return a promise, this is not strictly necessary, but it’s a good idea to explicitly mark functions you expect to always return promises with the `async` keyword for clarity. It will be much more obvious to future you that you intend the function to always return a promise if it’s explicitly coded as an async function. As an added bonus, the `async` keyword should also be picked up by any documentation solution you might be using, again making things clearer for future you. So, all I did was update the function definition to:

```JavaScript
async function loadTemplates(...templateNames){
  \\ …
}
```

The next step is to make my document ready event handler async by altering the relevant anonymous function expression:

```JavaScript
// The Document Ready Handler
$(async function(){
  // …
}
```

We can now update the body of the document ready handler to use the `await` keyword for dealing with the template loading.

This is how the templates are loaded before we make our change:

```JavaScript
// load the templates and if successful, reset the game
loadTemplates('gameMessage', 'guesses', 'guessPopover', 'gameWon', 'gameGrid', 'confirmQuit').then(
  function(){
    // the template all loaded without error, so go ahead and reset (init) the game
    resetGame();
  },
  function(err){
    // something went wrong loading the templates
    $GAME_INTERFACE.empty().html(Mustache.render(
      TEMPLATES.gameInitError
    ));
    console.log('failed to load templates with error', err);
  }
);
```

Notice the standard promise handling — passing `.then()` two callbacks, the first to execute when all goes well, and the second when there is an error. Note that without the comments at the top of each callback it would not be at all obvious which part of that code is dealing with success, and which is doing the error handling, it’s just two anonymous functions as callbacks.

Let’s go ahead and re-factor the code to use `await` instead:

```JavaScript
// load the templates
try{
  await loadTemplates('gameMessage', 'guesses', 'guessPopover', 'gameWon', 'gameGrid', 'confirmQuit');
}catch(err){
  $GAME_INTERFACE.empty().html(Mustache.render(
    TEMPLATES.gameInitError
  ));
  console.log('failed to load templates with error', err);
}

// reset the game
resetGame();
```

Notice how much clearer it is which parts of the code are dealing with regular successful execution, and which parts are dealing with error handling.

Finally, for completeness, and as a nice example of one possible use for self-executing anonymous async functions, or async IIFEs (async immediately invoked function expressions), I also updated my `resetGame()` function to make use of the await keyword.

As a reminder, this function fetches a random number from a web service using AJAX, then either starts the game, or, renders an error. The function does not return anything, and deals with all potential errors internally. We don’t want to alter the functions behaviour from the point of view of the rest of our code, so when we’re done making changes it must still not return anything, and must still deal with all its errors internally. This means we can’t mark the function as async, because then it will return a promise, and all code that calls the function will need to be updated to deal with potential promise rejections. Remember, good code handles all potential promise rejections!

So, rather than marking the entire function as async, we just want to make part of the function’s contents run asynchronously. This can be easily achieves with an async IIFE. This is what the function looks like before we refactor it:

```JavaScript
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

Again, the comments are the only thing clearly distinguishing the error handling code.

Now let’s replace the AJAX call and its `.then()` with an async IIFE that makes use of `await`:

```JavaScript
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

  // switch to async for the remainder of the function
  (async ()=>{
    try{
      // get the random number
      RANDOM_NUMBER = await $.ajax({
        url: 'https://bartbusschots.ie/utils/fakerWS/numberBetween/1/text',
        data: {
          arg1: MIN,
          arg2: MAX
        },
        method: 'GET',
        cache: false,
        dataType: 'text'
      });

      // blank the guesses
      GUESSES = [];
      MIN_POSSIBLE_GUESS = MIN;
      MAX_POSSIBLE_GUESS = MAX;

      // reset the game UI
      resetGameUI();

      // game on!
      GAME_ON = true;
    }catch(err){
      $GAME_INTERFACE.empty().html(Mustache.render(
        TEMPLATES.gameInitError
      ));
      console.log('random number error', err);
    }
  })();
}
```

You’ll find the full code to my solution in the folder `pbs82-challengeSolution` in this instalment’s ZIP file.

## Bootstrap Cards

The single most versatile Bootstrap component is the so-called _Card_. If you need to present a small snippet of information, perhaps one of many, perhaps not, the chances are you can get what you want from the Card component. Cards support a very wide variety of optional components that can be combined in a near infinity of combinations. This makes cards very powerful, but a little daunting to try explain 🙂

Note that as usual, we’ll be covering the highlights, not exploring every possible feature, so you can find out more in [the relevant section of the Bootstrap documentation](https://getbootstrap.com/docs/4.3/components/card/).

Let’s start with the few things all cards have in common — all cards are contained within a tag with the class `.card`. Any tag can be used for cards, but the tag you’ll see used most often is `<div>`. Unless you use a Bootstrap utility class or additional CSS to alter the behaviour, Cards always expand to fill the available width. You’ll commonly find Cards used within flex boxes or within `.col`s in the Bootstrap grid.

At the top level cards can contain the following (all of which are optional):

*   A header with `.card-header`.
*   A footer with `.card-footer`.
*   Image caps with `img.card-img-top` (an `<img>` tag with the class `card-img-top`). These must appear as the first and/or last items within a Card.
*   A list with `ul.list-group.list-group-flush` (a `<ul>` tag with the classes `list-group` & `list-group-flush`). Each item in the list must be an `li.list-group-item`.
*   A Card image with `.card-img`. The image will retain its aspect ratio while filling the full width of the card.
*   A Card body with `.card-body`.

Any tag can be used for the header, footer, or body, but again, `<div>` is generally used.

The body of a card can then, in turn, contain the following:

*   Card titles with `<h1>` … `<h6>` tags with the class `card-title`.
*   Card sub-titles with `<h1>` … `<h6>` tags with the class `card-subtitle`.
*   Card text with `.card-text`.
*   Card links with `a.card-link`.

Finally, note that the standard Bootstrap utility classes can be used with Cards.

### Kitchen Sink Example 1 — Everything but Image Caps

The easiest way to illustrate Cards in use is with an example. As a first example, let’s create a Card that has everything but image caps. That is to say, a Card with a header, a regular Card image (not an image cap), a Card body, a Card list, and a Card footer. The Card body will contain a Card title, a Card sub-title, some regular Card text, and a Card link.

```XHTML
<!-- The Card -->
<div class="card" style="width: 300px;">
  <!-- A Card header -->
  <h2 class="card-header h4">A Card Header</h2>

  <!-- A regular Card image -->
  <img src="PBS-Logo.png" class="card-img" alt="The PBS Logo" title="A card image">

  <!-- A Card body -->
  <div class="card-body">

    <!-- A Card title -->
    <h3 class="card-title h5">A Card Title</h3>

    <!-- A Card sub-title -->
    <h4 class="card-subtitle h6 text-muted">A Card Subtitle</h4>

    <!-- Regular Card text -->
    <p class="card-text">This is some card text. It's really not very exiting in any way.</p>

    <!-- A Card link -->
    <a href="" class="card-link">A Card Link</a>
  </div>

  <!-- A Card list -->
  <ul class="list-group list-group-flush">
    <li class="list-group-item">List Item 1</li>
    <li class="list-group-item">Second List Item</li>
    <li class="list-group-item">Another item in a list</li>
  </ul>

  <!-- A Card footer -->
  <div class="card-footer text-muted">A Card Footer</div>
</div>
```

This produces a card that looks like this:

![Kitchen Sink Card 1](../assets/pbs83/Screenshot-2019-10-03-at-23.56.30.png)

### Kitchen Sink Example 2 — Everything but Header & Footer

Since a Card can have either a header, or, an image cap on top, and, either a footer or an image cap on the bottom, let’s look at a sample card that replaces the header and footer with a pair of image caps.

```XHTML
<!-- The Card -->
<div class="card" style="width: 300px;">

  <!-- The top image cap -->
  <img src="NC-Logo.png" class="card-img-top" alt="The NosillaCast Logo" title="A card image">

  <!-- A Card body -->
  <div class="card-body">

    <!-- A Card title -->
    <h3 class="card-title h5">A Card Title</h3>

    <!-- A Card sub-title -->
    <h4 class="card-subtitle h6 text-muted">A Card Subtitle</h4>

    <!-- Some regular Card text -->
    <p class="card-text">This is some card text. It's really not very exiting in any way.</p>

    <!-- A Card link -->
    <a href="" class="card-link">A Card Link</a>
  </div>

  <!-- A Card list -->
  <ul class="list-group list-group-flush">
    <li class="list-group-item">List Item 1</li>
    <li class="list-group-item">Second List Item</li>
    <li class="list-group-item">Another item in a list</li>
  </ul>

  <!-- The bottom image cap -->
  <img src="Podfeet-Footer.png" class="card-img-top" alt="Podfeet Icons">
</div>
```

Notice that rather confusingly, both the top and bottom image caps have the class `.card-img-top`.

The code above produces a Card that looks like this:

![Kitchen Sink Card Example 2](../assets/pbs83/Screenshot-2019-10-04-at-00.19.19.png)

## Collections of Card

Cards can be used individually, perhaps to call out a piece of information that is separate form the remainder of the page, but more often than not, you’ll use a collection of cards to display multiple chunks of information of a similar type.

**You can use the standard Bootstrap grid to lay out your Cards** by simply adding a single Card per `.col` within your grid.

However, you can get more fancy than that — Bootstrap provides two special containers for Cards, [Card Groups](https://getbootstrap.com/docs/4.3/components/card/#card-groups), and [Card Decks](https://getbootstrap.com/docs/4.3/components/card/#card-decks).

There is a third layout provided, [Card Columns](https://getbootstrap.com/docs/4.3/components/card/#card-decks), but the docs warn that this feature is still quite immature, and is not as reliable as it could be, so we’ll be ignoring them in this series, at least for now.

### Card Groups & Card Decks

Card Groups and Card Decks are extremely similar — both will ensure that the headers and footers in each card within them line up horizontally, and both will keep the cards at an equal width as they stretch and shrink.

The only noticeable difference is that in a Card Group the Cards touch each other like buttons in a [Button Group](https://getbootstrap.com/docs/4.3/components/button-group/), but in a deck each card is separate and there is some empty space between the Cards.

Let’s start with a sample card group consisting of three cards representing some podcasts you might have heard of 😉. You’ll find the full code in the file pbs83a.html in the ZIP file, but the snippet below shows the overall structure of the Card Group:

```XHTML
<div class="card-group">
  <div class="card">
    <!-- … -->
  </div>
  <div class="card">
    <!-- … -->
  </div>
</div>
```

In this case each Card is a little simpler than the kitchen sink examples above. Each Card consists of an image cap, and a Card body containing just a Card title, some regular Card text & a Card link.

This produces a Card Group that looks like this:

![Card Group Example](../assets/pbs83/Screenshot-2019-10-04-at-00.33.07.png)

We can convert this card group into a card deck by simply changing `card-group` to `card-deck`. When we do that we get a Card Deck that looks like this:

![Card Deck Example](../assets/pbs83/Screenshot-2019-10-04-at-00.35.26.png)

## A Challenge

This challenge aims to draw together many of the topics we’ve recently covered into a single real-world example.

The website [exchangeratesapi.io](https://exchangeratesapi.io/) makes a list of currency exchange rates published by the European Central Bank (ECB) available via a JSON web service.

When you send a GET request to the URL `https://api.exchangeratesapi.io/latest` you’ll get back a JSON string representing the current exchange rates between the Euro and a number of major world currencies. Here’s a sample of the kind of data the web service returns:

```JavaScript
{
  "rates": {
    "CAD": 1.4606,
    "HKD": 8.5882,
    "ISK": 135.7,
    "PHP": 56.738,
    "DKK": 7.4656,
    "HUF": 333.02,
    "CZK": 25.739,
    "AUD": 1.6294,
    "RON": 4.747,
    "SEK": 10.833,
    "IDR": 15520.3,
    "INR": 77.7155,
    "BRL": 4.5094,
    "RUB": 71.2751,
    "HRK": 7.418,
    "JPY": 117.17,
    "THB": 33.461,
    "CHF": 1.0957,
    "SGD": 1.5128,
    "PLN": 4.34,
    "BGN": 1.9558,
    "TRY": 6.2448,
    "CNY": 7.8282,
    "NOK": 10.0165,
    "NZD": 1.7421,
    "ZAR": 16.6077,
    "USD": 1.0951,
    "MXN": 21.6283,
    "ILS": 3.8282,
    "GBP": 0.8879,
    "KRW": 1317.84,
    "MYR": 4.5857
  },
  "base": "EUR",
  "date": "2019-10-03"
}
```

The currencies are all represented using their [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency codes. You’ll find [a full list of all codes here](https://www.xe.com/de/iso4217.php).

Although the web service defaults to showing rates relative to the Euro (`base = "EUR"`), it can show the rates relative to any supported currency by passing the three letter code for the desired currency as an HTTP query parameter named base, e.g., the URL `https://api.exchangeratesapi.io/latest?base=USD` gives the rates relative to the US dollar.

Using this web service, create a collection of Cards showing the exchange rate relative to a collection of currencies of your choosing against another collection of currencies of your choosing. You should show at least three cards, and each card should show at least 5 rates.

You should use a Mustache template to build your cards, and that template as well as the currency information should be fetched using AJAX.

## Final Thoughts

We’ve now finished our exploration of Bootstrap 4. We’ve not covered even nearly everything, but we have looked at a broad range of the highlights. We’ve learned that Bootstrap can be conceptually divided into four aspects — layout, styling of existing HTML elements, custom components, and utilities. We’ve explored a representative sample of each of these aspects, and have hopefully I’ve imparted enough knowledge to empower you to research the rest independently as and when needed.

The next thing we need to do is circle back to some recent enhancements to the core JavaScript language. That will then end our first pass at JavaScript, leaving us ready to embark on an entire new chapter within this ever expanding series.
