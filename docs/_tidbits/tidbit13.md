---
title: PowerShell Meets Monty Hall
instalment: 13
creators: [bart, Allison]
date: 2025-06-19
---

Way back in 2015 when myself and Allison started this series I made a point of evangelising the power of coding skills — when you can program, you can turn your ideas, big and small, into reality. Sometimes that results in substantial projects that take up years of your life, like XKPasswd, and sometimes that results in a simple little script written on a rainy morning on a whim for no reason other than that it sounded like fun. This little tidbit is mostly an example of that, but it's also a little reminder that PowerShell remains next on our agenda after we finish the Jekyll series, and as a second teaser for that trailer.

So what's with the odd title? It all has to do with a US TV game show I have literally never watched, and a math problem that breaks most people's intuition so thoroughly it's famous around the world — yes, I wanted to test my understanding of the [Monty Hall Problem](https://en.wikipedia.org/wiki/Monty_Hall_problem) 😀

## Matching Podcast Episodes

TO DO

## The Monty Hall Problem

Back in the 1970s Monty Hall was the legendary host of a US TV game show named *[Let's Make a Deal](https://en.wikipedia.org/wiki/Let%27s_Make_a_Deal)*. The show involved audience members having to choose to trade something they could see for something they couldn't. I don't t think the infamous scenario named for the show's host ever actually appeared on the TV show itself, but in 1975 a reader sent a letter (yea, letters passed for social media back then 😉) to *The American Statistician* magazine with a challenge we now know as *the Monty Hall Problem*:

> Suppose you're on a game show, and you're given the choice of three doors: Behind one door is a car; behind the others, goats. You pick a door, say No. 1, and the host, who knows what's behind the doors, opens another door, say No. 3, which has a goat. He then says to you, "Do you want to pick door No. 2?" Is it to your advantage to switch your choice?

So, you have three doors, one with a new car, and two with dummy prizes, you pick a door, the host opens one of the wrong doors, and you get to choose to stick with your original choice, or to switch. Statistically, which choice gives you the best odds of winning the car?

Most people, me included, initially assume it's a toss-up, there was a one-in-three chance your first door was right, and a one-in-three chance the other door was right, so there's no difference — **WRONG!!!**

Switching actually **doubles** your chance of winning to two-in-three — huh‽‽‽🤯

The to understanding this is this little phrase in the original puzzle:  _"and the host, **who knows what's behind the doors**, opens another door"_. Your intuition that you had a 1-in-3 chance on your initial guess was perfectly correct, but unlike with two coin-flips that follow each other with are un-connected, the choice of the door to open is **not** un-connected, the host has added information into your understanding of the situation, which has changed the odds. The door that the host opens **never** contain the car, so the host did not have a 1-in-3 choice to make, in fact, if you guess right, the host has **zero** options, there is only one door you haven't already picked that has a goat behind it! Even if you initially picked wrong, there are only two doors you haven't picked, so the host is still not choosing from 1-in-3. That door you didn't pick the first time is now more likely to be the right answer than 1-in-3, so **you should switch**!

## Hmmm … I Guess … But Really?

Having listened to yet another mathematician refer to the Monty Hall Problem and how it shows we humans are predictably illogical in very specific ways, this problem was whirling around in my brain at the start of some annual leave as the rain was bucketing down outside and I had a barrel of fresh-brewed coffee and my laptop in front of me — why not just test this so I know, for sure, that the world behaves like I think it does. Let's throw together a script to play the game a few thousand times and count the successes for the three most obvious strategies:

1. Always stick to your original door
2. Always switch (a theory tells us we should)
3. Randomly stick or switch

A decade ago when I wanted to throw together a quick script I'd reach for Perl, five years ago, Node JS CLI JavaScript, but today, PowerShell!

So, with a little help from the GitHub and Office365 Copilot AI bots, I threw together a script before my coffee was empty — that's why coding is a superpower 🙂

I had a quick and dirty result very quickly, but then it struck me that if I carried on a little bit and tidied it up, refactored it a little to bring it in line with best practices, then I'd have some fun content to talk to Allison about, hence, this TidBit!

## PowerShell Meets Monty Hall

LEFT OFF HERE!!!
