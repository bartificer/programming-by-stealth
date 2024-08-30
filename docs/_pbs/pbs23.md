---
title: Creating Elements with jQuery
instalment: 23
creators: [bart, allison]
date: 2016-10-13
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_10_13.mp3
---

So far in this series we have been using jQuery to alter existing HTML elements by changing their attributes or style. In this instalment we take things to the next level, and learn how to use jQuery to create entirely new HTML elements and inject them into the DOM, and hence, into the web page.

We’ll be working towards our first truly practical assignment in the series – a function that finds all links on a page, and if, and only if, they lead to an external page, alters them to open in a new tab, and appends an icon indicating that fact. In order to work up to that, we need to learn five new things:

1.  How to build HTML elements with jQuery
2.  How to inject HTML elements into the DOM
3.  How to loop through each element represented by a jQuery object
4.  How to embed images directly into web pages using Data URLs
5.  How to use the third-party library URI.js to interrogate URLs

There are four examples in this instalment, and a starting point for the challenge. I’ve gathered them, and the other files they depend on, into a ZIP file which you can [download here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/10/pbs23.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs23.zip). It’s assumed that you’ll extract this ZIP file and place the five HTML files and one folder it contains into a folder named `pbs23` in your local web server’s htdocs folder. The folder is particularly important because it contains a copy of the URI.js library, and if it’s not in the same folder as `pbs23d.html` and `pbs23-assignment.html`, those pages won’t work.

## Matching Podcast Episode 459

Listen Along: Chit Chat Across the Pond Episode 459

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_10_13.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_10_13.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to PBS 22 Challenge

But first, below is a solution to the challenge I set at the end of [the previous instalment](https://pbs.bartificer.net/pbs22). I provided an HTML file as a starting point, and then set the following tasks:

1.  In the `script` element within the `head` element, declare a variable named blinkIntervalID with the value `0` (this variable will be in the global scope)
2.  Below your variable declaration, declare a function named `toggleBlinking()`. This function will take no arguments, and return nothing. If the current value of the global variable `blinkIntervalID` is `0`, this function should create a new interval which will toggle the class `highlighted` on all paragraphs every second, and save the interval ID into the global variable `blinkIntervalID`. If the current value of the global variable `blinkIntervalID` is not `0`, the function should cancel the timeout who’s ID is stored in the global variable `blinkIntervalID`, and set the variable to `0`.
3.  Create an anonymous function that will execute when the DOM has finished loading. Inside this function, add an event handler to every paragraph that will call the function `toggleBlinking()` every time the user clicks on a paragraph.

Below is my solution to the assignment. Just a reminder that when it comes to programming, there are an infinity of possible correct solutions, so if your code works, but looks different from mine, that’s just fine!

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 22 - Challenge</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // a globally scoped variable to hold the interval ID
    var blinkIntervalID = 0;

    // a function to turn blinking on or off (toggle it)
    function toggleBlinking(){
    	if(blinkIntervalID == 0){
    		// there is no interval, so create one
    		blinkIntervalID = setInterval(
    		    function(){
    		    	$('p').toggleClass('highlighted');
    		    },
    		    1000
    		);
    	}else{
    		// there is an interval, so stop it
    		clearInterval(blinkIntervalID);
    		blinkIntervalID = 0;
    	}
    }

    // initialise event handlers when the DOM loads
    $(function(){
    	// add a click handler to all paragraphs
    	$('p').click(toggleBlinking);
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

<h1>PBS 22 Challenge</h1>

<p>If you complete the assignement you should be able to click on any
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

## Creating HTML Elements with jQuery

We have already learned that jQuery heavily overloads functions – that is to say, the same function behave in different ways depending on what arguments are passed. So far, we know that the `$()` function implements all the following behaviours when passed different arguments:

1.  A String containing a CSS selector as the only argument – select all matching elements in the entire document. For example, select all links: `$('a');`
2.  A string containing a CSS selector as the first argument, and a jQuery object as the second argument – search the HTML elements represented by the jQuery object for all matching elements. For example, select all links within paragraphs: `$('a', $('p'));`
3.  A DOM object as the only argument – convert the DOM object to a jQuery object. For example, `$(this)` inside jQuery callbacks.
4.  A function object (callback) as the only argument – execute the function when the DOM becomes ready.

We can now add a fifth behaviour to that list – if you pass the `$()` function a HTML tag as a string, it will construct a new HTML element.

For example, to build a top-level heading with the text _a header_, you could do the following:

```javascript
var $myHeading = $('<h1 />').text('a header');
```

Similarly, I could use jQuery to build a link to my website as follows:

```javascript
var $myLink = $('<a />').text('my homepage').attr('href', 'http://www.bartb.ie/');
```

Note that jQuery will accept a full HTML tag with attributes and content all defined within the string. To illustrate this point, the following two lines of code produce the same result:

```javascript
var $img = $('<img src="x.png" alt="an image" title="an image" />');
var $img = $('<img />').attr('src', 'x.png').attr('alt', 'an image').attr('title', 'an image');
```

My preference is for the second style. So that’s what you’ll see me use in examples throughout this series.

When we create HTML elements in this way, they exist, but they are not part of the page. It’s almost like they are in a parallel dimension. For these elements to become visible, they need to be injected into to the DOM. JQuery provides a number of functions for doing this. These functions should be called on a jQuery object representing an existing element. They will then place the new element relative to the existing element in one of the following ways:

<dl>
<dt><code>.before()</code></dt>

<dd>Injects the new element into the DOM directly before the existing element.</dd>

<dt><code>.after()</code></dt>

<dd>Injects the new element into the DOM directly after the existing element.</dd>

<dt><code>.prepend()</code></dt>

<dd>Injects the new element into the DOM inside the existing element as the first child element.</dd>

<dt><code>.append()</code></dt>

<dd>Injects the new element into the DOM inside the existing element as the last child element.</dd>
</dl>

Let’s pause for an example. The HTML page below contains a heading followed by some paragraphs of text. We’ll use jQuery to inject an `aside` element as the last element within the `body` element containing the character count for the paragraphs.

We can get the character count for all the paragraphs with the following snippet:

```javascript
var numChars = $('p').text().length;
```

We can create an `aside` tag with the following snippet:

```javascript
var $aside = $('<aside />').text('(the paragraphs above contain ' + numChars + ' characters)');
```

Finally, we can inject this new element into the end of the `body` element with the following snippet:

```javascript
$('body').append($aside);
```

Remember that we need all the above code to run after the DOM becomes ready.

Putting it all together, we get the following full HTML page (`pbs23a.html` in the ZIP file):

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 23 - Example 1</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // Inject the character count when the DOM becomes ready
    $(function(){
    	var numChars = $('p').text().length;
    	var $aside = $('<aside />').text('(the paragraphs above contain ' + numChars + ' characters)');
    	$('body').append($aside);
    });

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /* Style the aside */
    aside{
    	color: dimgray;
    	font-style: italic;
    }
  </style>
</head>
<body>

<h1>Some Paragraphs</h1>

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

## Looping Through a jQuery Object

As we know, jQuery objects represent zero or more HTML elements. It’s easy to apply basic changes to all elements an object represents – we’ve seen this many times already in the previous few instalments. For example, we can turn every paragraph in a page red with the following snippet:

```javascript
$('p').css('color', 'red');
```

However, sometimes we need to apply similar, but not identical, changes to each element represented by a jQuery object. In these kinds of situations, we need to loop through each element represented by the object one by one. Or – to put it another way, we need to iterate over the elements represented by the jQuery object. This is what jQuery’s `.each()` function is for. This function expects one argument, a callback. It will execute that callback once for every element the object represents. Within the callback, the current DOM element will be available via the special `this` variable. As usual, to convert this DOM object to a jQuery object, pass it to the `$()` function, i.e. use `$(this)`.

As an example, let’s alter our previous example so it also puts a count at the end of every paragraph.

The following snippet does the work:

```javascript
$('p').each(function(){
  var $p = $(this);
  var numChars = $p.text().length;
  var $count = $('<span />').addClass('char_count').text(' (this paragraph contains ' + numChars + ' characters)');
  $p.append($count);
});
```

Below is a full web page so you can see the snippet in context (`pbs23b.html` in the ZIP file):

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 23 - Example 2</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // Inject the character counts when the DOM becomes ready
    $(function(){
    	// do the over-all count first so the per-paragraph count messages don't throw the overall count off
    	var numChars = $('p').text().length;
    	var $aside = $('<aside />').addClass('char_count').text('(the paragraphs above contain a total of ' + numChars + ' characters)');
    	$('body').append($aside);

    	// now add a count to each paragraph
    	$('p').each(function(){
    		var $p = $(this);
  			var numChars = $p.text().length;
  			var $count = $('<span />').addClass('char_count').text(' (this paragraph contains ' + numChars + ' characters)');
  			$p.append($count);
  		});
    });

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /* Style the counts */
    .char_count{
    	color: dimgray;
    	font-style: italic;
    }
  </style>
</head>
<body>

<h1>Some Paragraphs</h1>

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

## Images Via Data URLs

Usually, a URL points to a location where data can be retrieved from, but it’s possible to embed data directly into a URL using so-called _data URLs_. The part of a URL before the first `:` character is known as the URL’s _scheme_. We’re used to seeing the `http`, `https`, and perhaps `ftp` schemes, but there is also a `data` scheme. Using this scheme, it’s possible to encode base-64 encoded data directly into a URL.

For our purposes, data URLs will take the following form (the spec is a little broader, but we’ll be ignoring the other possibilities):

`data:MIME/TYPE;base64,BASE_64_ENCODED_DATA`

With `MIME/TYPE` being replaced with the appropriate MIME-Type for the data, and `BASE_64_ENCODED_DATA` being replaced with the actual data.

You can get the base64 encoded version of any file using the `uuencode` terminal command (Linux & Mac). The format of the command is as follows:

`uuencode -m IN_FILE REMOTE_NAME`

For data URLs, the remote name is irrelevant, but the command insists you pass one, so you can use anything at all for that argument. For example, if I had a file called `tag-hash.png` which contained an icon I wanted to use to represent a character count, I could determine its base64 encoding with the following command:

`uuencode -m tag-hash.png boogers`

This produces the following output:

```
begin-base64 755 boogers
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ
bWFnZVJlYWR5ccllPAAAA61pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp
bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6
eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz
NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo
dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw
dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hh
cC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9t
bS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3Vy
Y2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0
czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6NzBDQkJENjFF
ODMxREYxMTlCMjJGQkJBMDE3QTBERTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTBBRDY1
NzBCM0I4MTFFMDg1ODhFM0I2RkYzOTlFNUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTBB
RDY1NkZCM0I4MTFFMDg1ODhFM0I2RkYzOTlFNUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhv
dG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9
InhtcC5paWQ6OTlFNTY2ODQ4OEIzRTAxMUFGRDI4NzU4Q0FBOEM2NEEiIHN0UmVmOmRvY3VtZW50
SUQ9InV1aWQ6NzBDQkJENjFFODMxREYxMTlCMjJGQkJBMDE3QTBERTkiLz4gPC9yZGY6RGVzY3Jp
cHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz48FcfDAAAB
20lEQVR42mL8//8/AyWAiYFCwBhaX+8LpKWIVH/i758/F//8+cMAwr9//2ZgAQpIr21pmU6M7uCa
mkwo8yLcC0CTmP4Bw+HPv39gvGnzZoaz584x3Lp9m2Hp0qVwcRBeA7QIqN4aqM8A2QDGvyAD/v4F
47t37jBISEoyPH/xgkFGTg4u/hdkCJBe19ExFWzI//9gQ1iA/mACmX7v3j2G1cuXg02dPXMm3Nk/
fv5ksLazYzhz4QLDxWvXGPS1tBg29vRM8crPzwMawsT059cv5j9AF4hLSzPklJQwfPv2DYU2trBg
+Ac06O2nTwyCQkKMIPrbr18MWyZOnPTn9287ll+/foFdsHfXLobD+/aBbW2oqIDTMSkpDEoqKgyq
ysoMz1+9+i8pJsbAysbG4JScXMzIyHiY5ffPn2ADLOztGX4CTQYBTV1dhnlTpjBUtLSA+d+B3hAW
FGQQFxVl4OHmZnCIiSkFa2ZjO8v0C+qFX8AAOn/mDIOAiAjD9atXGSRlZcFiMPwNaAgXULNNWFgF
MNwOAVPwaXAgfv74kY2FhYWBi4uLoaShAWca4OXhYTB0d69jZmY+yMXDcwomzvLu9evnqmZm7USl
eyam/UKioidQkvKAZyaKDQAIMACsfPvDGV7GigAAAABJRU5ErkJggg==
====
```

For our purposes, we should ignore both the first and last lines. The data we want is between the header line and the final `====` line with the newline characters removed.

We could update our example to use this icon using the following snippet:

```javascript
var countIconURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA61pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6NzBDQkJENjFFODMxREYxMTlCMjJGQkJBMDE3QTBERTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTBBRDY1NzBCM0I4MTFFMDg1ODhFM0I2RkYzOTlFNUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTBBRDY1NkZCM0I4MTFFMDg1ODhFM0I2RkYzOTlFNUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTlFNTY2ODQ4OEIzRTAxMUFGRDI4NzU4Q0FBOEM2NEEiIHN0UmVmOmRvY3VtZW50SUQ9InV1aWQ6NzBDQkJENjFFODMxREYxMTlCMjJGQkJBMDE3QTBERTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz48FcfDAAAB20lEQVR42mL8//8/AyWAiYFCwBhaX+8LpKWIVH/i758/F//8+cMAwr9//2ZgAQpIr21pmU6M7uCamkwo8yLcC0CTmP4Bw+HPv39gvGnzZoaz584x3Lp9m2Hp0qVwcRBeA7QIqN4aqM8A2QDGvyAD/v4F47t37jBISEoyPH/xgkFGTg4u/hdkCJBe19ExFWzI//9gQ1iA/mACmX7v3j2G1cuXg02dPXMm3Nk/fv5ksLazYzhz4QLDxWvXGPS1tBg29vRM8crPzwMawsT059cv5j9AF4hLSzPklJQwfPv2DYU2trBg+Ac06O2nTwyCQkKMIPrbr18MWyZOnPTn9287ll+/foFdsHfXLobD+/aBbW2oqIDTMSkpDEoqKgyqysoMz1+9+i8pJsbAysbG4JScXMzIyHiY5ffPn2ADLOztGX4CTQYBTV1dhnlTpjBUtLSA+d+B3hAWFGQQFxVl4OHmZnCIiSkFa2ZjO8v0C+qFX8AAOn/mDIOAiAjD9atXGSRlZcFiMPwNaAgXULNNWFgFMNwOAVPwaXAgfv74kY2FhYWBi4uLoaShAWca4OXhYTB0d69jZmY+yMXDcwomzvLu9evnqmZm7USleyam/UKioidQkvKAZyaKDQAIMACsfPvDGV7GigAAAABJRU5ErkJggg==';

$('p').each(function(){
  var $p = $(this);
  var numChars = $p.text().length;
  var $count = $('<span />').addClass('char_count').text(numChars);
  var $icon = $('<img />').attr('src', countIconURL).attr('alt', 'Character Count').attr('title', 'Character Count');
  $count.prepend($icon);
  $p.append($count);
});
```

Again, we can put this all together into a full web page as follows (`pbs23c.html` in the ZIP file):

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 23 - Example 3</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // save the data URL for the counter icon into a variable for easy access
    var countIconURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA61pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6NzBDQkJENjFFODMxREYxMTlCMjJGQkJBMDE3QTBERTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTBBRDY1NzBCM0I4MTFFMDg1ODhFM0I2RkYzOTlFNUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTBBRDY1NkZCM0I4MTFFMDg1ODhFM0I2RkYzOTlFNUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTlFNTY2ODQ4OEIzRTAxMUFGRDI4NzU4Q0FBOEM2NEEiIHN0UmVmOmRvY3VtZW50SUQ9InV1aWQ6NzBDQkJENjFFODMxREYxMTlCMjJGQkJBMDE3QTBERTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz48FcfDAAAB20lEQVR42mL8//8/AyWAiYFCwBhaX+8LpKWIVH/i758/F//8+cMAwr9//2ZgAQpIr21pmU6M7uCamkwo8yLcC0CTmP4Bw+HPv39gvGnzZoaz584x3Lp9m2Hp0qVwcRBeA7QIqN4aqM8A2QDGvyAD/v4F47t37jBISEoyPH/xgkFGTg4u/hdkCJBe19ExFWzI//9gQ1iA/mACmX7v3j2G1cuXg02dPXMm3Nk/fv5ksLazYzhz4QLDxWvXGPS1tBg29vRM8crPzwMawsT059cv5j9AF4hLSzPklJQwfPv2DYU2trBg+Ac06O2nTwyCQkKMIPrbr18MWyZOnPTn9287ll+/foFdsHfXLobD+/aBbW2oqIDTMSkpDEoqKgyqysoMz1+9+i8pJsbAysbG4JScXMzIyHiY5ffPn2ADLOztGX4CTQYBTV1dhnlTpjBUtLSA+d+B3hAWFGQQFxVl4OHmZnCIiSkFa2ZjO8v0C+qFX8AAOn/mDIOAiAjD9atXGSRlZcFiMPwNaAgXULNNWFgFMNwOAVPwaXAgfv74kY2FhYWBi4uLoaShAWca4OXhYTB0d69jZmY+yMXDcwomzvLu9evnqmZm7USleyam/UKioidQkvKAZyaKDQAIMACsfPvDGV7GigAAAABJRU5ErkJggg==';

    // Inject the character counts when the DOM becomes ready
    $(function(){
    	// do the over-all count first so the per-paragraph count messages don't throw the overall count off
    	var numChars = $('p').text().length;
    	var $aside = $('<aside />').addClass('char_count').text('(the paragraphs above contain a total of ' + numChars + ' characters)');
    	$('body').append($aside);

    	// now add a count to each paragraph
    	$('p').each(function(){
    		var $p = $(this);
    		var numChars = $p.text().length;
    		var $count = $('<span />').addClass('char_count').text(numChars);
    		var $icon = $('<img />').attr('src', countIconURL).attr('alt', 'Character Count').attr('title', 'Character Count');
    		$count.prepend($icon);
    		$p.append($count);
    	});
    });

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /*
     * Style the counts
     */

    /* apply the basics to all counts */
    .char_count{
    	color: dimgray;
    	font-style: italic;
    }

    /* stop the count spans from splitting over multiple lines */
    span.char_count{
    	white-space: nowrap
    }

    /* style the count icons */
    span.char_count img{
    	vertical-align: middle;
    	margin-left: 5px;
    	margin-right: 2px;
    }
  </style>
</head>
<body>

<h1>Some Paragraphs</h1>

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

The big advantage to using data URLs within JavaScript code is that you can share the code with others without having to send them multiple files.

## Introducing `URI.js`

The final piece we need to build our link enhancer is the ability to parse URLs into their component parts so we can analyse them. We could do this with regular expressions, but that’s not as straightforward as you might imagine – the specification defining valid URLs is actually quite complex.

When you encounter a common problem like this, reinventing the wheel is not a good approach. Instead, you should look to see if there’s an open source project that has already solved your problem for you. I don’t mean copying and pasting snippets of code from a web forum. I mean using a well packaged and well documented library of code that has been specifically designed to be reused.

When code has been properly designed to be reused, it will have a well defined and well documented list of available variables, functions, and/or prototypes. Collectively, this documented collection of functions etc. is known as an Application Programming Interface, or API. The API should be all you need to know to make use of a well packaged code library. We’ve already used one such code library in this series – jQuery.

OK, so we need to process URLs. We can’t possibly be the only JavaScript programmers to need that functionality. So there’s probably a well regarded library that solves this problem out there somewhere. A little Googling would tell you that the best regarded JavaScript library for interacting with URLs is [URI.js](https://medialize.github.io/URI.js/).

This will not be an exhaustive look at URI.js. The documentation on their site is very good. So I’ll leave learning more as an exercise for the reader. Instead, I just want to highlight the parts of the API we’ll need to achieve our goals. Also note that URI.js integrates with jQuery.

Firstly, we can create a URI object representing the URL of the current page as follows:

```javascript
var uriObj = new URI();
```

We can create a URI object from a jQuery object representing a link named `$a` as follows:

```javascript
var uriObj = $a.uri();
```

We can determine if a link is relative or absolute using the `.is()` function:

```javascript
var isRelative = uriObj.is('relative');
```

Finally, we can extract the full domain part of a URL using the `.hostname()` function:

```javascript
var domainName = uriObj.hostname();
```

You can read more about each of these functions, and learn about all the other functions that exist in [URI.js’s documentation](https://medialize.github.io/URI.js/docs.html).

As a worked example, let’s create some code to add the class `external` to all links in a page that lead to a different site.

External links are those that are not internal. A link is considered internal if either of the following are true: the link is relative or the domain the link points to is the same as the domain of the current page.

Based on that, we could write a function to mark external links as external like so:

```javascript
function markExternalLinks(){
  // create a jQuery object representing all links
  var $links = $('a');

  // create a URI object representing the URL of the page
  var pageURI = new URI();

  // loop through each link to check whether or not it is external
  $links.each(function(){
    // save a reference to the link being examined
    var $a = $(this); // the link being tested

    // create a URI object representing the URL being linked to
    var aURI = $a.uri();

    // check if the link is relative - if it is, return - definitely not external
    if(aURI.is('relative')){
      return;
    }

    // check if the domains match - if not, definitely external
    if(pageURI.hostname() != aURI.hostname()){
      $a.addClass('external');
    }
  });
}
```

You can see this function in action in the full web page shown below (`pbs23d.html` in the ZIP file). Note that it includes CSS definitions to show links in green by default, and links with the class `external` in red. Also note that this page imports the URI.js library. Because the URI.js project does not provide a CDN, the code library file is included in the zip file in a folder named `contrib`. This folder must be present in the same folder as `pbs23d.html` for the library to be successfully imported.

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 23 - Example 4</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Import the URI.js Library -->
  <script type="text/javascript" src="contrib/URI-1.18.1.js"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // define a function to mark external links as external
    function markExternalLinks(){
    	// create a jQuery object representing all links
    	var $links = $('a');

    	// create a URI object representing the URL of the page
    	var pageURI = new URI();

    	// loop through each link to check whether or not it is external
    	$links.each(function(){
    		// save a reference to the link being examined
    		var $a = $(this); // the link being tested

    		// create a URI object representing the URL being linked to
    		var aURI = $a.uri();

    		// check if the link is relative - if it is, return - definitely not external
    		if(aURI.is('relative')){
    			return;
    		}

    		// check if the domains match - if not, definitely external
    		if(pageURI.hostname() != aURI.hostname()){
    			$a.addClass('external');
    		}
    	});
    }

    // call the function when the the DOM becomes ready
    $(markExternalLinks);
  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /*
     * Style Links
     */

    /* make all links bold so they stand out better */
    a{
    	font-weight: bold;
    }

    /* assume links are local */
    a:active, a:link, a:visited, a:hover{
    	color: darkgreen;
    }

    /* style external links */
    a.external:active, a.external:link, a.external:visited, a.external:hover{
    	color: darkred;
    }

  </style>
</head>
<body>

<h1>Some Links</h1>

<p>On this page, all links that are local to the site (same domain) should show in green, and all remote links should show in red.</p>

<p>This is a paragraph that contains a relative link to <a href="pbs23c.html">the previous example</a>. It should be marked as an local link, i.e. it should be in green.</p>

<p>This paragraph contains an absolute link to the <a href="http://localhost/pbs23/pbs23b.html">second example</a> in this instalement (will only work if the sample files for this instalment are being served from <code>http://localhost/pbs23/</code>). Assuming you are serving this page from your local web server (<code>localhost</code>), it should also be marked as a local link.</p>

<p>Both of the links in the list below should be marked as external, i.e. they should be red:</p>
<ul>
  <li><a href="http://www.bartb.ie/">Bart's Home Page</a></li>
  <li><a href="http://www.podfeet.com/">Allison's Home Page</a></li>
</ul>

</body>
</html>
```

## Challenge

Using a slightly altered version of the fourth example (`pbs23-assignment.html` in the ZIP file) as your starting point, add the code needed to transform external links in the following ways:

1.  Set their `target` to `_blank`
2.  Set their `rel` attribute to `noopener`
3.  Add an icon after the link (the data URL for the icon is available in the global variable `newWindowIconURL`)

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 23 - Assignment</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Import the URI.js Library -->
  <script type="text/javascript" src="contrib/URI-1.18.1.js"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // save the data URL for the new window icon into a variable for easy access
    var newWindowIconURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAg9JREFUeNqkU89rE0EYfbubjZu4pLWSipfGqlQpelARb7YgHhTBgwfRRVCKepSCRYoHLyJi/wM96KW5CR48qYfmUKjStMGghZY2irHNNptoStptsj/Gb6Z0cRs95cGbGXbe9775Zr+RGGNoBxE+nLv9EYqiiA89PQfELEnSBHHgX0GUNPNidO9gYPA3THMFup6AqqrPj6TUgYe3ki0GNx4VA2N552aj0UClUiZa6U+fy8adx4tYrTohTb1eR8iAMf+K53lLRLbNTt1nutYcX/xuoWRthgzW1mqhenD66rulyVmL+b4fcHauys5ce89mvv5iHNNfKmx5dUOsSc8nESuG/ktvRNZmsymYn7fYxbsfWJaCOKgUxjXnh0SgWG8byFt1O3BdFxSMb8UaXr5ewJN7x9F/MI6pXAnG/Qkk90RR+FEzjJGM0O+4A1kYVH/bmJwxcf3CPiQ7PGTzJTwYm8az4T7SSPB9KT2VswxaZ0IGiqLBcTwsmxs40RdHV0JF0Wxg/O1PjA4dwrHDHVgp+6SL8Q5JEwdDjRSN6nR8D8nOXSSSsL7JkF+wcfNyCt1dKm8qoeFwXYWSrYc7UdMSdEQVsVgEns/IwMHZU93Q40og5JotJOgOai0Ghdy833vyaAwR+jOp/RpkWQpE2TlbaFrNghJ2jzx9ZY8Bdu9/3kyBa6jhWjakdl+jjDbxR4ABAPjFI5E3WpRkAAAAAElFTkSuQmCC';

    //
    // --- YOUR CODE HERE ---
    //

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /*
     * Style Links
     */

    /* make all links bold so they stand out better */
    a{
    	font-weight: bold;
    }

  </style>
</head>
<body>

<h1>Some Links</h1>

<p>On this page, all links that are local to the site (same domain) should open in the current tab, and all remote links should be marked with an icon and open in a new tab.</p>

<p>This is a paragraph that contains a relative link to <a href="pbs23c.html">the previous example</a>. It should be treated like a local link, so no icon and open in this tab.</p>

<p>This paragraph contains an absolute link to the <a href="http://localhost/pbs23/pbs23b.html">second example</a> in this instalement (will only work if the sample files for this instalment are being served from <code>http://localhost/pbs23/</code>). Assuming you are serving this page from your local web server (<code>localhost</code>), it should also be rendered as a local link, i.e. no icon and open in this tab.</p>

<p>Both of the links in the list below should be marked as external, i.e. they should have an icon appended, and open in a new tab:</p>
<ul>
  <li><a href="http://www.bartb.ie/">Bart's Home Page</a></li>
  <li><a href="http://www.podfeet.com/">Allison's Home Page</a></li>
</ul>

</body>
</html>
```

## Conclusions

Hopefully, when you complete the assignment, you’ll have reached an important milestone in this series – our first truly practical piece of code that solves a common real world problem. To get here we needed an understanding of HTML, CSS, the JavaScript language, and two third-party libraries – jQuery and URI.js.

In the next instalment we’ll tackle another real world problem. We’ll create an embeddable clock that shows the time in a given timezone. This is something Allison needs for her website. She records her podcast live on Sundays at 5pm her time. To avoid timezone confusions, she would like visitors to her site to see a live clock showing the current time in her timezone.

We already know all the pieces we need to create the clock. The new skill we’ll be learning is how to package our code so as to make it easy to embed into an existing site, and hence, easily reusable by others. In other words, we’ll be making our own library with its own API for others to reuse on their own pages.

 - [← PBS 22 — jQuery Events](pbs22)
 - [Index](index)
 - [PBS 24 — Creating a JavaScript API →](pbs24)