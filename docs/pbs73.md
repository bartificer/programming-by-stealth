# PBS 73 of X — Mustache Templates

In [the previous instalment](https://bartificer.net/pbs72) we took our first look at using templates with JavaScript to create cookie-cutter content like Toast notifications more easily than building them up piece-by-piece with jQuery. We started our exploration of the topic with a look at HTML5’s new `<template>` tag. In this instalment we’ll introduce a third-party templating tool, [Mustache](http://mustache.github.io), and see how it can take our templates to the next level with concepts like conditional and looped sections.

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/03/pbs73.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs73.zip).

# Matching Podcast Episode 585

Listen along to this instalment on [episode 585 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/03/ccatp-585/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_03_09.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_03_09.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 72 Challenge Solution

The challenge set at the end of the previous instalment was quite straight forward — update your timer app so it uses an HTML 5 template to construct the Toast notifications rather than building them up from scratch with jQuery.

You’ll find my full solution in the folder `pbs72-challenge-solution` in this instalment’s ZIP file.

The first step was simply to define a template. I added the following near the top of the `<body>` tag:

```html
<!-- The template for the Toasts -->
<template id="toast_tpl">
  <div class="toast" role="status" aria-atomic>
    <div class="toast-header">
      <strong></strong>
    </div>
    <div class="toast-body"></div>
  </div>
</template>
```

Remember, `<template>` tags have to be direct children of the `<body>` tag, so while they don’t have to go at the top or bottom of the `<body>`, they can’t be contained within other tags within the `<body>`.

With that done it was just a matter of updating my `showToast()` function to make use of this newly defined template:

```javascript
// a function for popping up a toast
function showToast(t, msg){
  // clone the toast template
  const $toast = $(document.importNode($('#toast_tpl').get(0).content, true).children);

  // inject the title & message
  $('.toast-header strong', $toast).text(t);
  $('.toast-body', $toast).text(msg);

  // add the toast to the toast rack
  $('#toast_rack').append($toast);

  // initialise the toast plugin on the toast
  $toast.toast({ autohide: false });

  // add an event handler to automatically delete the toast when it hides
  $toast.on('hidden.bs.toast', function(){
    $(this).remove();
  });

  // finally show the toast
  $toast.toast('show');
}
```

That was all that needed to be done!

## String-based Templates

In the previous instalment we met the HTML 5 `<template>` tag. This allows us to create clone-able chunks of HTML that are not considered part of the document by the browser. The key point is that these are not strings, they are collections of DOM objects.

The common third-party templating libraries work very differently to the `<template>` tag, they work with strings. A string goes in, and a new string comes out. That means they can be used for anything stringy, while `<template>` tags are for HTML snippets only.

## Introducing Mustache Templates

My current preferred templating language is Mustache. I like it because it’s simple, yet has all the features I need, because it has a syntax I like, and because it has very broad language support. You can see the full list of supported languages at [mustache.github.io](https://mustache.github.io), but it includes all the currently hip languages like Ruby, Python, PHP, Perl, Swift, Objective-C, C, C++, Java, and of course JavaScript!

Regardless of which language you use Mustache with, the big-picture process is always the same — the Mustache rendering function takes (at least) two inputs, a template string and an object containing data, and produces a string as output. Template plus data in, string out.

### Getting Started with Mustache.js

As we’ll learn later, the normal way to get a copy of Mustache is to use a JavaScript package manager like NPM, but we’ve not arrived there just yet, so we’ll import Mustache in the same way we’ve imported every other third-party JavaScript library we’ve used to date — using a `<script>` tag to load the library from a CDN (content delivery network).

There is no official Mustache CDN, but it is available from many reputable CDNs, including the very popular [cdnjs](https://cdnjs.com):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js" integrity="sha256-srhz/t0GOrmVGZryG24MVDyFDYZpvUH2+dnJ8FbpGi0=" crossorigin="anonymous"></script>
```

(You can use this link to get the then latest version in future: [cdnjs.com/libraries/mustache.js/](https://cdnjs.com/libraries/mustache.js/))

The script tag above will add the Mustache API into the global name space as `Mustache`. The main function provided by the API is `.render()`, which turns templates plus data into strings. This function takes at least two arguments — a template string, and a so-called _view_. The view is simply an object (collection of name-value pairs) containing the data to be merged into the template.

Let’s see it in action with a very simple example (copy and paste into the JavaScript console on any page that has imported the Mustache API, e.g. `pbs73a.html` from the ZIP file):

```javascript
const greetingTpl = "Hi there {{name}} the {{nationality}}!";
const personView1 = {
  name: 'Bart',
  nationality: 'Belgian'
};
console.log(Mustache.render(greetingTpl, personView1));
```

The above will log:

> Hi there Bart the Belgian!

As you can see, Mustache uses double curly braces as its delimiter, hence the name. To include a value from the view in the template’s output simply put its name within the view object inside a _‘mustache’_ (set of double curly braces).

Because Mustache was built with the web in mind, it takes care of HTML escaping special character for you. You can see this automatic escaping in action with this simple example:

```javascript
const mottoTpl = 'As {{name}} says "{{motto}}"';
const personView2 = {
  name: 'Bart',
  motto: "live & learn!"
};
console.log(Mustache.render(mottoTpl, personView2));
```

The above will log:

> As Bart says “live &amp; learn!”

This is usually what you want, but not always. You can disable HTML escaping by using triple curly braces:

```javascript
const unEscapedMottoTpl = 'As {{{name}}} says "{{{motto}}}"';
const personView3 = {
  name: 'Bart',
  motto: "live & learn!"
};
console.log(Mustache.render(unEscapedMottoTpl, personView3));
```

The above will log:

> As Bart says “live & learn!”

## Storing Your Templates

To really get the most out of templating you need to be able to easily write big templates without having to jump through hoops. Plain JavaScript strings are fine for simple demos, but are just not good enough in the real world. When it comes to templates in JavaScript, we have two big-picture options at our disposal. We can define the template within the HTML document somehow, or we can define it externally and use JavaScript to fetch it for us when needed. In this instalment we’ll stick to the first option, but in the next instalment we’ll use templates as an excuse to learn a very important technique — AJAX (Asynchronous JavaScript and XML).

### Hacking `<script>` Tags to Store Template Strings

When a browser meets a `<script>` tag with a MIME type it doesn’t recognise as executable, the spec says it should neither execute nor display the content. However, the tag is still part of the document, so its still in the DOM, so while it’s visually invisible, it’s still accessible using JavaScript’s DOM API (and hence also via jQuery). We can (ab)use this quirk of the specification to embed template strings into our HTML documents.

The way this works is that you put your template string inside a `<script>` tag with a non-executable MIME type and an ID. The MIME type can be just about anything other than `text/javascript`. Some people like to use descriptive MIME types like `type="text/html"` or `type="text/plain"`, and others like to use entirely invented MIME types prefixed with an `x-`. For Mustache you’ll often see the MIME type `x-tmpl-mustache`.

Regardless of the MIME type you use, you access the template string using jQuery’s `.html()` function.

This is the technique we’ll be using for the remainder of this instalment, and you can see it in action in the file `pbs73a.html` in this instalment’s ZIP.

In the main body of the file you’ll find a placeholder `<div>` into which the template will be rendered:

```html
<div id="pbs73_tpl_placeholder"></div>
```

Near the bottom of the file you’ll find the template definition:

```html
<!-- Define the Template String -->
<script type="text/html" id="pbs73_tpl">
  <p>As {{name}} the {{nationality}} would say, "{{motto}}"</p>
</script>
```

You’ll find the view object defined in the global scope inside a regular script tag:

```javascript
// define the view
const personView = {
  name: "Bart",
  nationality: 'Belgian',
  motto: 'live & learn!'
};
```

Finally, you’ll find the rendering of the template in a jQuery document ready event handler:

```javascript
// a jQuery Document Ready Event Handler
$(function(){
  // render the template
  $('#pbs73_tpl_placeholder').html(Mustache.render($('#pbs73_tpl').html(), personView));
});
```

That JavaScript statement could use some breaking down, so let’s refactor it so we can see its three distinct parts more clearly:

```javascript
// get the template string from the script tag
const tplString = $('#pbs73_tpl').html();

// render the template with the view
const tplOutput = Mustache.render(tplString, personView);

// write the output into the placeholder div
$('#pbs73_tpl_placeholder').html(tplOutput);
```

In the real world you would of course write it as one statement, as originally shown.

## Demo File — pbs73b.html

For the remainder of this instalment we’ll be referring to examples in the file `pbs73b.html` from this instalment’s ZIP. The examples all make use of two view objects, one named `bart`, and one named `allison`. Each samples template will be rendered twice, once with each view object. Below are the definitions of the two view objects:

```javascript
const bart = {
  name: {
    first: 'Bart',
    last: 'Busschots'
  },
  pronoun: 'he',
  nationality: 'Belgian',
  motto: 'live & learn!',
  languages: ['English', 'Dutch', 'Irish', 'French'],
  languageList: function(){ return hJoin(this.languages); },
  podcasts: [
    {
      name: "Let's Talk Apple",
      url: "https://lets-talk.ie/apple",
      abbreviation: 'LTA'
    },
    {
      name: "Let's Talk Photography",
      url: "https://lets-talk.ie/photo",
      abbreviation: 'LTP'
    },
  ]
};
const allison = {
  name: {
    first: 'Allison',
    last: 'Sheridan'
  },
  pronoun: 'she',
  nationality: 'American',
  motto: "What's the problem to be solved?",
  languages: ['English'],
  languageList: function(){ return hJoin(this.languages); },
  podcasts: [
    {
      name: "The NosillaCast",
      url: "https://www.podfeet.com/blog/category/nosillacast/",
      abbreviation: 'NC'
    },
    {
      name: "Chit Chat Across the Pond",
      url: "https://www.podfeet.com/blog/category/ccatp/",
      abbreviation: 'CCATP'
    },
  ],
  facebook: 'https://podfeet.com/facebook'
};
```

## Variables in Mustache Templates

As we’ve already seen, you can include the value of a key within the view by enclosing its name in a _mustache_.

In our examples so far the view objects have been very simplistic — just simple collections of name-value pairs where each value is a string. In the real world, you views will be more complex than that. The values do not have to be strings! They can of course be numbers or booleans too, but they can also be objects. You’ll notice that in our example views the names are not single strings, but nested objects indexed by `'first'` and `'last'`. How do we include the first name in our template? Simple, we use JavaScript’s dot notation, so we can get the first name with `'{{name.first}}'`, and the last name with `'{{name.last}}'`.

We can use the same technique to access properties within any object, even built-in objects like arrays. Our sample views define an array of strings named `languages`, we can access the number of languages the person speaks with `'{{languages.length}}'`.

A value in a view can also be a function. When you try to add a value to a template, and that value is a function, Mustache will execute the function with no arguments, and the functions special `this` variable set to the view object, and insert the returned value into the output. You can see an example of this in `pbs73b.html` where the view objects define a key named `languageList` which is a function that joins all the elements in the languages array into a single string and then returns it.

The template `vars_tpl1` in `pbs73b.html` illustrates all of the above:

```html
<!-- Demo 1: Variables -->
<script type="text/html" id="vars_tpl1">
  <p>{{name.first}} {{name.last}} is {{nationality}} and {{pronoun}} produces {{podcasts.length}} podcasts.</p>
  <p>{{name.first}} speaks: {{languageList}}</p>
</script>
```

## Sections in Mustache Templates

**Note:** this section was revised to improve its wording when working on the next instalment. The matching podcast episode does not use the term _template key_.

Within a Mustache template a section is a part of the template between special starting and ending Mustache tags. You can use sections in two ways — to conditionally include parts of your template in the output, or, to loop parts of your template so they appear multiple times in the output.

A section is controlled by a variable (a key within in the view object), and the name of the variable is used both to start and end the section. To start a section, pre-fix the variable name with the `#` symbol inside a _mustache_, and to end it pre-fix the same variable name with a `/` inside the another _mustache_. E.g. if we had a key named `boogers` in our view object, then we would start a section controlled by the value of `boogers` with `{{#boogers}}`, and end the section with `{{/boogers}}`.

The Mustache documentation describes the variable controlling a section as the _section key_.

### Conditional & Inverted Conditional Sections

If value of a variable controlling a section is `undefined`, `null`, `false`, `0`, `NaN`, or an empty array, then the section will be omitted from the output. If the value is anything else other than a non-empty array or a function, it will be included in the output exactly once (we’ll come back to non-empty arrays shortly, and functions in the next instalment).

For convenience, you can access the contents of the variable controlling the section from within the section using the special variable name `.`.

You can invert the logic of a conditional section by using a `^` instead of a `#` when starting the section.

You can combine these types of section to create if/else logic in your templates. You can see an example of this in `cond_tpl1` in `pbs73b.html`.

```html
<!-- Demo 2: Conditional Sections -->
<script type="text/html" id="cond_tpl1">
  <p>
    {{#facebook}}
      You'll find {{name.first}}'s Facebook Group <a href="{{{.}}}" target="_blank" rel="noopener">here</a>.
    {{/facebook}}
    {{^facebook}}
      {{name.first}} does not have a Facebook Group.
    {{/facebook}}
  </p>
</script>
```

### Looped Sections

If the variable controlling a section is a non-empty array, then the section will be rendered once for each entry in the array, and the content of the current array element will be used as the view object when rendering each iteration of the section. If the array contains strings then the value of the string is accessible as the variable `.`.

You can see both a loop over an array of strings, and a loop over an array of objects in `loop_tpl1` in the file `pbs73b.html`.

```html
<!-- Demo 3: Looped Sections -->
<script type="text/html" id="loop_tpl1">
  <p>{{name.first}} Speaks the following languages:</p>
  <ul>
    {{#languages}}
      <li>{{.}}</li>
    {{/languages}}
  </ul>

  <p>{{name.first}} produces the following podcasts:</p>
  <ul>
    {{#podcasts}}
      <li>
        <a href="{{{url}}}" target="_blank" rel="noopener">{{name}}</a> ({{abbreviation}})
      </li>
    {{/podcasts}}
  </ul>
</script>
```

## A Challenge

Using either your solution to the previous challenge or mine, update it to use Mustache Templates when generating the toast notifications.

## Final Thoughts

Believe it or not, we’ve now learned almost everything there is to know about Mustache templates. They do support a few more advanced features, but not many, and we’ll look at two of them next time, sub-templates/includes and section functions.

While it’s often convenient to embed template strings directly into your HTML document, there are times when it would be much more convenient to store the templates externally, perhaps in a database, or perhaps in a separate file. Either way, to do this you need the ability to ask the browser to fetch some additional data for you after the page has loaded. This is very powerful and very heavily used technique known as AJAX, and Mustache templates give us the perfect excuse to learn about them, so that’s where we’ll be going after we learn about sub-templates and section functions.
