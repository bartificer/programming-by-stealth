---
title: Building a Javascript CLI App with NodeJS
instalment: 19
creators: [bart, allison]
date: 2026-08-01
---

When evangelising this series, I always say that the ability to code is *empowering* because it lets you scratch your own proverbial itch — you need the computer to do something for you. If you can code, you should be able to make that happen!

I recently spent a few weeks doing a very thorough job of fixing a problem that was really starting to bug me.

I will explain my *problem to be solved and describe how I solved it. But this tidbit isn't really about my specific command line app; it's about how I went about building it and how you could build your own NodeJS command line app to solve your own problems.

I named my app *Linkify*, and like I always do, I released it as open source [on GitHub](https://github.com/bartificer/linkify). That means you can have a peek under the covers to see (and perhaps judge 😉) my code!

I haven't just released the code on GitHub though, I've also published the CLI itself [to NPM](https://www.npmjs.com/package/@bartificer/linkify), so if you have [NodeJS](https://nodejs.org/) installed you can play with the app yourself by simply running:

```sh
npm install --global '@bartificer/linkify'
npx linkify generate 'https://podfeet.com/' --template markdown
```

## Matching Podcast Episode

TO DO

## The Problem to be Solved

I regularly produce news-related podcast content — the month's Apple News for [Let's Talk Apple](https://www.lets-talk.ie/lta), and the cybersecurity news for the [Security Bits](https://www.podfeet.com/blog/category/security-bits/) segments on [the NosillaCast](https://www.podfeet.com/blog/category/nosillacast/).

If you look at the notes for these shows, you'll see that they're quite similar — they consist largely of nested lists of links with some additional context around them.Take for example, the notes for the [June 2026 LTA,](https://www.lets-talk.ie/lta154) or [Security Bits for the 5th of July](https://www.podfeet.com/blog/2026/07/sb-2026-07-05/).

Because my notes have so many links, their formatting is not arbitrary — I actually spent a lot of time thinking about the best way to format those links. My aim was to clearly show:

1. Which parts of the text are from the linked source, and hence, which words are mine
2. Where the story is from

After lots of experimentation, I adopted the following format: `STORY HEADLINE — domain.name/…`. For example:

*  The most recent Let's Talk Apple Episode: [LTA 154: June 2026 — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154) (at the time of writing this tidbit!)

I write all my show notes in Markdown, so that means I need to create hundreds of links of the form:

```markdown
[LTA 154: June 2026 — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154)
```

Creating one or two links of this format manually is not that difficult, but creating hundreds, that's a whole other story! To say I found the process tedious would be putting it very mildly!

I've also started to expand on my template a little. For example, when I link to Apple Press releases in Let's Talk Apple, I want those to stand out clearly as being Apple's PR spin (rather than independent reporting). So, I now format those links like this:

* [Mini Football Legends, Family ‍‍‍Feud ‍‍‍Pocket, and seven more hits join Apple ‍‍‍Arcade — 📣 Apple PR](https://www.apple.com/ie/newsroom/2026/06/mini-football-legends-family-feud-pocket-and-seven-more-hits-join-apple-arcade/)

## Solving the Problem

I've been podcasting for decades at this point, so the CLI app inspiring this tidbit is not my first pass at automating this process. In fact, it's the third:

1. A Javascript-based TextExpander snippet that generated the URL part of the link and moved the cursor to the correct position, where I could then manually paste in the headline. It produced link stubs like `[ — www.lets-talk.ie/…](https://www.lets-talk.ie/lta154)`.
2. A NodeJS script named `linkify.js` that went a step further by automatically extracting the headline from the website given just its URL, and then creating the full link.
3. The *Linkifier* CLI app that inspired this tidbit.

The `linkify.js` script actually implemented most of what the new CLI app does, but with a few important caveats:

1. Executing the script was tedious, and required piping a few commands together:
   1.  `pbpaste` to read the URL from the clipboard
   2. `node` to run the script and output the link
   3.  `pbcopy` to write the link to the clipboard
2. No matter how hard I tried, I never managed to pipe the commands together in such a way that the link did not end up on the clipboard with a trialing newline character.
3. When the command failed, the clipboard got overwritten with nothingness, so I'd lose the link.
4. The code was all written in old-fashioned pre-ES6 JavaScript. Rather than working with classes and packages, it built objects using the old `prototype` method, making the code absolutely tedious to maintain!

Even though the script had its shortcomings, it did actually serve me well for many years. I'm actually quite proud of the fact that I got the basic design right almost a decade ago, and that while the code did need a complete overhaul now, the design did not!

You might be wondering, if the old script had been working fine for nine years, why put all this effort into a third iteration now?

### The AI Fly in the Ointment

None of the little niggles I just described provided enough motivation to spend the best part of a month modernising and then expanding an old codebase. So what changed? 

AI came along and undermined the very foundation of the script's logic — at first, it only started happening on a few sites, but soon, the problem ballooned.

How, exactly, did AI undermine the script's operation?

The script depended on downloading the HTML code for the linked website so it could extract the headline. For years and years, that worked reliably, but when AI bots started to overwhelm websites with their inconsiderate volume and regularity, more and more sites started to deploy bot-blocking tools, and my little script is, of course, a bot. A very benign one that never caused any website any stress, but a bot nonetheless!

That meant that more and more sites went dark to the script, I had to fall back to the old TextExpander snippet and manually copy-and-paste the headlines ever more frequently.

On every site that blocked my script, I had to fall back to manually copying in the title 🙁

The problem grew and grew until eventually I realised I was having to fall back to my old process for about a third of my links. That's bloody time-consuming, so I found myself well motivated to engineer a third solution!

### Some Other Niggles, and a Stretch Goal

Once I was motivated to revisit the old code, I decided to fix as many of my niggles as possible.

The first thing that absolutely needed to be done was to modernise the codebase. There was no way I was going to perform open-heart code surgery on old code!

I decided step zero would be to translate the existing script into modularised ES6 classes. I wouldn't be changing any of the functions at this point, just rearranging them into a modern structure.

Step 1 would be to solve the AI problem, and then I'd start working down my other niggles:

1. A mechanism for invoking the code that didn't require chaining together three terminal commands, and wouldn't add that unwanted trailing newline character
2. A mechanism for applying different templates to different sites automatically, removing the need to manually change my Apple PR links so they had their little megaphone emojis.

Finally, there was also a kind of *stretch goal* — the ability to extract more information from the page than just the headline. My aim was to make it possible to include things like image thumbnails in links to image-first sites like the wonderful [XKCD](https://xkcd.com/).

Spoiler alert, I achieved that stretch goal! That's why recent links to XKCD comics in the *Palate Cleaner* section of the Security Bits segments look like this:

* [XKCD 3262: Sports Commentary](https://xkcd.com/3262)
   ![ADD A DESCRIPTION FOR THE VISUALLY IMPAIRED HERE](https://imgs.xkcd.com/comics/sports_commentary.png)

## Handling Dependencies in 2026

Both the previous `linkify.js` script and the new `linkifier` CLI are built using [NodeJS](https://nodejs.org/en). Since ES6, I've become extremely fond of coding in JavaScript, and the NodeJS environment is mature, well supported, and cross-platform. It also has a very well-thought-out mechanism for including third-party libraries in your own projects: the Node Package Manager [NPM](https://www.npmjs.com).

I simply couldn't create tools like Linkifier without depending on open source modules. I neither have the time nor the skills to implement everything myself from scratch!

In more innocent times, you were pretty safe importing just about any NPM module in your project. Worst-case, it was buggy and didn't work very well, so you tried something else!

Alas, times have changed 🙁

Cybercriminals have realised that compromising dependencies is a great way to get backdoors into otherwise well secured systems. This is referred to as a *software supply chain attack*, and it means that there are real dangers lurking in the NPM repository.

Here are just some of the ways in which attackers are abusing NPM:

1. Using AI to find new and unknown vulnerabilities in old and unmaintained modules that are still widely used.
2. Sneaking additional malicious code into apparently helpful pull requests to the open source community.
3. Tricking worn-out open source maintainers into accepting help from apparently helpful but malicious *"volunteers"*.
4. Hacking developer's NPM or GitHub accounts to publish malicious versions of completely legitimate and well maintained modules. Or, more nefariously, to quietly tweak their CI/CD pipelines (for example GitHub actions) to inject malicious code into every release after the intended code gets pushed!
5. Hacking developers to computers to sneak malicious additions directly into the code.
6. Compromising commonly used development tools — for example, in 2025 and 2026 we have seen a dramatic rise in compromised or malicious plugins in the [VSCode](https://code.visualstudio.com) market place.

The extra sting in the tail is that dependencies can be nested — modules can depend on other modules that depend on other modules, *ad infinitum*. This branching structure of nested dependencies is referred to as a *dependency tree*. When you import one module, you may well get tens or even hundreds of modules added your project's dependency tree!

If any one module anywhere in your dependency tree has a known vulnerability, then there's a **possibility** your code is vulnerable too. I say there's a *possibility* because not all vulnerabilities in your tree can actually be triggered from your code. If you depend on a module that has two functions, one with a known vulnerability, and one without, and your code only uses the safe one, then your code is not actually vulnerable!

It's often much more nuanced than that. If the vulnerability can only be triggered when a third optional argument is passed, and you never pass such an argument, then even though you're using a function with a known vulnerability, you're still safe because you're not using the vulnerable part of the module.

In other words, **your code is not actually vulnerable to every vulnerability that exists in your dependency tree**!

### There is no Simple Solution

It might be tempting to just stop using NPM modules, but not only is that utterly impractical, it's also likely to be **less** secure!

No one can possibly be an expert at everything, and no amount of careful coding can make up for years of real-world testing by a large community. Realistically, the code you write yourself to avoid depending on NPM modules probably contains more vulnerabilities than any reputable NPM module does!

This means we need a nuanced approach, which means we can't fall back to hard-and-fast rules, but we need to use our own best judgement 🙁

### You're Not Alone — There is Help!

The entire open source community is very aware of these supply-chain problems, so there's a lot of work underway to make it ever harder for attackers to succeed. There will always be some attacks that succeed, at least for a while, but a lot is going on to tighten things up.

For example, both NPM and GitHub are updating their systems to add ever more safety mechanisms.

To illustrate this point, when I first signed up to GitHub decades ago and opened my NPM developer account, neither site required multi-factor authentication, and neither site did any kind of automated vulnerability scanning against the code I published.

Today, I can't log into GitHub without my PassKey, and I was forced to add multi-factor authentication to my NPM account to continue publishing modules. I can't publish new versions of the Linkify tool without passing **two** multi-factor authentication challenges, and all my code is scanned in the background by both GitHub and NPM to check for known vulnerabilities.

The community is also responding with new tooling to help developers manage their dependencies safely.

NPM is a good example of  this — there are tools built right into the `npm` command itself for managing known vulnerabilities in your dependency trees.

### Auditing your NPM Dependencies

The people controlling NPM track and monitor all known vulnerabilities in all NPM modules. They know the exact versions affected by each bug, and whether or not patched versions of those modules have been released. They also know, thanks to the [Semver](https://semver.org) numbering system NPM modules use, whether or not the patched versions of previously vulnerable modules introduce breaking changes.

NPM classifies each known vulnerability into four severities — here they are as summarised by my favourite privacy-respecting AI assistant [Lumo](https://proton.me/lumo):

1. **Low** — Minor security issues that are unlikely to be exploitable in most environments or require very specific conditions to trigger.
2. **Moderate** — Vulnerabilities that could lead to security issues but typically require a particular setup or user interaction to exploit.
3. **High** — Serious vulnerabilities that pose a real risk and are often directly exploitable, potentially leading to data exposure or code execution.
4. **Critical** — The most severe issues, typically allowing remote code execution, authentication bypass, or other high-impact exploitation.

You can access this functionality using the `npm audit` command.

To illustrate how this all works, let me walk you through my process for checking my NPM projects for known vulnerabilities.

The first step to see where things stand is to ask NPM to give you an audit report. Simply open a terminal in your project folder and run:

```sh
npm audit
```

This reads your dependencies from your `package.json` and `package-lock.json` files, and checks your full dependency tree against NPM's vulnerability database.

You just might get very lucky and find you have no vulnerabilities at all. Maybe. Realistically thought, that's not likely in any kind of substantial project that you've been maintaining for a while. You'll probably find at least some vulnerabilities to triage.

The next step is to update your dependencies as much as you can without introducing breaking changes — that means never updating across major versions (e.g., from `2.*.*` to `3.*.*`). NPM has your back here by making it intentionally difficult to update modules across major versions.

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
* **Wanted** — the best available update **without breaking changes** (assuming you've added your dependencies with `npm install` and not manually edited your `package.json` file to intentionally allow automatic upgrades across major versions)
* **Latest** — the most recent published version

You can safely update any module where the *current* version is behind the *wanted* version, regardless of whether there's also a *latest* version that introduces breaking changes with commands of the form:

```sh
npm update PACKAGE_NAME
```

Once you install all the safe-to-install updates, check your vulnerabilities again with `npm audit`.

Hopefully you now have fewer, but you may still have some.

Your next safe option is to allow `npm audit` to make safe edits to your `package-lock.json` file to override nested dependencies.

This means that if one module imported an vulnerable version of another, and there is a safe version of that second module available, your `package-lock.json` will be updated to use the safe version, even though the first module still specifies the unsafe version. Again, `npm audit` does this very carefully so as to make the smallest possible changes, and never to upgrade across major versions, hence, avoiding breaking changes.

It feels very scary the first time you do it, but NPM really have worked hard to make this safe to do:

```sh
npm audit fix
```

Check your current list of vulnerabilities one more time with `npm audit`, and hope to see as few remaining vulnerabilities as possible 🤞

At this point you've fixed every vulnerability that can be safely and easily fixed with simple module updates. So, whatever vulnerabilities remain need careful consideration. In other words, we move from a deterministic process to human judgement.

### Applying your Best Judgement

You need to examine the remaining vulnerabilities to try understand their relevance to your use of the problematic dependency. 

This is where **context matters**! Your situation could be very different to mine, so **don't construe my choices** in my situation **with any kind of recommendation**!

These days, I only code for my own personal use, so I don't need to be as cautious as I would were I coding professionally. My focus is on software that runs locally in my terminal, or runs purely client-side on the web. That means the attack surface exposed through any vulnerabilities is very limited. Basically, abusing vulnerabilities in my apps will harm no one but the person running the code! I'm not going to abuse my code to hack myself, but if you want to abuse my code to hack yourself, have at it!

If I was writing software with the ability to harm others, say for use on corporate systems, or server-side web apps, then I'd need to be a lot more careful. There would be many more vulnerabilities that I'd need to remediate immediately.

So, given my very specific context, I generally:

* Ignore *low* severity issues
* Give *moderate* severity issues a quick glance
* Focus my attention on any *high* and *critical* issues — triaging *high* severity issues carefully, and fixing *critical* issues as soon as possible

Another type of context to bear in mind is that there are two completely **different types of dependency**!

* **Regular dependencies** — by default, `npm install` adds modules as regular dependencies.You'll find them listed in the `dependencies` array in your `package.json` file. Assuming you're using NodeJS and NPM correctly, these should all be dependencies that are needed to **run the built code**. That means that when the software is used in its normal way, these dependencies are relevant. It also means that if you publish your module to NPM, other users installing your module get these dependencies installed into their project's `node_modules` folder.
* **Developer Dependencies** — when you add dependencies with `npm install --save-dev` they get added as developer dependencies. You'll find these dependencies in the `devDependencies` array in your `package.json` file. Again, assuming you're using NodeJS and NPM as intended, these dependencies are **not** relevant when running your software in the normal way, they're **only** used in your build process. This also means that if you publish your module to NPM, when **other people** install your module into their projects, they **do not get your developer dependencies**. (To get the developer dependencies you need to clone the Git repository and then run  `npm ci` or a bare `npm install` without any arguments.)

This distinction means that vulnerabilities in developer dependencies are fundamentally different to vulnerabilities in regular dependencies. For the most part, vulnerabilities in developer dependency can only be used to attack the person building the software, so they're generally of no value to attackers. However, there are some really important exceptions to that general rule, including:

1. Developer dependency vulnerabilities that somehow **corrupt your build process**, secretly injecting malicious code into your legitimate software.
2. Developer dependencies with vulnerabilities designed to **find secrets** and silently steal them.
3. Developer dependencies with vulnerabilities that maliciously **destroy data** (wipers).

So, just to recap, there's no universally right approach to take to any of this — you need to make your own judgements based on the vulnerabilities themselves, how the vulnerable modules are used in your project, and the context of the software you're developing.

### A Quick Example — Vulnerabilities in Linkify

As I type these notes in July 2026, the Linkify project has just two vulnerabilities, both *moderate*. I've already made sure all the modules that can be safely updated have been, and I've run `npm audit --fix` to handle the remaining safe fixes. That means I need to apply my judgement these two vulnerabilities.

Remember that the Linkify app is used locally, so abusing any vulnerabilities within it can only harm the person running the code. In other words, you could only hack yourself! Because of that context, I'm not particularly concerned about *medium* vulnerabilities, but I do want to give them a quick look to be sure they really are OK to leave unaddressed.

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

So, there's one actual vulnerability, but it affects two modules within my dependency tree — the vulnerable module itself, and the module that depends on the vulnerable module. That's why `npm audit` counts it twice.

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

This is mixed news — I could have found that there simply is no patch at all. Had all three of *current*, *wanted*, and *latest* been `4.3.3`, then patching would have been impossible, but *latest* shows `5.0.7`. This crosses a major version boundary (`4.*.*` → `5.*.*`), so that implies there would be breaking changes. Let's check that with a quick look at the [release notes](https://github.com/ankitskvmdam/clean-jsdoc-theme/releases#release-v5.0.0) for `clean-jsdoc-theme`. The opening line says it all:

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

We now have all our context — there is a vulnerability in the module that builds my documentation that can consume my RAM/CPU if I add an intentionally malicious link into my JSDoc comments. This is purely a developer dependency, so users downloading my module actually get zero vulnerabilities. I'm quite happy to keep building my docs like I do because I know I'm not going to add a link designed to consume my own computer's resources! So, I feel just fine leaving the vulnerability as-is, at least for now. When I have some time I'll migrate to the new version of the Clean JSDoc theme, because it does actually look interesting, so l opened [a GitHub issue](https://github.com/bartificer/linkify/issues/24) to remind myself to do the upgrade when I have the time.

### Some Guidance for Choosing your Dependencies

We know that writing everything from scratch is dangerous, and we know that importing other people's modules can also be dangerous, so what can we do? My advice is simple — **install exactly as many dependencies as you need, and no more**!

Actually, I have some more advice. NPM is such a rich ecosystem that you usually find yourself with many possible modules to choose between to solve your specific problem. Choosing the right one can really reduce your exposure to vulnerabilities.

I can't give you a universally agreed checklist, but I can share my approach.

I don't try to find perfect modules, because while there are lots of choices, it's very rare they're **exactly** like my ideal module. Instead, I look for positive signals, and I favour modules with more positive signals over those with fewer.

Here's what I look for:

1. A healthy-looking NPM page
   1. A high number of weekly downloads
   2. A thoughtful description
   3. A link to a GitHub repository
2. A recent release history, with some bug fixes at least
3. Decent documentation (shows care,  and will save my sanity too!)
4. Few, or better yet, no, dependencies

SUGGESTED BREAK POINT (AND END OF BART PROOF READ)

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
   * Tens of millions of weekly downloads
   * Still maintained
   * Active [GitHub repo](https://github.com/cheeriojs/cheerio) 
   * [Excellent documentation](https://cheerio.js.org/docs/intro/)
   * Despite being a very large and powerful module with a lot of features, only has 11 dependencies
2. [Mustache](https://www.npmjs.com/package/mustache) — used to render the template strings stored in the `LinkTemplate` objects.
   1. Millions of weekly downloads
   2. Not actively maintained, but no known vulnerabilities, and likely popular enough that any emerging vulnerabilities will be fixed
   3. Has a [GitHub repo](https://github.com/janl/mustache.js), but also not recently active
   4. Zero dependencies 🎉
   5. [Acceptable documentation](https://github.com/janl/mustache.js)
3. [Node-Fetch](https://www.npmjs.com/package/node-fetch) — Used to fetch the HTML for a given URL
   1. Hundreds of millions of weekly downloads 😳
   2. Not very actively maintained, but no known vulnerabilities, and so popular that any emerging vulnerabilities will undoubtedly be fixed
   3. Has a [GitHub repo](https://github.com/node-fetch/node-fetch), but not recently active
   4. Just 3 dependencies
   5. Excellent documentation (in the NPM description)
4. [title-case](https://www.npmjs.com/package/title-case) — used for converting strings to title-case
   1. Millions of weekly downloads
   2. Appears to still be maintained
   3. Has [GitHub repo](https://github.com/blakeembrey/change-case), but not recently active
   4. Zero dependencies 🎉
   5. Bare-minimum docs, if even 🙁
5. [URI.js](https://www.npmjs.com/package/urijs) — used for parsing URLs, primarily for extracting the domain names
   1. Millions of weekly downloads
   2. Was actively maintained a decade ago, but no longer the case. No known vulnerabilities, but may need to be replaced soon
   3. Has [GitHub repo](https://github.com/medialize/URI.js), but also inactive
   4. Zero dependencies 🎉
   5. [Excellent documentation](https://medialize.github.io/URI.js/)
6. [url-slug](https://www.npmjs.com/package/url-slug) — used to reverse URL slugs back to plain text
   1. Hundreds of thousands of weekly downloads
   2. Very actively maintained
   3. Has active [GitHub repo](https://github.com/stldo/url-slug)
   4. Zero dependencies 🎉
   5. Sufficient documentation (in the NPM description)

Given many of those choices were made a decade ago, I'm relieved that only one might need to be replaced in the medium term 🙂

## Building a Javascript CLI

With the ES 6 module built, I was still left with no way to execute my code other than a NodeJS script. That would have worked of course, but it would have left me with an underlying niggle that has been irking me for years.

Because my was not a proper CLI app, I needed to pipe three commands together to convert a link in my clipboard:

1. `pbpaste` to output the current content of the clipboard
2. `node` with the path to the script to perform the conversion
3. `pbcopy` to send the generated URL back to the clipboard

This is obviously a long command, and it had two frustrating side effects:

1. No matter how hard I tried to get rid of it, the final clipboard always contained a trailing newline character.
2. On each site where the download failed, the clipboard got overridden with an empty string, so I had to go copy it again to then manually create the link.

A better solution would be to build a CLI wrapper around my ES6 module that could:

1. Support configuration files in known-locations like `~/.linkify-config.mjs`
2. Optionally use the clipboard as the URL source and/or destination (using flags)
3. Share my work in a conveniently usable way

Given how familiar I was with my code at this stage, it seemed like it was worth putting a little more time into this to get to the solution I really wanted.

### Choosing the Tooling

For a script to feel like a CLI app it has to adopt all the standard conventions for Linux terminal apps. Re-inventing all that from scratch would be a massive undertaking, and there's no way I'd capture all the nuances. Clearly, I needed to choose some modules to provide me the basics.

Many years ago I experimented with Javascript CLI apps with NodeJS using [Caporal.js](https://github.com/mattallty/Caporal.js). At the time, that was the option I found fitted my needs best, but a lot of time had passed, so I spent a little time chatting with Lumo (my preferred AI chat bot) and ended up with two additional options to investigate:

1. [OClif](https://oclif.io)
   * Extremely powerful, and very feature rich
   * Actively maintained with hundreds of thousands of weekly downloads on [NPM](https://www.npmjs.com/package/oclif)
   * Very widely recommended, lots of tutorial blog posts online, and excellent documentation
   * 137 dependencies — not unexpected for a module of this complexity
   * Uses modern Javascript technologies like promises
   * Requires TypeScript rather than pure Javascript
   * The tool's power adds a lot of complexity — there's a lot of overhead for creating simple apps
2. [Comander.js](https://github.com/tj/commander.js)
   * Actively maintained with hundreds of thousands of weekly downloads on [NPM](https://www.npmjs.com/package/commander)
   * Well document, also commonly recommended, and there are also a lot of tutorial blog posts online
   * No dependencies 🎉
   * Fewer features than OCLif, but still supports the relevant features for this project — single and double dash CLI flags and options, and support for sub-commands
   * Also uses modern Javascript techniques like promises
   * Much simpler to use than OClif, far less overhead
   * Philosophically very like Caproal.js, so immediately felt familiar

In the abstract, Oclif is the better option, but for a small tool like Linkifier, it's just overkill. Being so feature-rich it inevitably has dependencies, and not just a few! Add to that the fact that I'd need to teach myself TypeScript to use it, and it wasn't a good fit for me.

Commander.js on the other hand felt immediately familiar because it really is the spiritual successor to Caporal.js, but modernised. Being so much less ambitious, it also has no dependencies, so using it would create less long-term maintenance work to keep the app secure. Given my experience, and the scale of this project, it was clearly the best fit!

Being a little simpler than Oclif, Commander.js doesn't include optional extra features like support for coloured terminal output. It's not in any way incompatible with coloured output, it just won't do that work for you.

Terminal text colouring works using cryptic Bash escape sequences. I absolutely could teach myself how they work and manually implement the colours, but again, that seemed like a terrible waste of my time!

In the past I used the very popular module [Chalk](https://www.npmjs.com/package/chalk), but again, I wasn't sure it was still the best option for this project, so I had another conversation with Lumo. There's nothing wrong with Chalk, but it's more powerful than I need, so I ended up choosing a lighter-weight option, [Kleur](https://www.npmjs.com/package/kleur).

Kleur is the fasted and most light-weight of the current terminal formatting modules, it has no dependencies, and the syntax is simple, making it quick and easy to learn. Given it has tens of millions of weekly downloads, it definitely has strong community support!

Finally, I needed to interact with the clipboard. I'd researched this before for other projects, so I knew [Clipboardy](https://www.npmjs.com/package/clipboardy) was probably the right approach.

A quick check verified that it is indeed still a good option. It's actively maintained, has a nice simple API, is downloaded millions of times a week, and it only has six dependencies.

To summarise, adding a CLI adds three new dependencies to my project:

1. [Commands.js](https://www.npmjs.com/package/commander) for implementing the CLI functionality
2. [Kleur](https://www.npmjs.com/package/kleur) for adding formatted terminal output
3. [Clipboardy](https://www.npmjs.com/package/clipboardy) for interacting with the clipboard

### Handing Custom Configurations

One of the most important things I wanted the CLI app to do is to support configuration files. These files needed to allow for two distinct types of configuration:

1. Configuration of the `Linkify` module, including:
   1. Defining headline extraction logic for sites
   2. Defining templates and controlling templates
   3. Controlling the de-slugification process
2. Setting defaults for the CLI's apps own behaviour

As a general rule, I prefer configuration files that are purely text, ideally in a nice simple text format like JSON or YAML. Unfortunately, that simply isn't an option when you need users to be able to define functions and instantiate objects, and I needed those capabilities.

The only way to effectively configure a `Linkifier` object is to create one and then manipulate that instance to configure it as needed. This meant leaning into the design pattern used by other big Javascript projects like https://webpack.js.org — using ES6 modules as configuration files. In other words, you configure the `linkify` command with an `.mjs` file rather than a `.json` or `.yaml` file.

The configuration needs to facilitate two distinct types of configuration:

1. The configuration of the ES6 module — headline extraction logic, templates, etc.
2. The configuration of the CLI app — defaults for the supported flags and options

To facilitate this, Linkifier configuration modules need to export a dictionary with one or both of the following keys as its default export:

* `linkifier` — a configured instance of the `Linkifier` class
* `options` — a dictionary mapping values to the CLI's flag and option names, but with the `--` omitted.

With the structure of the configuration file defined, the next step is to figure out how to load it. Obviously, the command will need an option to manually specific a path, but you really don't want users to have to do that every time! Clearly, I wanted the `linkify` app to implement the Linux/Unix convention of supporting so-called *dot files*.

I chose to have the command implement the following configuration loading priority, from highest precendence to lowest:

1. A path specified on the commandline
2. A file named `~/.linkify-config.mjs`
3. The default configuration

With that rather important detail decided, the next step was to design the app's syntax.

### Designing the CLI Syntax

Before trying to implement the app's functionality, I need to decide on the exact features to offer, and how to facilitate user input. In other words, what flags, options, and arguments would the command support and expect?

I like the common sub-command design pattern used by commands like `git`. Single top-level commands expect to be passed a subcommand as the first argument to determine which of their supported actions to execute, like `git clone` and  `git commit`.

Given the functionality I wanted to provide, I chose the following:

1. `linkify generate-link` with the alias `linkify generate` to actually generate links
2. `linkify show-defaults` with the alias `linkify defaults` to show users the default settings the command uses
3. `linkify show-config` with the alias `linkify config` to show the users their currently loaded configuration
4. `linkify preview-page-data` with the alias `linkify page-data` to fetch the `PageData` object for a given URL to help users develop their title extraction logic

Without my needing to do any work, Commander.js automatically add a final `linkify help` sub-command. Assuming you follow best practices and assign descriptions to the commands, flags, and options you define, the output will be genuinely useful to your users.

Next, before figuring out the details for each sub-command, you need to choose your list of global flags and options. I chose to add just a few:

* `-V` or `--version` to echo the version number
* `-C` or `--config` for specifying a configuration file path
* `-d` or `--debug` for enabling additional output

Finally, Commander.js also automatically adds `-h` and `--help` flags which show the command or the sub-command's help text.

Now that we know the app's top-level API, the next step is to design the APIs for each of the sub-commands.

The simpler sub-commands don't actually need an API, specifically, `linkify show-defaults` and `linkify show-config` don't need any arguments, flags, or options, so they have no API as such.

The automatically created `linkify help` accepts just one argument, an optional sub-command name, allowing users to see the top-level help, or sub-command-specific help.

#### Generating Links

This is the most complex sub-command, so it has the richest API.

Firstly, it accepts just one argument — a URL. Perhaps surprisingly, this argument is optional. Why? Because the app support reading the URL from the clipboard!

All sub-commands support the global options and flags, but each sub-command can add more that only apply to that sub-command. `linkify generate` adds the following flags

* `--from-clipboard` and `--no-from-clipboard` to force-enable or disable reading the URL from the clipboard, regardless of what the loaded config defines.
* `--to-clipboard` and `--no-to-clipboard` to similarly force-enabled or disable outputting of the generated link to the clipboard
* `-c` and `--clipboard` as a shortcut for `--from-clipboard` and `--to-clipboard`
*  `--no-clipboard` as a shortcut for `--no-from-clipboard` and `--no-to-clipboard`
* `-e` and `--echo-clipboard` to echo what is being read from and/or written to the clipboard to the terminal

The `linkify generate-link` subcommand adds just one option:

* `-t TEMPLATE_NAME` and `--template=TEMPLATE_NAME` to force a specific template to be used for rendering the link

#### Viewing Page Data

The `linkify preview-page-data` sub-command is similar to but a little simpler than the `linkify generate-link` sub-command, but it does still need an API.

Like the page generation sub-command it accepts one argument, a URL, and it too is optional.

To keep things consistent, all relevant flags supported by the link generation sub-command are also support by `linkify preview-page-data`, specifically:

* `--from-clipboard` and `--no-from-clipboard`
* `-c` and `--clipboard`, but simply as an alias for `--from-clipboard`
* `--no-clipboard`, but simply as an alias for `--no-from-clipboard`
* `-e` and `--echo-clipboard`

### The CLI Code

Because the CLI app is just a wrapper around the ES 6 module which is doing the vast majority of the work, and because Commands.js is quite light-weight, the code for the entire CLI app is contained in just one file!

If you're curious to see the code, you'll find it in `bin/cli.mjs` [on GitHub](https://github.com/bartificer/linkify/blob/master/bin/cli.mjs).

## Using the Command

To get started using `linkify` yourself, the simplest thing to do is to install it at the account level (rather than into the current folder) with `npm`:

```sh
sudo npm install --global '@bartificer/linkify'
```

Once you have it installed you can execute it from any folder with the command `npx linkify`.

To generate a link using all the default settings, simply run:

```sh
npx linkify generate https://www.podfeet.com
```

To see all the defaults, including the default list of templates available, run:

```sh
npx linkify defaults
```

To generate a Markdown link for Allison's website run:

```sh
npx linkify generate https://www.podfeet.com -t markdown
```

The command really is designed to be customised, so if you're going to use the command for real, you'll need to build yourself a `~/.linkify-config.mjs` file.

The Git repo contains two examples to get you started, the first is a simple starter example:

```javascript
// Example Linkifier Customisation Module - Minimal
// ================================================
// A customisation module defining defining both link generation customisations
// and default CLI options.

// Import the Needed Linkify Classes
// ---------------------------------
// 1. Linkifier - required for all link generation configuation customisations
// 2. LinkData - required to add custom data transformers
// 3. LinkTemplate - required to add custom templates
import { Linkifier, LinkData, LinkTemplate } from '@bartificer/linkify';

// Customise Link Generation
// -------------------------

// start with a default linkfifier
const linkifier = new Linkifier();

// add a custom template — a link with the page title and domain name as the text in markdown format
// e.g. https://lets-talk.ie/lta → [Let's Talk Apple — lets-talk.ie/…](https://lets-talk.ie/lta)
linkifier.registerTemplate( // a minimal template, no filters or extra field extractor
    'markdown-domain', // the template's name
    new LinkTemplate('[{{{text}}} — {{{uri.hostname}}}/…]({{{url}}})') //the template string in Mustache format
);

// Add a custom data transformer to strip the prefix from Daring Fireball blog posts
// Without Custom transformer:
// https://daringfireball.net/linked/2026/04/22/thompson-cook
// transforms to:
// [Daring Fireball: Ben Thompson on Tim Cook's Legacy — daringfireball.net/…](https://daringfireball.net/linked/2026/04/22/thompson-cook)
// Want:
// [Ben Thompson on Tim Cook's Legacy — daringfireball.net/…](https://daringfireball.net/linked/2026/04/22/thompson-cook)
linkifier.registerTransformer(
    'daringfirebill.net', // the domain name to apply the transformer to (propagates to sub-domains)
    (pData) => { // an arrow function that takes a PageData object as input, and must return a LinkData object
        return new LinkData(
            pData.url, // pass the url through un-changed
            pData.title.replace('Daring Fireball: ', '') // use the page title with the prefix removed as the link text
        )
    }
);

// Customise the App Behaviour
// ---------------------------

// set any desired options
const options = {
    clipboard: true, // equivalent to --clipboard flag
    echoClipboard: true, // equivalent to --echo-clipboard flag (all two-word flags are camelCased)
    template: 'markdown-domain' // equivalent to --template=markdown-domain 
};

// Export all Customisations
// -------------------------

// must export a plain object with the keys 'linkifier' and/or 'options' as 'default'
const config = { linkifier, options };
export {config as default};
```

This file looks long, but it's mostly comments.

For a more real-world example, you can see the latest snapshot of the configuration file I actually use for all my show notes in `examples/linkify-config-realworld.mjs` [on GitHub](https://github.com/bartificer/linkify/blob/master/examples/linkify-config-realworld.mjs).

## Final Thoughts

Modernising my link generation tool, and solving my various problems and niggles was really satisfying. It reminded of just why I love being a coder. Making computers do your work for you really is so gratifying 🙂

I hope to have whet a few appetites among you all, and I hope you'll be inspired to build your own CLI apps in Javascript. I really do recommend using Commander.js, it's powerful, light-weight, and very self-consistent. Once you get the module's philosophy, everything makes so much sense!
