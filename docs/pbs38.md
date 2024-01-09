# PBS 38 of x – Taking Stock

Since this is the first instalment back after our summer hiatus, it seems like a good time to pause and take stock. I want to look back to revise what we’ve learned to far, and to look forward to where I want to take this series next.

## Matching Podcast Episode 500

Listen Along: Chit Chat Across the Pond Episode 500

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_09_01.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_09_01.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

From a big-picture point of view, what we have learned to date is that HTML is a markup language for what is in a document – this is a heading, that’s a paragraph, this is a button, and so on; CSS is for specifying how it should be displayed; and JavaScript is for bringing the document to life, adding interactions of various kinds. We started by learning about JavaScript in the abstract, and then we learned how to use JavaScript to interact with HTML documents using the DOM with the help of the third-party jQuery library.

Along the way we’ve also learned a little about software engineering and project management, learning about useful third-party tools like QUnit for JavaScript unit testing, and JSDoc for generating documentation for JavaScript APIs.

It’s my hope that at this stage you’ve all picked up enough of an understanding of the fundamental concepts that you can now glean useful information from developer documentation. If not, then that’s a skill I strongly recommend focusing on going forward. In the real world, developers don’t remember exact HTML tag attributes, CSS style property values, or JavaScript function names. Instead they’re practiced at quickly and efficiently finding the information they need, usually online these days.

To that end, this revision post is going to stick at a high level, and then provide links to good online developer documentation that contains all the nitty-gritty details you could ever need.

## HTML

HTML is a markup language for specifying what are different elements that make up a document. This is a paragraph, this is a list, this is an image, and so on and so forth. There have been a number of versions of the HTML language released. We’ve been learning the latest of those, HTML 5.

An HTML document consists of nested elements which are described using tags. Elements come in two flavours – those that contain content and those that don’t. Those that contain content are marked up by wrapping the content between matching opening and closing tags like so:

```html
<h1>A Top-level Heading</h1>
```

Those elements that don’t have content are represented by a single tag, like the one below representing a horizontal rule:

```html
<hr />
```

All HTML elements can have attributes which take the form of name-value pairs, e.g.:

```html
<h1 class="bigdeal">An Important Heading</h1>
<img src="someFile.png" alt="some image" />
```

The majority of HTML elements fall into two main categories – _block-level elements_, and _inline elements_. Block-level elements start a new line and take up the full width of the available space by default, while inline elements only effect the rendering of sections of text within blocks. Headers, paragraphs, lists, and block quotes are examples of block-level elements, while strong, emphasised, and underlined pieces of text are examples of inline elements.

#### Links

*   The Official HTML 5 Specification – [www.w3.org/…](https://www.w3.org/TR/html5/) (surprisingly useful)
*   The HTML Reference from MDN – [developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) (my preferred HTML reference)
*   The HTML Reference from W3Schools – [www.w3schools.com/…](https://www.w3schools.com/tags/default.asp)

#### Quick Quiz

1.  Why is the following snippet invalid HTML?

    ```html
    <p>This paragraph contains <strong>some text that is bold <em>and some that is bold and italic</strong>, and some that is just italic</em>.</p>
    ```

    Answer:

    The HTML elements are not nested within one another – the `em` element is both inside and outside the `strong` element, which is not permitted by the HTML 5 spec.

2.  Consider the following HTML snippet:

    ```html
    <p>Please visit <a href="http://bartb.ie/" target="_blank" title="Bart's Site">my home page</a>, thanks!</p>
    ```

    1.  Which element is the block-level element? And which the inline element?

        Answer:

        The `p` element is the block-level element, and the `a` element the inline one.

    2.  What’s the content of the `a` element?

        Answer:

        `my home page`

    3.  What’s the value of the `a` element’s `title` attribute?

        Answer:

        `Bart's Site`

## CSS

By default, HTML is rendered very plainly with only very basic formatting. To give an HTML document some character and a look, we need to use CSS. As with HTML, there have been a number of versions of the CSS language released. We’ve been using the latest, CSS 3.

<!-- vale Vale.Repetition = NO -->

Every element in an HTML document has many _style properties_ associated with it, e.g. `font-size`, `color`, `font-family`, `border`, and many many many more. CSS allows us to specify values for these properties using _declarations_. We group these declarations into _declaration blocks_ and apply them selectively to the elements that make up a document using _selectors_.

<!-- vale Vale.Repetition = YES -->

Consider the example below:

```css
ul li{
  color: red;
  font-weight: bold;
}
```

The entire thing is a single CSS _statement_, or, more specifically, a single CSS _rule set_.

The rule set has two main parts – the _declaration block_ and the _selector_. In this case, the following is the declaration block:

```css
{
  color: red;
  font-weight: bold;
}
```

And the selector is simply `ul li`.

The declaration block contains two declarations, specifically `color: red;` and `font-weight: bold;`. Each of these declarations is made up of a CSS property name and a value; so `color` and `font-weight` are CSS property names, and `red` and `bold` are values.

The entire statement has the effect of specifying that text within list items within unordered lists should be red and bold.

It’s normal to have overlapping selectors, and hence, multiple possible values for a given property for a given element. CSS resolves these conflicts using _specificity_. The value specified in the declaration block accompanying the selector with the greatest specificity wins. Broadly speaking the global selector (`*`) has the lowest specificity, tag names are more specific, classes even more specific, and IDs the most specific. Two classes is more specific than one class, but still less specific than even one ID.

#### Links

*   The Official Latest CSS Specification – [www.w3.org/…](https://www.w3.org/TR/css-2017/) (much less useful than the official HTML spec)
*   The CSS Reference from MDN – [developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
*   The CSS Reference from W3Schools – [www.w3schools.com/…](https://www.w3schools.com/cssref/default.asp) (my preferred CSS reference)

#### Quick Quiz

Given the following CSS snippet:

```css
p{
  color: gray;
}

strong{
  color: blue;
}

p strong{
  color: green;
}

strong.vip{
  color: red;
  font-weight: bold;
}
```

1.  How many CSS statements does the snippet contain?

    Answer:

    four

2.  How many CSS declarations does the snippet contain?

    Answer:

    five – one in each of the first three statements, and two in the last.

3.  What is `color`?

    Answer:

    a style property

4.  What is `bold`?

    Answer:

    a value

5.  If the CSS snippet above were the sum total of all the CSS applied to an HTML document, what colour would text in a paragraph be?

    Answer:

    gray

6.  If the CSS snippet above were the sum total of all the CSS applied to an HTML document, what colour would strong text in a paragraph be, and why?

    Answer:

    green, because the `p strong` selector has more specificity than the `strong` selector.

7.  If the CSS snippet above were the sum total of all the CSS applied to an HTML document, what colour would strong text in a paragraph be if the strong element had the class `vip`, and why?

    Answer:

    red, because the `strong.vip` selector has more specificity than the `p strong` selector because classes outrank element names, even when there are two element names up against just one class.

## JavaScript

### The Core Language

Again, as with HTML and CSS, there have been many different versions of JavaScript over the year. For now, we have been using the version of JavaScript officially named _ECMA Script 5_, which is more commonly known as just ES5.

In JavaScript, variables can hold one of two things – a primitive value or a reference to an object. Primitive values can be booleans, numbers, or strings. That means that, in JavaScript, everything that’s not a boolean, a number, or a string is an object, including arrays, functions, and regular expressions. Plain objects are simply collections of name-value pairs. Objects can have an associated prototype, which means they gain extra name-value pairs provided by that prototype. In the version of JavaScript we’ve been using (ES5), you declare a variable using the `var` keyword, and you create instances of prototypes using the `new` keyword.

JavaScript supports the normal array of operators including the assignment operator `=`, arithmetic operators like `+`, `-`, `*` & `/`, comparison operators like `==`, `!=`, `<` & `>`, and boolean operators like `!`, `&&` & `||`.

Because JavaScript is a loosely typed language, the concept of equality is not as straightforward as you might expect. The `==` operator checks if two values are the same, regardless of their type, while `===` will only consider them the same if both their value and their type match. In other words, the string `'4'` and the number `4` are considered equal by `==`, but not by `===`.

It’s also vital to remember that both `==` and `===` compare object references, not object contents, so an object is only considered equal to itself, not to anything else.

When it comes to controlling the flow of control JavaScript provides the expected keywords – `if...else`, `while`, `do...while`, and `for`.

JavaScript provides two syntaxes for declaring functions:

```javascript
function functionName(arg1Name, arg2Name){
  // function content goes here
}
```

And:

```javascript
var nameOfFunction = function(arg1Name, arg2Name){
  // function content goes here
};
```

The latter syntax allows functions to be created without ever being given a name. We refer to these as _anonymous functions_.

Variables declared within a function do not exist outside the function, but variables declared outside a function can be accessed from inside it.

Because functions are objects, reference to functions can be stored in variables and passed as arguments to other functions. A reference to one function passed as an argument to another is often referred to as a _callback_.

Remember that the names you choose to give function parameters are effectively variable declarations made within the function’s scope.

JavaScript supports exception handling with the `try...catch` and `throw` keywords.

We’ll be looking at jQuery in detail in a moment, but we have also encountered a number of other third-party JavaScript libraries, including [URI.js](https://medialize.github.io/URI.js/) for URL manipulation, [moment.js](http://momentjs.com/) for timezone-aware date/time manipulation, [QUnit](https://qunitjs.com/) for testing, and [JSDoc](http://usejsdoc.org/) for documentation generation.

#### Links

*   The JavaScript Reference from MDN – [developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) (my preferred JavaScript reference)
*   The JavaScript & DOM Reference from W3Schools – [www.w3schools.com/…](https://www.w3schools.com/jsref/)
*   The URI.js API Docs – [medialize.github.io/…](https://medialize.github.io/URI.js/docs.html)
*   The moment.js API Docs – [momentjs.com/…](http://momentjs.com/docs/)
*   The QUnit API Docs – [api.qunitjs.com](http://api.qunitjs.com/)
*   The JSDoc API Docs – [usejsdoc.org](http://usejsdoc.org/)

#### Quick Quiz

1.  Given the following code snippet:

    ```
    var x = {
      a: 'b',
      c: ['d', 'e', 'f', ['h', 'i']],
      j: function(){
        console.log(this.c[3][0]);
      }
    };
    ```

    1.  What will be the output from: `console.log(x['a'])`?

        Answer:

        `b`

    2.  What will be the output from: `console.log(x.a)`?

        Answer:

        `b`

    3.  What will be the output from: `console.log(x.c.length)`?

        Answer:

        `4`

    4.  What will be the output from: `console.log(x['c'][3].length)`?

        Answer:

        `2`

    5.  What will be the output from: `x.j()`?

        Answer:

        `h`

2.  What will the following code snippet print to the console, and why?

    ```javascript
    var x = 4;
    function doSomething(){
      var x = 5;
      console.log(x);
    }
    console.log(x);
    doSomething();
    ```

    Answer:

    4 and then 5, because while the function is declared before the first `console.log`, it is not called until after the first `console.log`, and it will not execute until it is run.

3.  What will the following code snippet print to the console, and why?

    ```javascript
    var x = 4;
    function doSomething(x){
      console.log(x);
    }
    console.log(x);
    doSomething(5);
    ```

    Answer:

    4 and then 5, because the `x` within the function is the value passed as the first argument when the function is called, it is effectively declared within the function, so for all code within the function, `x` refers to the first argument, not the completely unrelated globally scoped variable with the same name.

4.  What will the following code snippet print to the console, and why?

    ```javascript
    var x = 4;

    (function(){
      var x = 5;
      console.log(x);
    })();
    ```

    Answer:

    5, because the `x` declared in the function’s scope replaced the `x` declared outside the function for all statements within the function.

### jQuery

Throughout this series we have been using the third-party free and open source jQuery library to interact with the so-called Document Object Model, or DOM. The DOM is a collection of JavaScript objects assembled by the browser that represent the elements that make up an HTML document. It is possible to directly manipulate the DOM using just the core JavaScript APIs, but there’s a reason a whole range of third-party DOM-manipulation APIs like jQuery have been developed over the years – direct DOM manipulation is tedious!

When you import the jQuery library into your HTML document, it presents its entire API through a function named `jQuery`, and, by default, an alias for that function named `$`. jQuery uses CSS-style selectors to search the DOM, and HTML-style strings to create new HTML elements. It’s this leveraging of existing skills that explains jQuery’s popularity among web developers.

#### Links

*   The jQuery API Docs – [api.jquery.com](http://api.jquery.com/)

## Future Plans

Over the next few episodes I want to finish our look at HTML forms, and to finish our Cellular Automata prototypes. That will bring us to a fairly major milestone, having covered all the HTML and CSS I plan to cover in the series.

It should be an even bigger milestone, because I was hoping to be able to say that we would also have covered all of the core JavaScript language that we needed to, but alas, I can’t say that. Why? Because during the many months that have elapsed since we started our look at JavaScript, two new versions of the language have been released! We have been learning ECMA Script version 5, AKA ES5, but ES6 was finalised a little over a year ago, and ES7 was finalised a few months ago. Today, ES7 doesn’t have comprehensive browser support yet, but ES6 does. So we need to learn about the cool new features ES6 brought to the JavaScript language. The single biggest change is probably the introduction of the `class` keyword, giving JavaScript developers a more human-friendly syntax for defining their prototypes.

Something else I want to do in the very near future is introduce the Bootstrap 4 framework – this is free and open source CSS+JavaScript framework that makes it very easy to create responsive web pages that look great on all screen sizes.

Once we’ve learned about ES6 and Bootstrap, it will be time to embark on a nice big project to give us plenty of opportunities for putting all we’ve learned into practice. I have a few different ideas in mind for fun projects, but I haven’t made any decisions yet.

All that will easily tide us over into 2018, by which time we’ll be ready to make the paradigm shift from writing client-side code to writing server-side code. We’ll be doing that with NodeJS. Node already has great ES7 support. So we’ll start our exploration of Node by learning about the new features ES7 brings to JavaScript, particularly the concept of _promises_.

<!-- vale Vale.Repetition = NO -->

Learning server-side development with Node is likely to take many many months. My plans beyond that are not really plans, more ideas. Two things I would like to cover at that stage are databases and source control systems like GIT. Next, I think it might be good to learn another language other than JavaScript. My current thinking is to look at the most common server-side language, PHP.

<!-- vale Vale.Repetition = YES -->

We’ve learned a lot together over the last 37 instalments, but there is so much more for us to explore, so have no fear, this series is nowhere near winding down yet!

 - [← PBS 37 — JSDoc Demo](pbs37)
 - [Index](index)
 - [PBS 39 — HTML5 Form Validation →](pbs39)
