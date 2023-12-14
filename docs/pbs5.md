# PBS 5 of X – Images & Links

Up until now we’ve only encountered very simplistic HTML tags, and we have ignored the fact that many HTML tags can specify attributes. In this instalment we’ll look at two tags that require attributes – those for inserting images into pages, and those for inserting links into pages. Before we can look at the two tags in question, we need to lay two pieces of ground-work – we need to discuss attributes in HTML tags, and we need to discuss URLs, and particularly the difference between relative and absolute URLs.

## Matching Podcast Episode 418

Listen along to this instalment on [episode 418 of the Chit Chat Across the Pond Podcast](http://www.podfeet.com/blog/2015/12/ccatp-418/)

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2015_12_28.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2015_12_28.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Understanding URLs

HTML is the _HyperText Markup Language_, so what makes text _hyper_? The answer is links. A text document has a beginning, middle, and end, while a collection of hypertext does not. Hyper text contains jumping off points where you can leap from one piece of text to another; in other words, hypertext is linked. There is no beginning, middle, or end of the world wide web – it’s just a collection of web pages that link to each other. Reading a news article that contains a link to a wikipedia article that contains links to related terms is what hypertext is all about.

The thing is – in order to link someone to something, you have to have a way of addressing it. Within our computer we use our local file system to address files. If you say that your essay is in `C:\My Files\My Important Essay.txt`, or `/Users/bart/Documents/My Important Essay.txt`, there can be no doubt where that is on your computer. The world wide web does not exist within a single computer though; so a different addressing scheme had to be devised, one that extends beyond any single computer, and allows data to be addressed anywhere on the world wide web.

The solution was the _Uniform Resource Locator_, or URL.

### Absolute URLs

A so-called _absolute URL_ is a complete URL, and it specifies a number of parts:

1.  The protocol that should be used to access the data, also known as the _URL Scheme_ – on the world wide web that’s usually `http` or `https`.
2.  The server hosting the data, either as an IP address or a DNS name – often referred to as the _host_.
3.  Optionally, a port number can be specified. This is only needed if the host is serving the content on a non-standard port, that is to say, if the host is using HTTP on a port other than 80, or HTTPS on a port other than 443.
4.  The path to the desired data on the host. The path is a series of zero or more names separated by `/` characters. This looks like a Unix/Linux file path, but shouldn’t be confused with one. Every web server gets to interpret these paths any way it wishes. The path can be empty.
5.  An optional query string – this is a mechanism for passing information between browsers and servers, and something we’ll ignore for now. It will become important later in the series though. So we’ll learn about it then.
6.  Finally, a URL can optionally contain a fragment name – a way of specifying a specific section within a page.

All these parts are composed into a URL as follows – the underlined sections are placeholders, and the bold sections are required for valid absolute URLs:

<code>
<ul style='list-style-type: none'>
    <strong>
      <u>scheme</u>
      ://
      <u>host</u>
    </strong>
    :
    <u>port</u>
    <strong>/</strong>
    <u>path</u>
    ?
    <u>query</u>
    #
    <u>fragment</u>
</ul>
</code>

In code as:
```
scheme://host:port/path?query#fragment
```

So, the shortest valid absolute URL would look something like:

```
http://localhost/

```

This breaks down as:

1.  The URL scheme `http`
2.  The host `localhost`
3.  No port specification
4.  No path
5.  No query string
6.  No fragment name

We could add a file path of `myFolder/myFile.html` as follows:

```
http://localhost/myFolder/myFile.html

```

And we could add a fragment name of `section1` as follows:

```
http://localhost/myFolder/myFile.html#section1

```

### Special Characters in URLs

The data within URLs can only contain a small set of very basic characters: digits, unaccented characters, dashes, dots, and underscores. Other characters can be specified, but they have to be _URL encoded_ – that is to say, replaced with a percentage sign followed by a two-digit hexadecimal code. When using the UTF-8 character encoding (the default in HTML 5, and the encoding used in this series) some single special characters are replaced with multiple hex groupings. You’ll find a good list of the encodings [here](http://www.w3schools.com/tags/ref_urlencode.asp).

The encoding for the space character is `%20`, but because it’s so common, the URL specification allows for a simpler shortcut – spaces in URLs can be encoded simply as `+`. In other words, the following two URLs are equivalent:

```
http://localhost/My%20Folder/My%20File.html
http://localhost/My+Folder/My+File.html

```

URL encoding is required in the path, query string, and fragment components of a URL.

### Apache & URL Paths

Every web server is free to interpret the path part of a URL in any way it wishes. In this series, the recommended server software suite is MAMP, and the `A` in MAMP is for Apache. In other words, if you are following along using the suggested setup, you are using an Apache web server; so paths will be interpreted in the default Apache way.

Apache interprets the path part of URLs as a file path relative to its configured document root folder.

If the path part of a URL maps to a folder rather than a file within the document root, Apache looks for a so-called _index file_ within that folder, and uses that to represent the folder. Apache will search through an ordered list of special file names to find an index file, and use the first one it finds. If none of the special files exist within the folder, Apache will return some simple HTML representing a listing of the files in the folder.

The default Apache config included in MAMP specifies just two special filenames to try – `index.html` first, then `index.php`. This is why we have been calling our sample files `index.html` in all our instalments.

Most web servers behave in a similar way by default, though the exact list of default index file names varies. Many servers will also include `index.htm` for example.

### Relative URLs

If all URL specifications were absolute, they would need to be changed each time a HTML file moved from one web server to another, or even from one folder to another. This would make things very difficult for web programmers, and make portable HTML code impossible.

This is where relative URLs come in. They allow HTML to specify URLs relative to the URL of the currently loaded page. Exactly what part of the URL they are relative to is determined by the first character of the relative URL. We will look at three variants of relative URLs:

1.  **URLs relative to the path** – URLs that do not start with a URL scheme, a `/`, a `?`, or a `#` are interpreted as being relative to the current URL path. I.e. the URL scheme, host, and port are assumed to remain the same, and the remainder of the URL is recalculated based on the relative URL.

    A relative URL of `My+Other+File.html` on a page with the URL `http://localhost/My+Folder/My+File.html` is interpreted as `http://localhost/My+Folder/My+Other+File.html`

    URLs relative to the path can use `..` to represent the parent folder, so a relative URL of `../Some+File.html` on a page with the URL `http://localhost/My+Folder/My+File.html` is interpreted as `http://localhost/Some+File.html`

2.  **URLs relative to the host** – URLs that are relative to the host start with a `/`. The URL scheme, host, and port are assumed to be the same as the current URL, the path, query string, and fragment are taken from the relative URL.

    A relative URL of `/My+Other+Folder/` on a page with the URL `http://localhost/My+Folder/` is interpreted as `http://localhost/My+Other+Folder/`.

3.  **Local Fragments** – URLs that start with a `#` are interpreted as being references to fragments within the current page. That means the URL scheme, host, port, path, and query string are preserved.

    The relative URL `#section1` on a page with the URL `http://localhost/My+File.html` is interpreted as `http://localhost/My+File.html#section1`. Note that the same relative URL on a page with the URL `http://localhost/My+File.html#section2` will also be interpreted as `http://localhost/My+File.html#section1`.

## HTML Tag Attributes

A HTML tag attribute has a name and a value. Only officially defined attribute names should be used. The values should meet the requirements defined in the specification. Some attributes can have any arbitrary value, including no value at all, while others must contain a URL, or a number, or some other specific type of information.

Attributes are specified within opening and void tags only. They go after the name of the tag, and the name and value are separated by an `=` character. The value must be contained within a pair of `"` characters. Tags can specify multiple attributes.

The generic form of a tag with two attributes would be:

```
<tag_name name1="value 1" name2="value 2">Tag contents</tag_name>
```

## HTML Images

The tag for inserting an image into a HTML page is `<img />`. This is a void tag, and requires a number of attributes.

So far we have encountered block-level tags like paragraphs and headers, and inline tags like emphasis and code. Most tags fall neatly into one of these two categories, but there are a few oddball tags that don’t – the `<img />` tag is one of these oddballs. It’s a so-called inline-block tag. Images are effectively treated like giant characters, and inserted into the document accordingly.

Using CSS, it is possible to make images behave in different ways. So we’ll revisit the positioning of images in a future instalment.

`<img />` tags require two attributes, and there is a third optional one that I also want to mention:

<dl>
<dt><code>src</code></dt>
<dd>The URL of the image to include (can be relative or absolute)</dd>

<dt><code>alt</code></dt>
<dd>Alternative text describing this image. This is the text that will replace the image in text-only browsers and screen readers for the visually impaired. The attribute is not technically required, but leaving it out is exceptionally bad form; so consider it required. Also, be sure to always use useful alt text – <em>‘logo’</em> is useless alt text. <em>‘Podfeet Logo’</em> is useful alt text.</dd>

<dt><code>title</code></dt>
<dd>This optional attribute can be used to specify text that should be displayed as a tooltip when the user hovers their mouse over the image. This is not the same thing as alt text. It exists to allow extra info for users be specified, not to tell screen readers what the image is. All images should have alt text, but only some images need titles.</dd>
</dl>



### Specifying Widths and Heights

A web browser cannot know how big an image will be until it has been downloaded. This means that, when it’s rendering the page, it doesn’t know how big or small a gap to allow for it. That means the browser has to guess, and then reflow all the content on the page when it knows how big the image really is. This is inefficient.

You can help the browser by telling it what size the image will be within the `<img />` tag. This is done using the `width` and `height` attributes, the value of which must be positive integers representing the appropriate dimension in pixels.

<!-- vale Vale.Repetition = NO -->

In the past, when our bandwidth and CPU power were much much lower, the use of `width` and `height` attributes was very important. Users would notice real speed improvements on websites that used them compared to websites that didn’t. Now that most of us have really fast internet access, and now that our CPUs are so much more powerful, the use of these attributes no longer has a noticeable effect on page load times in most real world scenarios.

<!-- vale Vale.Repetition = YES -->

The `width` and `height` attributes can also be used to scale an image. If an image is actually 300 pixels across, you can render it half-size by specifying a width of `150`. If you only specify one dimension, images are scaled proportionally, but if you specify both, they are stretched to fit into the defined rectangle.

Be very careful about scaling images in this way – it’s very bandwidth inefficient. If you have a massive 5MB image, and you show it as a small thumbnail by specifying a small width and/or height, you are wasting a lot of bandwidth. In general it’s better to create small versions of images using an image editing app rather than scaling images with the `width` and `height` attributes.

### Worked Example:

Because image files are required to make this example work, I’ve created a zip file containing both the HTML file and the referenced images. You can download it [here](https://www.bartbusschots.ie/s/wp-content/uploads/2015/12/pbs5a.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs5a.zip), and then place the three files contained in the zip file into a folder called `pbs5a` in your web server’s document root folder.

For simplicity I’m also including the content of `index.html` here:

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 5 - Image Example</title>
</head>
<body>
<h1>PBS 5: Example 1 - Images</h1>

<p>Because images are treated as inline blocks, you can use them to insert cute
little smilies right into your text
<img src="smiley.png" alt=":)" width="16" height="16" /></p>

<p>Below is an example of a larger image. This one uses a tooltip to specify
some additional information about the image.</p>

<p><img src="photo.jpg" alt="A Landscape Photo" title="Copyright Bart Busschots 2014" width="640" height="424" /></p>
</body>
</html>
```

Once the files are in place, and your web server is started, you should be able to view the page at the URL `http://localhost/pbs5a/`, and it should look something like:

![PBS Example 5a](../assets/pbs5/Screen-Shot-2015-12-27-at-16.44.01-e1451234706706.png)

## Links & Fragments/Anchors

Rather confusingly, the same tag is used to define named fragments within a page, and to create links to other URLs. Even more confusingly, the tag is the `<a>` tag. In this case `a` stands for _anchor_, but that’s not actually much help!

The attributes specified determine whether a specific instance of the `<a>` tag is defining a named fragment or a link.

### Links

To add a link to a page, use the `<a>` tag with the `href` attribute. The content of the `<a>` tag will become the linked text, and the `href` attribute should specify the URL to link to. The URL can be absolute or relative.

The basic form of a link looks like this:

```html
<a href="a_url">the link text</a>
```

It’s possible to add tool-tip text using the `title` attribute.

It’s also possible to request that the browser open the link in a new window using the attribute and value `target="_blank"`. Exactly what will happen when this kind of link is clicked is determined by the browser. Modern browsers tend to open such links in new tabs.

### Named Fragments (AKA Anchors)

Optionally URLs can specify a named location within a page to jump to. This is known as a URL fragment, and is specified at the end of the URL with the `#` character. This is useful in very large documents with many sections. These fragments are also known as `anchors`, hence the name of the `<a>` tag.

Anchors are created using the `<a>` tag with the `name` attribute. When creating anchors, the `<a>` tag usually has no content, but because it is not a void tag, it must still be written with a closing tag.

To define a URL fragment with the name `section1` you would add the following tag into the document just before the header for section 1:

```html
<a name="section1"></a>
```

### Links and Anchors Example:

Again, because the example involves multiple documents, I have zipped the files up and you can download them from [here](https://www.bartbusschots.ie/s/wp-content/uploads/2015/12/pbs5b.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs5b.zip). Extract the zip and copy the two files it contains to a folder called `pbs5b` in your web server’s document root.

For convenience, the contents of the two HTML files is included here:

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS 5: Example 2 - Links and Anchors</title>
</head>
<body>
<h1>PBS 5: Example 2 - Links &amp; Anchors</h1>

<a name="absolute" />
<h2>Absolute Links</h2>

<p>Links can contain absolute URLs,
<a href="http://www.bartb.ie/" title="Bart's Site" target="_blank">like this one
to my home page</a>. Notice that that link opens my home page in a new
window/tab.</p>

<a name="relative"></a>
<h2>Relative Links</h2>

<p>Relative Links comes in many different forms.</p>

<p>Relative links can be relative to the host. For example, assuming you didn't
delete the files, I should be able to link relatively to the example from the
first installment - <a href="/pbs1/">PBS1 Example</a>.</p>

<p>Relative links can also be relative to the path. For example,
<a href="anotherFile.html">this link</a>
goes to another file in the same folder.</p>

<p>Relative links can also point to fragments or anchors within the current
page. I've included anchors at the start of each section in this page, so the
following relative link will jump your browser to <a href="#fragments">the
section on Anchors/Fragments</a>.</p>

<a name="fragments"></a>
<h2>Fragments/Anchors</h2>

<p>Imagine this is a big report about something. It will be broken into
sections, and users would probably like an index at the start of the document,
and the would like to be able to click on the names of the sections to jump to
them. This can be done with named fragments/anchors.</p>

<h3>Index</h3>
<ul>
  <li><a href="#sec1">Section 1 - Some Gibberish</a></li>
  <li><a href="#sec2">Section 2 - Some More Gibberish</a></li>
</ul>

<a name="sec1"></a>
<h3>Section 1 - Some Gibberish</h3>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

<a name="sec2"></a>
<h3>Section 2 - Some More Gibberish</h3>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

</body>
</html>
```

```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>PBS5: Example 2 - Another File</title>
</head>
<body>
<h1>Another File!</h1>

<p>Welcome to Another File!</p>

<p><a href="index.html#relative">Click here to jump back to the right section in
the real example file</a>.</p>

</body>
</html>
```

## Final Thoughts

We have now covered the basics of HTML. We can create documents with properly marked up content, correctly marking sections of text as headings, paragraphs, lists, etc.. We are now ready learn about using CSS to style our documents.

Once we’ve learned the basics of CSS, we’ll be revisiting HTML to learn about some more tags we’ve ignored for now. The reason we’ve ignored these tags on our first pass through HTML is that their usefulness is not obvious until you know about CSS.
