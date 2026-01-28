---
title: How Podfeet.com Works
instalment: 16
creators: [bart, allison]
date: 2025-12-31
---

In passing comments on some recent [NosillaCast](https://www.podfeet.com/) episodes, Allison has expressed some confusion about what exactly [PHP-FPM](https://www.php.net/manual/en/install.fpm.php) is and how it relates to [NGINX](https://nginx.org) and what it has to do with [WordPress](https://wordpress.org), etc. In this instalment, we'll explore how these components can work together to deliver a PHP-powered web app like the WordPress Instance powering www.podfeet.com using relatively cheap modern cloud services. We'll do this through two stories — the evolution of Allison's web hosting over time, and the journey of a single article posted to the NosillaCast website.

Note that throughout this story the protagonist is simply *'Allison'*, but the NosillaCast community played a major supporting role in this entire adventure — lots of help diagnosing the pain points, lots of help troubleshooting the inevitable issues that come along with any change, lots of invaluable advice and guidance, and countless hours of hands-on help from heroes in the community for each of the many migrations. 

## Matching Podcast Episode

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2026_01_09.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2026_01_09.mp3" >Download the MP3</a>

Read an unedited, auto-generated transcript with chapter marks:  <a href="https://podfeet.com/transcripts/PBS_2026_01_09.html">PBS_2026_01_09</a>

## Context — A Quick WordPress Overview

Before we get stuck into our two stories, let's lay some groundwork.

Like surprisingly many sites on the internet today, `podfeet.com` is a WordPress site. WordPress is an open source content management system (CMS) written in PHP. The core WordPress code handles the things all websites need. There's an API for theming the site, and a vibrant plugin ecosystem for adding less generic capabilities. With WordPress, all the posts, pages, comments, etc., are stored in a relational database. Any media attached to the posts and pages is stored in a folder to reduce the load on the database.

To give authors the option to use stand-alone clients rather than the built-in web interface for writing their content, WordPress also provides an [XML-RPC](https://en.wikipedia.org/wiki/XML-RPC) API. XML-RPC is a protocol for sending API requests to web servers in XML format. (XML = Extensible Markup Language, RPC = Remote Procedure Call)

To render a WordPress page, the server hosting it has to run the WordPress PHP code to generate the page's HTML. The WordPress PHP code connects to the database to retrieve the content. Using the XML-RPC API from a client app is similar — the client sends web requests to the site's XML-RPC URL, and the server executes PHP code which connects to the database to perform the requested actions.

In practical terms, a WordPress site has three components:

1. **PHP code** — the core WordPress code,  the code for the site owner's chosen theme(s), and the code for all the installed plugins.
2. A **relational database**
3. The WordPress uploads **folder** where attached media like images are stored



## The Podfeet Architecture Over Time

The simplest way to understand how the site works today, and why it now works the way it does, is to follow the site's evolution over time as the show grew in popularity and the available technologies evolved.

### Simple Beginnings

When Allison first dipped her toe into the podcasting waters, she hosted the website on a shared hosting plan from one of the major providers. This meant the site was sharing the resources of a single web and database server with tens, or perhaps even hundreds, of other websites. Multi-site hosting like this is generally delivered using a management platform like [CPanel](https://www.cpanel.net) or [Plesk](https://www.plesk.com). These platforms provide site owners with a web-based control panel for managing their site, so, for the most part, the underlying technical details were not relevant for her. As long as the platform met the minimum requirements for WordPress, the rest was someone else's problem 🙂

These kinds of fully managed shared hosting offerings have two obvious advantages — they're inexpensive, and customers are liberated from all systems administration (sysadmin) tasks!

However, there is a significant limitation — they're resource-constrained! This means shared hosting platforms are fine for personal websites and simple brochure sites for small businesses, but they're just not up to hosting an even moderately popular site.

As the podcast grew in popularity, so did the traffic to `podfeet.com`, so it inevitably outgrew shared hosting.

Had the podcast reached this point just a few years earlier, Allison would have had no choice but to move to a dedicated physical server. This would have meant taking full responsibility for the sysadmin tasks, and of course, an order of magnitude jump in the monthly cost. But Allison's timing was perfect; she was able to dodge the sysadmin bullet for a few more years thanks to the rise of virtualisation.

The site's first upgrade was to move from a fully managed shared server to a similar service on a dedicated virtual private server. This server ran the same kind of control panel as used on shared hosting; the only real difference was that Allison was the server's only user. She still used the same control panel, not now `podfeet.com` was the only site published from the server, so it could monopolise the resources. This was still noticeably more expensive, but nothing as expensive as renting a physical server!

This reprieve was only ever going to be short-term, and soon enough, Allison outgrew this kind of managed dedicated server. This time, the only available option was to remove the overhead from the control panel and to move to a bare-bones virtual private server. No more control panel, so for the first time, the sysadmin tasks became Allison's problem!

## More Context — The LAMP Stack

While it was not relevant to Allison, the site had been served by Apache web servers running on Linux with MySQL databases for its entire history to that point (that's what the control panels were managing for her). This arrangement is so common it has a name — the *LAMP Stack*. Sysadmins managing websites refer to all the software underpinning a website as the site's *stack*, and being nerdy types, sysadmins like to reduce stacks to acronyms, so the combination of **L**inux, **A**pache, **M**ySQL & **P**HP became LAMP.

## The Site's First Truly Dedicated Server

Since the site had always run on a LAMP stack to this point, the simplest option when moving to a dedicated server was to implement that same stack manually.

Allison ordered a [CentOS](https://en.wikipedia.org/wiki/CentOS)-based Linux virtual private server, then installed the then latest versions of [the Apache web server](https://httpd.apache.org), [MySQL](https://www.mysql.com), and [PHP](https://www.php.net), and with some help, configured it all so it worked. Then it was just a matter of copying the site over and updating the DNS entry to point the domain at the new server.

Unlike physical servers, virtual servers can easily have additional RAM and CPU allocated, so even as the site grew, the same server was able to grow along with it. Over the years, there were a few like-for-like migrations to deal with CentOS upgrades and improved server offerings, but the site and the server's fundamental structure remained the same — a basic LAMP stack running on a single server.

## The Original *Post's Tale*

To understand what's about to change, and why, let's look at the life of a single post at this point in the site's evolution.

Allison starts by composing the post in her favourite client, [MarsEdit](https://redsweater.com/marsedit/). When the content is ready, she pushes the *Publish* button and MarsEdit sends the new post to the server with an HTTP request to WordPress' XML-RPC URL on the `podfeet.com` site. The web server app listening for HTTP requests is Apache, so it receives the request from MarsEdit and assigns an Apache *worker process* to the request. This is a Linux process that does all the work for this request. While the worker is servicing this request, it can't do anything else, so if another request arrives on the server before this worker finishes, Apache has to use a second parallel worker process for the other request. On a busy Apache web server, there can be a lot of workers running at the same time!

The XML-RPC URL MarsEdit called is part of WordPress, which is written in PHP, so the Apache worker process has to load the PHP language into itself. Apache workers *learn* PHP using the `mod_php` Apache module. Now that the worker has learned how to execute PHP code, it gets to work dealing with Allison's XML-RPC request to publish her new article by executing the WordPress PHP code. To publish an article, all attachments need to be written to the WordPress uploads folder, and the article and all its metadata need to be written to the database.

For simplicity, I'm going to ignore the reality that publishing a post actually requires a back-and-forth between the WordPress code and MarsEdit. Due to various optimisations in the HTTP protocol, the same Apache worker will handle the full back-and-forth, so blurring it all into one request is a reasonable thing to do for clarity.

To publish the article, the Apache worker process needs to:

1. Load `mod_php` so it can execute the WordPress code (which costs CPU time and consumes RAM)
2. Save all attachments into the WordPress uploads folder
3. Connect to the database
4. Write the content of the post into the database
5. Close the database connection
6. Reply to MarsEdit with the published post's metadata
7. Shut itself down

Some time later, a NosillaCastaway sees Allison's social media post about the new article (perhaps on the [Podfeet Slack](https://podfeet.com/slack)) and wants to read it, so they open the post's URL in their browser. Let's assume it's Safari.

Safari connects to the `podfeet.com` web server, and Apache creates a fresh worker process. That worker loads `mod_php`, then executes the WordPress code, which reads the article's content from the database, loads the theme and all the site's plugins from the WordPress extensions folder, builds the HTML, CSS, and JavaScript needed to render the page, and returns all that to Safari, which displays it. Again, this actually involves multiple requests to the server, but it will be handled by a single Apache worker, so we'll simplify it to a single request.

Again, this is not a small task, since the Apache worker needs to:

1. Load `mod_php`
2. Connect to the database
3. Query the database for the article's content
4. Load the extra PHP code for the site's theme and plugins
5. Execute the WordPress code to render the article
6. Return the rendered content to the browser
7. Shut itself down

I want to draw your attention to some key points here.

1. Apache needs to start and stop workers all the time, and each worker gets its own copy of the `mod_php`, so Apache worker processes take up a lot of RAM. When you have many workers running at once, much of the used RAM is copies of the same code (e.g., many copies of `mod_php`)!
2. Since each worker requires a substantial amount of RAM, Apache limits the number of workers running at any time. As long as there are more available workers than simultaneous visitors, all is well. But, the moment there are more visitors than workers, Apache has to start queueing the requests.
3. Each process is making its own database connection, so the database server is having to open and close connections constantly, and it too has a limit, so it too can start to queue up requests.
4. The same server is running all these Apache processes and handling all these database connections, so there's a lot of data flowing around inside the VM (virtual machine), which can overload the OS.

## Another Short Reprieve — Database-as-a-Service

As the site continued to grow, even Allison's dedicated single server started to struggle.

Remember this single server was running both Apache and MySQL, so the obvious way to split up the work was divide those two tasks across two servers — one running Apache and PHP, and there other MySQL.

But again, Allison's timing was perfect. Had she arrived at this point five years earlier, the only viable option would have been to purchase a second virtual server and move MySQL to that second server. However, that would have cost more and been less efficient than the new option that had just become practical — a managed database!

Optimising a database server is a black art. Even when you know what you're doing, it takes a lot of work to fine-tune a MySQL server so it delivers the best possible performance for your specific use-case. This means that it's inevitable that when hobbyists run their own MySQL servers, they will be configured suboptimally. What you need from a database is an efficient service, so why not outsource the hassle of maintaining the server delivering that service entirely?

Enter the Software-as-a-Service model, otherwise known as SaaS. Instead of buying a second VM, Allison added a managed MySQL database to her DigitalOcean account, copied the existing database to that newly acquired service, and updated the WordPress configuration to point at it, instead of the locally running copy of MySQL. Then, the local MySQL was simply disabled. This halved the server's workload, so it was able to grow some more without the need to re-engineer the stack.

## The Big Re-Architecting

As you can probably guess by now, the site continued to grow, and so the site eventually outgrew the LAMP stack entirely. It was time for a big re-think!

### The Problems with LAMP (or Apache Really)

The biggest problem with the LAMP stack is Apache. It was the first successful web server, so while it's very robust and battle-hardened, it is also quite primitive in some rather fundamental ways. Most notably, in how it handles simultaneous requests. Basically, the problem is all those memory-hungry worker processes hanging around waiting on various kinds of IO (input/output) from the file system and/or the database.

The other pain point is Apache's approach of embedding the ability to process PHP directly into each web worker process using `mod_php`. Teaching Apache to execute PHP with `mod_php` works effectively, but not efficiently! Apache is not optimised to be a PHP server; its design is intentionally generic, allowing it to serve web apps written in just about any language. It's a jack of all languages, but a master of none, so to speak 🙂

Can we replace Apache with something else?

### The New Architecture

The move to Allison's current stack involved upgrading to a new version of Linux (CentOS 8), and two significant changes to the stack — the replacement of Apache, and the Addition of Cloudflare. The Linux upgrade is unremarkable and has in fact been repeated since to [Rocky Linux](https://rockylinux.org) 9, so let's look at the other changes in turn.

### Apache → NGINX + PHP-FPM

If you think about it, in our previous LAMP setup, Apache was doing double duty — it was handling the intricacies of web serving, and it was executing PHP code. Why not split those two roles apart so both can be optimised separately?

This is where [NGINX](https://nginx.org) (pronounced *engine-X*) enters the story — NGINX is a much more modern web server than Apache, and it has a much more efficient mechanism for handling concurrent connections. Rather than having lots of workers waiting on various IO tasks, it runs a single master process that rapidly cycles its attention between all the requests that are not currently waiting on IO operations. This approach reduces the RAM and CPU load on the server dramatically, and it gives users snappier responses, too!

NGINX is a superb web server, but it's **only** a web server; it can't execute any code, not Python code, not Ruby code, not PHP code, nothing! So we need something else to execute the WordPress PHP code as and when needed. This is where [PHP-FPM](https://www.php.net/manual/en/install.fpm.php) comes in.

PHP-PFM is the *PHP FastCGI Process Manager*. [CGI](https://en.wikipedia.org/wiki/Common_Gateway_Interface) is the *Common Gateway Interface*, and is a completely generic mechanism for web servers to request code execution in any language. [FastCGI](https://en.wikipedia.org/wiki/FastCGI) is a more efficient evolution of the original CGI protocol, specifically designed for web servers to outsource web request processing to another app. PHP-FPM is a FastCGI processor for PHP code.

Rather than having Apache start a dedicated worker process for each request and have it teach each of those workers how to execute PHP code, NGINX uses a single very efficient master process, and outsources the execution of all PHP code to the very efficient PHP-FPM.

These optimisations make it possible for a single Linux VM to process many more web requests simultaneously on the same hardware compared to what can be achieved with Apache with `mod_php`.

So, moving away from Apache would have been enough to buy Allison a little more time, but there was another opportunity for even more optimisation — caching!

### Adding Caching (CloudFlare)

The `podfeet.com` website is not updated many times per day, let alone per hour or per minute, so having NGINX+PHP-FPM render each page from scratch for each visitor is needlessly wasteful. Until Allison posts a new article or a listener leaves a new comment, the HTML+CSS+JavaScript returned by the WordPress code will be the same for every visitor. All that RAM, CPU, disk IO, and all those database queries are just re-creating the same output over-and-over-and-over again.

Why regenerate every page every time? Why not cache the pages that don't change, at least for a while?

It's possible to configure NGINX to do that kind of caching locally, but that means more configurations to maintain. Caches, like databases, benefit from careful fine-tuning, so they are also ideally suited to outsourcing to experts! Since we now live in a Software-as-a-Service world, we can do just that — enter [CloudFlare](https://www.cloudflare.com/)!

Not only does CloudFlare offer intelligent caching, but it also offers a bunch of additional useful features (more on those in a moment). But best of all, with CloudFlare deployed in front of your web server, the load on your server from every cached response is literally zero! If you were caching, your server would still have some work to do, but with CloudFlare, your server is completely out of the loop for all cached responses.

The way you deploy CloudFlare is to update your DNS records so they point at CloudFlare's servers rather than your own. The CloudFlare servers can then handle all the caching, and the cached copies are stored in CloudFlare's world-class Content Delivery Network (CDN). CloudFlare are world leaders when it comes to content delivery, and their freemium model makes it an excellent option for individuals and small organisations. Sites like `podfeet.com` don't need anything beyond the free tier, and even that tier offers some real benefits:

1. **Intelligent caching** — CloudFlare's caches are expertly tuned, and since they deliver more websites than anyone else in the world, there really is no one better to configure your cache for you!
2. **DDOS Protection** — because their infrastructure sits in front of your server, they can soak up even the biggest denial of service attacks and save your website from getting knocked offline.
3. **Web Application Firewall (WAF)** — as well as intelligently caching your website, CloudFlare also check incoming requests against known malicious behaviour, blocking likely malicious requests before they ever reach your server.
4. **Traffic Shaping Rules** — the simplest kinds of traffic shaping rules are rate limits, but CloudFlare's rules can do much more than that. Do note that the free plan does limit the number and complexity of your rules.
5. **World-Class DNS Hosting** — the easiest way to configure CloudFlare is to move your DNS hosting to them (you can just point specific records, but that takes more effort on your end). This is a real win-win because it takes the least possible amount of effort, and you get a great free service! Their authoritative DNS servers are robust and fast, and their DNS control panel is powerful and easy to use.

Note that Allison uses a single traffic-shaping rule to rate-limit requests to the XML-RPC URL for the `podfeeet.com` site. This is because API endpoints can't be cached, and spammers like to use WordPress's well-known XML-RPC URL to spam sites with bulk pingbacks and/or comments.

## A Contemporary Post's Tale

To really see how this new architecture works, let's follow another article, but this time, we need to follow it for one extra step. Like before, we'll start with Allison publishing the article, and with the first visitor reading it, but we'll continue beyond that to look at the second visitor, too. Why? Because the second visitor will be the first to benefit from the CloudFlare cache!

### Part 1 — Allison Publishes

Allison is still using the MarsEdit client, so the new article and its attachments are still being uploaded via HTTPS requests to the XML-RPC URL. The first difference is that when MarsEdit contacts the IP address it has resolved for `podfeet.com`, it won't be communicating with Allison's server, but with CloudFlare's nearest available server, most likely in LA. Assuming the MarsEdit connections pass Cloudflare's various security checks, the CloudFlare server will relay the connection to the web server app now running on Allison's server. Note that because both WordPress and Cloudflare correctly use the parts of the web standards for managing caches, no communications with the XML-RPC endpoint will ever get cached by Cloudflare.

The web server now running is NGINX, so it will receive the requests from MarsEdit. Unlike Apache, NGINX can't execute PHP code, so it will pass the request to PHP-FPM. PHP-FPM will run the WordPress code, which will update the database and save any attachments into the WordPress uploads folder, just like Apache previously did.

The article is now published.

### Part 2 — The First Reader

The first browser to try view the new article will almost certainly be Allison's, as she verifies everything looks good before posting about the new article to social media. So, let's just assume the browser is Safari.

Like MarsEdit, Safari resolves `podfeet.com` to an IP address and sends an HTTPS request for the new article to that IP. Again, that will be a CloudFlare server. After the request passes all of CloudFlare's security checks, the CloudFlare server will check its cache to see if it already has a copy of the article saved. This is a new article that hasn't been viewed yet, so it won't.

Like before, the CloudFlare server will relay the request to Allison's server, where NGINX will handle it. NGINX will again pass the request to PHP-FPM, which will execute the WordPress code, including the code for Allison's theme and the various plugins she has installed. The Wordpress code will query the database for the article's contents, and when it has everything it needs, generate the HTML code to render the article. PHP-FPM will pass the generated HTML back to NGINX, which will pass it back to the CloudFlare server, **which will cache it**, before finally passing it back to Safari.

When Safari receives the HTML, it will include references to the files Allison attached to the article, so Safari will make further requests to get those files too. Let's assume these files are images (they almost always are), so Safari will ask the CloudFlare servers for each image. We'll just follow the first of those requests.

Again, the CloudFlare server will check its cache, but again, since this is new content that has not been viewed yet, it won't find a cached copy, so it will again relay the request to Allison's server. NGNIX receives the request, but since this is a request for an image file, it doesn't need any help, so it simply fetches the image from the WordPress uploads folder, passes it back to the CloudFlare server, **which caches it**, before passing it back to Safari, which displays it. 

### Part 3 — The Second Reader

Let's assume NosillaCastaway Joop is as active as ever on the [Podfeet Slack](https://podfeet.com/slack) and sees Allison's post about the new article first. He clicks on the URL, and his copy of Safari resolves the `podfeet.com`  name to the CloudFlare server nearest to him in the Netherlands. The Dutch Cloudflare server checks the Cloudflare CDN for a cached version of the article's URL, and finds the HTML that the server in LA cached when Allison checked the article from her Mac. Rather than reach back to Allison's server, it just replies with the cached HTML, which Joop's Safari starts rendering. Again, it contains images, so Joop's Safari asks the Dutch CloudFlare server for those, and again, they exist in the cache, so the Dutch Cloudflare server replies to Joop's Safari with the images without ever contacting Allison's server.

## Final Thoughts — the New Design's Implications

This new design offers many new efficiencies, which are greatly reducing the load on Allison's server:

1. Overly eager bots are being blocked by Cloudflare's traffic shaping rules before ever reaching Allison's server
2. Known malicious requests, including those from any detected DDoS activity, are also being blocked
3. The CloudFlare cache is reducing the number of legitimate requests that Allison's server needs to process
4. NGINX+PHP-FPM are processing the remaining requests that do need to go to the server more efficiently

There are two obvious drawbacks, though:

1. The setup has become more complex, so it's more difficult to understand and troubleshoot
2. The logs within WordPress and on Allison's server are now systematically undercounting visits; the only logs that give the full picture are on CloudFlare, and free users get limited access to those logs (it's not bad, but it's less than you can get on your own server)

I think it's fair to say the advantages greatly outweigh the drawbacks, and the `podfeet.com` site is faster and healthier than it's been in some time!
