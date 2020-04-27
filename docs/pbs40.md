# PBS 40 of x – HTML5 Custom Validations with jQuery

At the end of the previous instalment I promised we were done with HTML form validation, and insisted we were ready to move on to finishing our Cellular Automata, but it turns out that was a little premature. While working on my sample solution for the [previous instalment](https://bartificer.net/pbs39)‘s challenge I realised I’d forgotten to cover something very important – the fact that you can use jQuery to deal with situations where the HTML5 form validation attributes are not powerful enough for your needs. So – we need to rectify that oversight, and that’s going to take this entire instalment to do.

Then, while doing her homework, Allison discovered another oversight that needs to be remedied before we move away from HTML forms – we need to look at how to support keyboard-only interactions. Why? In a word – accessibility. So, in the next instalment we’ll start by looking at the narrow case of supporting keyboard input in forms, but we’ll then move on and look at keyboard interactions a little more broadly, and we’ll learn how to add keyboard shortcuts to our web apps. This will come in useful when we do then finally move on to getting our cellular automata working the following instalment.

As usual, I’ve collected all the files for this instalment into a single ZIP file which you can [download here](https://www.bartbusschots.ie/s/wp-content/uploads/2017/09/pbs40.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs40.zip).

# Matching Podcast Episode 503

Listen Along: Chit Chat Accross the Pond Episode 503

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_09_29.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2017_09_29.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 39 Challenge – Sample Solution

At the end of the previous instalment I set the challenge of creating a web form for entering details about movies for some kind of movie database. I left the assignment intentionally vague and open-ended so you could really let your imagination run wild.

Because the assignment was so open-ended, everyone’s solution is going to be very different, so my sample solution really is a sample, and it may look nothing like what you came up with. Anyhow, below is my code, and you can find a copy in this instalment’s ZIP file as `pbs39-challenge-sampleSollution/pbs39-challenge.html`:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <title>PBS 39 Challenge - Movie Entry Form</title>

    <!-- Import the jQuery API -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha256-k2WSCIexGzOj3Euiig+TlR8gA0EmPjuc79OEeY5L45g=" crossorigin="anonymous"></script>

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
            $('#movie_entry_fm').submit(function(){
                $('#output').val($(this).serialize());
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

        /* two-column region using flexbox */
        div.twocols{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
        div.twocols > *{
            flex-basis: 50%;
            box-sizing: border-box;
            padding-left: 1em;
            padding-right: 1em;
        }
        div.twocols > *:first-child{
            padding-left: 0px;
        }
        div.twocols > *:last-child{
            padding-right: 0px;
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

        /* a class for inline lists */
        ul.inlined{
            padding-left: 0px;
        }
        ul.inlined > li{
            display: inline;
            list-style-type: none;
            white-space: nowrap;
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

        /* Highlight the label for checked checkboxes */
        input:checked + label{
            font-weight: bold;
        }

        /* style the output area */
        #output{
            font-family: monospace;
        }

        /* Custom styling for the basics input group */
        label[for="year_tb"], label[for="rating_sel"]{
            display: none;
        }

        /* Custom styling for the meta input group */
        #meta_fs > ul{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding-left: 0px;
        }
        #meta_fs > ul > li{
            list-style-type: none;
            flex-basis: 50%;
            box-sizing: border-box;
            padding: 1em;
        }
        #genre_fs > ul > li{
            margin-right: 0.5em;
        }

        /* custom styling for the creators input group */
        #creators_fs > ul{
            padding-left: 0px;
        }
        #creators_fs > ul > li{
            list-style-type: none;
            margin-bottom: 0.5em;
        }
    </style>
</head>
<body>
<h1>PBS 39 Challenge - Movie Entry Form</h1>

<form action="javascript:void(0);" id="movie_entry_fm">
<fieldset role="form" aria-labelledby="movie_entry_fm_desc">
    <legend id="movie_entry_fm_desc">Movie Details</legend>

    <fieldset id="basics_fs" role="group" aria-labelledby="basics_fs_desc">
      <legend id="basics_fs_desc">Basics</legend>

      <ul class="inlined">
        <li>
            <label for="title_tb">Title</label>
            <input type="text" id="title_tb" name="title" required>
        </li>
        <li>
            <label for="year_tb">Year (YYYY)</label>
            <input type="number" id="year_tb" name="year" required min=1000 max=9999 value=2017>
        </li>
        <li>
            <label for="rating_sel">MPAA Rating</label>
            <select id="rating_sel">
                <option value="" selected>Unrated</option>
                <option value="G">G – General Audiences</option>
                <option value="PG">PG – Parental Guidance Suggested</option>
                <option value="PG-13">PG-13 – Parents Strongly Cautioned</option>
                <option value="R">R – Restricted</option>
                <option value="NC-17">NC-17 – Adults Only</option>
            </select>
        </li>
      </ul>
    </fieldset>

    <fieldset id="meta_fs" role="group" aria-labelledby="meta_fs_desc">
        <legend id="meta_fs_desc">Meta Data</legend>

        <ul>
            <li>
                <fieldset id="genre_fs" role="group" aria-labelledby="genre_fs_desc">
                    <legend id="genre_fs_desc">Genre(s)</legend>
                    <ul class="inlined">
                        <li>
                            <input type="checkbox" id="genre_animated_cb" name="genre" value="animated">
                            <label for="genre_animated_cb">Animated</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_biopic_cb" name="genre" value="biopic">
                            <label for="genre_biopic_cb"><em>Biopic</em></label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_comedy_cb" name="genre" value="comedy">
                            <label for="genre_comedy_cb">Comedy</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_docudrama_cb" name="genre" value="docudrama">
                            <label for="genre_docudrama_cb"><em>Docudrama</em></label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_documentary_cb" name="genre" value="documentary">
                            <label for="genre_documentary_cb">Documentary</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_fantasy_cb" name="genre" value="fantasy">
                            <label for="genre_fantasy_cb">Fantasy</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_horror_cb" name="genre" value="horror">
                            <label for="genre_horror_cb">Horror</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_musical_cb" name="genre" value="musical">
                            <label for="genre_musical_cb">Musical</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_period_cb" name="genre" value="period">
                            <label for="genre_period_cb">Period Drama</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_romcom_cb" name="genre" value="romcom">
                            <label for="genre_romcom_cb">Romantic Comedy</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_scifi_cb" name="genre" value="scifi">
                            <label for="genre_scifi_cb">Science Fiction</label>
                        </li>
                        <li>
                            <input type="checkbox" id="genre_thriller_cb" name="genre" value="thriller">
                            <label for="genre_thriller_cb">Thriller</label>
                        </li>
                    </ul>
                </fieldset>
            </li>
            <li>
                <fieldset id="summary_fs" role="group" aria-labelledby="summary_fs_desc">
                    <legend id="summary_fs_desc"><label for="summary_ta">Plot Summary</label></legend>
                    <ul class="inlined">
                        <li>
                            <textarea id="summary_ta" name="summary" rows=5></textarea>
                        </li>
                    </ul>
                </fieldset>
            </li>
          </ul>
    </fieldset>

    <div class="twocols">
        <div>
            <fieldset id="creators_fs" role="group" aria-labelledby="creators_fs_desc">
                <legend id="creators_fs_desc">Creators</legend>
                <p class="instructions">Enter the name(s) of the creators, one per line.</p>
                <ul>
                    <li>
                        <label for="exec_producers_ta">Executive Producer(s)</label><br>
                        <textarea id="exec_producers_ta" name="exec_producers" required rows=3></textarea>
                    </li>
                    <li>
                        <label for="producers_ta">Producer(s)</label><br>
                        <textarea id="producers_ta" name="producers" required rows=3></textarea>
                    </li>
                    <li>
                        <label for="directors_ta">Director(s)</label><br>
                        <textarea id="directors_ta" name="directors" required rows=3></textarea>
                    </li>
                </ul>
            </fieldset>
        </div>

        <div>
            <fieldset id="cast_fs" role="group" aria-labelledby="cast_fs_desc">
                <legend id="cast_fs_desc"><label for="cast_ta">Cast</label></legend>
                <p class="instructions">Enter the cast one per line as character names and actor names separated by a colon.</p>
                <textarea id="cast_ta" name="cast" required placeholder="Character Name: Actor Name" rows=10></textarea>
            </fieldset>
        </div>
    </div>

    <p><button type="submit" id="submit_btn">Submit!</button></p>
    <p>Submitted Data:</p>
    <textarea id="output" disabled></textarea>
</fieldset>
</form>

</body>
</html>
```

This results in a form that looks like this:

![](../assets/pbs40/Screen-Shot-2017-09-29-at-11.17.26-e1506680474620.png)

I don’t want to go through my solution line-by-line, but I do want to draw your attention to a few things.

### Use of Fieldsets

When creating a complex form, it often makes things much easier for users to break the form into groups of related form elements. In HTML, the appropriate elements for doing so are `<fieldset>` and `<legend>`. You should have one `<fieldset>` surrounding the entire form, and you can then nest further `<fieldset>` elements inside each other as deeply as needed for your particular form.

As we learned back in [instalment 31](https://bartificer.net/pbs31), you need to use the ARIA spec to help screen readers understand the layout of your form. To do that you need to use the role attribute to specific which `<fieldset>` represents the entire form (`role="form"`), and which represent groups of inputs (`role="group"`). You should also make it clear which text is serving as the label for the form as a whole, and for each group with the `aria-labelledby` attribute.

This snippet from my sample solution illustrates my use of field sets:

```XHTML
<fieldset role="form" aria-labelledby="movie_entry_fm_desc">
  <legend id="movie_entry_fm_desc">Movie Details</legend>

  <fieldset id="basics_fs" role="group" aria-labelledby="basics_fs_desc">
    <legend id="basics_fs_desc">Basics</legend>

    <!-- ... lots more code here ... -->

  </fieldset>

  <fieldset id="meta_fs" role="group" aria-labelledby="meta_fs_desc">
    <legend id="meta_fs_desc">Meta Data</legend>

    <!-- ... lots more code here ... -->

  </fieldset>

  <!-- ... lots more code here ... -->

</fieldset>
```

### Think Hard About Which Form Elements to Use

When designing a form, the first thing you need to do is figure out what information you want to extract from the user.

Once you have a list of pieces of information, you need to go through that list item by item and decide which of the many possible form elements would work best. Don’t assume there will be a one-to-one mapping between the data you want and form elements. Sometimes you’ll use many form elements to capture one piece of information. E.g. it make make sense to use multiple drop-down-lists to collect date information. Ultimately, it’s about choosing the form elements that will make it as easy as possible for the users to instinctively do the right thing, and as hard as possible to do the wrong thing.

### Always Remember that Markup and Presentation are Loosely Coupled

Let me just repeat my mantra – _“HTML is for defining what something is, CSS is for defining how it should look”_.

Try to avoid altering your HTML to suit your presentation preferences. Instead, start by writing logical HTML that captures the structure of your form, then, style it. You’d be surprised how disconnected markup and look can be.

As an example, in my HTML markup, my fields and their matching labels are contained within unordered lists. Despite this fact, there is not a single bullet character visible on the page! The reason for this is that I chose to style my lists without bullets, but fundamentally, the genre section really is just a list of genres, so the HTML markup reflects that.

Here is a snippet of the HTML for my genre section:

```XHTML
<fieldset id="genre_fs" role="group" aria-labelledby="genre_fs_desc">
  <legend id="genre_fs_desc">Genre(s)</legend>

  <ul class="inlined">
    <li>
      <input type="checkbox" id="genre_animated_cb" name="genre" value="animated">
      <label for="genre_animated_cb">Animated</label>
    </li>

    <!-- ... lots more genres here ... -->

    <li>
      <input type="checkbox" id="genre_thriller_cb" name="genre" value="thriller">
      <label for="genre_thriller_cb">Thriller</label>
    </li>
  </ul>
</fieldset>
```

And here are the relevant sections of my CSS for displaying the genres as I do:

```CSS
/* a class for inline lists */
ul.inlined{
  padding-left: 0px;
}
ul.inlined > li{
  display: inline;
  list-style-type: none;
  white-space: nowrap;
}

/* Custom styling for the meta input group */
/* ... */
#genre_fs > ul > li{
  margin-right: 0.5em;
}
```

What does this CSS do? It removes the left-padding that usually accompanies unordered lists, it removes the bullets, it sets each list item to be an inline block element, it ensures that no list item will ever be split over multiple lines (i.e. that the checkbox and label will move to a new line together), and it adds a little padding between each of the genres to make them easier to read.

As well as changing how something is displayed, you can also choose not to display it at all. The _Basics_ section provides a good example of this concept. This grouping of related inputs captures three pieces of information – the movie’s title, year, and MPAA rating. The section is marked up as an un-ordered list with an element for each piece of information, and each list item contains a label and a form element:

```XHTML
<fieldset id="basics_fs" role="group" aria-labelledby="basics_fs_desc">
  <legend id="basics_fs_desc">Basics</legend>

  <ul class="inlined">
    <li>
      <label for="title_tb">Title</label>
      <input type="text" id="title_tb" name="title" required>
    </li>
    <li>
      <label for="year_tb">Year (YYYY)</label>
      <input type="number" id="year_tb" name="year" required min=1000 max=9999 value=2017>
    </li>
    <li>
      <label for="rating_sel">MPAA Rating</label>
      <select id="rating_sel">
        <option value="" selected>Unrated</option>
        <option value="G">G – General Audiences</option>
        <option value="PG">PG – Parental Guidance Suggested</option>
        <option value="PG-13">PG-13 – Parents Strongly Cautioned</option>
        <option value="R">R – Restricted</option>
        <option value="NC-17">NC-17 – Adults Only</option>
      </select>
    </li>
  </ul>
</fieldset>
```

Displaying each element on a separate line with bullets would be a waste of space, so the first thing I did was inline the list (similar to the genre example we’ve already seen).

The next thing to note is that the year and the rating are effectively self-documenting. Does having the label visible add clarity? Or does it just add confusing clutter? I would argue that those two specific labels add unhelpful clutter, and that the form would be clearer without them. I could have deleted the labels form the markup, but that would be a terrible thing to do – why? Because accessibility tools rely on the presence of those labels! Instead, the correct thing to do is to use CSS to hide just those two labels:

```CSS
/* Custom styling for the basics input group */
label[for="year_tb"], label[for="rating_sel"]{
  display: none;
}
```

Finally, notice that I used CSS’s flex box feature to lay out the form. We covered flex box way way way back in [instalment 9](https://www.bartbusschots.ie/s/2016/02/19/programming-by-stealth-9-of-x-more-css-positioning/).

### Validation Shortcomings

Notice that this sample solution’s validation has at least two significant shortcomings.

Firstly, there is no way with pure HTML5 form validation to check the validity of the content entered into the cast text area. We can’t even use a regular expression because the `pattern` attribute is only supported on the `input` element, not the `textarea` element.

Secondly, we can’t enforce the requirement that the user select at least one genre.

These serve as good examples of two common classes of edge-case – single inputs that need more powerful validation than that offered by the HTML5 validation attributes, and, constraints that are spread between multiple form elements.

## HTML5 Form Validation & JavaScript

To add custom form validation you need to understand two things – the `.setCustomValidity()` function provided by the DOM, and, event handlers. The `.setCustomValidity()` function allows you to attach a validation error of your choice to any form element, and event handlers allow you to trigger code when a user interacts with a form.

### The `.setCustomValidity()` DOM Function

In this series I’ve generally avoided direct DOM manipulation, and instead uses the much more human-friendly jQuery API to interact with the DOM on our behalf. This is one of the few instances where jQuery can’t help us, and we have to interact with the DOM directly – the `.setCustomValidity()` is not a jQuery function, it’s a native DOM function that exists on form elements.

Before we go any further, let’s do some quick revision on how jQuery works. When you use the jQuery function (the shortcut `$()` or the full `jQuery()`) to query a page for a collection of HTML elements, what you get in effect is an object that contains an array of raw DOM objects. You can access these raw DOM objects directly using standard array notation. For example, you can get the raw DOM object for the first paragraph on a page with `$('p')[0]`. There is a better way though – jQuery’s `.get()` function provides easy access to the underlying DOM objects, and it offers the advantage of supporting negative indexes – that is to say, you can count from the front or the back! For example, you can get the DOM object for the first paragraph on a page with `$('p').get(0)`, and for the last with `$('p').get(-1)`. If you specify an invalid index, or an index that goes out of range, `undefined` will be returned. You’ll find a [full description of the `.get()` function in the jQuery docs](https://api.jquery.com/get/).

So – to use the `.setCustomValidity()` function we need to either use the array syntax on a jQuery object, or, jQuery’s `.get()` function.

As well as supporting the validation attributes we’ve already seen like `required`, `minlength`, `pattern`, etc., HTML5 also supports the concept of a custom validity. If an item within a form’s DOM object has a custom validity property with any value other than an empty string, the browser considers that item to be in an invalid state. The `.setCustomValidity()` function allows us to alter the value of this DOM property. If you set the value of this property to a string of your choice, then form validation will fail, and the browser will display the string in a standard HTML form validation error message dialogue.

So, you could mark an input with the ID `input1_tb` as invalid and have it display the message _‘Enter a US ZIP code’_ with:

```JavaScript
$('#input1_tb').get(0).setCustomValidity('Enter a US ZIP code');
```

You could later remove this validation error with:

```JavaScript
$('#input1_tb').get(0).setCustomValidity('');
```

Calling `.setCustomValidity()` sets the validation state of the form item indefinitely – it in no way instructions the browser how to re-calculate the validity in the future. To do that, we’ll need event handlers.

### Event Handlers in Forms (Mostly Revision)

We learned about jQuery event handlers way back in [instalment 22](https://bartificer.net/pbs22), but let’s remind ourselves of the basics again.

The DOM defines a finite set of events that can occur within a browser window. Most events are triggered by some kind of human interaction, and most have a target associated with them. For example, a user can click on a specific button, or type into a specific text box. Every element in a web page maintains a list of mappings between events that can be triggered on that element, and the functions to call should such an event occur. In web development jargon we would describe adding such a mapping between an event and a function to an element as _adding a listener_ or _adding an event handler_ to that element.

There are two ways of adding an event handler to one or more objects in jQuery, we can either use the generic `.on()` function, or, we can use one of the many convenient shortcut functions jQuery provides. To add a click handler to every checkbox on a page we could do something like:

```JavaScript
$('input[type="checkbox"]').on('click', function(){
    console.log('CLICK!!!');
});
```

Alternatively, we could use the `.click()` shortcut function to achieve the same thing:

```JavaScript
$('input[type="checkbox"]').click(function(){
    console.log('CLICK!!!');
});
```

When it comes to validation forms, the events we’re interested in are user clicks, changes in the state of an item (selected to un-selected, checked to un-checked etc.), text entry, and form submission. In jQuery terms that means the `.click()`, `.change()`, `.keyup()`, and `.submit()` shortcut functions.

Remember that when a jQuery event handler is called, the value of the special `this` variable within the body of the function will be a reference to the DOM object the event was triggered on. In the above examples, `this` would be a reference to the DOM object representing the exact checkbox that was clicked on. Also remember that you can convert a DOM object into a jQuery object by passing it to the jQuery function as the only argument, so you can convert `this` to a jQuery object like so: `$(this)`.

Finally, also remember that you can call all the registered event handlers on an element using the same shortcut functions but without arguments.

### Worked Example – Adding Custom Validation to PBS 39 Sample Solution

Let’s start by adding validation to the cast text box. What we need to ensure is that there is text in the text area, and that each line consists of a character name and an actor’s name separated by a colon character. We’ll create a function to perform this validation for us, remembering that when we use the function as an event handler, the special `this` variable will contain a reference to the DOM object representing the text area.

```JavaScript
// an event handler to validate the cast list
function validateCastList(){
    // convert the DOM object to a jQuery object
    var $cast = $(this);

    // get the current content of the text area
    var castString = $cast.val();

    // if the text area is empty, set an error message and return
    if(castString === ''){
        $cast.get(0).setCustomValidity('Enter at least one cast member');
        return false;
    }

    // split the cast into lines and validate each
    // if even one line fails - set an error message and return
    var castLines = castString.split('\n');
    for(var l = 0; l < castLines.length; l++){
        // use a regular expression to validate the line
        if(!castLines[l].match(/^[^:]+[ ]*[:][ ]*[^:]+$/)){
            $cast.get(0).setCustomValidity("Enter lines of the form 'Character : Actor'");
            return false;
        }
    }

    // if we got here, all is well so mark as valid
    $cast.get(0).setCustomValidity('');
    return true;
}
```

We now need to attach this function to the keyboard event on the text area. This needs to be done after the DOM has loaded. Remember that when you pass the jQuery function a callback as the only argument, this callback will be added as an event handler for the DOM read event. The sample solution already has a DOM ready event handler:

```JavaScript
// add a document ready event handler
$(function(){
    // add a click handler to the submit button to blank the output area
    $('#submit_btn').click(function(){
        $('#output').text('');
    });

    // add a submission event handler to the form to render
    // the serialised form data to the ouput area
    $('#movie_entry_fm').submit(function(){
            $('#output').text($(this).serialize());
    });
});
```

We should add our code the end of the anonymous function like so:

```JavaScript
// add a document ready event handler
$(function(){
    // add a click handler to the submit button to blank the output area
    $('#submit_btn').click(function(){
        $('#output').text('');
    });

    // add a submission event handler to the form to render
    // the serialised form data to the ouput area
    $('#movie_entry_fm').submit(function(){
            $('#output').text($(this).serialize());
    });

    // add an event handler to validate the cast each time a key is pressed
    // and call it once to get it set correctly initially
    $('#cast_ta').keyup(validateCastList).keyup();
});
```

Notice that we make use of function chaining to first add a listener to the keyup event on the text area, then, to trigger the keyup event on the text area. Let’s break the last line up into pieces and follow it through.

Firstly, `$('#cast_ta')` is a call to the jQuery function with a CSS selector string as the only argument. This will evaluate to a jQuery object that represents the DOM element with ID `cast_ta`.

Next, the `.keyup()` function gets called on the jQuery object with a callback as the only argument. This results in the callback being registered as an event handler on the text area for the `keyup` event. As [the official jQuery documentation shows](https://api.jquery.com/keyup/), the `.keyup()` function returns a reference to the object it was called on, so our line so far still evaluates to the same jQuery object representing the same text area.

Finally, we call the `.keyup()` function on the jQuery object again, but this time with no arguments. This triggers the keyup event, executing our event handler. This is important, because if we don’t trigger the event at least once, the form will not be in a consistent state when the page loads.

OK – we now have custom validation on the cast list.

Now let’s add code to ensure that at least one genre must be selected.

Again, let’s start by building a function that checks if at least one genre is chosen, and if not, adds a custom validation error message to the first genre checkbox:

```JavaScript
// an event handler to ensure at least one genre is chosen
function validateGenres(){
    // build a jQuery object that references all the genre checkboxes
    // note they all have the same name and are contained within the same fieldset
    var $genres = $('#genre_fs input[name="genre"]');

    // make sure at least one is checked, or mark the first as invalid and return
    if($genres.filter(':checked').length < 1){
        $genres.get(0).setCustomValidity('Select at least one genre');
        return false;
    }

    // if we got here all is well, so mark the first checkbox as valid
    $genres.get(0).setCustomValidity('');
    return true;
}
```

Now that we have this function we need to attach it to the change handler for every genre checkbox so the validity gets re-calculated each time any genre is checked or un-checked. Again, we do this by adding our code to the bottom of the existing document ready event handler:

```JavaScript
// add a document ready event handler
$(function(){
    // add a click handler to the submit button to blank the output area
    $('#submit_btn').click(function(){
        $('#output').text('');
    });

    // add a submission event handler to the form to render
    // the serialised form data to the ouput area
    $('#movie_entry_fm').submit(function(){
        $('#output').text($(this).serialize());
    });

    // add an event handler to validate the cast each time a key is pressed
    // and call it once to get it set correctly initially
    $('#cast_ta').keyup(validateCastList).keyup();

    // add an event handler to validate the geners each time any genre is
    // checked or un-checked and call it once to get it set correctly
    $('#genre_fs input[name="genre"]').change(validateGenres).first().change();
});
```

Notice that the construction is similar to our previous example, but not quite the same. Firstly, our CSS selector matches many elements within the page, so the resulting jQuery object does not represent one DOM element, but many. If we added the call to `.change()` without arguments directly after the first call to `.change()` we would trigger that event on all the genre checkboxes. This would work, but it would also be a pointless waste of CPU time. This is why I inserted a call to the `.first()` function between the two calls to `.change()`. As [the official jQuery documentation explains](https://api.jquery.com/first/), `.first()` returns a new jQuery object representing only the first DOM element contained in the original jQuery object.

You’ll find the complete final version of the form in this instalment’s ZIP file as `pbs40.html`.

## A Challenge

Using your own solution to the previous challenge, add some JavaScript-based custom validations.

## Final Thoughts

We now have the ability to add arbitrarily complex client-side validation to our forms. In the next instalment we’ll look at making sure our forms work well for keyboard users, and then, in the instalment after that we’ll bring it all together and bring our cellular automata to life.
