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

When Allison first dipped her toe into the podcasting world, she hosted the website for the [NosillaCast](https://www.podfeet.com/) (`www.podfeet.com`) on a shared hosting plan from one of the major providers. This meant the site was sharing the resources of a single web and database server with tens or perhaps hundreds of other websites. Multi-site hosting like this is generally delivered using a management platform like CPanel or Plesk. This means all account administration, website administration, and database management is performed through a web portal, so everything is point-and-click. Users of these kinds of systems don't need to know anything about server administration, and they are generally very inexpensive. But they are resource-constrained!

As Allison's podcast grew in popularity, the traffic to `podfeet.com` outgrew a shared hosting environment, and Allison needed to migrate to a dedicated server. That is to say, a server hosting only Allison's site. Thankfully, by the time Allison reached this point in the site's growth virtualisation had matured to the point that it was easy to rent a virtual private server, and even to get one with the same CPanel or Plesk control panel pre-configured. In effect, the meant Allison didn't need to learn any new skills, she just moved all her stuff into a roomier digital house!

Of course the site kept growing, and constraints of the CPanel environment started to look  more like a hindrance than a help, so Allison made the scariest move of all, and migrated to a bare virtual server without a web-based control panel. This is where Allison's sysadmin adventures really got going!

Throughout its entire history, from its initial launch right through to today, `podfeet.com` has been powered by the open source WordPress content management system. This is a web app written in PHP that stores its data in a MySQL database. This means that to run this app on a server, Allison needed to install and configure:

1. The php language
2. A web server app, she chose Apache
3. A database server app, she chose MySQL

All of these components were installed on a single Linux server, so everything was self-contained and simple. With the software installed and configured on the server, the site consisted of just a few components:

1. A folder of php files containing the code for WordPress itself, Allison's chosen WordPress theme, and the WordPress plugins Allison chose to install to expand WordPress's capabilities
2. A WordPress configuration file allowing it to find all the resources it needs
3. A collection of folders with media assets and other static files, like the RSS feeds and any images or other media embedded into the site's posts and pages.
4. A MySQL database containing the site's posts, pages, settings, and comments.

As the site continued to grow, the demands on this single server grew and grew. For a while, this could be compensated for with more RAM and more virtual CPUs, but eventually the limits of this kind of so-called *vertical scaling* were reached, and the site needed to scale horizontally. This is where the architecture becomes a little more complicated!

## A Quick Overview of the 'LAMP Stack'

Sysadmins managing websites refer to all the software underpinning a website as its *stack*, and some of those combinations are or were so common that they get named. This is where the so-called *LAMP Stack* comes from — Linux, Apache, MySQL & PHP.

Up to this point in our story, the server powering `podfeet.com` has always been a Linux server running an instance of the Apache web server app with the optional PHP module installed, and an instance of the MySQL database server app. That is to say, while the sheer amount of resources thrown at the site has been increasing, the site remained on a classic LAMP stack.

To explain how the site hangs together today, let's set ourselves a baseline by exploring how it hung together before the stack was modernised. To do that, let's follow the full journey of one blog post from Allison's editor (Mars Edit), the website, to the first visitor's browser.

### The Original *Post's Tale*

LEFT OFF HERE!!!

## Final Thoughts

TO DO
