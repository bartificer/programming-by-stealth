# PBS Tibit 4 of Y — Re-thinking a Web App – from Web Server to Cloud Stack

In the main PBS series we're hovering on the edge of moving from purely client-side JavaScript apps to full web apps with a client and *'server'* side, but as we approach that word *server* is becoming every more abstract. At this stage it really does just mean *"something on the other side of an HTTPS connection"* - the days of web servers just being remote computers are well and truly over.

I've been thinking about this a lot because I've just finished helping Allison migrate her website from the old-world single-server model, to a modern cloud architecture, and boosting her site's performance by a few hundred percent in the processes (no exaggeration ).

From the point of view of a visitor www.podfeet.com is a website, but from Allison's point of view it's a web app. To be more sepecific, it's an instance of the popular open source content management system (CMS) [Wordpress](https://wordpress.org/). Allison doesn't edit a folder full of HTML files, she uses a web interface and a third-party client to manage the site and its contents.

## Matching Podcast Episode

TO DO

## What is a Web Server?

A web server is **a piece of software** that listens for in-coming HTTP requests from the network, and replies with HTTP responses.

When a user visits `www.podfeet.com` their browser connects to a web server and asks it for Allison's web page. The server responds with some HTML (which embeds references to other content like images, style sheets, and JavaScripts that the browser has to fetch in turn). The same things happens when Alison visits her Wordpress admin area. When Allison uses MarsEdit something only slightly different happens — there is no browser in this case, but the app sends HTTPS requests to a special URL on Allison's site referred to as an API-end-point, and the server responds to the app appropriately. Another differene is that the app and the API exchange XML rather than HTML.

Regardless of whether its a browser or an app asking for information, the web server is receiving requests, and responding with some data, usually some HTML, CSS, JavaScript, XML, or an image. The big question for us today is how those responses get generated.

### Static -v- Dynamic Content

As we'll see later, the request sent by the web server may get passed around a few times before a web server process finally does the work to fulfil the request. But regardless of the path by which the request arrives, the web server process has two fundamental choices for how to answer:

1. Return the contents of a file
2. Execute some code to calcululate the response

We refer to files that are returned as-is as *static content*, and code that gets executed as *dynamic content*.

### Web Server Actions

When a web server receives a request for a particular URL is uses its configuation to figure out what to do with it. Web servers have four basic choices for generating their response:

1. Map the URL to a local **cache** entry that's not expired yet and return it.
2. Map the URL to a **local file** and return its contents.
3. Map the URL to a **local executable file**, run it, and return the resulsts.
4. Pass, or **reverse proxy**, the request to another web server, wait for a response, and parrot that back to the client.

LEFT OFF HERE!!!

## Final Thoughts

TO DO
