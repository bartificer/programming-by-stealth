---
title: A PowerShell Teaser
instalment: 10
creators: [bart, allison]
---

Somewhat ironically, since finishing the long series on Bash scripting I've been almost exclusively writing scripts in a completely different language, PowerShell! Being a Microft language you'd be forgiven for assuming that means that I've moved to Windows and started trying to automate things there, but you'd be mistaken, I'm still very much a Mac user! So what gives? Despite what it's origins may suggest, the core PowerShell environment is both open source and cross platform, running just fine on the Mac and Linux as well as Windows. You can follow the project on [GitHub](https://github.com/PowerShell/PowerShell)!

Think of this TidBit as being like a movie trailer — it's intended to pique your interest, and to give you a broad sense of why you might want to spend some time making friends with PowerShell, but it's by no means a detailed tutorial. As well as being a teaser trailer this instalment is also intended as a kind of community survey, if there's sufficient community interest, we could spend the second part of 2025 learning PowerShell like we learned Bash. I don't only want to hear from people who would like us to do that, I'd also like to hear from those in the community who think it would be a waste of time and effort — have your say on the PBS channel in [the Podfeet Slack](https://podfeet.com/slack).

## Matching Podcast Episode

TO DO

## What Drew me to PowerShell?

like with most things Microsoft, my first indroduction to PowerShell was involuntary, and I dipped my toe in reluctantly. But within just a few hours I started to get the sense that there was a lot of "there" there. This wasn't some kind of half-baked slap-dash replacement for DOS batch files, but a full-featured and very modern re-imagining of what a shell could be. Microsoft started with a completely blank slate, took everything we all learned from the decades of advances in programming languages and concepts since C and the original Unix shell were created in the 70s, and built a thoroughly modern object-first cross platform open source command line and scripting environment.

"Imagine what the Unix guys would have done if they knew then what we know now" really is good way to describe PowerShell IMO. PowerShell takes the fundamental sh/Bash/zag idea of creating lots of simple single-purpose commands and chaining them together to do powerful things, and combines it with a Java-like cross-platform runtime environment and some c/java/php syntax conventions.