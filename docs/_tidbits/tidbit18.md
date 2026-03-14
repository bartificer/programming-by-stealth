---
title: A Real-World Jekyll Example
instalment: 18
creators: [bart, allison]
date: 2026-03-14{}
---

It's not a coincidence that we spent the second half of 2025 covering covering website hosting on GitHub Pages for first client-side web apps like XKPasswd, and then traditional websites built manually or with static site generators like Jekyll My motivation was simple — I wanted to migrate the website for my podcasts from WordPress to GitHub Pages, and the second-best way to truly learn something is to try to teach it. What's the best way to learn? By doing! And that's what I spent January doing.

Over three weeks, I built an entirely fresh website for my shows and published it at [www.lets-talk.ie](https://lets-talk.ie). That proved to be quite the experience, so I thought it was worth sharing as a Tidbit.

## Matching Podcast Episode

TO DO

## Context

As summarised in the introduction, as we record this instalment in March 2026, we're paused between the first and second halves of a mini-series dedicated to building websites on GitHub Pages. We started with an explanation of the concept of a static site generator (instalment 175), then quickly described how to publish Javascript web apps like those we have built earlier in the show's history (instalment 176), before diving in to the detail of the Static site Generator GitHub Pages uses by default, [Jekyll](https://jekyllrb.com). 

So far our exploration of Jekyll on the practicalities of building a basic website with our own custom layouts and style built with [Bootstrap 5](https://getbootstrap.com/docs/5.2/getting-started/introduction/). Specifically, we explored Jekyll's build process for converting folders of Markdown files with YAML front matter into HTML+CSS+JavaScript websites. Wre learned about the Jekyll configuration file, its folder structure, and how to control the look of a site using Jekyll layouts, Jekyll variables, the Liquid templating engine, and the [SASS](https://sass-lang.com) CSS pre-processor (*Syntactically Awesome Style Sheets*). To capitalise on our existing knowledge, we looked at how to integrate Bootstrap deeply into Jekyll, allowing fine-grained customisations. 

The focus was entirely on **how** to crating the scaffolding for a website, but we all but ignored all questions of content organisstion. we barely mentioned concepts like data architecture and taxonomies. That will be the focus of the up-coming second half of the series.

Writing existing instalments was the perfect preparation for my big January project. Had I not written instalments [175](./pbs175) up to and including [181](./pbs181), I would never have succeeded. But equally, without having done that work, I'd really have struggled to start writing the second half of the series.

## Building the New Let's Talk Podcasts Site

### The Practicalities

I chose to target my site at the standard GitHub Pages version of Jekyll, not the newest 4.x branch. Why? To keep things simple and avoid the extra complexity of maintaining my own GitHub action for building the site. As we learned in [instalment 177](/pbs177), out-of-the-box GitHub Pages uses Jekyll 3.x, so if you want to use anything else, you need to teach GitHub how to build your site.

Since the podcasts and this series are all
completely listener supported, I chosen to make the GitHub repository powering the site public. This means you can all see the code and the various configuration files powering the site at [github.com/bartificer/www.lets-talk.ie](https://github.com/bartificer/www.lets-talk.ie).

For deploying a local version of the site for testing and debugging I chose to use Docker (as so expertly explained by Helma in [TidBit 17](./tidbit17), rather than the more complex and traditional local install described in instalment TO DO. In fact, I used Helma's bells-and-whistles Jekyll example from tidbit for the site. You can see my Docker configuration files in the base of the site's GitHub repo.

I chose to build the theme using [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/) as my base, and in preparation for this project. I also commissioned the excellent app development and design firm [IconFactory](https://iconfactory.com) to develop updated logos for the podcasts and a corporate style guide for Bartificer Crestions in general. This style guide is not a CSS style sheet, but a descriptive document that be be applied to any and all content I produce. it includes a full colour palette, and detailed typographic definitions for headings, subheadings, body text, etc..

For me, graphic design and typography are like wine — I know what's bad, I know what's good, I know what I like, but I have no idea how to make my own! So, rather than spending weeks struggling to develop a style I'd never quite be happy with, I chose to pay skilled craftspeople whose work I like to do it for me 🙂

While the brief for the corporate style guide was broad, with the intention of using it for all Bartificer Creations' stationery, presentations, and websites, it was also explicitly designed to align with Bootstrap's approach to colours, and the font choice was limited to free fonts available via [Google Fonts](https://fonts.google.com) so they would all work on the web. So the style guide is not purely for Bootstrap, but it was designed to be easily applied to Bootstrap.

Finally, I used the free version of [Font Awesome 7](https://fontawesome.com/#fa7) for the various little icons needed throughout the site.

### The Things that Went as Expected

In many ways, the most interesting lessons came from the unexpected surprises, so we'll spend most of our time on those, but before we do, I just want to quickly recognise the things that actually went to plan.

1. Bootstrap 5 provided the scaffolding I needed to stuctue the site's pages using+ only their standard features and components:
   1. Bootstrap's [grid layout](https://getbootstrap.com/docs/5.0/layout/grid/) with [breakpoints](https://getbootstrap.com/docs/5.0/layout/breakpoints/) made it easy to make the site completely responsive — it scales elegantly from the smallest phone screen to the largest desktop display.
   2. The navigation is all built using Bootstrap [NavBars](https://getbootstrap.com/docs/5.0/components/navbar/) with [Dropdowns](https://getbootstrap.com/docs/5.0/components/dropdowns/), [Buttons](https://getbootstrap.com/docs/5.0/components/buttons/), some grouped into [Button Groups](https://getbootstrap.com/docs/5.0/components/button-group/), and [Breadcrumbs](https://getbootstrap.com/docs/5.0/components/breadcrumb/).
   3. Bootstrap [cards](https://getbootstrap.com/docs/5.0/components/card/) are used throughout the site to collect little modular pieces of content — for example, the episode lists are implemented as cards in a [Grid card](https://getbootstrap.com/docs/5.0/components/card/#grid-cards) layout.
2. Our discussions on Jekyll Layouts and Liquid Templates were detailed enough that I rarely needed to go beyond the features in our PBS examples. When I did need more, I found our explorations had armed me well enough to get what I needed from the documentation with minimal effort.
3. In terms of the **basics**, using SASS variables to customise Bootstrap worked just like I thought it would. Within just a few minutes, I had successfully configured Bootstrap to use the custom colours and fonts from my corporate style guide. But notice the little qualifier at the start; put a pin in that for later!
4. Customising my OpenGraph metadata proved as rewarding as I'd hoped it would — when I share episode links on social media, they look better than ever now! As an example, here's the Mastodon post announcing Let's Talk Photo episode 149 — [social.bartificer.ie/…](https://social.bartificer.ie/@ltpod/116109296418516823#)

### The Unexpected Surprises

I'd put a lot of work into preparing for this project, so I was happy I'd dealt with the known-unknowns (other than those forgotten redirects 😉). But we're dealing with computers here, so it seemed inevitable I'd bump into some unknown-unknowns. Sure enough, there were indeed some things I didn't know that I didn't know I needed to know!

#### 1 — Customising Bootstrap has Changed Significantly Since Version 4 — I needed to Learn CSS Variables

The last version of Bootstrap I'd customised before this project was version 4, to build this very PBS website, as it happens! I assumed I'd just do the same thing again, but there was of course more to it than that!

Firstly, Bootstrap 5 is substantially more customisable than Bootstrap 4, and you can now think of those customisations as being two-layered, making SASS optional for quite some types of customisation.

Bootstrap's final CSS file is built from a collection of SASS files, which get compiled down to CSS. Deeply customising Bootstrap still requires working with SASS to alter the generated CSS, just like before. However, that generated CSS now provides an entirely new avenue for many kinds of customisations — CSS variables.

I've been avoiding CSS variables for many years, because when they first came out, browser support was patchy at best. That's just not true in 2026! IE is now totally and utterly dead, and thanks to the push for better cybersecurity, it's now utterly reasonable to assume that all browsers are modern. So, CSS variables have arrived at the *they just work* stage of their evolution.

Had I been working with Bootstrap 5.0, 5.1, or 5.2, I could have simply ignored these new CSS variables and done all my customisations with SASS, just like before. But version 5.3 changed that.

To add some very nice extra functionality to common components like dropdowns and navbars, Bootstrap 5.3 added the concept of themes for certain Bootstrap components, including navbars. I'm not actually making use of this new feature, but its existence made it impossible for me to customise my site's navbar purely with SASS. I needed to use CSS variables to get the navbar to look right, so I finally took the time to learn how they work.

The good news is that CSS variables are both wonderfully powerful, and quite simple. So, I soon got the hang of them. This proved to be a real boon later in the project when they opened up some very useful opportunities for finessing some of my more bespoke compartments. The best example being the subtle accent colour on the podcast episode lists for each show — orange for Let's Talk Apple, and Green for Let's Talk Photo.

#### 2 — Generating a Good Cross-Browser Favicon is not easy in 2026!

I knew that if you want to make a web app that behaves well when pinned to a phone home screen or added to the macOS doc, things get  complicated (as Allison found out with her [Elapsed Time Adder app](https://podfeet.github.io/time-adder/) a few months ago). I hadn't realised things had gotten nearly (though not quite) as complicated for regular browser favicons.

I'd assumed I'd just ask [Lumo](https://lumo.proton.me/) what the current recommended resolution, file format, and HTML tag were, get a simple answer, and have a nice favicon with just a few minutes of work. Nope!

It turns out there is actually quite a lot of debate about what the best thing to do is. After getting conflicting advice left, right, and centre that would have required me to make about 16 different files and add as many tags to my HTML `<head>` section, I eventually found some sanity on this very useful page — [faviconhelper.com/…](https://faviconhelper.com/favicon-sizes-guide).

Based on my needs and their advice, I was able to narrow it down to *just* the following files and the following HTML+Liquid code in a Jekyll include:

```html
{% raw -%}{%- comment %}
A reasonable suite of favicons:
-------------------------------
- Sizes as recommended by https://faviconhelper.com/favicon-sizes-guide
- Actual files generated from original using Mac App Iconology (https://apps.apple.com/ie/app/iconology/id1463452867?mt=12)
{%- endcomment %}
<link rel="icon" type="image/x-icon" href="{{ '/assets/graphics/LetsTalk-Podcasts-Favicon.ico' | relative_url }}">{% comment %}Legacy Favicon{% endcomment %}
<link rel="icon" type="image/png" sizes="16x16" href="{{ '/assets/graphics/LetsTalk-Podcasts-Favicon-16px.png' | relative_url }}">
<link rel="icon" type="image/png" sizes="32x32" href="{{ '/assets/graphics/LetsTalk-Podcasts-Favicon-32px.png' | relative_url }}">
<link rel="icon" type="image/png" sizes="128x128" href="{{ '/assets/graphics/LetsTalk-Podcasts-Favicon-128px.png' | relative_url }}">
<link rel="apple-touch-icon" sizes="180x180" href="{{ '/assets/graphics/LetsTalk-Podcasts-Favicon-180px.png' | relative_url }}">{% comment %}iOS Homescreen icon{% endcomment %}{% endraw %}
```

While these five icon files would not be enough were my site to be a progressive web app (PWA), they are enough for all the modern browsers, and to allow the site to be nicely pinned to an iOS home screen. (PWAs need more than just icons, at the very least they need manifest files.)

As you can see in the comment, I made use of the free Mac app [Iconology](https://apps.apple.com/ie/app/iconology/id1463452867?mt=12) to generate all the needed files from a single master image.

### The Forgotten Detail —  Redirects

It was only at the very end of the project that I panicked momentarily. I realised I'd forgotten all about the utility redirects I'd defined in NGINX on my web server. When I moved the site to GitHub Pages, there would be no NGINX server, so no NGINX config to define those redirects within 😱

After 5 minutes, I remembered that you don't need a web server to do redirects; there are HTML tags for that! So, I just needed a simple Jekyll collection with an equally simple matching custom Jekyll layout.

My redirects are now defined, one per file, in a folder of very simplistic Markdown files, e.g. this one for the Patreon redirect:

```markdown
---
permalink: /patreon
destination: https://www.patreon.com/ltpod
---
```

This folder of simple files is mapped to the following Jekyll layout:

```html
{% raw -%}{%- comment %}
A simple layout to implement a redirected

Required Frontmatter:
- permalink:       the relative URL within the site to redirect from
- destination:     the URL to redirect to

Optional Frontmatter:
- canonical:       a true value to indicate that the destination URL should be
                   treated as canonical by search engines etc.

Note: adapted from https://github.com/jekylltools/jekyll-redirect-layout (substantially simplified)
{%- endcomment %}
{%- assign destination = page.destination | absolute_url -%}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    {% if page.canonical == true -%}
    <link rel="canonical" href="{{ destination }}">
    {% endif -%}
    <meta http-equiv="refresh" content="0; url={{ destination }}">
    <title>Redirecting...</title>
  </head>
  <body>
    <a href="{{ destination }}">Follow this link if you are not redirected automatically.</a>
  </body>
</html>{%- endraw %}
```

### My Site Structure and Taxonomy

My expectation was that if I had a clear vision for how to taxonomically organise my content, I'd end up with a simple but effective Jekyll folder structure, and a sane collection of Jekyll layouts. Basically, if I decided on the taxonomy first, the site's entire structure would just fall into place.

If you're expecting this to be where I realised how naive I'd been, I'm relieved to say this is one instance where my expectations matched reality perfectly!

### Data Architecture (Taxonomy)

I'd spent a lot of time thinking about my data architecture, and I think my resulting taxonomy is quite elegant. It's as complex as it needs to be, but no more complex than that. My site's content is divided into the following *buckets*:

1. Special-purpose **pages**, e.g. the [front page](https://www.lets-talk.ie/), the [support page](https://www.lets-talk.ie/support.html), and the [credits page](https://www.lets-talk.ie/credits.html).
2. **Podcasts** — this taxonomy has two entries, one for each of my current shows (Let's Talk Apple & [Let's Talk Photo](https://www.lets-talk.ie/ltp)).
3. **Podcast Episodes** — this taxonomy is actually split across two Jekyll *collections*, one for each show, but both of these collections share the same Jekyll layout for episode pages.
4. **Contributors** — details of each guest who has ever appeared on an episode.
5. **Redirects** — memorable URLs for listeners which redirect to their true destinations, e.g., PayPal and Patreon.

YAML front matter and a simple standard for content slugs allows the relationships between individual pieces of content to be easily and clearly captured.

Each podcast has a three-letter slug (`lta` & `ltp`), and each podcast episode has a slug consisting of the three-letter slug for the podcast they belong to, and the digits of the episode number, e.g., `lta123` or `ltp42`. Each contributor has a slug based on their name (so it's easy to remember), e.g., `allison_sheridan`, and each podcast episode defines the following two metadata fields in its front matter:

1. `host`, which has a contributor slug as its value
2. `guests`, which is an optional array of contributor slugs

Some aspects of this architecture might seem needlessly complex, but the design has been carefully chosen to allow me to add new shows without the need for a fundamental redesign. To add a new show, I would simply need to:

1. Create a Markdown file for it in the Podcasts collection
2. Create a matching podcast episode collection in the site config file
3. Update the front page to advertise it appropriately

I could have made the front page generic, but since adding new shows is never going to be something I do often. rather than try to build a compelling layout for n shows, I chose to optimise the front page layout for two shows  now. if and when a third appears, I'll redesign the front page to optimise it for three.

### URL Structure

While Jekyll does provide a default mapping between Markdown files and URLs, those mappings can be easily customised at the *collection* level, and one of the supported approaches is to base URLs on content slugs (just like WordPress does).

Given my taxonomy, that led to a very simple URL structure:

1. The URL for each special page is simply the page's file name as an HTML file, e.g., `/support.html` (this is just Jekyll's default behaviour)
2. The URL for each podcast is simply the podcast's slug as a folder, e.g., `/lta`
3. The URL for each podcast episode is similarly the episode's slug, e.g., `/lta149`
4. The URL for each contributor page is the contributor slug prefixed with `contributor/`, e.g., `/contributor/allison_sheridan` 
5. The local part of the URL for each redirect is defined by the `permalink` field in the redirect's front matter, e.g., `/patreon` for the redirect to `https://www.patreon.com/ltpod`.

### Jekyll Layouts

For the most part this taxonomy maps directly to the site's layouts:

* `default_base.html` — a very generic skeleton reused for the following layouts:
  * `default.html` — the site's default layout, used for the special pages like the [support page](https://www.lets-talk.ie/support.html).
  * `contributor.html` — used to render contributor pages, e.g., [Allison's page](https://www.lets-talk.ie/contributor/allison_sheridan).
* `front_page.html` — a special layout just for the site's [front page](https://www.lets-talk.ie/).
* `podcast.html` — a special layout for podcast home pages, e.g., the [Let's Talk Apple page](https://www.lets-talk.ie/lta).
* `podcast_episode.html` — a special layout for podcast episode pages, e.g., [Let's Talk Photo episode 149](https://www.lets-talk.ie/ltp149).
* `redirect.html` — a simple layout that implements an HTML redirect.

### Jekyll Folder Structure

In the same way that the data architecture made the URL structure easy to define, it also naturally led to a simple folder structure. Special pages are simply markdown files in the site's root, and the other content is grouped into folders by collection. This is simply Jekyll's default folder structure. This is customisable, but I didn't see any need —   this seems sensible to me:

* Site Contents:
  * `/docs/*.md`  — special pages
  * `/docs/_podcasts/*.md` — podcast definitions (just two for now)
  * `/docs/_lta/*.md` — Let's Talk Apple episodes
  * `/docs/_ltp/*.md` — Let's Talk Photo episodes
  * `/docs/_contributors/*.md` — contributor pages
  * `/docs/_redirects/*.md` — redirects
* Site Design: (all Jekyll default locations or commonly adopted conventions)
  * `/docs/_includes` for reusable snippets
  * `/docs/_layouts` for Jekyll layouts
  * `/docs/_sass` for the site's SASS style sheets (which Jekyll will compile to CSS)
  * `/docs/assets/css/style.scss` — the standard placeholder for the compiled CSS (from the SASS code)
  * `/docs/assets/fontawesome` for the embedded copy of Font Awesome (to avoid depending in their CDN)
  * `/docs/assets/graphics` for the various banners and logos used within the various layouts
  * `/docs/assets/js` for the JavaScript files

You might notice that there's no folder for storing MP3 files, or any images contained in the shownotes; that's intentional. Even before migrating away from WordPress, I'd started to use a [Digital Ocean CDN](https://docs.digitalocean.com/products/spaces/how-to/enable-cdn/) for my media assets. I'm simply continuing as I was before, publishing all my MP3s and show note attachments under `https://media.lets-talk.ie/`.

> Digital Ocean implement their CDN as an optional feature on top of their Amazon S3-compatible object storage service ([Digital Ocean Spaces](https://www.digitalocean.com/products/spaces)). From a user's point of view it's regular BLOB (Binary Large Object) storage like that sold by Amazon, Microsift, Google, Backblaze, and others, accessed over the S3 protocol. Since it's standard S3, any S3 client will work, but I use [Transmit](https://panic.com/transmit/), which presents the CDN as a window with folders of files that allow drag-and-drop to standard Finder windows. In other words, it looks just like an SFTP connection to a regular web server.
{: .aside}

## There's Always More to Do!

All in all, the new site is surprisingly complete for something I built in about three weeks, but that doesn't mean I don't still have some work to do!

### 1 — Imperfect Content Imports

The single biggest task remaining is to pay down the technical debt I'd built up on WordPress. 

In Wordpress, much of what is really metadata was hard-coded into the content of individual episode posts — I was literally copying-and-pasting just about everything before the notes for the show itself from the current episodes into the new episode every time, and then I was relying on TextExpander snippets for duplicating standard components like the legend at the bottom of each Let's Talk Apple episode. That's just bad data architecture! So much of the content for each episode should have been encapsulated into custom fields and a custom theme, and I've known it all along. I also know Wordpress **can** be customised to capture all these things, and I know it **can** be themed just about any way you'd like, the problem was, try as I might, I never had the time to learn enough about either the PHP programming language, or Wordpress's expansive API to get where I needed to be. I started the process many time, trying different approaches, but in the end, I never got any of my attempts to bend Wordpress to my needs to completion. And all the time, more technical debt was building up!

Well, that debt just came due!

I needed to find a way to get my old data into the new site in such a way that it was at least readable, if not nicely presented.

I had two data sources to work with — a WordPress export of all my podcast episode posts, and the RSS feeds for both shows. Conveniently, those two things are actually in the same basic format, because Wordpress content exports are actually RSS feeds with extra fields added for the Wordpress-specific metadata. This meant that if I could parse one of my data sources programatically, I could parse both! I knew that by picking-and-choosing the best presented information from both sources, I'd be able to get a usable import of my back-episodes. It probably wouldn't be clean, but it should be readable.

Since RSS is an XML data format,I featured I might have to fall back to some kind of XML-parsing JavaScript module for my import code. I was really not looking forward to that because years of experience in work has taught me that parsing XML always ends in tears! Thankfully, I found a better solution — a JavaScript library ([@sesamy/podcast-parser](https://www.npmjs.com/package/@sesamy/podcast-parser)) on NPM that converts RSS files, including non-standard fields, to JSON, my favourite data format by far 😀

Once I had my data in JSON format I was able to manipulate it easily using tools I'm very comfortable with like NodeJS JavaScripts and `jq` (see instalments starting from [155](./pbs155)). If you're curious, you'll find all my migration scripts in the `/migration` folder in the GitHub repo.

If you look at a raw migrated episode (one that has not been manually cleaned up yet), you'll see that all the content is indeed there, but it's not always well formatted, and it's surrounded by a bunch of hard-coded metadata masquerading as content with broken images for hard-coded icons from the Wordpress site. I've found it takes just a few minutes to clean up most episodes, but each time I encounter a guest for the first time I need to create their contributor page which is a lot more time-consuming. On Wordpress I just hard-coded links to people's social media, but on this site each creator gets a permanent profile, so I need to write a short biography and add up-to-date social media links.

Realistically, it's going to take many months, if not a year or two, to work through the entire back-catalogue, so I put my energy into making the best of the situation.

As part of the migration process, I injected YAML front-matter to each episode capturing the post-migration tasks still outstanding on each episode. Specifically, the import script added the following to every episode:

```yaml
warnings:
  metadata:
    - unreviewed
    - unchecked_guests
  blurb:
    - unreviewed
  notes:
    - crude_import
```

With that metadata captured for each episode, I was able to update my layout to add some conditional warning alerts explaining to readers that the page is in need of some review. As I work my way through each back episode, I remove the appropriate front matter, and the matching warnings disappear.

Because this metadata is captured in each episode's front matter, I could do more than just add warnings to appropriate episode pages, I could build a hidden utility page that lists all the episodes that have at least one remaining warning, helping me keep track of what remains to be done. Assuming you read this before I finish the task, you'll see how much I still have to do at [/temp-episodes-to-review.html](https://www.lets-talk.ie/temp-episodes-to-review.html).

By the way, if you're comfortable with Jekyll, have a few minutes to spare to familiarise yourself with what's needed to properly format an episode on the new site, and some free time to donate, **pull requests with episode fixes are always welcome** 😉

### 2 — Add Episode Tags

WordPress supports tags, as does Jekyll. Had I taken the time to tag my episodes as I released them over the last few years, I could have easily imported those tags into my new site. But alas, I never did take the time to do that tagging, so there was nothing to import.

At some stage, when all the episodes have been cleaned up, I'd like to add tagging support to the new Jekyll site, and then start going through the back episodes and adding those tags I wish I'd been adding all along. (I'm guessing a script that invokes some LLM's API would probably help with that — extracting a handful of the most important topics from a bunch of text is just the kind of thing they're good at!)

### 3 — Address any Bugs and Niggles I Find, and any Listener Feedback

This is new software written within just three weeks, so I'm sure there are bugs! There are definitely a few niggles I've already found, and one listener has already provided some very valuable feedback for future tweaks.

I'm not likely to get to these things quickly, so to avoid forgetting them, I'm capturing them all as GitHub issues. **If you have any feedback to share or if you find any bugs**, please feel free to **[submit an issue](https://github.com/bartificer/www.lets-talk.ie/issues)**!

## The Next Few Programming by Stealth Instalments

Given my experiences with the Let's Talk site, we need to tweak our plans for the main series a little. Before we're ready to return to Jekyll, we need to take a moment to backfill some more fundamental knowledge we've inadvertently skipped over:

1. We need to learn about CSS variables
2. We need to learn the basics of the SASS CSS preprocessor
3. Armed with an understanding of both CSS variables and SASS, we need to look a little more deeply at customising Bootstrap, both with and without SASS.

At that stage, we'll be ready to dive back into Jekyll, focusing on:

1. Blogging with Jekyll
2. Content Collections in Jekyll

Finally, we need to learn about the [OpenGraph](https://www.opengraph.io) protocol so we can give our Jekyll layouts an important finishing touch by ensuring links to our work embed nicely into social media posts.


## Final Thoughts

I hope you found it interesting to take a peek under the hood of a real-world Jekyll site hosted for free on GitHub Pages. While I try to make the examples in the main PBS series as useful as I can, they can never be as revealing as a production site. I certainly found the experience of putting the theory into practice very illuminating, and it's helped me take stock of what we've done well, and where we've fallen a little short. I hope you'll join us for the second half of our free web hosting adventure this spring!
