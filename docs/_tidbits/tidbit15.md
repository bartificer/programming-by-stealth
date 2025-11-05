---
title: Building an Indie Author Site with Hugo by Eddie Tonkoi
instalment: 14
creators: [bart, allison, eddieTonkoi]
date: 2025-11-05
---

This is Eddie Tonkoi, with a special **Tidbit episode** for *Programming By Stealth*. Bart and Allison have kindly let me take the mic for a short solo story — one that began, like so many good adventures, with a podcast rabbit hole.

## Matching Podcast Episodes

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2025_11_05.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/PBS_2025_11_05.mp3" >Download the MP3</a>

Read an unedited, auto-generated transcript with chapter marks:  <a href="https://podfeet.com/transcripts/PBS_2025_11_05.html">PBS_2025_11_05</a>

## Background

For years, I’ve listened to [*The Creative Penn*](https://www.thecreativepenn.com/the-creative-penn-podcast-for-authors/), Joanna Penn’s wonderful show about the craft and business of writing. In one episode, Joanna mentioned a conversation on [*Lenny’s Podcast*](https://www.lennysnewsletter.com/p/the-ultimate-guide-to-aeo-ethan-smith) with **Ethan Smith**, the CEO of [Graphite](https://www.graphitehq.com/), and that talk genuinely changed how I thought about our author website. Ethan was discussing **Answer Engine Optimization**— or **AEO** — the idea that as AI tools like ChatGPT and voice assistants start answering questions directly, we need to structure our sites so they can *understand* our content — and *credit us* as the source.

That concept lit a fire under me. I realised that while we already had a decent indie-author website, it wasn’t truly *discoverable* in this new AI-driven world. If someone asked, “Who wrote *Murder in Treggan Bay*?”, I wanted the answer to come from *our* site — not some random retailer’s database.

To check how we were standing, I went to ChatGPT and asked it about our website, and was told it couldn't read it. ChatGPT could not see the contents of our website. At all.

Slightly horrified, I rolled up my sleeves and set out to rebuild our author platform from the ground up — optimised for both traditional SEO and this emerging world of AEO. The result was five intense days of work, a steep learning curve, and more than a few stealth lessons in programming along the way.

Allison first heard about this adventure in a shorter piece I did for the *NosillaCast*, and she suggested I share a deeper dive here on *Programming By Stealth*. So, in this Tidbit, I want to tell you the whole story — how a single spark on *The Creative Penn* led to a fully automated, Hugo-based website on Cloudflare, and what I learned about programming, publishing, and the future of web discovery along the way.

## The Problem to be Solved

My wife, Jern Tonkoi, is passionately writing creative fiction, bringing characters to life and crafting mysterious worlds. I may not have her storytelling gift, but I do have the technical know-how and the enthusiasm to support her in everything that *isn’t* writing the novel — editing, publishing, marketing, you name it. One big part of that is the website at [jerntonkoi.com](https://jerntonkoi.com/).

Our indie-author site was hosted on a platform called Kit, which was fantastic for building and maintaining an email list for readers. But I realised something worrying: the site wasn’t searchable by tools like ChatGPT. That meant if someone asked an AI, “Who is the author of *Murder in Treggan Bay*?”, our site might not be recognised as the source of the answer. In an age of AI-driven search, that’s a major missed opportunity.

So I decided to take control — to optimise our web presence for both traditional search engines and these new “answer engines.” The solution I landed on was to rebuild the site as a **static website** generated with **Hugo**, an open-source static site generator; host it on **Cloudflare Pages**; and deploy updates automatically through **GitHub** integration.

In plain English, that means that instead of relying on a database or a hosted platform, our site is now a collection of pre-built HTML pages that I generate locally and serve to the world through Cloudflare’s network.

Why Hugo, and why a static site? Two reasons: *speed* and *control*. Static sites are blazingly fast — no waiting for a server to build pages on the fly — and I get full ownership of both the content and the code. Plus, I’ve always had a soft spot for simplicity. Back in the day, I hand-coded websites in a text editor, line by line — no dynamic magic, just raw HTML. A static site felt like going “back to basics,” and that appealed to me.

So I rolled up my sleeves again and, in five days, built a brand-new website for Jern’s books from scratch. Now, let me tell you how that went — and what I learned, often *by stealth*, along the way.

## What is Hugo?

If you haven’t encountered it before, [Hugo](https://gohugo.io) is a popular open-source static site generator written in Go (the Go programming language). On its homepage Hugo boldly touts itself as *“the world’s fastest framework for building websites,”* and promises that its *“amazing speed and flexibility… makes building websites fun again.”*[[1\]](https://gohugo.io/#:~:text=The world’s fastest framework for building websites) That sounded perfect for my needs – who doesn’t want fast and fun?

But what does Hugo actually do? In essence, Hugo takes content you write (like markdown text for blog posts or, in my case, book descriptions) and merges it with templates that you design. The end result is a bunch of static HTML files that you can deploy anywhere. It’s like a high-speed printing press for web pages – you feed in your raw content and layout designs, and out come fully-formed web pages ready to serve to users. No databases or server-side code required for the live site.

This idea resonated with me because it reminded me of how I built websites “back in the day,” hand-writing HTML in a text editor. No fancy JavaScript frameworks, no content management systems – just me and my `<h1>` tags in a Notepad window. Hugo brings that spirit back, but with modern conveniences. It lets me define a template for, say, a “book page” once, and then reuse that template for every book in our catalogue. I write each book’s details in a simple text file, and Hugo takes care of merging those details into the template to produce a consistent, nicely formatted page for each book. I get the simplicity and clarity of static HTML, but I don’t have to repeat myself or manually tweak dozens of pages when I want to change a layout – Hugo does that heavy lifting for me.

So, Hugo is basically a tool that **generates** the website for me. I maintain source files (content and templates), and Hugo spits out the actual site. This gave me a lot more control than the old Kit-based site, and it meant I could fine-tune the site’s structure and SEO to my heart’s content.

## How Hugo Works

I started my Hugo project by choosing a basic layout, or theme, for an author website. That initial layout gave me a decent structure out of the box, but I quickly dove in to customize it. At the heart of a Hugo site are **templates** that define how different types of content should look. For example, I have one template for an individual **book page** and another for a **book series page**. These templates are written in HTML with some special Hugo syntax sprinkled in (those are the curly braces you’ll see in Hugo files).

One powerful feature of Hugo (and static site generators in general) is the ability to use **partials**. Partials are like reusable chunks of template that you can include in other templates. Think of them as sub-templates or components. For instance, on both a book page and a series page, I wanted to display a book in a list as an attractive card, so something like a cover image, the book title and a caption underneath. Rather than duplicating the same HTML in both the book template and the series template, I created a partial file called book-card.html that contains the HTML and styling for rendering a book card. Then, in my book page template and in my series page template, I simply insert that partial with a one-liner: `{{ partial "book-card.html" . }}`.

That little snippet tells Hugo, “Grab the book-card.html partial and drop it in here, using the current page’s data (represented by the .) as context.” This way, if I ever want to change how book cards are displayed site-wide, I edit the book-card.html partial in one place, and Hugo will apply that change everywhere the partial is used. I don’t have to hunt through multiple templates to update each one – a huge win for maintainability.

Now, here’s where the **programming by stealth** aspect comes in. While working on these templates and partials, I realized I was essentially writing code. Hugo’s templating language (which is based on Go templates) lets you do a lot of things real programming languages do: you can use variables, loop over lists of items, check for conditions, call functions, etc. As one tutorial put it:

> “With Hugo templating, you can control how your page is rendered. You can use variables, loop over arrays, check conditions, and run functions. Think of it as a simple programming language to help build the pages on your site. Those curly braces in your layout `{{ }}`, that’s Hugo templating.”[[2\]](https://cloudcannon.com/tutorials/hugo-beginner-tutorial/hugo-templating-basics/#:~:text=With Hugo templating%2C you can,that’s Hugo templating)

I genuinely experienced that first-hand. For example, in my book list page (for an overview of all books in a series), I wrote a loop to automatically iterate over all the book pages and display each book’s title and cover in a grid. In code, it looked something like `{{ range .Pages }}` … (some HTML to display each item) … `{{ end }}`, which is Hugo’s way of saying “for each page in this list, do the following with it.” Similarly, I used a conditional in a template to check if a piece of data exists before showing it. One simple case: not every book of ours has a tagline, so in the template I include a block that says essentially *“if this book has a tagline, then insert a* `<p>` *element for it.”*

I even got to use variables inside templates. Hugo lets you set local variables with a simple `{{ $variable := value }}` syntax. I might not have been writing Python or JavaScript, but I was absolutely writing code in these templates – without having realised I’d signed up for a coding project! It was a blast, to be honest. I’d find myself gleefully tweaking a loop or an if statement to get the site to display exactly what I wanted. I was using programming concepts (like loops, conditionals, and reusability) by stealth, all under the guise of “just building a website.”

To summarise: Hugo works by letting me design templates (with a bit of logic in them) and then merging those templates with my content. The templates and partials made it easy to keep the site’s structure DRY (a new term I picked up meaning, Don’t Repeat Yourself). I define things once and reuse them, which is exactly what we strive for in programming as well.

## Content Structure

With the templates in place, I moved on to adding our content – the actual text and data describing Jern’s books. Hugo encourages a well-organized content structure. In my project, I have a folder called content, and inside that I made a subfolder called books (since we’re dealing with books). Hugo treats each subfolder in content/books as a separate piece of content – in this case, each subfolder represents a book on the site.

For example, one of Jern’s novels is *Murder in Treggan Bay*. I created a folder content/books/murder-in-treggan-bay. Inside that folder, I placed three files:

* **index.md** – the main content file for the book (in Markdown format).
* **cover.jpg** – the cover image for the book.
* **extra-1.jpg** – an extra image I wanted to include on that page (in this case, perhaps a map or illustration related to the book).

That’s it – just those three files in a folder. When I run Hugo, it sees the murder-in-treggan-bay folder and knows that it should build a webpage for that book using the book template. The index.md provides the text and data for the page, and the template knows to pull in cover.jpg as the book cover image at the top, and extra-1.jpg further down in the page as supplementary content. Hugo seamlessly blends the content with the layout. I didn’t have to manually create an HTML page for *Murder in Treggan Bay*; Hugo generated it for me by applying the template to the content in that folder.

I repeated this for each book we wanted on the site. I also had “series” pages that group books together (for instance, Jern’s *Treggan Bay Mysteries* series which includes *Murder in Treggan Bay* and _The Wathcman's Secret_). Those had a similar setup in the content folder, allowing Hugo to generate a series overview page listing the books.

This convention-over-configuration approach felt almost magical. I’d add a new Markdown file for a new book, run the Hugo command, and voilà – a new HTML page would appear in the output, perfectly formatted like the others. Under the hood, Hugo was doing a lot of smart work, but as the user I just saw a very simple workflow: write content, run generator, get website.

### index.md – YAML Front Matter

Each index.md file begins with a block of metadata called **front matter**. Front matter is a snippet of data at the very top of the file, usually enclosed by --- lines, lines with three hyphens on them, that provides structured information about the content. In my case I used YAML (a simple text-based format) for front matter. For example, the top of *Murder in Treggan Bay*’s index.md looks like this:

```yaml
title: "Murder in Treggan Bay"
summary: "A Devon Coast Mystery"
date: "2025-10-11"
series: "Treggan Bay Mysteries"
series_id: "treggan-bay-mysteries"
series_order: 1
publisher: "Tonkoi Books"
wordCount: 62000
tagline: "He came to sell a cottage, not count alibis."
```

This is where I put all the key details about the book: the title, a one-line summary, the publication date, which series it belongs to (and in what order), the publisher name, word count, a catchy tagline, etc. None of this text in the front matter actually appears verbatim on the page; instead, Hugo parses this metadata and makes it available to the templates. In other words, front matter is how I feed input data into Hugo’s template engine.

Hugo is pretty flexible about front matter formats – it supports JSON and TOML in addition to YAML[[3\]](https://gohugo.io/content-management/front-matter/#:~:text=Provide front matter using a,matter from the page content). I chose YAML because it’s very human-readable (and I was already getting familiar with it from the editing pipeline I'd been building). The concept is the same regardless of format: it’s key-value pairs describing the content. Some of these keys are standard ones that Hugo expects (like title or date), and others are custom fields I made up (like series or tagline). Hugo will happily ingest them all.

With that written, Hugo stores the front matter values in each page’s data model, ready for me to call it in the template. For instance, if I want to display the book’s title on the page, my template can use `{{ .Title }}` or `{{ .Params.title }}` to insert that title (`.Title` is a convenient property for the title field, whereas `.Params` is a map of all the custom fields I defined.) If I want to show the tagline under the title, I might include something like `{{ .Params.tagline }} `in the template, inside a conditional block that checks it’s not empty. All those front matter fields – summary, publisher, wordCount, etc. – are available for me to use in the templates in this way. It’s a clean separation: content and data in the markdown files, presentation and logic in the templates.

Working with YAML front matter was another little learning experience “by stealth.” YAML itself is a data format commonly used in programming and configuration files. By using it here, I got more comfortable with the syntax (indentation, colons, lists, etc.) and the idea of structuring data. In a way, I was creating a little data record for each book, which is then processed by the Hugo engine – that’s not so different from what happens in a program that reads a config file or database. Yet, it all felt very accessible, since I was just writing in plain English (well, plain text) in my index.md files.

## Answer Engine Optimization (AEO) and SEO

One of my big goals for rebuilding the site was to improve its visibility to question-answering tools like ChatGPT and voice assistants. I didn’t just want our site to rank highly for generic searches (though that’s nice too); I specifically wanted it to provide direct answers to **specific questions** about the books. For example, if someone asked, “What is the first book in the Treggan Bay Mysteries series?” or “Who is the author of *Murder in Treggan Bay*?”, I wanted the answer to be drawn from *our* website, not some random book list or (heaven forbid) not answered at all. Ideally, the AI would respond with the answer **and** cite our website as the source.

This led me into the realm of **Answer Engine Optimization (AEO)**. AEO is like the next evolution of SEO (Search Engine Optimization). Traditional SEO is about getting your site high in the search results for particular keywords. AEO, on the other hand, is about structuring your content so that search engines and AI “answer engines” can easily extract direct answers from it[[4\]](https://www.o8.agency/blog/ai/answer-engine-optimization-guide#:~:text=,markup%2C and question focused content). You’ve probably seen this in action: Google might show a quick snippet that directly answers your question at the top of the results (a *featured snippet*), or voice assistants might read off an answer without you ever clicking a link. That’s what AEO targets. It’s not a black-hat trick or anything spammy – it’s actually encouraged to format your content in a way that machines can parse. In fact, many of the techniques overlap with good SEO: use clear, relevant language, anticipate the questions users ask, and provide high-quality answers. Optimising for search engines in this way turned out to align nicely with optimising for human readers too. If I write a thorough FAQ section for a book page, it not only helps an AI understand the content, it also provides useful info to a curious reader. Making the site answer questions well for AI also meant making it really useful for people – a win-win. How positively charming.

### Structured Data for Answer Engines

I learned that a key part of AEO is adding **structured data** to your pages – extra information in a format that computers can easily digest. Specifically, this means using schemas defined by schema.org to describe the content on the page. Search engines use this structured metadata to build their knowledge graphs. If you want answer engines to notice you, you have to speak their language.

For my book pages, I added a chunk of structured data in JSON-LD format (JSON for Linking Data) following the schema.org “Book” schema. Inside a `<script type="application/ld+json">` tag in the HTML (which Hugo helped generate via a template), I encoded details about each book: the title, the author (Jern Tonkoi), the genre, the series it’s part of, the book’s position in that series, the ISBN number, publication date, etc. This data is invisible to regular visitors, but it’s pure gold for search engine bots. It’s like leaving little clues for the Googlebot and GPTBot saying, “Hey, this page is about a **Book**. Here’s its name, here’s the author, here’s how it relates to other books in a series.”

For example, to target that question “What’s the first book in the Treggan Bay Mysteries series?”, I made sure the structured data for *Murder in Treggan Bay* included something like “series name: Treggan Bay Mysteries” and “series order: 1”. That way, an AI could infer that it’s the first book in the series. I also provided a short synopsis and other facts in the structured data, anticipating questions like “What’s the book about?” or “When was it published?” The idea is to allow an answer engine to pull a precise fact – say, *“Murder in Treggan Bay” (Tonkoi Books, 2025) is the first book in the Treggan Bay Mysteries series by Jern Tonkoi* – straight from our site’s data.

I won’t lie, implementing this was one of the harder parts of the project. I spent a couple of days wrestling with the schema definitions and testing my pages with Google’s structured data tools to make sure I didn’t have errors. It was finicky – the structured data has to be just right for Google to be happy. And even after getting it “correct” syntactically, there’s no guarantee Google will immediately reward you with a featured snippet or an info card. From what I’ve learned, books are a bit of a lesser-known territory for rich search results. (Restaurants and recipes, for example, have very well-developed rich result formats and lots of plugins to help with schema. Books, not so much.) As one author noted, for domains like books you often have to do the schema markup yourself because the tooling is scarce[[6\]](https://hollowlands.com/2018/02/using-schema-org-for-books-an-example/#:~:text=For common knowledge domains%2C there,for creative media knowledge domains). Google does have an “information card” concept for books and authors, but it’s not as automatic as with some other topics.

That said, I did manage to get our pages marked up in a way that should be conducive to AEO. I included an FAQ section on each book page (with questions like “Who are the main characters?” or “Is this book part of a series?”) and marked that up using the standard FAQ schema format[[5\]](https://www.o8.agency/blog/ai/answer-engine-optimization-guide#:~:text=Implement structured data using schema,and categorize your information effectively). This way, if someone poses one of those questions to an answer engine, our site is primed to serve up the answer. Essentially, I’m providing a roadmap for the AI: *Here are common questions and here are the explicit answers to those questions.*

In the end, embracing AEO just meant making our site more structured and informative – which is good for AI but also just good practice for human readers. I love that optimizing for bots in this case also meant writing better content for people. It’s a great example of how focusing on answer engines can improve the overall quality of your site. And if/when ChatGPT (or its successors) start actually browsing and using live web data more, we’ll be ready for them!

## Deployment Pipeline with GitHub and Cloudflare

After getting the site content and design in place, I needed to put it on the internet in a maintainable way. I didn’t want to manually upload files to a server every time Jern or I made an update. Instead, I set up an automated deployment pipeline using GitHub and Cloudflare Pages. Here’s how it works:

1. **Build the site with Hugo:** On my Mac, when I’m ready to publish changes, I run a Hugo build command in “production mode.” Specifically, I use:
   `hugo --environment production --gc --minify --cleanDestinationDir`
   This tells Hugo to generate the static site files optimized for production. The flags here do some helpful things:

   1. `--gc` triggers a cleanup of any unused files from previous builds,
   2. `--minify` compresses the HTML/CSS/JS for faster load times, and
   3. `--cleanDestinationDir` ensures the output folder (where the static files go) is wiped clean before the new files are written (so no old content lingers).

   In short, I end up with a fresh public/ directory containing all the up-to-date HTML, CSS, JS, and images for the site.

2. **Commit the changes to Git:** All the source files for the site (and in my case, even the generated public files) are managed with Git, a version control system. I do a `git add -A` to stage all the changes and `git commit -m` "Update site for deployment" (with a nice descriptive message). This takes a snapshot of the current state of the site in my local repository. Using Git might sound like a very developer-y thing to do (and it is), but it has become a standard part of even static website workflows. It felt pretty empowering to have my site in Git – I get version history, the ability to roll back if something goes wrong, and a clear record of what changes were made when (another stealthy lesson in development best practices). I should have been using Git years ago for my Xcode and other coding projects, but I always chickened out. This time it felt simple and natural, and now I have a new skill. Maybe it will spread.

3. **Push to GitHub, trigger Cloudflare Pages:** Next, I push that commit to a GitHub repository that’s connected to Cloudflare Pages. I had earlier gone into my Cloudflare account and set up a Pages project, pointing it to my GitHub repo and a specific branch (say, the main branch) as the source. Thanks to that setup, any time I push new commits to GitHub, Cloudflare Pages notices the change (via a webhook) and automatically rebuilds and deploys the site. In other words, Cloudflare has hooked into my GitHub and says, “Oh, new commit – let me grab the latest files and publish them.” I don’t even have to log into Cloudflare or press a deploy button; it’s hands-free. Within about a minute of my push, the new version of the site is live on the internet.

This automated flow is wonderful. It’s basically a mini continuous deployment pipeline: edit → build → commit → push → live. I remember the days of maintaining websites by manually FTPing files up to a host – this is light years ahead of that. Not only is it faster and less error-prone, but having the site in Git also means I have a backup and change log of everything. If I mess something up, I can revert to a previous commit. If I want to work on a big change, I could even do it in a separate Git branch and not affect the live site until it’s ready. I'm not sure I'm quite ready for that, but I am getting closer.

Cloudflare Pages itself has been a joy. It’s free for my usage level and highly performant, distributing the site through Cloudflare’s CDN (Content Delivery Network) so it loads quickly for visitors around the world. And I didn’t have to manage any servers or infrastructure – I just connect GitHub and it handles the rest. This was yet another new skill unlocked by stealth: I set up what is essentially a modern DevOps workflow without thinking of it in those terms at first. Now I’m quite comfortable with the idea of Git-based deployment, which I’m sure will serve me well in other projects too.

## Challenges and Surprises

It took me about 2.5 days of focused work to get the new Hugo-based site fully built out with all of our book series and individual book pages. Interestingly, the content assembly wasn’t as painful as it could have been because I had all the book details stored in a database (an app called TapForms). In true geek fashion, I wrote a quick export script that pulled the data from TapForms and formatted it into the Markdown front matter for each book. In other words, I automated the creation of those index.md files. (Yet another instance of programming by stealth – I didn’t fancy typing out 62,000-word counts and ISBNs repeatedly, so a bit of scripting saved the day!) By the end of those first few days, I had the structure and content of the site done.

Then came the next 2.5 days: me wrestling with the SEO/AEO optimizations. I honestly spent as much time tweaking meta tags and schema JSON as I did building the whole rest of the site. It was surprisingly challenging to get everything “just right” so that Google and other engines would be happy. I iterated on the structured data for each page, ensuring there were no errors, and I beefed up the content (like writing FAQs) to anticipate common questions. I eventually got things to a *decent* place – good enough to launch – and decided not to let the perfect be the enemy of the good. It’s an area I plan to revisit as I learn more, but I had to cut myself off after a while and say “ship it.”

One funny lesson learned *after* launching: I discovered that ChatGPT (at least in late 2025) still can’t actually crawl live websites on its own! All this effort to make the site ChatGPT-friendly… and ChatGPT isn’t out there clicking links. (Unless you count the new experimental browsing modes, but that’s another story.) The reality is, ChatGPT’s knowledge comes from training data and it doesn’t have a built-in live web index in the general case. So even though our new site was now highly crawlable, ChatGPT wouldn’t directly pull answers from it. **However,** this doesn’t mean the work was for nothing. Other AI-related crawlers like OpenAI’s *GPTBot* (which is used to gather data for future models) *can* index the site now, and of course Google’s crawler can as well. The way I think of it: we’ve future-proofed the site. We’re feeding the answers into the system so that the next time an AI’s knowledge is updated, our content has a better chance of being included. And for present-day Google searches, our improvements should help our site rank and display richer results.

## Reflecting on the Project

Five days after I began, I looked back at what we gained from this whirlwind project:

·   **A shiny new website that we fully control:** We now have our own site at [jerntonkoi.com](https://jerntonkoi.com) that isn’t dependent on a third-party platform. It’s fast, it’s ours, and it has plenty of room to grow beyond just a landing page for a mailing list. Glorious freedom!

·   **New skills and tools learned:** I dove into Hugo (and by extension, Go templates) and learned a ton about static site generation. It was genuinely fun to pick up a new tool and realize how much it could do. I also leveled up in Git, YAML, and structured data along the way. Each of those was a mini lesson in programming/development that sneaked into the project.

·   **Cost savings:** We were able to eliminate our previous hosting service (we had been paying for GreenGeeks for the old site). Nothing against them – they were great – but a static site on Cloudflare Pages costs us basically nothing for our level of usage.

·   **Better search presentation:** The site is now set up to present our content more nicely to search engines and AI. We added proper SEO meta tags and the whole structured data shebang. Even if I haven’t perfected it yet, we’re in a much better position than we were with the old site. Our content is far more “machine-readable” than before.

·   **An uptick in traffic:** Within a short time after launch, we were seeing over 150 unique visitors a day coming to the new site. I have no idea what the old site’s numbers were (it didn’t have great analytics), but seeing those visitors come in – and hopefully finding what they need – felt very rewarding.

·   **Some perspective on AI discovery:** As I mentioned, I learned that making a site “ChatGPT-ready” has its caveats. ChatGPT itself wasn’t crawling us, but now at least we know the site can be indexed by the bots that *do* roam the web. The truth is, the bots index the web, and the answer engines read from that index. Now we’re part of that index for the relevant questions. Whether the old Kit site might have sufficed I’ll never know, but I certainly have more confidence in our new setup.

## Coming Full Circle

All in all, it was a very satisfying project. I got to solve the problem that triggered this whole thing — making our content more discoverable — and I did so in a way that taught me a bunch about web development and automation. And of course I did a lot of it **by stealth** – I wasn’t explicitly setting out to “learn programming,” but through the process of building this site I ended up using and absorbing many programming concepts: templating, scripting, data formats, version control, deployment automation, and more. It’s a great reminder of how tackling a real-world project can organically teach you so much.

Looking back, it still amazes me how it all started with a spark from a podcast — one idea about how the web is changing. *The Creative Penn* led me to *Lenny’s Podcast* and Ethan Smith’s insights on AEO; those ideas led me to rebuild our author website; and that, in turn, brought me here, sharing what I learned on *Programming By Stealth*.

It feels like the perfect circle: I went from *listening* to podcasts that inspired me, to *making* one that might inspire someone else.

So to Joanna Penn, for planting the idea; to Ethan Smith, for the technical spark; and to Allison and Bart, for giving me a place to tell the story — thank you. This journey taught me not just about Hugo, Git, or structured data, but about the power of curiosity, community, and following your geeky instincts wherever they lead.

If you have any questions about what I did (or if you’re embarking on a similar static site or author platform project), feel free to reach out to me in the NosillaCast Slack or the *Programming By Stealth* community. You can find me, Eddie Tonkoi, along with many other friendly and knowledgeable folks over at [podfeet.com/slack](https://podfeet.com/slack). And of course, if you’d like to check out the results of this project – and maybe discover a fun mystery novel to read – please visit our site at [jerntonkoi.com](https://jerntonkoi.com/) or reach out to [@tonkoibooks](https://www.instagram.com/tonkoibooks/) on Instagram.

Thank you for listening to my story of building an indie author website with Hugo. It’s been quite the adventure in learning by doing — a true exercise in programming by stealth — and I’m excited to keep improving the site as we go.

Happy web building, and happy reading!

[[1\] ](https://gohugo.io/#:~:text=The world’s fastest framework for,building websites)The world's fastest framework for building websites
https://gohugo.io/

[[2\]](https://cloudcannon.com/tutorials/hugo-beginner-tutorial/hugo-templating-basics/)  Hugo templating basics | CloudCannon
https://cloudcannon.com/tutorials/hugo-beginner-tutorial/hugo-templating-basics/

[[3\]](https://gohugo.io/content-management/front-matter/#:~:text=Provide front matter using a,matter from the page content) Front matter
https://gohugo.io/content-management/front-matter/

[[4\]](https://www.o8.agency/blog/ai/answer-engine-optimization-guide#:~:text=,markup%2C and question focused content) [[5\]](https://www.o8.agency/blog/ai/answer-engine-optimization-guide#:~:text=Implement structured data using schema,and categorize your information effectively) Answer Engine Optimization in 2025: How to Stay Visible in the Age of Answer Engines | O8
https://www.o8.agency/blog/ai/answer-engine-optimization-guide

[[6\]](https://hollowlands.com/2018/02/using-schema-org-for-books-an-example/#:~:text=For common knowledge domains%2C there,for creative media knowledge domains) Using Schema.org for books – an example – HollowLands
https://hollowlands.com/2018/02/using-schema-org-for-books-an-example/

