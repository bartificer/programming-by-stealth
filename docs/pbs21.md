# PBS 21 of X – jQuery Basics

In the [previous instalment](https://www.bartbusschots.ie/s/2016/09/01/pbs-20-js-in-the-browser/) we took our first tentative steps into the browser. We learned about the Javascript console, the concept of the Document Object Model, or DOM, and we introduced the jQuery library.

Our initial introduction to jQuery was very superficial, now, it’s time to dive in deeper, and get much more rigorous in our understanding. We’ll look at how to use jQuery to select specific HTML elements on the page, and then, how to manipulate their styling, and their HTML attributes.

For this instalment we’ll still be using the Javascript console on the [PBS dummy page](https://www.bartbusschots.ie/pbsdemos/pbs-dummyPage/). From the next instalment on, we’ll be embedding our JavaScript directly into our web pages, so this will be the last time we use the dummy page.

# Matching Postcast Episode 455

Listen Along: Chit Chat Accross the Pond Episode 455

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_09_16.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_09_16.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Some Quick Revision

Before moving into jQuery proper, let’s take a moment to refresh our memory of some HTML and CSS basics, and let’s take the time to define some terminology.

### HTML Tags, Elements & Attributes

Let’s take a look at a very simple HTML snippet:

```XHTML
<p>Here is a photo: <img src="myImage.jpeg" alt="A Photo" /></p>
```

The paragraph is defined by two HTML tags, an opening tag (`<p>`), and a matching closing tag (`</p>`);. The entire code snippet represents an HTML paragraph element – that is to say, the opening tag, the content, and the closing tag together define an HTML element.

The image is also an HTML element, but it’s defined by a single self-closing `img` tag.

The image element has two attributes – `src`, and `alt`.

The image element can be said to be contained within the paragraph element. We can also say that the paragraph is the image’s parent element, and the image is a child element of the paragraph.

Given the following more complex HTML snippet:

```XHTML
<section id="my_section">
  <p>Below is a very boring list:</p>
  <ul>
    <li>A Boring item</li>
    <li>Another boring item</li>
  </ul>
</section>
```

All the following statements are true:

*   The `li` elements are all contained within the `ul` element
*   The `li` elements are all contained within the `section` element
*   The `li` elements are all directly contained within the `ul` element
*   The `li` elements are NOT directly contained within the `section` element
*   The `li` elements are all children of the `ul` element
*   The `ul` element is the parent of all the `li` elements
*   The `li` elements are siblings elements within the `ul` element
*   The `p` and `ul` elements are siblings within the `section` element

### CSS Selectors

JQuery makes heavy use of CSS-style selectors, so let’s remind ourselves of what CSS selectors are, and what they do.

Consider the following CSS snippet:

```CSS
li{
  color: red;
}
```

In the above CSS, the selector is `li`. This is a very simple selector, specifying that the CSS declarations within the curly braces should be applied to all `li` elements on the page.

The job of a CSS selector is to specify a set of HTML elements.

A single tag name is a very simplistic selector, as we learned in previous instalments, selectors get more complicated than that – here is a very quick refresher:

`h1, h2`

Selects all `h1` and all `h2`, because the comma is used to create a super-set out of multiple selectors

`section p`

Selects all `p` elements that are contained within a `section` element.

`section > p`

Selects all `p` elements that are directly contained within a `section` element, i.e. `p` elements with a `section` element as their parent.

`.someClass`

Selects all elements that have the class `someClass`

`#someID`

Selects all elements that have the ID `someID`

`:first-child`

Selects all elements that meet the criteria for the pseudo-class `first-child` (i.e. are the first child element within their parent element) – note that there are many pseudo classes, this is just one example

Selectors are designed to be combined, so you can do things like this:

`p.someClass`

Select all `p` elements with the class `someClass`

`section#someID li`

Select all `li` elements contained within the `section` element with the ID `someID`

`section#someID > ul.someClass.someOtherClass`

Selects all `ul` elements with both the classes `someClass` and `someOtherClass` directly contained within the `section` element with the ID `someID`

## Selecting Elements with jQuery

JQuery is built around the concept of selecting HTML elements, and either extracting information from them, or, altering them in some way. The selection is achieved through the use of CSS selectors.

When you call the `$` function with a string containing a CSS selector as the first argument, jQuery does the following:

1.  Creates a new object with the `jQuery` prototype. This is an array-like object designed to store zero or more objects representing individual HTML elements.
2.  jQuery then searches the DOM for HTML elements matching the given selector. An object is created for each matching element, and added to the array-like jQuery object
3.  When the search is complete, and all matching elements have been saved into the array-like jQuery object, and that object is then returned

The array-like jQuery object has the `jQuery` prototype, so it provides a large array of functions for extracting information from the elements, or, altering the elements in some way. We’ll work our way through the most important of these functions over the next few instalments, but you’ll find [full documentation on the jQuery website](http://api.jquery.com).

All jQuery objects have a `length` property which tells you how many HTML elements they represent.

So see how many `p` elements there are in our dummy page, run the following in the console:

```JavaScript
$('p').length
```

When evaluating something containing dots, Javascript starts at the left, and evaluates what ever it finds before the first `.` before even looking at what comes after the dot. Once the left-most part of the expression has been evaluated, Javascript tries to process what ever comes after the dot. It keeps work from left to right until a final value is arrived at.

In this case, that means the first thing JavaScript does is evaluate $(‘p’), which is a call to the `$` function with a string containing a CSS selector as the first and only argument. This will return a jQuery object representing a list of all `p` elements on the page. JavaScript will then get the `length` property of that object.

Understanding this left-to-right evaluation of dotted expressions is vital to using jQuery efficiently.

### Limiting the search

By default, the `$` function searches the entire document for elements matching the selector, but we can narrow down the search by passing a jQuery object as a second argument. When a second argument is passed, the search is confined to the contents of the elements specified by that object.

As an example, if we search our entire dummy page for `h1` elements (`$('h1').length`), we get 7. One of those seven is in the header, so we could get only `h1` elements within sections by limiting our search to just the `section` elements:

```JavaScript
$('h1', $('section')).length
```

### Filtering the Results

Limiting our search with a second argument can be useful, but sometimes you need to apply more powerful filters. jQuery provides a mechanism for this, the `.filter()` function. The filter function returns a new jQuery object representing only the elements that match the filter. The `.filter()` function expects one argument, a reference to a JavaScript function, AKA a callback.

The filter function works as follows:

1.  It creates a new jQuery object representing no elements
2.  The callback is called once for every element represented by the object being filtered, if the function returns a truthy value, the element is added to the new jQuery object. When the callback is called, the value of the special variable `this` will be set to the DOM object representing the element being tested.
3.  When all elements in the original jQuery object have been tested, the new jQuery object is returned.

Note that within the callback, the `this` variable is set to the browser’s native DOM object representing the element, not to a jQuery object. This means you cannot perform jQuery functions on the object as-is. If you want to convert the native DOM object to a jQuery object, simply pass it as the only argument to the `$` function, i.e. `$(this)`.

This all sounds more complicated than it is. Let’s work through a simple example to illustrate the technique. What we’ll do is write some code to select all paragraphs, then filter them down to just the paragraphs that contain currency amounts, and then turn those paragraphs red:

```JavaScript
$('p').filter(function(){return $(this).text().match(/[$£€]\d+/);}).css('color', 'red');
```

In order to work in the console we need this command on one line, but to understand what’s going on, let’s split it over multiple lines:

```JavaScript
$('p').filter(function(){
  return $(this).text().match(/[$£€]\d+/);
}).css('color', 'red');
```

Since this is an expression containing dots, we need to start at the left and work our way forward.

The first thing that happens is that $(‘p’) is evaluated – this results in a jQuery object representing all paragraphs in the document. The `.filter()` function is then called on this jQuery object with an anonymous function as the required callback. The callback is called once for every element represented by the jQuery object, i.e., once for every paragraph. A new jQuery object is returned, representing only the paragraphs for which the callback returned a truthy value. Finally, the `.css()` function is called on this new jQuery object, turning all paragraphs that contain currency amounts red.

Now let’s look in detail at the anonymous function – it contains just a single line:

```JavaScript
return $(this).text().match(/[$£€]\d+/);
```

This line also contains a dotted expression, so we need to evaluate it from left to right too. The first thing to evaluate is `$(this)`. JQuery promises that it will ensure that within the callback, the `this` variable will contain a reference to the DOM object to be evaluated. We can convert this DOM object to a jQuery object by passing it to the `$` function, so, the result of evaluating `$(this)` is a new jQuery object representing exactly one html element, the one to be evaluated. We then call jQuery’s `.text()` function on that jQuery object with no arguments, which will return the text within the HTML element as a string. At this point in the evaluation we have a string, so the last thing we do is call the `.match()` function provided by the `String` prototype on that string, passing it a regular expression as an argument. If the string matches the regular expression, a truthy value will be returned, otherwise a falsy one will be returned.

Breaking down the dots from left to right is the only way to understand code like this, and when you use jQuery, you generate a lot of code like this, so you’ll get plenty of practice!

### A convention – Pre-fixing the Names of jQuery Variables with `$`

By convention, many jQuery developers get into the habit of pre-fixing the names of variables that will store references to jQuery objects with a `$` symbol. This acts as a good mnemonic – if the variable name starts with a `$`, you can call jQuery functions on it.

This is not a rule, it’s just a convention. It is a convention I really like though, so you’ll see me follow it throughout this series.

## JQuery and CSS

As the previous example shows, you can alter an element’s CSS properties with jQuery. Lets have a closer look at the relevant jQuery functions.

Firstly, you can read the current value of any CSS property of a given HTML element using jQuery’s `.css()` function. The first argument should be the name of the CSS property who’s value you want to retrieve. For example, you can get the width of the Ajax aside box in the dummy page (the box has the ID `as_ajax`) by entering the following in the console:

```JavaScript
$('aside#as_ajax').css('width');
```

Now re-size the window and run the code again, you’ll see that the value has changed.

To set a given CSS property, call the same function with two arguments, the property name, and the new value. To change the background colour of the Ajax aside box in the dummy page, run the following in the console:

```JavaScript
$('aside#as_ajax').css('background-color', 'beige');
```

Finally, you can use the `.css()` function in a third way to set multiple properties at once. Rather than passing a name and a value, you can pass a plain object containing arbitrarily many name, value pairs. The keys in the plain object should be CSS property names, and the values the new values for those CSS properties.

E.g. to set the text colour, background colour, and border of the Ajax aside box on the dummy page, run the following in the console:

```JavaScript
$('aside#as_ajax').css({'background-color': 'HoneyDew', color: 'Green', border: '1px dashed Green'});
```

For clarity, let’s rewrite that with proper indentation:

```JavaScript
$('aside#as_ajax').css({
  'background-color': 'HoneyDew',
  color: 'Green',
  border: '1px dashed Green'
});
```

Notice that because `background-color` is not a valid JavaScript variable name, we had to quote it when defining the plain object. JQuery provides a mechanism for getting around this by supporting camel-cased aliases for CSS property names that contain dashes, so, we can replace `background-color` with `backgroundColor`, and the code will still work:

```JavaScript
$('aside#as_ajax').css({backgroundColor: 'HoneyDew', color: 'Green', border: '1px dashed Green'});
```

As well as manipulating CSS directly, jQuery can also control the CSS classes applied to an element.

You can check if a given element has a given class with the `.hasClass()` function. For example, we can check if the Ajax aside in the dummy page has the class `important` by running the following in the console:

```JavaScript
$('aside#as_ajax').hasClass('important');
```

We can add one or more classes to an element with the function `.addClass()`. The classes to set should be passed as a space-delimited string, just like you would use within the `class` attribute of an HTML tag. As an example, we can add the class `important` to the Ajax aside box in the dummy page with the following:

```JavaScript
$('aside#as_ajax').addClass('important');
```

If we re-run our command for checking if this box has the class `important`, we’ll see that it now does.

Unsurprisingly, one or more classes can be removed from an HTML element with the `.removeClass()` function, again, the classes are specified as a space-delimited string. We can remove the important class from the Ajax aside box with the following:

```JavaScript
$('aside#as_ajax').removeClass('important');
```

We can also toggle one or more classes with the `.toggleClass()` function. When you toggle a class, it will be added if it does not exist, and removed if it does. Run the following a few times in a row to see toggling in action:

```JavaScript
$('aside#as_ajax').toggleClass('important').hasClass('important');
```

We know that we can hide an HTML element on a page by setting its CSS `display` property to `none`. This means that we could hide and show elements using the `.css()` function. However, jQuery provides us some nice alternatives – `.hide()`, `.show()`, and `.toggle()`. These functions have the advantage of making code easier to read, and, of using a pleasing animation to show and hide the elements. By default these animations take 400 milliseconds, but you can change their duration by passing a number as the first argument. That number will be interpreted as the desired animation length in milliseconds.

To show the animations in all their glory, let’s hide, then show, and finally toggle the Server Side section with a 1 second animation:

```JavaScript
var aniTime = 1000;
var $serverSec = $('section#sec_server');
$serverSec.hide(aniTime);
$serverSec.show(anyTime);
$serverSec.toggle(anyTime);
```

Finally, I want to mention a very useful function for checking if a given HTML element matches any arbitrary CSS selector. The function is simply called `.is()`, accepts a CSS selector string as an argument, and will return `true` if the element it is called on is matches by that selector, and `false` otherwise.

To check if the Ajax aside box has both the classes `important` and `highlighted`, we could test it against the selector `.important.highlighted` like so:

```JavaScript
var $ajax = $('aside#as_ajax'); // an example of the $-prefix naming convention
var importantHighlighted = '.important.highlighted';
$ajax.is(importantHighlighted);
$ajax.addClass('important');
$ajax.is(importantHighlighted);
$ajax.addClass('highlighted');
$ajax.is(importantHighlighted);
```

## JQuery and HTML Element Attributes

As well as altering the style of HTML elements, jQuery can alter their attributes. Remember, attributes are things like `src` and `alt` on images, or `href` and `target` on links.

To read the current value of an attribute, use jQuery’s `.attr()` function with one argument, the name of the attribute you want the value of. For example, we can get the current value of the `href` attribute of the link inside the aside box in the dummy page as follows:

```JavaScript
$('aside a').attr('href');
```

You can alter the value of an attribute by passing jQuery’s `.attr()` function a section argument – the new value for the attribute. To change the link in the aside box so it goes to `http://www.bartb.ie/`, you could use the following:

```JavaScript
$('aside a').attr('href', 'http://www.bartb.ie/');
```

## Manipulating Multiple Elements at Once

jQuery’s functions for manipulating HTML elements are designed to work on multiple elements at once. Let’s say we use a CSS selector and the $ function to create a jQuery object that represents a thousand elements. If we then use the .css() function to set a CSS property to a new value, that property will be updated in all the elements represent by the object, not just one.

When you think about it, that makes sense – because jQuery was designed in this way, it saves you from the tedium of writing similar loops over and over again.

When using jQuery to access a value within an element, things are different. If you use the `.attr()` function to get the value of the `href` property on a jQuery object representing ten links, you will not get back ten values, instead, you will get back the value of the attribute in the first element within the jQuery object.

As a general rule, when it comes to reading values out of HTML elements using jQuery, you should try write your selectors so they select exactly one element.

## Function Chaining in jQuery

Any jQuery function that does not query an element for a specific value will return a reference to the jQuery object it was called on. This allows many jQuery calls to be chained together on a single line.

We can see this in action with code like this:

```JavaScript
$('p').filter(function(){return $(this).text().match(/[$£€]\d+/);}).toggleClass('important').hasClass('important');
```

Because this is a dotted expression, we need to evaluate it from left to right to understand what is going on, so let’s do that.

We start on the left, so the first thing to be evaluated is `$('p')`, which evaluates to a jQuery object representing all paragraphs on the page. `.filter(...)` function is then called on that jQuery object, resulting in a new jQuery object representing only the paragraphs that contain currency amounts. Next, `.toggleClass()` is called on that object, toggling the class on each paragraph that contains a currency amount, and, returning a reference to itself, hence, we evaluate back to the same jQuery object. Finally, we call `.hasClass()` on this jQuery object which will return either `true` or `false`.

## A Challenge

Write a JQuery command to set the `target` of all links in the `main` content region of the dummy page to `_blank`.

## Conclusions

At this stage we’re starting to get a good taster of what jQuery can do – we can select elements, query and manipulate their style, and query and manipulate their attributes. We’re now ready to move our of the web console, and start incorporating our Javascript code directly into our web pages. To do that we’ll also need to learn about browser events, and how jQuery can interact with them.