# PBS 59 of X — More Bootstrap Breakpoints

In [the previous instalment](https://bartificer.net/pbs58) we met the bootstrap breakpoints. We learned that Bootstrap is mobile-first, so it has an implicit breakpoint of _extra small_ (`xs`), followed by _small_ (`sm`), _medium_ (`md`), _large_ (`lg`), and _extra-large_ (`xl`). The sizes refer to the width of the window the page is being displayed in, AKA, the _viewport_. We used these breakpoints to interact with the Bootstrap grid (see [instalment 57](https://bartificer.net/pbs57)), allowing us to specify different layouts for different viewport widths.

The important points to remember are that **breakpoints apply to a given viewport width, and greater**, and that **larger breakpoints override smaller ones**.

Bootstrap does not just use breakpoints within the grid though. Some of the Bootstrap _utility_ and _content_ classes also have breakpoint support. In this instalment we’ll circle back and re-visit some of these. Note that only some utility and content classes have breakpoint support, not most, let alone all.

You can [Download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2018/07/pbs59.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs59.zip).

# Matching Postcast Episode 556

Listen along to this instalment on [episode 556 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2018/07/ccatp-556/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_07_28.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_07_28.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 58 Challenge Sample Solution

The challenge set at the end of [the previous instalment](https://bartificer.net/pbs58) was quite simple — update the recipe you’ve been working on over the last few challenges so it looks good at all Bootstrap breakpoints.

As outlined in the previous instalment, it’s best practice to design your layouts mobile-first. That means getting them to work well on small screens by default, and then using break points to make them work well on larger screens too.

A good example of this approach is the header section of my recipe. It consists of a single row in the Bootstrap grid containing two columns, one for the display header, and one for the lead paragraph.

Before starting this challenge they were set up to look good on large screens by default with the following code:

```XHTML
<header class="container sticky-top mt-3">
  <div class="row align-items-center bg-white border-bottom">
    <div class="col-9">
      <h1 class="display-1">Roasted Cucumber<br> <small class="text-muted">with Red Onion &amp; Dill</small></h1>
    </div>
    <div class="col-3">
      <h2 class="sr-only">Description</h2>
      <p class="lead">An unusual roasted vegetable dish that's refreshingly tangy and will pair well with fish.</p>
    </div>
  </div>
</header>
```

The first step is to make this part of the page mobile-first by changing both columns to `col-12`. Next, to make it work well on large screen again, I added `col-lg-9` and `col-lg-3` to the first and second columns respectively:

```XHTML
<header class="container sticky-top mt-3">
  <div class="row align-items-center bg-white border-bottom">
    <div class="col-12 col-lg-9">
      <h1 class="display-1">Roasted Cucumber<br> <small class="text-muted">with Red Onion &amp; Dill</small></h1>
    </div>
    <div class="col-12 col-lg-3">
      <h2 class="sr-only">Description</h2>
      <p class="lead">An unusual roasted vegetable dish that's refreshingly tangy and will pair well with fish.</p>
    </div>
  </div>
</header>
```

This works and does exactly what I want, but there is a slightly more efficient approach. Instead of explicitly specifying widths for both columns, one can be left automatic at all breakpoints by giving it the class col, then all adjustments for all breakpoints can be done on just one column. This is the final version of my header:

```XHTML
<header class="container sticky-top mt-3">
  <div class="row align-items-center bg-white border-bottom">
    <div class="col-12 col-lg-9">
      <h1 class="display-1">Roasted Cucumber<br> <small class="text-muted">with Red Onion &amp; Dill</small></h1>
    </div>
    <div class="col">
      <h2 class="sr-only">Description</h2>
      <p class="lead">An unusual roasted vegetable dish that's refreshingly tangy and will pair well with fish.</p>
    </div>
  </div>
</header>
```

I applied the same logic to the other rows that make up my page.

You can see a full version of my recipe in the folder `pbs58-challengeSolution` in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/07/pbs59.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs59.zip).

## Bootstrap Utility & Content Classes with Breakpoint Support

While most of the Bootstrap content and utility classes don’t provide breakpoint support, some do, so let’s loop back and fill in that missing detail.

As a general rule, when there is breakpoint support, its structure looks the same as the breakpoint support in the Bootstrap grid — i.e. specific breakpoints are specified by inserting two-letter codes as the second part of the class name (dashes separate parts of the class name). If you look at how breakpoints work with columns in the grid, you’ll see that pattern in action. The class `col` applies to the implicit `xs` breakpoint (i.e. at all viewport widths), while the class `col-md` applies to the medium breakpoint and up. The two letter breakpoint code is the second part of the class name. Similarly, the class `col-4` applies to the implicit xs breakpoint, while the class `col-lg-4` applies to the large breakpoint and up. Again, the two-letter breakpoint code is the second part of the class name.

So, which of the Bootstrap content and utility classes we’ve met have breakpoint-aware variants?

The Display Utility Classes

We’ve seen the basic `d-VALUE` variant where `VALUE` is the `display` property we need, e.g. `d-block` to set the CSS `display` property to `block`, but you can use breakpoints with the `d-BP-VALUE` variant, where `BP` is a two-letter breakpoint code, e.g. `d-md-inline`. For more [see the official docs](http://getbootstrap.com/docs/4.1/utilities/display/).

The Float Utility Classes

We’ve seen the basic `float-VALUE` variant where `VALUE` is one of `left`, `right`, or `none`, but there is also the `float-BP-VALUE` variant, e.g. `float-md-left` to float left only on medium-width windows and bigger.

Spacing Utility Classes

We’ve seen a few forms of the classes for controlling margins and padding already. We’ve seen the basic `TYPE-SIZE` variant where `TYPE` is one of `p` for padding or `m` for margin, and the size is a number from zero to five, e.g. `p-5` to set the largest padding on all sides of an item. We’ve also seen the `TYPESIDES-SIZE` variant where `SIDES` is one of `t`,`l`,`b`,`r` (for top, left, bottom or right) or `x` for left and right, and `y` for top and bottom, e.g. `mx-0` to remove left and right margins. There are also two breakpoint-aware variants, `TYPE-BP-SIZE`, and `TYPESIDES-BP-SIZE`, e.g. `p-md-4` to set a padding of four on all sides for medium width windows and bigger, and `mt-lg-3` to set a margin of three on just the top on large windows and bigger. For more [see the official docs](http://getbootstrap.com/docs/4.1/utilities/spacing/).

Text Alignment Utilities

We’ve seen the basic form, `text-ALIGN` where `ALIGN` is the desired alignment, e.g. `text-left` for left aligned text at all screen widths, but there’s also the breakpoint-aware `text-BP-ALIGN` variant, e.g. `text-md-center` to centre text on medium width windows and wider. For more [see the official docs](http://getbootstrap.com/docs/4.1/utilities/text/).

Horizontally Scrolling Tables

We’ve seen that we can make tables horizontally scrollable by wrapping them in another element and giving that element the class `table-responsive`. There are breakpoint aware variants, but they are the rare exception to Bootstrap’s generally consistency. These breakpoints apply in the opposite direction, not breakpoint and up, but **breakpoint and down**, and the breakpoints are added at the end, not as the the second part of the class name. The classes take the form `table-responsive-BP`. Bearing their inverse nature in mind, this means that `table-responsive-md` will make the table horizontally scrollable on medium-width windows **and narrower**. While this isn’t consistent, it is actually sensible, and much more likely to be useful in the real world!

### Worked Example

This all sounds a little abstract, so let’s work through a simple example that illustrates some common use-cases. To do this we’ll use a simplified version of the Irish Referendum page we’ve use before. You’ll find it in [the ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/07/pbs59.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs59.zip) as `pbs59a.html`.

The first problem we want to address is that the display header does not work well on small screens. The sub-heading with the month and year work well on medium screens and bigger, but not on smaller screens. We can address this by hiding that sub-heading on smaller screens by giving a default display of none with the class `d-none`, then having it appear as regular inline text from the large breakpoint up by adding the class `d-lg-inline`.

Before:

```XHTML
<h1 class="display-1">Ireland Votes <small class="text-muted">May 2018</small></h1>
```

After:

```XHTML
<h1 class="display-1">Ireland Votes <small class="text-muted d-none d-lg-inline">May 2018</small></h1>
```

Note that a similar approach could be used to give extra help text only to users of small-screen devices which are probably touch-screen devices and hence, don’t have the advantage of hover text.

The next problem we’ll address is the figure showing election posters (the `<figure>` tag with the ID `fig1`). It works well at smaller window widths, but becomes very wasteful of space in wider windows.

Before we go on, note that because this image file is very large, I’ve limit its width to a maximum of 550 pixels by adding the following `style` attribute to the `<img>` tag: `style="max-width: 550px"`.

At the moment the figure is centred with a large left and right margin to keep it clear of the edges of the window:

```XHTML
<figure class="figure d-block mx-5 text-center" id="fig1">
```

Just as a refresher to your memory, the class `figure` opts in to Bootstrap’s opinionated styling of figures, the class `d-block` reverts the figure back to a block-level element because the class `figure` sets it to be an inline-block, the class `mx-5` sets the left and right margins to their largest value, and the class `text-center` centres the text within the entire figure.

What we want to do is have this figure become a float once there is enough room for that to make sense. In this case, that’s the `lg` breakpoint. We can make the image float for large width and up by simply adding the class `float-lg-right`. This gets us close to what we want, but not quite where we need to be — those wide left and right margins don’t work once we float the figure! We need to set the right margin to zero, and the left to something a little smaller, say three. We can do that by adding the two classes `mr-lg-0` & `ml-lg-3`.

Putting all that together we get:

```XHTML
<figure class="figure d-block mx-5 text-center float-lg-right mr-lg-0 ml-lg-3">
```

Finally, let’s ensure the large table (the one with the ID `table2`) only scrolls when it really needs to, i.e. from the large breakpoint down by changing the div that wraps it from:

```XHTML
<div class="table-responsive">
```

To:

```XHTML
<div class="table-responsive-lg">
```

You’ll find an updated version of the entire file in [the ZIP](https://www.bartbusschots.ie/s/wp-content/uploads/2018/07/pbs59.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs59.zip) as `pbs59b.html`.

## Challenge

Apply what we’ve learned in this instalment to the recipe you’ve been working on in the previous challenges.

## Final Thoughts

We’ve now looked at the most important functionality in three out of Bootstrap’s four aspects — we’ve looked at the utility classes, the so-called _content_ classes (for styling build-in HTML elements), and we’ve looked at layout with the grid and breakpoints. Up to this point Bootstrap has been purely CSS. We’ve included it into our files by simply importing one stylesheet from a CDN. Next time we’ll discover that Bootstrap also has an optional JavaScript component, and it’s vital for getting the most out of Bootstrap’s final aspect — the Bootstrap components. Bootstrap components are highly re-usable pieces of functionality that are commonly needed by developers. Things like carousels, modal dialogues, dismissible alerts, and so on.