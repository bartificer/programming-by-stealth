---
title: Linkifier — a Javascript CLI App
instalment: 19
creators: [bart, allison]
date: 2026-08-01
---

TO DO

## Matching Podcast Episode

TO DO

## Context

When evangelising this series I always say that the ability to code is *empowering* because it lets you scratch your own proverbial itch — you need the computer to do something for you, if you can code, you should be able to make that happen!

This tidbit describes an open source command line app I developed because I had a problem I needed to solve, and I figure it might be of use to others too. What makes it particularly relevant is that I wrote this command line app in Javascript, demonstrating just how versatile a language it really is!

### The Itch I Needed to Scratch

I regular produce news-related podcast content — the month's Apple News for Let's Talk Apple, and the most important cybersecurity news for regular folk for the two-weekly Security Bits segments on the NosillaCast.

The notes for these shows are, for a large part, nested lists of links to news stories with additional commentary and context.

I spent a lot of time thinking about the best way to format those links. I wanted to:

1. Make it clear what parts of the text are from the linked source
2. Who the linked source is

I eventually settled on the following format: `STORY HEADLINE — domain.name/…`. For example:

*  The most recent Let's Talk Apple Episode: [LTA 154: June 2026 — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154) (at the time of writing this tidbit!)

I wrote my notes in Markdown, so that means I need to create hundreds of links that looks like:

```markdown
[LTA 154: June 2026 — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154)
```

Creating one or two links of this format manually is not that difficult, but creating hundreds, that's extremely tedious!

My first approach was to write a Javascript-based TextExpander shortcut that read a URL from the clipboard, then parsed the URL and produced a stub entry like:

```markdown
[ — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154)
```

This snippet even used TextExpander's functionality to move the cursor to put the insertion point after the opening `[`, ready for pasting in the headline.

This turned link creation into a two-step process:

1. Open the web page
2. Copy the URL and insert it into the show notes with the TextExpander shortcut
3. Copy the headline, and paste that into the notes to complete the link

Better, but still two steps for each link.

What I really wanted was a mechanism could get me straight from a URL to a headline, and so, the Linkifier tool was born!

The initial version of the tool used the following basic process:

1. Read a URL from script arguments
2. Download the HTML for the page at the URL
3. Parse the downloaded HTML to extract the text from the  `<title>` tag, all `<h1>` tags, and all `<h2>` tags
4. Apply the rule for the URL's domain to extract the headline from the appropriate tag

This is more complex than you might expect, because different sites structure their HTML very differently! You might imagine the `<title>` tag would always have the best headline, but that usually has unwanted prefixes and post-fixes that need to be removed, and some are abbreviated! It may well be best practice to have the page's primary heading be the first `<h1>` tag on the page, but many sites don't do that, adding their site's title there instead. Sometimes the headline will be the second `<h1>`,  or maybe the first `<h2>`. It varies so much!

## How Linkifier Generates Links

So, we have this complex to problem to solve, how best to architect the code?

I spent a lot of time thinking about this, because I need this code to be very maintainable — new sites come and go all the time, and existing sites re-design their templates every few years too! I knew I was going to be re-configuring the extraction process for of my news sources quite regularly, so that had to be easy to do!

My brain work in an object-oriented way, so I started by building classes to describe the various moving parts. I ended up with three:

1. `PageData` — to represent the information extracted from the downloaded pages, primarily:
   1. `.url` — the page's URL
   2. `.title` — the  content of the `<title>` tag
   3. `.headings.h1[]` — an array with the content of all the `<h1>` tags, in order
   4. `.headings.h2[]` — an array with the content of all the `<h2>` tags, in order
   5. `.metadata` — a dictionary indexed by the standard SEO header names, e.g. `.metadata.author` for the text from the `content` attribute from the `<meta name="author">` tag
2. `LinkData` — to represent extracted information which can be used in rendering the link, primarily:
   1. `.url` — the URL to link to
   2. `.text` — the link text
   3. `.description` — optional additional description text
3. `LinkTemplate` — a template for converting `LinkData` objects into rendered links
   1. `.this.templateString` — a moustache template for rendering the link
   2. `.filters` — an optional list of filters to apply to each field, where the filters are simply functions that expect to be password one string, and will return a new string

These classes have grown a little over time, adding support for some more powerful features like custom fields, but let's not confuse things needlessly!

These three classes are a strong starting point — the process for generating a link now becomes:

1. Download the HTML and parse it into a `PageData` object
2. Somehow convert the `PageData` object to a `LinkData` object
3. Convert the `LinkData` object to the final link using a `LinkTemplate` object

That leaves one rather big piece of mystery meat — how do we convert an object containing all the possible sources for the desired headline into an object containing the **correct** headline?

My approach here was to lean into the fact that URLs have domain names, and that domain names are hierarchical, with `.` as the  *root* domain that encompasses all possible domain.

I would attach conversion logic to domain names, and then resolve the correct logic by checking the URL's domain name.

To explain the logic I implemented, imagine an unrealistically simplistic scenario where I define extraction logic for just two domain names:

1. `podfeet.com`
2.  `.` (the root domain)

Give that simple configuration, let's first try find conversion logic to use for URLs on the domain `www.podfeet.com`:

1.  Is there conversion logic defined for `www.podfeet.com` — **no**, so try the parent domain
2. Is there logic for `podfeet.com` — **yes**, so use it!

Now let's try find conversion logic for URLs on the domain `www.bartb.ie`:

1. Is there conversion logic defined for `www.bartb.ie` — **no**, so try the parent domain
2. Is there logic defined for `bartb.ie` — **no**, so try the parent domain
3. Is there logic defined for `ie` — **no**, so try the parent domain
4. Is there logic defined for `.` —  **yes**, so use it!

This demonstrates the two big advantages this approach brings:

1. It supports links with or without the usually optional `www` prefix, since `http://www.podfeet.com/…` gets treated the same as `http://podfeet.com/…`
2. It provides and easy way to define default logic for domains that don't have their own logic defined

Fundamentally, the configuration object is simply a dictionary that maps domain names to functions that expect a `PageData` object and return a `LinkData` object!

We now have the script's final logic:

1. Download the HTML code from the URL and parse it into a `PageData` object
2. Resolve the correct extraction logic from the configuration, and use it to convert the `PageData` object into a `LinkData` object
3. Covert the `LinkData` object to the output link using a `LinkTemplate` object

Simple!

## The AI Fly in the Ointment

The initial version of the script worked quite well, but it was just a script, not a full CLI, and it had some niggles.

None of those niggles were motivation enough to re-visit the tool, until that is, AI came along, and undermined the very foundation of the script's logic on site after site after site.

Step 1 had always been to download the page's HTML, and that part never gave any trouble, until AI. All those bots crawling the web started to overload web servers, so more and more sites started to implement bot-blocking logic, and my little script was being seen as a bot!

On ever site that blocked my script, I had to fall back to manually copying in the title 🙁

Initially it was just one or two sites, but the problem grew, and grew, and grew, and there never seemed to be an obvious solution. Until I realised that the sites that were blocking my script almost all contained the headlines in their URLs, all be it in *slugified* form!

For example, The Mac Observer use URLs like: `https://www.macobserver.com/news/iphone-18-pro-max-could-be-thicker-and-heavier-due-to-bigger-battery/`

This clearly contain the headline: *iPhone 18 Pro Max Could Be Thicker and Heavier Due to Bigger Battery*

It's just been re-formatted a little, and lost it's capitalisation.

Reversing this conversion might get to me near-perfect headlines that just needed some tweaks, so it was time to re-visit this code at last!

## Fixing the Niggles

Because the configuration was self-contained, the core code hadn't been edited in years. I was going to need to invest a lot of mental energy remembering the fine-grained detail before making any changes, so it seemed wise capitalise on that effort by fixing as many of my little niggles as I could while the code base was fresh in my mind.

The biggest niggle was that it was pre-ES6 Javascript code, so rather than using the new `class` keyword it used the old `prototype` syntax. Needless to say it also wasn't modularised, so I decided that the best way to reacquaint myself with the way the code works was to convert the code to a modern ES6 module.

That was a great plan, because once I got the code converted and working again, I knew exactly where in the process to hook in the needed new features. Speaking of which, what niggles did I choose to address:

1. *de-slugifying* URLs to give usable titles for sites that block scripts
2. Adding the ability to assign different templates to different domains (I want to use a different template for Apple's PR site than for regular news sites)
3. Adding the ability to extract additional data from the page on certain domain (making it possible to convert XKCD and NASA Astronomy Picture of the Day links to Markdown images)

Since I was so familiar with the codebase all these changes proved surprisingly quick and easy to implement. I guess my original design must have been relatively sound, since I didn't need to make any fundamental changes, just add more properties and functions to the existing classes.

### De-slugifying the URL

This proved to be both easier than I feared, and a lot more complex than I realised it would be. Getting something that worked fairly well most of the time was easy, but getting this to work really well almost all the time took a lot of effort!

As a first pass I knew this would be a two-step process:

1. Extract the words
2. Fix the case

I was quickly found good modules for doing both of these things:

1. [url-slug](https://www.npmjs.com/package/url-slug) for extracting the words
2. [title-case](https://www.npmjs.com/package/title-case) for fixing the case

I simply chained these tools together, and I soon had something that seems to work.

I tested my solution by generating some show notes, and a nice supply of real-world data soon showed all the cracks!

Some problems are simply impossible to fix because converting a title to a slug is an inherently lossy process. The most significant thing that gets lost is punctuation — all symbols and spacing characters get slugified to a `-`, so there's no way to reverse those back out. This has some annoying but unavoidable side-effects:

1. Punctuation commonly used in headlines like simple colons and commas are lost, becoming simply spaces
2. Currency symbols are lost
3. Formatted numbers get broken up, e.g. `1,001` becomes `1 001`, and so does `1.001`!

But other problems can be fixed with simple regular expressions, for example:

1. Acronyms like `NASA` get title-caesd to `Nasa`, but a regular expression can easily find and fit those. **However**, some acronyms can't be fixed, for example `US` for the United States is indistinguishable from the collective noun `us`!
2. Unusually capitalised words like `iPod` get title-cased to `Ipod`, but again, a regular expression can fix most of these
3. There is not universal agreement on which small words don't get a leading capital when title-casing, style guides and preferences vary. This can be fixed by passing your own custom list to the `title-case` module.

In the end the module was expanded to provide:

1. A default set of *small words*
2. A default set of common acronyms and unusually-cased words
3. A mechanism for costuming the set of *small words*
4. A configuration setting for providing custom set of capitalisation fixes

Because even these fixes are imperfect, I added a warning (in yellow) to let the user know that the link needed to be de-slugified, so they know to check the final result for little fixes.

## Building a Javascript CLI

Underlying all of my niggles was one master niggle — the fact that this was still a plain script, and not a full command line app.

This meant that the command I was typing into my terminal was actually three commands piped together:

1. `pbpaste` to output the current content of the clipboard
2. `node` with the path to the script
3. `pbcopy` to send the generated URL back to the clipboard

This is obviously a long command, and it had two frustrating side effects:

1. No matter how hard I tried to get rid of it, the final clipboard always contained a trailing newline character!
2. On each site where the download failed, the clipboard got overridden with an empty string, so I had to go copy it again to then manually create the link!

Clearly, I needed this to be a true CLI so I could just call it, have it load my configuration from a standard file name in my home directory (`~/.linkify-config.mjs`), read the clipboard, convert the link, and only write it back to the clipboard if the conversion was successful.

Since all the other works was simpler than expected, I decided to add a CLI while I was familiar with the codebase.

Rather than converting the ES6 module to a CLI, I chose to add the CLI as a separate wrapper around the module. This means the module can still be used within other Javascript code, so users can choose to integrate the logic into their own scripts by importing the module, or just use of my code directly by executing the CLI.

### Choosing a Platform

Using NodeJS, you can manually write a Javascript script that behaves like a CLI app, but that's extremely laborious, and involved re-inventing lots and lots of proverbial wheels.

A much better solution is to leverage a commonly used standard NodeJS module of some kind to handle the common logic all CLI apps need,  like parsing Linux-style command line arguments that support flaps and options like `-x` and `--thing=value`.

After spending some time in conversation with my favourite privacy-protecting chat bot (Lumo), and then exploring the websites various contenders, there really was only one good option for my scale of project — [commander.js](https://github.com/tj/commander.js).

This is a mature project that's MIT licensed, actively maintained, widely used, and currently shows 192 contributors. The documentation also looked sufficiently readable and detailed, so it seemed worth the mental investment to learn how to use this tool.

Thankfully, my judgement proved correct — working with Commander proved to be a real joy, and I had a feature-rich CLI interface wrapped around my new ES6 modules in just a few days.

Now, I can convert links by simply invoking the `linkify` command, and it will:

1. Read my configuration file to configure itself to my preferences
2. Read the URL from the clipboard, and echo it to the screen so I can see what it did (because my configuration file tells it to do both of those things)
3. Convert the URL using my templates and my extraction logic (defined in my configuration file)
4. Seamlessly fall back to de-sluggifying URLs when needed, and warn me when it does
5. Show me the final link (again, because my configuration tells it to)
6. Write the final link to the clipboard (again, because of my configuration)

Once I had a basic CLI working, I started to add some proverbial bells and whistles, most notably, support for coloured terminal output. This makes it easier to distinguish between informational messages like echoing the URL and generate link, and warning messages like the one indicating the need to fall back to de-slugification. 

I could of course have manually added the shell escape sequences for setting colours to my various output strings, but again, why re-invent that wheel!

After another conversation with my favourite AI, I eventually chose to use [Kleur](https://github.com/lukeed/kleur#readme). I had a few reasons for making this choice:

1. It has no dependencies, so it doesn't add more modules to my supply chain (a big cybersecurity concern these days 🙁)
2. It's small and light-weight
3. It\'s MIT licensed
4. It's commonly used

The syntax is also quite straightforward, for example:

```javascript
console.log(bold().red('this is a bold red message'));
```

## Final Thoughts

TO DO
