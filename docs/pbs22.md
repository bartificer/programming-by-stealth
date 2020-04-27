# PBS 22 of X – jQuery Events

In the previous instalments we experimented with jQuery using the web console on our [dummy page](https://www.bartbusschots.ie/pbsdemos/pbs-dummyPage/). In this instalment we’ll learn how to embed JavaScript into web pages, and, how to attach our code so it gets triggered by browser events.

This instalment includes a number of examples. You can copy-and-paste the code out of the page, but for convenience I’ve zipped up all the files and you can [download them here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/09/pbs22.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs22.zip).

# Matching Podcast Episode 457

Listen Along: Chit Chat Accross the Pond Episode 457

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_09_30.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_09_30.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to PBS 21 Challenge

The challenge was simply to write a JQuery command to set the `target` of all links in the main content region of the [dummy page](https://www.bartbusschots.ie/pbsdemos/pbs-dummyPage/) to `_blank`.

There is no one solution to a problem like this, so below are two different correct solutions.

1.  The first approach is to use the CSS containment selector (space) to limit the results to just `a` elements within the `main` element:

    ```JavaScript
    $('main a').attr('target', '_blank')
    ```

2.  The second approach is to use the optional second argument to the `$` function to limit the search to the `main` element:

    ```JavaScript
    $('a', $('main')).attr('target', '_blank')
    ```

## Embedding JavaScript in Web Pages

Back in [instalment 6](https://www.bartbusschots.ie/s/2016/01/08/programming-by-stealth-6-of-x-introducing-css/) we learned that there were two ways to include CSS code in a web page – by linking to an external stylesheet, or, by embedding CSS code directly into the page.

JavaScript can similarly be included into a page in two ways – by linking to an external script, or, by embedding JavaScript directly into a page. Like with CSS, it’s generally preferable to link to an external file – it will provide a much neater separation between your HTML code, your CSS code, and your JavaScript code. However, if you only have a small amount of code to include, the addition of a separate file could be considered over complication. The examples in this instalment embed JavaScript directly into HTML pages for simplicity.

Regardless of whether you’re linking to an external file, or directly embedding your JavaScript, you will be using the `script` tag. The HTML specification was designed to support multiple possible scripting languages into the future. The reality today is that there is only one browser scripting language with cross-browser support, and that’s JavaScript. Because of the possibility of other languages in the future, the `script` tag supports the `type` attribute to specify the language being used. The value for this attribute should be the [MIME Type](https://en.wikipedia.org/wiki/Media_type) for the scripting language, so we will be using `text/javascript`. Today, browsers default to treating `script` tags without a `type` attribute as JavaScript, but I generally prefer to be explicit, so I tend to specify a `type` regardless.

### Linking to an External Script

To link to an external script, use the `src` attribute to specify the URL for the script – it can be a relative or absolute URL. For example, to include the jQuery library, you could add the following to the `head` section of your HTML file:

```XHTML
<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
```

Note that because the `script` tag is not void, it must have a closing tag, even when using the `src` attribute.

### Embedding JavaScript in a Page

When used without an `src` attribute, the `script` tags expects the JavaScript code to be placed between the opening and closing `script` tags:

```XHTML
<script type="text/javascript">

  // your JavaScript code goes here

</script>
```

### Importing JavaScript Code from CDNs

Large open source projects often make their code available for inclusion directly into your page via a so-called _Content Delivery Network_, or CDN.

You could download the code, save it to your own web server, and then include that copy into your page with a `script` tag, but you can remove a step by pointing your `script` tag directly to the code’s URL on the content delivery network.

However, directly linking to a CDN comes with some security risks. Should the CDN get hacked, your page will be importing code controlled by the hackers. To mitigate against this risk, modern browsers have added support for validation hashes to the `script` tag. This is done using the `integrity` attribute. If you include a hash of the good code in the `script` tag with the `integrity` attribute, then, should the CDN get hacked and the code be altered by the attackers, the hash will no longer match, and the browser will not load the script. This will break your page, but it will not expose your visitors to attack, which is definitely a better way for your page to respond to a problem with a CDN!

In theory you can calculate the hashes yourself, but thankfully, most open source projects which publish their code via a CDN include the hash on their instruction page.

The jQuery project makes the jQuery library available via a CDN. They offer sample code to show how to include various versions of the library on their website at [code.jquery.com](https://code.jquery.com). If you go there and click on the link for the minified (shrunk down) version of the latest jQuery 3.x you’ll see that they give you the `script` tag to use with the hash in place:

```JavaScript
<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
```

You’ll see that they also suggest using another attribute – `crossorigin`, this is another security feature, telling the browser that we are intentionally downloading code from a remote server, and that that code should be granted certain privileges that would ordinarily be denied it. For those extra privileges to be granted, the server hosting the code must set a HTTP header giving its consent. CDNs hosting JavaScript code should have that header in place.

### The `noscript` Tag

The `noscript` tag allows you to specify content that will only be displayed when JavaScript is disabled.

All modern browsers do support JavaScript, but users may be using plugins to block it, so the `noscript` tag is still useful today. If your page needs JavaScript in order to function, you might include something like the code shown below as a courtesy to users with JavaScript disabled for what ever reason:

```XHTML
<noscript>
  <h1>JavaScript Required</h1>
  <p>JavaScript is currently disabled in your browser, but it is required in order to use this page. Please enable it and refresh.</p>
</noscript>
```

## When Does JavaScript Execute?

So, we now know we can embed JavaScript into a web page using the `script` tag, but when does it run? The answer is, immediately. As the browser loads the page, it executes the code in each script tag as it meets it. This means that as code executes, the DOM has not been fully constructed yet by the browser. If your code is simply defining functions and variables, that’s fine, but what if your code needs to manipulate the DOM? Before we answer that, let’s pause for a moment to note that any variables you define (including functions) will exist as long as the page remains open in the browser. You can define a variable as the page loads, and a function that runs 30 minutes later can access it, or indeed, a function that runs next year, assuming the browser is kept open on the same page without reloading for that long!

Clearly, if we want our code to interact with the DOM, it needs to run at some time after the DOM has finished loading. How do we achieve this? The answer is events.

## The Browser Event Model

The web browser monitors for all kinds of activities, and when they happen, it triggers a so-called _event_. These events can be triggered by all sorts of things – when the DOM is finished building, the browser triggers an event. When an image is finished loading, the browser triggers an event. When the user moves the mouse, the browser triggers an event. When the user clicks the mouse, the browser triggers an event. When the user presses a key, the browser triggers an events. And on and on and on. Just about everything that happens in a browser triggers an event.

Many of these events have a target associated with them. Specific images finish loading, the user clicks on specific things, they type when specific fields have focus, etc..

JavaScript allows us to attach so-called _listeners_ to events that happen to specific targets. A listener is simply a reference to a function, AKA a callback, and when the browser triggers an event, it will execute all the defined listeners attached to the relevant targets. This allows us to execute a specific function when the user clicks on a certain button, or to execute a particular function when a specific image loads, or, to execute a specific function when the DOM finishes building. It should also be noted that there is no limit to how many functions you attach to a listener. We could execute a thousand different functions when the DOM finishes loading, or when the user moves the mouse, or what ever.

Events are part of the browser, not part of jQuery, and you can use the basic DOM to interact with them. However, like with so much related to the DOM, jQuery makes it easier to work with events. This is why we will learn how to attach listeners to events using jQuery.

## Events and jQuery

JQuery supports many different kinds of events, and rather than list them all now, we’ll encounter them naturally over the next few instalments.

### The Document Ready Event

Let’s start with the most important event of all – the one triggered when the browser finishes building the DOM. This happens when all the HTML and CSS are loaded, but before all the images necessarily finished loading.

Let’s start by creating a simple function we want to run when the DOM finishes loading – let’s call it `fixLinks()`. This function will find all links on the page, and set their `target` attribute to `_blank`, and another attribute called `rel` to `noopener`.

_**Note:** we’ve not talked about the `rel` attribute in this series so far, but its something we’ll be looking at in detail in a future instalment. For now, I’ll just say that for security reasons, you should always set `rel` to `noopener` whenever you set `target` to `_blank`._

This simple function would look something like:

```JavaScript
function fixLinks(){
  $('a').attr('target', '_blank').attr('rel', 'noopener');
}
```

Again, notice the use of function chaining. When reading this code we need to break the statement apart at the dots (period symbols/full stops), and work our way from left to right, figuring what each part evaluates to before moving on.

`$('a')` returns a jQuery object representing all links on the page. We then call the `attr()` function on that object with two arguments, that means we are setting the value of the attribute named in the first argument (`target`) to the value of the second argument (`_blank`). Because we are altering the HTML elements represented by the jQuery object rather than querying them for a value, the `attr()` function will return a reference to the object it was called on, i.e., to our jQuery object representing all links in the page. Finally, we apply the `attr()` function to the jQuery object again, setting another attribute to a new value, this time `rel` to `noopener`.

Now that we have written this function, we want to tell the browser to run it when it’s finished building the DOM. This is something you want to do so often that jQuery has built it directly into the `$()` function. If you pass the `$()` function a reference to a function (a callback) as the first argument, it will set that function to execute when the browser triggers the event signifying that the DOM is ready:

```JavaScript
$(fixLinks);
```

In the real world we would not normally define a named function and then pass it to jQuery on a separate line. Instead, we would use an anonymous function to do it all in one step:

```JavaScript
$(function(){
  $('a').attr('target', '_blank').attr('rel', 'noopener');
});
```

Let’s put this all together into a simple sample HTML page that contains some links without a `target` attribute, and includes the above JavaScript code to set all links to have a `target` of `_blank` (and a `rel` of `noopener`) when the page loads (you’ll find this code in the ZIP file for this instalment as `pbs22a.html`):

```XHTML
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 22 - Example 1</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

  // add an anonymous function for fixing the links to the DOM ready event
  $(function(){
  	$('a').attr('target', '_blank').attr('rel', 'noopener');
  });

</script>
</head>
<body>

<h1>Some Links:</h1>

<ul>
  <li><a href="http://www.bartb.ie/">Bart's Home Page</a></li>
  <li><a href="http://www.podfeet.com/">Allison's Home Page</a></li>
  <li><a href="http://www.jquery.com/">The jQuery Project</a></li>
</ul>

</body>
</html>
```

### Click Events

After the document ready event, the next most commonly used event type is a mouse click. If you want something to happen when a user clicks on a specific HTML element, you attach a click hander to that HTML element. The jQuery function for doing this is `.click()`.

To set a function to execute when an object is clicked, pass a callback as the first argument to `.click()`. When a user clicks on the element and triggers the callback, jQuery will ensure that a reference to the DOM object representing the element is available through the special `this` variable. Like we saw in the previous instalment when looking at the `.filter()` function’s use of callbacks, we can convert this basic DOM object into a jQuery object by passing it to the `$()` function, so a jQuery representation of the clicked-on element is available within the callback via `$(this)`.

As an example, let’s add a click hander to all paragraphs that toggles a class `.highlighted` on and off:

```JavaScript
// add a click event handler to define toggle the highlighting of paragraphs
$('p').click(function(){
  $(this).toggleClass('highlighted');
});
```

A very important subtly is that you have to add this event handler after the DOM has loaded, otherwise, the call to `$('p')` will not find the paragraphs! So, you need to add all other event handlers inside the event handler for the DOM becoming ready:

```JavaScript
// initialise the page - executed when the DOM is ready
$(function(){
  // add a click event handler to define toggle the highlighting of paragraphs
  $('p').click(function(){
    $(this).toggleClass('highlighted');
  });
});
```

Again, let’s put it all together in a full HTML page (`pbs22b.html` in the ZIP file):

```XHTML
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 22 - Example 2</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // initialise the page - executed when the DOM is ready
    $(function(){
      // add a click event handler to define toggle the highlighting of paragraphs
      $('p').click(function(){
        $(this).toggleClass('highlighted');
      });
    });

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /* define the style for highlighted elements */
    .highlighted{
    	background-color: yellow;
    	font-weight: bold;
    }

  </style>
</head>
<body>

<h1>Some Paragraphs</h1>

<p>Click on any paragraph, including this one to toggle higlighting on and off.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacinia velit
vitae ultrices tempor. Curabitur auctor facilisis tincidunt. Aenean id urna
lectus. Curabitur eu libero id lacus egestas finibus id sit amet dui. Phasellus
ornare maximus tortor, vel porta dui dapibus a. Class aptent taciti sociosqu ad
litora torquent per conubia nostra, per inceptos himenaeos. Duis mollis at dui
et molestie. Etiam pharetra gravida lectus, vitae viverra ante condimentum a.
Nam elit turpis, dictum quis dapibus nec, porttitor non nibh. Vivamus eleifend
arcu et turpis rutrum eleifend. Nunc aliquam egestas blandit.</p>

<p>Ut tempor lacus sed lorem luctus commodo. Fusce id mollis nisl, quis
ultricies augue. Nullam porttitor elementum tincidunt. Nulla facilisi.
Vestibulum eget quam vel magna pellentesque egestas id non massa. Suspendisse in
ante a dui dictum vehicula. Vivamus dignissim sagittis quam in vulputate. Donec
eget gravida nulla. Sed ut dignissim risus. Suspendisse faucibus, quam at
placerat tempus, felis nisi cursus nisi, ac gravida lectus justo non ex. Lorem
ipsum dolor sit amet, consectetur adipiscing elit. Etiam scelerisque odio
pretium urna egestas, eget porta arcu gravida. Donec mattis elit eget fringilla
permentum. Nulla sem velit, posuere rutrum aliquet vitae, fringilla at orci.</p>

<p>Sed at risus augue. Cras nec vulputate augue, interdum mollis metus. Quisque
sed lacus nec arcu posuere sodales. Fusce in mi urna. Nullam auctor massa nec
nibh venenatis mollis. Donec porttitor placerat ligula, et dignissim leo aliquam
non. Pellentesque cursus blandit tellus, vehicula pellentesque eros dictum id.
Nulla nec vestibulum velit, vitae cursus nulla. Quisque nec gravida urna, et
tincidunt ex.</p>

</body>
</html>
```

## Timers

As well as events, the browser has a second mechanism for triggering code to run – timers. There are two kinds, _timeouts_, which allow code to be executed once after a given amount of time has expired, and _intervals_, which allow code to be run on a loop with a pause of your choosing between each execution.

### Timeouts

The built-in JavaScript function `setTimeout()` is used to create a timeout. This function can operate in two modes, a modern best-practice mode, and a legacy mode. We will be ignoring the legacy mode completely. When used in the modern mode, the function expects a reference to a function (AKA a callback) as the first argument, the number of milliseconds to wait as the second argument, and, any arguments to be passed to the callback as the third argument and beyond. It’s very common to use an anonymous function as the first argument.

As a simple example, the following code will put up an alert 5 seconds after the page loads:

```JavaScript
// create an anonymous function that will run when the DOM loads
$(function(){
  // set a timeout to run in 5 seconds
  setTimeout(
    function(){
      window.alert('The DOM loaded 5 seconds ago!');
    },
    5000
  );
});
```

You can see it in context in this full example (`pbs22c.html` in the zip file):

```XHTML
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 22 - Example 3</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // initialise the page - executed when the DOM is ready
    $(function(){
      // set a timeout to run in 5 seconds
      setTimeout(
        function(){
          window.alert('The DOM loaded 5 seconds ago!');
        },
        5000
      );
    });

  </script>
</head>
<body>

<h1>Wait 5 Seconds</h1>

<p>It won't be all that spectacular, but please wait 5 seconds.</p>

</body>
</html>
```

When you create a timeout, the browser assigns it a numeric identifier, which is returned by the `setTimeout()` function. You can save that timeout into a variable, and use it to cancel the timeout before it executes with the `clearTimeout()` function. This function expects one argument, the numeric ID of the timeout to be canceled.

### Intervals

Intervals are very similar to timeouts, but they are set and cleared using `setInterval()` and `clearInterval()`. Both of these functions expect the same arguments as `setTimeout()` and `clearTimeout()`.

Popping up an alert every 5 seconds would be very annoying, so let’s not do that as an example. Instead, let’s toggle the `highlighted` class on all paragraphs every 3 seconds:

```JavaScript
// create an anonymous function that will run when the DOM loads
$(function(){
  // set an interval that will toggle the class every 3 seconds
  setInterval(
    function(){
      $('p').toggleClass('highlighted');
    },
    3000
  );
});
```

You can see how this works in context in the file `pbs22d.html` in the zip file:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 22 - Example 4</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // initialise the page - executed when the DOM is ready
    $(function(){
      // set an interval that will toggle the class every 3 seconds
	  setInterval(
	    function(){
      	  $('p').toggleClass('highlighted');
    	},
    	3000
  	  );
    });

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /* define the style for highlighted elements */
    .highlighted{
    	background-color: yellow;
    	font-weight: bold;
    }

  </style>
</head>
<body>

<h1>Some Paragraphs</h1>

<p>Watch as the paragraphs toggle highlighting every three seconds.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacinia velit
vitae ultrices tempor. Curabitur auctor facilisis tincidunt. Aenean id urna
lectus. Curabitur eu libero id lacus egestas finibus id sit amet dui. Phasellus
ornare maximus tortor, vel porta dui dapibus a. Class aptent taciti sociosqu ad
litora torquent per conubia nostra, per inceptos himenaeos. Duis mollis at dui
et molestie. Etiam pharetra gravida lectus, vitae viverra ante condimentum a.
Nam elit turpis, dictum quis dapibus nec, porttitor non nibh. Vivamus eleifend
arcu et turpis rutrum eleifend. Nunc aliquam egestas blandit.</p>

<p>Ut tempor lacus sed lorem luctus commodo. Fusce id mollis nisl, quis
ultricies augue. Nullam porttitor elementum tincidunt. Nulla facilisi.
Vestibulum eget quam vel magna pellentesque egestas id non massa. Suspendisse in
ante a dui dictum vehicula. Vivamus dignissim sagittis quam in vulputate. Donec
eget gravida nulla. Sed ut dignissim risus. Suspendisse faucibus, quam at
placerat tempus, felis nisi cursus nisi, ac gravida lectus justo non ex. Lorem
ipsum dolor sit amet, consectetur adipiscing elit. Etiam scelerisque odio
pretium urna egestas, eget porta arcu gravida. Donec mattis elit eget fringilla
permentum. Nulla sem velit, posuere rutrum aliquet vitae, fringilla at orci.</p>

<p>Sed at risus augue. Cras nec vulputate augue, interdum mollis metus. Quisque
sed lacus nec arcu posuere sodales. Fusce in mi urna. Nullam auctor massa nec
nibh venenatis mollis. Donec porttitor placerat ligula, et dignissim leo aliquam
non. Pellentesque cursus blandit tellus, vehicula pellentesque eros dictum id.
Nulla nec vestibulum velit, vitae cursus nulla. Quisque nec gravida urna, et
tincidunt ex.</p>

</body>
</html>
```

## A Challenge

Let’s put everything we’ve learned today together into a single exercise. Please use the following HTML page (`pbs22-challenge.html` in the zip file) as your starting point:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 22 - Challenge</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // INSERT YOUR CODE HERE

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /* define the style for highlighted elements */
    .highlighted{
    	background-color: yellow;
    	font-weight: bold;
    }

  </style>
</head>
<body>

<h1>PBS 22 Challenge</h1>

<p>If you complete the assignment you should be able to click on any
paragraph and all paragraphs should highlight and then un-highlight at one
second intervals. Clicking any paragraph again should stop that happening.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacinia velit
vitae ultrices tempor. Curabitur auctor facilisis tincidunt. Aenean id urna
lectus. Curabitur eu libero id lacus egestas finibus id sit amet dui. Phasellus
ornare maximus tortor, vel porta dui dapibus a. Class aptent taciti sociosqu ad
litora torquent per conubia nostra, per inceptos himenaeos. Duis mollis at dui
et molestie. Etiam pharetra gravida lectus, vitae viverra ante condimentum a.
Nam elit turpis, dictum quis dapibus nec, porttitor non nibh. Vivamus eleifend
arcu et turpis rutrum eleifend. Nunc aliquam egestas blandit.</p>

<p>Ut tempor lacus sed lorem luctus commodo. Fusce id mollis nisl, quis
ultricies augue. Nullam porttitor elementum tincidunt. Nulla facilisi.
Vestibulum eget quam vel magna pellentesque egestas id non massa. Suspendisse in
ante a dui dictum vehicula. Vivamus dignissim sagittis quam in vulputate. Donec
eget gravida nulla. Sed ut dignissim risus. Suspendisse faucibus, quam at
placerat tempus, felis nisi cursus nisi, ac gravida lectus justo non ex. Lorem
ipsum dolor sit amet, consectetur adipiscing elit. Etiam scelerisque odio
pretium urna egestas, eget porta arcu gravida. Donec mattis elit eget fringilla
permentum. Nulla sem velit, posuere rutrum aliquet vitae, fringilla at orci.</p>

<p>Sed at risus augue. Cras nec vulputate augue, interdum mollis metus. Quisque
sed lacus nec arcu posuere sodales. Fusce in mi urna. Nullam auctor massa nec
nibh venenatis mollis. Donec porttitor placerat ligula, et dignissim leo aliquam
non. Pellentesque cursus blandit tellus, vehicula pellentesque eros dictum id.
Nulla nec vestibulum velit, vitae cursus nulla. Quisque nec gravida urna, et
tincidunt ex.</p>

</body>
</html>
```

1.  In the `script` element within the `head` element, declare a variable named blinkIntervalID with the value `0` (this variable will be in the global scope)
2.  Below your variable declaration, declare a function named `toggleBlinking()`. This function will take no arguments, and return nothing. If the current value of the global variable `blinkIntervalID` is `0`, this function should create a new interval which will toggle the class `highlighted` on all paragraphs every second, and save the interval ID into the global variable `blinkIntervalID`. If the current value of the global variable `blinkIntervalID` is not `0`, the function should cancel the interval who’s ID is stored in the global variable `blinkIntervalID`, and set the variable to `0`.
3.  Create an anonymous function that will execute when the DOM has finished loading. Inside this function, add an event handler to every paragraph that will call the function `toggleBlinking()` every time the user clicks on a paragraph.

Test you code by clicking on any paragraph. The `highlight` style should start being applied and un-applied every second. You should be able to stop this by clicking on any paragraph. You should be able to stop and start the blinking as often as you like by continuing to click on paragraphs.

Remember that any errors your code generates will be written to the JavaScript console. You can also write to the console from within your code using the function `console.log()`. You can log text, but also the value stored within variables, even complex ones like arrays and objects. The `console.log()` function expects at least one argument, and it will log all arguments you pass it.

## Conclusions

We’re now well on the way to being front-end web programmers. We know how to define the structure of a web page with HTML, how to style it with CSS, and we can now embed JavaScript code into web pages and get it to run when certain events or timers fire. We’ve also learned how to use jQuery to interrogate and alter the style and attributes of one or more HTML elements on a page.

While we have learned a lot, we still have a lot to learn. There are many more kinds of event we can attach our code to, we have not learned anything about HTML form tags yet – buttons, text fields, dropdown, etc., and we’ve only scratched the surface of what jQuery can do. So far we’ve been using jQuery to alter existing HTML elements, we can also use it to build new elements from scratch and inject them into the DOM, and, remove existing elements from the DOM.

In other words, we still have a lot to look forward to!
