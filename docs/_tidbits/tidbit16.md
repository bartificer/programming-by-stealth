---
title: How Podfeet.com Works
instalment: 16
creators: [bart, allison]
date: 2025-12-31
---

Allison has expressed some confusion about what exactly PHP-FPM is and how it relates to NGINX and what it has to do with Wordpress, etc.. In this instalment we made sense of how a modern PHP-powered web app like the Wordpress Instance powering www.podfeet.com works by following an imaginary post from text on Allison's Mac to a post published on the website, to a web page displayed in the first visitor's browser.

## Matching Podcast Episode

TO DO

## Context — A Quick Wordpress Overview

Like so many sites on the internet, `podfeet.com` is a Wordpress site. Wordpress is an open source content management system (CMS) written in PHP. The core Wordpress code handles the things all websites need, there's an API for theming the site, and a vibrant plugin ecosystem. With Wordpress all the posts, pages, comments, etc. are stored in a relational database, but attached media is stored in a folder to reduce the load on the database.

To give authors the option to use stand-alone clients rather than the built-in web interface for writing their content, Wordpress also provides an XML-RPC API for clients to interact with.

To "see" a Wordpress page the server hosting it has to run the Wordpress PHP code to generate the page, and that code will connect to the database to retrieve the content. Using the XML-RPC API from a client app is similar — the client sends web-requests to the site's XML-RPC URL, and server executes PHP code which connects to the database to perform the requested actions.

In practical terms, a Wordpress site has three components:

1. The PHP code for Wordpress itself,  the site owner's chose theme(s), and all installed plugins
2. A relational database
3. A media folder to store attachments



## The Podfeet Architecture Over Time

The simplest way to understand how the site works today, and why it now works this way, is to follow the site's evolution over time as both technology and the show developed.

### Simple Beginnings

When Allison first dipped her toe into the podcasting world, she hosted the website for the [NosillaCast](https://www.podfeet.com/) (`www.podfeet.com`) on a shared hosting plan from one of the major providers. This meant the site was sharing the resources of a single web and database server with tens or perhaps hundreds of other websites. Multi-site hosting like this is generally delivered using a management platform like CPanel or Plesk. This meant that Allison could do everything she needed to via a simple web control panel. For the most part, the underlying technical details were irrelevant. What web server the provider chose to deploy, which relational database they choose to offer, or which particular version of the PHP run-time, none of that mattered to Allison as long as the Wordpress installer was happy the server met its minimum requirements.

These kinds of fully managed shared hosting offerings have two obvious advantages — they're inexpensive, and customers are liberated from all sysadmin tasks!

However, there is a significant limitation — they're resource-constrained, so they're fine for personal websites or brochure sites for small businesses, but they're just not up to hosting even moderately popular sites!

As the podcast grew in popularity the traffic to `podfeet.com` inevitably out-grew these shared hosting environments.

Had the podcast reached this point just a few years earlier, Allison would have had no choice but to move to a rented dedicated physical server. This would have meant taking full responsibility for the sysadmin tasks, and of course, an order of magnitude jump in the monthly cost. But Allison's timing was perfect, she was able to dodge the sysadmin bullet for a few more years thanks to the rise of virtualisation.

The site's first upgrade was to move from a fully managed shared server to a similar service on a dedicated virtual private server running the same kind of control panel as those used on shared hosting. The only real difference was that now there was only one website on the server, not tens or hundreds. The bill obviously increased, but nowhere near as much as it would have just a few years earlier.

This reprieve was only ever going to be short-term, and soon enough Allison needed to move to a bigger and better virtual private server, and this time, there was no control panel to handle the sysadmin tasks, it would finally be Allison's problem!

## More Context — The LAMP Stack

While it was not relevant to Allison, the site had been served by Apache web servers running on Linux with MySQL databases for its entire history. This arrangement is so common it has a name — the *LAMP Stack*.

Sysadmins managing websites refer to all the software underpinning a website as its *stack*, and being nerdy types, sysadmins like to reduce stacks to acronyms, so the combination of Linux, Apache, MySQL & PHP became LAMP.

## The Site's First Truly Dedicated Server

Since the site had always run on a LAMP stack, the simplest option when moving to a dedicated server was to simply duplicate that environment.

Allison ordered a CentOS-based Linux virtual private server, then installed the then latest versions of Apache, MySQL, and PHP, and with some help, configured it all so it worked, then copied over the site.

Unlike physical servers, virtual servers can easily have more RAM and CPU assigned, so even as the site grew, the same server was able to grow for a long time too. Over the years there were a few like-for-like migrations to deal with CentOS upgrades and improved offerings, but the site and the server's fundamental structure remained the same — a basic LAMP stack running on a single server.

## The Original *Post's Tale*

To understand what's about to change, and why, let's look at the life of a single post at this point in the site's evolution.

Allison starts by composing the post in her favourite client, Mars Edit. When the content is ready she pushes the *Publish* button and Mars Edit sends the new post to the server with an HTTP request Wordpress XML-RPC URL on the `podfeet.com` site. The web server app listening for HTTP requests is Apache, so it receives the request from MarsEdit and assigns an Apache *worker process* to the request. This is a Linux process that does all the work for this request. While it is servicing this request it can't do anything else, so if another requests arrives on the server before this worker finishes, Apache has to use a second parallel worker processes for the other request. This means that on a busy Apache web server there can be a lot of workers running at the same time.

The URL MarsEdit called is part of the Wordpress web app which is written in PHP, so the Apache worker process has to load the PHP language into itself, and it does this using the `mod_php` Apache plugin. Now that the worker has learned how to execute PHP code, it gets to work dealing with Allison's XML-RPC request to publish her new post by executing the Wordpress PHP code. To publish a post all attachments need to get written to the Wordpress uploads folder, and the post an all its metadata need to get written to the database.

For simplicity, I'm going to ignore the reality that publishing a post actually requires a back-and-forth between the Wordpress code and MarsEdit. Due to various optimisations in the HTTP protocol the same Apache worker will handle the full back-and-forth, so blurring it all into one request is a reasonable thing to do for clarity.

Putting it all together the Apache worker process needs to:

1. Load `mod_php` so it can execute the Wordpress code (costs CPU time and RAM)
2. Save all attachments into the Wordpress uploads folder
3. Connect to the database
4. Write the content of the post into the database
5. Close the database connection
6. Reply to MarsEdit with the published post's metadata
7. Shut itself down

Some time later, a Nosillacastaway sees Allison's notification about the new post on the Podfeet Slack and wants to read it, so they open the post's URL in their browser, let's assume it's Safari.

Safari connects to the `podfeet.com` web server and Apache creates a fresh worker process, that worker loads `mod_php`, then executes the Wordpress code which reads the posts content from the database, loads the theme and all the site's plugins from the Wordpress extensions folder, builds the HTML, CSS, and JavaScript needed to render the page, and returns it all to Safari which displays it.

Again, this is not a small task, since the Apache worker needs to:

1. Load `mod_php`
2. Connect to the database
3. Query the database for the post's content
4. Load the extra PHP code for the site's theme and plugins
5. Execute the Wordpress code to render the page
6. Return the rendered content to the browser
7. Shut itself down.

I want to draw your attention to some key points here.

1. Apache needs to start and stop workers all the time, and each worker gets its own copy of the `mod_php`, so Apache worker processes take up a lot of RAM, and when you have many running at once, much of that RAM is copies of the same code!
2. Since each worker requires a substantial amount of RAM, Apache limits the number of them that can be started simultaneously. As long as there are more available workers than simultaneous visitors all is well,  but the moment there are more visitors than workers Apache has to start queueing the requests.
3. Each process is making its own database connection, so the database server is having to open and close connections constantly, and it too has a limit, so it too can start to queue up requests.
4. The same server is running all these Apache processes and handling all these database queries, so there is a lot of data flowing around inside the VM, this can overload the OS quite easily.

## Another Short Reprieve — Database-as-a-Service

TO DO

## The Big Re-Architecting

### The Problems with LAMP

TO DO

### The New Architecture

TO DO

## A Contemporary Post's Tale

TO DO

## Final Thoughts

TO DO
