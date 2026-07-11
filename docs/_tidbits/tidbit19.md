---
title: Building a Javascript CLI App with NodeJS
instalment: 19
creators: [bart, allison]
date: 2026-08-01
---

When evangelising this series I always say that the ability to code is *empowering* because it lets you scratch your own proverbial itch — you need the computer to do something for you, if you can code, you should be able to make that happen!

I recently spent a few weeks doing a very thorough job of fixing a problem that was really starting to bug me.

I will explain my *problem to be solved*, and describe how I solved it, but this tidbit isn't really about my specific command line app, but about how I went about building it, and how you could build your own NodeJS command app to solve your own problems.

I named my app *Linkify*, and like I always do, released it as open source [on GitHub](https://github.com/bartificer/linkify). This means can have a peek under the covers to see (and perhaps judge 😉) my code!

I haven't just released the code on GitHub though, I've also published the CLI itself [to NPM](https://www.npmjs.com/package/@bartificer/linkify), so if you have NPM installed you can play with the app yourself by simply running:

```sh
npm install --global '@bartificer/linkify'
npx linkify generate 'https://podfeet.com/' --template markdown
```

## Matching Podcast Episode

TO DO

## The Problem to be Solved

I regularly produce news-related podcast content — the month's Apple News for [Let's Talk Apple](https://www.lets-talk.ie/lta), and the cybersecurity news for the [Security Bits](https://www.podfeet.com/blog/category/security-bits/) segments on [the NosillaCast](https://www.podfeet.com/blog/category/nosillacast/).

If you look at the notes for these shows in general, you'll they're very similar, and consist largely of nested lists of links with some additional context around them. For example, the [June 2026 LTA,](https://www.lets-talk.ie/lta154) or [Security Bits for the 5th of July](https://www.podfeet.com/blog/2026/07/sb-2026-07-05/).

I spent a lot of time thinking about the best way to format those links, because I was very keen to clearly show:

1. Which parts of the text are from the linked source
2. Where the story is from

After lots of experimentation, I adopted the following format: `STORY HEADLINE — domain.name/…`. For example:

*  The most recent Let's Talk Apple Episode: [LTA 154: June 2026 — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154) (at the time of writing this tidbit!)

I write all my show notes in Markdown, so that means I need to create hundreds of links of the form:

```markdown
[LTA 154: June 2026 — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154)
```

Creating one or two links of this format manually is not that difficult, but creating hundreds, that's a whole other story! To say I found the process tedious would be putting it very mildly 🙂

I've also started to expand on my template a little, for example, when I link to Apple Press releases in Let's Talk Apple I want those to stand out exceptionally clearly as being Apple's PR spin, rather than independent reporting, so I now format those links like this:

* [Mini Football Legends, Family ‍‍‍Feud ‍‍‍Pocket, and seven more hits join Apple ‍‍‍Arcade — 📣 Apple PR](https://www.apple.com/ie/newsroom/2026/06/mini-football-legends-family-feud-pocket-and-seven-more-hits-join-apple-arcade/)

My first approach was to write a Javascript-based TextExpander shortcut that read a URL from the clipboard, then parsed the URL and produced a stub entry like:

```markdown
[ — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154)
```

I've been podcasting for decades at this point, so this new CLI app is not my first pass at automating this process. In fact, it's the third:

1. A Javascript-based TextExpander snippet that generated the URL part of the link and moved the cursor to the correct position to paste in the headline
2. A NodeJS script named `linkify.js` that solved the problem of automatically extracting the headline from the website given just its URL
3. This new CLI app.

The `linkify.js` script actually implemented most of what the new CLI app does, but with a few important caveats, and all written in very old pre-ES6 Javascript. I'm actually quite prod of the fact that I got the basic design right almost a decade ago, and while the code needed a complete overhaul, the design didn't!

So, if my decade old script had been working just fine for nine years, why put all this effort into a third iteration?

### The AI Fly in the Ointment

The initial version of the script worked quite well, but it was just a script, not a full CLI, and it had some niggles.

None of those niggles were motivation enough to re-visit the tool, until that is, AI came along, and undermined the very foundation of the script's logic on site after site after site.

Step 1 had always been to download the page's HTML, and that part never gave any trouble, until AI. All those bots crawling the web started to overload web servers, so more and more sites started to implement bot-blocking logic, and my little script was being seen as a bot!

On every site that blocked my script, I had to fall back to manually copying in the title 🙁

Initially it was just one or two sites, but the problem grew, and grew, and grew, until eventually, up to a third of my links needed to be manually created again. Something had to be done!

### Some Other Niggles, and a Stretch Goal

Obviously, the AI problem was by far the most important one to fix, but there were other lesser niggles too. 

The biggest niggle was that the `linkify.js` script was pre-ES6 Javascript code. Rather than using the new `class` keyword it used the old `prototype` syntax. Needless to say, it also wasn't modularised. If I was going to re-visit this code I was going to need re-familiarise myself with it's finest nuances, so what better way to do that than to refactor the whole thing into a modern ES6 module!

The other niggle was that while I described the ability to use different templates for different domains above, the `linkify.js` script couldn't actually do that! That was functionality I really wanted to add!

Finally, there was also a kind of *stretch goal* — the ability to extract more information from the page than just the headline, making it possible to include things like image thumbnails in links to image-first sites like the wonderful [XKCD](https://xkcd.com/).

Spoiler alert, I achieved that stretch goal, so now when link to XKCD commits in the *Pallet Cleaner* section of the Security Bits segments they look like this:

* [XKCD 3262: Sports Commentary](https://xkcd.com/3262)
   ![ADD A DESCRIPTION FOR THE VISUALLY IMPAIRED HERE](https://imgs.xkcd.com/comics/sports_commentary.png)

## Handling Dependencies in 2026

There are lots of reason I like to code with [NodeJS](https://nodejs.org/en), but a big one is the amazing library of open source packages available to me via the Node Package Manger ([NPM](https://www.npmjs.com)). I simply couldn't create tools like Linkifier without depending on open source modules — I neither have the time nor the skills to implement everything myself from scratch!

In more innocent times, you were pretty safe importing just about any NPN module in your project. Worst-case, it was buggy and didn't work very well, so you tried something else!

Alas, times have changed 🙁

Cybercriminals have realised that compromising dependencies is a great way to get backdoors into otherwise well secured systems. This is referred to as a *software supply chain attack*, and it means that there are real dangers lurking in the NPM repository.

Here are just some of the ways in which attackers are abusing NPM:

1. Using AI to find new and un-known vulnerabilities in old and unmaintained modules that are still in use
2. Sneaking additional malicious code into apparently helpful pull requests from the open source community
3. Tricking worn out open source maintainers into accepting help from apparently helpful but malicious *volunteers*
4. Hacking developer's NPM or GitHub accounts to publish malicious version of completely legitimate and well maintained modules
5.  Hacking developers to computers to sneak malicious additions directly into the code

The extra sting in the tail is that dependencies can be nested — modules can depend on other modules that depend on other modules *ad infinitum*. This tree-like structure of nested dependencies is referred to as a *dependency tree*. When you import one module, you may well actually be adding tens or even hundreds of modules into your project's dependency tree!

If any one module anywhere in your dependency tree has a known vulnerability, then there's a **possibility** your code is vulnerable too. I say there's a *possibility* because not all vulnerabilities in the tree can actually be triggered from your code. If you depend on a module that has two functions, one with a known vulnerability, and one without, and your code only uses the safe one, then your code is not actually vulnerable!

It's often much more nuanced than that — if the vulnerability can only be triggered when a third optional argument is passed, and you never pass such an argument, then even though you're using a function with a known vulnerability, you're still save because you're not using the vulnerable part of the module!

In other words, **your code is not actually vulnerable to every vulnerability that exists in your dependency tree**!

### There is no Simple Solution

It might be tempting to just stop using NPM modules, but not only is that utterly impractical, it's also like to be **less** secure!

No one can possibly be expert at everything, an no amount careful coding can make up for years of real-world testing by a large community. Realistically, the code you write yourself to avoid depending on NPM modules probably contains more vulnerabilities than any reputable NPM module does!

This means we need a nuanced approach, which means we can't fall back to hard-and-fast rules, but we need to use out best judgement 🙁

### Your Not Alone — There is Help!

The entire open source community is very are of this supply-chain problem, so there's a lot of work underway to make it ever harder for the attackers to succeed. There will always be some attacks that do, but there's a lot going on to tighten things up.

For example — both NPM and GitHub are updating their systems to add ever more safety mechanisms, and the community is responding with technical tools too.

To illustrate this point, when I first signed up to GitHub decades ago, and when I first opened my NPM developer account, neither site required multi-factor authentication, and neither site did any kind of automated vulnerability scanning against the code I published.

Today, I can't log in to GitHub without my PassKey, I was forced to add multi-factor authentication to my NPM account, I can't publish new versions of the Linkify tool without passing two mutli-factor authentication challenges, and all my code is scanned in the background by both GitHub and NPM checking for obvious problems.

And then there are the tools built right into the `npm` command itself for managing known vulnerabilities in your dependencies.

### Auditing your NPM Dependencies

NPM track and monitor all known vulnerabilities in all NPM modules. They know the exact versions affected by each bug, and whether or not patched versions of those modules have been released, and if so, whether or not those patched versions introduce breaking changes.

NPM classifies each known vulnerability into four severities — here they are summarised by my favourite privacy-respecting AI assistant [Lumo](https://proton.me/lumo):

1. **Low** — Minor security issues that are unlikely to be exploitable in most environments or require very specific conditions to trigger.
2. **Moderate** — Vulnerabilities that could lead to security issues but typically require a particular setup or user interaction to exploit.
3. **High** — Serious vulnerabilities that pose a real risk and are often directly exploitable, potentially leading to data exposure or code execution.
4. **Critical** — The most severe issues, typically allowing remote code execution, authentication bypass, or other high-impact exploitation.

You can access this functionality using the `npm audit` command.

To illustrate how this all works, let me walk you through my process for checking my NPM projects for known vulnerabilities.

The first step is to see where things stand by asking NPM to give you an audit report. Simply open a terminal in your project folder, and run:

```sh
npm audit
```

This reads your dependencies from your `package.json` and `package-lock.json` files and checks your full dependency tree against NPM's vulnerability catalog.

You just might get very lucky and find you have no vulnerabilities at all, but realistically, that's unlikely in any kind of substantial project that's been around for a while. You'll probably find at least some vulnerabilities to try address.

The next step is to update your dependencies as much as you can without introducing breaking changes — that means never updating across a breaking change. NPM has your back here, by making it intentional difficult update modules across major versions.

To see your available updates, run:

```sh
npm outdated
```

This will show output something like:

```
Package            Current   Wanted   Latest  Location                        Depended by
clean-jsdoc-theme    4.3.3    4.3.3    5.0.7  node_modules/clean-jsdoc-theme  linkify
commander           14.0.3   14.0.3   15.0.0  node_modules/commander          linkify
url-slug             5.0.0    5.0.1    5.0.1  node_modules/url-slug           linkify
webpack            5.105.4  5.108.4  5.108.4  node_modules/webpack            linkify
webpack-cli          7.0.2    7.2.1    7.2.1  node_modules/webpack-cli        linkify
```

This shows three version numbers:

* **Current** — the one you have installed
* **Wanted** — the best available update **without breaking changes** 
* **Latest** — the most recent published version

You can safely update any module where the *current* version is behind the *wanted* version, regardless of whether there's also a  *latest* version that introduces breaking changes with commands of the form:

```sh
npm update url-slug
```

This command will never cross a major version boundary, which means it will not introduce breaking changes.

Once you install all the safe-to-install updates, check your vulnerabilities again with `npm audit`.

Hopefully you now have fewer, but you may still have some.

Your next safe option is to allow `npm audit` to make safe edits to your `package-lock.json` file to override nested dependencies.

This means that if one module important an vulnerable version of another, and there is a safe version of that second module available, your `package-lock.json` will be updated to use the safe version, even though the first module still specifies the unsafe version. Again, `npm audit` does this very carefully so as to make the smallest possible changes, and never to upgrade across major versions, hence, avoiding breaking changes.

It feels very scary the first time you do it, but NPM really have worked hard to make this safe to do:

```sh
npm audit fix
```

At this point you've fixed every vulnerability that can be safely and easily fixed with simple modules updates, so what ever is left now is going to need some careful consideration.

Check your current list of vulnerabilities one more time with `npm audit`, and hope to see as few remaining vulnerabilities as possible!

At this point, we move from deterministic process to human judgement.

### Applying your Best Judgement

You need to examine the remaining vulnerabilities to try understand their relevance to your use of the problematic dependency. 

This is where **context matters**! Your situation could be very different to mine, so **don't construe my choices** in my situation **with any kind of recommendation**!

These days, I only code for my own personal use, so I don't need to be as cautious as I would were I coding professionally. My focus is on software that runs locally on the terminal, or purely client-side on the web, so the attack surface is very limited. Basically, abusing any vulnerabilities in my apps will harm no one but the person using the tool! 

If I was writing software with the ability to harm others, say for use on corporate systems, or server-side web apps, then I'd need to be a lot more careful! There would be many more vulnerabilities that I would need to remediate immediately.

So, given my very specific context, I ignore *low* severity issues, I give *moderate* severity issues a quick glance, and focus my attention to the *high* and *critical* ones. I triage every *high* severity issue carefully, and I fix *critical* issues as soon as possible.

Another type of context to bear in mind is that there are two completely **different types of dependency**!

* **Regular dependencies** — by default, `npm install` adds modules as regular dependencies.You'll find them listed in the `dependencies` array in your `package.json` file. Assuming you're using NodeJS and NPM correctly, these should all be dependencies that are needed to **run the built code**. That means that when the software is used in its normal way, these dependencies are relevant. It also means that if you publish your module to NPM, other users installing your module get these dependencies installed into their project's `node_modules` folder.
* **Developer Dependencies** — when you add dependencies with the `npm install --save-dev` they get added as developer dependencies. You'll find these dependencies in the `devDependencies` folder in your `package.json` file. Again, assuming you're using NodeJS and NPM as intended, these dependencies are **not** relevant when running you software in the normal way, they are **only** used in your build process. This also means that if you publish your module to NPM, when **other people** install your module into their projects, they **do not get the developer dependencies**. (To the developer dependencies you need to clone the Git repository and then run  `npm ci` or a bare `npm install` without any arguments.)

This distinction means that vulnerabilities in developer dependencies are fundamentally different to vulnerabilities in regular dependencies. For the most part, vulnerabilities in developer dependency can only be used to attack the person building the software, so they're generally of no value to attackers. However, there are some really important exceptions to that general rule, including:

1. Developer dependency vulnerabilities that somehow **corrupt your build process**, secretly injecting malicious code into your legitimate software.
2. Developer dependencies with vulnerabilities designed to **find secrets** and silently send them to an attacker.
3. Developer dependency with vulnerabilities that maliciously **destroy data** (wipers).

So, just to recap, there's no universally right approach to take to any of this — you need to make your own judgements based on the vulnerabilities themselves, how the vulnerable modules are used in your project, and the context of the software you're developing.

### A Quick Example — Vulnerabilities in Linkify

As I type this in July 2026, the Linkify project has just two vulnerabilities, both *moderate*. I've already made sure all the modules that can be safely updated have been, and I've run `npm audit --fix` to handle the remaining safe fixes. That means I need to apply my judgement these two vulnerabilities.

Because the Linkify app is used locally and abusing vulnerabilities can only harm the person running the code, I'm not particularly concerned about *medium* vulnerabilities, but I do want to give them a quick look to be sure they really are OK to leave unaddressed.

Here is what `npm audit` shows:

```
showdown  *
Severity: moderate
Showdown vulnerable to Regular Expression Denial of Service (ReDoS) in link/anchor parsing - https://github.com/advisories/GHSA-rmmh-p597-ppvv
fix available via `npm audit fix --force`
Will install clean-jsdoc-theme@5.0.7, which is a breaking change
node_modules/showdown
  clean-jsdoc-theme  4.1.10 - 4.3.3
  Depends on vulnerable versions of showdown
  node_modules/clean-jsdoc-theme
```

This is a little confusing, because it shows details for one vulnerability, but it says there are two?

The first line of the output tells me the vulnerability is in a module named `showdown`, and that the vulnerability affects all versions of that module (that's the `*`).

Let's see where this module sits within my dependency tree with `npm ls`:

```
$ npm ls showdown
@bartificer/linkify@3.1.4 /Users/bart/Documents/Temp/From GitHub/linkify
└─┬ clean-jsdoc-theme@4.3.3
  └── showdown@2.1.0
```

That shows me that `showdown` is a dependency of one of my dependencies, `clean-jsdoc-theme`. A quick check of `package.json` verifies my assumption that we're dealing with a developer dependency.

So, there is one actual vulnerability, but it affects two modules within my dependency tree, so, `npm audit` counts it twice.

Looking at the output from `npm audit` again, we can see that NPM actually told us this in the little summary at the bottom of the vulnerability:

```
  clean-jsdoc-theme  4.1.10 - 4.3.3
  Depends on vulnerable versions of showdown
  node_modules/clean-jsdoc-theme
```

OK, can I **safely** update `clean-jsdoc-theme` beyond the highest vulnerable version (`4.3.3`)?

Since I've already installed all my safe updates, I know the answer, but for completeness, here's what `npm outdated` shows:

```
$ npm outdated
Package            Current  Wanted  Latest  Location                        Depended by
clean-jsdoc-theme    4.3.3   4.3.3   5.0.7  node_modules/clean-jsdoc-theme  linkify
commander           14.0.3  14.0.3  15.0.0  node_modules/commander          linkify
```

This is mixed news — I could have found that there simply is no patch at all, had all three of *current*, *wanted*, and *latest* been `4.3.3`, then patching would have been impossible, but *latest* shows `5.0.7`. This crosses are major version (`4.*.*` → `5.*.*`), so that implies there would be breaking changes. Let's check that with a quick look at the [release notes](https://github.com/ankitskvmdam/clean-jsdoc-theme/releases#release-v5.0.0) for `clean-jsdoc-theme`. The opening line says it all:

> clean-jsdoc-theme v5 is a ground-up rewrite — a complete documentation suite, not a coat of paint on JSDoc's output.

Scrolling down confirms there is indeed a long list of breaking changes.

Again, looking back at the output from `npm audit`, it told us all this too:

```
fix available via `npm audit fix --force`
Will install clean-jsdoc-theme@5.0.7, which is a breaking change
```

We have one more piece of context to consider — what is the actual vulnerability? What does it allow an attacker to do?

Again, `npm audit` gave us a useful summary (and [a link](https://github.com/advisories/GHSA-rmmh-p597-ppvv)):

```
Showdown vulnerable to Regular Expression Denial of Service (ReDoS) in link/anchor parsing
```

We now have all our context — there is a vulnerability in the module that builds my documentation that can consume my RAM/CPU if I add an intentionally malicious link into my JSDoc comments. This is purely a developer dependency, so users downloading my module actually get zero vulnerabilities with any severity, and I'm quite happy to keep building my docs like I do because I know I'm not going to add a link designed to consume my own computer's resources!

Mind you, that complete re-write looks interesting, so let's open [a GitHub issue](https://github.com/bartificer/linkify/issues/24) to actually do the upgrade with the breaking change in a deliberate and un-hurried way in the future.

### Some Guidance for Choosing your Dependencies

We know that writing everything from scratch is dangerous, and we know that importing other people's modules can also be dangerous, so what can we do? My advice is simple — **install exactly as many dependencies are you need, and no more**!

Actually, I have some more advice — NPM is such a rich ecosystem that you usually find yourself with many possible modules to choose between for solving your specific problem. Choosing the right one can really reduce your exposure to vulnerabilities.

I can't give you a universally agreed checklist, but I can share my approach.

I don't try to find perfect modules, because while there are lots of choices, it's very rare they are **exactly** like my ideal module, instead, I look for positive signals, and I favour modules with more positive signals over those with fewer.

Here's what I look for:

1. A healthy looking NPM page
   1. A high number of weekly downloads
   2. A thoughtful description
   3. A link to a GitHub repository
2. A recent release history, with some bug fixes at least
3. Decent documentation (shows care,  and will save my sanity too!)
4. Few, or better yet, no, dependencies

## Designing Linkifier

So, we have this complex to problem to solve, how best to architect the code?

### Three Data Modelling Classes

My brain works in an object-oriented way, so a decade ago, I started by building classes to describe the various moving parts. I ended up with three:

1. `PageData` — to represent the information extracted from the downloaded pages, primarily:
   1. `.url` — the page's URL
   2. `.title` — the  content of the `<title>` tag
   3. `.headings.h1[]` — an array with the content of all the `<h1>` tags, in order
   4. `.headings.h2[]` — an array with the content of all the `<h2>` tags, in order
   5. `.metadata` — a dictionary indexed by the standard SEO header names, e.g. `.metadata.author` for the text from the `content` attribute from the `<meta name="author">` tag
2. `LinkData` — to represent extracted information which can be used in rendering the link, primarily:
   1. `.url` — the URL to link to
   2. `.text` — the link text
   3. `.description` — optional additional description text
3. `LinkTemplate` — a template for converting `LinkData` objects into rendered links
   1. `.this.templateString` — a moustache template for rendering the link
   2. `.filters` — an optional list of filters to apply to each field, where the filters are simply functions that expect to be password one string, and will return a new string

These three classes have grown a little over time, but they remain mostly un-changed in today's code.

### A Three-Step Process

The classes support a simple three-step link generation process:

1. Download the HTML and parse it into a `PageData` object
2. Somehow convert the `PageData` object to a `LinkData` object
3. Convert the `LinkData` object to the final link using a `LinkTemplate` object

The initial script-based version of this code implemented this three-step process in a single script file that defined the three classes and then used them to work through that three-step process. It was a **looooooooong** script! It worked, but it sure wasn't easy to maintain — lots and lots of scrolling up and down!

### A Primary Class to Tie it all Together

Re-writing the script as an ES6 module allowed me to split each of the data modelling classes out into their own files, which makes working in a tab-based IDE so much simpler!

But what to do with the script's logic? In keeping with the object oriented approach, I chose to migrate the script's functional into a fourth class, `Linkifier`. This class now encapsulates the link generation logic.

The `Linkifier` class acts as the entry point to the ES 6 module, so when you import the module into your own code you start by creating an instance of the `Linkifier` class. The CLI app is basically a wrapper around an instance of this class.

The `Linkifier` class is more complex than the three data encapsulation functions — it contains a mix of static and instance variables and functions, most importantly:

* `Linkifier.defaults` — a static dictionary exposing default values
* `Linkifier.utilities` — a static dictionary exposing helper functions
* A suite of instance functions for managing the configuration
* A suite if instance functions for managing the data extraction logic
* A suite of instance functions for managing the available templates
* A suite of functions implementing each step of the link generation logic
* `async .generateLink(url)` — the main function, the one that actually converts URLs to nicely formatted links!

All in all this is quite a simple design — four classes to power a simple three-step processes, but I've been hiding the difficult part from you — the second step. The app *just* extracts the headline from the HTML, how card can that be?

### Extracting Article Headlines is Tricky!

Actually fetching the HTML and then parsing it into a DOM-like data structure is quite easy to do, so with very little effort I was able to get to the point where I could use jQuery-like syntax to extract information from the pages pointe to by URLs.

Somewhere in all that content is the article's headline, exactly as readers see it, but where?

My first implementation simply extracted the text from the page's `<title>` tag. This usually does contain the headline, or at least most of it, but it's almost never just the headline! Just about every site pre-fixes or post-fixes their brand, so you always have something to delete manually afterwards. Worse still, some sites even truncate the headlines, meaning you need to copy-and-paste them manually.

My second thought was to lean into the fact that it's been considered best practice to have the most important title on a page be contained within the first `<h1>` tag on the page. As sensible as this sounds, it breaks down in even more ways that using the `<title>` tag:

1. With the introduction of semantic markup tags ( `<heading>` `<body>`, `<article>`, `<section>`, etc.) there are now many possible best-practice ways of having the article title's `<h1>` tag that contains the headline not be the first `<h1>` on the page.
2. Many websites choose to prioritise their brand or sub-publication name over and above the actual article's headline, so the headline is sometimes in an `<h2>` tag.
3. Some websites intentionally add invisible extra keywords to the end of their headline's `<h1>` tag in an attempt to game search engines.
4. A few really poorly designed sites don't even use heading tags at all, they just a bolded paragraph and give it a bigger font size!

My third approach was to try design some kind of algorithm that would try multiple possibilities in some sort of sensible order and somehow figure out which was right on each page. It didn't take me long to realise this would require so many conditions and caveats that it's effectively impossible!

If you can't define a single piece of extraction logic that works on every site, then clearly, the solution is a mechanism for associating the appropriate logic to each website.

This sound like it would be a terrible idea, but looking at my show notes I realised the vast majority of my links are from just a few tens of web sites. A few tens of simple functions proved to be a lot easier build than a single function that works everywhere!

Both the original script and the new ES6 module use this approach — there is configuration variable that maps extraction logic to websites.

### Per-Domain Healine Extraction Logic

Extraction logic is just a fancy way of say *a function*, so the problem to be solved is somehow mapping functions to websites.

Being a sysadmin for most of my professional life, I instinctively leaned into the fact that website's are defined by their domain names — what makes Mac Stories different to The Mac Observer is the domain name part of their their article URLs.

This suggested that DNS (Domain Name System) names provided the best model for structuring the configuration object that maps extraction logic to websites.

To understand why this approach works so well it's important to understand two nuances of how DNS name are structured

1. DNS names are hierarchical, with the parts separated by periods (`.`), and the least significant name on the left. For example, `www.podfeet.com` is a subdomain of `podfeet.com` , which is a subdomain of the top-level domain `com`.

2. There's an implied, usually hidden, root domain above all the top level domains ( `com` , `net`, `org`, `ie` etc.) and it is represented by a trailing `.`. According to the formal DNS specification, all domain names end with a final `.`. According to the specification, Allison's domain name is not `www.podfeet.com`, but `www.podfeet.com.`! 

   If you've never seen these dots, that's because just about everyone agrees the trailing dot looks ugly, so every app that uses domain names hides it, and silently inserts it into just before issuing DNS queries! 

The original script used a dictionary with full DNS names, including the final `.`, as the keys, and Javascript functions as the values.

These Javascript functions accepted a `PageData` object as their only argument, and returned a `LinkData` object. I always mentally referred to them as *Data Transformers*, or *Transfomer functions*.

When building the `Linkifier` class I kept the same concept, and leaned into the name, but I chose to hide the details from the user by making the configuration variable private, and only exposing a suite of functions for managing the mappings. These functions lean into the *transformer* nomenclature:

* `.registerTransformer(Domain, Function)` — a function for registering a data transformer function for a given domain, the trailing `.` is silently added if needed.
* `.getTransformerForDomain(Domain)` — a function to return the transformer function for a given domain, the trailing `.` is optional, the function will return the same transformer function when passed `podfeet.com` or `podfeet.com.`.
* `.‎domainToTransformerMappings` — a read-only copy of the underlying dictionary (does show the trailing `.`s).

To illustrate the power of this approach, imagine the very simplified universe where all sites have acceptable titles in either their first `<h1>` tag or their `<title>` tag, except for one site, `somesite.com` which still has a legacy mobile site on `m.somesite.com`, and a more modern website that's accessible via both `www.somesite.com` and `somesite.com`. The legacy mobile site has the site name as the only `<h1>` tag, and the article headline as the first `<h2>` tag, while the modern site has the headline in the `<title>` tag, but prefixed with `Some Site | `.

We can accommodate this simple universe with a configuration that defines just three domain name-to-transformer-function mappings:

1. `somesite.com.` — a transformer function that uses the page title with a regular expression to remove the prefix as the article title.
2. `m.somesite.com.` — a function that uses the content of the first `<h2>` tag as the article title.
3. `.` — a function that uses the content of the first `<h1>` tag as the article headline if there is one, otherwise it falls back to the page title.

To see how this simply mapping works, let's imagine needing to extract a headline from the URL `https://somesite.com/big-story1`. The process for resolving the transformer function is:

1. Is there a mapping for `somesite.com.` — **yes**, so use it!

OK, so what about the URL `https://www.somesite.com/big-story2`? This is a little more convoluted, but still quite simple:

1. Is there a mapping for `www.somesite.com.` — **no**, try the parent domain
2. Is there a mapping for `somesite.com.` — **yes**, so use it!

Now what about any other site on the internet, say `https://www.anothersite.net/big-story`? Again, a little more convoluted, but it still works:

1. Is there a mapping for `www.anothersite.net.` — **no**, try the parent domain
2. Is there a mapping for `anothersite.net.` — **no**, try the parent domain
3. Is there a mapping for `net.` — **no**, try the parent domain
4. Is there a mapping for `.` — **yes**, so use it!

This demonstrates the two big advantages this approach brings:

1. It supports links with or without the usually optional `www` prefix, since `https://www.somesite.com/…` gets treated the same as `https://somesite.com/…`
2. It provides an easy way to define a default transformer for domains that don't have their own transformer.

In my decade of using this approach, it has yet to fail me!

### The Solution to Download-Blocking — Reversing URL Slugs

I spent a lot of time trying to figure out some way of getting around those pesky download blocks other than trying to integrate my script into a real browser. I know it's possible to have a script drive a browser automatically, and hence, get the content, but that was a layer of complexity I just didn't want to deal with! 

And then, one day, I notice the solution had been staring me in the face all along — just about every news site embeds the headline right into the URL as a so-called *slug*!

For example, consider this Mac Observer use URL: `https://www.macobserver.com/news/iphone-18-pro-max-could-be-thicker-and-heavier-due-to-bigger-battery/`

It clearly contains the headline: *iPhone 18 Pro Max Could Be Thicker and Heavier Due to Bigger Battery*

Well ... it sort of contains that headline — it's been *slugified* into a form that's compatible with the URL specification.

How hard can it be to reverse this process? Can I *de-sligify* URLs to get headlines?

It proved to be both easier than I feared, and a lot more complex than I realised it would be!

Getting something that worked fairly well most of the time was easy, but getting it to work really well almost all the time took a lot of effort!

As a first pass I knew this would be a two-step process:

1. Extract the words
2. Fix the case

Since there are standard algorithms for converting the words into the slugs, there are also standard algorithms for reversing the slugs back to text.

The problem is, the text you get back is not quite the same as the text that went in. Why? Because slugification is an **inherently lossy process**. 

What gets lost?

1. All character casing — slugs are all lower case
2. All punctuation — spaces and all other punctuation characters get converted to dashes
3. Diacritics (little adornments on letters like `é` & `ç`) — letters with diacritics get converted to plain letters, e.g. `à` → `a`

Given there is a generally accepted style for the capitalisation of title, so-called *title-case*, a simplistic implementation of this slug-reversing idea is actually very simple:

1. Apply a standard desligification algorithm
2. Apply the title-case algorithm

Naively, I assumed that would work well most of the time.

I implement the algorithm and tried to use it for the notes for a Let's Talk Apple episode. I soon realised almost all the resulting headlines needed some manual fixes to get them right 🙁

The biggest problems I was seeing were:

1. Punctuation commonly used in headlines like simple colons and commas are lost (they all become spaces)
2. Currency symbols are lost
3. Formatted numbers get broken up, and the process can't be reliably reversed. For example,  `1,001` becomes `1 001`, and so does `1.001`!
4. Acronyms like `NASA` get title-caesd to `Nasa`
5. Unusually capitalised words like `iPod` get title-cased to `Ipod`
6. Accented words loose their accents

Sadly, the first three problems simply can't be solved — the information has simply been lost, and there's no way to get it back.

That last three can somewhat remediated though — they can't be perfectly solved, but simple text replacements can get us most of the way to where we need to be!

The slug-reversing process is implemented by the function `Linkifier.utilities.extractSlug()`. It stars by simply reversing the slug and then applying title-case, and then it tries to fix as many of the problems as it can.

At the moment, there's just one type of fix applied, but there is another planned.

Each instance of the `Linkifier` class contains a [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of words with strange capitalisations (`.speciallyCapitalisedWords`). 

The `extractSlug()` function loops over this set and uses a case-insensitive regular expression to find the wrongly capitalised versions of each word in the title, and replace it with the correctly capitalised version of the word.

The set gets initialised from the array  `Linkifier.defaults.speciallyCapitalisedWords`, but it can be edited using Javascript's standard set manipulation functions.

The this addresses two of our problems quite well:

1. Most acronyms like `NASA` are now handled properly. **However**, some acronyms can't be fixed, for example `US` for the United States is indistinguishable from the collective noun `us`!
2. Most strangely capitalised words like `iPod` are also handled properly, though some need to entered twice, for example `iPod` and `iPods`.

The plan is to augment the list of specially capitalised words with a map of simple text replacements, this would deal with two more edge cases:

1. Words with internal punctuation like `So-called` could be corrected with mappings like `So Called` → `so-called`
2. Commonly used accented words could be corrected with mappings like `Cliche` → `Cliché`

### Title-Casing has Nuance too!

In the abstract, title-case is trivially simple — start every word with an upper-case letter!

In reality, that looks terrible, so some common small words get rendered in all lower case, for example, the headline on this recent [article](https://www.macstories.net/stories/headless-macs-and-hamstrung-ipads/) from Mac Stories: *"Headless Macs and Hamstrung iPads"*. Notice that the *and* is lower-cased.

The term for these special words is *small words*, and I had assumed there was some kind of universally agreed standard on which words do and don't get this treatment. Most people agree on most of the words, at least when writing in English, but there is no actually agreed standard.

I used a module to implement my title-case conversion, and was surprised to discover it didn't lower-case two small words I absolutely expect to be lower-cased — *is* and *its*. The module supports adding additional small words, so by default, the module does two things:

1. Uses the module's standard list (copied to `Linkifier.defaults.importedSmallWords` for easy access)
2. Appends additional words (from `Linkifier.defaults.extraSmallWords`)

That would have been enough to scratch my own itch, but since I'm the kind of person who nit-picks about these kinds of details, I know other people do too, so I made the list customisable 🙂

Like the list of specially capitalised words, the small words used are stored in a Javascript set, specifically, `.smallWords`, so they can be manipulated using the standard Javascript set functions.

### Choosing my Dependencies

Since we talked so much about dependencies, let's quickly look at those I chose to add to this project. For now, I'm going to ignore the dependencies used by the CLI, and focus purely on the dependencies used by the four classes that make up the ES6 module.

I followed my own advice and used exactly as many modules as I needed, and no more:

1. [Cheerio](https://www.npmjs.com/package/cheerio) — a browserless alternative to jQuery, used to parse web pages when building `PageData` objects.
   1. Tens of millions of weekly downloads
   2. Still maintained
   3. [Excellent documentation](https://cheerio.js.org/docs/intro/)
   4. Despite being a very large and powerful module with a lot of features, only has 11 dependencies
2. [Mustache](https://www.npmjs.com/package/mustache) — used to render the template strings stored in the `LinkTemplate` objects.
   1. Millions of weekly downloads
   2. Not actively maintained, but no known vulnerabilities, and likely popular enough that any emerging vulnerabilities will be fixed
   3. Zero dependencies 🎉
   4. [Acceptable documentation](https://github.com/janl/mustache.js)
3. [Node-Fetch](https://www.npmjs.com/package/node-fetch) — Used to fetch the HTML for a given URL
   1. Hundreds of millions of weekly downloads 😳
   2. Not very actively maintained, but no known vulnerabilities, and so popular that any emerging vulnerabilities will undoubtedly be fixed
   3. Just 3 dependencies
   4. Excellent documentation (in the NPM description)
4. [title-case](https://www.npmjs.com/package/title-case) — used for converting strings to title-case
   1. Millions of weekly downloads
   2. Appears to still be maintained
   3. Zero dependencies 🎉
   4. Bare-minimum docs, if even 🙁
5. [URI.js](https://www.npmjs.com/package/urijs) — used for parsing URLs, primarily for extracting the domain names
   1. Millions of weekly downloads
   2. Was actively maintained a decade ago, but no longer the case. No known vulnerabilities, but may need to be replaced soon
   3. Zero dependencies 🎉
   4. [Excellent documentation](https://medialize.github.io/URI.js/)
6. [url-slug](https://www.npmjs.com/package/url-slug) — used to reverse URL slugs back to plain text
   1. Hundreds of thousands of weekly downloads
   2. Very actively maintained
   3. Zero dependencies 🎉
   4. Sufficient documentation (in the NPM description)

Given many of those choices were made a decade ago, I'm relieved that only one might need to be replaced in the medium term 🙂

## Building a Javascript CLI — TO RE-WRITE

Underlying all of my niggles was one master niggle — the fact that this was still a plain script, and not a full command line app.

This meant that the command I was typing into my terminal was actually three commands piped together:

1. `pbpaste` to output the current content of the clipboard
2. `node` with the path to the script
3. `pbcopy` to send the generated URL back to the clipboard

This is obviously a long command, and it had two frustrating side effects:

1. No matter how hard I tried to get rid of it, the final clipboard always contained a trailing newline character!
2. On each site where the download failed, the clipboard got overridden with an empty string, so I had to go copy it again to then manually create the link!

Clearly, I needed this to be a true CLI so I could just call it, have it load my configuration from a standard file name in my home directory (`~/.linkify-config.mjs`), read the clipboard, convert the link, and only write it back to the clipboard if the conversion was successful.

Since all the other works was simpler than expected, I decided to add a CLI while I was familiar with the codebase.

Rather than converting the ES6 module to a CLI, I chose to add the CLI as a separate wrapper around the module. This means the module can still be used within other Javascript code, so users can choose to integrate the logic into their own scripts by importing the module, or just use of my code directly by executing the CLI.

### Choosing a Platform

Using NodeJS, you can manually write a Javascript script that behaves like a CLI app, but that's extremely laborious, and involved re-inventing lots and lots of proverbial wheels.

A much better solution is to leverage a commonly used standard NodeJS module of some kind to handle the common logic all CLI apps need,  like parsing Linux-style command line arguments that support flaps and options like `-x` and `--thing=value`.

After spending some time in conversation with my favourite privacy-protecting chat bot (Lumo), and then exploring the websites various contenders, there really was only one good option for my scale of project — [commander.js](https://github.com/tj/commander.js).

This is a mature project that's MIT licensed, actively maintained, widely used, and currently shows 192 contributors. The documentation also looked sufficiently readable and detailed, so it seemed worth the mental investment to learn how to use this tool.

Thankfully, my judgement proved correct — working with Commander proved to be a real joy, and I had a feature-rich CLI interface wrapped around my new ES6 modules in just a few days.

Now, I can convert links by simply invoking the `linkify` command, and it will:

1. Read my configuration file to configure itself to my preferences
2. Read the URL from the clipboard, and echo it to the screen so I can see what it did (because my configuration file tells it to do both of those things)
3. Convert the URL using my templates and my extraction logic (defined in my configuration file)
4. Seamlessly fall back to de-sluggifying URLs when needed, and warn me when it does
5. Show me the final link (again, because my configuration tells it to)
6. Write the final link to the clipboard (again, because of my configuration)

Once I had a basic CLI working, I started to add some proverbial bells and whistles, most notably, support for coloured terminal output. This makes it easier to distinguish between informational messages like echoing the URL and generate link, and warning messages like the one indicating the need to fall back to de-slugification. 

I could of course have manually added the shell escape sequences for setting colours to my various output strings, but again, why re-invent that wheel!

After another conversation with my favourite AI, I eventually chose to use [Kleur](https://github.com/lukeed/kleur#readme). I had a few reasons for making this choice:

1. It has no dependencies, so it doesn't add more modules to my supply chain (a big cybersecurity concern these days 🙁)
2. It's small and light-weight
3. It\'s MIT licensed
4. It's commonly used

The syntax is also quite straightforward, for example:

```javascript
console.log(bold().red('this is a bold red message'));
```

## Final Thoughts

TO DO
