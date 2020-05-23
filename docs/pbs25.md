# PBS 25 of x – A Case Study (bartificer.linkToolkit.js)

This instalment is a little unusual – rather than learning new topics, and then demonstrating them with a few simple examples, we’re going to look at a real world JavaScript API, see how it works, and in so doing, reinforce what we’ve already learned and expand our knowledge a little.

The library we’ll be examining is [bartificer.linkToolkit.js](https://github.com/bbusschots/bartificer_linkToolkit_js), a small open source library I released over the weekend. This library bundles some functions for manipulating links in HTML documents. The two main functions of the library are to ensure that links with a target of `_blank` also specify a `rel` of `noopener` (for security reasons), and to automatically make links leading out of the site open in a new tab, denoting that fact with an icon appended to the end of the links. You can see the library in use right here on this page!

We’ll be looking at the library from three points of view – the actual JavaScript code, the JSDoc comments, and the documentation produced from those comments and project management.

## Matching Podcast Episode 465

Listen Along: Chit Chat Across the Pond Episode 465

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_11_22.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_11_22.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## The JavaScript

I didn’t write this library with the intention of using it in this series. I wrote it to do a job that needed doing – I needed a `noopener` fix for this site (and others). I’ve been meaning to implement nice external links for ages. I did not make any sort of effort at all to limit myself to JavaScript features we have covered here. Despite that fact, there is only one line of code in the entire library that does something we’ve not talked about in this series. That line is only used for debugging, not for implementing the actual core features.

Let’s start by looking at how the library is used right here on this site. If you view the source of this page, you’ll find the following within the `head` tag:

```html
<!-- Include and use Bartificer Link Toolkit -->
<script type="text/javascript" src="https://www.bartbusschots.ie/s/wp-content/themes/blue-zinfandel-squared-bart/contrib/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="https://www.bartbusschots.ie/s/wp-content/themes/blue-zinfandel-squared-bart/contrib/URI-1.18.1.js"></script>
<script type="text/javascript" src="https://www.bartbusschots.ie/s/wp-content/themes/blue-zinfandel-squared-bart/contrib/bartificer.linkToolkit.js"></script>
<script type="text/javascript">
  // fix links after the DOM becomes ready
  $(function(){
  	// add rel=noopener to all links with a target of _blank on the entire page
    bartificer.linkToolkit.noopenerFix();

    // externalise all external links in the content region
    bartificer.linkToolkit.autoExternalise(
      $('#contentmiddle'),
      {
      	iconExternal: false,
        ignoreDomains: ['bartb.ie', 'www.bartb.ie']
      }
    );
  });
</script>
<style type="text/css">
  /* style external link icons*/
  #contentmiddle img.bartificer-externalLink{
  	border-width: 0px;
  	margin: 1px;
  	vertical-align: text-top;
  	height: 1em;
  }
</style>
```

The first function call injects a `rel` of `noopener` into all links that have a `target` of `_blank` and lead outside the site, regardless of where they appear in the page. This deals with the noopener security vulnerability.

The second function call adds a `target` of `_blank` and a `rel` of `noopener` to all links that lead out of the site and are located within the main content region of the pages. It also injects an icon after all such links. To facilitate styling, all altered links also get the CSS class `bartificer-externalLink`.

The CSS style definition makes sure the icon looks good.

Let’s now have a look at the code. If you download the library from GitHub, or if you view the files on GitHub, the entire library is contained within the file `lib/bartificer.linkToolkit.js`. That is the only file you need to add to your website to use the library (assuming you already have [jQuery](http://jquery.com) and [URI.js](https://medialize.github.io/URI.js/) included).

Looking at this file, I’d like to draw your attention to a few things:

1.  The library uses the self-executing function design pattern described in [instalment 24](https://pbs.bartificer.net/pbs24)
2.  The library uses closures to make private variables and functions truly private – i.e. inaccessible from the global scope.
3.  The library uses the convention of naming private variables and functions with a leading underscore.
4.  The library makes heavy use of the ternary operator when initialising optional arguments.
5.  There is a consistency in the arguments accepted by the various public functions.
6.  Names containing words that are spelled differently in the US and the UK are aliased; so both spellings will work.

## The JSDoc Comments

In basic structure the JSDoc comments in this library look like those we saw in [the previous instalment](https://pbs.bartificer.net/pbs24). However, I do use some tags we’ve not covered yet and some more advanced syntaxes with some tags we have already seen.

Notice that all variables and functions get a doc comment, even the private ones. These comments are not for users of the library, but for developers, i.e. for me! The `@private` tag is used to signify that the variables and functions in question are private. The `@inner` tag is also used to signify that the variables and functions are defined within our namespace and do not exist outside of it.

Near the top of the document we also define custom types which we then reference in `@param` and `@returns` tags throughout the file. This allows me to avoid a lot of tedious repetition.

Most of the public functions accept a plain object containing an arbitrary number of optional configuration keys as a second argument. Each of the possible keys in this object are documented separately using additional `@param` tags, where the name takes the form of the name of the object, then a period, then the name of the key. The `@param` tags for all the optional config keys specify their default values, making it clear how the library will behave when any particular key is not specified.

The configuration for turning the JSDoc comments into a documentation website is contained in the file `jsdoc.conf.json`.

## The Test Page

Testing is a very important part of the development process. We’re all human. We all make mistakes. So our code will have bugs. While developing the library, I also built up a test page which is in the repository as `test/index.html`.

This test page is designed to be run from localhost. To play with it, download the project form GitHub as a zip file (click the green button labeled _Clone or download_ on the [project’s home page](https://github.com/bbusschots/bartificer_linkToolkit_js), then choose _Download ZIP_) and extract the file. The zip file should extract to a folder named `bartificer_linkToolkit_js-master` – copy this entire folder into the document root folder of your local web server. Assuming your server is running, you should then find the test page at `http://localhost/bartificer_linkToolkit_js-master/test/`. The test page contains buttons for the important public functions in the library. When you click the buttons, the function will be applied to the relevant section of the page with debugging enabled. So you’ll see detailed output in the web console.

## Project Management

To make management of the project easier, I use the Node Package Manager, `npm` to install all the needed dependencies for building the various outputs, and to define and run the various build tasks. The configuration for NPM is stored in the file `package.json`.

This is a very simple project. There are actually no dependencies for the code itself, only for some development tasks. Hence, the project file only defines two dependencies. Both are listed as dev dependencies. The two dependencies are JSDoc, for generating the documentation, and the [Minami JSDoc theme](https://www.npmjs.com/package/minami).

Being a pure JavaScript library, there is no code to compile. So there are actually very few build tasks – just two in fact, one to generate the public documentation, and one to generate the developer documentation. The commands to carry out these two tasks are defined in the `scripts` section of the file.

To see npm in action, open a terminal and change into the `bartificer_linkToolkit_js-master` directory you downloaded and extracted earlier. If you don’t already have [Node](https://nodejs.org/) installed, do so before proceeding.

Because the folder contains a file named `package.json`, all you have to do to install the two required packages is run the command:

`npm install`

We can now run the tasks defined in the scripts section of `package.json` using the `npm run` command.

To build the public documentation, execute the command:

`npm run generate-docs`

To build the developer documentation, execute the command:

`npm run generate-docs-dev`

A new folder will now be created named `docs-dev`. In this folder you will find a version of the documentation that describes all the private variables and functions as well as the public ones.

## Final Thoughts

Hopefully you found this break from the norm helpful.

In the next instalment we’ll be returning to business as usual, starting with a solution to the challenge set at the end of [instalment 24](https://pbs.bartificer.net/pbs24).
