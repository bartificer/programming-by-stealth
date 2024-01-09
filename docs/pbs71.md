# PBS 71 of X — Bootstrap Spinners

The challenge set at the end of the previous instalment was to build a simple timer web app. This was a much more substantial challenge than those I’ve been setting in the previous handful of instalments. It involved refamiliarising yourself with concepts we’ve learned before, but not used for some time. For those reasons this instalment will primarily revolve around my sample solution to the challenge. I’ll go through it in much greater detail than I have been doing recently.

It would be a shame to go through an entire instalment without any new content though. So we also meet one very simple but very useful little Bootstrap component, the _Spinner_. Learning about the spinner sets us up nicely for a new challenge — two simple but important improvements to the timer web app we just built.

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/02/pbs71.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs71.zip).

## Matching Podcast Episode 581

Listen along to this instalment on [episode 581 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/02/ccatp-581/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_02_09.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_02_09.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 70 Challenge Solution

The challenge set at the end of the previous instalment was to create a simplistic timer web app. The app would consist of a form where the user can enter a number of minutes and a message, and a button to start a timer that will display the message in a modal dialogue when the requested number of minutes have elapsed. Every minute between starting the timer and the final modal, a toast dialogue should appear telling the user how long is left. To stop multiple timers being started at once, the form should be disabled while a timer is running. There was bonus credit for creating Toast notifications that did not dismiss automatically, and then dismissing them programmatically when the timer ended.

You’ll find my full solution in this instalment’s ZIP file in the folder `pbs70-challenge-solution`.

I started by creating a page with a jumbotron as a header and a single narrow centred column into which I’d place the form. To keep things nicely aligned, I used a single container with two rows, each containing one column. The first row’s column contains the jumbotron; the second row’s column contains the form. To keep the form centred, I used the offset classes for Bootstrap’s grid. The desired width for the centre column, and hence the required amount of offset, was different at every breakpoint. So both of the cols ended up with a lot of classes!

```html
<div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
  …
</div>
```

You may notice that, to get a centred column, the rules are quite simple — the width of the centre column must always be even and the offset will be 12 minus that width divided by two. That is, at the medium break point, the centre column is 8; so the offset is `(12 - 8)/2`, that is `2`; hence the two medium breakpoint classes `col-md-8 offset-md-2`.

Within this single centred column, I used Bootstrap’s default form layout, i.e. full-width labels above full-width form controls with full-width help text below that as needed. Each grouping of label, control, and help text is wrapped in a `<div>` with the class `form-group`.

For the number of minutes I decided to get a little creative and use a range input which goes from one to five inclusive in steps of one. I figured no one would want to wait more than 5 minutes!

All in all my form is mostly simple and by-the-book:

```html
<form id="timer_fm" action="javascript:void(0);" class="form">
  <div class="form-group">
    <label for="timer_min_rg"><span class="duration_display"></span> Minute<span class="plural_only">s</span></label>
    <input type="range" class="custom-range" min="1" max="5" id="timer_min_rg" value="3">
    <small class="form-text text-muted">The delay before the message is displayed.</small>
  </div>
  <div class="form-group">
    <label for="timer_msg_ta">Message</label>
    <textarea class="form-control" id="timer_msg_ta"></textarea>
    <small class="form-text text-muted">The message to display then the timer ends.</small>
  </div>
  <div class="form-group">
    <button type="submit" class="btn btn-success form-control">Start!</button>
  </div>
</form>
```

One small nuance I want to draw your attention to is the label for the range input. When the user slides the slider, we would like to show them the current value they’ve selected. I chose to do that by adding a `<span>` within the label into which I’ll add the number of minutes with JavaScript. I also decided to be grammatically correct, and deal with pluralisation too. So, here’s the code for the label:

```html
<label for="timer_min_rg"><span class="duration_display"></span> Minute<span class="plural_only">s</span></label>
```

Notice that I chose to use classes rather than IDs? Why? Because I figured (rightly as it turns out), that there was a good chance I’d need to deal with pluralisation in more than one place, and that I’d probably need to show the number of minutes in more than one place too. Using classes lets me update arbitrarily many elements at once.

With the HTML in place, the JavaScript to make it go can be plumbed in. What we need to do is add a handler to the input event to the range slider so that, each time the range is adjusted, the display of the value and the pluralisation gets updated. We do this by adding the following code inside a jQuery document ready event handler:

```javascript
// quick references to the form elements and modal
// …
const $mins = $('#timer_min_rg');
// …

// add an input handler to the minutes slider
$mins.on('input', function(){
  // get the current number of minutes
  const mins = $mins.val();

  // update the display of the current value
  $('.duration_display').text(mins);

  // hide or show all plural-only and singular-only elements
  if(mins > 1){
    $('.plural_only').show();
    $('.singular_only').hide();
  }else{
    $('.plural_only').hide();
    $('.singular_only').show();
  }
}).trigger('input');
```

Notice the use of jQuery’s `.on()` function to add the handler, followed immediately by jQuery’s `.trigger()` function to trigger the event. Firstly, this serves as a good example of jQuery function chaining. If you ignore the arguments to `.on()` for a moment, you’ll see the structure of that code is `$min.on().trigger()`. To figure out what is going on, we need to work from left to right one dot at a time. So, the first thing that happens is that `.on()` is called on the jQuery object `$min` (a jQuery object representing the minutes slider). That function adds an event handler to `$min`, specifically an anonymous function (the second argument) that will be executed each time the `input` event (first argument) fires on the slider. The key question is: what does `.on()` return? It returns a reference to the object it was called on. In this case, `$min.on()` returns `$min`. That means that the `.trigger()` function is also called on `$min`. What `.trigger()` does is execute an event handler, in this case, the input event (the only argument). Putting it all together, the snippet of code adds an event handler for the input event to the slider, and then immediately executes that handler so the page gets initialised correctly.

We can now start thinking about an event handler for the button that starts the timer. We know that we’ll need both a modal and a place to inject our toast notifications. The modal will always have the same basic structure, with just the number of minutes and the message changing. So I decided to add it directly into the document instead of building it up piece-by-piece with jQuery. Because I used classes in the event handler for the minutes slider, I can get the number of minutes and any pluralisation I need simply by using the classes `.duration_display`, `.plural_only` and `.singular_only`. The only other customisation that needs to be injected each time the modal is shown is the message, so I gave the tag that will contain the message the ID `#message_display`.

Putting all that together, this is the code for my modal:

```html
<!-- The Modal (Hidden by Default) -->
<div class="modal" id="timeup_mdl" tabindex="-1" role="dialog" aria-labelledby="modal_title">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="h5 modal-title" id="modal_title">Time's Up!</h1>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p><small class="text-muted">Your <span class="plural_only duration_display"></span> minute<span class="plural_only">s are</span><span class="singular_only"> is</span> up!</small></p>
        <p class="lead" id="message_display"></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>
```

The ‘toast rack’ for containing the Toast notifications is pretty much identical to the example in the previous instalment:

```html
<!-- The container for the Toasts -->
<div id="toast_rack" aria-live="polite" class="position-fixed" style="z-index: 999; top: 10px; right: 10px;"></div>
```

Before we look at the event handler for the button, I just want to note that, for convenience, I added a bunch of variables to the top of my jQuery document ready handler to hold references to the various elements on the page we’ll need to interact with:

```javascript
// quick references to the form elements and modal
const $form = $('#timer_fm');
const $formControls = $('input, textarea, button', $form);
const $mins = $('#timer_min_rg');
const $msg = $('#timer_msg_ta');
const $modal = $('#timeup_mdl');
```

Most of those variables are quite straightforward, but `$formControls` deserves a closer look. This jQuery object is built using the CSS selector `input, textarea, button`, and its scope is constrained to `$form`, i.e. the form. Remember that, in CSS selectors, the comma denotes **or**. This selector will match all inputs, text areas, and buttons within the form. Why do we need these particular items collected together into a single jQuery variable? Well, these are the items that will need to be disabled and later re-enabled when the timer starts and finishes.

The document ready handler also contains two variables for keeping a record of the timeout and interval IDs we’ll use for triggering the modal and toasts:

```javascript
// variables for storing the timeout and interval IDs
let mainTimerID = null;
let toastIntervalID = null;
```

Finally, I also added a globally scoped variable to store the current state of the timer:

```javascript
// a flag to record whether or not a timer is running
var RUNNING = false;
```

With the housekeeping out of the way, we’re now ready to tackle the big one — the event handler for starting the timer! The code is quite long. Let’s start by ignoring the detail and taking a quick look at the overall structure:

```javascript
// add a submit handler to the timer form
$form.on('submit', function(){
  // if the timer is already running do nothing
  if(RUNNING) return false;

  // mark the timer as running
  RUNNING = true;

  // disable the form
  $formControls.prop('disabled', true);

  // start the main timeout
  const mins = $mins.val();
  mainTimerID = window.setTimeout(function(){
    // DESCRIBE THIS LATER
  }, mins * 1000 * 60);

  // if needed, start the toast interval
  let minsLeft = mins - 1;
  if(minsLeft > 1){
    toastIntervalID = window.setInterval(function(){
      // DESCRIBE THIS LATER
    }, 1000 * 60);
  }
});
```

As you can see, at highest level things are quite simple — a safety check to avoid starting multiple timers, then disable the form’s elements, then start the timeout that will show the modal at the end, then, if needed, start the interval for the toasts. Before we look at the main timeout, let’s look at the interval for the toasts:

```javascript
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
```

You’ll notice that, to help keep the code maintainable, I wrote a separate function for displaying a toast, `showToast()`, which takes two arguments, a string to use as the title and a string to use as the body. This function consists of a slightly simplified version of the code we saw in the example file `pbs70b.html` from the previous instalment:

```javascript
// a function for popping up a toast
function showToast(t, msg){
  // create an empty toast
  const $toast = $('<div>').addClass('toast').attr('role', 'status').attr('aria-atomic', true);

  // create a title for the toast and append it
  const $title = $('<div>').addClass('toast-header');
  $title.append($('<strong>').text(t));
  $toast.append($title);

  // create a body for the toast and append it
  const $body = $('<div>').addClass('toast-body');
  $body.text(msg);
  $toast.append($body);

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

I do want to draw your attention to one detail (highlighted) — to earn the bonus credit on offer, and make the toasts stay around until they are expressly dismissed, notice that I pass the `toast` jQuery plugin an options object that maps the key `autohide` to `false`.

The next thing to note is that, if the timer is for one minute, we don’t need any toasts at all, hence the `if()` statement wrapping the creation of the interval. As a reminder a JavaScript interval executes a given function periodically until it is stopped. You create and start an interval with `window.setInterval()`. That function takes two arguments, the function to execute, and the number of milliseconds to wait between executions. The function returns a numeric ID that identifies that specific interval. It’s important to store that ID because we’ll need to pass it as the only argument to `window.clearInterval()` to stop the interval running when all the needed toasts have been displayed. We also need a variable outside of the anonymous function being repeatedly executed to store the number of minutes left on the timer so that each subsequent toast can show the correct times, and so we know when to stop the interval.

Notice that the anonymous function ends by checking if it needs to end the interval. If we omitted that code we’d have what amounts to an infinite loop. Finally, notice that I chose to represent the number of milliseconds as a mathematical equation (`1000 * 60`). This is something I like to do to make my code clearer and hence easier to maintain. It would be just as valid to directly pass `60000`.

We’re now ready to look at the main timer timeout:

```javascript
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
```

Again, the code is very similar to that in the example file `pbs70b.html` from the previous instalment. Notice we start by using the Bootstrap jQuery plugin `toast` to hide all the toasts. Next we add our message into the modal. If the user didn’t enter a message, I chose to use the _‘speak no evil’_ monkey emoji as a placeholder.

Because we want the timer to be able to be used multiple times, it’s important that this code clean up after itself: hiding all toasts, re-enabling all form elements, updating the `RUNNING` flag, and blanking the variable that stores the ID for the timer timeout.

Finally, notice that, for clarity, I chose to write the timeout’s duration in milliseconds as a Mathematical expression.

## Bootstrap Spinners

Something you often need to do in web apps is make it clear to the user that something is happening and that they need to wait. The challenge from last week is an extreme example of this!

The Bootstrap _Spinner_ component exists to fulfil this role. A spinner is an animated icon that moves in such a way as to suggest on-going activity. Bootstrap provides two flavours of spinner that it names _Border_, and _Growing_. You can see both in the file `pbs71a.html` in this instalment’s ZIP file.

You create a spinner giving any tag of your choice either the class `.spinner-border` or `.spinner-grow`. That’s all you **need** to do, but you **should** do more! To aid accessibility, you should give your spinner the ARIA role `status`, and you should add some screen-reader-only text inside the spinner describing what the icon is indicating, usually _‘loading …’_.

When you make a tag a spinner, it will become an inline block element (unless you add the spinner inside a flexbox). For that reason I like to use the generic inline tag `<span>`, but you’ll see many examples that use `<div>`. You really could use any tag you like.

By default spinners have no margin. So they will come very close to ‘touching’ whatever comes before or after them on the page. You can use the Bootstrap spacing utilities to address that as desired.

Putting all that together, the following is the code for the first two spinners on `pbs71a.html`:

```html
<span class="spinner-border m-3" role="status">
  <span class="sr-only">Loading...</span>
</span>
<span class="spinner-grow m-3" role="status">
  <span class="sr-only">Loading...</span>
</span>
```

### Colouring Spinners

You can control the colour of your spinners using Bootstrap’s text colour utility classes (`.text-primary`, `.text-success` etc.). Below is the code from `pbs71a.html` using some of the colour utilities:

```html
<span class="spinner-border m-3 text-primary" role="status"><span class="sr-only">Loading...</span></span>
<span class="spinner-border m-3 text-secondary" role="status"><span class="sr-only">Loading...</span></span>
<span class="spinner-border m-3 text-success" role="status"><span class="sr-only">Loading...</span></span>
<span class="spinner-border m-3 text-warning" role="status"><span class="sr-only">Loading...</span></span>
<span class="spinner-border m-3 text-danger" role="status"><span class="sr-only">Loading...</span></span>
```

### Aligning Spinners

Something you’ll often want to do is centre-align a spinner. Since spinners are inline block elements, they behave just like text. You can centre them as you would any piece of text using Bootstrap’s utility classes. Below is an example from `pbs71a.html`:

```html
<p class="text-center">
  <span class="spinner-border m-3" role="status"><span class="sr-only">Loading...</span></span>
</p>
```

You can also centre a spinner using [Bootstrap’s flexbox utility classes](https://getbootstrap.com/docs/4.2/utilities/flex/). Again, an example from `pbs71a.html`:

```html
<div class="d-flex justify-content-around">
  <span class="spinner-border m-3" role="status"><span class="sr-only">Loading...</span></span>
</div>
```

Since spinners can be used as flex items, we can of course do much more with them, like perhaps align them with some text as shown in `pbs71a.html`:

```html
<div class="d-flex justify-content-around align-items-center">
  <span>Loading …</span>
  <span class="spinner-border m-3" role="status" aria-hidden></span>
</div>
```

Note that, as this example illustrates, you can support assistive devices in different ways. When you have universally visible text, there is no need for the screen-reader-only text inside the spinner itself. Instead, you can hide the spinner from the screenreader only using the `aria-hidden` attribute.

You can also float your spinners left or right, but that gives you much less control over vertical alignment than you get with flexboxes.

### Spinner Sizes

Spinners come in three sizes, small, default (medium), and large. You get a small or large spinner by adding one or the classes `.spinner-border-sm` or `.spinner-border-lg`, or `.spinner-grow-sm` or `.spinner-grow-lg`.

You can see all six size variants in `pbs71a.html`:

```javascript
<p>A small, default, and large broder spinner.</p>
<div class="d-flex justify-content-around align-items-center">
  <span class="spinner-border spinner-border-sm m-3" role="status"><span class="sr-only">Loading...</span></span>
  <span class="spinner-border m-3" role="status"><span class="sr-only">Loading...</span></span>
  <span class="spinner-border spinner-border-lg m-3" role="status"><span class="sr-only">Loading...</span></span>
</div>

<p>A small, default, and large growing spinner.</p>
<div class="d-flex justify-content-around align-items-center">
  <span class="spinner-grow spinner-grow-sm m-3" role="status"><span class="sr-only">Loading...</span></span>
  <span class="spinner-grow m-3" role="status"><span class="sr-only">Loading...</span></span>
  <span class="spinner-grow spinner-grow-lg m-3" role="status"><span class="sr-only">Loading...</span></span>
</div>
```

Notice the use of the flexbox utilities to get nice vertical and horizontal alignment of each group of spinners.

## Spinners in Buttons

Since spinners are just inline block elements, you can use them anywhere you can use any other inline block element (like an image). This means you can use them inside buttons.

The most common use-case for spinners in buttons is to add them dynamically when the user clicks the button. It’s also normal to disable the button at this point to stop the user clicking again. When whatever action the user requested completes, the spinner would then be removed or hidden and the button re-enabled.

Two common approaches are to replace the text in the button with the spinner, or to add the spinner with some visible text. You can see both in action in pbs71a.html.

Let’s start with the first approach. The markup is quite simple:

```html
<button type="button" class="btn btn-primary" id="spinner_btn_1">
  <span class="spinner-border spinner-border-sm d-none" role="status"><span class="sr-only">Waiting...</span></span>
  <span class="button_text">Click Me!</span>
</button>
```

Note that, because in this case the spinner will be the only thing visible in the button, once the button is clicked, I do have to include the screen-reader-only text inside the spinner. I also chose to use a small spinner because I think that looks better.

With the markup in place, we need to add a click handler that will hide the text, show the spinner, and disable the button. We do this inside the document ready event handler:

```javascript
$('#spinner_btn_1').click(function(){
  $btn = $(this); // get a reference to the button that was clicked

  // hide the text
  $('.button_text', $btn).hide(250);

  // show the spinner
  $('.spinner-border', $btn).removeClass('d-none');

  // disable the button
  $btn.prop('disabled', true);
});
```

In a real world situation some other event handler would be responsible for re-enabling the button. To demonstrate how that would work in this contrived situation, we can add a timeout into the click handler to re-enable the button after 3 seconds:

```javascript
$('#spinner_btn_1').click(function(){
  $btn = $(this); // get a reference to the button that was clicked

  // hide the text
  $('.button_text', $btn).hide(250);

  // show the spinner
  $('.spinner-border', $btn).removeClass('d-none');

  // disable the button
  $btn.prop('disabled', true);

  // start a timeout to re-enable the button after 3 seconds
  window.setTimeout(function(){
    // show the text
    $('.button_text', $btn).show(250);

    // hide the spinner
    $('.spinner-border', $btn).addClass('d-none');

    // re-enable the button
    $btn.prop('disabled', false);
  }, 1000 * 3);
});
```

The markup for the second button is also quite straightforward:

```html
<button type="button" class="btn btn-primary" id="spinner_btn_2">
  <span class="spinner-border spinner-border-sm mr-2 d-none" role="status" aria-hidden></span>
  <span class="button_text">Click Me!</span>
</button>
```

Since the spinner is purely decorative in this scenario, it has no screen-reader-only text within it, but is instead marked as hidden to screen readers with the `aria-hidden` attribute.

With the markup in place, we can add the event handler. Like our previous example, in the real world the re-enabling would be done in a separate event handler, but in this case we’re using a 3 second timeout set within the click handler:

```javascript
// add a click handler to the second spinner button
$('#spinner_btn_2').click(function(){
  $btn = $(this); // get a reference to the button that was clicked

  // replace the text
  $textSpan = $('.button_text', $btn); // get a reference to the span with the text
  const originalText = $textSpan.text(); // save the original so we can restore it
  $textSpan.text('Waiting…');

  // show the spinner
  $('.spinner-border', $btn).removeClass('d-none');

  // disable the button
  $btn.prop('disabled', true);

  // start a timeout to re-enable the button after 3 seconds
  window.setTimeout(function(){
    // put the text back
    $textSpan.text(originalText);

    // hide the spinner
    $('.spinner-border', $btn).addClass('d-none');

    // re-enable the button
    $btn.prop('disabled', false);
  }, 1000 * 3);
});
```

## A Challenge from Bart

Update your timer web app to solve two problems:

1.  Give the user visual feedback that the timer is running.
2.  Allow the user to cancel the timer while it's running.

## A Challenge From Allison

The documentation shows that you can use the Bootstrap dismiss plugin with Toasts to dismiss them, but it doesn’t seem to actually work with Bootstrap 4.2. Can you get it to work?

## Final Thoughts

We’ve now covered almost all I want to cover in our first pass through Bootstrap. Before we make a final push, I want to divert us from that course for a one-instalment detour into template strings. Bootstrap Toasts are a great example of where template text can really make your web apps easier to develop and maintain. This seems like the perfect time for this little detour. There are many templating libraries out there, but the one I enjoy using the most is [Mustache](https://mustache.github.io). That’s what we’ll be learning about next time.

 - [← PBS 70 — Bootstrap Modals & Toasts](pbs70)
 - [Index](index)
 - [PBS 72 — HTML5 Templates →](pbs72)
