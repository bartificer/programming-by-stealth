# PBS Tibit 4 of Y — Re-thinking a Web App – from Web Server to Cloud Stack

In the main PBS series we're hovering on the edge of moving from purely client-side JavaScript apps to full web apps with a client and *'server'* side, but as we approach that word *server* is becoming every more abstract. At this stage it really does just mean *"something on the other side of an HTTPS connection"* - the days of web servers just being remote computers are well and truly over.

I've been thinking about this a lot because I've just finished helping Allison migrate her website from the old-world single-server model, to a modern cloud architecture, and boosting her site's performance by a few hundred percent in the processes (no exaggeration ).

From the point of view of a visitor www.podfeet.com is a website, but from Allison's point of view it's a web app. To be more specific, it's an instance of the popular open source content management system (CMS) [Wordpress](https://wordpress.org/). Allison doesn't edit a folder full of HTML files, she uses a web interface and a third-party client to manage the site and its contents.

## Matching Podcast Episode

TO DO

## What is a Web Server?

A web server is a piece of **software** that listens for in-coming HTTP requests from the network, and replies with HTTP responses.

When a user visits `www.podfeet.com` their browser connects to a web server and asks it for Allison's web page. The server responds with some HTML (which embeds references to other content like images, style sheets, and JavaScripts that the browser has to fetch in turn). The same things happens when Alison visits her Wordpress admin area. When Allison uses MarsEdit something only slightly different happens — there is no browser in this case, but the app sends HTTPS requests to a special URL on Allison's site referred to as an API-end-point, and the server responds to the app appropriately. Another difference is that the app and the API exchange XML rather than HTML.

Regardless of whether it's a browser or an app asking for information, the web server is receiving requests, and responding with some data, usually some HTML, CSS, JavaScript, XML, or an image. The big question for us today is how those responses get generated.

### Static -v- Dynamic Content

As we'll see later, the request sent by the web server may get passed around a few times before a web server process finally does the work to fulfil the request. But regardless of the path by which the request arrives, the web server process has two fundamental choices for how to answer:

1. Return the contents of a file
2. Execute some code to calculate the response

We refer to files that are returned as-is as *static content*, and code that gets executed as *dynamic content*.

### Web Server Actions

When a web server receives a request for a particular URL is uses its configuration to figure out what to do with it. Web servers have four basic choices for generating their response:

1. Map the URL to a local **cache** entry that's not expired yet and return it.
2. Map the URL to a **local file** and return its contents.
3. Map the URL to a **local executable file**, run it, and return the results.
4. Pass, or **reverse proxy**, the request to another web server, wait for a response, and parrot that back to the client. **Put a mental in in this, it will become very important later.**

There is lots of web server software out there. Some of it is extremely generic and does a decent job of just about everything, like say the [Apache web server](https://httpd.apache.org/), and some is extremely task-specific like the open source [Varnish web cache](https://varnish-cache.org/intro/).

## Where do Database Servers Come In?

If a web server has to execute code to fulfil a request, then that code can do anything code can do, including reaching out to other resources. Something many server-side web apps need to do is store data in a structured format that can be efficiently searched. That is literally what databases were invented to do!

A database server is a piece of **software** that listens for in-coming requests, usually in the Standard Query Language, or SQL, carries out the requested search, store, update, or delete request, and returns the result or outcome. Like web servers, most database servers can listen for incoming network connections, but many can also listen through file-system-based connections known as *sockets*.

For the purpose of this instalment I'm going to pretend there's only one kind of database, the so-called *Relational Database Management System*, or RDBMS. RDBMSes are the Rolls-Royce of data storage — they make robust data integrity promises, support atomicity across complex transactions, support roll-back when things go wrong, and provide all that with impressive querying speeds through advanced indexing techniques. RDBMSes are some of the most impressive software as yet developed by humanity IMO. But, and it's a big but, all that comes at a price — these things are resource hogs, and they don't distribute well. Because of this, a lot of social media-like sites are prepared to accept *eventual* data integrity in exchange for vastly reduced load, and ease of distribution, so there's a whole other class of database out there we're going to completely ignore!

In the corporate world the king of the databases is Oracle, and in the open source it's MariaDB, a community fork of MySQL that was branched from it when Oracle bought it. MySQL/MariaDB are lighter-weight databases than Oracle — they require fewer resources, but also offer less advanced functionality. For those in the open source world who want the power and complexity of Oracle there's PostgreSQL 🙂

## The Old Way — A Single-Server LAMP Stack

Allison's infrastructure leading into this big move was very much in keeping with the norms for a medium-sized website a decade or so ago. The entire site was delivered from one cloud-hosted virtual machine, it was a classic LAMP stack:

1. CentOS <strong>L</strong>inux powering the VM
2. The <strong>A</strong>pache web server serving all content
3. A local installation of <strong>M</strong>ariaDB storing the data
4. Apache executing the Wordpress <strong>P</strong>HP code using `mod_php`

Linux, Apache, MySQL (MariaDB), and PHP — LAMP.

With this setup there is a one-to-one mapping between the server powering the site, and the site itself.

For small sites this architecture works very well, and it can work fine for smaller medium-sized sites, but as a site grows, this approach begins to fall apart. You can defer a major rearchitecting for a while by first fine-tuning the configurations, and then throwing more resources at the single virtual machine, but you soon run out of runway, and your site will start hitting tipping points where its performance simply collapses.

While a VM has plenty more resources than the website it hosts holds, you don't have to worry about optimising your configurations. It'll be grand!

But, if you're lucky enough that your site grows, you'll soon start to bump your proverbial head off the ceiling from time-to-time. Website traffic is bursty, not constant, so at first you'll just get the occasional glitch that will probably go un-noticed. But the glitches will start happening more and more, and soon you'll need to start to tweaking your configs so you use the resources you have efficiently.

> MAYBE — funnel analogy about why sites collapse exponentially
{: .aside}

As you start to optimise, you'll soon start to encounter pain-points.

### Pain-Point 1 — Being a DB is HARD!

Getting MySQL/MariaDB installed and working is easy, getting an installation to remain performant under load is the inverse of that. It's not for nothing that DBA (DataBase Administrator) is a career, and a really well paid for one at that!

You can use automated tools like the open source [MySQLTuner Perl script](https://github.com/major/MySQLTuner-perl) to get you to a decent configuration, but unless you're actually a DBA, you're not going to get beyond *acceptable*.

### Pain-Point 2 — Optimising Apache is not Much Easier!

Apache is the *grand old dame* of the web server world, and while that means it's very robust and reliable, it also means it's carrying around a lot of technical debt. IMO, the most expensive piece of that technical debt is Apache's multi-tasking model. Each HTTP request is processed by a different worker process, so Apache has to manage an army of child processes, each of which has to be allocated some RAM to work. If you have too many workers your machine runs out of RAM and things grind to a halt, if you have too few, clients are left waiting for ages, and your site grinds to a halt. Apache's algorithm for managing it's workers is parameterised, and it's your job to tweak all those parameters if you want Apache to run smoothly. Not to put too fine a point on it — it's a dark art and a frustrating time-sink!

### Pain-Point 3 — Efficiently Executing PHP Code is not so Simple

One of the things web servers do to respond to HTTP requests is execute code. In the case of Wordpress, that means executing PHP code.

Getting Apache to execute PHP code is easy, getting it to so efficiently, not so much!

Apache is designed to be modular, so it uses *modules*, or *mods* to execute code. The simplest way to get Apache to execute any code in any language is with `mod_cgi`. This simple little module reads the shebang line at the top of the script to determine which interpreter to use, and then invokes that interpreter on the file in an entirely new process. This works, but it's spectacularly in efficient!

Instead of having the Apache worker start a new process each time, what you really want is a module specifically for your language, that way the worker processes can execute the code themselves, avoiding a lot of overhead. That's how `mod_php` works, and that's Allison's old server was using.

But, while `mod_php` is a lot more efficient than `mod_cgi`, and while it was the recommended option for many years, it's been well and truly superseded now.

### Pain-Point 4 — You Can't Serve Two Masters

While it takes work, an amateur sysadmin can probably get MySQL/MariaDB running reasonably efficiently, and the same is true of Apache. Where things will inevitably go wrong is when the load starts to build, and both start to compete for the same ever shrinking pool of available resources. Both will be trying to maximise their use of what little RAM is available, and there are dependencies between the two, so a very destructive negative feedback loop will soon set in, and delays will grow exponentially as each gets ever crankier waiting on the other!

## The Old Solution

Before our modern cloudy world, the road the pain-points above funnelled you down was paved with additional servers you had to manage yourself.

The first step was to split the DB and web server roles across two VMs, one for each role. You now have two Ones to manage, but at least you can optimise your configuration of each piece without them fighting with each other. This will buy you a little more headroom.

The next step would be to replace the single DB VM with a cluster. This gives you more performance, and the possibility to do some smart optimisations — you might have a read-only member of the cluster on which you do all your reporting & backups for example.

Again, this would buy you some more headroom, but now you're managing at least three VMs so three OSes to keep maintained!

At this stage your DB would be very robust, but that's likely to have turned the web server into a bottleneck, so how do you improve that? More VMs! You move the authoritative copy of your site's files off the web server VM and onto either a shared network drive, or, into version control with scripts to deploy it each time a change is pushed. Then, you duplicate the web servers, each with access to the same DB cluster and the same code, but now you have to have many servers be one website, how do you do that?

You could use a multi-valued DNS entry, listing multiple IPs for the same domain name, but that's actually a very poor solution. It means changes to the cluster take hours to propagate, and you have no control over which client goes where, each visitor's computer will randomly pick one of the IPs. Worse still, each user will randomly jump around from server to server, so if the site requires a login the sessions are likely to get all messed up.

What you need now is **another** VM, or ideally another cluster of VMs to run a load-balancing reverse proxy for you, like the free and open source HAProxy.

So, taking stock, with the old way, when a site out-grew a single VM you were on a road to needing at least some, if not all of:

1. A cluster of DB servers, each of which you have to manage
2. A cluster of web servers, each of which you have to manage
3. Some mechanism for sharing the website code between the web servers, which you also have to manage
4. One or more VMs to sit in front of it all as a load balancer, each of which you have to manage

This is why corporations need IT departments 🙂

## A Brighter Future in the Cloud

Thankfully for Allison's brain and wallet, we didn't need to do any of that to get her website working reliably again, we went down a much more pleasant path!

### You Don't Need to be a DBA!

Since properly administering a database is so bloody hard, the lowest hanging fruit when it comes to *cloudifying* a site is to move the database off the virtual machine you run yourself, and off into the cloud on someone else's infrastructure. All the major cloud platforms will sell you *hosted databases* or *database as a service*. These are so-called *Platform-as-a-Service*, or PaaS offerings. You pay a monthly fee, and managing your DB becomes someone else's problem, someone else with all the right skills to make it run smoothly and efficiently!

I made this move for my own Wordpress installs some years ago, and this is the first big change we made to Allison's stack. It helped, but it wasn't enough.

### It's Web Servers all the Way Down!

Before we go any further, I need to draw your attention to something — when I listed the four things a web server can do, one of them was reverse-proxy a request to another server. This has a very important implication — **a single web request can be processed by many web servers, each adding some needed functionality**.

Apache is a very impressive piece of software, it really can do anything you could think of asking a web server to do, but that kind of generalism comes at a price — Apache is good at many things, but IMO, not great at anything. The modern approach is not to have a single web server that can everything, but to break the task into pieces, and to use software that's great at specific things to do those specific things.

### NGINX — The Switch-board Operator of Webservers!

Apache started as a simple web server for hosting files on the internet, and from there it grew to include the ability to execute code, and later, to act as a reverse proxy. It can be configured as a proxy server, but that's not its primary function.

NGINX is a like a faded mirror image of Apache — it was built to be a fantastic caching reverse proxy, but can serve files too. Unlike Apache, NGINX doesn't need to be tuned to work efficiently. It doesn't spawn hundreds of worker processes that need to be managed, it uses a single process per-CPU, and each process handles multiple requests in apparent parallel. That's a big deal to me!

Another big difference is the configuration syntax — Apache uses something that sorta-kinda looks like XML, but it uses C-style comments, and it's very verbose. NGINX uses a very concise syntax that uses curly braches to nest groups of statements, making it feel more like a programming language than a traditional config file. I can write more powerful configs more concisely and more clearly for NGINX than I can for Apache, so I find it infinitely easier to administer.

NGINX is great at doing things like returning redirects, serving data from its caches, serving static files, not to mention reverse-proxying requests to other web servers. The one thing NGINX can't do is execute code. NGINX cannot run your PHP code for you. And yet, we switched Allison's PHP-powered Wordpress site from Apache to NGINX, how is that possible‽

### FastCGI to the Rescue!

The open source community have put a lot of time and effort into developing more efficient ways of executing code on web servers, and one of the things they've come up with is a very efficient protocol for sending an execution request from one web server to another — FastCGI.

So, when you use NGINX as your web server you use FastCGI to send any PHP code that needs executing to an execution server. An execution server is simply a piece of software that listens for network connections and accepts and processes FastCGI requests. For PHP, the most commonly used execution server is [PHP-FPM](https://www.php.net/manual/en/install.fpm.php), which stands for *PHP FastCGI Process Manager*.

# From LAMP to LEMP

A quick recap — Allison is now running a single VM that stores the static files & website code, and serves the them to the world with NGINX+PHP-FPM. The PHP code stores its data in a cloud-hosted (PaaS) MySQL database. Her server VM is still Linux, so the VM itself still has the same `L` as the original LAMP stack, but the `A` (Apache) has been replaced with NGINX. Now, no one could pronounce LXMP as a stack, so the community have gotten into the habit of spelling NGINX phonetically (*engine-X*) when developing acronyms, so the `A` becomes an `E`. The site is still powered by PHP (though it's now being executed more efficiently thanks to PHP-FPM), so the `P` at the end remains un-changed too. So, the VM itself gives us LEP, but it doesn't provide MySQL anymore. But remember, it's the *website* that's powered by the stack, so the `M` has not vanished, it's simply moved off the VM and into the cloud.

So, with all that, the podfeet.com website has moved from LAMP to LEMP, and gotten a heck of a lot faster in the process!

For completeness I should also mention that Allison is using Let's Encrypt's CertBot to automatically maintain an HTTPS cert on the VM.

### ADCs & WAFs

But wait, there's more!

Wordpress does some caching internally, but there's no dedicated caching layer on the VM. There's also no security layer scanning the in-coming HTTP requests looking for malicious activity.

Two very related acronyms are relevant here, *Application Delivery Controller* (ADC), and *web application firewall* (WAF).

WAFs came first, and they generally took the form of a specialised reverse proxy sitting in front of the web server(s). A WAF is a very special-purpose web server that listens for HTTP requests, scans them for security issues, and either returns an error or reverse-proxies the requests to the web server that's serving the site. WAFs can scan for all sorts of things, including:

* Connections from known malicious IPs
* Attempts to exploit known vulnerabilities
* Attempts to exploit known common bugs, .e.g. attempted SQL injection
* Brute-force attempts against login forms
* Denial of Service (DOS or DDOS) attacks

All by itself this would be extremely useful, but once you have something sitting in front of your website, why not leverage it to do more? To distinguish WAFS with extra features from those without, they became known as ADCs. ADC is a very broad and wooly term, it's the name put on anything that adds any value by being placed in front of your web servers. Some things ADCs can do:

* Implement caching
* Implement some kind of Quality of Service (QoS) rules to prioritise important URLs
* Provide SSL-off-loading, i.e. let the ADC be where HTTPS stops, then pass the query back over HTTP — this is only safe if the network behind the ADC is private.
* Control load-balancing across multiple web servers
* Provide a CDN for more efficient delivery of media files
* Provide DNS proxying for additional robustness

So, podfeet.com is now sitting behind CloudFlare's free cloud-based WAF/ADC offering. This is providing caching, malware/DDOS protection, and DNS proxying for the site.

## Possible Future Enhancements

At the moment Allison's site is running great on this new architecture, but there's a lot more runway for expanding the site's capacity in future. The change from the old single-server architecture to the new cloud architecture means the site has gone from the very end of the runway in terms of capacity increases to the very start of a new and much longer runway. From here, small changes can be added to keep boosting the site's capacity for a long time to come.

There's no need to do any of this now, but here are some of the options open to Allison in the future:

1. Move the podcast feed XML files to a CDN (should be possible to do without changing the URLs)
2. Move the site's files and code to cloud storage, then add more web server VMs (this would probably require upgrading from the free CloudFlare package to one that supports load balancing).
3. Upgrade the existing DB service to a higher capacity offering

To some extent, the sky really is the limit now!

## Final Thoughts

If you're a long-time fan of Allison's shows you've probably enjoyed hearing some of the nerdy detail of her recent website upgrade — you got to listen along to the pain and then the bumpy upgrade process as we went, but if even if you're not, and you just follow along with Programming by Stealth, I'm hoping it was valuable to get an idea of how modern websites are delivered. I think it's good to understand all the moving parts, and at the very least, I hope you have a few more acronyms under your belt now 🙂
