# PBS 96 of X — World Clock Challenge Solution

In this instalment we're taking a break from learning new things to look at two sample solutions to the world clock challenge set at the end of PBS 92. I'll start by handing over to Allison to describe her sample solution, and then I'll take over again to share mine.

## Allison's World Clock

> This entire section is written by [Allison Sheridan](https://www.podfeet.com/).
{: .aside }

Allison taking over the reigns here to talk about how I approached making the clock as our challenge from PBS 92.  If you'd like to see the results of my clock you can view them on Glitch here: [https://nc-world-clock.glitch.me](https://nc-world-clock.glitch.me) and you can see the code files at [glitch.com/...](https://glitch.com/edit/#!/nc-world-clock?path=index.html%3A1%3A0)

I really enjoyed the clock assignment, even though technically we had learned how to make clocks in Programming By Stealth many many lessons ago.  I decided not to go back and look at those instructions and start from scratch with my newly-learned tools to see if I could make it happen.

### Writing Cleaner Code
In watching the elegance of the code Bart writes, I wanted mine to look more like his. I'm not even close, but it's less of a "dog's dinner" as Bart would say.  I started using all capital letters for a certain type of variable name and it was surprisingly easier to read.  I'm also trying to do the documentation bit but I'm calling far short of my intentions so far. I do plan on documenting this (don't developer's always say that?) but I need a way to visualize how the documentation will be visualized so I can see if it's making sense.

The first thing I did in this assignment was write my JavaScript in a separate file from my HTML, as Bart had suggested. It was far easier to mentally keep track of what was happening where.  Previously I'd been writing it in one long file.   Then I was using the "split right" command in my editor, [Microsoft's Visual Studio Code](https://code.visualstudio.com) which allowed me to have two copies of the same file open at the same time, but scrolled to two different positions.  With the HTML and JavaScript separated, that wasn't necessary as often, but as my code has been getting more complex I do often need to use that functionality.

A few challenges back, I started adding a standardized `navbar` at the top of every assignment with what I consider helpful resources. In the `navbar` I put in a dropdown for specific PBS Resources, like links to [Dorothy's PBS Index](https://www.podfeet.com/blog/pbs-index/), the [Bootstrap documentation](https://getbootstrap.com/docs/4.3/getting-started/introduction/), the [jQuery API](https://api.jquery.com) and the [AJAX API](https://api.jquery.com/category/ajax/).  Then I add in useful resources for the particular assignment.  This time that included direct links to [Moment.js Home](https://momentjs.com), [Moment.js Docs](https://momentjs.com/docs/#/use-it/browser/), and [Moment TimeZone Docs](https://momentjs.com/timezone/).  With these items in the `navbar`, I always have quick access to them.

![Navbar to show all the resources needed](https://github.com/bartificer/programming-by-stealth/blob/master/docs/pbs96Assets/allisonNavbar.png)

```html
	<nav class='navbar navbar-expand-md navbar-light'>
	      <a class='navbar-brand' href="#">Helpful Resources</a>
	      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	        <span class="navbar-toggler-icon"></span>
	      </button>
	      <div class="collapse navbar-collapse" id="navbarSupportedContent">
	        <ul class="navbar-nav mr-auto">
	          <li class="nav-item active">
	            <a class="nav-link" href="https://momentjs.com">Moment.js home</a>
	          </li>
	          <li class="nav-item active">
	            <a class="nav-link" href="https://momentjs.com/docs/#/use-it/browser/">Moment.js docs</a>
	          </li>
	          <li class="nav-item active">
	            <a class="nav-link" href="https://momentjs.com/timezone/">Moment Timezone docs</a>
	          </li>
	          <li class="nav-item dropdown">
	            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	              PBS Resources
	            </a>
	            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
	              <div class="dropdown-divider"></div>
	              <a class="nav-link dropdown-item" href="https://www.podfeet.com/blog/pbs-index/"  rel="no opener" target="_blank">PBS Index</a>
	              <a class="nav-link dropdown-item" href="https://getbootstrap.com/docs/4.3/getting-started/introduction/"  rel="no opener" target="_blank">Bootstrap Docs</a>
	              <a class="nav-link dropdown-item" href="https://api.jquery.com"  rel="no opener" target="_blank">jQuery API</a>
	              <a class="nav-link dropdown-item" href="https://api.jquery.com/category/ajax/"  rel="no opener" target="_blank">AJAX API</a>
	            </div>
	          </li>
	        </ul>
	      </div>
	    </nav>
```

### Moment.js for the Clocks

Step 1 of the challenge was to allow the user to control the timezone for the clock.  No matter how you approach it, dealing with timezones is a nightmare.  Bart suggested (but didn't require) we use moment.js, and it was very sane advice.  I wrote an extensive blog post on [www.podfeet.com/... entitled Time is Weird ](#)(https://www.podfeet.com/blog/2020/04/time-is-weird/) where I chronicled my adventures trying to figure out how to allow people to see the time in a timezone of their choosing.

My main challenge was not how to find the timezone data, but how to display it simply and elegantly. I'll not bore you with the incorrect paths I took (because they're in the blog post) and in the end I went for a path that included pretty much every single available city and time offset in a giant list.  By giant, I mean 539 items in my dropdown to choose the timezone! I was inspired by Michael Westbay's clock solution to this problem that he posted in the PBS channel in our community Slack ([podfeet.com/slack](https://podfeet.com/slack)).  He provided a text input field where people can start typing a city and if there's a match, it will show it to them.  That's going to be in the next rev of my web app.  For now, enjoy scrolling.  

### Modifying the time format
Armed with a well-formatted, if exhaustive JSON dictionary of timezone data, it was actually pretty easy to use moment.js to create a working clock. Items 2 and 3 were to allow the user to choose a 12 or 24 hour clock and whether or not to show seconds.  Moment.js documentation was pretty good at explaining how to make these different formats.

I decided to declare some variables that were the strings that moment.js required for the different formats.  For example, TIME24WSEC was the string 'h:mm:ss a'.  I also created variables for whether the user wanted seconds and a 12 hour clock.  Finally I created one variable called FORMATTEDTIME in which I would put the chosen format. I set it to a default value of time with 12 seconds.

```js
	// Time formats
	let h = 'h';
	let m = 'mm';
	let s = 'ss a';
	let TIME12WSEC = 'h:mm:ss a';
	let TIME12WOSEC = 'h:mm a';
	let TIME24WSEC = 'HH:mm:ss';
	let TIME24WOSEC = 'HH:mm';
	let FORMATTEDTIME = TIME12WSEC; // Default formatted time
	let TRUESECONDS = true; // boolean true if show seconds is true
	let TRUE12HR = true; // boolean true if numHrs is 12
```

I created two "checkboxes" and formatted them using Bootstrap to look like toggle switches.  These checkboxes were to select between 12 and 24 hour clocks and whether or not to show the seconds.  I ran into an interesting problem though. If you have a checkbox, it only has one label.  But if visually it looks like a toggle, then there's an expectation that there's a label on both sides.

My solution was to use "12 Hour Clock" as the real label for the checkbox and to put a plain old line of text to the left of the checkbox that said "24 Hour Clock".  But that opened up a can of worms for a screen reader. How are they to know that the other glop of text was explaining the checkbox? I chose to put a `div` with `class ="sr-only"` to give them a fighting chance.  I asked good friend of the NosillaCast Scott Howell to test it for me.  We both discovered using VoiceOver that it worked well enough but that there's some sort of bug where labels on checkboxes get read out twice. I was able to find people chatting about the problem more than 5 years back so I decided I wouldn't worry about it.

![Toggle Switches that are really checkboxes](https://github.com/bartificer/programming-by-stealth/blob/master/docs/pbs96Assets/allisonToggleSwitches.png)

```js
	<!-- Switch to  12 vs 24 hr clock -->
	          <div class="row pl-3 pb-3"> <!-- row for numHrs switch -->
	            <div class="col col-md-6 form-control form-check-inline bg-light border border-dark rounded p-2 m3">
	              <!-- Description of checkbox for screen readers -->
	              <div id="hrsDesc" class="sr-only">Switch to toggle between 24 and 12 hour clock</div> 
	              <div class="mr-2 font-weight-bold mySwitches d-none d-md-inline">24 Hour Clock</div>
	              <div class="mr-2 font-weight-bold mySwitches d-inline d-md-none">24 Hour</div>
	              <div class="custom-control custom-switch form-control-md" aria-describedby="hrsDesc">
	                  <input type="checkbox" class="custom-control-input" checked id="numHrs" name="numHrs" >
	                <label class="custom-control-label mySwitches" for="numHrs">12 Hour Clock</label>
	              
	              </div>
	            </div>
	          </div>
	          <!-- end switch 12 vs 24 hr clock -->
```

Next up I needed two event handlers. One to capture the user's desire for the clock format from my two checkboxes, and the second to capture the selected timezone from the Dropdown of Doom (™Donald Burr).  Because I created the time format variables up front, I found that rendering the time because a trivial amount of code:

```js
	function renderTime(){
	    $('#forTime2').html(moment().tz(selectedZone).format(FORMATTEDTIME)); // time in selected zone
	  }
```

In this line, `#forTime2` was the ID of the div to hold this clock, and "selectedZone" was the chosen value from the dropdown select.  

Everything worked swimmingly until I saw the last part of the challenge, and that was whether or not to show pulsing dividers between the parts of the time.  In order to execute that part of the assignment, I would have to completely refactor how I created the formatted times. I had some ideas for a really cool feature for my clock that I was itching to work on so I made the decision that my users will not be allowed to have pulsing dividers!

I spent some time making the clock look pretty on mobile and I declared victory.

![Clock showing toggles and a choice of time](https://github.com/bartificer/programming-by-stealth/blob/master/docs/pbs96Assets/allisonFinalClockDesign.png)

### Request
  
I've taken my clock much further than what I've described here. It has some functionality that I'm very excited about, but the UI is what my father would have described as "ugly as sin."  I'd like to ask if anyone in the Programming By Stealth community would like to step in to consult with me on how to make it less ugly and to make it obvious what the functionality is.  As it stands, I have to put in a lot of words to explain it and that always means you're doing it wrong!

## Bart's Sample Solution

You'll find the full source code for my sample solution in the file `pbs92-ChallengeSolution-Bart/index.html` in this instalment's ZIP file, or you can [view a live version of my solution in your browser here](https://rawcdn.githack.com/bartificer/programming-by-stealth/020e0f0590ec9b3148dbb303755c99167904d827/instalmentResources/pbs96/pbs92-ChallengeSolution-Bart/index.html), or [view the source code online here](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentResources/pbs96/pbs92-ChallengeSolution-Bart/index.html).

This challenge was set before we started our exploration of encapsulation and object oriented programming, so I have avoided using either concept in my solution — it's entirely old-school as it were 😉

My solution revolves around some very basic markup that creates a large Bootstrap Badge that will act as the container for the clock, then adds some spans with IDs inside that badge to hold all the components of the clock, and a simple form to control the clock.

To bring the clock to life my solution defines a number of global variables to hold information about the clock and references to the parts of the clock. Those variables are declared in the global scope, and initialised in a jQuery document ready handler.

Finally, a single 500ms interval is used to drive the clock.

### How to Pulse Separators?

### How to Show Timezones?

### Where Does Code Go?

