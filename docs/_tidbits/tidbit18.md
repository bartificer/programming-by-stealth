---
title: A Real-World Jekyll Example
instalment: 18
creators: [bart, allison]
date: 2026-02-28
---

It's not a coincidence that we spent the second half of 2025 covering website hosting on GitHub Pages with the Jekyll static site generator on the main feed. The motivation was simple — I wanted to migrate the website for my podcasts from Wordpress to GitHub Pages, and the second best way to truly learn something is to try teach it. What's the best way to learn? By doing! And that's what I spent January doing.

Over three weeks I built an entirely fresh website for my shows and published it at [www.lets-talk.ie](https://lets-talk.ie). That proved to be quite the experience, so I thought it was worth sharing as a Tidbit.

## Matching Podcast Episode

TO DO

## Context

As we record this instalment in late February 2026, we're paused between the first and second halves of a mini-series dedicated to building websites on GitHub Pages. We started with a generic look at how GitHub Pages can be customised to build static sites with just about any generator, but we focused mainly on using the default generator built into GitHub Pages, [Jekyll](https://jekyllrb.com). 

In the first part of our exploration of Jekyll and GitHub Pages we focused on the practicalities of building a basic website with our own custom layouts and style built with [Bootstrap 5](https://getbootstrap.com/docs/5.2/getting-started/introduction/). Specifically, we explored Jekyll's build process for converting folders of Markdown files with YAML front matter into HTML+CSS+JavaScript websites. Specifically we learned about the Jekyll configuration file, it's folder structure, and how to control the look of a site using Jekyll layouts, Jekyll variables, the Liquid templating engine, and the SASS CSS pre-processor. To capitalise on our existing knowledge we looked at how to integrate Bootstrap deeply into Jekyll allowing fine-grained customisations. 

Writing the first half of the mini-series on Jekyll was the perfect preparation for my big January project. Had I not written instalments [175](./pbs175) up to an including [181](./pbs181), I would never have succeeded. But equally, without having done that work I'd really have struggled to start writing the second half of the GitHub Page and Jekyll series.

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

## There's Always More to Do!

All in all the new site is surprisingly completed for something I built in about three weeks, but that doesn't mean I don't still have some work to do.

### 1 — Imperfect Content Imports

The single biggest task remaining is to pay down the technical debt I'd built up on Wordpress. A lot of what is really data was hard-coded into the content, and I knew I was never going to be able to clean all that up programmatically. I was able to get all the information across, but not cleanly.

I had two datasources to work with — a Wordpress export, and the podcast RSS feeds. As it happens, when you export your content from Wordpress the file you get is actually in an RSS-like format. These Wordpress exports have all the expected RSS fields, and then they have some additional custom fields.

Since RSS is an XML data format I thought I might have to find some decent XML-parsing JavaScrip modules to build my data transfer script, but thankfully I found a better solution — a JavaScript library that converts RSS files to JSON, including any custom fields ([@sesamy/podcast-parser](https://www.npmjs.com/package/@sesamy/podcast-parser)).

Once I had a mechanism for converting all my data to JSON I was able to mutate it into a workable format using `jq` and some NodeJS JavaScripts. If you're curious, you'll find all my migration scripts in the `/migration` folder in the GitHub repo.

If you look at an un-migrated episode you'll see that all the content is there, but so is a bunch of hard-coded metadata that I used to add into each Wordpress post using TextExpander snippets. I never felt comfortable with this approach, but I wasn't able to figure out anything better given the constraints I was working under within Wordpress. Had I had the time and the skills to build a suite of custom plugins and/or a custom theme, I definitely could have, but despite a few aborted attempts, I never got there. It was much less work to migrate the entire site away from Wordpress than to learn everything I'd need to know to bend Wordpress to my will!

Realistically, it's going to take many months, if not a year or two, to work through the entire back-catalogue, so I put my energy into making the best of the situation. As part of the migration process I added YAML front-matter to each episode listing the post-migration tasks still outstanding on the episode, e.g.:

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

I then added some conditional sections to the Podcast Episode Jekyll layout to display appropriate Bootstrap alerts for the unreviewed metadata and information. As I clean up episodes I can remove this front matter, and the warnings will disappear.

Because each unreviewed episode captures its unreviewed status in the front matter, I was able to create a hidden utility page that list all the episodes that have at least one warning ([/temp-episodes-to-review.html](https://www.lets-talk.ie/temp-episodes-to-review.html)).

BTW — if you're comfortable with Jekyll, have a few minutes to spare to familiarise yourself with what's needed to properly format an episode on the new site, and some free time to donate, pull requests with episode fixes are always welcome 😉.

### 2 — Add Episode Tags

Wordpress supports tags, and had I taken the time to tag my episodes as I released them I could have imported those tags from Wordpress into Jekyll, but alas I never did take them time to tag my episodes with meaningful keywords, so there was nothing to import.

At some stage, when all the episodes have been reviewed, I'd like to add tagging support to the new Jekyll site, and then start going through the back episodes and adding those tags I should have been adding all along.

### 3 — Address any Bugs and Niggles I Find, as well as any Listener Feedback

This is new software written within just three weeks, so I'm sure there are bugs! There are definitely a few niggles I've already found, and one listener has already provided some very valuable feedback for future tweaks.

I'm not likely to get to these things quickly, so to avoid forgetting them I'm capturing them all as GitHub issues. If you have any feedback to share, or if you find any bugs, please feel free to [submit an issue](https://github.com/bartificer/www.lets-talk.ie/issues) too!

## The Next Few Programming by Stealth Instalments

Given my experiences with the Let's Talk site, we need to tweak our plans for the main series a little. Before we're ready to return to GitHub Pages and Jekyll we need to take a moment to back-fill some more fundamental knowledge:

1. We need to learn about CSS variables
2. We need to learn the basics of the SASS CSS pre-processor
3. Armed with an understanding of both CSS variables in SASS we need to look a little more deeply at customising Bootstrap, both with and without SASS.

At that stage we'll be ready to dive back into GitHub Pages and Jekyll properly, focusing on:

1. Blogging with Jekyll
2. Content Collections in Jekyll

Finally, we need to learn about the OpenGraph protocol so we can give our Jekyll layouts an important finishing touch by ensuring links to our work play nicely on social media.


## Final Thoughts

I hope you found it investing to take a peek under the hood of a real-world Jekyll site hosted on GitHub Pages. While I try to make the examples in the main PBS series as useful as I can, they can never be as revealing as a production site. I certainly found the experience of putting the theory into practice very illuminating, and it's helped me to take stock of what we've done well so far in the GitHub Pages/Jekyll series, and where we've fallen short a bit. I hope you'll join us for the second half of our free web hosting adventure this spring!
