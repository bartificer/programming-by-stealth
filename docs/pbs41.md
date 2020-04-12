# PBS 41 of x – Form Events

In this instalment we’ll tie up the last few loose ends related to web forms. With web forms under our belts, we’ll then be ready to pick up where we left off with our cellular automata JavaScript prototypes, and combine our HTML, JavaScript, and CSS skills together to make our first web app – an implementation of [Conway’s Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

This instalment breaks down into two distinct parts – our first look at keyboard interaction with web forms, and a final look at form-related events.

When it comes to keyboard interaction we’ll start by looking at how browsers treat regular web forms, and then we’ll move on to supporting keyboard interaction with custom web form UI elements like the star-rating example from [instalment 36](https://bartificer.net/pbs36).

Finally, we’ll wrap up with a handy reference table summarising the most important webform-related JavaScripts events, giving some guidance on their use.

There’s just one sample file associated with this instalment, and it’s available for download as a ZIP file [here](https://www.bartbusschots.ie/s/wp-content/uploads/2017/10/pbs41.zip) or [here on GitHub](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentZips/pbs41.zip).

# Matching Postcast Episode https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_10_13.mp3

Listen along to this instalment on [episode https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_10_13.mp3 of the Chit Chat Across the Pond Podcast](https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_10_13.mp3)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_10_13.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_10_13.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Web forms and the Keyboard

A decade ago I could have said that all standard form elements as rendered by all browsers could be controlled with the keyboard. I would simply have said that you tabbed from form element to form element and used the spacebar, enter key and arrow keys to manipulate the values. Tab to a checkbox, hit space to toggle its state, then tab to a drop-down and use the arrow keys to change the value, then tab to a button and hit the spacebar to activate it.

That still works in most browsers today, but no longer in all – Safari is the odd-ball in this story. By default, Safari only tabs to text boxes, text areas, and drop-down menus – Checkboxes, radio buttons, and buttons are skipped over. If you want to use the keyboard to activate radio buttons, checkboxes, or buttons you have to option+tab, or, go to the _Advanced_ tab in Safari’s preferences and enable the _Press Tab to highlight each item on a web page_ setting.

The people for whom keyboard navigation is by far the most important are those who, for one reason or another, can’t use a pointing device — perhaps they can’t see the screen, or perhaps they don’t have the dexterity to manipulate a pointer. Thankfully, Safari plays nice with the built-in accessibility tools in macOS, so the non-standard behaviour regular folks encounter doesn’t mess things up for our friends with special needs.

I think Apple’s logic is that people generally only want to tab between things they can type in, so while Safari’s default behaviour is non-standard, it might be more in line with the expectations of regular human beings. I have no strong opinion either way though – as a user I find it convenient to be able to quickly tab form text box to text box without having to tab past a sea of checkboxes and radio buttons, but as a developer I find this unique behaviour irksome – conventions are for following, not flouting!

The key point though is that if you confine yourself to using only standard form elements then your web forms will automatically be accessible.

However, that’s not always realistic — there simply aren’t stand form elements for all possible user interactions you might want to include in your web forms or web apps. We looked at an example of this back in instalment 36 when we learned how to build a custom UI for star ratings. At the time I did my best to make that custom UI accessible by adding ARIA attributes, but, when Allison tried to use that code as part of her solution to the challenge from instalment 36, she discovered a rather important oversight on my part. I forgot to add keyboard support to the UI! This oversight made the custom UI worse than useless for anyone relying on accessibility tools, because those tools simulate keyboard interactions. Because the ARIA tags were present, the accessibility tools registered the existence of the custom UI, but when users tried to interact with the UI, nothing happened, because the keyboard events they were generating were being ignored by my code — how frustrating that must have been!

## Custom UIs with Keyboard Support

Rather than just retro-fitting keyboard support into the star rating UI from last time, we’re going to build a different custom UI from scratch, with keyboard support.

What we’re going to build is a Netflix-style rating UI – it will have three states, no rating, a thumbs up, and a thumbs down.

The big-picture design will take the following form:

*   The rating will be stored in a hidden form element — an empty string for no rating, a 1 for a thumbs up, and a -1 for a thumbs down
*   The UI itself will consist of an outer containing span which contains two inner spans which will act as radio buttons, one for thumbs up, and one for thumbs down
*   Both faux-buttons will be glyph-icon
*   ARIA attributes will be used to make the UI understandable by screen readers – it will be marked up as behaving like a radio button group (since setting thumbs up will un-set thumbs down and _vica-versa_)
*   Click handlers will be added to both faux-buttons to update the value in the hidden input.
*   A change handler will be added to the hidden input so the ARIA attributes and icons can be kept consistent with the value stored in the input
*   The two button spans will be marked as tab targets so they can be highlighted with the keyboard.
*   Keyboard event handlers will be added to both button spans to trigger the click handlers when ever the space bar is pressed while the span is highlighted

Let’s start with the HTML markup:

```XHTML
<label id="rating_label">Rating</label>
<span id="rating_ui" role="buttongroup" aria-labelled-by="rating_label">
    <span class="fa fa-thumbs-o-down" id="rating_down" data-rating="-1" title="Thumbs Down" tabindex="0" role="radio" aria-checked="false" aria-label="Thumbs Down"></span>
    <span class="fa fa-thumbs-o-up" id="rating_up" data-rating="1" title="Thumbs Up" tabindex="0" role="radio" aria-checked="false" aria-label="Thumbs Up"></span>
</span>
<input type="hidden" name="rating" id="rating_ipt">
```

At the very simplest level we have a label, a span that contains the entire UI, and inside that, a span for thumbs up, and one for thumbs down. We use ARIA attributes to associate the label with the UI, and to mark the container span as a button group, and each inner span as an un-checked radio button.

The one thing in the code above we haven’t seen before is the tabindex attribute – that was the first oversight in the star rating UI!

### The `tabindex` Attribute

The `tabindex` attribute is used to mark an HTML element as being part of the tab-sequence of the page. By default, most HTML elements don’t appear in the tab-sequence, because they default to having a `tabindex` of `-1`. For an element to appear in the tab sequence it has to have a numeric `tabindex` greater than or equal to zero. Form elements have a default `tabindex` of `0`, hence, they can be tabbed to by default.

The order elements appear in the tab sequence is determined by two things – the element’s position within the page source, and the value of the element’s `tabindex` attribute. The sequence goes as follows — first, all elements with a `tabindex` of zero, starting at the top of the source, then all those with a `tabindex` of one, again, starting at the top of the source, then all those with a `tabindex` of two, and so on until there are no elements left to tab to, at which point the cycle repeats.

Usually, unless you’re doing something unusual like using CSS to re-arrange large chunks of your form, a `tabindex` of zero on all form elements will probably give you the behaviour you want. Since the standard form elements all default to a `tabindex` of zero anyway, that means you usually only have to explicitly add the `tabindex` attribute to custom UI elements like our thumb rating example, and you’ll almost always be setting it to zero.

### Making Custom UI Elements Look Clickable

With the help of a little CSS we can use the shape of the mouse pointer to help regular users understand that they can click on our thumbs up and thumbs down icons. We might also use the `:hover` pseudo-class for the same reason. The CSS below does both:

```CSS
/* Style the Ratings UI */
span#rating_ui > span {
  cursor: pointer;
  color: dimgrey;
}
span#rating_ui > span:hover {
  color: black;
}
```

### Making the UI Reflect the Value of the Input

The first step to bringing our custom UI to life is to add a change handler to the hidden input that will update the UI to reflect its current value. As we’ve seen many times before, we need to add this change handler inside a document-ready event handler.

```JavaScript
// add a change handler to the rating hidden input
$('#rating_ipt').change(function(){
  var $rating = $(this);
  var curVal = $rating.val();
                
  // make sure the current value is valid - otherwise, blank it
  if(!curVal.match(/^[-]?1$/)){
    curVal = '';
    $rating.val(curVal);
  }
  
  // render the thumbs down icon as appropriate
  var $down = $('#rating_down');
  if(curVal == -1){
    $down.removeClass('fa-thumbs-o-down');
    $down.addClass('fa-thumbs-down');
    $down.attr('aria-checked', true);
  }else{
    $down.removeClass('fa-thumbs-down');
    $down.addClass('fa-thumbs-o-down');
    $down.attr('aria-checked', false);
  }
  
  // render the thumbs up icon as appropriate
  var $up = $('#rating_up');
  if(curVal == 1){
    $up.removeClass('fa-thumbs-o-up');
    $up.addClass('fa-thumbs-up');
    $up.attr('aria-checked', true);
  }else{
    $up.removeClass('fa-thumbs-up');
    $up.addClass('fa-thumbs-o-up');
    $up.attr('aria-checked', false);
  }
});
```

At this stage we can test our change handler from the web console:

```JavaScript
$('#rating_ipt').val(-1).change(); // set thumbs down
$('#rating_ipt').val(1).change(); // set thumbs up
$('#rating_ipt').val('').change(); // blank the rating
```

Notice that because we are altering the value programatically, we have to explicitly invoke the change hander we added by calling `.change()` on the jQuery object representing the hidden input without arguments.

### Making the UI Work with a Mouse and Touch

The next step is to add a click handler to both buttons – because we have added data attributes containing the values represented by the faux-buttons to the spans themselves, we can add the identical handler to both. The handler simply updates the value in the hidden input, and calls the change handler, just like we did from the console:

```JavaScript
// add click handers to the thumbs up and down buttons
$('span#rating_ui > span').click(function(){
  $('#rating_ipt').val($(this).data('rating')).change();
});
```

We should now be able to alter our rating by clicking to tapping on the thumb icons.

### Making the UI Work with the Keyboard

Finally, we need to add keyboard support to our new custom UI. We do this with the help of the `keypress` event.

When any key is pressed, JavaScript fires a `keypress` event. When a key is pressed, the browser triggers a keypress event on the element that currently has focus. Unless that event handler actively halts the process, the browser will then trigger the same event on the element that contains the first, and then the one that contains that, all the way out to the `body` element. This is known as _event propagation_, or, more colloquially, _event bubbling_ (the event bubbles up through the DOM to the root element, i.e. the `body` tag).

It’s very important to note that you can’t register your handler to only be called when a specific key is pressed, the browser will call all the relevant keypress handlers when any key is pressed. So how can we react to specific keys? The key is in the event object.

### Event Objects

Up until this point in the series there has been no need to mention that every jQuery event handler is actually passed an argument when triggered by an event. When a jQuery event handler is invoked, the first argument passed will be a jQuery event object ([see jQuery API for details](http://api.jquery.com/category/events/event-object/)). Up until now we have been ignoring this argument, but we need to stop doing that now. By convention, and only by convention, I’ll be naming that first argument `e` — I strongly suggest you do the same, since that’s what every jQuery developer expects to see.

I’m not going to go into a deep explanation of every function and property provided by jQuery event objects (that’s what the API documentation is for 😉), instead, I’m just going to explain the functionality we need in this instance.

Firstly, once we have handled the keypress, we want to stop the event bubbling up through the DOM. We do that by calling `.stopPropagation()` on the event (which we will be naming `e`).

Secondly, we need to figure out what key was pressed, was it the space, or was it some other key we don’t care about? For this we use the event’s `.which` property. Most annoyingly, this will give us the numeric code for the pressed key, not a string value. For our purposes all we need to know is that the code for the spacebar is `32`, but should you need any other codes, [this great web app](http://keycode.info/) will show you them.

Finally, what exactly do we want to do when the spacebar is pressed? Well – we’d like pressing the space to be the equivalent of clicking the icon, so the simplest thing to do is to simply call the `click` handler from the `keypress` handler.

```JavaScript
// add a keypress handler to the thumbs up and down buttons
$('span#rating_ui > span').keypress(function(e){
  // only respond to the spacebar
  if(e.which === 32){
    $(this).click(); // call the click handler on self
    e.stopPropagation(); // stop the event bubbling
  }
});
```

### Responding to Form Resets

Assuming a web form contains a reset button, when a user presses it, all the elements within the form should return to their default states. As things stand, our custom UI doesn’t do this. To remedy that we need to add a `reset` event handler to the form that contains our hidden element. Note that the handler has to be added to the form, not to the hidden input — `reset` events only fire on forms, not on the elements within forms. Also, there is no jQuery shortcut function for the reset event, so we need to use the generic `.on()` function.

```JavaScript
// add a reset handler for the rating
$('#rating_ipt').closest('form').on('reset', function(){
  $('#rating_ipt').val('').change();
});
```

### Putting it all Together

Below is the code for `pbs41.html` (which you’ll find in this instalment’s ZIP file) – it shows our custom rating UI in context.

```XHTML
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <title>PBS 41 - Quick Review Form</title>
        
    <!-- Import the jQuery API -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha256-k2WSCIexGzOj3Euiig+TlR8gA0EmPjuc79OEeY5L45g=" crossorigin="anonymous"></script>
    
    <!-- Import Font Awesome -->
    <link rel="stylesheet" href="https://use.fontawesome.com/9437c02941.css">
        
    <!-- Add the jQuery event handlers to bring the form to life -->
    <script type="text/javascript">
                
        // add a document ready event handler
        $(function(){
            // add a click handler to the submit button to blank the output area
            $('#submit_btn').click(function(){
                $('#output').val('');
            });
                        
            // add a submission event handler to the form to render
            // the serialised form data to the ouput area
            $('#quick_review_fm').submit(function(){
                $('#output').val($(this).serialize());
            });
            
            // add a change handler to the rating hidden input
            $('#rating_ipt').change(function(){
                $rating = $(this);
                var curVal = $rating.val();
                
                // make sure the current value is valid - otherwise, blank it
                if(!curVal.match(/^[-]?1$/)){
                    curVal = '';
                    $rating.val(curVal);
                }
                
                // render the thumbs down icon as appropriate
                var $down = $('#rating_down');
                if(curVal == -1){
                    $down.removeClass('fa-thumbs-o-down');
                    $down.addClass('fa-thumbs-down');
                    $down.attr('aria-checked', true);
                }else{
                    $down.removeClass('fa-thumbs-down');
                    $down.addClass('fa-thumbs-o-down');
                    $down.attr('aria-checked', false);
                }
                
                // render the thumbs up icon as appropriate
                var $up = $('#rating_up');
                if(curVal == 1){
                    $up.removeClass('fa-thumbs-o-up');
                    $up.addClass('fa-thumbs-up');
                    $up.attr('aria-checked', true);
                }else{
                    $up.removeClass('fa-thumbs-up');
                    $up.addClass('fa-thumbs-o-up');
                    $up.attr('aria-checked', false);
                }
            });
            
            // add click handers to the thumbs up and down buttons
            $('span#rating_ui > span').click(function(){
                $('#rating_ipt').val($(this).data('rating')).change();
            });
            
            // add a keypress handler to the thumbs up and down buttons
            $('span#rating_ui > span').keypress(function(e){
                // only respond to the spacebar
                if(e.which === 32){
                    $(this).click(); // call the click handler on self
                    e.stopPropagation(); // stop the event bubbling
                }
            });
            
            // add a reset handler for the rating
            $('#rating_ipt').closest('form').on('reset', function(){
                $('#rating_ipt').val('').change();
            });
        });
    </script>
        
    <!-- Style the form elements -->
    <style type="text/css">
        /* Set the default fonts */
        body{
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 12pt;
        }
        legend, h1, h2, h3, h4, h5, h6{
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-weight: lighter;
        }
                
        /* Style Fieldsets & Legends */
        fieldset fieldset{
            border-style: dashed;
            margin-bottom: 1em;
        }
        fieldset fieldset fieldset{
            border-style: dotted;
        }
        legend{
            font-size: 20pt;
        }
        fieldset fieldset legend{
            font-size: 16pt;
        }
        fieldset fieldset fieldset legend{
            font-size: 14pt;
        }
                
        /* make text areas full-width */
        textarea{
            width: 100%;
        }
                
        /* Style form instructions */
        .instructions{
            font-style: italic;
            color: DimGrey;
            font-weight: lighter;
        }
        
        /* Mark required fields with a yellow background */
        input:required, textarea:required{
            background-color: lightyellow;
        }
        
        /* Mark text fields with invalid data with a red border and text */
        input:invalid, textarea:invalid{
            color: darkred;
            border-color: red;
            border-width: 1px;
            border-style: solid;
        }
                
        /* style the output area */
        #output{
            font-family: monospace;
        }
        
        /* Style the Ratings UI */
        span#rating_ui > span {
            cursor: pointer;
            color: dimgrey;
        }
        span#rating_ui > span:hover {
            color: black;
        }
    </style>
</head>
<body>
<h1>PBS 41 - Quick Review Form</h1>

<form action="javascript:void(0);" id="quick_review_fm">
<fieldset role="form" aria-labelledby="quick_review_fm_desc">
    <legend id="quick_review_fm_desc">Quick Review</legend>
        
    <ul>
        <li>
            <label for="comments_ta">Comments</label><br>
            <textarea id="comments_ta" name="comments" required rows=3></textarea>
        </li>
        <li>
            <label id="rating_label">Rating</label>
            <span id="rating_ui" role="buttongroup" aria-labelled-by="rating_label">
                <span class="fa fa-thumbs-o-down" id="rating_down" data-rating="-1" title="Thumbs Down" tabindex="0" role="radio" aria-checked="false" aria-label="Thumbs Down"></span>
                <span class="fa fa-thumbs-o-up" id="rating_up" data-rating="1" title="Thumbs Up" tabindex="0" role="radio" aria-checked="false" aria-label="Thumbs Up"></span>
            </span>
            <input type="hidden" name="rating" id="rating_ipt">
        </li>
    </ul>
    
    <p><button type="submit" id="submit_btn">Submit!</button> <button type="reset">Reset</button></p>
    <p>Submitted Data:</p>
    <textarea id="output" disabled></textarea>
</fieldset>
</form>

</body>
</html>
```

## Form Events Wrapup

Before we finish with forms, I want take a final look at event form-related event handlers, and give you some guidance for which to use on what elements.

| Element | Event(s) | Usage |
| --- | --- | --- |
| `<form>` | `submit` & `reset` | If the form contains elements with custom validations, they should be re-evaluated by handlers tied to both of these events. If the form contains custom UI elements, there should be a `reset` handler to ensure the custom element resets properly. |
| `<button>` | `click` | Use this handler to attach an action to a button. |
| `<input type=checkbox>`, `<input type=radio>` & `<select>` | `change` | If custom validation is needed on any of these elements it should be attached to this handler. |
| `<input type=text>` & `<textarea>` | `input` | If custom validation is needed on text fields it should be attached to this handler. |

Note that in the previous instalment we used the `keyup` event for text inputs rather than the `input` event suggested here. That was the old way of doing things, and as listener Jill pointed out, that event has significant short-comings — not all text comes from typing! Text fields can auto-complete, and users can paste with the mouse, and in those scenarios, the `keyup` event will not fire. Thankfully the newer `input` event will fire in those scenarios because it fires on all input, regardless of the source.

## Useful Links

*   A great web app for finding the codes for any key on your keyboard – [keycode.info](http://keycode.info)
*   API documentation for jQuery Event Objects – [api.jquery.com/…](http://api.jquery.com/category/events/event-object/)
*   MDN’s Event Reference — a definitive list of all possible events fired by browsers with links to the documentation describing each – [developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/Events)
*   The `.validate()` jQuery plugin – [jqueryvalidation.org](https://jqueryvalidation.org)

We’ve taken HTML 5 form validation as far as it can go today. It’s a new feature, and it can’t do everything you might conceivably need. Should you find yourself in need of more powerful validation, you’ll have two choices – write your own validation functions from scratch using your JavaScript and jQuery skills, or, find and use an existing third-party library. Basically, the age old question, do you re-invent the wheel, or seek out a good wheel created by someone else. There are pros and cons to both approaches, and you’ll hear passionate arguments on all sides.

For what its worth, my advice is to default to using a third-party library, and to fall back on writing your own only when that fails for some reason.

Should you choose to use a third-party library for more advanced form validation, then I would recommend you give the `.validate()` jQuery plugin a go. It’s a mature project that’s under active development, it’s heavily used in the community, and it leverages off jQuery, which you already know. To give you some idea of the project’s pedigree — it’s been on the go since 2006, and its lead developer is a developer with the jQuery project, and the maintainer of the QUnit testing suite we’ve used throughout much of this series.

## A Challenge

Update the web form you created in the previous challenge in the following ways:

1.  If there isn’t one already, add a reset button.
2.  If you don’t have a custom validation already, add at least one. Make sure to add handlers for the form’s `submit` and `reset` events that will update your custom validation message(s) appropriately.
3.  If you haven’t already done so, add a star rating as a custom UI.
4.  Ensure your entire form works via keyboard interaction by adding the appropriate HTML markup and event handlers to your custom UI elements.

## Final Thoughts

We now have a good grounding in HTML forms, so we’re finally ready to return to our aellular automata prototypes and bring them to life as a web app.