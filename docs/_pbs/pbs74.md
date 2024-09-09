---
title: More Mustaches
instalment: 74
creators: [bart, allison]
date: 2019-03-24
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_03_24.mp3
---

In [the previous instalment](https://pbs.bartificer.net/pbs73) we got our first look at [Mustache templates](http://mustache.github.io). In this instalment we’ll finish our look at this handy little third-party library with a look at some of Mustache’s more advanced features. This will set us up perfectly to finally introduce AJAX into this series. This is an extremely common technique for fetching external resources with JavaScript. We’ll learn how to use AJAX to fetch both Mustache template strings and JSON data from URLs.

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/03/pbs74.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs74.zip).

## Matching Podcast Episode 587

Listen along to this instalment on [episode 587 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/03/ccatp-587/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_03_24.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_03_24.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 73 challenge Solution

The challenge set at the end of the previous instalment was quite straightforward: rewrite the simple timer app we’ve been working on for the past few challenges so that it uses Mustache templates rather than the HTML5 `<template>` tag.

The first thing to do was to load the Mustache library into the document:

```html
<!-- Include Mustache.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js" integrity="sha256-srhz/t0GOrmVGZryG24MVDyFDYZpvUH2+dnJ8FbpGi0=" crossorigin="anonymous"></script>
```

With Mustache now available in the document, the next step was to update the template for the toasts so it’s contained within a `<script>` tag with a non-executable MIME type (I chose `text/html`) and an ID rather than a `<template>` tag with an ID. Then it was just a matter of inserting the Mustache placeholders for injecting the content from the view object. I chose to use the names `title` and `message`:

<!-- {% raw %} -->
```html
<!-- The template for the Toasts -->
<script type="text/html" id="toast_tpl">
  <div class="toast" role="status" aria-atomic>
    <div class="toast-header">
      <strong>{{title}}</strong>
    </div>
    <div class="toast-body">{{message}}</div>
  </div>
</script>
```
<!-- {% endraw %} -->

Then it was just a matter of updating my `showToast()` function so it loaded the template from the newly created `<script>` tag, and used Mustache to process it:

```javascript
// a function for popping up a toast
function showToast(t, msg){
  // fetch a copy of the template string
  const toastTpl = $('#toast_tpl').html();

  // build a view object
  const toastView = {
    title: t,
    message: msg
  }

  // build a toast from the template with the view
  const $toast = $(Mustache.render(toastTpl, toastView));

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

## More on Mustache Sections
In the previous instalment we learned how to use so-called Mustache sections to show include or exclude content depending on whether or not a given variable in the view had a _truthy_ value. We also saw how we could use sections to loop parts of a template multiple times.

A section to be included if the view variable `boogers` has a _truthy_ value (and is not an array) would start with `{% raw %}{{#boogers}}{% endraw %}` and end with `{% raw %}{{/boogers}}{% endraw %}`. Similarly, a section to be shown only if `boogers` is neither an array nor a `truthy` value would start with `{% raw %}{{^boogers}}{% endraw %}` and end with `{% raw %}{{/boogers}}{% endraw %}`. Finally, if our view contained an array named `boogerList`, we could repeat a section of the template once for each value in the array by starting the section with `{% raw %}{{#boogerList}}{% endraw %}` and ending it with `{% raw %}{{/boogerList}}{% endraw %}`.

Last time we described the view variables (`boogers` and `boogerList` in this case) as _controlling_ the sections. The official term for these section-controlling variables in the Mustache documentation is _section key_. That is, in the above examples, the section keys were `boogers` and `boogerList`.

_**Note:** when first published, the previous instalment did not use the phrase **section key**, but it has since been updated to use that term._

## Functions as Mustache Section Keys

We saw in the previous instalment that Mustache does something special when a section key is an array — it loops the section once for each element in the array.

We also saw last time that, if you include a view variable that is a function, Mustache will execute the function and use the returned value. We can take this a step further by using a function as a section key.

There is an unexpected second level of indirection here, so pay close attention. To use a function to process the content of a section, you need to have the section key be a function that returns a function that returns a string. The innermost function will get called with two arguments:

1.  The raw template text contained within the section
2.  A special render function which takes just one argument, a Mustache template string, and renders it using the current view object.

And, the output of that innermost function will be used to represent the section in the template output.

This sounds a little confusing; so let’s illustrate how this works with an example.

### Function as Section Key Example — Rendering Temperatures

These example code snippets can be executed in the JavaScript console on any page that includes the Mustache API, e.g. `pbs74a.html` in this instalment’s ZIP file.

Let’s start with the following simple view:

```javascript
const demoView1 = {
  place: "LA",
  tempC: 22 // temperature in degrees C
};
```

We’d like to use it to render the following output:

> It will be 72°F (22°C) in LA tomorrow.

Without using functions, the closest we could get would be the following:

```javascript
{% raw %}Mustache.render('It will be {{tempC}}&deg;C in {{place}} tomorrow.', demoView1);{% endraw %}
```

Which would render:

> It will be 22°C in LA tomorrow.

Close, but not what we want.

Let’s start by creating a function for converting a Celsius temperature to the desired representation:

```javascript
function degCToHumanTemp(degC){
  const degF = Math.round((degC * 1.8) + 32);
  return `${degF}°F (${degC}°C)`;
}
```

Now let’s update our view to offer this function as a section key:

```javascript
const demoView2 = {
  place: "LA",
  tempC: 22, // temperature in degrees C
  humanTemp: function(){
    return function(rawText, render){
      return degCToHumanTemp(render(rawText));
    }
  }
};
```

Note that our section key, `humanTemp`, is a function that returns a function that returns a string.

We can now use `humanTemp` as a _section key_:

```javascript
{% raw %}const demoTpl2 = 'It will be {{#humanTemp}}{{tempC}}{{/humanTemp}} in {{place}} tomorrow.';
Mustache.render(demoTpl2, demoView2);{% endraw %}
```

This will now render:

> It will be 72°F (22°C) in LA tomorrow.

So how does this work? When the anonymous function defined in the view is called, it returns another anonymous function which Mustache then executes. This innermost anonymous function gets called with two arguments. The first argument, which we have named `rawText`, will be the raw template text within the section, i.e. `{% raw %}{{tempC}}{% endraw %}`. The second argument, which we have named `render`, will be a special rendering function with the view baked in. So, to get the number to be converted to our nice representation, we render the raw template text with: `render(rawText)`. We can then pass this to our temperature rendering function `degCToHumanTemp()`.

If the conversion is only needed once, it doesn’t make sense to add it to the view as a function, but if you need it more than once, it starts to make more sense:

```javascript
{% raw %}const tempView3 = {
  place: "LA",
  minC: 18, // temperature in degrees C
  maxC: 28, // temperature in degrees C
  humanTemp: function(){
    return function(rawText, render){
      return degCToHumanTemp(render(rawText));
    }
  }
};

const tempTpl3 = 'It will be between {{#humanTemp}}{{minC}}{{/humanTemp}} and {{#humanTemp}}{{maxC}}{{/humanTemp}} in {{place}} tomorrow.';

Mustache.render(tempTpl3, tempView3);{% endraw %}
```

This will render:

> It will be between 64°F (18°C) and 82°F (28°C) in LA tomorrow.

You can see a version of the above example in the file `pbs74a.html` in this instalment’s ZIP file.

## Mustache Partials — Templates within Templates

Within a larger project you may find you have little snippets of markup that appear in many places. The simplest thing to do would be to copy-and-paste them into every template that needed them. Of course, that leads to utterly unmaintainable code. It would be nice to be able to include little named sub-templates from within larger templates. Mustache Partials to the rescue!

Mustache takes an optional third argument, a plain object containing template strings indexed by names. If your partials object contained a partial named `boogers`, you would include it in your main template with the Mustache `{% raw %}{{> boogers}}{% endraw %}`.

Let’s see this in action with a pair of examples. You can see these in their full context in the file `PBS74b.html` in this instalment’s ZIP file.

First, let's create two partials, one for links to external sites and one for a ‘new’ badge.

```javascript
{% raw %}const pbs74bPartials = {
  extLink: '<a href="{{{url}}}" target="_blank" rel="noopener noreferrer">{{text}} <i class="fas fa-external-link-alt"></i></a>',
  newBadge: '<span class="badge badge-pill badge-danger">New!</span>'
};{% endraw %}
```

We can now use these partials in our templates. Let’s start with the following template:

<!-- {% raw %} -->
```html
<script type="text/html" id="pbs74b_tpl1">
  <p>{{> newBadge}} You can now join Allison's wonderful Nosillacastaways community on {{> extLink}}!</p>
</script>
```
<!-- {% endraw %} -->

We can now use this partials-containing template like so:

```javascript
// render the first demo template
$('#pbs74b_tpl1_placeholder').html(Mustache.render(
  $('#pbs74b_tpl1').html(), // the template
  { // the view object
    text: 'Slack',
    url: 'https://www.podfeet.com/slack'
  },
  pbs74bPartials // the partials object
));
```

We can, of course, use these same partials in other templates within the same document.

Let’s start by defining another template:

<!-- {% raw %} -->
```html
<script type="text/html" id="pbs74b_tpl2">
  <p>These are the most important 3<sup>rd</sup> party libraries this series relies on:</p>
  <ol>
    {{# jsLibs}}
      <li>
        {{> extLink}}{{# new}}&nbsp;{{> newBadge}}{{/ new}}
      </li>
    {{/ jsLibs}}
  </ol>
</script>
```
<!-- {% endraw %} -->

Note that this template is intended to loop over a view variable named `jsLibs`, and that the `newBadge` partial is included in a conditional section controlled by the view variable `new`.

We can now use this template as follows:

```javascript
// render the second demo template
$('#pbs74b_tpl2_placeholder').html(Mustache.render(
  $('#pbs74b_tpl2').html(), // the template
  { // the view object
    jsLibs: [
      { text: 'jQuery', url: 'http://jquery.com/' },
      { text: 'Bootstrap', url: 'https://getbootstrap.com/' },
      { text: 'Mustache', url: 'http://mustache.github.io', new: true }
    ]
  },
  pbs74bPartials // the partials object
));
```

You can see what both of these templates look like when rendered by opening `pbs74b.html` from the ZIP file in your favourite browser.

## Embedding View Data as JSON Strings

The trick for using `<script>` tags with non-executable types to store template strings can be adapted to store view data in JSON format.

As with template strings, you can use any `type` you like in your `<script>` tag, but I prefer to use the correct MIME Type for the data I’m storing. The appropriate MIME Type for JSON is `application/json`. So I use `<script>` tags of the following form (replacing the content of the tag and the ID as appropriate):

```html
<script type="application/json" id="some_id">
  {
    "some": "data"
  }
</script>
```

We can then access the embedded JSON string using jQuery’s `.text()`. function, e.g.

```javascript
const jsonString = $('#some_id').text();
```

As we learned way back in [instalment 17](https://pbs.bartificer.net/pbs17), the JavaScript function for converting a JSON string into a JavaScript object is `JSON.parse()`. So we can go directly from an ID to a JavaScript object with code of the form:

```javascript
const jsObject = JSON.parse($('#some_id').text());
```

If your JSON has gotten a little rusty, you might find my [Quick Introduction to JSON](https://www.bartbusschots.ie/s/2015/08/08/json-a-quick-intro/) useful.

## A Challenge

In this instalment’s ZIP file, you’ll find a folder named `pbs74-challenge-startingPoint`. Use this file as your starting point for this challenge.

Note that this file imports jQuery, Bootstrap, Mustache, and FontAwesome 5.

Near the top of the file you’ll find a `<script>` tag with the ID `pbs74_view_data`. This is an embedded JSON string containing the data to be rendered. At the top level of the object, you’ll find objects representing myself and Allison, and an object mapping contact mechanisms to the CSS classes for FontAwesome 5 icons.

Your challenge, should you choose to accept it 😉, is to build a contact listing for both myself and Allison. Your solution should have the following properties/features:

1.  Each piece of contact information should be rendered as a flex item within a flex box, and should use the appropriate FontAwesome glyph as an obvious icon.
2.  The contact listings should be usable at all Bootstrap breakpoints.
3.  The contact listings should be accessible.
4.  You should use the same Mustache template to render both contact listings.
5.  You should use one or more partials within your template.

I do also want to remind you that flexboxes can be arranged both horizontally and vertically, and that Booststrap’s [flex utilities](https://getbootstrap.com/docs/4.3/utilities/flex/) allow different orientations at different break points.

## Final Thoughts

One of the reasons I love Mustache is that it’s nice and simple — it does what it does well, but doesn’t have too many features. We have now covered almost every feature the library supports!

In the next instalment we’ll learn how to use a very powerful JavaScript technique known as AJAX to fetch both Mustache template strings and JSON strings from URLs.
