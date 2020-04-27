# PBS 7 of X – More CSS

In this instalment we’ll build on our basic understanding of CSS from previous instalment. We’ll start with some new CSS selectors, in the process, introduce two new HTML tag attributes, then we’ll move on to the CSS box model. Each HTML tag is represented in the page as a box, and all those boxes can be manipulated with CSS.

# Matching Podcast Episode 422

Listen Along: Chit Chat Accross the Pond Episode 422

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_01_22.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_01_22.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## More Selectors

Our first naive understanding of selectors was that they are simply tag names, so, we know we can specify style definitions for emphasised text with the selector `em`. That’s fine assuming we always want all our emphasised text to be rendered in the same way, but what if we sometimes need to apply different styles to emphasised text?

Solving this problem is what advanced CSS selectors are all about. There are many different scenarios in which you may need different styles on the same tag within the same page, and hence, there are many different CSS selectors. We’ll look at three new selectors in this instalment.

### Tag Containment

Imagine this scenario – in your main document, you are happy to have emphasised text rendered in the default way, that is to say, in italics. You also like having block quotes rendered in italics, so you have added the style definition in your sheet:

```CSS
blockquote{
  font-style: italic;
}
```

You now include a quotation that contains emphasised text – that emphasis will vanish, because within a block quote, all text is now italic! You need to specify some additional style for emphasised text, but only within block quotes.

This is where the CSS containment selector comes into play. To specify that a style should only be applied to a tag if it is contained within another tag, the selector is simply the name of the containing tag followed by a space, followed by the contained tag. So, in our example, we could make emphasised text within block quotes dark grey with the style definition:

```CSS
blockquote em{
  color: DarkGrey;
}
```

Note that the concept is containment, not parentage. The above selector will apply to emphasised text directly within a block quote, as well as to emphasised text within a paragraph within a block quote. The depth of nesting does not matter.

Note that the containment selector is not limited to one level of containment – you could style only paragraphs within list elements within ordered lists with the selector `ol li p`.

### Classes

Every HTML tag can specify a `class` attribute. This attribute should contain one or more class names. When specifying multiple class names, the value of the attribute should be a space-delimited list.

You can define your own class names as you wish, but, they must obey the following rules:

*   CSS class names must begin with a letter, underscore, or hyphen (not a number)
*   The first character can be followed by zero or more letters, digits, underscores or hyphens
*   If the first character is a hyphen, the name must be at least two characters long, and the second character must be a letter or an underscore
*   As a convention, class names beginning with a hyphen are reserved for the browser, so while they are allowed, you should avoid naming your own classes with a leading hyphen

Adding classes to a tag will have no visible effect on the document without CSS. In effect, the attribute provides a hook to hang style information onto.

To specify a class name in a CSS selector, the syntax is the name of the class pre-fixed with a dot.

So, to specify that all tags with the class `vip` should be rendered in dark red, you could use the following style definition:

```CSS
.vip{
  color: DarkRed;
}
```

To specify a style for only a particular tag of a particular class, specify the tag name followed by a dot followed by the class name. So, for example, to make top-level headings with the class vip bright red, you could use the following style definition:

```CSS
h1.vip{
  color: Red;
}
```

Note that there is no limit to how many classes you specify in a selector – if you only wanted to apply a style to paragraphs that specify **both** the classes `vip` and `for-ref`, you would use the selector `p.vip.for-ref`.

Finally, note that you can apply the same class name to as many tags within a document as you like.

### IDs

Every HTML tag can specify an `id` attribute. Effectively, an ID is a name you give a tag that uniquely identifies it in the document. IDs have a number of uses, and we’ll learn about more of them as we go through this series, but for now, we’ll use IDs to target individual tags within a CSS selector. That is to say, not all instances of a given tag, but a single, specific tag.

Like a class name, IDs are names of your own invention, but they do have to adhere to certain rules:

*   The first character in an ID must be a letter
*   After the first character there can be zero or more letters, digits, underscores, hyphens, colons or dots.
*   While it is legal to use dots in IDs, it causes complications when using the ID in a CSS selector, so it is advisable not to use them.

The CSS selector for an ID is the `#` symbol followed by the ID, so to make any tag with the ID `intro_text` blue, you would use a style definition something like:

```CSS
#intro_text{
  color: blue;
}
```

You can also combine a tag name with an ID so the style is only applied if the tag with a given ID is of a given type. For example, to make a paragraph with an ID of `intro_text` blue you would use a style definition something like:

```CSS
p#intro_text{
  color: blue;
}
```

Unlike with classes, IDs should be unique within an HTML document.

### Combining Selectors

Selectors will get even more complex in future instalments, but for now it is important to emphasise that the three selectors were have learned about today can be combined in any arbitrary way. To apply a style only to emphasised text with a class `vip` within a paragraph with ID intro\_text you would use the selector `p#intro_text em.vip`.

## Specificity Re-visited

Now that we have learned about tag containment, classes and IDs within CSS selectors, we need to re-visit the concept of specificity.

The specificity for a given style definition consists of four numbers, and is written as `s,i,c,t` – where all four letters represent an integer as follows:

`s`

`1` if the style definition was defined in a style attribute belonging to the tag being styled, `0` otherwise.

`i`

The number of IDs specified within the selector

`c`

The number of Classes specified within the selector

`t`

The number of tag names specified within the selector

To compare two specificities, start with the `s`, if they are different, the one with the highest `s` wins, otherwise, move on to `i`, again, if they are different, the one with the highest `i` wins, otherwise move on to `c`, and so on.

If we add in what we learned about specificity last time, we can now say that the specificity of style definitions that are inherited from the portent, or specified with the \* selector is `0,0,0,0`.

Finally – if the four-component specificity for two competing definitions is exactly the same, the rule defined the furthest down the document wins.

## The CSS Box Model

Within the browser, every HTML tag that makes up part of the page is defined by a rectangle, and that rectangle is referred to as the tag’s _box_.

To build the box for an element, start with the content region itself. Around that you can wrap a region zero or more pixels wide in the same colour as the box’s background (transparent by default) called the padding, around that you can wrap a coloured region zero or more pixels wide called the border, and finally, around that you can add a transparent region zero or more pixels wide called the margin. Padding, border, and margin default to be symmetric, but each can have a different thickness on the top, bottom, left, and right.

![The CSS Box Model](../assets/pbs7/Screen-Shot-2016-01-15-at-16.06.11.png)

The boxes for block-level tags stretch to the full width of the the content area of the tag they are contained within, and stack one against the other, with the boxes touching each other. The body tag’s box extends to the edges of the content area of the browser window or tab they are appearing in.

## Styling the Boxes

We can use CSS to style the box for any HTML tag.

When setting dimensions on boxes, we have a number of units at our disposal:

Pixels

Written as an integer number with `px` appended, e.g. `4px`.

Percentages

A dimension can be expressed as a percentage relative to some appropriate dimension – exactly what the percentage will be relative to depends entirely on the context in which it is used. Percentages are written as a number followed by the `%` symbol.

Font Size Multiplier

For reasons now lost to history (though there are some plausible theories), in typography, the term `em` refers to the size of a font. In CSS, dimensions can be specified as being a given multiplier of the font size. This is done by specifying a number with the letters `em` appended to it. To specify that a dimension should be half the size of the element’s font you would write it as `0.5em`.

### Margins & Padding

The margin is controlled by four CSS properties, `margin-top`, `margin-right`, `margin-bottom`, and `margin-left`. Each of these properties expects as valid positive dimension value – negative margins make no sense!

Because it’s often desirable to set all four margins at once, CSS provides the `margin` shorthand property. It expects either one, two, or four dimensions separated by spaces. When one dimension is specified, that dimension is applied to all four margin properties. When two dimensions are specified the first is applied to the top and bottom margins, and the second to the left and right. Finally, when four properties are provided, they are interpreted as the top, right, bottom, and left values – in that order.

```CSS
/* Short version */
margin: 5px;
/* Is identical to */
margin-top: 5px;
margin-right: 5px;
margin-bottom: 5px;
margin-left: 5px;

/* Short version */
margin: 5px 0px;
/* Is identical to */
margin-top: 5px;
margin-right: 0px;
margin-bottom: 5px;
margin-left: 0px;

/* Short version */
margin: 0px 5px 10px 15px;
/* Is identical to */
margin-top: 0px;
margin-right: 5px;
margin-bottom: 10px;
margin-left: 15px;
```

An extra complication, although it does make sense, is that vertical margins which touch each other without anything in-between will collapse to the largest of the two margins. This sounds counter-intuitive, but it makes sense when you see it in action. For example, you may say that headers should have 20 pixels of margin top and bottom, and paragraphs should have 10 pixels of margin top and bottom. When a paragraph comes directly after a heading, you don’t want there to be a 30 pixel gap because that will look very odd indeed. What happens is that the margin will collapse to 20 pixels, because 20 is greater than 10. Horizontal margins do no collapse.

Padding is specified in similarly to margins, but using the four properties `padding-top`, `padding-right`, `padding-bottom`, and `padding-left`, and the shorthand property `padding`.

### Borders

Margins and padding are represented by four dimensions, one for each side. Borders are a little more complicated, because each of the four sides of the border has a width (thickness if you will), colour, and style. This means that the basic properties of a single box’s border is controlled by no fewer than twelve CSS properties: `border-top-width`, `border-top-color`, `border-top-style`, `border-right-width`, `border-right-color`, `border-right-style`, `border-bottom-width`, `border-bottom-color`, `border-bottom-style`, `border-left-width`, `border-left-color`, and `border-left-style`.

The `-width` properties expect a dimension, like margin and padding, the `-color` properties expect a valid colour, like with the `color` property we saw in the previous instalment, and the `-style` properties expect one of the following values: `dotted`, `dashed`, `solid`, `double`, `groove`, `ridge`, `inset`, or `outset`. The default border style is `solid`.

There are a number of shorthand properties to make setting borders easier, all five of them expect to be given one or more of a width, style, or colour, separated by spaces. To set all three properties on one of the four borders there are `border-top`, `border-right`, `border-bottom`, and `border-left`, and to set the three properties on all four borders at once there is the shorthand property `border`.

So, to set all four borders to the same, use something like:

```CSS
border: 2px solid blue;
```

If you want three of the borders to be the same, you can first use the border shorthand property, then one of the sides, e.g. to set all but the borders but the bottom one you could use something like:

```CSS
border: 1px dashed red;
border-bottom: 0px;
```

CSS 3 finally introduced an officially supported way of rounding borders. Individual browsers had support through non-standard style properties before CSS3, but they were different in every browser. In CSS 3 we can use the `border-radius` property to set the radius of the rounding of the border by specifying a dimension. The border-radius property is actually a shorthand property setting the same value on all four of the following properties: `border-top-left-radius`, `border-top-right-radius`, `border-bottom-right-radius` & `border-bottom-left-radius`.

You could add a quite subtle rounding to the borders with something like:

```CSS
border-radius: 5px;
```

### Backgrounds

By default, tags have transparent backgrounds, but this can be altered by CSS. Backgrounds appear behind the content region and the padding, that is to say, everything out as far as the border, but not behind the margin, that region of a box is always transparent.

The easiest element of the background to control is the colour. The property that control the background colour is `background-color`, and valid values are `transparent`, and any valid CSS colour.

Images can also be used as backgrounds using the `background-image` property. The value for this property can be `none`, or the URL to an image.

By default, a background image is tiled across the entire box (inside its border) from top to bottom and left to right. The tiling can be controlled with the `background-repeat` and `background-position` properties.

The first of these, `background-repeat`, can have the values `repeat`, `repeat-x`, `repeat-y`, and `no-repeat`. The default value is `repeat`, that is to say, repeated both across and down. `repeat-x` means the background image should only be repeated across, and `repeat-y` means the image should only be repeated up and down. As you might expect, `no-repeat` means there should only be one copy of the image used.

When only repeating in one direction, or not at all, the positioning of the background image becomes important. The `background-position` property is quite complex, but in general, you want one of the nice simple English values like `center`, `top left`, or `right`. You can get the full details [here](http://www.w3schools.com/cssref/pr_background-position.asp).

## A Worked Example

This week’s example consists of four files – an HTML file, a CSS file, and two images used as backgrounds. You can download all four in a single ZIP file [here](https://www.bartbusschots.ie/s/wp-content/uploads/2016/01/pbs7.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs7.zip).

As usual, copy the four files into a folder called `pbs7` in your web server’s document root, then browse to `http://localhost/pbs7`.

The page should look something like:

![PBS 7 - Example](../assets/pbs7/Screen-Shot-2016-01-19-at-16.33.19-e1453221254823.png)

For completeness, the code for the HTML and CSS files is shown below:

```XHTML
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <link rel="stylesheet" type="text/css" href="style.css">
  <title>PBS 7 - Demo</title>
</head>
<body>
<h1>PBS 7 - Demo</h1>
<p>In this demo we'll play around with styling some boxes.</p>

<h2>Some Nicely Styled Code</h2>
<p>So far in this series, we've not done any actual programming yet, but when we
do we'll learn the improtance of the JavaScript keyword <code>var</code>.</p>
<p>As we continue, even big snippets of code like the following will make
perfect sense to us:</p>
<pre class="javascript">
// automatically set the target to _blank on all links in articles
$(document).ready(function(){
  $('article a[href]').attr('target', '_blank');
});
</pre>
<pre class="perl">
use CGI;

# use the CGI module to return a redirect to the browser
my $q = CGI->new();
print $q->redirect(
  -location => 'http://www.bartb.ie/pbs',
  -status => 301,
);
</pre>
<h2>Some Nicely Styled Quotations</h2>
<blockquote>
  <p>Anyway, no drug, not even alcohol, causes the fundamental
  ills of society. If we're looking for the source of our troubles, we shouldn't
  test people for drugs, we should test them for stupidity, ignorance, greed and
   love of power.</p>
  <p class="author">- P.J. O'Rourke</p>
</blockquote>
<blockquote>
  <p>Giving money and power to government is like giving whiskey and car keys to
  teenage boys.</p>
  <p class="author">- P.J. O'Rourke</p>
</blockquote>
</body>
</html>
```

```CSS
/*
Styles for PBS7 Demo
*/

/* Set the default text style for the whole page */
body{
  font-family: Verdana, Geneva, sans-serif;
  text-align: justify;
  padding: 20px;
  margin: 0px;
}

/* Style headings */
h1, h2{
  color: #000099;
  font-weight: normal;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}
h1{
  font-size: 24pt;
  margin-top: 0px;
}
h2{
  font-size: 20pt;
}

/* configure the boxes for text blocks */
p, pre, blockquote{
  margin-top: 1em;
  margin-bottom: 1em;
  font-size: 12pt;
}

/* style code blocks */
code, pre{
  border: 1px solid #000099;
  color: #000099;
  font-family: "Andale Mono", "Courier New", Courier,  monospace;
  background-color: #e5e5ff;
}
code{
  border-radius: 5px;
  padding: 1px;
}
pre{
  border-radius: 10px;
  padding: 10px;
  background-repeat: no-repeat;
  background-position: center;
}
pre.javascript{
  background-image: url(background-javaScript.png);
}
pre.perl{
  background-image: url(background-perl.png);
}

/* style quotations */
blockquote{
  font-family: cursive;
  border: 1px dotted #333333;
  border-left: 5px solid #333333;
  border-top-left-radius: 0px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 0px;
  color: #333333;
  background-color: #F0F0F0;
  padding: 10px;
  margin-left: 0px; /* override the default left indent */
  margin-right: 0px; /* override the default right indent */
  font-style: italic;
}
blockquote p.author{
  font-style: normal;
  font-weight: bold;
  text-align: right;
  margin-bottom: 0px;
}
```

## Interrogating CSS Properties With The Browser

All modern browsers, even Microsoft’s new Edge, now include developer tools that can be used to interrogate a web page and get the active CSS properties for any given tag, and, to see the details of every box on the page. In Safari, you need to enable the developer tools in the `Advanced` tab of the preferences window:

![Safari Enable Developer Tools](../assets/pbs7/Screen-Shot-2016-01-18-at-10.44.11.png)

Because FireFox is cross-platform, that’s the one we’ll demo in this series, but like I say, all modern browsers have the ability to do the same kinds of things, just in slightly different ways.

In FireFox, you’ll find the various developer tools under `Tools`, `Web Developer`:

![FireFox Developer Tools](../assets/pbs7/Screen-Shot-2016-01-19-at-16.50.15-e1453222286203.png)

For today, what we want is the web inspector (`Tools`, `Web Developer`, `Inspector`):

![FireFox Developer Tools Web Inspectror](../assets/pbs7/Screen-Shot-2016-01-19-at-17.02.56-e1453223192795.png)

This will add new interface to the bottom of the browser window with two panes – one showing the HTML tags in the document, and one showing info about the currently selected tag. To see a tag’s box, just hover over it in the right pane, to see its properties, click on it. In the left pane, where the properties are shown, there are tabs to control what properties you see. The two that are of interest to use at the moment are Rules, which show all the CSS definitions in our stylesheets that apply to the selected tag, and Computed, which shows the rules that have been applied to the tag when all the cascading of styles and calculations of specificity have been done.

![FireFox Web Inspector](../assets/pbs7/Screen-Shot-2016-01-19-at-17.11.42-e1453223585271.png)

This interface makes it much easier to debug your CSS, and will become even more valuable in the next instalment when we look at using CSS to position elements within a page.
