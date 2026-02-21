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

1. Our discussions on Jekyll Layouts and Liquid Templates were detailed enough that I rarely needed to go beyond the feature in our PBS examples, and when I did, our discussions armed me well enough to get what I needed from the documentation with minimal effort.
2. Using Bootstrap SASS variables to apply the colours and fonts from my corporate style guide worked just liked I'd hoped — with minimal effort I had a Bootstrap site works like any other, but looks unique.
3. TO FINISH

### The Unexpected Surprises

TO DO

### My Site Structure and Taxonomy

TO DO

## The Next Few Programming by Stealth Instalments

TO DO

## Final Thoughts

TO DO
