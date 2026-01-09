---
title: How Podfeet.com Works
instalment: 16
creators: [bart, allison]
date: 2025-12-31
---

In passing comments on some recent [NosillaCast](https://www.podfeet.com/) episodes, Allison has expressed some confusion about what exactly [PHP-FPM](https://www.php.net/manual/en/install.fpm.php) is and how it relates to [NGINX](https://nginx.org) and what it has to do with [Wordpress](https://wordpress.org), etc.. In this instalment we'll explore how these components can work together to deliver a PHP-powered web app like the Wordpress Instance powering www.podfeet.com using relatively cheap modern cloud services. We'll do this through two stories — the evolution of Allison's web hosting over time, and the journey of a single article posted to the NosillaCast website.

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

As the site continued to grow, even Allison's dedicated single server started to struggle.

Remember this single server was running both Apache and MySQL, so the obvious way to split up the work is to move to a two-server setup, one running Apache and PHP, and there other MySQL.

Again, Allison's timing was perfect. Had she arrived at this point five years earlier the only viable option would have been to purchase a second virtual server and move MySQL to that second server. However, that would not have been as good as the new option that was becoming common-place, a managed database.

Optimising a database server is a black art. Even when you know what you're doing, it takes a lot of work to fine-tune MySQL to give you the best possible performance for your specific needs. This means that it's inevitable that when hobbyists run their own MySQL servers they will be configured sub-optimally. What you need from a database is an efficient service, so why not out-source the hassle of maintaining the server delivering that service entirely?

The new trend in cloud computing that arrived at the perfect time was the Software-as-a-Service model, otherwise known as SaaS. Instead of buying a second VM, Allison added a managed MySQL database server to her DigitalOcean account, copied the existing database to that newly acquired service, and updated the Wordpress configuration to point at it instead of the locally running copy of MySQL. Then, the local MySQL was simply disabled. This halved the server's workload, so it was able to grow some more without the need to re-egineer the stack.

## The Big Re-Architecting

As you can probably guess by now, the site has continued to grow, and so the site eventually out-grew the LAMP stack entirely. It was time for a big re-think!

### The Problems with LAMP (or Apache Really)

The biggest problem with the LAMP stack is Apache. It was the first successful web server, so while it is very robust and battle-hardened, it is also quite primitive in some rather fundamental ways. Most notably, in how it handles simultaneous requests. Basically, the problem is all those memory-hungry worker processes hanging around waiting on various kinds of IO (input/output) from the file system and/or the database.

The other pain point is the approach of embedding the ability to process PHP directly into each web worker process using `mod_php`. Teaching Apache to talk PHP with `mod_php` works effectively, but not efficiently! Apache is not optimised to be a PHP server, it's design is intentionally generic, allowing it to severe web apps written in just about any language.

Can we replace Apache with something else?

### The New Architecture

The move to Allison's current stack involved upgrading to a new version of Linux (Rocky Linux 9), and two significant changes to the stack. The Linux upgrades is unremarkable, so let's look at the other changes in turn.

### Apache → NGINX + PHP-FPM

If you think about it, in our previous LAMP setup Apache was doing double-duty, it was handling the intricacies of web serving, and the execution of PHP code. Why not split those two roles apart so both can be optimised separately?

This is where NGINX comes into the picture — NGINX is a much more modern web server than Apache, and it has a much more efficient mechanism for handling concurrent connections. Rather than having lots of workers waiting on various IO tasks it runs a single master processes that rapidly cycles its attention between all the requests that are not currently waiting on IO operations. This approach reduces the RAM and CPU load on the server dramatically, and, it gives users snappier responses to boot!

NGINX is a superb web server, but it is **only** a web server, it can't execute any code, not Python code, not Ruby code, not PHP code, nothing! So we need something else to run the Wordpress PHP code as and when needed. This is where PHP-FPM comes in.

PHP-PFM is the PHP *PHP FastCGI Process Manager*. CGI is the *Common Gateway Interface*, and is a completely generic mechanism for web servers to request code execution in any language. FastCGI is a particularly efficient implementation of the CGI standard, and PHP-FPM is an extremely efficient FastCGI PHP executor.

Rather than having Apache start a dedicated worker process for each request, and have it teach each each of those workers how to execute PHP code, NGINX uses a single very efficient master process, and out-sources the execution of all PHP code to the very efficient PHP-FPM.

These optimisations make it possible for a single Linux VM to process many more web requests simultaneously using the same amount of RAM and CPU when compared to what you can achieve with Apache.

So, moving away from Apache would have been enough to buy Allison some more time, there was another opportunity for even more optimisation — caching.

### Adding Caching (CloudFlare)

The `podfeet.com` website is not updated many times per day, let alone many times per hour or per minute, so having NGINX+PHP-FPM render each page from scratch for each visitor is needlessly wasteful — until Allison posts a new post or a listener leaves a new comment, the HTML+CSS+JavaScript returned by the Wordpress code will be the same for every visitor. All that RAM, CPU, disk-IO, and all those database queries are just re-creating the same output over-and-over-and-over again.

Why re-generate every page every time? Why not cache the pages that don't change, at least for a while?

It's possible to configure NGINX to do that kind of caching, but that means more configurations to maintain, and caches, like databases, benefit from careful fine-tuning. Since we live in a Software-as-a-Service world, would it not be better to out-source that expertise too?

This is where CloudFlare enters the picture.

Not only does CloudFlare offer intelligent caching, it also offers a bunch of additional useful features (more on those in a moment), but better still, is saves the need for requests that can be handled by the cache ever even reaching the server at all.

CloudFlare's infrastructure sits between your actual web server and the internet, so browsers send their requests to CloudFlare which then reaches back to your server only when needed. Instead of storing caches pages on your server, consuming your resources, the cached copies are stored in CloudFlare's world-class Content Delivery Network (CDN). CloudFlare are world leaders when to comes content delivery, and their freemium model makes it an excellent option for individuals and small organisations. Sites like `podfeet.com` don't need anything more than the free tier, and even that ties offers some real benefits:

1. **Intelligent caching** — CloudFlare's caches are expertly tuned, and since they deliver more websites than anyone else in the world there really is no one better to configuring your cache for you!
2. **DDOS Protection** — because their infrastructure sits in front of your server, they can soak up even the biggest denial of service attacks and save your website from getting knocked offline.
3. **Web Application Firewall (WAF)** — as well as intelligently caching your website, CloudFlare also check incoming requests against known malicious behaviour, blocking likely malicious requests before they ever reach your server.
4. **Traffic Shaping Rules** — the simplest kinds of traffic shaping rules are rate limits, but CloudFlare's rules can do much more than that. Do note the free plan does limit the number and complexity of your rules.
5. **World-Class DNS Hosting** — the easiest way to configure CloudFlare is to move your DNS hosting to them (there are other options), and this is a real win-win because it takes the least possible amount of effort, and you get a great free service! Their authoritative DNS servers are robust and fast, and their DNS control panel is powerful and easy to use.

Note that Allison needs a traffic shaping rule to rate-limit requests to the XML-RPC URL for the site, because API endpoints can't be cached, and spammers like to use the URL to try bulk-add ping-backs and/or comments to posts.

## A Contemporary Post's Tale

To really see how this new architecture works, let's follow another article, but this time, we need to follow it not just as Allison posts, and as the first reader reads, but also when the second reader reads, because something very different will happen for them.

### Part 1 — Allison Posts

Allison is still using the Mars Edit client, so the new article and its attachments are still being uploaded via HTTPS requests to the XML-RPC URL. The first difference is that when Mars Edit contacts the IP address it has resolved for `podfeet.com`, it won't be communicating with Allison's server, but with CloudFlare's nearest available server, most likely in LA. Assuming the Mars Edit connections pass Cloudflare's various security checks, the CloudFlare server will relay the connection to the web server app now running on Allison's server. Note that because both Wordpress and Cloudflare correctly use the parts of the web standards for managing caches, no communications with the XML-RPC endpoint will ever get cached by Cloudflare.

The web server now running is NGINX, so it will receive the requests from Mars Edit. Unlike Apache, NGINX can't execute PHP code, so it will pass the request to PHP-FPM. PHP-FPM will run the Wordpress code which will update the database and save any attachments into the Wordpress uploads folder, just like Apache previously did.

The article is now published.

### Part 2 — The First Reader

The first browser to try view the new article will almost certainly be Allison's as she verifies everything looks good before posting about the new article to social media. So, let's just assume the brewers is Safari.

Like Mars Edit, Safari resolves `podfeet.com` to an IP address and sends an HTTPS request for the new article to that IP. Again, that will be a CloudFlare server. After the requests passes all CloudFlare's security checks, the CloudFlare server will check its cache to see if it already has a copy of the article saved. This is a new article that hasn't been viewed yet, so it won't.

Like before, the CloudFlare server will relay the request to Allison's server where NGINX will handle it. NGINX will again pass the request to PHP-FPM which will execute the Wordpress code, including the code for Allison's theme and the various plugins she has installed to generate the HTML code for the rendered article. PHP-FPM will pass that HTML back to NGINX which will pass it back to the CloudFlare server, **which will cache it**, before finally passing it back to Safari.

When Safari receives the HTML it will include references to the files Allison attached to the article, so Safari will make further requests to get those files too. Let's assume these files are images (they almost always are), so Safari will ask the CloudFlare servers for each image. We'll just follow the first of those requests.

Again, the CloudFlare server will check its cache, but again, since this is a new content that has not been viewed yet, it won't find a cached copy, so it will again relay the request to Allison's server. NGNIX receives the request, but since this is a request for an image file, it doesn't need any help, so it simply fetches the image from the Wordpress uploads folder, passes it back to the CloudFlare server, **which caches it**, before passing it back to Safari which display it. 

### Part 3 — The Second Reader

Let's assume NosillaCastaway Joop is as active as ever on the [Podfeet Slack](https://podfeet.com/slack) and sees Allison's post about the new article first. He clicks on the URL and his copy of Safari resolves the `podfeet.com`  name to the CloudFlare server nearest to him in the Netherlands. The Dutch Cloudflare server checks the Cloudflare CDN for a cached version of the article's URL, and finds the HTML the server in LA cached when Allison checked the article from her Mac. Rather than reach back to Allison's server, it just replies with the cached HTML, which Joop's Safari starts rendering. Again, it contains images, so Joop's Safari asks the Dutch CloudFlare server for those, and again, they exist in the cache, so the Dutch Cloudflare server replies to Joop's Safari with the images without ever contacting Allison's server.

## Final Thoughts — the New Design's Implications

This new design offers many new efficiencies which are greatly reducing the load on Allison's server:

1. Overly eager bots are being block by Cloudflare's traffic shaping rules before ever reaching Allison's server
2. Known malicious requests, including from any detected DDOS activity, are also being blocked
3. The CloudFlare cache is reducing the number of legitimate requests that Allison's server needs to process
4. NGINX+PHP-FPM are processing the remaining requests that do need to go to the server more efficiently

There are two obvious drawbacks though:

1. The setup has become more complex, so it's more difficult to understand and troubleshoot
2. The logs within Wordpress and on Allison's server are now systematically undercounting visits, the only logs that give the full picture are on CloudFlare, and free users get limited access to those logs (it's not bad, but it's less than you can get on your own server)

I think it's fair to say the advantages greatly outweigh the drawbacks, and the `podfeet.com` site is faster and healthier than it's been in some time!
