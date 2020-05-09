# PBS 72 of X — HTML5 Templates

Templating is a very important concept to get to grips with as you move from web pages to web apps. You need the ability to design some generic HTML and then easily inject data into it. Every UI popup has a standard form, but the information being displayed changes each time its invoked. Similarly, apps often use some kind of card interface to show a collection of similar items, those are basically the same piece of HTML being re-used with different data over and over again. Clearly, you want to be able to easily create a template for one card, and then re-use it over and over again.

I’ve been trying to find the perfect moment to insert this topic into the series, and it struck me that Bootstrap Toasts would make a simple but informative example around which to introduce the topic. So far we’ve been generating toasts by building them up piece-by-piece with jQuery, starting with a tag, setting the text, setting some attributes and properties, adding some classes, appending tags together, and so on. The code works, but it’s cumbersome to write, and worse still, difficult to debug and maintain. Hopefully you’ve been thinking to yourself _‘there must be a better way?’_, because if you have been, you’ll be very well motivated to ingest this instalment!

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/02/pbs72.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs72.zip).

# Matching Podcast Episode 583

Listen along to this instalment on [episode 583 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/02/ccatp-583/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_02_23.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_02_23.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 71 challenge Solution

The challenge set at the end of the previous instalment was quite simple — improve the simple timer web app created as the PBS 70 challenge by adding visual feedback to show the user that a timer is running, and, allow the timer to be canceled. The UI design was entirely at your discretion!

The approach I chose to take is to transform the start button into a cancel button with a spinner.

Before starting to add new functionality I started by re-factoring my solution to PBS 70 a little. To make the event handlers easier to read I first moved the code for starting a timer into a separate function named `startTimer()`. For this function to be able to access my shortcut variables to the various parts of the UI it needs to share a scope with those variables. This is why I created the function within the jQuery document ready handler, and not out in the global scope. The actual code for the function is simply cut-and-pasted from the submit handler for the form:

```JavaScript
// a helper function to start the timer
const startTimer = function(){
  // if the timer is already running do nothing
  if(RUNNING) return false;

  // mark the timer as running
  RUNNING = true;

  // disable the form
  $formControls.prop('disabled', true);

  // start the main timeout
  const mins = $mins.val();
  mainTimerID = window.setTimeout(function(){
    // hide any toasts
    $('.toast').toast('hide');

    // populate the modal
    const msg = $msg.val() || '🙊';
    $('#message_display').text(msg);

    // display the Modal
    $modal.modal('show');

    // re-enable the form
    $formControls.prop('disabled', false);

    // mark execution as completed
    RUNNING = false;
    mainTimerID = null;
  }, mins * 1000 * 60);

  // if needed, start the toast interval
  let minsLeft = mins - 1;
  if(minsLeft > 1){
    toastIntervalID = window.setInterval(function(){
      // show the toast
      const minsGone = mins - minsLeft;
      showToast(
        `${minsLeft} Minute${minsLeft > 1 ? 's' : ''} Left`,
        `${minsGone} minute${minsGone > 1 ? 's' : ''} down, ${minsLeft} to go!`
      );

      // decrement the minutes left
      minsLeft--;

      // if we're the last toast, end ourselves
      if(minsLeft === 0){
        window.clearInterval(toastIntervalID);
        toastIntervalID = null;
      }
    }, 1000 * 60);
  }
};
```

The form’s submit handler can then be updated to simply become:

```JavaScript
// add a submit handler to the timer form
$form.on('submit', function(){
  return startTimer();
});
```

Next I broke the code for enabling and disabling the form out into stand-alone functions. Again, I defined them within the jQuery document ready handler so they share a scope with my helper variables:

```JavaScript
// a helper function to disable the form
const disableForm = function(){
  $formControls.prop('disabled', true);
};

// a helper function to enable the form
const enableForm = function(){
  $formControls.prop('disabled', false);
};
```

Again, the relevant parts of the `startTimer()` function were updated to call these new helper functions.

As things stand, the button on my form is a submit button, and the event handler starting the timer is _on submit_. To get my button to work as both a start and cancel button it needs to be transformed into a regular button with a click handler. From a markup point of view this simply involves changing the `type` from `submit` to `button`. To make the button easier to address I also gave it an ID:

```XHTML
<button type="button" id="timer_btn" class="btn btn-success form-control">
  Start!
</button>
```

Rather than replacing the submit handler, I chose to add a click handler. Why? Because while the visual page no longer has a submit button, many browsers and assistive devices offer various shortcuts for submitting forms, and those should still have the expected result, i.e., the timer should start.

To make things easier, I first created another utility variable for addressing the button:

```JavaScript
const $btn = $('#timer_btn');
```

The I added the click handler:

```JavaScript
// add a click handler to the timer button
$btn.click(function(){
  startTimer();
});
```

Up to this point we’ve not actually changed any functionality, we’ve simply re-factored the code so it does the same thing in a slightly different way. These changes will make it easier to implement our changes though.

Before we update the code for the button to add the spinner and to change the text as appropriate I chose to lay some foundations. Specifically, to add support for two CSS utility classes; `running_only`, and `not_running_only`. The idea is that anything with these classes will be shown or hidden as appropriate when the timer starts and ends.

To do this I updated the `disableForm()` and `enableForm()` functions as shown:

```JavaScript
// a helper function to disable the form
const disableForm = function(){
  // disable the form elements
  $formControls.prop('disabled', true);

  // hide everything with the not_running_only class
  $('.not_running_only').addClass('d-none');

  // show everything with the running_only class
  $('.running_only').removeClass('d-none');
};

// a helper function to enable the form
const enableForm = function(){
  // enable the form elements
  $formControls.prop('disabled', false);

  // show everything with the not_running_only class
  $('.not_running_only').removeClass('d-none');

  // hide everything with the running_only class
  $('.running_only').addClass('d-none');
};
```

With that groundwork laid we can finally update the button’s markup to include a spinner and two separate textual labels:

```XHTML
<button type="button" id="timer_btn" class="btn btn-success form-control">
  <span class="spinner-border spinner-border-sm mr-2 running_only d-none" role="status" aria-hidden></span>
  <span class="not_running_only">Start!</span>
  <span class="running_only d-none">Running …</span>
</button>
```

At this stage we have a working solution to the first part of the challenge — our form now clearly indicates its running state to the user. However, having the button remain green seems inappropriate, so I updated the disableForm() and enableForm() functions to toggle the button between green (`btn-success`) and red (`btn-danger`):

```XHTML
// a helper function to disable the form
const disableForm = function(){
  // disable the form elements
  $formControls.prop('disabled', true);

  // hide everything with the not_running_only class
  $('.not_running_only').addClass('d-none');

  // show everything with the running_only class
  $('.running_only').removeClass('d-none');

  // change the button to red
  $btn.removeClass('btn-success').addClass('btn-danger');
};

// a helper function to enable the form
const enableForm = function(){
  // enable the form elements
  $formControls.prop('disabled', false);

  // show everything with the not_running_only class
  $('.not_running_only').removeClass('d-none');

  // hide everything with the running_only class
  $('.running_only').addClass('d-none');

  // change the button to green
  $btn.removeClass('btn-danger').addClass('btn-success');
};
```

Let’s tackle the final part of the challenge now, giving users the ability to cancel a running timer. Before we plumb in some UI, let’s start by writing a function that will actually stop a timer. Like all our other functions, it needs to share a scope with my utility variables, so I’ve created it within the jQuery document ready event handler:

```JavaScript
// a helper function to stop the timer
const stopTimer = function(){
  // if the timer is not running, do nothing
  if(!RUNNING) return false;

  // mark the timer as not running
  RUNNING = false;

  // cancel any running timeouts
  if(toastIntervalID){
    window.clearInterval(toastIntervalID);
    toastIntervalID = null;
  }
  if(mainTimerID){
    window.clearTimeout(mainTimerID);
    mainTimerID = null;
  }

  // hide any toasts
  $('.toast').toast('hide');

  // enable the form
  enableForm();
};
```

At this stage we’re almost ready to plumb this new functionality into our form, we just need to make one more preparatory change. As things stand, the button is disabled when the form is disabled, that means it can’t be clicked, so it can’t stop the timer!

To fix this I updated the $formControls utility variable so it no longer includes buttons:

```JavaScript
const $formControls = $('input, textarea', $form);
```

Finally, we can now update the click handler on the button to start or stop the timer as appropriate:

```JavaScript
// add a click handler to the timer button
$btn.click(function(){
  // start or stop as appropriate
  if(RUNNING){
    stopTimer();
  }else{
    startTimer();
  }
});
```

At this stage we have a working solution, but it would benefit form a little re-factoring. As things stand there’s a lot of code duplication between the timeout that fires when the timer ends, and the `stopTimer()` function. This can be easily fixed by replacing the duplicated code in the timeout with a call to the `stopTimer()` function:

```JavaScript
mainTimerID = window.setTimeout(function(){
  // stop the timer
  stopTimer();

  // populate the modal
  const msg = $msg.val() || '🙊';
  $('#message_display').text(msg);

  // display the Modal
  $modal.modal('show');
}, mins * 1000 * 60);
```

With that we have what I consider to be a perfect solution to the challenge. You’ll find my complete code in the folder `pbs71-challenge-solution` in this instalment’s ZIP.

## Introducing Templates

Templating is an extremely broad topic — templates come in many forms, and they fill many different needs in many different ways. While I haven’t focused on the word, we have been making extensive use of one form of JavaScript templates throughout most of the JavaScript-focused instalments in this series. [Strings defined within back-ticks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) are officially \*Template literals\* (formerly \*Template strings\*). Using the `${}` operator we can inject data into these strings:

```JavaScript
const like = 'ice cream';
console.log(`I really like ${like}, it's just so tasty!`);
```

We just mixed data (the variable `like`) with static content (the strings `"I really like "` & `", it's just so tasty!"`).

However, that type of templating doesn’t get us to where we need to be with re-usable UI snippets. Template literals save us from horrible string concatenations, but they don’t save us from the kind of ugly code we’re currently using to create Toasts!

HTML was originally designed to be a markup language for hyperlinked text documents, not to be a markup language for interactive apps with complex UIs. Over time the web has moved from the original read-only paradigm to the modern so-called \*Web 2.0\* read/write paradigm. That meant that HTML4 was being used for things it was never designed to be used for, and the short-comings were obvious. HTML5 was intended to address many of those shortcomings. We’ve already seen that in action with the new HTML 5 form elements and HTML 5 form validation, and we’ll shortly discover that HTML 5 also tried to tackle the problem of re-usable UI snippets. In other words, HTML 5 provides us with another form of templating.

As nice of an addition as the HTML5 templates are, they fall a long way short of being a panacea, so in JavaScript, like in so many other languages, there are myriad (not literally 10,000, but many!) 3rd-party JavaScript templating libraries out there. They all have their strengths and weaknesses, and there is no such thing as _a one true JavaScript templating library_! We are going to pick one, but think of it as an illustration of the kind of functionality templating libraries provide, rather than as any kind of suggestion that it is somehow the best or the one you must or even should use!

If HTML5 has templating support, why doe these other libraries exist? There are many reasons, but they include the fact that many of these templating libraries work in IE, while HTML5 templates don’t, that many of these libraries existed before HTML5 was released, and the fact that these libraries generally offer functionality above and beyond what HTML5 gives you. Also, some of these libraries exist across different languages, so you can write a template once, and use it in apps written in multiple languages.

Finally, we developers are human, we have preferences, so we’ll love some templating libraries because they gel well with our way of thinking, and we’ll hate others because they do things in ways we don’t like. It’s not just about logic and reason, there’s also just plain old love and hate!

Having said all that, the templating library I’m currently using in my day-to-day work is [Mustache](http://mustache.github.io), and that’s the one we’ll use in this series. The reasons I like it are that it’s cross-language, covering both of the languages I program in regularly (JavaScript and Perl), it’s light-weight (not too complicated, and not too big of a codebase), and I like how it looks! Just to underline the point again, I’m not implying Mustache is the best JavaScript templating library, it’s just the one that fits me needs and wants best, and since its the one I know, it’s the one I’m going to teach 🙂

## The HTML5 `<template>` Tag

Let’s start our journey into templating by looking at what HMTL5 gives us out-of-the-box without resorting to a third-party templating library.

The `<template>` tag allows you to define clone-able snippets of HTML within an HTML document that are not considered to be a part of the document by the browser. This means that the templates are not just visually invisible, but their contents is not see by the DOM query functions, and hence, not by 3rd-party libraries like jQuery either.

If you have a template that contains a `<div>` with the class `toast` inside an HTML 5 template and you query the document for all `<div>`s with the class `toast`, the `<div>` inside the template will **not** be in the set of results returned by jQuery.

To use an HTML5 template you ask the browser to create a clone of the template’s contents. To do this you need a reference to the raw DOM object representing the template. The easiest way to facilitate that is to give your templates IDs.

Also note that template tags can’t appear just anywhere in your code, you should add them as direct children of either the `<body>` or `<head>` tags.

Let’s consider the following sample template:

```XHTML
<template id="tpl1">
<p>I like <span class="thing"></span>, it's just so tasty!</p>
</template>
```

First, we need to get a reference to the raw DOM object representing our template. We can do this using the built-in JavaScript function `document.getElementById()`:

```JavaScript
const tpl1DOM = document.getElementById('tpl1');
```

This is one of the native functions that jQuery users under the hood to do its magic. Since this is a part of core JavaScript it does not return a jQuery object, but a raw DOM object direct from the browser. The argument is an ID as a string. Note that function does not expect a CSS selector, hence no `#` prefixed to the ID.

We can also make use of jQuery’s `.get()` function to access the template’s raw DOM object:

```JavaScript
const tpl1DOM = $('#tpl1').get(0);
```

We can now access the template’s contents using the DOM object’s `.content` property, and we’ll need to clone it using the built-in JavaScript function [`document.importNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/importNode):

```JavaScript
const tpl1CloneDocFrag = document.importNode(tpl1DOM.content, true);
```

When we clone the template’s contents the output will be a so-called [document fragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment). We don’t want the fragment itself, instead, we want its contents, and we can get those via the fragment’s `.children` property:

```JavaScript
const tpl1CloneDOM = tpl1CloneDocFrag.children;
```

After all that we’ll be left with a raw DOM object representing a clone of the contents of the template. If we were using native JavaScript DOM functions we could manipulate this object directly, but we’ve been learning jQuery, so we need to convert this DOM object into a jQuery object by passing it to jQuery’s `$()` function:

```JavaScript
const $tpl1Clone = $(tpl1CloneDOM);
```

Putting it all together we can get a jQuery object representing a clone of our template with:

```JavaScript
// get the template's raw DOM object
const tpl1DOM = $('#tpl1').get(0);

// clone the template to a document fragment
const tpl1CloneDocFrag = document.importNode(tpl1DOM.content, true);

// get a DOM object representing the fragment's contents
const tpl1CloneDOM = tpl1CloneDocFrag.children;

// convert the DOM object to a jQuery object
const $tpl1Clone = $(tpl1CloneDOM);
```

We can of course collapse all that down into a single line:

```JavaScript
const $tpl1Clone = $(document.importNode($('#tpl1').get(0).content, true).children);
```

We can now manipulate this jQuery object in the normal way, for example, we can inject text into the span with the class `.thing` with:

```JavaScript
$('.thing', $tpl1Clone).text('ice cream');
```

And we would then inject it into our document in the normal jQuery way (with `.append()`, `.prepend()`, `.before()`, or `.after()`).

### A HTML5 Template Example — An Updated Toast Generator

In this instalment’s ZIP file you’ll find `pbs72a.html`. This is a stripped-down version of `pbs70b.html` (from [instalment 70](https://bartificer.net/pbs70)) with just a single form remaining, the one for generating toast notifications.

We’re going to refactor this code so it uses HTML5 templates to generate the toasts rather than building them up piece-by-piece with jQuery.

Before we start, this is how the code currently builds up the toast:

```JavaScript
// add a click handler to the generate toast button
$('#toast_generate_btn').click(function(){
  // creat an empty toast
  const $toast = $('<div>').addClass('toast').attr('role', 'status').attr('aria-atomic', true);

  // create a title for the toast and append it
  const $title = $('<div>').addClass('toast-header');
  const titleText = $('#toast_title_tb').val() ? $('#toast_title_tb').val() : ipsum.sentence(1, 3).replace(/[.]$/, '').toTitleCase();
  $title.append($('<strong>').text(titleText));
  $toast.append($title);

  // create a body for the toast and append it
  const $body = $('<div>').addClass('toast-body');
  $body.text($('#toast_body_ta').val() ? $('#toast_body_ta').val() : ipsum.paragraph(10, 20));
  $toast.append($body);

  // add the toast to the toast rack
  $('#toast_rack').append($toast);

  // initialise the toast plugin on the toast
  $toast.toast({delay: 3000});

  // add an event handler to automatically delete the toast when it hides
  $toast.on('hidden.bs.toast', function(){
    $(this).remove();
  });

  // finally show the toast
  $toast.toast('show');
});
```

The highlighted lines are where the structure of the toast get defined. I think it’s fair to say it’s very difficult to tell at a glance what that the resulting HTML would look like.

We can replace that un-glanceable code with this much clearer template:

```XHTML
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

With that done, we can re-write the event handler:

```JavaScript
// add a click handler to the generate toast button
$('#toast_generate_btn').click(function(){
  // get an empty toast from the template
  const $toast = $(document.importNode($('#toast_tpl').get(0).content, true).children);

  // inject the text into the empty toast
  const titleText = $('#toast_title_tb').val() ? $('#toast_title_tb').val() : ipsum.sentence(1, 3).replace(/[.]$/, '').toTitleCase();
  $('.toast-header strong', $toast).text(titleText);
  const bodyText = $('#toast_body_ta').val() ? $('#toast_body_ta').val() : ipsum.paragraph(10, 20);
  $('.toast-body', $toast).text(bodyText);

  // add the toast to the toast rack
  $('#toast_rack').append($toast);

  // initialise the toast plugin on the toast
  $toast.toast({delay: 3000});

  // add an event handler to automatically delete the toast when it hides
  $toast.on('hidden.bs.toast', function(){
    $(this).remove();
  });

  // finally show the toast
  $toast.toast('show');
});
```

I’ve highlighted the changes from the original in `pbs72a.html`.

Rather than building up the Toast tag-by-tag we simply cloned the template, then injected the text into the header and body of the toast.

You can see the finished refactoring in `pbs72b.html` in this instalment’s ZIP file.

Note that you can use this file to prove to yourself that template content is not really part of the document, but separate from it. Open the file in a browser, refresh the page, and **do not generate any toasts**. Open the JavaScript console, and search for all tags with the class `.toast`:

```JavaScript
$('.toast')
```

Notice that despite the fact that the template contains a `<div>` with the class `.toast`, the `$()` function returns an empty set.

## A Challenge

Using either your own solution to the previous challenge, or the sample solution above as your starting point, update the timer app to use an HTML5 template for the toast notifications.

## Final Thoughts

This has been our first introduction to templating, and already we have a powerful mechanism for creating dynamic content without having to build it up piece-by-piece with jQuery. In the next instalment we’ll take things to the next level with an introduction to the third-party templating library [Mustache](http://mustache.github.io).
