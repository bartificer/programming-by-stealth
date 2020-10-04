# PBS 24 of x – Creating a JavaScript API

In this instalment we’ll take our JavaScript skill up a level, learning how to write code that is designed to be reused by ourselves or by others. When you solve a problem that you know you’ll need to solve again, it’s worth putting in a little extra effort to make your code as easy to reuse as possible. You may decide to share that code with others, or you may not, but either way, it’s in your interest to write it using some simple best practices.

Reusable code without documentation is all but useless. So we’ll also learn how to create great API documentation as you code. We’ll learn to do this using the free and open source tool [JSDoc](https://github.com/jsdoc3/jsdoc).

As a worked example, we’ll rewrite our link fixer as an easily reusable API. While we’re at it we’ll also add in some extra functionality to make its behaviour more customisable, and hence, more useful to more people.

The sample files used in this instalment, as well as some needed libraries, can be [downloaded as a ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/10/pbs24.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs24.zip). The examples assume you’ll save the files within the zip in a folder named `pbs24` in the document root of your local web server.

## Matching Podcast Episode 461

Listen Along: Chit Chat Across the Pond Episode 461

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_10_28.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_10_28.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Solution to Instalment 23’s Challenge

Before we get stuck into this instalment’s new content, let’s look at a solution to the challenge set at the end of [the previous instalment](https://pbs.bartificer.net/pbs23). The challenge was to write a function to find all links in a page, check each to see if it’s internal to the site, or external, and if it’s external, to transform the link to have a `target` of `_blank`, a `rel` of `noopener`, and to inject an icon after the image to show that it will open in a new window/tab.

Below is my solution. As always, I want to stress that there are an infinity of correct solutions to any programming challenge, so, if your code works, then it’s just as correct as mine!

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

    // define a function to transform all external links as desired
    function fixExternalLinks(){
    	// create a URI object representing the page's URL
    	var pageURI = new URI();

    	// loop through all links and transform each if external
    	$('a').each(function(){
    		var $a = $(this);

    		// create a URI object representing this link
    		var aURI = $a.uri();

    		// if the link is realative, don't continue
    		if(aURI.is('relative')){
    			return;
    		}

    		// check the domains - if they don't match, the link is external
    		if(pageURI.hostname() != aURI.hostname()){
    			// set the attributes as required
    			$a.attr('target', '_blank').attr('rel', 'noopener');

    			//create an icon
    			var $icon = $('<img />').attr('src', newWindowIconURL).attr('alt', 'External Link Icon');
    			$icon.attr('title', 'Link Opens in New Tab');
    			$icon.addClass('externalLinkIcon');

    			//inject the icon into the DOM just after the link
    			$a.after($icon);
    		}
    	});
    }

    // call the function when the DOM becomes ready
    $(fixExternalLinks);
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

    /* style the external link icon */
    img.externalLinkIcon{
    	vertical-align: middle;
    	margin-left: 1px;
    	margin-right: 1px;
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

## Writing Reusable and Sharable Code

Whether you’re writing code for your own reuse in future projects, for sharing with a team, or for publishing to the world, you need to take some extra care to avoid your code having unintended side-effects. The biggest potential danger is littering of the global scope. The reason you want to avoid using the global scope for everything is that the global scope can only contain one variable with any given name. If you use a globally scoped variable named `x` in your code, then your code conflicts with every other piece of code that uses a globally scoped variable named `x`. The fewer globally scoped names your code uses, the less likely it is to conflict with other code.

Many programming languages make use of a concept known as _namespacing_ or _packaging_, to create a hierarchy of scopes. When you create a new API, you place all your code in its own namespace; so your code would be completely separated from the global scope. In Java you organise your code into packages, generally named in reverse-DNS style – if I was publishing Java code I could package it as `net.bartificer.projectName` (Bartificer is my registered business name, and I own the domain `bartificer.net`). Perl uses a :: separated hierarchy. The Perl module that drives www.xkpasswd.net is contained within the package `Crypt::HSXKPasswd`. In both of these examples, there would be/is zero littering of the global scope.

The bad news is that Javascript does not have a built-in mechanism for namespacing. However, a workaround has been developed that uses JavaScript objects and the concept of function closures to simulate traditional namespaces. It’s not possible to keep the global namespace completely clean using this workaround, but it does allow us to limit ourselves to a single globally-scoped variable for all our APIs.

Before the workaround can make any sense, I need to explain a few new JavaScript concepts – _closures_, the _ternary operator_, and _self-executing anonymous functions_.

### Closures

In JavaScript, when you define a function within another function, the outer function’s scope gets baked into the inner function’s scope permanently, even when the outer function finishes executing. This capture of the external scope is referred to as a closure.

Consider the following code:

```javascript
function initClickCounter(){
  // define a variable in the outer function
  var counter = 0;

  // define an inner function that uses the above variable
  var incrementCounter = function(){
    // increment the counter (accessed via the closure)
    counter++;
    window.alert("counter = " + counter);
  }

  // add the inner function as a click handler to all paragraphs
  $('p').click(incrementCounter);
}
```

We could add this into a page as shown below:

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 24 - Example 1</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // define a function to initialise a click counter
    function initClickCounter(){
    	// define a variable in the outer function
    	var counter = 0;

    	// define an inner function that uses the above variable
    	var incrementCounter = function(){
    		// increment the counter (accessed via the closure)
    		counter++;
    		window.alert("counter = " + counter);
    	}

    	// add the inner function as a click handler to all paragraphs
    	$('p').click(incrementCounter);
    }

    // call the counter initialising function when the DOM becomes ready
    $(initClickCounter);

  </script>
</head>
<body>

<h1>Click Counter</h1>

<p>Click Me!</p>

</body>
</html>
```

The initialisation function runs exactly once – when the DOM becomes ready. When that function runs, a variable named `counter` is created and given the value `0`. This variable is created within the scope of the function (`initClickCounter()`), not within the global scope.

The next thing that happens as the function `initClickCounter()` executes is that another function is defined and stored in another locally scoped variable named `incrementCounter`. We’ll refer to this as the _inner function_, since it’s defined within another function, specifically, `initClickCounter()`, which we’ll refer to as the _outer function_.

The inner function is only defined here, not executed. However, notice that it makes use of the variable `counter`, which exists in the outer function’s scope. It does not declare this variable (no `var` in front of it); so it does not have its own copy. instead it is reaching up into its containing scope to access it. It can do this because a copy of the outer function’s scope is permanently added to the inner function using JavaScript’s _closure_ mechanism. The inner function does not get a copy of the variable; it gets a reference to it.

The last thing that happens when the outer function executes is that it adds the inner function to all paragraphs as a click handler.

Once the outer function finishes executing, the inner function has still not been executed even once. It has only been declared and added as a click handler. Were it not for closures, the variable `counter` would have vanished into the ether when the outer function finished executing, but it has not – the inner function retains a reference to it.

We can now execute the inner function by clicking on the paragraph in the page. The first time you click, the counter will have a value of `0`. It then gets incremented by `1`, and alerted. The second time you click, it will be incremented and alerted again. Notice that the count goes up. If we had declared the variable within the inner function that would not happen, it would be a fresh copy each time, but because we are using a variable from the outer function’s scope, it is the same variable each time. So the count keeps incrementing.

Closures can be difficult to understand, as they are a kind of _spooky action at a distance_ (to paraphrase Einstein), but they are absolutely vital to modern JavaScript programming.

### Objects as Pseudo-Namespaces (And the Ternary Operator)

If you were to add all your variables, functions, and prototypes directly into the global scope, you would have to chose the names for each one very carefully. If you use a generic name, you are very likely to create an incompatibility with other pieces of code. Rather than trying to pick many unique names, it’s much simpler to pick one name, give it to an object, and add all your functions, variables, and prototypes as key-value pairs within that object.

You’ve already seen this technique in action – the PBS JavaScript playground used a single object named `pbs`, into which all the available functions were added as key-value pairs. Hence you had `pbs.say()`, `pbs.inputs()`, and so on. `pbs` was a variable in the global scope that pointed to an object. That object contained a key named `say` that referenced a function to render text to the output area, and another key named `inputs` that referenced a function to read the values from the input text boxes.

This is the approach I recommend you take for all your reusable code. Choose one name that’s likely to be pretty unique, create a single object with that name, and add all your variables, functions, and prototypes as key-value pairs to that object. I suggest you choose a name that’s likely to be quite unique, and, that references you, or the organisation you work for, in some way.

Remember that there is no reason not to nest these pseudo namespaces – you could have `pbs.util.x`, `pbs.util.y`, as well as `pbs.project1.x`, and `pbs.projec1.y`, and so on.

Because my registered business name is _Bartificer_, I publish all my JavaScript APIs as `bartificer.something`. For example, I released the API that powers [subnetcalc.it](http://www.subnetcalc.it/) as `bartificer.ip`. It contains a number of prototypes for modelling IP addresses and subnets, including `bartificer.ip.IP`, `bartificer.ip.Subnet`, and `bartificer.ip.Netmask`.

If you choose this approach, your code will inevitably be split across multiple `.js` files, and any one project will only use a subset of those files. So how do you declare your object in the first place? You could declare it in a sort of master file that must be included in every project, but that is needlessly cumbersome. A better approach is to declare the object in every file, but only if it does not already exist. This can be done using the following code snippet:

```javascript
var pbs = pbs ? pbs : {};
```

At first glance this is a very odd snippet of code. Your confusion will not be helped by the fact that it makes use of an operator we have not seen before, the so-called _ternary operator_.

The ternary operator consists of three parts, hence its name:

`CONDITION ? VALUE_1 : VALUE_2`

If `CONDITION` evaluates to `true`, the entire operator will evaluate to `VALUE_1`, otherwise it will evaluate to `VALUE_2`.

For example, we could create a variable named `x`, and set it to the value of another variable named `y`, if `y` is positive, or `0` otherwise like so:

```javascript
var x = y > 0 ? y : 0;
```

You can test this in the JavaScript console. First run the following:

```javascript
var y = 4;
var x = y > 0 ? y : 0;
console.log(x);
```

Then run the following:

```javascript
var y = -3;
var x = y > 0 ? y : 0;
console.log(x);
```

Now that we understand the ternary operator, let’s look at our sample code again:

```javascript
var pbs = pbs ? pbs : {};
```

The `CONDITION` is simply `pbs`, `VALUE_1` is also `pbs`, and `VALUE_2` is a new empty object.

So, if `pbs` evaluates to `true`, then the entire operator evaluates to `pbs`; otherwise, it evaluates to a new empty object. The only way an object can evaluate to `false` is if it’s undefined. So, if the `pbs` object already exists, nothing changes, the line effectively becomes `var pbs = pbs;`. However, if the `pbs` object doesn’t exist yet, the line effectively becomes `var pbs = {};`, i.e. pbs gets created as a new object containing no keys.

### Self-Executing Anonymous Functions

The final strange beast we need to learn about before we can look at the design pattern for simulating namespaces is the so-called _self-executing anonymous function_. A self-executing anonymous function is a function that is given no name, which gets created and executed in a single step.

In JavaScript, a pair of parentheses can have three different meanings, depending on where they appear in your code. Firstly, when they appear without an name, value, or keyword directly to their left, they simply act to group things together, e.g.:

```javascript
var x = (4 + 5) * (6 - 7);
```

Secondly, many JavaScript keywords make use of parentheses – e.g. `if`, `while`, `for`, and `function`.

Finally, if a pair of parentheses containing zero or more comma-separated arguments appears directly after a name or value that is not a keyword, JavaScript will try to execute whatever is to the left of the parenthesis as a function, using the values between the parentheses as arguments to that function, e.g.:

```javascript
console.log('test');
```

`console.log` evaluates to a function (`console` is an object, and `log` is a key within that object that contains a reference to a function). By putting the parentheses containing the single argument `'test'` directly after it, we call that function with `'test'` as the only argument.

We can combine all that knowledge to form the following construction:

```javascript
(function(msg){ console.log(msg); })('test');
```

The first set of parentheses creates a group that gets evaluated first. That group contains an anonymous function, so the first set of parentheses evaluates to an function. The second set of parentheses appears directly to the right of the first, so they will execute the result of evaluating the contents of the first with `'test'` as the only argument. In other words, the anonymous function we just created gets immediately executed. You can try it for yourself in the JavaScript console.

The above construction is hard to read, and would be even harder to read if the anonymous function contained even just a few lines of code, let alone hundreds. Hence, it’s usually written over multiple lines with the following indentation:

```javascript
(function(msg){
  console.log(msg);
  // more lines of code within the self-executing
  // anonymous function could go here
})('test');
```

### A Recipe for Namespacing in JavaScript

We are now ready to look at a very common design pattern for simulating namespaces in JavaScript. I think it’s a good idea to understand what’s happening, but that’s not essential – I think many JavaScript programmers copy-and-paste this design pattern over and over again without fully understanding what’s happening.

To illustrate the technique, let’s create a very simple API that contains just one function – `helloWorld()`, and present it to the world using `pbs` as a namespace. The code below should be saved in a stand-alone `.js` file, say `pbs.helloWorld.js` (included in this instalment’s ZIP file):

```javascript
// make sure the pbs 'namespace' exists
var pbs = pbs ? pbs : {};

// define our API within a self-executing anonymous function
(function(pbs){
  // Define a 'private' variable that
  // will not exist in the global scope
  var theString = "Hello World!";

  // define our helloWorld function
  // this function uses closures to access the 'private'
  // variable theString
  pbs.helloWorld = function(){
    window.alert(theString);
  };
})(pbs);
```

We could now include our simple little API into an existing web page like so:

```html
<script type="text/javascript" src="pbs.helloWorld.js"></script>
```

Having done that, we could call the function like so:

```javascript
pbs.helloWorld();
```

For added context, let’s create a full web page that uses our simple API to generate an alert each time a paragraph is clicked (`pbs24b.html` in the ZIP file):

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 24 - Example 1</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Import our HelloWorld API -->
  <script type="text/javascript" src="pbs.helloWorld.js"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

    // add an event handler to call helloWorld each time a paragraph is clicked
    $(function(){
    	$('p').click(pbs.helloWorld);
    });

  </script>
</head>
<body>

<h1>Hello World API</h1>

<p>Click Me!</p>

</body>
</html>
```

## Auto-Generating API Documentation with JSDoc

Inspired by JavaDoc, [JSDoc](https://github.com/jsdoc3/jsdoc) is a tool for automatically generating API documentation from JavaScript source files that contain specially formatted comments.

### Installing JSDoc

JSDoc is actually written in JavaScript. The easiest way to install it is to use the [Node.js](https://nodejs.org/) JavaScript engine and its accompanying package manager, `npm`. Node is available cross platform, with simple installers for Windows and Mac. There are packaged versions available for many popular Linux distributions.

Once you’ve installed Node, you should be able to use Node’s package manager to install JSDoc. The basic form of the command will be as follows:

`npm install -g jsdoc`

The `-g` means you would like the package installed globally, i.e. system-wide. To install system-wide you need admin privileges. So on Windows you should use a command prompt run as Administrator. On Linux/macOS you should execute the command with `root` privileges, either directly or via `sudo`. For example, on my Mac I used:

`sudo npm install -g jsdoc`

You should now be able to create documentation from any javascript file with a command of the form:

`jsdoc myFile.js`

This will build a documentation website describing `myFile.js` and place all the HTML files etc. into a folder named `out` in the current directory. You can specify as many input files as you like. JSDoc will build a single unified documentation site describing them all.

We can get more control over the generated document by creating a config file. The config file should be in JSON format, that can be passed to the command line with the `-c` flag. You’ll find a copy of the config I’ll be using in the ZIP file as `jsdoc.conf.json`:

```javascript
{
	"templates" : {
		"default" : {
			"outputSourceFiles" : false
		}
	},
    "plugins": ["plugins/markdown"]
}
```

This very simple config does two things. Firstly, it sets a configuration variable on the default theme that suppresses JSDoc’s default behaviour of adding the code itself into the documentation. I find it just makes the documentation more difficult to read. If you want to see what it looks like, just change the `false` to a `true`. Secondly, it enables JSDoc’s built-in but optional Markdown plugin. When this plugin is enabled, you can use [Markdown syntax](https://daringfireball.net/projects/markdown/syntax) within JSDoc descriptions.

### JSDoc Comments

I mentioned that JSDoc looks for specially formatted comments. JSDoc will try to interpret all comments starting with `/**` and ending with `*/`. JSDoc is smart enough to ignore leading spaces and `*`s on multi-line comments. These special comments are referred to as _doc comments_. You can give a simple description of a function as you create it like so:

```javascript
/**
* Calculate the Factorial of an integer.
*/
function fact(n){
  return n > 1 ? n * fact(n - 1) : 1;
}
```

This is a very basic example that will result in very basic documentation. JSDoc supports so-called tags that allow you to add more information to your doc comments. These tags all start with the `@` symbol. I don’t want to bore you with a definitive list of all available tags. Instead, we’ll meet them organically as we go through the series. You can learn more about any tags we do mention, as well as all the other tags that exist, in the [JSDoc documentation](http://usejsdoc.org/).

To get started, let’s look at documenting functions. When using an API, a function should be like a black box, what you care about is what goes in, and what comes out. If your function expects arguments, you should specify them in order using the `@param` tag, one tag per argument, with each tag starting on a new line. Each `@param` tag should take the following form:

`@param {TYPE} ARGUMENT_NAME - DESCRIPTION`

The `TYPE` should be a valid native JavaScrip type, like `string`, `number` or `boolean`, the name of a prototype, like `Object`, or a reference to a custom type of your own creation (more on that later in the series). The `ARGUMENT_NAME` is just the name of the argument, and the description should be some text describing the argument. The type and description are optional. If you don’t want to set a description, also leave out the dash preceding it. Oh – also, if there is a description, the dash should have exactly one space before it and one space after it.

To specify what a function returns, use the `@returns` tag:

`@returns {TYPE} DESCRIPTION`

You can leave out either the type or the description if you like (but not both).

Given what we know now, let’s rewrite our sample function:

```javascript
/**
* Calculate the Factorial of a number. The factorial of a positive integer is defined as the product of all the integers between `1` and the number (inclusive). I.e. the factorial of `3` is `1 x 2 x 3`
* @param {number} n - the number to get the factorial of. It must be a whole positive number.
* @returns {number} the factorial of `n`.
*/
function fact(n){
  return n > 1 ? n * fact(n - 1) : 1;
}
```

Note that we are using Markdown syntax to mark some items for rendering as code snippets, specifically, we are using the backtick to do that.

Something else functions can do is throw exceptions. You can document this using the `@throws` tag. This tag takes the following form:

`@throws {EXCEPTION_PROTOTYPE} DESRIPTION`

Where `EXCEPTION_PROTOTYPE` is the prototype of the exception that could be thrown. If your function can throw multiple types of error, you should add multiple `@throws` tags to the doc comment.

We could rewrite our function so it throws an exception on invalid arguments as follows:

```javascript
/**
* Calculate the Factorial of a number. The factorial of a positive integer is defined as the product of all the integers between `1` and the number (inclusive). I.e. the factorial of `3` is `1 x 2 x 3`
* @param {number} n - the number to get the factorial of. It must be a whole positive number.
* @returns {number} the factorial of n.
* @throws {Error} A generic error is thrown if `n` is not a positive whole number
*/
function fact(n){
  if(!String(n).match(/^\d+$/)){
    throw new Error('invalid argument - must be a positive whole number');
  }
  return n > 1 ? n * fact(n - 1) : 1;
}
```

Finally, before we move on from functions, I also want to mention the `@example` tag, which you can use to add sample code into your documentation. This tag works over multiple lines – everything until the next tag, or, until the end of the comment is considered part of the example. Let’s rewrite our function one last time:

```javascript
/**
* Calculate the Factorial of a number. The factorial of a positive integer is defined as the product of all the integers between `1` and the number (inclusive). I.e. the factorial of `3` is `1 x 2 x 3`
* @param {number} n - the number to get the factorial of. It must be a whole positive number.
* @returns {number} the factorial of n.
* @throws {Error} A generic error is thrown if `n` is not a positive whole number
* @example
* var x = fact(4); // x = 24
*/
function fact(n){
  if(!String(n).match(/^\d+$/)){
    throw new Error('invalid argument - must be a positive whole number');
  }
  return n > 1 ? n * fact(n - 1) : 1;
}
```

As a proper worked example, let’s create documentation for our simplistic `pbs.helloWorld` API.

The first thing we should do is add a doc comment to the very top of the file. This will form the homepage of the documentation. To do that, we’ll use two tags – `@overview`, and `@author`.

Because we use namespaces, we need to tell JSDoc that it should consider `pbs` a namespace. We do that by adding a doc comment directly above our declaration of the `pbs` variable, and ending that comment with the special tag `@namespace`.

Finally, we should add a doc comment to the `helloWorld` function. Because this function expects no arguments, returns no value, and throws no exceptions, the `@param`, `@returns`, and `@throws` tags are intentionally omitted.

This is how our file now looks:

```javascript
/**
* @overview A simple sample API that contains just one function. Everything is contained within the {@link pbs} namespace.
* @author Bart Busschots
*/

// set up the PBS namespace
/**
* APIs related to the [Programming by Stealth podcast/blog series](http://bartb.ie/pbs) are grouped under this namespace.
* @namespace
*/
var pbs = pbs ? pbs : {};

// define our API within a self-executing anonymous function
(function(pbs){
  // Define a 'private' variable that
  // will not exist in the global scope
  var theString = "Hello World!";

  /**
  * Alerts the message *Hello World!*.
  * @example
  * pbs.helloWorld();
  */
  pbs.helloWorld = function(){
    window.alert(theString);
  };
})(pbs);
```

You may notice that the overview contains a JSDoc tag that I have not mentioned yet, `{@link pbs}`. This inline JSDoc tag can be used in any JSDoc description to insert a reference to a documented item. In this case, it's a link to the documentation about the `pbs` namespace.

We are now ready to generate our documentation. Start by opening a command prompt in the same folder as the `pbs.helloWorld.js` and `jsdoc.conf.json` files. From there, run the following command:

`jsdoc pbs.helloWorld.js --destination docs-helloWorld -c jsdoc.conf.json`

Assuming you extracted the contents of the ZIP file into a folder named `pbs24` in the document root of your local web server, and that your local web server is running, you should now be able to access the documentation you’ve just created at the URL `http://localhost/pbs24/docs-helloWorld/`.

## A Challenge

The challenge this time is to create a first-pass at an API for rendering a clock showing the current time in any given timezone. Before we’re ready to do that, we need to look at a JavaScript API for converting between timezones.

### A Quick Introduction to `Moment.js`

At the moment, the most powerful looking open source JavaScript library for manipulating dates is [Moment.js](http://momentjs.com). It has an extension specifically for manipulating timezones. The two JavaScript files needed to use `Moment.js`‘s timezone features are included in the contrib folder within the zip file.

As we did with URI.js, this is merely a sampler of what Moment.js can do, focusing on the features we need to achieve our goal. This is not a tutorial on Moment.js. You can find the full documentation at [momentjs.com/docs](http://momentjs.com/docs/).

We can create a moment object representing the current time in a given timezone as follows:

```javascript
var now = moment().tz('Europe/London');
```

The timezone string should be a TZ string as defined in the [IANA time zone database](https://en.wikipedia.org/wiki/Tz_database). Thankfully Wikipedia publishes [a full listing of the database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) – the value we need is in the third column.

We can then access one or more aspects of the time as a string using the `.format()` function. For example, to see the hours and minutes separated by a colon, we could use:

```javascript
var now = moment().tz('Europe/London');
console.log(now.format('HH:mm'));
```

You can get a full listing of all the formatting characters [here](http://momentjs.com/docs/#/displaying/format/), but for our assignment we only need to know the following:

```javascript
var now = moment().tz('Europe/London');
var hours = now.format('HH'); // hours in 24 hour format with a leading 0 when < 10
var minutes = now.format('mm'); // minutes with a leading 0 when < 10
```

### A Starting Point

Rather than starting with a blank canvas, start with the following two files (`pbs24-assignment.html` and `pbs.renderClock.js` in the ZIP file):

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 24 - Assignment</title>

  <!-- Import the jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>

  <!-- Import the moment.js & moment-timezone.js libraries -->
  <script type="text/javascript" src="contrib/moment.min.js"></script>
  <script type="text/javascript" src="contrib/moment-timezone-with-data.js"></script>

  <!-- Import our renderClock API -->
  <script type="text/javascript" src="pbs.renderClock.js"></script>

  <!-- Own Scripts for this page -->
  <script type="text/javascript">

  	// when the DOM loads, render our clock
  	$(function(){
  		pbs.renderClock($('#clock'), 'Europe/Dublin');
  	});

  </script>

  <!-- custom styles for this page -->
  <style type="text/css">

    /* style the clock */
    #clock{
    	font-weight: bold;
    	display: inline-block;
    	border: 1px solid green;
    	border-radius: 3px;
    	padding: 3px;
    	background-color: black;
    	color: lightgreen;
    	font-family: monospace;
    }

  </style>
</head>
<body>

<h1>The Time in Dublin</h1>

<p>Right now it's <span id="clock"></span> in Dublin (Ireland).</p>

</body>
</html>
```

You don’t need to make any changes to this file. You can use it as-is to test that your clock function is working. This file must be located in the same folder as the `contrib` folder, and the `pbs.renderClock.js` file in order to function.

```javascript
/**
* @overview A simple single-function API for inserting a clock into a web page that shows the current time in a give timezone.

This single-function API is consists solely of the function {@link pbs.renderClock} within the {@link pbs} namespace.

* @requires jQuery
* @requires moment
* @requires moment-timezone
* @author Bart Busschots
*/

// set up the PBS namespace
/**
* APIs related to the [Programming by Stealth podcast/blog series](http://bartb.ie/pbs) are grouped under this namespace.
* @namespace
*/
var pbs = pbs ? pbs : {};

// define our API within a self-executing anonymous function
(function(pbs){

  /**
  * Converts a given span into a clock showing the current time in a given time zone.
  *
  * **NOTE** this function should not be called before the DOM is ready.
  * @param {jQuery} $span - a jQuery object representing the span to be converted into a clock.
  * This argument must be a jQuery representing exactly one element, and that element must be a span.
  * @param {string} tz - a string containing a valid timezone (with any spaces replaced with `_` characers), e.g. `America/Los_Angeles` or `Europe/Dublin`.
  * @returns {jQuery} A reference to `$span`.
  * @throws {Error} A generic error is thrown if and invalid value is passed for `$span`.
  * @example
  * pbs.renderClock($('#example-clock'), 'Europe/Brussels');
  */
  pbs.renderClock = function($span, tz){
    // validate the arguments
    if(!(typeof $span === 'object' && $span instanceof jQuery && $span.length === 1 && $span.is('span'))){
    	throw new Error('the first argument must be a jQuery object representing exactly one span element');
    }

    //
    // YOUR CODE HERE
    //

    // add an interval to update the clock
    setInterval(renderTime, 60 * 1000);

    // return the span
    return $span;
  };
})(pbs);
```

The JSDoc comment describing what the function should do is already in place, as is the start and end of the function.

### The Assignment

You simply need to add the functionality into the `pbs.renderClock()` function in `pbs.renderClock.js` to make it actually do something.

How you make the function do its thing is entirely up to you, but I suggest the following basic design:

*   First, empty the span – to be sure you are working on an empty canvas, so to speak.
*   Create three spans, one for the hours, one for the minutes, and one for a separator character, and save them into three variables in `pbs.renderClock()`‘s scope, and then inject them into the span.
*   Create an inner function within `pbs.renderClock()` and give it a name. This function should get the current time, and reaching out into `pbs.renderClock()`‘s scope, use the variables there to update the hours and minutes to their currently correct value.
*   Create an interval that runs every 60 seconds and calls your inner function.
*   For bonus credit, can you make the separator blink? You might find jQuery’s [`.fadeTo()`](https://api.jquery.com/fadeTo/) function useful.

## Conclusions

We’ve learned how to use the magic of closures to package our code into reusable libraries, and we’ve learned how to use JSDoc to generate documentation for our library’s APIs. So far our APIs have been very simplistic – so simplistic some people might even argue that they don’t deserve to be called APIs at all! That will change in the next instalment, when we’ll create a powerful API for adding arbitrarily many clocks, each in any timezone, to a page in a configurable way. To do that we’ll need to learn another new concept – data attributes – a way of embedding data into an HTML element.
