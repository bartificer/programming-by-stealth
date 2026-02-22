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
2. TO REWORD — Using Bootstrap SASS variables to apply the colours and fonts from my corporate style guide worked just liked I'd hoped — with minimal effort I had a Bootstrap site that works like any other, but looks unique.
3. Customising my OpenGraph metadata proved as rewarding as I'd hoped it would

### The Unexpected Surprises

I'd put a lot of work into preparing for this project, so I was happy I'd dealt with the known-unknowns. But we're dealing with computers here's so it seemed inevitable I'd bump into some unknown-unknowns. Sure enough, there were indeed some things I didn't know that I didn't know I needed to know!

#### Customising Bootstrap has Changed Significantly Since Version 4 — I needed to Learn CSS Variables

The last version of Bootstrap I'd customised before this project was version 4, to build this very PBS website as it happens! I assumed I'd just do the same thing again, but there was more to it than that!

Firstly, Bootstrap 5 is substantially more customisable than Bootstrap 4, and you can now think of those customisations as being two-layered, making SASS optional for quite some types of customisation.

Bootstrap's final CSS file is built from a collection of SASS files which get compiled down to CSS. Deeply customising Bootstrap still requires working with SASS to alter the generated CSS, just like before, but that generated CSS now provides an entirely new avenue for many kinds of customisation — CSS variables.

I've been avoiding CSS variables for many years, because when they first came out browser support was patchy at best. THat's just not true in 2026! IE is now totally and utterly dead, and thanks to the push for better cybersecurity, it's now utterly reasonable to assume that all browsers are modern, so CSS variables have arrived at the *they just work* stage of their evolution.

Had I been working with Bootstrap 5.0, 5.1, or 5.2, I could have simply ignored CSS variables and done all my customisations at the SASS level like I had previously. But version 5.3 changed that. To add some very nice extra functionality to common components like dropdowns and nav bars, Bootstrap 5.3 added the concept of themes for certain Bootstrap components, including nav bars. I'm not actually making use of this new feature, but it's existence made it impossible for me to customise my site's nav bar purely with SASS, I needed to use CSS variables to get the nav bar to look right, so I finally learned how they work.

The good news is CSS variables are both wonderfully powerful and quite simple, so I soon got the hang of them. Which proved to be a real boon later in the project when they proved very useful for some of my more bespoke layouts, letting me add some very pleasing little touches to episode lists for example, which take their colour queues from the podcast they belong to.

#### Generating a Good Cross-Browser Favicon is not easy in 2026!

TO DO

#### TO DO — ADD MORE IF NEEDED

### My Site Structure and Taxonomy

TO DO

### There's Always More to Do!

TO DO

## The Next Few Programming by Stealth Instalments

TO DO

## Final Thoughts

TO DO
