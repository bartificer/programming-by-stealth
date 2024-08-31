---
title: Bootstrap Content
instalment: 55
creators: [bart, allison]
date: 2018-06-02
tags:
  - bootstrap
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_02.mp3
---

In this instalment we’ll continue our exploration of Bootstrap, making a start on the second of the four main aspects of Bootstrap — _content_. This is the word the Bootstrap team have used to describe Bootstrap’s styling of regular HTML tags for things like headers, paragraphs, lists, tables, etc. In the previous two instalments we looked at the first of the four aspects, the utility classes. When we finish with the content aspect we’ll move in to look at the third aspect — layout.

It’s going to take us at least two instalments to look at Bootstrap content. We’ll make a start in this instalment by focusing on the most important classes related to the HTML elements Bootstrap’s documentation (somewhat confusingly IMO) bundles together under the sub-heading _Typography_ (under _Content_). Specifically that means headings, paragraphs, block quotations, and lists.

You can [download the ZIP file for this instalment here](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs55.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs55.zip).

## Matching Podcast Episode 549

Listen along to this instalment on [episode 549 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2018/06/ccatp-549/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_02.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_02.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 54 Challenge Solution

The challenge set at the end of the previous instalment was to continue to improve the recipe you’ve been working on for the past few instalments in a number of ways.

The first part of the challenge was to find something in your recipe that defaults to displaying as a block, and have it display inline instead, or _vice-versa_. I chose to revisit the _Did you Know_ section so as to make it more compact. This small section of the page consists of an `<aside>` tag which contains a heading and a paragraph. By default both the heading and paragraph are blocks, so they each start a new line. To make the aside more compact I chose to have the header display as inline block (with the `d-inline-block` class), and the paragraph as inline (with the `d-inline` class). The reason for choosing *inline block* for the heading is to be able to vertically align it (with the `align-middle` class). The reason for choosing *inline* for the paragraph is to allow it flow over multiple lines if needed. Below is the relevant code segment:

```html
<aside class="m-5 border border-info rounded p-2">
  <h2 class="text-info d-inline-block align-middle">Did you Know?</h2>
  <p class="text-muted d-inline">The Cucumber is a member of the nightshade family of plants, along with the tomato, the melon, and even the potato!</p>
</aside>
```

The second part of the challenge was to make the page header stick to the top of the viewport. The key to doing this is the `sticky-top` class, but there is a little more to it. By default headings have no background, so they are transparent blocks. This makes a bit of a mess when you scroll down and the text behind is visible through your sticky heading! To get around this I made the background white (with the `bg-white` class) and added a bottom border (with the `border-bottom` class). I also decided to make the heading stand out a little more by making it primary with the `text-primary` and `border-primary` classes.

Below is the code for my header:

```html
<h1 class="sticky-top bg-white border-bottom text-primary border-primary">Roasted Cucumber with Red Onion &amp; Dill</h1>
```

The third part of the challenge was to adjust the width of the ingredients table and float it to one side or the other. I chose to make mine 25% wide (with the `w-25` class) and float to the right (with the `float-right` class):

```html
<table class="w-25 float-right">
  <!-- ... -->
</table>
```

The last prescriptive part of the challenge called for the creation of a list of needed equipment as a bulleted list, and the display of this list as a flex row with icons from any source of your choosing.

I chose to use the latest free version of the [Font Awesome](http://fontawesome.io) glyphicon library we learned about way back in [instalment 29](https://pbs.bartificer.net/pbs29).

The key to making this work is to display the list itself as a flex row by adding the `d-flex` and `flex-row` classes. This will make the list items behave like flex items, but they are still being displayed as list items, so they still have their bullets. The best way we currently know to fix this is to explicitly display these elements as blocks by adding the class `d-block` to each. Finally, to distribute the flex items nicely within the row, and to centre the content of each list item, I also added the `justify-content-around` and `text-center` classes to the list as a whole. A representative sample of my code is shown below:

```html
<ul class="d-flex flex-row justify-content-around text-center">
  <li class="d-block">
    <p><span class="fas fa-clipboard fa-5x"></span></p>
    <p>A chopping board</p>
  </li>
  <!-- ... -->
</ul>
```

You can find my full sample solution in the `pbs54-challengeSolution` folder in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs55.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs55.zip).

## Playground

Like last time, I’ve created an HTML document with some previously created elements and empty class attributes which you can use to play along with this instalment. I’m including the source below, but you’ll also find it in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs55.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs55.zip) as `pbs55a.html`, and in [this interactive Bootply playground](https://www.bootply.com/tMgnvjSRCT#).

```html
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />

    <!-- Include Bootstrap 4 CSS -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">

    <title>PBS 55 Dummy Page</title>
</head>
<body>
<div class="container-fluid mt-3">
    <div class="row">
        <div class="col-12">

            <!-- Start of Dummy Content -->

            <h1 class="">Patrick Kavanagh <small class="">Irish Poet</small></h1>

            <p class="">Patrick Kavanagh is the most famous poet to come from the Irish county of Monaghan. He was born in 1904, and died in 1967.</p>

            <p class="">The poem below is one of my favourites, I hope you enjoy it!</p>

            <blockquote class="">
                <h2 class="">Lines Written on a Seat on the Grand Canal, Dublin</h2>

                <aside class="">
                  <h1 class="">Note:</h1>
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

                <footer class="">Patrick Kavanagh</footer>
            </blockquote>

            <h2 class="">Other Kavanagh Poems I Recommend</h2>

            <ul class="">
                <li class=""><a href="https://www.poemhunter.com/poem/canal-bank-walk/">Canal Bank Walk</a></li>
                <li class=""><a href="https://www.poemhunter.com/poem/stony-grey-soil/">Stony Grey Soil</a></li>
                <li class=""><a href="https://www.poemhunter.com/poem/a-christmas-childhood/">A Christmas Childhood</a></li>
            </ul>

            <footer class="">
                <ul class="">
                  <li class="">
                      <a class="" href="http://www.twitter.com/bbusschots">🐦 @bbusschots</a>
                  </li>
                  <li class="">
                      <a class="" href="http://www.bartb.ie/">🌐 bartb.ie</a>
                  </li>
                  <li class="">
                      <a class="" href="http://flickr.com/photos/bbusschots/">📷 bbusschots</a>
                  </li>
                </ul>
            </footer>

            <!-- End of Dummy Content -->
        </div>
    </div>
</div>
</body>
</html>
```

## Bootstrap 4 Paragraphs & Headings

For regular headings and paragraphs you don’t need to add any Bootstrap CSS classes. However, Bootstrap does provide you with some useful classes for dealing with some special cases.

### Heading-like Elements

Firstly, not all heading-like elements on a page are actually heading tags (`<h1>` … `<h6>`). Two common examples are table header cells (`<th>`) and definition list headings (`<dt>`). Wouldn’t it be nice to be able to be able to simply tell the browser that you’d like table headers to display as if they were `<h3>`s? Well, with Bootstrap you can! The Bootstrap classes `h1` … `h6` can be applied to any element to make them render like the appropriate headings.

You can also use this to keep your markup semantically correct but separate from how a page is rendered. For example, the primary heading within an `<aside>` should be an `<h1>`, but you may prefer a visually smaller heading.

As a practical example, let’s update the heading in the aside so it’s not displayed as large as it would be by default by adding the class `h5` to the `<aside>` in the sandbox for this instalment:

```html
<aside class="border border-info rounded p-3 w-25 float-right text-muted bg-light">
    <h1 class="h5 d-inline text-info">Note:</h1>
    <p class="d-inline">Kavanagh got his wish — he is comemorated with a bench that has a statue of him setting on it next to the Royal Canal in Dublin city. Passers by can sit next to Kavanagh on his bench and ponder the view, perhaps with these lines running aroun in their heads.</p>
</aside>
```

Also notice the user of the colour and display utility classes to colour and lay out the aside nicely.

### Display Headings

All headings are not equal — some headers need to stand out more than others. Bootstrap refers to these kinds of _‘über headers’_ as _display headers_, and provides four of them via the classes `display-1` to `display-4`.

Another nice feature of display headings is that they have support for sub-headings using the `<small>` tag within the heading, perhaps combined with the `text-muted` utility class.

We can experiment with this by adding the class `display-1` to the top-level heading in our sandbox, and then using the utility classes `text-info`, `bg-light`, `w-25`, and `float-right`.

### Lead Paragraphs

It’s quite common to have one paragraph of text that needs to stand out from the others. You often see this used in newspapers and on news sites where the first paragraph is emphasised by the use of larger type, or some other font-related differentiation. Bootstrap provides a class for this, `lead`.

We can try this with the first paragraph in our playground:

```html
<p class="lead">Patrick Kavanagh is the most famous poet to come from the Irish county of Monaghan. He was born in 1904, and died in 1967.</p>
```

## Quotations

By default Bootstrap does not significantly style block quotes. If you’d like a given block quote to be styled by Bootstrap, you need to give it the class `blockquote`. This seems a little odd at first, but as you’ll see, this is a design pattern Bootstrap uses a lot.

If you choose to give a block quote the class `blockquote`, you can also style the author of the quote in a nice way by wrapping the author in a footer tag and giving it the class `blockquote-footer`.

We can see the effect of both of these things in our playground:

```html
<blockquote class="blockquote">
  <h2 class="">Lines Written on a Seat on the Grand Canal, Dublin</h2>

  <!-- ... -->

  <p class="">O commemorate me ...</p>

  <footer class="blockquote-footer">Patrick Kavanagh</footer>
</blockquote>
```

This changes the fonts, but doesn’t highlight the box itself in any way. You can do that using any of the utility classes we’ve learned about. I find the following quite pleasing:

```html
<blockquote class="blockquote w-75 mx-auto my-5 bg-light p-4 border rounded">
  <h2 class="display-4">Lines Written on a Seat on the Grand Canal, Dublin</h2>

  <aside class="border border-info rounded p-3 w-25 float-right text-muted bg-white">
    <h1 class="h5 d-inline text-info">Note:</h1>
    <p class="d-inline">Kavanagh got ...</p>
  </aside>

  <p class="lead">"Erected to the memory of Mrs. Dermot O'Brien"</p>

  <p class="">O commemorate me ...</p>

  <footer class="blockquote-footer">Patrick Kavanagh</footer>
</blockquote>
```

Notice the use of the colour utilities (`bg-white`, `bg-light`, & `text-info`), the border utilities (`border`, `rounded`, & `border-info`), the sizing utilities (`w-25` & `w-75`), the spacing utilities (`mx-auto`, `my-5`, `p-3`, & `p-4`), the positioning utilities (`d-inline` & `float-right`), and the content classes `display-4` & `lead`.

## Lists

In general there is no need to apply additional styles to lists, but Bootstrap does provide two useful classes for altering the display of lists. While you’ll generally only be applying these classes to bulleted lists, they do also work on numbered lists.

### Unstyled Lists

In the previous instalment, and in the challenge solution at the start of this instalment, I mentioned that setting the display of list items to block to hide bullets was a hack, and that we’d learn better ways to control lists later. This is that later 🙂

Bootstrap allows us to remove the bullets from adding the class `list-unstyled` to the `<ul>` tag. Note that this class only affects list items that are direct children of that tag. Nested lists are not affected, which can be very useful when marking up sidebars on websites.

We can see this in action by removing the bullets from the list of other recommended poems in our playground:

```html
<ul class="list-unstyled">
   <li class=""><a href="https://www.poemhunter.com/poem/canal-bank-walk/">Canal Bank Walk</a></li>
   <!-- ... -->
</ul>
```

### Unstyled Lists as Flex Boxes

Armed with this new information, if we wanted to display the links in the playground’s footer as a flex box, we can now do it much more simply:

```
<ul class="d-flex flex-row justify-content-around list-unstyled">
  <li class="">
    <a class="" href="http://www.twitter.com/bbusschots">🐦 @bbusschots</a>
  </li>
  <li class="">
    <a class="" href="http://www.bartb.ie/">🌐 bartb.ie</a>
  </li>
  <li class="">
    <a class="" href="http://flickr.com/photos/bbusschots/">📷 bbusschots</a>
  </li>
</ul>
```

Note that there’s no need to apply any classes to the list items themselves now. All the styling is done on the `<ul>` tag itself.

### Inlined Lists

As well as lists without bullets, Bootstrap allows you to go one better, displaying lists as inline elements by adding the class `list-inline` to a `<ul>` tag and `list-inline-item` to each list item.

We can see this in action by displaying the list of links in the playground page’s footer as an inline list:

```html
<footer class="text-center">
  <ul class="list-inline">
    <li class="list-inline-item">
      <a class="" href="http://www.twitter.com/bbusschots">🐦 @bbusschots</a>
    </li>
    <li class="list-inline-item">
      <a class="" href="http://www.bartb.ie/">🌐 bartb.ie</a>
    </li>
    <li class="list-inline-item">
      <a class="" href="http://flickr.com/photos/bbusschots/">📷 bbusschots</a>
    </li>
  </ul>
</footer>
```

Note that I centred the inlined list by applying the text-center utility class to the footer itself.

I’ve included a version of the sandbox with the above examples added as `pbs55b.html` in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs55.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs55.zip).

## A Challenge

Make the following changes to the recipe you’ve been building up over the past few challenges:

1.  Convert the page heading to a display heading.
2.  If you don’t already have one, add a short pithy description of the recipe directly below the page heading. Add your description as an `<h2>` with the text _‘Description’_, and a paragraph styled as a lead paragraph. The header is helpful to screen readers and search engines, but is not needed visually, so hide it with the `sr-only` utility class.
3.  Use one of the `h1` … `h6` classes to style the heading of the ingredients table appropriately.
4.  Update the quotation so it uses the appropriate content classes, and so it uses a `<footer>` tag with the appropriate class for the attribution of the quotation.
5.  Update the equipment flex box to make use of the `list-unstyled` class and remove the `d-block` workaround.
6.  Make any other improvements you think are appropriate.

## Final Thoughts

We’re now well into the second of Bootstrap’s four aspects. We made a first pass through the first aspect, the _utility classes_, in the previous two instalments. We’ve now made a good start on the second, Bootstrap’s so-called _content classes_. And we’ll probably finish that out in the next instalment with a look at tables, images, and figures. When that’s done we’ll move on to the most significant aspect of all — the _layout_ classes. Finally, quite a few instalments from now, we’ll have a look at some of the custom _components_ Bootstrap provides (things like modal dialogues, collapsible sections, etc.).
