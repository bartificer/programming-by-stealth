---
title: DOM & jQuery Objects Redux
instalment: 88
creators: [bart, allison]
date: 2019-12-14
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_12_14.mp3
---

We’re nearing the end of our series-within-a-series recapping the many proverbial hats JavaScript objects wear and updating our knowledge to include new features added to the language since we started our JavaScript journey. In this instalment we’ll focus on two very tightly related hats — the native JavaScript DOM object, which we’ve chosen not to use, and the jQuery object, which wraps native DOM objects to give them superpowers.

This instalment will have a slightly unusual structure. We’ll use my sample solution to the challenge set at the end of [instalment 85](https://bartificer.net/pbs85) to illustrate some of the core concepts.

## Matching Podcast Episode 619

Listen along to this instalment on [episode 619 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/12/ccatp-619)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_12_14.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_12_14.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 85 Challenge Sample Solution

The challenge set at the end of instalment 85 was to update the currency conversion page created in the previous challenge so users could create additional cards to see the exchange rates for other currencies, and to allow users to remove currency cards.

A bonus additional challenge was added in the previous instalment, which was to allow the user control over the rates shown within each currency card.

The intended effect was to convert what was a static page into a basic web app.

My sample solution completes both the original assignment and the bonus extra challenge:

*   [View Solution in Browser](https://rawcdn.githack.com/bbusschots/pbs-resources/f4ba373772b77bf617629b723e1df87bd7a3441b/instalmentResources/pbs88/pbs85-challengeSolution/index.html)
*   [View Source](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs88/pbs85-challengeSolution/index.html)
*   [Download ZIP](https://rawcdn.githack.com/bbusschots/pbs-resources/63ba5c524f9605c0df0663a3925e83e29d269f91/instalmentZips/pbs88.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs88.zip)

Examples throughout this instalment are intended to be run from the console on this page.

### Design of Sample Solution

Big-picture-wise, my sample solution uses [jQuery’s `$.ajax()` function](https://api.jquery.com/jQuery.ajax/) to make AJAX calls to the [exchangeratesapi.io](https://exchangeratesapi.io/) API. The entire page is laid out using [the Bootstrap Grid](https://getbootstrap.com/docs/4.4/layout/grid/), with the exchange rates for each base currency shown using Bootstrap cards. The two forms for controlling the web app are also displayed as cards. Within the form for controlling the rates within each card, the currencies are controlled using [Bootstrap switches](https://getbootstrap.com/docs/4.4/components/forms/#switches). The UI is assembled using [Mustache templates](https://github.com/janl/mustache.js).

This sample solution is my second attempt at solving the problem. My initial approach was to create an empty page and populate it as people clicked buttons. That worked well for adding and removing entire cards, but proved unwieldy and inelegant for adding and removing rates from each of the cards.

My second (and final) approach was to hide and show things rather than insert and remove.

When the page loads, hidden placeholder `cols` containing cards with a loading spinner are added to the document for each supported currency.

The function to add a currency card first checks to see if the card has been loaded before. If it has, the old card is simply unhidden. If the card has not been loaded before, the hidden placeholder with loading indicator is unhidden and an AJAX request is made to fetch the data. Using the data, a card is built for each currency containing the rates for all supported currencies, but with the ones not requested by the user hidden. The loading placeholder is then replaced with the generated card.

‘Closing’ the card is simply a matter of hiding the card, and adding and removing rates simply a matter of hiding and showing elements within the cards.

## HTML Documents, HTML Tags, and DOM Objects

They key to turning a web page into a web app is to make it interactive by writing JavaScript code that alters the content on the page in response to events. To understand how JavaScript alters a page, we need to take a step back and understand how browsers conceptualise HTML documents.

To a browser, a document consists of many nested elements which each have attributes. This structure is defined by the [HTML 5 specification](https://html.spec.whatwg.org/multipage/).

As a concrete example, `img` elements represent images, and have an attribute named `src` for specifying the image’s URL, and another attribute named `alt` for specifying alternative text.

As programmers we have two distinct views of this internal reality:

1.  **HTML** represents the elements that make up a document as tags. A `<p>` tag in HTML will be stored internally by the browser as a `p` element.
2.  **JavaScript** represents the elements as a series of nested objects contained within a data structure known as the Document Object Model, or DOM.

**HTML tags and JavaScript DOM objects represent the elements that make up an HTML document.**

Because the HTML specification uses the word _element_, I prefer to use that word, but you can consider it synonymous with _tag_ and _DOM object_. You might also see online resources refer to HTML document elements as _nodes_. The jQuery documentation uses the term _DOM element_.

The core JavaScript language provides access to the DOM, and the entry point is an object with the name `document`. This object provides a suite of functions which can be used to query the document for objects representing individual elements, e.g. `document.getElementById()`, to get the DOM object with a given `id` attribute.

Over JavaScript’s long and complex history, different browsers have implemented the DOM differently. For a long time the standard DOM lacked a lot of commonly desired functionality. These were two big pain-points that led to the development of the open source jQuery library.

## JQuery Objects

JQuery does not replace DOM objects; it enhances them. I like to think of jQuery as a wrapper for plain ordinary DOM objects that gives them superpowers, like Iron Man’s suit!

A jQuery object is an array-like object containing zero or more native DOM objects and providing a whole bunch of functions for interacting with the DOM. It’s important to remember that a single jQuery object can contain arbitrarily many DOM objects, so it can represent arbitrarily many document elements. By design, jQuery functions are designed to operate on multiple DOM elements at once. If you use jQuery to change a colour, then the colour will change on all the elements the jQuery object represents. This ability to alter massive swaths of a document with a single function call is one of jQuery’s biggest appeals.

Ultimately, jQuery is not magic — it’s simply a more developer-friendly wrapper around the standard DOM objects and functions. Since jQuery is written in JavaScript, there is literally nothing you can do with jQuery that you couldn’t do using only standard JavaScript.

One of jQuery’s goals is to minimise typing, so jQuery exposes all its functionality through a single object that wears many hats. The full name of that object is `jQuery`, but (unless you explicitly disable it), that object has a nice short alias — `$`. The `$` object wears two hats — it is a function, and it is a class/prototype. The vast majority of the time we have interacted with `$` as a function, but we have seen it used as a class occasionally. For example `$.ajax()` is a static function belonging to the `$` class/prototype.

### Selecting Elements with JQuery

The first step to interacting with the elements that make up a document is to select one or more of them into a jQuery object. We can do this by calling the `$()` function with a CSS selector as the first argument. For example, to get all elements on the page with the CSS class card, we can use `$('.card')`.

By default the `$()` function will search the entire document, but we can limit its scope by passing it a jQuery object to search within as a second argument.

You can see an example of this more advanced usage in the submit event handler for the form for adding new cards in the sample solution:

```javascript
// get the selected currency
const curCode = $('select', $form).val();
```

The first argument here is a CSS selector which simply matches all `<select>` elements. The second argument (`$form`) is a jQuery object representing the form for adding new currency cards. This limits the search to just the appropriate form, and, since the form only contains one `<select>`, removes the need to assign it an ID and hard-code that ID into the CSS selector.

### Testing Elements with JQuery

As well as searching the document based on CSS selectors, jQuery’s `.is()` function allows us to test if an element matches a given CSS selector.

For example, within the function for updating the enabled/disabled state of the options within the select for adding new cards (`updateAddCardSelectOptions()`), my sample solution tests to see if the grid column for a given currency (`$curCol`) is visible or not using the simple test `$curCol.is(':hidden')`. This uses the CSS pseudo-class `:hidden` as the selector.

### Altering Elements with jQuery

Having selected one or more elements within a page, the next logical thing to do is to alter them. JQuery provides many functions for doing this. For example, `.attr()` allows us to read and write attribute values, `.prop()` allows us to read and write element properties, and `.addClass()` & `.removeClass()` allow us to change the CSS classes assigned to an element.

Within the sample solution, you can see the use of `.prop()` to both read and alter properties in the following snippet from the function for enabling and disabling options within the currency selection in the form for adding new cards (`updateAddCardSelectOptions()`):

```javascript
// if the current option is not disabled, select it and exit the loop
if(!$opt.prop('disabled')){
  $opt.prop('selected', true);
  break; // end the loop
}
```

The snippet is contained within a loop that iterates over each `<option>` in the `<select>` to find the first one that’s not disabled and select it. The variable `$opt` is a jQuery object representing the `<option>` currently being processed by the loop.

When `.prop()` is called with one argument, it returns the state of the specified property. When it's called with two arguments, it sets the state of the specified property to the specified value.

In the snippet, `$opt.prop('disabled')` returns `true` if the option is disabled, or `false` if it’s not, that is if it’s enabled. `$opt.prop('selected', true)` selects the option by setting the `selected` property to `true`.

### Navigating the DOM with JQuery

Because HTML elements are nested in a tree-like structure, it’s possible to navigate from one element to another. However to understand how that works, it’s important to get some terminology straight.

Rather counterintuitively, `document` (effectively represented in HTML by the `<body>` tag) is referred to as both the _root_ of the tree and the _top_ of the tree!

There are two common groups of metaphors used to describe the DOM and moving within it. To illustrate these terms, let’s consider a very simplistic document:

```
<body>
  <header>
    <h1>A Very Simple Document</h1>
  </header>
  <main>
    <section>
      <h1>Section 1</h1>
      <p>See liste below:</p>
      <ul>
        <li>First item</li>
        <li>Second item</li>
      </ul>
    </section>
    <section>
      <h1>Section 2</h1>
      <p>Not really much to see here!</p>
      <p>A meaningless second paragraph 🙂</p>
    </section>
  </main>
</body>
```

At the top level our document contains a header and the main content. The header contains just a heading, and the main content contains two sections. Each section contains a heading and some content. The first section has a paragraph and an unordered list with two list items, and the second has two paragraphs.

The first groups of metaphors are directional. As you move from the `<body>` into the top-level elements, and then into the elements within those elements, you are said to be heading _down_ into the hierarchy. Moving in this direction will be described as heading _deeper_ into the DOM. Conversely, if you’re at one of the list items, then moving to the list or the section or the main is described as moving _up_ the DOM. The section is _higher_ in the DOM than the list which is _higher_ than the list item.

The second group of metaphors are familial. We can describe the unordered list as being the _parent_ of the list items. We can also reverse that and say that the list items are _children_ of the list. The two sections can be described as _siblings_ within the main, and the two list items as _siblings_ within the list. The metaphor can be stretched over multiple generations too — all elements nested within the first section are _descendants_ of that section, and all the containing elements between the list items and the `<body>` tag are _ancestors_ of the list items. Something to watch out for is that the plural _parents_ is often used as a synonym for _ancestors_. If you see _parent_ (singular) then it refers to the directly containing element, but if you see _parents_ (plural) it refers to **all** the containing elements. So, the parent of the list items is the list, but the parents are the list, the section, and the main.

With this naming scheme in mind, the names of the relevant jQuery functions make a lot more sense, and more importantly, so do the docs!

While jQuery functions like `.children()`, `.parent()` and `.parents()` should now be self-explanatory, the functions for searching up or down the hierarchy are not so well named, and if you’re like me, you’ll need to check the docs each time!

A good example of the kind of DOM traversal function I have to check the docs on every time is `.closest()`. Does it search up or down the DOM? I can never remember! Thankfully, armed with our understanding of the terminology, [the docs](https://api.jquery.com/closest/) now make perfect sense:

> … get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree …

In the sample solution, the checkbox for each toggle switch is contained within some nested `<div>`s within a list item. In the input event handler for the checkbox, I need to alter the border around the list item so it changes from gray to blue when the currency is activated. The handler has a reference to the checkbox that was interacted with (stored in a variable named `$toggle`). So to get a reference to the containing list item, I used `$toggle.closest('li')`.

### Creating & Inserting New Elements with jQuery

As well as searching, testing, altering, and navigating the existing DOM elements, jQuery can be used to create and insert new elements.

To create a new element, simply pass some HTML code as a string to the `$()` function as the only argument. This will create the element in a kind of limbo where it exists as a JavaScript variable, but isn’t part of the document yet. We can interact with it in this form though. We can apply jQuery functions to the element before we make it visible on the page by inserting it into the DOM.

It’s also important to note that you can create arbitrarily many arbitrarily deeply nested elements with a single call to the `$()` function by passing it complex HTML.

In the sample solution, the Mustache templating engine is used to build complex HTML strings which are then passed to the `$()` function. You can see an example of this within the function for adding currency cards (`showCurrencyCard()`):

```javascript
// generate the HTML
const cardHTML = Mustache.render(TEMPLATES.currencies.displayCard, cardView);

// convert the HTML to a jQuery object
const $card = $(cardHTML);

// …

// add a click handler to the close button
$('button.close', $card).click(function(){
  // hide the card
  $curCol.hide();

  // update the add card select
  updateAddCardSelectOptions();
});
```

This shows a jQuery object being built out of the HTML for an entire currency card, then that jQuery object being edited to add a click handler to the close button at the top-right of the card.

Once you have your newly created elements, you need to insert them into the DOM. Elements have to be inserted in a specific location within the DOM. jQuery does this by providing well named functions for inserting the new elements relative to an existing element, e.g. `.before()`, `.after()`, `.append()`, and `.prepend()`. Both `.before()` and `.after()` add the new elements as siblings, and `.append()` and `.prepend()` as children.

In the sample solution, the form for showing and hiding rates is generated from a template, stored in a variable named `$showHideRatesForm`, and then inserted into a waiting `<div>` with the following line:

```javascript
// add the form into the page
$('#currency_controls').append($showHideRatesForm);
```

### Interacting with Events via jQuery

Events are the key to bringing HTML documents to life. Without events they remain static!

You need to add event handlers to your document, but you can’t do that until the document is finished loading. So the most important event handler of all is the special event handler that triggers when the document becomes ready. Because these handlers are so vital, jQuery provides a very short mechanism for creating them — simply call the `$()` function with a callback as the only argument.

Handlers can be added to elements for any event using jQuery’s `.on()` function. This takes two arguments: the event’s name and the callback to execute when the event fires.

JQuery’s API promises that the native JavaScript DOM object representing the source of the event (for example, the thing that was clicked on for a click event) will be available within the callback as the special `this` variable. We can upgrade that native DOM object to a jQuery object with `$(this)`.

As well as allowing listeners to be attached to events, jQuery’s `.trigger()` function allows events to be triggered.

JQuery also provides convenient shortcuts for commonly used event handlers like `click` — `.click()` with no arguments is equivalent to `.trigger('click')`, and `.click(callback)` is equivalent to `.on('click', callback)`.

## Function Chaining

Function chaining is a very important JavaScript concept to master. It’s useful in general, but it’s especially useful when working with APIs that are designed around the concept, like jQuery.

Remember that we can think of functions as black boxes that accept zero or more inputs and can produce an output.

Also remember that, when evaluating a line of JavaScript code, the interpreter executes function calls and effectively replaces the function call with the value returned by the call.

For example, consider the following line:

```javascript
const x = Math.round(Math.PI);
```

The JavaScript interpreter can’t assign a value to `x` without first figuring out what it is. It must first execute the function; only then can it do the assignment. That means the compile effectively executes this single line in two steps:

```javascript
// step 1:
const x = Math.round(Math.PI);
// ⬇️
const x = 3;

// step 2: x is actually assigned the value 3
```

If a single line contains multiple function calls, the interpreter has to take even more steps to process it. Consider the following slightly more complex example:

```javascript
const x = Math.round(Math.random() * 100);
```

Not only can the interpreter not assign `x` immediately; it can’t even execute `Math.round()` immediately because it doesn’t know what argument to pass it. That means the interpreter needs three steps for this line:

```javascript
// step 1:
const x = Math.round(Math.random() * 100);
// ⬇️
const x = Math.round(32.30366039859645);

// step 2:
const x = Math.round(32.30366039859645);
// ⬇️
const x = 32;

// step 3: x is actually assigned the value 32
```

In the special case where a function call returns an object, another function can be called on the returned object by appending a call that second function using the dot operator. This technique is known as _function chaining_.

That sounds complicated, but you’ll recognise a function chain because it will take the form: `functName1().functionName2()`.

Note that you can chain as many function calls as you like. You can just keep repeating this pattern _ad infinitum_. Note that if at any point in the chain, a function returns something other than an object, the chain will break with a JavaScript error!

For example, the following chain will throw an error because `Math.random()` returns a number, not an object:

```javascript
const x = Math.random().round();
```

Some APIs are written with the intent of facilitating function chaining by returning objects whenever possible. Often, the returned value is a reference to the original object the function was called on. JQuery is an example of such an API.

### Function Chaining in jQuery

What does the following snippet do?

```javascript
$('p.lead').removeClass('lead').addClass('alert alert-info')
```

The JavaScript interpreter has to start at the start of the chain and start evaluating each function call in turn; so the first thing to be evaluated is `$('p.lead')`. This returns a jQuery object representing every paragraph with class `lead` in the document (there will be one when you do this on the sample solution — copy-and-paste into the console to see for yourself).

That means that `.removeClass()` will be called on the jQuery object produced by the dollar Function. The next question then is: what does the `.removeClass()` function return?

In order to facilitate function chaining, all the jQuery functions that don’t have a purpose that requires them to return something else return references to the original jQuery object they were invoked on. In effect they simply pass the jQuery object through. So, the output of `.removeClass()` is the same jQuery object returned by the `$()` function.

Technically this is documented in the jQuery documentation, but it could be a lot clearer IMO. The key is the small annotation _‘Returns: jQuery’_ in the right of the banner at [the top of the docs for `.removeClass()`](https://api.jquery.com/removeClass/#removeClass-className). It’s also true that, when a function returns something other than a jQuery object, the description will generally say so.

That means `.addClass()` is called on the same jQuery object returned by the `$()` function. We could continue this chain because the `.addClass()` function also simply passes the jQuery object through.

The effect of this function chain is to find the lead paragraph, remove the `.lead` class and add the `.alert` and `.alert-info` classes, converting it from a lead paragraph to a Bootstrap alert.

Another very common use of function chaining in jQuery is the addition and invocation of event handlers. It’s very common to want to add a handler and then immediately invoke it to get the UI initialised.

You can see an example of this construct in the sample solution. Within the document ready event handler, an input handler is added to each of the toggles for the currency rates. To make sure the visual rendering of each toggle is correct, the handler needs to be called on each toggle. This is done in the following way:

```javascript
// add event handlers to all the toggles and trigger them to get the
// inital rendering right
$('input[type="checkbox"]', $showHideRatesForm).on('input', function(){
  // …
}).trigger('input');
```

Note that functions designed to be chained don’t have to pass the object they were called on through; they can return a different object. jQuery provides a number of functions for filtering jQuery objects. A great example is .first(). This returns a new jQuery object representing only the first element of the jQuery object it was called on.

You can see an example of this in the following line from the document ready handler in the sample solution:

```javascript
// select the first currency in the list
$('select option', $newCurrencyForm).first().prop('selected', true);
```

The `$()` function creates a jQuery object representing every `<option>` inside a `<select >` within the form for adding new currency cards. The `.first()` function returns a new jQuery object representing just the first `<option>`. So `.prop('selected', true)` is only called on the first option, not all the options.

## Data Attributes

As well as representing the visual elements of a page, and allowing JavaScript to alter them, the DOM also allows arbitrary pieces of named data to be added into elements. These are known as _data attributes_. From an HTML point of view they can be added to any tag by prefixing the name of your choice with `data-`. So, to add a data attribute named `boogers` to a paragraph, you could mark it up like so:

```html
<p data-boogers="some value">A random paragraph!</p>
```

jQuery’s `.data()` function can be used to read and write data attributes. To read the current value of an attribute, the name, without the `data-` prefix, is passed as the only argument. To set the value, call `.data()` with the name as the first argument and the new value as the second.

Because data attributes are attributes, they can also be used in conjunction with the CSS attribute selector. While it can be useful to style elements differently depending on data attributes, the CSS selector is more useful when used with the jQuery `$()` function.

In the sample solution, the Bootstrap grid column for each currency card is given the CSS class `.currencyCol` and the 3-letter ISO code for the currency the card will represent is added in a data attribute named `currency`. This is the relevant line from the Bootstrap template used to generate the columns:

<!-- {% raw %} -->
```html
<div data-currency="{{{base.code}}}" class="currencyCol col-12 col-md-6 col-xl-4">
```
<!-- {% endraw %} -->

Similarly, the list item for each rate within each card is given the CSS class `.currencyRate` and a data attribute named `currency`:

<!-- {% raw %} -->
```html
<li class="list-group-item currencyRate" data-currency="{{{code}}}">
```
<!-- {% endraw %} -->

These data attributes make it possible to easily get references to the cards and rates for any currency via jQuery. You can see this in action via the JavaScript console.

To get all cards and rates for the Euro, enter the following:

```javascript
$('[data-currency="EUR"]')
```

This is too broad a brush to be useful, but we can combine this attribute selector with a class selector to narrow our focus. The following will highlight the Euro card by making the text of all list items within it blue:

```javascript
$('.currencyCol[data-currency="EUR"] li').addClass('text-primary')
```

Similarly, we can make the text for every British pound rate in each card bold and red by entering:

```javascript
$('.currencyRate[data-currency="GBP"]').addClass('font-weight-bold text-danger')
```

The sample solution uses CSS attribute selectors for data attributes within calls to the jQuery `$()` function to show and hide both entire cards and rates within the cards as the user interacts with the app. The sample solution also uses data attributes named `loading` and `loaded` to mark the status of currency cards so it knows how to respond when asked to show a card.

The following snippet from the start of the function to show a currency card (`showCurrencyCard()`) demonstrates the use of both the CSS attribute selector and jQuery’s `.data()` function:

```html
// get the col for the currency
const $curCol = $(`.currencyCol[data-currency='${curCode}']`);

// if the card has already been loaded, just show it and exit
if($curCol.data('loaded')){
  console.debug(`card for '${curCode}' already loaded, so just showing it`);

  // show the col
  $curCol.show();

  // focus the card
  $curCol.children('.card').focus();

  // update the select in the add card form
  updateAddCardSelectOptions();

  // end the function
  return;
}
```

## A Challenge

Using your own solution to the previous challenge or my sample solution as your starting point, add appropriate UI to each card to allow an arbitrary amount in the base currency to be converted to each of the currencies displayed within the card. The user should be able to set a different amount on each card.

## Final Thoughts

We’ve now covered the majority of the proverbial hats objects have to wear in JavaScript. In the next instalment we’ll look at two relatively simple hats: strings and regular expressions. That will then set us up for the final, but biggest, hat of all — prototypes/classes and instance objects.

 - [← PBS 87 — JavaScript Iterators Objects & Generator Functions](pbs87)
 - [Index](index)
 - [PBS 89 — Currency Converter Challenge →](pbs89)