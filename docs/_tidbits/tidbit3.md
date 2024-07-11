---
title: Managing the NPM (or Packagist) Trade-off
---
# PBS Tidbit 3 of Y — Managing the NPM (or Packagist) Trade-off

This tidbit was inspired by a relatively recent news story about two very popular NPM packages, but it serves as an illustration of a much bigger point — you need to proactively manage your code's dependencies.  It's pretty obvious that each time you include someone else's code in your project you're taking on some risk, but what's less obvious is that you often also take on risk by choosing **not** to use other people's code!

Like so much in software development, there is no simple set of rules to follow to stay safe.  You simply must take the time to make considered judgement calls, and accept that you'll get it wrong from time to time. The worst thing you can do is ignore the problem, and the good news is that experience helps, so you can learn from your mistakes.

But let me be very clear up front — **if you're looking for an algorithm to unthinkingly follow, I can't help you with that**, because none exists!

While this tidbit was inspired by a specific news story, that's not where I want to start our journey. We will get there, but not straight away.

## Matching Podcast Episode

Listen along to this instalment on [episode 719 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2022/03/ccatp-719/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2022_03_19.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2022_03_19.mp3" >Download the MP3</a>

## Why Use Other People's Code?

If using other people's code is risky, why do it at all?

The most obvious answer is to save resources. If you're in a cynical mood you can call it laziness, and if you're in a more thoughtful mood, efficiency. But I would argue it's even more than that. It makes it possible to solve real-world problems. If you never use anyone else's code you could only ever solve trivial problems. You'd just spend your life re-inventing wheels, trapped in the easy stuff with no time to get to the powerful stuff.

But it's worse than that — it's not just about not getting things done, it's that if you always roll your own, you'll make naive and catastrophic mistakes. Probably the single best way to ensure your code is a security nightmare is to write your own crypto code!

By choosing to always write your own code, you're making you code inevitably insecure. So, in an attempt to improve your security by removing an obvious source of risk, you're actually adding a much more dangerous new source of risk — your own inability to know what it is you don't know!

It's probably obvious that writing your own encryption or hashing code is a terrible idea, but the problem is actually much bigger than that. There are lots of risky things your code inevitably has to do. Just off the top of my head, I can think of four big ones straight away: sanitise user input, interact with the file system, interact with other processes, and communicate across a network.

So, in summary, I'd argue these are the main reason I advise using open source libraries in your code:

1. **Security** — You don't know what you don't know!
2. **Capability** — You can't have expertise in everything. If you want to be able to solve real problems, you need to outsource to those who have the expertise you don't.
3. **Efficiency** — Even when you can reinvent the wheel, it inevitably costs time and energy, that's time and energy you could be spending solving problems that haven't already been solved!

## What Could Possibly Go Wrong?

Great, so using other people's code is good, so I should do it as much as I possibly can, right? The more I use, the better off I'll be? Nope 🙁

Open source libraries are not magic, they're just other people's code, and other people are, well, people — they're just as flawed as you are!

Let's start simple. Anyone can publish some code on GitHub, give it a fancy name, label it with a few choice keywords, slap an open source license on it, and start spreading the word on social media. Just because someone else wrote it doesn't mean it's better than what you'd cobble together in an afternoon!

The [Dunning-Kruger effect](https://en.wikipedia.org/wiki/Dunning–Kruger_effect) makes it inevitable that people with an overestimated opinion of their skills will release dangerously naive code. None of us have the monopoly on human shortcomings!

Imagine we have a superpower: the ability to make **correct** snap judgements on the competence and skills of others. This would mean we could avoid every open source library published by the inept, and guarantee that we only ever imported well-written code by competent developers. Surely we'd be safe? Nope!

Firstly, even great developers are still human, they still make mistakes! So, all code has bugs, hence, every library you import has bugs.

And, secondly, the world is not a static place. Even if you could have perfect code that worked exactly as designed today, it could well become catastrophically insecure in a year. Protocols get updated, computers develop new capabilities, and the bad people invent new attacks. Code, like a garden, needs to be tended. So, you don't just need the libraries you import to be correct today, you need them to be actively maintained so they stay that way!

Companies and people come and go, and priorities change. Code gets abandoned all the time. Code with one passionate maintainer is obviously the most vulnerable to this, but it can happen to any library. Sometimes it's temporary, and stale projects get revived, but sometimes they just fade away, and the code becomes ever more unsafe as time goes on.

So far we've been assuming well intentioned ignorance and benign neglect, but there is another human failing we can't ignore — malice!

There are people out there out to exploit others to make a buck. It sucks, but it's true.

A naive, malicious person could simply release malicious code directly — create a new project, give it a nice description, and hope victims stumble across it. Sure, this happens, but it's not particularly effective because code that's malicious from day one doesn't come with a reputation, and reputations really matter.

If you search a package manager and you get back one result with 500K monthly downloads, a 10 year version history, and 100K pins/likes, and another result released last week with 50 downloads in total, and one contributor, which would you be most likely to hitch your proverbial wagon to?

To truly be effective, malicious people need to steal a good reputation. There are all sorts of techniques, but two are popular:

1. **Confusion** — give you package a name that's confusingly similar to a legitimate one with a well earned reputation. A very common approach is typo-squatting, but the problem is bigger than that. It can be intentional confusion by adding a post-fix like `JS` after a legitimate name, or it can be registering the name of a legitimate library on a platform they don't use.
2. **Hijacking** — if you can somehow take control of an existing project with a well-earned reputation, you can abuse that. It could be something as simple as stealing a private key with commit access to the Git repo!
3. **Buy-out** — sometimes developers get worn down, and bad people simply offer them some money to take over their project. They have now purchased a reputation which they can exploit to deliver their malware.
4. **Sabotage** — sometimes legitimate projects go bad because some or all of the people involved decide they've simply had enough and just blow it up to cause as much misery as they can on the way out the proverbial door!

So, summing up, the main reasons not to use other people's code are:

* **Inevitable Mistakes** — all developers are human, all humans make mistakes, so all code has bugs!
* **Over-confidence** — some developers simply don't realise how little they actually know!
* **Abandonment** — code that is not maintained becomes every more dangerous.
* **Malice**

## Damned if you Do, Damned if you Don't‽

So, neither extreme is viable — if you never use anyone else's code you'll get very little done, and what little you do get done will be an insecure buggy mess, but if you just blindly use every library out there you'll end up with deceptively powerful code that's a buggy insecure mess 🙁

The only solution to situations like this is human skill and judgement. You need to proactively make well reasoned decisions on when to use other people's code, and which code to use.

I can't give you an equation that spits out an answer, but I can offer some guidance on how to think about the problem.

I see there being two distinct questions:

1. Do I use a library for this, or do I write my own code?
2. If I do use a library, how can I evaluate my choices?

### Question 1 — Roll My Own or Use a Library?

* How well do I know the topic?
* How big of a task would it be to write my own?
* How bad would it be if I made a mistake?

### Question 2 — How do I Feel About This Library?

* Does the documentation show expertise in the area?
* Does the project have a good reputation, e.g. does it get recommended a lot on Stack Overflow, blogs, tutorials, etc.?
* Is the code being actively maintained?
* Does the project have a strong community?

## Some General Advice

Finally, before we move from the abstract into the more concrete, I want to share two other pieces of advice:

### Tip 1 — Make Your Dependencies Explicit

There are two very different ways of using other people's code. You can copy and paste it into your project, (by taking one or more files and copying them into your source folder, or, even just copying-and-pasting some classes or functions), or you can use a package manager of some kind.

Whenever possible, use a package manager, because that way your dependencies are explicitly included in your project's metadata. That's why I chose to introduce NPM in the programming by stealth series — our dependencies will be listed in `package.json` in a computer-readable format.

The reason to do this is to make it possible for computers to help you audit your dependencies, which brings me to my second tip:

### Tip 2 — Make Use of Auditing Tools

There are lots of tools out there that can scan a project's metadata to build a dependency graph, and then compare that graph to known security vulnerabilities. Obviously, this is only possible if you explicitly specify your dependencies. If you just copy some files these kinds of tools won't be able to help you. We'll talk about how to audit your code in a moment.

## So What Happened Recently?

This tidbit was triggered by a question from Allison about a recent news story, so what happened? You can [read the details in this Bleeping Computer article](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/), but the gist is that the developer of two very popular open-source JavaScript libraries published via NPM got fed up with big companies using his code entirely legally but not paying him, so he sabotaged his packages and wrong a ranty blog post.

He could have been truly malicious and silently injected malware, but instead he just added some infinite loops and printed gibberish to the console.

After a few hours of confusion, GitHub suspended the developer's account, NPM rolled back the updates, and the community forked the projects, allowing the unsabotaged versions to live on. 

In short, it was a storm in a teacup. But it does beg the questions, how much worse could it have been and can I do anything to protect myself?

The answer to the second question is easy — yes! We'll end this tidbit with that answer, but the first question bears thinking about first.

I'd argue that open source is a self-correcting system. The most people use a given library, the more potential damage could be done, but, the quicker it will get noticed and fixed. The more obscure a library, the longer malicious shenanigans can last, but, by definition, the fewer people will be affected. So, if you attack a big project you'll be stopped quickly, and if you attack an obscure one, your attack will be impotent, so on the whole, the actual damage that's likely to be done is small either way.

There were a lot of breathless headlines, but this was not any kind of catastrophe. It was nothing more or less than a good reminder that **we should use other people's code intelligently. We should use as much as we need, but no more, and we should choose the code we use carefully**.

## Getting Practical — Managing NPM Dependencies in Our JavaScript Code

We're currently programming in JavaScript in the Programming by Stealth series, and we're using NPM to manage our dependencies, and GitHub to manage our code. Are there any tools we should be using?

Yes, and we don't even have to try hard to do it!

NPM has an audit feature; it can scan your `package.json` for known vulnerabilities and help you deal with them. To get started simply run:

`npm audit`

Then follow the advice/instructions it gives. You'll find [the full documentation for the audit feature on the NPM website](https://docs.npmjs.com/cli/v8/commands/npm-audit).

When you run NPM commands to install or upgrade packages it will proactively run an audit for you, but if your code isn't changing that won't happen, so you'd need to remember to audit your dependencies from time to time.

But, if you choose to version your Node/NPM-based projects on GitHub, you don't even have to remember to do that. GitHub provide a free bot (called dependabot) that can periodically audit your dependencies for you!

GitHub will offer to enable dependabot in all kinds of situations, but you can configure it in any repository's settings area via the *Code security and analysis* settings pane under the *Security* category. You can [learn more about dependabot in GitHub's documentation](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/about-dependabot-version-updates).

## Final Thoughts

Every library you depend on is a part of your supply chain, and you need to think about its security.

What I hope you take away from this is that there are no easy answers, you simply have to think about this stuff carefully. Not reusing code is dangerous, and reusing the wrong code is also dangerous. You need to explicitly decide what to outsource and what to write yourself, and you need to choose the dependencies you do use with care. You can't be perfectly sure, because humans are involved at every stage of the process, and you will make mistakes. That's OK, just remember to learn from them!

Most of my advice and suggestions were entirely generic, so when we move on to PHP we'll be using the same mindset when installing open source libraries from [Packagist](https://packagist.org) instead of NPM. The tool will change, but the core concepts won't.

 - [← Tidbit 2 — It's OK to Play a Different Game!](tidbit2)
 - [Index](index)
 - [Tidbit 4 — Rethinking a Web App – from Web Server to Cloud Stack →](tidbit4)
