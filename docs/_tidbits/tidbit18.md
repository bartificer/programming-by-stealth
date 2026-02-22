---
title: A Real-World Jekyll Example
instalment: 18
creators: [bart, allison]
date: 2026-02-28
---

TO DO

## Matching Podcast Episode

TO DO

## Context

As we record this instalment, we're paused between the first and second halves of a mini-series dedicated to building websites with the Jekyll Static Site Generator. In the first instalment we focused on the practicalities of building a basic customisable website with our own custom theme built on Bootstrap 5. We learned how we can built our site's theme using Jekyll layouts powered by HTML, SASS/CSS, and the Liquid templating engine, and how to encode our site's content and metadata using Markdown and YAML. In the second half we'll focus on organising our content onto meaningful taxonomies, allowing us build sites truly adapted to our publishing needs.

The reason we're looking at Jekyll at all is that for various reasons, I've fallen out of love with Wordpress, and want to migrate both the website for the Let's Talk podcasts and my personal site from Wordpress to Jekyll.

Writing the first half of the mini-series on Jekyll was the perfect preparation for my big January project this year — migrating my podcasts to my own bespoke Jekyll site. It's now February, so you'll be happy to know I succeeded, the new site went live in the last week of January, and you can see it for yourself at [lets-talk.ie](https://www.lets-talk.ie/).

Had I not written the instalments [175](./pbs175) up to an including [181](./pbs181) I would never have succeeded in that project, but equally, until I'd done that project, I'd really have struggled to write the second half of the Jekyll series. The project let me cement what we have covered, discover a few gaps we'll need to back-fill, and get the really-world experience needed to clearly explain Jekyll's approach to organising content.

With all that context establish, let me share my experiences building the new Let's Talk site with you all!

## Building the new Let's Talk Podcasts Site

### The Practicalities

I chose to target my site at the standard GitHub Pages version of Jekyll, not the newest 4.x branch because I didn't want the extra complexity of maintaining my own GitHub action for building the site. I've also chosen to make the GitHub repository powering the site public, so the code and all the build tools are available for you all to see at [github.com/bartificer/www.lets-talk.ie](https://github.com/bartificer/www.lets-talk.ie).

When developing locally, I chose to use Docker, as so expertly explained by Helma in [the previous TidBit](./tidbit17). In fact, I used Helma's bells-and-whistles example setup for the site. You can see my Docker setup in the base of the site's GitHub repo.

I chose to build the theme using [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/) as my base, and in preparation for this project, I engaged the excellent app development and design company [IconFactory](https://iconfactory.com) to commission update logos and a corporate style guide including a full colour pallet and detailed typographic definitions for headings, subheadings, body text, etc..

For me, graphic design and typography are like wine, I know what's bad, I know what's good, I know what I like, but I have no idea how to make my own! So, rather than spending weeks struggling to develop a style I'd never quite be happy with, I chose to commission some skilled craftspeople who's work I liked to do it for me 🙂

While the brief for the corporate style guide was broad, with the intention of using it for all Bartificer Creations stationary, presentations, and websites, it was also explicitly design to align with Bootstrap's approach to colours, and the font choice was limited to free fonts available via [Google Fonts](https://fonts.google.com) so they would all work on the web.

Finally, I used the free version of [Font Awesome 7](https://fontawesome.com/#fa7) for the various little icons needed throughout the site.

### The Things that Went as Expected

In many ways, the most investing lessons came from the unexpected surprises, so we'll spent most of our time on those, but before we do, I just want to quickly recognise the things that actually went to plan.

1. Our discussions on Jekyll Layouts and Liquid Templates were detailed enough that I rarely needed to go beyond the feature in our PBS examples, and when I did, our explorations armed me well enough to get what I needed from the documentation with minimal effort.
2. In terms of the basics, using SASS variables to customise Bootstrap worked just like I thought it would. Within just a few minutes I had successfully configured Bootstrap to use the custom colours and fonts from my corporate style guide. (But notice the little qualifier at the start, put a pin in Bootstrap customisation for later!)
3. Customising my OpenGraph metadata proved as rewarding as I'd hoped it would — when I share episode links on social media they look better than ever now! (E.g. [social.bartificer.ie/…](https://social.bartificer.ie/@ltpod/116109296418516823#.))

### The Unexpected Surprises

I'd put a lot of work into preparing for this project, so I was happy I'd dealt with the known-unknowns. But we're dealing with computers here's so it seemed inevitable I'd bump into some unknown-unknowns. Sure enough, there were indeed some things I didn't know that I didn't know I needed to know!

#### 1 — Customising Bootstrap has Changed Significantly Since Version 4 — I needed to Learn CSS Variables

The last version of Bootstrap I'd customised before this project was version 4, to build this very PBS website as it happens! I assumed I'd just do the same thing again, but there was more to it than that!

Firstly, Bootstrap 5 is substantially more customisable than Bootstrap 4, and you can now think of those customisations as being two-layered, making SASS optional for quite some types of customisation.

Bootstrap's final CSS file is built from a collection of SASS files which get compiled down to CSS. Deeply customising Bootstrap still requires working with SASS to alter the generated CSS, just like before, but that generated CSS now provides an entirely new avenue for many kinds of customisation — CSS variables.

I've been avoiding CSS variables for many years, because when they first came out browser support was patchy at best. THat's just not true in 2026! IE is now totally and utterly dead, and thanks to the push for better cybersecurity, it's now utterly reasonable to assume that all browsers are modern, so CSS variables have arrived at the *they just work* stage of their evolution.

Had I been working with Bootstrap 5.0, 5.1, or 5.2, I could have simply ignored CSS variables and done all my customisations at the SASS level like I had previously. But version 5.3 changed that. To add some very nice extra functionality to common components like dropdowns and nav bars, Bootstrap 5.3 added the concept of themes for certain Bootstrap components, including nav bars. I'm not actually making use of this new feature, but it's existence made it impossible for me to customise my site's nav bar purely with SASS, I needed to use CSS variables to get the nav bar to look right, so I finally learned how they work.

The good news is CSS variables are both wonderfully powerful and quite simple, so I soon got the hang of them. Which proved to be a real boon later in the project when they proved very useful for some of my more bespoke layouts, letting me add some very pleasing little touches to episode lists for example, which take their colour queues from the podcast they belong to.

#### 2 — Generating a Good Cross-Browser Favicon is not easy in 2026!

I knew that if you want to make a web app that will behave nicely when pinned to a phone home screen or added to the macOS doc things get very complicated (as Allison found on with her Time Adder Clock a few months ago). I hadn't realised things haver gotten nearly (though not quite) as confusing for regular browser favicons.

I'd assumed I'd just ask Lumo what the current correct resolution, file format, and HTML tag were, that I'd get a simple answer, and that I'd have a nice favicon with just a few minutes of work. Nope!

It turns out there is actually quite a lot of debate about what the best thing to do is. After getting conflicting advice left right and centre that would have required me to make about 16 different files and add as many tags to my HTML `<head>` section I eventually found some sanity on this very useful page — [faviconhelper.com/…](https://faviconhelper.com/favicon-sizes-guide).

Based on my needs and their advice I was able to narrow it down to *just* the following files and the following HTML+Liquid in a Jekyll include:

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

While these five icon files would not be enough were my site to be a progressive web app, they are enough for all the modern browser and to allow the site be nicely pinned to an iOS home screen.

As you can see in the comment, I made use of the free Mac app [Iconology](https://apps.apple.com/ie/app/iconology/id1463452867?mt=12) to generate all the needed files from a single master image.

#### Redirects

It was only at the very end of the project that I panicked momentarily. I realised I'd forgotten all about the utility redirects I'd defined in NGINX on my web server. When I moved the site to GitHub Pages there would be no NGINX server, so no NGINX config to define those redirects.

After 5 minutes I remembered that you don't need a web server to do redirects, there are HTML tags for that, so I just needed a simple Jekyll collection with an equally simple matching custom Jekyll layout.

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

My expectation was that if I had a clear vision for how to taxonomically organise my content, I'd end up with a simple but effective Jekyll folder structure and a sane collection of Jekyll layouts. Basically, if I decided on the taxonomy first, the site's entire structure would just fall into place.

If you're expecting this to where I realised how naive I was, I'm relieved to be able to say this is one instance where my expectations matched the reality perfectly!

### Data Architecture (Taxonomy)

I'd spent a lot of time thinking about my data architecture, and I think my resulting taxonomy is quite elegant. It's as complex as it needs to be, but no more complex than that. My site's content is divided into the following *buckets*:

1. Special-purpose **pages**, e.g. the front page, the support page, and the credits page
2. **Podcasts** — this taxonomy has two entries, one for each of my current shows.
3. **Podcast Episodes** — this taxonomy is actually split across two Jekyll *collections*, one for each show, but both of these collections share the same Jekyll layout for episode pages.
4. **Contributors** — details of each guest that has ever appeared on an episode.
5. **Redirects** — memorable URLs for listeners which redirect to their true destinations, e.g. PayPal and Patreon.

YAML front matter and a simple standard for content slugs allows the relationships between individual pieces of content be easily and clearly captured.

Each podcast has a three letter slug (`lta` & `ltp`), and each podcast episode has a slug consisting of the three letter slug for the podcast they belong to, and the digits of the episode number, e.g. `lta123` or `ltp42`. Each contributor has a slug based on their name (so it's easy to remember), e.g. `allison_sheridan`, and each podcast episode defines the following two metadata fields in their front matter:

1. `host` which has a contributor slug as its value
2. `guests` which is an optional array of contributor slugs

Some aspects of this architecture might seem needlessly complexity, but the design has been carefully chosen to allow me to add new shows without the need for a fundamental re-design. To add a new show I would simply need to:

1. Create a Markdown file for it in the Podcasts collection
2. Create a matching podcast episode collection
3. Update the front page to advertise it appropriately

I could have made the front page generic, but since adding new shows is never going to be something I do often, I chose to optimise the front page layout for two shows, and to re-design it for three or four as and when needed.

### URL Structure

While Jekyll does provide a default mapping between Markdown files and URLs, those mappings can be easily customised at the *collection* level, and one of the supposed approaches is to base URLs off content slugs (just like Wordpress does).

Given my taxonomy, that led to a very simple URL structure:

1. The URL for each special page is simply the page's file name as an HTML file, e.g. `/support.html` (this is just Jekyll's default behaviour)
2. The URL for each podcast is simply the podcast's slug as a folder, e.g. `/lta`
3. The URL for each podcast episode is similarly the episode's slug, e.g. `/lta149`
4. The URL for each contributor page is the contributor slug pre-fixed with `contributor/`, e.g. `/contributor/allison_sheridan`
5. The local part of the URL for each redirect is defined by the `permalink` field in the redirect's front matter, e.g. `/patreon` for the redirect to `https://www.patreon.com/ltpod`.

### Jekyll Layouts

For the most part this taxonomy maps directly to the site's layouts:

* `default_base.html` — a very generic skeleton re-used for the following layouts:
  * `default.html` — the site's default layout, used for the special pages like the [support page](https://www.lets-talk.ie/support.html).
  * `contributor.html` — used to render contributor pages, e.g. [Allison's page](https://www.lets-talk.ie/contributor/allison_sheridan).
* `front_page.html` — a special layout just for the site's [front page](https://www.lets-talk.ie/).
* `podcast.html` — a special layout for podcast home pages, e.g. the [Let's Talk Apple page](https://www.lets-talk.ie/lta).
* `podcast_episode.html` — a special layout for podcast episode pages, e.g. [Let's Talk Photo episode 149](https://www.lets-talk.ie/ltp149).
* `redirect.html` — a simple layout that implements an HTML redirect

### Jekyll Folder Structure

In the same way that the data architecture made the URL structure easy to define, it also naturally led to a simple folder structure. Special pages are simply markdown files in the site's root, and the other content is grouped into folders by collection. This is simply Jekyll's default folder structure. This is customisable, but I didn't see any need, because this file structure seems clear to me:

* Site Contents:
  * `/docs/*.md`  — special pages
  * `/docs/_podcasts/*.md` — podcast definitions (just two for now)
  * `/docs/_lta/*.md` — Let's Talk Apple episodes
  * `/docs/_ltp/*.md` — Let's Talk Photo episodes
  * `/docs/_contributors/*.md` — contributor pages
  * `/docs/_redirects/*.md` — redirects
* Site Design: (all Jekyll default locations or commonly adopted conventions)
  * `/docs/_includes` for re-usable snippets
  * `/docs/_layouts` for Jekyll layouts
  * `/docs/_sass` for the site's compiled style sheets
  * `/docs/assets/css/style.scss` — the standard placeholder for the compiled CSS (from the SASS code)
  * `/docs/assets/fontawesome` for the embedded copy of Font Awesome (to avoid depending in their CDN)
  * `/docs/assets/graphics` for the various banners and logos used within the various layouts
  * `/docs/assets/js` for the JavaScript files

You might notice that there's no folder for storing MP3 files or any images contained in show notes, that's intentional — even before migrating away from Wordpress I'd started to use a Digital Ocean CDN for my media assets, so I'm simply continuing to do that, with all my MP3s and show note attachments published under  `https://media.lets-talk.ie/`

### There's Always More to Do!

TO EXPAND

1. Clean up crudely imported back catalog (call out for help 🙂)
2. Add support for tags
3. Address some feedback already received from listeners (call out to submit issues)

## The Next Few Programming by Stealth Instalments

TO EXPAND

1. OpenGraph
2. CSS Variables
   1. How they work in general
   2. How to use them to customise Bootstrap without SASS (very useful for web apps like Allison's Time Shifter Clock)
3. SASS
   1. A very high-level overview of how it works in general
   2. A high-level overview of how it helps better customise websites where the content is written in Markdown, and hence, does not easily support the addition of CSS tags for applying Bootstrap styling directly
4. Jekyll information architecture
   1. Blogging with Jekyll
   2. Collections

## Final Thoughts

TO DO
