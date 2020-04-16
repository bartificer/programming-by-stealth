# PBS 57 of X — The Bootstrap Grid

As we’ve learned in previous instalments, there are four distinct aspects to Bootstrap, a collection of utility CSS classes, a collection of styles for controlling built-in HTML elements like headers, figures, images, and tables (which Bootstrap refers to as _content_), page layout functionality, and a collection of re-usable components that don’t exist in native HTML. We started by looking at the utilities, then moved on to styling the standard HTML elements, and now we’re ready for our first look at layout.

Bootstrap’s layout functionality is designed from the ground up to be _responsive_, that is to say, to allow you to control the layout of a page differently depending on the size of the viewport. For example, you can create a single layout that shows as a simple single column when viewed on a small phone screen, two columns on a tablet, and three on a device with a larger screen.

Going from zero to responsive design would be a big leap, so we’re going to break it down into two distinct parts. In this instalment we’re going to confine ourselves to creating layouts that work on larger screen devices like desktops, laptops, and large tablets. Once we can lay things out at one size, then we’ll add in responsiveness in the following instalment.

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs57.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs57.zip).

# Matching Postcast Episode 553

Listen along to this instalment on [episode 553 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2018/06/ccatp-553//)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_30.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2018_06_30.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 56 Challenge Solution

The challenge set at the end of the previous instalment involved continuing to improve the recipe we’ve been working on for the past few challenges.

The first part of the challenge was to make the image in your recipe responsive. That’s to say, to make it shrink automatically when the viewport becomes smaller than the image. Bootstrap makes this very simple — just add the class `img-fluid` to the `<img>` tag.

The second part was a little more challenging — opt the figure into Bootstrap’s more opinionated styling, and format it in a way that makes sense within your page. Opting the figure into Bootstrap’s styles involves adding the class `figure` to the `<figure>` tag, the class `figure-img` to the `<img>` tag within the figure, and the class `figure-caption` to the `<figcaption>` tag:

```XHTML
<figure class="text-center figure">
    <img class="border rounded img-fluid figure-img" alt="Roasted Cucumber with Red Onion &amp; Dill" src="roastedCucumberWithRedOnionAndDill.png" />
    <figcaption class="figure-caption">The finished product fresh out of the oven!</figcaption>
</figure>
```

Before opting into the Bootstrap styling by adding the class `figure` to the `<figure>` tag my figure was centred, now it isn’t — why? As we learned in the previous instalment, it’s because the Bootstrap class `figure` sets the tag’s `display` property to `inline-block`. To fix this regression I simply had to force the figure to be displayed as a block by adding the Bootstrap utility class `d-block`:

```XHTML
<figure class="text-center figure d-block">
    <img class="border rounded img-fluid figure-img" alt="Roasted Cucumber with Red Onion &amp; Dill" src="roastedCucumberWithRedOnionAndDill.png" />
    <figcaption class="figure-caption">The finished product fresh out of the oven!</figcaption>
</figure>
```

The third task was to style the table of ingredients. The first step is to opt the table into Bootstrap’s opinionated styles by adding the class `table` to the `<table>` tag itself. Since my table is floated and 25% wide, I decided to opt for the more compact table style by also adding the class `table-sm`.

With the main body of the table now looking half-way decent I turned my attention to the table heading. I had been using the Bootstrap utility class `h2` to style my heading, but once I’d opted into Bootstrap’s opinionated tables, that wasn’t necessary anymore, so I removed it. Next I chose to opt for a subtle background on the header by adding the class _thead-light_ to the `<thead>` tag.

Purely on aesthetic grounds I chose to make the text in the entire table muted by adding the Bootstrap utility class `text-muted` to the `<table>` tag. Finally, I enabled the highlighting of the row being hovered over by adding the class `table-hover` to the `<table>` tag.

Lastly, the challenged suggested making any other changes you thought were appropriate.

You’ll find my full sample solution in the folder named `pbs56-challengeSolution` in [the ZIP file for this instalment](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs57.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs57.zip).

## Introducing Bootstrap Grid Layouts

As we learned back in instalments [8](https://www.bartbusschots.ie/s/2016/02/03/programming-by-stealth-8-of-x-css-positioning/) & [9](https://www.bartbusschots.ie/s/2016/02/19/programming-by-stealth-9-of-x-more-css-positioning/), manually creating robust page layouts with CSS involves quite a bit of effort. This is where Bootstrap’s layout grid can really save you a lot of time, energy, and frustration.

You can use Bootstrap grids to lay out parts of a page or a whole page, and multiple grids can be nested inside each other as needed.

### The Grid Structure

Each grid is contained within a wrapping tag that Bootstrap refers to as the grid’s _container_. Each container then contains one or more grid rows, and each row contains one or more grid columns. It’s the columns that contain your content. So, the important thing to remember is that containers contain rows which contain columns which contain the page’s content.

### In Bootstrap, 12 is the Magic Number

When it comes to Bootstrap grids, it’s all about 12. Every container is conceptually sub-divided into exactly 12 equal-width atomic columns (as I call them). You specify the widths of actual columns in terms of the number of atomic columns it should span. For example, you could specify that your side-bar should take up 3 of the 12 atomic columns, and your main content the other 9. Or, if you have two side-bars, you could allocate three to each and then use the remaining six for your main content region.

Even though a row is always 12 atomic columns wide, that doesn’t mean it’s necessarily a mistake to add more than 12 atomic columns worth of width into a row. Columns will overflow onto a new line when their total width exceeds 12. While it might sound counter-intuitive now, it won’t seem that way next time. The fact that rows can overflow is central to Bootstrap’s support for responsive design.

### Containers

In theory any tag can act as a grid container, but in really, you’ll mostly be using <div> tags. Remember that divs are semantically meaningless groupings of tags. That is to say, they are designed explicitly not to convey meaning, but instead to simply collect together parts of a page so they can be manipulated in some way as a unit.

There are two kinds of Bootstrap container — fixed-width containers, and fluid containers.

The width of a fixed-width container is always one of a small pre-defined set of possible widths. Which width the grid will be depends on the width of the viewport. Philosophically there’s a width for phones, a width for tablets, and one for desktops. What this means in real-terms is that the width of the grid doesn’t scale linearly as you re-size your browser window, but instead it jumps in large increments each time a threshold is passed. Between thresholds there will be empty space evenly distributed to the left and right of the container. This is quite an old-fashioned approach, and not particularly in vogue ATM.

Fluid containers on the other hand always stretch out to fill 100% of the available width.

To mark a tag as a fixed-width container give it the class `container`, and to mark one as a fluid container, give it the class `container-fluid`.

Note that all nested containers behave like fluid containers, regardless of whether they have the class `container` or `container-fluid`.

The following simple demo (`pbs57a.html` in [the ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs57.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs57.zip)) illustrates the difference between how fixed and fluid containers respond to window width — play around with the window’s width to see how differently the two kinds of container respond.

```XHTML
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
        
    <!-- Include Bootstrap 4 CSS -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
        
    <title>PBS 57 A — Container Demo</title>
</head>
<body>
<div class="container my-3 p-3 border rounded bg-primary text-center">
    <div class="row">
        <div class="col-12">
            <code>.container</code>
        </div>
    </div>
</div>
<div class="container-fluid my-3 p-3 border rounded bg-secondary text-center">
    <div class="row">
        <div class="col-12">
            <code>.container-fluid</code>
        </div>
    </div>
</div>
</body>
</html>
```

### Rows

As a general rule, the only thing a Bootstrap grid container can contain is Bootstrap grid rows. Or, put another way, all children of a Bootstrap grid container must usually be Bootstrap grid rows. There are rare edge cases where the Bootstrap documentation suggests omitting rows and including columns directly within a container, but those are the exception, not the rule.

To mark a tag as a Bootstrap grid row simply give it the class `row`. You can use any tag you like as a grid row, but very often, precisely because they have no semantic meaning, you’ll end up using `<div>`s.

### Columns

The only thing a Bootstrap grid row can contain is Bootstrap grid columns.

There’s no single class to indicate that a given tag should act as a grid column, but many. Thankfully, the naming convention is very sensible, and they all start with `col`.

Firstly, you can just use `col`, this gives you an auto-width column. What ever space in a row is not taken up by columns with explicit widths will be evenly divided between the columns with automatic widths.

The classes `col-1` through `col-12` will give you columns of width one through twelve atomic columns.

The following would be a very common arrangement — two side bars with explicit widths, and the space between given over to a central main content area (you’ll find this file in [this instalment’s ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs57.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs57.zip) as `pbs57b.html`):

```XHTML
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
        
    <!-- Include Bootstrap 4 CSS -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
        
    <title>PBS 57 B — Three-Column Layout Demo</title>
</head>
<body>
<div class="container-fluid my-3 p-3 border rounded bg-secondary text-center">
    <div class="row">
        <div class="col-3 rounded bg-primary py-5">
            <code>.col-3</code>
        </div>
        <div class="col rounded bg-light py-5">
            <code>.col</code>
        </div>
        <div class="col-3 rounded bg-primary py-5">
            <code>.col-3</code>
        </div>
    </div>
</div>
</body>
</html>
```

## Un-filled and Over-filled Rows

As mentioned above, you don’t have exactly 12 atomic columns worth of actual columns in any given row, you can have fewer, or more. Adding more than 12 will cause columns to wrap, but the result may be that you have a total that adds up to less than 12 on both rows. Imagine you had a `col-9` followed by a `col-5`, since nine plus five is greater than 12 the `col-5` would wrap, leaving you with two apparent rows (though still considered a single Bootstrap row), neither of which are full.

How should the empty space be dealt with? Since the Bootstrap grid is actually built using flex boxes under the hood, you control the empty space using the same Bootstrap Utility classes we learned about in the flex box section of [instalment 54](https://bartificer.net/pbs54) (`justify-content-between`, `justify-content-around`, etc.).

## Grid Gutters

By default, Bootstrap adds some spacing between rows and columns so text in adjacent grid cells doesn’t touch. This is usually what you want, but not always. Bootstrap refers to this grid spacing as _gutters_, and they can be removed on a row-by-row basis by adding the class `no-gutters` to the tag that’s acting as the grid row.

## Re-visting Our Bootstrap Template

When we first met Bootstrap back in [instalment 52](https://bartificer.net/pbs52) I told you to wrap your Bootstrap code in the following snippet:

```XHTML
<div class="container-fluid mt-3">
  <div class="row">
    <div class="col-12">
      <!-- Your Code Here -->
    </div>
  </div>
</div>
```

At the time I didn’t explain what the code meant, but promised I would at some vague future time when we’d learned enough Bootstrap for the explanation to make sense. I hope you can see that we’ve now arrived at that vague future. What that snippet does is wrap your code in a fluid container with a top margin of 3 and a single row containing a single full-width column. Why do we need to wrap our code in a container? Simple, when using Bootstrap, the page body has no padding, so content touches the edges. The container gives the needed padding left and right. By default there’s no margin above a container. In the real world that’s usually what you want because banners or navigation bars that touch the top of the viewport are all the rage these days! However, for playing around, I felt a little room at the top of the page worked better, so I added the `mt-3` utility class to add a medium-sized margin to the top of the container.

## A Worked Example

As a practical worked example, let’s take a slightly expanded version of the file with the tables and figures we used in the previous instalment as our starting point, and lay it out. To give the page a more consistent look across computers I changed the existing fluid container into a fixed-width one. You’ll find the full source code for the starting point in [this instalment’s ZIP](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs57.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs57.zip) as `pbs57c.html`.

To lay out a page you need to break it down into chunks of related content, and then move those chunks around. Sometimes those chunks will have semantic meaning, and sometimes they’re just convenient chunks of information. Each chunk needs to be wrapped in a tag, and my advice would be to prefer semantic tags over `<div>`s when ever they make sense, but only ever if they make sense.

Let’s start with the really big-picture stuff. The page clearly has a heading, so let’s wrap that in the semantic `<header>` tag. Everything else on the page is part of the main content of the page, so let’s wrap that in a `<main>` tag.

Since this is a single article, the best semantic tag for describing the distinct regions within the content is `<section>`. Let’s create sections for each of the chunks of content that begin with an `<h2>` tag. Since these headings will now becomes top-level headings within a section rather than second level heading within the page they need tp be changed from `<h2>`s to `<h1>`s.

Finally, to give us a meaningful sidebar to work with, I moved the small table and the small figure into a separate grouping. I chose to mark them up as an aside, and removed the utility tags to set their width and to float them.

A version of the file with all the semantic markup added can be found in [the ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs57.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs57.zip) as `pbs57d.html`.

Now that our page has been broken into chunks we can think about how we’d like to lay those chunks out.

I’ve decided that I’d like to have a full-width header section followed by two columns containing the textual sections of the page in a wide column on the left, and the small table and figure in a side-bar on the right.

Then I want to switch back to full-width for the detailed results section with its big map and large, detailed table of results.

Finally, I want to switch to two equal-width columns for the sources and further reading sections.

At the top level of the page structure the page is effectively divided into two — the page heading, and everything else. We want that as two rows each containing one full-width column. The first row will only contain the header, that’ll be easy.

The second row’s single column on the other hand will contain everything else, so we’ll need to nest a second grid inside that.

The nested grid will consist of three rows — one with a wide main content area and a right side-bar, one with a single full-width column, and one with two equal-width columns.

All this involves a lot of open-heart surgery on the page. I’ll describe it step-by-step below, but don’t worry if it sounds confusing, I’ve included the finished source code in the ZIP file!

So, before we start our open-heart surgery our page contains one container which contains one row which contains one column.

We’ll convert this existing container into the outer container in our desired nested layout.

Let’s start by breaking the header and the main content into their own rows:

We can leave the `<div>` that’s acting as the container (the one with the class `container`) in place, and we can also leave the start of the existing `<div>` that’s acting as a row in place (the one with the class `row`). However, instead of letting it wrap almost the entire rest of the page, we should close it just after the closing `</header>` tag.

We can get rid of the original column `<div>` (the one with the class `col-12`) because we can use the `<header>` tag as the column by giving it the class `col-12`.

Next, we’ll convert the entire `<main>` tag into the second row of the outer grid by giving it the class `row`. Finally, we need to wrap all the content of main in another tag that we’ll mark as a full-width column by giving it the class `col-12`. Since this grouping has no semantic meaning, I chose to use a `<div>`.

It’s inside this full-width column that takes up the entire second row of the outer grid that we want to create our nested inner grid. Before we do that, let’s pause and take stock of where things stand now. This is the current big-picture structure of our page:

```XHTML
<div class="container mt-3">
  <div class="row">
    <header class="col-12">
      <h1 class="display-1">Ireland Votes <small class="text-muted">May 2018</small></h1>
        
      <p class="lead">On the 25<sup>th</sup> of May 2018 the people of Ireland voted in a referendum on whether or not to accept the 36<sup>th</sup> amendment to their constitution. <a href="https://en.wikipedia.org/wiki/Thirty-sixth_Amendment_of_the_Constitution_Bill_2018" target="_blank" rel="noopener">Read More ...</a></p>
    </header>
  </div>
        
  <main class="row">
    <div class="col-12">
      <!-- REST OF PAGE HERE -->
    </div>
  </main>
</div>
```

Let’s go ahead and create that inner container now.

This container has no semantic meaning, so again, we should use a `<div>` with the class `container`. By default, containers have a padding. This is usually desirable, not not in this specific situation. With the padding in place the contents of our inner grid will appear off-set from the content contained in the outer grid, and we don’t want that. We can very easily remove the un-wanted padding by adding the Bootstrap utility class `p-0` to the inner container.

We now have a container without a row, so let’s open another `<div>` with the class `row` directly inside the inner container.

We want the first row to encompass everything from the section headed _The Amendment_ to the end of the aside containing the small table and figure, so we should close the above `<div>` between the `<aside>` tag and the following `<section>` tag.

We’ll be adding more rows later, but for now let’s step into the one we just created and add our two columns.

The first of the two columns will contain three sections, and the second the aside that contains the small table and figure. As things stand the three sections are independent elements, so they’ll need to be grouped together. We do this by wrapping a `<div>` around them. We’ll use this `<div>` as the first column in the first row of the nested grid, so we need to give it the class `col` (so it uses all the room we don’t assign to the aside).

The table and figure are already grouped together in the aside, so we can just convert that to our second column by giving it the class `col-4`. (Feel free to experiment with other widths, and watch how the main content area shrinks and grows accordingly because it doesn’t have a specific width assigned.)

That’s the first row of the nested grid taken care of.

We now need to create a second row. We do that by wrapping the detailed results section with another `<div>` and giving it the class `row`. Next we’ll need a single full-width column inside that row. The existing `<section>` tag wraps all the content we want in this column, so we can use it as the column by giving it the class `col-12`.

Finally, we want to group the last two sections into a third row in our inner grid with two columns. We’ll wrap both of those sections in yet another `<div>` ad give it the class `row`. Finally, we can convert the existing sections into the two columns we want by giving them both the class `col`.

At this stage we’re almost done. We just need to do a little house-keeping in the right side bar. The table caption is not centred, so we need to give the `<caption>` tag within the small table the class `text-center`. The figure is also not centred so we need to give it the classes `d-block`, `mx-auto`, and `text-center` (the technique we learned in the previous instalment for centring figures within their containing block).

You’ll find the full source for the finished laided-out page in [the ZIP file](https://www.bartbusschots.ie/s/wp-content/uploads/2018/06/pbs57.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs57.zip) as `pbs57e.html`, but this is the basic structure of the final page:

```XHTML
<!DOCTYPE html>
<html>
<head>
  <meta name="generator" content="HTML Tidy for HTML5 for Balthisar Tidy on macOS, version 5.7.16">
  <title>PBS 57 Dummy Page</title>
  <meta charset="utf-8"><!-- Include Bootstrap 4 CSS -->
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
</head>
<body>
  <div class="container mt-3"> <!-- open outer container-->
    <div class="row"> <!-- open 1st row in outer container-->
      <header class="col-12"> <!-- open only col in 1st row in outer container-->
        ...
      </header> <!-- close only col in 1st row in outer container-->
    </div> <!-- close 1st row in outer container-->
        
    <main class="row"> <!-- open 2nd row in outer container-->
      <div class="col-12"> <!-- open only col in 2nd row in outer container-->
        <div class="container p-0"> <!-- open inner container -->
          <div class="row"> <!-- open 1st row in inner container -->
            <div class="col"> <!-- open 1st col in 1st row of inner container -->
              ...
            </div> <!-- close 1st col in 1st row of inner container -->
          
            <aside class="col-4"> <!-- open 2nd col in 1st row of inner container -->
              ...
            </aside> <!-- close 2nd col in 1st row of inner container -->
          </div> <!-- close 1st row in inner container -->
          
          <section class="row"> <!-- open 2nd row in inner container -->
            <div class="col-12"> <!-- open only col in 2nd row of inner container -->
              ...
            </div> <!-- close only col in 2nd row of inner container -->
          </section> <!-- close 2nd row in inner container -->
          
          <div class="row"> <!-- open 3rd row in inner container -->
            <section class="col"> <!-- open 1st col in 3rd row of inner container -->
              ...
            </section> <!-- close 1st col in 3rd row of inner container -->
          
            <section class="col"> <!-- open 2nd col in 3rd row of inner container -->
              ...
            </section> <!-- close 2nd col in 3rd row of inner container -->
          </div> <!-- close 3rd row in inner container -->
        </div> <!-- close inner container -->
      </div> <!-- close only col in 2nd row in outer container-->
    </main> <!-- close 2nd row in outer container-->
  </div> <!-- close outer container-->
</body>
</html>
```

## Challenge

Using the recipe you’ve been developing over the past few challenges as a starting point, use what we’ve learned today to lay it out in what ever way you think works best for viewing on a desktop of laptop screen. For now, don’t worry about what it looks like on smaller screens. Dealing with multiple screen-sizes is a challenge for another time 😉

## Final Thoughts

Now that we’ve learned how to lay out section of a page on large screens, we’re ready to dive into responsive design next time.