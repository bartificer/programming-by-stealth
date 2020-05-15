# PBS 54 of X — More Bootstrap Utilities

In the previous instalment we started our exploration of Bootstrap with a look at some of its commonly used utility CSS classes. We’ll finish that off in this instalment by looking at some more utility CSS classes. That will finish out our initial look at the utilities. We’ll then be ready to move on to the next major component of Bootstrap, the CSS libraries it provides for enhancing existing HTML content.

[The ZIP file for this instalment can be downloaded here](https://www.bartbusschots.ie/s/wp-content/uploads/2018/05/pbs54.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs54.zip).

# Matching Podcast Episode 537

Listen along to this instalment on [episode 537 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2018/05/ccatp-537//)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_05_19.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_05_19.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 53 Challenge Solution

At the end of [the previous instalment](https://bartificer.net/pbs53) I set the challenge of applying what we learned during the instalment to the recipe page you created for the previous challenge, and to add some extra HTML elements into your recipe that we’ll need in future instalments. You’ll find my sample solution in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/05/pbs54.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs54.zip) in the folder named `pbs53-challengeSolution`.

I chose to use the colour, margin, padding, and border utility classes to style my _Did You Know_ box:

```html
<aside class="m-5 border border-info rounded">
  <h2 class="bg-info text-light p-2">Did you Know?</h2>
  <p class="text-muted p-2">The Cucumber is a member of the nighshade family of plants, along with the tomato, the melon, and even the potato!</p>
</aside>
```

I also used the colour utilities to mark the entire description as secondary, the heading for the instructions as primary, and the important note on salting the cucumber as `text-danger`. I also used the alignment and font utilities for marking up the quotation from the great American chef Julia Child.

When it came to adding in the requested extra HTML elements I chose to add the bulleted list as a list of required equipment, to quote the great Julia Child for my block quote, to convert my existing image into full-blown figure, and to add a glossary as a definition list.

## Playground

Like last time I’ve created an HTML document with some pre-created elements and empty `class` attributes which you can use to play along with this instalment. I’m including the source below, but you’ll also find it in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/05/pbs54.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs54.zip) as `pbs54a.html`, and in [this interactive Bootply playground](https://www.bootply.com/aNM7DS9MfB#).

```html
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />

    <!-- Include Bootstrap 4 CSS -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">

    <title>PBS 54 Dummy Page</title>
</head>
<body>
<div class="container-fluid mt-3">
    <div class="row">
        <div class="col-12">

            <!-- Start of Dummy Content -->

            <div class="">
              If this page used cookies this notification would let you know that, but it doesn't, so it doesn't!
            </div>

            <h1 class="">PBS 54 — Dummy Page</h1>

            <p class="">This page has some HTML elements that you can add Bootstrap 4 CSS utility classes to so you can see them in action</p>

            <p class="">When you look at the source for this page you'll notice empty class attributes in the HTML tags just waiting for you to add some Bootstrap class names into!</p>

            <p>Below is one of my favourite poems, I hope you enjoy it!</p>

            <blockquote class="">
                <h2 class="">Lines Written on a Seat on the Grand Canal, Dublin</h2>

                <aside class="">
                  <h3 class="">Note:</h3>
                  <p class="">Kavanagh got his wish — he is comemorated with a bench that has a statue of him setting on it next to the Royal Canal in Dublin city. Passers by can sit next to Kavanagh on his bench and ponder the view, perhaps with these lines running aroun in their heads.</p>
                </aside>

                <p class="">"Erected to the memory of Mrs. Dermot O'Brien"</p>

                <p class="">O commemorate me where there is water,<br>
                Canal water, preferably, so stilly<br>
                Greeny at the heart of summer. Brother<br>
                Commemorate me thus beautifully<br>
                Where by a lock niagarously roars<br>
                The falls for those who sit in the tremendous silence<br>
                Of mid-July.  No one will speak in prose<br>
                Who finds his way to these Parnassian islands.<br>
                A swan goes by head low with many apologies,<br>
                Fantastic light looks through the eyes of bridges -<br>
                And look! a barge comes bringing from Athy<br>
                And other far-flung towns mythologies.<br>
                O commemorate me with no hero-courageous<br>
                Tomb - just a canal-bank seat for the passer-by.</p>

                <p class="">Patrick Kavanagh</p>
            </blockquote>

            <nav class="">
                <ul class="">
                    <li class="">
                            <a class="" href="http://www.twitter.com/bbusschots"><span class="" style="font-size: 50pt">🐦</span> <span class=>@bbusschots</span></a>
                    </li>
                    <li class="">
                            <a class="" href="http://www.bartb.ie/"><span class="" style="font-size: 50pt">🌐</span> <span class="">bartb.ie</span></a>
                    </li>
                    <li class="">
                            <a class="" href="http://flickr.com/photos/bbusschots/"><span class="" style="font-size: 50pt">📷</span> <span class="">bbusschots</span></a>
                    </li>
                </ul>
            </nav>

            <!-- End of Dummy Content -->
        </div>
    </div>
</div>
</body>
</html>
```

## Display Utilities (Just the Basics)

Way back in [instalment 9](https://www.bartbusschots.ie/s/2016/02/19/programming-by-stealth-9-of-x-more-css-positioning/) we learned about the `display` CSS property. We learned that each HTML tag defaults to being displayed as inline content, a block, an inline block, or one of a few special cases, and that we can use this property to override that default and make something that normally displays inline display as a block etc..

Bootstrap provides CSS utility classes for quickly and easily achieving the same things. The most common of these are shown below, but it’s not an exhaustive list:

*   `d-none` — do not show the element.
*   `d-block` — display the element as a block-level element.
*   `d-inline` — display the element as an inline element.
*   `d-inline-block` — display the element as an inline block element.

In the aside in our sandbox page we can see that headings and paragraphs are displayed as block-level elements by default — the heading is one block, and the paragraph is another block appearing after it within the flow of the page.

We can use the Bootstrap display CSS utility class `d-inline` to render both as inline elements so our aside becomes more compact:

```html
<aside class="text-muted bg-light border rounded p-2 m-3">
                  <h3 class="d-inline">Note:</h3>
                  <p class="d-inline">Kavanagh got his wish — he is comemorated with a bench that has a statue of him setting on it next to the Royal Canal in Dublin city. Passers by can sit next to Kavanagh on his bench and ponder the view, perhaps with these lines running aroun in their heads.</p>
                </aside>
```

Notice the use of the background, text, and border utilities discussed in the previous instalment on the aside as a whole.

## Vertical Alignment Utilities

Once an item is displayed as inline block its vertical alignment can be controlled. Bootstrap provides CSS utility classes to make this easier, and they are named as you would probably expect them to be — `align-baseline`, `align-top`, `align-middle`, `align-bottom`, `align-text-top` & `align-text-bottom`.

## Position Utilities

Going even further back, we learned about the `position` CSS property in [instalment 8](https://www.bartbusschots.ie/s/2016/02/03/programming-by-stealth-8-of-x-css-positioning/). By default HTML elements are positioned within the normal flow of the page, but we can use the `position` property to off-set them relative to their normal position, or even remove them from the normal flow completely and position them absolutely within their container, or fix them to the visible part of the page, known as the _viewport_.

Again, Bootstrap provides us with CSS utility classes for controlling the positioning. We can do the basics like you might expect:

*   `position-static` — position the element in the normal flow of the document (the default behaviour)
*   `position-relative` — position the element relative to its regular place within the flow of the document (i.e. relative to where it would appear if its position was static)
*   `position-absolute` — position the element absolutely within its container
*   `position-fixed` — fix the element relative to the viewport

Bootstrap goes further though, and provides utilities for the two most common fixed use-cases:

*   `fixed-top` — fix the element to the top of the viewport
*   `fixed-bottom` — fix the element to the bottom of the viewport

Finally, Bootstrap also provides utilities for the new, and still experimental, sticky positioning feature. An element who’s position is sticky is displayed differently depending on where the viewport is scrolled to. If the element’s normal position within the page is visible in the viewport then that’s where it will be show, if not it will be positioned relative to the viewport. The way to think about it is that if the element’s normal position within the page is visible then it is positioned `relative`, otherwise it’s positioned `fixed`:

*   `position-sticky` — set `position: sticky` on the element
*   `sticky-top` — set the element to stick to the top of the viewport when its regular position is not visible

A very common place to see sticky positioning is on cookie notices, so let’s do that in our sandbox page by adding the class `sticky-top` (and some other classes we learned about in the previous instalment) to the cookie notice at the top of our sandbox page:

```html
<div class="sticky-top bg-danger text-white p-1 rounded m-1">
  If this page used cookies this notification would let you know that, but it doesn't, so it doesn't!
</div>
```

## Size Utilities

Bootstrap provides utilities for specifying widths and heights. These take the following form:

```
{dimension}-{value}

```

Where `{dimension}` can be one of:

*   `w` — width
*   `h` — height
*   `mw` — max width
*   `mh` — max height

And where `{value}` can be one of:

*   `25` — 25%
*   `50` — 50%
*   `75` — 75%
*   `100` — 100%
*   `auto` — the CSS special value `auto`

As an example, we can combine the sizing class `w-75` with the auto-padding class we learned about last time (`m-auto`) and some border and padding utilities to make the poem in our sandbox page 75% of the width of the page and centred:

```html
<blockquote class="w-75 m-auto border rounded p-3">
...
</blockquote>
```

## Float Utilities

Now that we know how to control the width and height of elements, we’re ready to make use of Bootstrap’s utility CSS classes for floating elements.

As you might expect, Bootstrap provides the following three classes which do exactly what their names suggest — `float-left`, `float-right`, and `float-none`.

Bootstrap goes a step further thought and provides a fix to a common problem — floating elements punching through the bottom of their containing element when it doesn’t have as much content as the floating element. This can really mess up layouts, so there is a real need for a simple way to tell an element that contains floats that it should stretch to fully include the floating elements — enter Bootstrap’s `clearfix` class. You apply this class to the element that contains the floats, not to the elements that are being floated.

As a practical example, let’s float the aside within the poem to the right by first making it 25% of the width with `w-25`, and then floating it with `float-right`. For completeness we should ensure the aside could never poke out the bottom of the poem by adding `clearfix` to the element that contains the float, i.e., to the `<blockquote>` tag:

```html
<blockquote class="clearfix w-75 m-auto border rounded p-3">
  <h2 class="">Lines Written on a Seat on the Grand Canal, Dublin</h2>

  <aside class="w-25 float-right text-muted bg-light border rounded p-2 m-3">
    <h3 class="d-inline">Note:</h3>
    <p class="d-inline">Kavanagh got his wish ...</p>
  </aside>

  <p class="">"Erected to the memory of ...</p>
</blockquote>
```

## Flexbox Utilities

Casting our minds back to [instalment 9](https://www.bartbusschots.ie/s/2016/02/19/programming-by-stealth-9-of-x-more-css-positioning/) again, we learned how CSS 3 really improved positioning with the introduction of flex boxes.

As you may remember, the CSS for using flex boxes can get quite confusing, so you’ll probably be happy to hear that Bootstrap has simplified things for you.

In pure CSS you need to specify that the containing element is a flex container, and then you need to explicitly mark each child element as a flex item. Bootstrap utilities simplify this greatly — simply add the class `d-flex` to the element you want to use as a flex container, and all direct children will become a flex items automatically.

Bootstrap also provides CSS utility classes for controlling the direction the flex boxes will stack in:

*   `flex-row` — to stack flex items next to each other
*   `flex-column` — to stack flex items on top of each other

Once you’ve decided the direction you’re stacking your item in, the next thing you’ll want to decide is what to do with the empty space between elements:

*   `justify-content-start` — all the empty space comes after the flex items, in other words, the items are all bunched together at the start of the flex container
*   `justify-content-end` — all the empty space comes before the flex items, in other words, the items are all bunched together at the end of the flex container
*   `justify-content-center` — half of the empty space comes before the flex items, and half after. In other words, the items are all bunched together in the middle of the flex container.
*   `justify-content-between` — the empty space is equally distributed in the gaps between the flex items. Note that the first and last items touch the edges of the flex container.
*   `justify-content-around` — the empty space is equally distributed around the flex items. Note that the first and last items do not touch the edges of the flex container because a share of the empty space goes at the start and end of the container.

Bootstrap also lets us control how flex items should behave in the axis that’s opposite of their stacking direction, the so-called _cross axis_.

For simplicity, let’s think about this in terms of horizontally stacked flex items (the Bootstrap class `flex-row`). The flex container will have a height, either expressly set, or simply the height of the tallest flex item. Where should each of the flex items be positioned vertically within the row? That’s what these utilities control:

*   `align-items-start` — all the flex items stick to the top of the row
*   `align-items-end` — all the flex items stick to the bottom of the row
*   `align-items-center` — all the flex items centre themselves vertically within the row
*   `align-items-stretch` — all the flex items stretch to fill the full height of the row

Bootstrap also provides a very useful utility class for creating equal-width flex items that stretch to fully fill a flex container. To achieve this, add the class `flex-fill` **to each flex item**.

Bootstrap also provides utility classes for controlling the wrapping of flex items when they don’t fit into a single row/column of a flex container, `flex-nowrap` disables wrapping, meaning flex items that don’t fit will simply burst through the end of the flex container, and `flex-wrap` enables wrapping, meaning items will wrap around onto a new row or column as appropriate.

To demonstrate flex boxes let’s convert the navigation area at the bottom of our sandbox page into a nice flex box.

Firstly, we need to convert each list item into a regular block so it doesn’t have a bullet next to it. There is a better way to do this as we’ll learn soon, but using only what we know so far, the way to do this is to add the classes `d-block` to each list item.

We’re now ready to convert the unordered list into a flex container by giving it the class `d-flex`. Next we want to specify that we’d like a horizontal flex box, so we add the class `flex-row` to the list as well. Finally we distribute the empty space evenly around the flex items by adding the class `justify-content-around`. At this stage we’re almost done, but the nav bar would look better if the emoji were centred relative to the rest of the text. This can be achieved by displaying the span that contains them as an inline block with a vertical alignment of middle. We do this by adding the classes `d-inline-block` and `align-middle` to the relevant spans.

Putting all that together we get the following code for the nav bar:

```html
<nav class="">
  <ul class="d-flex flex-row justify-content-around">
    <li class="d-block">
      <a class="" href="http://www.twitter.com/bbusschots"><span class="d-inline-block align-middle" style="font-size: 50pt">🐦</span> <span class=>@bbusschots</span></a>
    </li>
    <li class="d-block">
      <a class="" href="http://www.bartb.ie/"><span class="d-inline-block align-middle" style="font-size: 50pt">🌐</span> <span class="">bartb.ie</span></a>
    </li>
    <li class="d-block">
      <a class="" href="http://flickr.com/photos/bbusschots/"><span class="d-inline-block align-middle" style="font-size: 50pt">📷</span> <span class="">bbusschots</span></a>
    </li>
  </ul>
</nav>
```

## Screen Reader Utilities

Bootstrap makes it easy to add elements into your page that are only visible to assistive technologies like screen readers.

To hide an element from everything but a screen reader simply give it the class `sr-only`, e.g.:

```html
<p>The next paragraph is only visible to screen readers</p>
<p class="sr-only">Hello Screen Reader User!</p>
```

## Final Example

Putting all the examples above together we get the following final version of our sandbox page:

```html
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />

    <!-- Include Bootstrap 4 CSS -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">

    <title>PBS 54 Dummy Page</title>
</head>
<body>
<div class="container-fluid mt-3">
    <div class="row">
        <div class="col-12">

            <!-- Start of Dummy Content -->

            <div class="sticky-top bg-danger text-white p-1 rounded m-1">
              If this page used cookies this notification would let you know that, but it doesn't, so it doesn't!
            </div>

            <h1 class="">PBS 54 — Dummy Page</h1>

            <p class="">This page has some HTML elements that you can add Bootstrap 4 CSS utility classes to so you can see them in action</p>

            <p class="">When you look at the source for this page you'll notice empty class attributes in the HTML tags just waiting for you to add some Bootstrap class names into!</p>

            <p>Below is one of my favourite poems, I hope you enjoy it!</p>

            <blockquote class="clearfix w-75 m-auto border rounded p-3">
                <h2 class="">Lines Written on a Seat on the Grand Canal, Dublin</h2>

                <aside class="w-25 float-right text-muted bg-light border rounded p-2 m-3">
                  <h3 class="d-inline">Note:</h3>
                  <p class="d-inline">Kavanagh got his wish — he is comemorated with a bench that has a statue of him setting on it next to the Royal Canal in Dublin city. Passers by can sit next to Kavanagh on his bench and ponder the view, perhaps with these lines running aroun in their heads.</p>
                </aside>

                <p class="">"Erected to the memory of Mrs. Dermot O'Brien"</p>

                <p class="">O commemorate me where there is water,<br>
                Canal water, preferably, so stilly<br>
                Greeny at the heart of summer. Brother<br>
                Commemorate me thus beautifully<br>
                Where by a lock niagarously roars<br>
                The falls for those who sit in the tremendous silence<br>
                Of mid-July.  No one will speak in prose<br>
                Who finds his way to these Parnassian islands.<br>
                A swan goes by head low with many apologies,<br>
                Fantastic light looks through the eyes of bridges -<br>
                And look! a barge comes bringing from Athy<br>
                And other far-flung towns mythologies.<br>
                O commemorate me with no hero-courageous<br>
                Tomb - just a canal-bank seat for the passer-by.</p>

                <p class="">Patrick Kavanagh</p>
            </blockquote>

            <nav class="">
                <ul class="d-flex flex-row justify-content-around">
                    <li class="d-block">
                            <a class="" href="http://www.twitter.com/bbusschots"><span class="d-inline-block align-middle" style="font-size: 50pt">🐦</span> <span class=>@bbusschots</span></a>
                    </li>
                    <li class="d-block">
                            <a class="" href="http://www.bartb.ie/"><span class="d-inline-block align-middle" style="font-size: 50pt">🌐</span> <span class="">bartb.ie</span></a>
                    </li>
                    <li class="d-block">
                            <a class="" href="http://flickr.com/photos/bbusschots/"><span class="d-inline-block align-middle" style="font-size: 50pt">📷</span> <span class="">bbusschots</span></a>
                    </li>
                </ul>
            </nav>

            <!-- End of Dummy Content -->
        </div>
    </div>
</div>
</body>
</html>
```

This file is included in this instalment’s ZIP file as `pbs54b.html`.

## A Challenge

Using what we learned today, make the following changes to your recipe:

1.  Find something in your recipe that defaults to a block and render it as inline, or vica-versa.
2.  Make your recipe’s heading stick to the top of the page once you scroll by it.
3.  Adjust the width of your ingredients table, and float it left or right.
4.  If you don’t already have a list of the equipment needed, create one as an un-ordered list, and use emoji or glyphicons to add an icon to each one. Then, render that list as a horizontal row using a flex box.
5.  Make any other improvements you see fit.

## Final Thoughts

We’re done with Bootstrap utility CSS classes for now, though we will be re-visiting some of them later when we learn more about Bootstrap page layouts. That means we’re ready to move on to the second of the four major aspects of Bootstrap — content. In other words, using Bootstrap CSS classes to better render standard HTML elements like lists, tables, forms, etc.. When we’ve done with the content aspect we’ll move on to Bootstrap’s page layout aspect before finishing our tour of Bootstrap with a look at some custom components Bootstrap provides (modal dialogues, dismissible alerts, and much more).
