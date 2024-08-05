# PBS 36 of X – More HTML Text Input | More Cellular Automata

In [the previous instalment](https://pbs.bartificer.net/pbs35) we took a first look at text input in HTML, and we made a start on a new project – building a set of JavaScript prototypes for creating [cellular automata](https://en.wikipedia.org/wiki/Cellular_automaton) so we can implement [Conway’s Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). In this instalment we’ll continue down both of those paths. Later in the project the two paths will finally merge when we use web forms to build a UI around our game of life.

We’ll start on the HTML track where we move on from generic text input with single- and multi-line basic text boxes to some more specific types of text input, including some nice new input types that HTML 5 brought to the table. This will set us up to learn about HTML 5 form validation in the next instalment.

When we switch to the JavaScript track we’ll start by having a quick look at my sample solution to the previous instalment. Then, we’ll make a start on a JavaScript prototype to represent a Cellular Automaton together, which will set up the next assignment.

I’ve zipped up my solution to the previous assignment, a sample file that accompanies this instalment, and the starting point for the next assignment which you can [download here](https://www.bartbusschots.ie/s/wp-content/uploads/2017/06/pbs36.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs36.zip).

## Matching Podcast Episode 492

Listen Along: Chit Chat Across the Pond Episode 492

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_06_25.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_06_25.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## More HTML Text Inputs

In this series we’ve already seen the `<input>` tag used to create three distinct form inputs, depending on the value specified for the `type` attribute. We used the `<input>` tags with `type="checkbox"` to create checkboxes, with `type="radio"` to create radio buttons within radio sets, and `type="text"` to create a basic single-line text box. It turns out we’ve only just scraped the surface. The `<input>` tag is very versatile indeed, and can be used to create even more different form elements.

We’ll start with some inputs that have been around for a long time, and then move on to some cool new input types brought to the party by HTML 5. In theory HTML 5 should have brought even more cool input types along, but alas, browser support remains extremely patchy. Hopefully things will improve quickly, and we’ll have proper browser support for things like colour and date pickers, both of which are defined within the HTML 5 spec. Just for the record, Apple in particular are behind on their HTML 5 implementation in Safari – Chrome and Firefox are both ahead, as is Microsoft’s new Edge browser.

Just to note that all of the input types we’ll discuss today can be interacted with via JavaScript in the same way as the regular text inputs we looked at in the previous instalment. That’s to say, you can get and set the value with jQuery’s `.val()` function, and get and set the value for any of the other attributes with jQuery’s `.attr()` function.

### Invisible Inputs

Probably the most confusing input type is `hidden`, which does exactly what it sounds like it does – create a completely invisible form element! Despite the fact that you can’t see them, inputs with `type="hidden"` exist within the form, and will be submitted as part of the form data. These sound useless, but are actually very useful, and have a long history of being very useful.

In the early days of the web when forms were only used to send data to servers, hidden inputs provided a way of retaining state between page loads on browsers that were too primitive to support cookies, or where users had to disable cookies. You can’t have a multi-page form without state being retained in some way, so hidden form inputs served a very important function on the early web.

In our modern JavaScript world, hidden form fields are used differently, but are no less useful. They provide a nice mechanism for bridging the gap between fancy JavaScript-powered custom user interface elements and web forms.

To practice our JavaScript, HTML, and CSS, let’s create a star rating UI back-ended by a hidden form input as a worked example. To make things simple, we’ll use Font Awesome glyph icons for our star graphics (specifically `fa-star-o` for an inactive star, and `fa-star` for an active star).

First, we’ll need some HTML to represent each of the 5 stars, and we’ll need a hidden input to hold number of stars the user selects. We’ll need to interact with these elements using CSS and JavaScript, so we need to give them IDs. Also, since each star will represent a specific star rating, we should store the value a specific icon represents within the icon itself using a data attribute (we looked at data attributes in [instalment 26](https://pbs.bartificer.net/pbs26)). Here’s some HTML that meets our requirements:

```html
<label id="stars_label">Rate this form:</label>
<span id="stars_ui">
    <span class="fa fa-star-o" id="stars_1" data-stars="1" title="1 star"></span>
    <span class="fa fa-star-o" id="stars_2" data-stars="2" title="2 stars"></span>
    <span class="fa fa-star-o" id="stars_3" data-stars="3" title="3 stars"></span>
    <span class="fa fa-star-o" id="stars_4" data-stars="4" title="4 stars"></span>
    <span class="fa fa-star-o" id="stars_5" data-stars="5" title="5 stars"></span>
</span>
<input type="hidden" name="stars" id="stars_input" />
```

We also need to style this a little so it behaves as expected in the browser – we need to make sure that, should our star rating UI end up at a line break, all five stars break together, and we would like the mouse to change to a pointer when you hover over any of the stars. We can achieve that with the following CSS:

```css
/* style the star rating UI */
#stars_ui{
    display: inline-block; /* keep the stars together on line breaks */
}
#stars_ui span{
    cursor: pointer; /* make the mouse turn to a pointer over the stars */
}
```

Our inputs now look correct to sighted users, but what about those who rely on accessibility technologies? We need to add some ARIA roles and attributes to make our custom UI accessible. In terms of usage, a star rating is basically a radio group, so we’ll use the ARIA roles for radio groups. With the ARIA details added, our HTML now looks like this:

```html
<label id="stars_label">Rate this form:</label>
<span id="stars_ui" role="radiogroup" aria-labelledby="stars_label">
    <span class="fa fa-star-o" id="stars_1" data-stars="1" title="1 star" role="radio" aria-checked="false" aria-label="1"></span>
    <span class="fa fa-star-o" id="stars_2" data-stars="2" title="2 stars" role="radio" aria-checked="false" aria-label="2"></span>
    <span class="fa fa-star-o" id="stars_3" data-stars="3" title="3 stars" role="radio" aria-checked="false" aria-label="3"></span>
    <span class="fa fa-star-o" id="stars_4" data-stars="4" title="4 stars" role="radio" aria-checked="false" aria-label="4"></span>
    <span class="fa fa-star-o" id="stars_5" data-stars="5" title="5 stars" role="radio" aria-checked="false" aria-label="5"></span>
</span>
<input type="hidden" name="stars" id="stars_input" />
```

You’ll notice that I’ve given the `<span>` that contains all five of the stars the ARIA role `radiogroup`, and specified which text label describes that radio group using the `aria-labelledby` attribute. When it comes to each of the five stars themselves, they’ve all had the ARIA role `radio` added, and been marked as unchecked with the `aria-checked` attribute. Finally, each star has had an ARIA label added with the `aria-label` attribute so screen readers know how many stars each span represents. Note that until now we have been using glyph icons as decorations, so we have given them the ARIA attribute `aria-hidden="true"` to hide them from screen readers, but we have explicitly not done that here.

At this point we have a UI that looks right, but it does absolutely nothing! To make it go, we need to add some JavaScript. Specifically, we need to add a click handler to each of the five stars. To do that, we use jQuery’s `.click()` function. Remember that you can’t add click handlers to elements until the document is ready, so we need to add our handlers within a document ready handler:

```javascript
// document ready event handler
$(function(){
    // add a click handler to the stars UI
    $('span', $('#stars_ui')).click(function(){
        // read the rating from the data attribute
        var starRating = $(this).data('stars');

        // render each star as appropriate
        for(var s = 1; s <= 5; s++){
            var $star = $('#stars_' + s);

            // render the star as full or outline as appropriate
            if(s <= starRating){
                $star.removeClass('fa-star-o').addClass('fa-star');
            }else{
                $star.removeClass('fa-star').addClass('fa-star-o');
            }

            // mark the star as checked for ARIA as appropriate
            if(s == starRating){
                $star.attr('aria-checked', true);
            }else{
                $star.attr('aria-checked', false);
            }
        }

        // save the rating into the hidden form input
        $('#stars_input').val(starRating);
    });
});
```

Remember that with jQuery event handlers, the native DOM object representing the element that was clicked is used as the special `this` value within the callback. To upgrade that native DOM object to a jQuery object we pass it to the `$`. You can see this happen on line 6 above.

Again, as a reminder, the `.data()` function is used to access data attributes, but without the `-data` prefix that has to be used within HTML tags. This means that the HTML data attribute `data-stars="1"` is accessed with `.data(‘stars’)` via JavaScript. You can also see this happen on line 6.

So, on line six we read the star rating that matches the clicked star and save it into the variable `starRating`.

Next, we loop through all five possible star ratings and update the CSS classes and aria attributes of each matching icon appropriately. If the star is less than or equal to the rating it should be filled in; otherwise it should be an outline. If the star is exactly equal to the rating, it should be marked as checked for screen readers, otherwise, it should be marked as unchecked. The loop to make both of these changes runs from lines 8 to 25. Notice that we use `.addClass()` and `.removeClass()` to set the needed CSS classes, and `.attr()` to set the value of the ARIA checked attribute.

You can see this finished UI in action and in context in the file `pbs36.html` in this instalment’s ZIP file.

### Obscured Inputs, AKA Password Boxes

Sometimes you don’t want to completely hide input, but you do want to obscure it – you’d like the user to be able to type in some text, and see that their text is being received, but not show the text so that people looking over the user’s shoulder can’t see the information being entered. In our modern world we see boxes like this many times every day. They are used for password entry on just about every login page on the web.

These kinds of inputs are very easy to create, simply use an `<input>` tag with `type="password"`. You can see one in action in the sample file `pbs36.html` in the instalment’s ZIP file.

### Inputting Numbers Precisely

Now let’s move on to some of the useful new text input types provided by HTML 5. Firstly, let's look at inputting numbers.

Just note that all the data types from here on out support HTML 5 form validation. We will be looking at how that works in the next instalment, but not until then.

The most generic form of number input is provided by using the `<input>` tag with `type="number"`. This input type is designed to allow any number to be entered, whole or decimal, and positive or negative (though decimal numbers aren’t allowed by default). When rendered on screen, up and down arrows are usually added to one of the sides of the input box, allowing users to easily increase and decrease the entered value. Mobile browsers should present a number pad instead of a regular text keyboard when you tap on an input with a `type` of `number`.

This input type supports a number of extra attributes to control its behaviour.

The `step` attribute is critical – it controls how far the number jumps up and down when you click on the arrows, and how many decimal places are permitted in the entered values. Whatever number of decimal places you use in the value for the `step` attribute, that’s the number of decimal places that will be permitted in the values entered by the user. The default value for `step` is `1`, so by default, each time you click the up or down button the value jumps by one, and no decimal places are allowed. To have the input jump by 5 and still not allow decimals, you would use `step="5"`. However, you can get more creative and allow a single decimal place, but still step by 1, with `step="1.0"`.

As well as controlling the step, you can also specify minimum and maximum permitted values with the `min` and `max` attributes

Other than these extra behaviours, number inputs behave like regular text inputs, allowing things like placeholder text and so on. Below is a sample number input that allows values between zero and 5 to one decimal place, and where clicking the arrows moves the value by a half:

```html
<input type="number" name="out_of_5" placeholder="out of 5" min="0" max="0" step="0.5" />
```

Again, you can see some examples of inputs of this type in `pbs36.html`.

### Inputting Approximate Numbers

If you don’t want an exact number from a user, but simply an approximate value within a given range, you can use the `<input>` tag with `type="range"`. Like `type="number"`, `type="range"` supports the `min`, `max`, and `step` attributes, but it doesn’t present the user with a text box – instead, it presents the user with a horizontal slider. The left edge of the slider represents the `min` value, and the right edge the `max` value.  The positions in-between that the slider snaps to are determined by the `step`. Note that, if you don’t want the slider to snap to any specific values, you can set `step="any"`. The default values are `min="0"`, `max="100"`, and `step="1"`.

As you’ve probably guessed by now, you’ll find an example of this input type in `pbs36.html`.

### URLs, Email Addresses & Telephone Numbers

You can tell browsers that you expect a URL, email address, or telephone number by using an `<input>` tag with `type="url"`, `type="email"`, or `type="tel"`. Visually, these will just look like normal text boxes, but mobile browsers can present appropriate custom keyboards to make input easier for users. As we’ll learn in the next instalment, using these specialised input types has implications for form validation.

And yet again, there are examples of all three of these input types in `pbs36.html`.

## Back to our Game of Life Project

Let’s switch track now back to our new JavaSript project – creating a collection of JavaScript prototypes to represent a Cellular Automata so we can implement Conway’s Game of Life.

The assignment set during the previous instalment kicked this project off. The assignment was to write the prototype `bartificer.ca.Cell` which will be used to represent each cell within our cellular automata. The inputs for this assignment were the developer documentation for the prototype and a QUnit test suite to validate your code against. You’ll find my sample solution in the folder `pbs35-challenge-sollution` in this instalment’s ZIP file.

We’ll now use my sample solution as a starting point to move the project forward. At this point we have a prototype that represents a single cell within an automaton. Each cell object contains a jQuery object representing the table data cell that represents the cell on the page, the cell’s x coordinate within the automaton, the cell’s y coordinate within the automaton, a current state, and a next state. It also provides functions for setting the next state, and moving the cell forward from the current state to the next state.

The next logical step is to build a prototype to represent an automaton as a whole – we’ll name it `bartificer.ca.Automaton`.

The approach we’ll take is to expect the user of the API to specify an HTML element which the constructor will then transform into a cellular automaton. The constructor will empty the given container and inject an HTML table into it. The injected table will contain a table data cell for each cell within the automaton.

Given this design, each automaton object will need to contain a reference to the container holding it, a reference to the generated table, a two-dimensional array of `bartificer.ca.Cell` objects, a reference to a function for calculating the next state of a cell given its current state and the state of its neighbours, and a reference to a function for styling a table data cell to reflect the state of its matching cell within the automaton. For convenience, it also makes sense to store the number of rows and columns within the automaton.

If we ignore input validation (for now), that gives us the following initial implementation of the constructor:

```javascript
bartificer.ca.Automaton = function($container, rows, cols, stepFn, renderFn, s){
    var x, y; // variables to be used in loops throughout this function

    // initialise the container
    $container.empty().addClass('bartificer-ca-container').data('bartificerObject', this);

    // save the passed properties
    this._$container = $container;
    this._rows = parseInt(rows); // force to number
    this._cols = parseInt(cols); // force to number
    this._stepFn = stepFn;
    this._renderFn = renderFn;

    // initialise the grid and table
    this._grid = [];
    for(x = 0; x < this._cols; x++){
        this._grid[x] = [];
    }

    this._$table = $('<table></table>').addClass('bartificer-ca-automaton');
    this._$table.data('bartificerObject', this);

    // actually build the table and grid together
    var $tbody = $('<tbody></tbody>');
    for(y = 0; y < this._rows; y++){
        var $row = $('<tr></tr>');
        for(x = 0; x < this._cols; x++){
            var $td = $('<td></td>');
            var initState = undefined;
            if(typeof s !== 'undefined'){
                if($.isArray(s) && s[x] && isCellState(s[x][y])){
                    initState = s[x][y];
                }else if(typeof s === 'function'){
                    initState = s(x, y);
                }else if(isCellState(s)){
                    initState = s;
                }
            }
            this._grid[x][y] = new bartificer.ca.Cell($td, x, y, initState);
            this._renderFn($td, this._grid[x][y].state());
            $row.append($td);
        }
        $tbody.append($row); // add the row into the table body
    }

    // inject the table into the DOM
    this._$table.append($tbody); // add the table body into the table
    this._$container.append(this._$table); // add the table into the container
};
```

Notice the use of jQuery’s `$` function with HTML tags as strings to create the table and its various components, and the use of jQuery’s `.append()` function to inject the various elements into each other, and ultimately, into the DOM.

Also notice the use of jQuery’s `.data()` function to tie the HTML elements and the JavaScript objects together. This makes it possible to access the `bartificer.ca.Automaton` object representing a cellular automaton from a jQuery object representing the table or container representing the automaton within the DOM. For example, if we instantiated a cellular automaton within a `<div>` with the ID `conway_life`, we could access the associated `barticer.ca.Automaton` object via the HTML element as follows:

```javascript
$('#conway_life').data('bartificerObject')
```

Finally, notice that we use jQuery’s `.class()` function to add some CSS classes to aid with styling of our automata in the future.

As stated previously, the above code is a naive first draft that doesn’t contain any JSDoc comments, input validation, or accessor functions. You’ll find a full implementation of the prototype in the file `pbs36-challenge-startingPoint/lib/bartificer.ca.js` in this instalment’s ZIP file.

Now that we have our basic prototypes completed, how do we use them to instantiate an actual cellular automaton within an actual web page?

Let’s build a little sample page to do just that, and rather unimaginatively, I’m going to name it `sample.html`.

We’ll start with a basic HTML 5 template that imports jQuery from the official jQuery CDN, and then imports our cellular automaton prototypes:

```html
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
    <title>bartificer.ca.Automaton Demo</title>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="./lib/bartificer.ca.js"></script>
</head>
<body>
</body>
</html>
```

We should add a title and a container to the body:

```html
<body>
<header><h1>A Sample Cellular Automaton</h1></header>
<main></main>
</body>
</html>
```

We’ll use the `<main>` element as the container into which we’ll inject our automaton.

Let’s now add the JavaScript code to actually create a `bartificer.ca.Automaton` object. We do that by adding a `<script>` tag into the `head` section of the page. Within that we’ll need to write a document ready event handler. As a reminder, you do that by passing jQuery’s `$` function a callback as the first argument:

```html
<script type="text/javascript">
    $(function(){
        // code that runs when the document becomes ready goes here
    });
</script>
```

So what do we want inside that script tag?

We should add a variable to the global scope to hold our automaton object. Let’s name it `sampleCA`. Then we need to call the `bartificer.ca.Automaton` constructor within the document ready event handler to actually build the automaton. To do that we’re going to have to figure out what arguments to give to the constructor.

First, we need a jQuery representing the container into which the automaton should be injected. We’ll use the one `<main>` element on the page, so we can just use `$('main')`.

Next, we’ll need the number of rows and columns – let’s use 10 for each.

Then, we’ll need a callback used for calculating the next state of any cell given its current state and the state of all its neighbours. Since this is a really naive first automaton, let’s use a really simple function, one that always returns `true`, so `function(){ return true; }`.

Next, we need a function for styling a given cell according to its current state. Again, we’ll use a very naive function, one that always colours the cell green: `function($td){ $td.css('background-color', 'Green') }`.

Finally, we can optionally specify an initial state for each cell in the automaton. We’ll simply use `true`.

The last thing we need to do before we can refresh our sample page and see our automaton is to add some CSS to make the empty table cells that represent the cells in our automaton big enough to see – they contain no content, so without some CSS, they’d just be a few pixels each on the screen. Because our prototypes injected classes into the HTML elements they generated, the CSS can be very straightforward. We just need to add the following into the `head` section of the page:

```html
<style type="text/css">
    td.bartificer-ca-cell{
        width: 10px;
        height: 10px;
    }
</style>
```

Putting it all together, and adding some comments, we get the following HTML page:

```html
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
    <title>bartificer.ca.Automaton Demo</title>

    <!-- Load jQuery 3 from the official CDN -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>

    <!-- load the bartificer.ca API -->
    <script type="text/javascript" src="./lib/bartificer.ca.js"></script>

    <!-- Add the JavaScript code to initialise a Cellular Automaton -->
    <script type="text/javascript">
        // a globally scoped variable to hold the automaton object
        var sampleCA;

        // add a document ready event handler
        $(function(){
            // use the constructor to build an automaton
            sampleCA = new bartificer.ca.Automaton(
                $('main'), // use the main tag as the container
                10, 10, // make it a 10x10 grid
                function(){ return true; }, // always set the state to true
                function($td){ $td.css('background-color', 'Green') }, // always render as green
                true // set the initial state of all cells to true
            );

            // log the geneated automaton object so we can have a look inside
            // it look at it with the JavaScript console if we want
            console.log(sampleCA);
        });
    </script>

    <!-- Stype the Automaton -->
    <style type="text/css">
        /* style the cells in the automaton */
        td.bartificer-ca-cell{
            width: 10px;
            height: 10px;
        }
    </style>
</head>
<body>
<header><h1>A Sample Cellular Automaton</h1></header>
<main></main>
</body>
</html>
```

Now – it must be noted that while our prototypes are advanced enough to allow us to build cellular automata that exist both as JavaScript objects and as visible elements within web pages, those automata don’t actually do anything yet! In the next instalment we’ll add the functions needed to allow our automata to actually run.

### A Challenge

Last time, I gave you the developer docs and a test suite as a starting point and asked you to build a prototype. This time, I’m going to do the opposite – give you the code and the developer docs, and ask you to write a test suite for the `bartificer.ca.Automaton` prototype. You’ll find the code and the docs in the folder named `pbs36-challenge-startingPoint` this instalment’s ZIP file.

## Final Thoughts

We’ve now been introduced to all the basic HTML form elements – checkboxes, radio buttons, selects, single-line text inputs of various forms, multi-line text boxes, and hidden form inputs. In the next instalment we’ll learn about a very useful new HTML 5 feature – form validation.

Our Cellular Automaton prototypes are also progressing nicely, we’ve gotten to the stage where we can actually make an automaton appear on a web page. Our next task is to make our automata run, to have them move forward step-by-step and recalculate and rerender the state of each cell as they do. That’s what we’ll be doing in the next instalment.

Adding a UI around our cellular automata will allow us to unite our two concurrent tracks – web forms and JavaScript APIs. We’ll finally bring the three client-side web technologies – HTML, CSS & JavaScript together into a single web app.

 - [← PBS 35 — HTML Text Input \| Introducing ‘Life’](pbs35)
 - [Index](index)
 - [PBS 37 — JSDoc Demo →](pbs37)
