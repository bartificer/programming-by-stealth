---
title: A PowerShell Teaser
instalment: 11
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

Like Apple's young language Swift, PowerShell has evolved a lot from its initial release to the current product release. For a good experience, be sure you're using the latest version, or at least the most recent Long Term Support (LTS) version. As of Jaunary 2025 that's version `7.4.*` or `7.2.*`.

There's a [section in the docs describing all the different ways to install PowerShell on all the different platforms](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.4), but on the Mac by far the simplest method is HomeBrew:

```
brew install powershell/tap/powershell
```

Once you have PowerShell installed you can start a shell with the command `pwsh`. 

If you're going to use the Terminal app for running PowerShell commands you can create a new profile for quick access. The improtant settings are under the *Shell* tab in the profile settings, specifically, the *Run command* needs to be set to the full path to `pwsh` (which you can get by running `which pwsh`) and to un-tick the *Run inside shell* checkbox. On windows PowerShell terminals were blue for many years to distinguish them from command prompts, so I like to create my Mac PowerShell Terminal profile by cloning the built-in *Ocean* profile and then edting the two settings on the *Shell* tab of my clone. These are the settings I use:

![A Screenshot showing Bart's PowerShell Terminal settings as described above](./assets/tidbits11/BartPowerShellTerminalSettings.png)

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

In a traditional shell stream redirection (`>`, `>>`, etc.)  is used for two distinct purposes:

1. To send data to files
2. To send outputs to logs

Again, PowerShell separates these tasks, providing dedicated tools for each:

1. Data gets written with an appropriate output command, e.g. `Out-File`, `Export-Csv`, etc..
2. A dedicated logging feature — [Transcripts](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.host/start-transcript?view=powershell-7.4)

### Common Parameters for All Commands

There are lot of pseudo-standards on the Unix/Linux command line that have organically evolved over the decades, but they're more like common practices than actual standards. PowerShell is different, all the built-in commands provide the same standard optional arguments, or to use the PowerShell jargon, Standard Parameters. Some of them exist for every command, some don't, only existing for commands where they make sense. Some of my favourite standard parameters:

* `-Verbose` to enable verbose output
* `-WhatIf` to enable dry-run mode, only available on commands that perform changes or ddstructive actions.
* `-ErrorAction` to specify how the command should handle an error. I generally use this to force a critically important command to succeed or kill the entire script with `-ErrorAction Stop`.

What's even better is that these common parameters actually exist below the command level, they actually exist at the function level, and commands are just functions with superpowers! Because they exist at the function level you can enable them on **your code** with just a single line (`[CmdletBinding()]`), so any functions you write can fit right in with the standard stuff! In fact, scripts are also just functions with superpowers, so your scrips can easily support the same standard parameters too!

### Built-in Mechanism for Defining Parameters

Speaking of parameters, on the Unix/Linux shell there is no way for a command to programatically publish the rules for the arguments they support. The best we can hope for is that the author chose to provide a `man` page for humans to read. This is also no single mechanism for adding support for options and flags, there are just some commonly used tools like `getops` that many commands happen to support.

Again, PowerShell does things differently. The language has a built-in mechanism for functions, and hence commands and scripts, to precicely define the arguments thet expect to receive. All the standard commands make use of this language feature, and it's very easy to use the mechanism yourself when writing your own scripts and functions.

Having a standard mechanism for defining parameters has two very powerful advantages:

1. Automatic interactive prompts when required parameters are missing (e.g. running `Write-Error` with no arguments results in a prompt for a message).
2. IDEs can provide powerful tooks to help delveopers.
3. The standard `Get-Command` command can be used to see the parameters any command supports (e.g. `Get-Command Get-Command -ShowCommandInfo` show the parameters the `Get-Command` command supports!)

### A Built-in Comment-based Documentation System

Speaking of IDEs, PowerShell also provides a standard mechanism for using speically formatted comments to document your code. Basically, an official equivalent to the 3rd-party ESDoc module we use to document our JavaScript code in the main PBS series. Because of the built-in parameter definitions, none of that information needs to be captured in the documentation comments, so the syntax can be much simpler than that used by ESDoc, e.g.



```pwsh
<#
.SYNOPSIS
    Repeat a message.

.DESCRIPTION
    Repeat a message a given number of times, defaulting to three.

.PARAMETER Message
    The message to repeat.
	
.PARAMETER Num
    The number of times to repeat the message.
	
.INPUTS
    None. 
	
.OUTPUTS
    None.
	
.EXAMPLE
    $Nag = Get-RepeatedMessage -Message 'Hello World!' -Num 5
#>
function Get-RepeatedMessage {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string]$Message,
        [ValidateRange("Positive")]
        [int]$Num = 3
    )
    $Answer = ''
    $Repeated = 0
    while ($Repeated -lt $Num) {
        $Answer += $Message
        $Repeated++
    }
    return $Answer
}
```



### Rigorous Naming Conventions

