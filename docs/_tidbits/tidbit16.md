---
title: How Podfeet.com Works
instalment: 16
creators: [bart, allison]
date: 2025-12-31
---

Allison has expressed some confusion about what exactly PHP-FPM is and how it relates to NGINX and what it has to do with Wordpress, etc.. In this instalment we made sense of how a modern PHP-powered web app like the Wordpress Instance powering www.podfeet.com works by following an imaginary post from text on Allison's Mac to a post published on the website, to a web page displayed in the first visitor's browser.

## Matching Podcast Episode

TO DO

## The Podfeet Architecture Over Time

When Allison first dipped her toe into the podcasting world she hosted the website for the [NosillaCast](https://www.podfeet.com/) (`www.podfeet.com`) on a shared hosting plan from one of the major providers. This meant the site was sharing the resources of a single web and database server with tens or perhaps hundreds of other websites. Multi-site hosting like this is generally delivered using a management platform like CPanel or Plesk. This means all account administration, website administration and database management is performed though a web portal, so everything is point-and-click. Users of these kinds of systems don't need to know anything about and server administration, and they are generally very inexpensive. But they are resource constrained!

As Allison's podcast grew in popularity the traffic to `podfeet.com` out-grew a shared hosting environment, and Allison needed to migrate to a dedicated server. That is to say, a server hosting only Allison's site. Thankfully by the time Allison reached this point in the site's growth virtualisation had matured to the point that it was easy to rent a virtual private server, and even to get one with the same CPanel or Plesk control panel pre-configured. In effect the meant Allison didn't need to learn any new skills, she just moved her all her stuff into a roomier digital house!

Of course the site kept growing, and constraints of the CPanel environment started to look  more like a hindrance than a help, so Allison made the scariest move of all, and migrated to a bare virtual server without a web-based control panel. This is where Allison's sysadmin adventures really got going!

Throughout its entire history, from its initial launch right through to today, `podfeet.com` has been powered by the open source Wordpress content management system. This is a web app written in PHP which stores its data in a MySQL database. This means that to run this app on a server Allison needed to install an configure:

1. The php language
2. A web server app, she chose Apache
3. A database server app, she chose MySQL

All of these components were installed on a single server, so everything was self-contained and simple. With the software installed and configured on the server, the site consisted of just a few components:

1. A folder of php files containing the code for Wordpress itself, Allison's chosen Wordpress theme, and the Wordpress plugins Allison chose to install to expand Wordpress's capabilities
2. A Wordpress configuration file allowing it to find all the resources it needs
3. A collection of folders with media assets and other static files like the RSS feeds and any images or other media embedded into the site's posts and pages.
4. A MySQL database containing the site's posts, pages, settings, and comments.

As the site continued to grow the demands on this single server grew and grew. For a while this could be compensated for with more RAM and more virtual CPUs, but eventually the limits of this kind of so-called *vertical scaling* were reached, and the site needed to scale horizontally. This is where the architecture becomes a little more complicated!

LEFT OFF HERE!!!

## Final Thoughts

TO DO
