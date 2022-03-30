# PBS Tibit 4 of Y — Re-thinking a Web App – from Web Server to Cloud Stack

In the main PBS series we're hovering on the edge of moving from purely client-side JavaScript apps to full web apps with a client and *'server'* side, but as we approach that word *server* is becoming every more abstract. At this stage it really does just mean *"something on the other side of an HTTPS connection"* - the days of web servers just being remote computers are well and truly over.

I've been thinking about this a lot because I've just finished helping Allison migrate her website from the old-world single-server model, to a modern cloud architecture, and boosting her site's performance by a few hundred percent in the processes (no exaggeration ).

From the point of view of a visitor www.podfeet.com is a website, but from Allison's point of view it's a web app. To be more sepecific, it's an instance of the popular open source content management system (CMS) [Wordpress](https://wordpress.org/). Allison doesn't edit a folder full of HTML files, she uses a web interface and a third-party client to manage the site and its contents.

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


### It's Web Servers all the Way Down!

Before we go any further, I need to draw your attention to something — when I listed the four things a web server can do, one of them was reverse-proxy the request to another server. This has a very important implication — **a single web request can be processed by many web servers, each adding some needed functionality**.

Apache is a very impressive piece of software, it really can do anything you could think of asking a web server to do, but that kind of generalism comes at a price — Apache is good at many things, but IMO, not great at anything. The modern approach is not to have a single web server that can everything, but to break the task into pieces, and to use software that's great at specific things to do those specific things.

### NGINX — The Conductor of our Orchestra

LEFT OFF HERE!!!

## Final Thoughts

TO DO
