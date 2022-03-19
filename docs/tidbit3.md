# PBS Tibit 3 of Y — Managing the NPM (or Packagist) Trade-off

This tidbit was inspired by a relatively recent news story about two very popular NPM packages, but it serves as an illustration of a much bigger point — you need to pro-actively manage your code's dependencies.  It's pretty obvious that each time you include someone else's code in your project you're taking on some risk, but what's less obvious is that you often also take on risk by choosing **not** to use other people's code!

Like so much in software development, there is no simple set of rule to follow to stay safe — you simply must take the time to make considered judgment calls, and accept that you'll get it wrong from time to time. The worst thing you can do is ignore the problem, and the good news is that experience helps, so you can learn from your mistakes.

But let me be very clear up-front — **if you're looking for an algorithm to un-thinkingly follow, I can't help you with that**, because none exists!

While this tidbit was inspired by a specific news story, that's not where I want to start our journey. We will get there, but not straight away.

## Matching Podcast Episode

TO DO

## Why Use Other People's Code?

If using other people's code is risky, why do it at all?

The most obvious answer is to save resources. If you're in a cynical mood you can call it laziness, and if you're in a more thoughtful mood, efficiency. But I would argue it's even more than that — it makes it possible to solve real-world problems. If you never use anyone else's code you could only ever solve trivial problems with your code.

But there is an even better reason to use other people's code — you can't be an expert at everything, so if you always roll your own, you will make naive and catastrophic mistakes. Probably the single best way to ensure your code is a security nightmare is to write your own crypto code!

By choosing to always write you own code you're making you code inevitably insecure, so in an attempt to improve your security by removing an obvious source of risk, you're adding a much more dangerous new source of risk — your own inability to know what it is you don't know!

It's probably obvious that writing your own encryption or hashing code is a terrible idea, but the problem is actually much bigger than that, there are lots of risky things your code inevitably has to do — just off the top of my head I can think of four big ones straight away; sanitise user input, interact with the file system, interact with other processes, and communicate across a network.

So, in summary, I'd argue these are the main reason I advise using open source libraries in your code:

1. **Security** — you don't know what you don't know!
2. **Capability** — you can't have expertise in everything, if you want to be able to solve real problems, you need to out-source to those who have the expertise you don't.
3. **Efficiency** — even when you can reinvent the wheel, it inevitably costs time and energy, that's time an energy you could be spending solving problems that haven't already been solved!

## What Could Possibly Go Wrong?

Great, so using other people's code is good, so I should do it as much as I possibly can, right? The more I use, the better off I'll be? Nope 🙁

Open source libraries are not magic, they're just other people's code, and other people are, well, people — they're just as flawed as you are!

Let's start simple — anyone can publish some code on GitHub, give it a fancy name, label it with a few choice keywords, slap an open source license on it, and start spreading the word on social media. Just because someone else wrote it doesn't mean it's better than what you'd cobble together in an afternoon!

The [Dunning-Kruger effect](https://en.wikipedia.org/wiki/Dunning–Kruger_effect) makes it inevitable that people with an over-estimated opinion of their skills will release dangerously naive code. None of us have the monopoly on human short-comings!

Imagine we have a superpower, the ability to make **correct** snap judgements on the competence and skills of others. This would mean we could avoid every open source library published by the inept, and guarantee that we only ever imported well-written code by competent developers. Surely we'd be safe? Nope!

Firstly, even great developers are still human, they still make mistakes! So, all code has bugs, hence, every library you import has bugs.

And, secondly, the world is not a static place. Even if you could have perfect code that worked exactly as designed today, it could well become catastrophically insecure in a year. Protocols get updated, computers develop new capabilities, and the bad guys invent new attacks. Code, like a garden, needs to be tended. So, you don't just need the libraries you import to be correct today, you need them to be actively maintained so they stay that way!

Companies and people come and go, and priorities change. Code gets abandoned all the time. Code with one passionate maintainer is obviously the most vulnerable to this, but it can happen to any library. Sometimes it's temporary, and stale projects get revived, but sometimes they just fade away, and the code becomes ever more unsafe as time goes on.

So far we've been assuming well intentioned ignorance and benign neglect, but there is another human failing we can't ignore — malice!

There are people out there out to exploit others to make a buck. It sucks, but it's true.

A naive malicious person could simply release malicious code directly — create a new project, give it a nice description, and hope victims stumble across it. Sure, this happens, but it's not particularly effective because code that's malicious from day one doesn't come with a reputation, and reputations really matter.

If you search a package manager and you get back one result with 500K monthly downloads, a 10 year version history, and a hundred thousand pins/likes, and another result released last week with 50 downloads in total, and one contributor, which would you be most likely to hitch your proverbial wagon to?

To truly be effective, malicious people need to steal a good reputation. There are all sorts of techniques, but two are popular:

1. **Confusion** — give you package a name that's confusingly similar to a legitimate one with a well earned reputation. A very common approach is typo-squatting, but the problem is bigger than that. It can be intentional confusion by adding a post-fix like `JS` after a legitimate name, or it can be registering the name of a legitimate library on a platform they don't use.
2. **Hijacking** — if you can somehow take control of an existing project with a well-earned reputation you can abuse that. It could be something as simple as stealing a private key with commit access to Git repo!
3. **Buy-out** — sometimes developers get worn down, and bad guys simply offer them some money to take over their project. They have now purchased a reputation which they can exploit to deliver their malware.
4. **Sabotage** — sometimes legitimate projects go bad because some or all of the people involved decide they've simply had enough and just blow it up to cause as much misery as they can on the way out the proverbial door!

So, summing up, the main reason not use use other people's code are:

* **Inevitable Mistakes** — all developers are human, all humans make mistakes, so all code has bugs!
* **Over-confidence** — some developers simply don't realise how little they actually know!
* **Abandonment** — code that is not maintained becomes every more dangerous.
* **Malice**

## Damned if you Do, Damned if you Don't‽

LEFT OFF HERE!!!

### Strategies

- reputation
-  community
- flexibility
- tools!

## Getting Practical — Managing NPM Dependencies on JavaScript Code

TO DO

## Final Thoughts

TO DO