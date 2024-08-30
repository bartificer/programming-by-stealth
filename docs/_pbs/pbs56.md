---
title: More Bootstrap Content
instalment: 56
creators: [bart, allison]
date: 2018-06-16
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_16.mp3
---

In the previous instalment we got our first look at the functionality the Bootstrap documentation groups together under the heading _Content_. These are opt-in additional styles for standard HTML elements. Last time we looked at headings, paragraphs, quotations and lists. This time we’ll finish our overview of this aspect of Bootstrap with a look at styling images, figures, and tables.

In the next instalment we’ll move on to the most powerful aspect of Bootstrap, layout. This will take us a few instalments to cover, but when we’re done we’ll have learned how to use Bootstrap to arrange content on a page, and, better yet, to make our layouts _responsive_. That is to say, we’ll learn how to use Bootstrap to make our pages look right on any screen, from the smallest phone to the largest desktop!

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs56.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs56.zip).

## Matching Podcast Episode 551

Listen along to this instalment on [episode 551 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2018/06/ccatp-551/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_16.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_16.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 55 Challenge Solution

The challenge set at the end of [the previous instalment](https://pbs.bartificer.net/pbs55) was to continue to improve the recipes we’ve been working on over the last few instalments.

The first part of the challenge was to convert the page header to a display heading. I chose to break my title into two parts, a main part, and a subtitle using the `<small>` tag:

```html
<h1 class="display-1 sticky-top bg-white border-bottom">Roasted Cucumber<br> <small class="text-muted">with Red Onion &amp; Dill</small></h1>
```

The key point is the addition of the class `display-1` to the `<h1>` tag.

The next task was to add a pithy description to the top of the recipe, and to mark it as a lead paragraph. To aid screen readers and SEO, the paragraph should be preceded with a visually invisible heading:

```html
<h2 class="sr-only">Description</h2>
<p class="lead">An unusual roasted vegetable dish that's refreshingly tangy and will pair well with fish.</p>
```

The key here is the use of the class `lead` on the paragraph, and the class `sr-only` (screen reader only) to the heading.

Next, the heading at the top of the table of ingredients was to be rendered as if it were a heading tag. I felt that this heading was of equal importance to the other section headings on the page, all of which are `<h2>`s, so I chose to add the class `h2`:

```html
<table class="w-25 float-right">
  <thead>
    <tr>
      <th class="h2">Ingredients</th>
    </tr>
  </thead>
  <tbody>
    <!-- ... -->
  </tbody>
</table>
```

The fourth task was to update the quotation to use the appropriate markup and classes for block quotations:

```html
<blockquote class="blockquote">
  <p class="font-italic">"If the natural ..."</p>
  <footer class="blockquote-footer text-right"><strong>Julia Child</strong> in <em>Mastering ...</em> (1961)</footer>
</blockquote>
```

The key changes are the addition of the class `blockquote` to the `<blockquote>` tag, and the wrapping of the attribution in a `<footer>` tag with the class `blockquote-footer`.

Finally, the fifth task was to update the flex box with required equipment to use the appropriate list classes rather than the `d-block` hack used previously:

```
<ul class="list-unstyled d-flex flex-row justify-content-between text-center my-3 mx-0 p-0">
  <li>
    <!-- ... -->
  </li>
  <!-- ... -->
</ul>
```

The key points are the addition of the class `list-unstyled` to the `<ul>` tag, and the removal of all classes from the individual `<li>` tags.

I’ve included my full sample solution within the folder named `pbs55-challengeSolution` in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs56.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs56.zip).

## Playground

Like last time, I’ve created an HTML document with some previously created elements and empty class attributes which you can use to play along with this instalment. This time the source is very long because it contains tabular data. So I’m not including the source below, but you’ll find it in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs56.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs56.zip) as `pbs56a.html`, and in [this interactive Bootply playground](https://www.bootply.com/84ZKahLphH).

## Images & Figures

For the most part, images in Bootstrap are styled in the same way as any other block-like element — you use the border utilities to control the border, the spacing utilities to control the margin, and the positioning utilities to float images left or right if so desired.

For example, to add a rounded red border, float left, and add a margin to all sides but the left, you could do something like:

```
<img class="border border-danger rounded float-left m-3 ml-0" src="img.jpeg" alt="an image">
```

Note that we set the generic margin to `3` with the class `m-3`, and then the left margin to `0` with the class `ml-0`. This works because the classes controlling all four sides have a lower specificity than those controlling just two sides, which in turn have a lower specificity than those controlling just one side.

Bootstrap does provide one notable additional image feature though — the ability for an image to shrink to fit into the width of its container. Bootstrap refers to such images as being _responsive_, but you may also see them referred to as being _fluid_.

### Responsive/Fluid Images

A responsive image is one that shrinks so its width is never wider than its containing block. Note that the aspect ratio will be preserved, and that an image that’s too small to fill the container’s width won’t get stretched — responsive images shrink, they do not stretch!

To mark an image as responsive, simply give it the class `img-fluid`.

To see this in action, let’s add the class `img-fluid` to the first image that appears in the dummy page (the one of the posters with the ID `fig1`). Notice that, while your viewport is larger than the width of the image, it’s displayed in the normal way. Now, shrink your viewport by shrinking the width of your browser window and watch the image scale so it never overflows the page!

### Figures

Very often, when including an image in a page, you want to accompany it with a caption. In HTML 5, the combination of a graphic of some sort with a caption is referred to as a _figure_. The relevant HTML 5 tags are `<figure>` and `<figcaption>`.

Bootstrap provides some CSS classes for adding basic styles to figures. The containing `<figure>` tag should be given the class `figure`, the image itself the class `figure-img`, and the `<figcaption>` tag the class `figure-caption`.

As a first example, let’s add these classes to the first figure in the playground:

```html
<figure class="figure">
  <img id="fig1" class="figure-img img-fluid rounded" alt="Election Posters ..." src="https://upload.wikimedia.org...">
  <figcaption class="figure-caption">Abortion Referendum Campaign Posters...</figcaption>
</figure>
```

Note that because it generally looks better, I also added the Bootstrap utility class `rounded` to the image to give it subtly rounded corners.

Also note that I left the `img-fluid` class in place because I still want the image to shrink when needed.

You’ll see that the changes adding these tags make are subtle. The spacing is adjusted a little, and the caption is rendered in a subtle font.

A very likely next step would be to float the figure; so let’s do that by adding the classes `w-25` (to set the width), and `float-right` to the `<figure>` tag:

```html
<figure class="figure w-25 float-right">
  <!-- ... -->
</figure>
```

You may not want your figure to float. Instead, you might want to centre it within the page. This can be done too, but there’s a subtlety you’ll need to remember.

Let’s start by giving the components that make up our second figure (the map) the standard Bootstrap classes for figures (`figure`, `figure-img`, & `figure-caption`). We should also make the image responsive by giving it the class `img-fluid`, and centre the text within the caption by giving it the Bootstrap utility class `text-center`. This will format the caption nicely, but it won’t centre the figure:

```html
<figure class="figure">
  <img id="fig2" class="figure-img img-fluid" alt="Result Map" src="https://upload.wikimedia.org/...">
  <figcaption class="figure-caption text-center">Referendum result by ...</figcaption>
</figure>
```

As we’ve seen before, we can centre a regular block element by giving it a specific width and setting the left and right margins to `auto` with the Bootstrap utility class `mx-auto`. Try that on the figure by adding the classes `w-75` to set the width to 75%, and `mx-auto` to balance the margin left and right.

Perhaps surprisingly, that only half works — the width does change, but the figure does not get centred within the page. What’s going on?

As you can confirm to yourself with the developer tools of your choice, the class `figure` sets the `display` property to `inline-block`, and inline blocks don’t have margins! What’s the solution? Simple, just set the `display` to `block` with the Bootstrap utility class `d-block`:

```html
<figure class="figure w-75 mx-auto d-block">
  <img id="fig2" class="figure-img img-fluid" alt="Result Map" src="https://upload.wikimedia.org/...">
  <figcaption class="figure-caption text-center">Referendum result ...</figcaption>
</figure>
```

And with that, we now have a nicely centred and nicely formatted figure.

## Tables

Probably the most striking of the Bootstrap content classes are those for tables. Native HTML tables leave a lot to be desired, and Bootstrap really addresses the shortcomings.

Bootstrap assumes proper table markup, so be sure to enclose your header rows inside a `<thead>` tag, and your table’s body inside a `<tbody>` tag. Also, if your table has footer rows, they need to go within a `<tfoot>`.

### The Basics

To apply Bootstrap styling to a table, you have to give it the class `table`. That will give you the default Bootstrap styling for tables, which includes nice typography, and subtle borders at the top of each row. In my opinion the look is elegant and modern. To see for yourself, add the class `table` to both of the tables in the sandbox.

Once you’ve applied this basic class, you can apply additional classes to customise your table further. In general, these additional classes have been designed with the intention that they be combined with each other, at least where the combinations make sense.

### Coloured Tables

Firstly, the most dramatic change you can make to your tables is to invert them from their default dark on light rendering to light on dark. You do this with the class `table-dark`.

If inverting the entire table is a bit too dramatic for your taste, you can invert just the header by applying the class `thead-dark` to the `<thead>` tag. If even that’s a little too stark, you can get a more subtle grey background with the class `thead-light`.

You can experiment with all these options with the tables in the sandbox page, but I’m going to keep things subtle by adding the more subtle grey background to the first, smaller table in our sandbox with the class `thead-light`, and the darker heading to the second (larger) table with the class `thead-dark`.

Finally, there are table-specific variants of the colour utility classes. They can be used to set background colours at both the row and cell level. The following are available, and do what you would expect them to do:

*   `table-primary`
*   `table-secondary`
*   `table-success`
*   `table-danger`
*   `table-warning`
*   `table-info`
*   `table-light`
*   `table-dark`
*   `table-active`

These classes give a more toned-down colour than that which you get from the regular background utility classes (`bg-primary` etc.), but they don’t work on inverted tables. Thankfully the stronger colours from the traditional background utilities do work well on inverted tables.

As an example, let’s give the row with the votes in favour within the first (smaller) table the class `table-success`, and the row with the votes against the class `table-danger`.

### Row Highlighting

As your tables grow, and especially if they become very wide, it can be hard to follow the rows with your eyes. To make this easier, Bootstrap provides the class `table-striped` which, as its name suggests, alternates the background colour of each subsequent row.

Let’s see this in action by adding the class `table-striped` to the second, larger table in our sandbox page.

Another technique for helping users view large tables is to highlight the row the mouse is hovering over. This can be done with the `table-hover` class.

Both of these classes work on both regularly coloured tables and dark tables. Do also note that the effects are only applied to rows within the body of the table, that is to say, `<tr>`s within the `<tbody>`.

### Borders

By default, Bootstrap adds some subtle partial borders to the rows within tables, but no borders between cells. The default look is minimalistic and contemporary, so you may well choose to keep it, but you don’t have to. You can override the default partial borders in two ways — you can use the class `table-borderless` to remove all borders, or `table-bordered` to add borders to all sides of all cells.

Again, both of these classes work on regular and dark tables.

You can experiment with both of these classes in the sandbox, but I’m going to leave the borders on the larger table as they are, and make the first, smaller table fully bordered by adding the class `table-bordered`.

### Smaller More Subtle Tables

In keeping with Bootstrap’s modern look, its default rendering to tables has a lot of white space, and uses quite large fonts. Sometimes you need your tables to be a little more compact, and that’s what the `table-sm` class is for!

The smaller of the two tables in the sandbox is well suited to shrinking down a little. Let’s give it the class `table-sm`.

Let’s take things a little further and shrink the table and float it right by adding the class `w-50` and `float-right`.

The first smaller table in the sandbox should now look something like:

```html
<table class="table table-bordered table-sm w-50 float-right">
  <caption class="">National total results...</caption>
  <thead class="thead-light">
    <!-- ... -->
  </thead>
  <tbody class="">
    <tr class="table-success">
      <th>Yes</th>
      <!-- ... -->
    </tr>
    <tr class="table-danger">
      <th>No</th>
      <!-- ... -->
    </tr>
    <!-- ... -->
  </tbody>
</table>
```

### Table Captions

The HTML spec allows tables to define captions using the `<caption>` tag. Note that captions are not headings, they are descriptions of the table’s content in the same way that you’d caption an image. For that reason, Bootstrap’s style for table captions is subtle, and consistent with the way Bootstrap styles `<figcaption>`s.

### Horizontally Scrolling Tables

Normally, when a table becomes too wide to fit into its container, it overflows through the right edge of the container. That’s unlikely to be what you want. So if you have a big table, Bootstrap gives you the option of having it automatically develop a horizontal scroll bar whenever it would ordinarily overflow.

This kind of automatic scrolling is made available via the `table-responsive` class, but unlike most of the other table-related classes, this one is not applied to the `<table>` tag, or even to a tag within the table. Instead, you have to wrap the table with another tag, usually a `<div>`, and give it the class `table-responsive`.

Let’s do this for the second, larger, table in our sandbox:

```html
<div class="table-responsive">
  <table class="table table-striped">
    <caption class="">Detailed results...</caption>
    <thead class="thead-dark">
      <!-- -->
    </thead>
    <tbody class="">
      <!-- -->
    </tbody>
    <tfoot>
      <!-- -->
    </tfoot>
  </table>
</div>
```

You’ll find a version of the sandbox page with all the examples added as `pbs56b.html` in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs56.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs56.zip).

## A Challenge

For this challenge we’ll continue to improve the recipe we’ve been building up for the past few instalments. Update your recipe with the following enhancements:

1.  Make the image in your recipe’s figure responsive.
2.  Style your recipe’s figure as you think works best, perhaps floated, or perhaps centred.
3.  Style your table of ingredients as you like.
4.  Make any other improvements you consider appropriate.

## Final Thoughts

We’ve now covered two of Bootstrap’s four aspects — the utility classes and the content classes. Next we’ll move on to the layout classes. Bootstrap’s layout engine is very powerful, and it has a lot of features. So unsurprisingly, it will take us a few instalments to make our way through it. When we’re done we’ll be able to lay out our pages just the way we want, and in such a way that they’ll look great on any screen. Bootstrap doesn’t just do layouts, it does responsive layouts!

 - [← PBS 55 — Bootstrap Content](pbs55)
 - [Index](index)
 - [PBS 57 — The Bootstrap Grid →](pbs57)