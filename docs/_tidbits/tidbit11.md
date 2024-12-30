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

## Version & Tooling

Like Apple's young language Swift, PowerShell has evolved a lot from its initial release to the current product release. Fot a good experience, be sure you're using the latest Long Term Support (LTS) version (as of January 2025 that's `7.4.*`). 

There's a [section in the docs describing all the different ways to install PowerShell on all the different platforms](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.4), but on the Mac by far the simplest method is HomeBrew:

```
brew install powershell/tap/powershell-lts
```

Once you have PowerShell installed you can start a shell with the command `pwsh`. 

If you're going to use the Terminal app for running PowerShell commands you can create a new profile for quick access, these are the settings I use:

TO DO — screenshot

On Windows I'd recommend installing Microsoft's modern [Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701?hl=en-us&gl=US) app for a nicer CLI than the default one that ships with the Windows version of PowerShell 7.

But rather than using any Terminal, I'd recommend using a good IDE. In fact, I recommend using a specific IDE — [VS Code](https://code.visualstudio.com/) with [Microsoft's official PowerShell plugin](https://github.com/PowerShell/vscode-powershell).

To help your IDE, and perhaps your AI helper, I suggest adding a `Requires` comment to the very top of your scripts, so in January 2025 I am adding:

```
#Requires 7.4
```

## Big-Picture Overview

### Separating the Pipeline and Human Streams

In a traditional Unix shell like Bash there are all streams send strings, and the pipeline redirects what would go to the screen by default to become the input to the next command. The output that would normally go the human now goes to the next command. 

PowerShell separates the pipeline from regular output. At the CLI this means you still see the human-directed output for all the commands in a pipelined chain. When you start writing scripts it means you use different commands for writing output intended for humans, and output intended for the pipeline.

As well as giving better visibility of what is happening when you chain commands together, this separation enabled PowerShell's best superpower (in my opinion anyway) — the pipeline doesn't move just text characters between commands, it moves objects!

To send anything to the pipeline from your own scripts — be it a number, string, array, dictionary, class instance, what ever — use the `Write-Output` command.

The output intended for humans is still strings of course, but it too has been modernised, broken into four 'levels':

1. **Verbose** output, usually only relevant when debugging, and hidden by default. In your scripts you write to this stream with the `Write-Verbose` command. 
2. **Informational** output, i.e. normal output when nothing goes wrong. In your own scripts you write this kind of output with `Write-Host`.
3. **Warnings**, something's gone wrong, but was at least partially recoverable. You can output your own with `Write-Warning`. 
4. **Errors**, something's failed. You can output your own errors with `Write-Error`.
