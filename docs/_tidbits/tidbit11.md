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

## The Big-Picture — PowerShell's Philosophy

PowerShell's philosophy is different to that of both Bash and JavaScript, and the route to a positive experience is to lean into that fact. To have a good JavaScript experience you need to think about the world in a JavaScripty way, to have a good experience in Bash you need to think about the world in a Bashy way, and to have a good experience you need to think about the work in a PowerShelly way.

As I type these notes I can already hear Allison getting impatient and wanting to see some commands, so to get that out of the way, let's do the traditional Hello-World in PowerShell:

```pwsh
Write-Host 'Hello World!'
```

With that done I now beg your forbearance while we spend some time exploring how PowerShell's philosophy before we end with a very quick syntax overview.

### It's Functions all the Way Down

When reading the docs I was initially very frustrated that I could find good docs on how the standard built-in commands work, and good docs on writing my own functions, but there didn't seem to be any docs on writing scripts, and I wanted to write scripts!

The reason for my confusion is that I'd skipped over the start of the documentation where the hand-wavy stuff lives and missed a fundamental concept — in PowerShell **scripts are just functions in their own file**!

It actually goes deeper than that, **commands are just fancy functions** that are available in the shell!

If we take our Hello World command we can turn it into a very basic function by simply wrapping it in a `function` definition:

```pwsh
function Write-HelloWorld {
    Write-Host 'Hello World!'
}
```

If you paste this into a PowerShell Terminal you can then use your function exactly like it was any other PowerShell command:

```pwsh
Write-HelloWorld
```

We can now convert our function to a script we can run any time by moving just the function's contents into a file with a `.ps1` ending, so let's created `Write-HelloWorld.ps1` and give it just the following contents:

```pwsh
Write-Host 'Hello World!'
```

We can now run our script using PowerShell's version of the Bash *dot command* which is `&` followed by a file path:

```pwsh
& Write-HelloWorld.ps1
```

### Re-invented 'Plumbing' — Data and Messages are Separated

PowerShell shares the Unix philosophy of building complex solutions by chaining together simple commands. It even shares the same operator for connecting the output from one command to the input of another — the perfectly named *pipe* (`|`)!

But this is where the similarities end. In Bash, the output that would normally go to the human is the output the pipe diverts to become the input to the next command, so there is no difference between messages to the user, and output data — it all goes into the same stream, so when you redirect that one stream, you redirect both. This means Unix/Linux terminal commands designed to output data only output data, they don't give the user any messages, because if they did, it would mess up the next command in the pipeline. PowerShell separates these two roles, dedicating the pipeline to just data, and providing four separate message output streams.

#### A Data-Only Pipeline

**Any PowerShell function can optionally accept data inputs from the pipeline**, hence any script can optionally accept data inputs from the pipeline, and so can any command (since it's functions all the way down).

Because the pipeline is purely for data, it's not limited to streams of characters, **the data can be of any type**, so deep down it is in fact all objects. Not only can the data be of any type, it can be chunked into separate pieces, so it's not one flow other than characters, but a sequence of individual items which each get processed one-by-one. While the Unix pipeline carries a constant flow of characters, making it very river-like, the PowerShell pipeline is much more **like a conveyor belt with individual pieces of data**.

**If a command supports the pipeline, then you can arbitrarily many pieces of data to it!**

To use the pipeline in your own functions you need to do the following:

1. If you want to accept data from the pipeline you need to define a named parameter for receiving the pieces of data
2. To processed data from the pipeline you need to use the optional `begin`, `process`, and `end` syntax for your function definition
3. You need to use the `Write-Output` command to send data to the pipeline.

As an illustration, let's define a function that doubles a number, first as a regular function, and then as a function that accepts numbers from the pipeline.

Here's our basic function:

```pwsh
function Get-DoubleValue {
    param(
        [double]$Number
    )
    return $Number * 2
}
```

After pasting that function into our shell we can call it with:

```pwsh
Get-DoubleValue -Number 5 
```

Which will output 10.

We can convert this to a pipeline function by mapping the `$Number` parameter to the pipeline, issuing a `process` block, and outputting the result to the pipeline:

```pwsh
function Get-DoubleValue {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [double]$Number
    )
    process {
        Write-Output ($Number * 2)
    }
}
```

We can completely ignore the function's new super-power and continue to use it as before:

```pswh
Get-DoubleValue -Number 5
```

But we can now pipe numbers to the command:

```pwsh
5 | Get-DoubleValue
```

In fact, we can pipe as many numbers as we'd like!

```pwsh
1,2,3,4,5,6,7,8,9,10 | Get-DoubleValue
```

You can see that what PowerShell does is repeat the `process {}` block once for each input in the pipeline, so pipeline functions are actually loops with some superpowers!

Speaking of those superpowers, while many functions that support the pipeline will act symmetrically, producing one output for each input, that's not a requirement, as well as a `process {}` block you can also use `begin {}` and `end {}` blocks to do  more powerful things. As their names imply the `begin {}` block will get executed once before the first pipeline input is processed, and the `end {}` block once after the last input is processed. This allows pipeline function to generate additional outputs, or collapse inputs to a single output.

As an example, let's make a function that sums numbers:

```pwsh
function Get-Sum {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [double]$Number
    )
    begin {
        $Total = 0
    }
    process {
        $Total += $Number
    }
    end {
        Write-Output $Total
    }
}
```

We can now sum numbers with commands like:

```pwsh
5,7 | Get-Sum
```

But, we can double and then sum by pipelining our two functions:

```pwsh
1,2,3 | Get-DoubleValue | Get-Sum
```

This gives 12, which is the right answer, but it's not showing us any more information that a typical Unix command would, so let's look at how PowerShell does message output.

#### Four Message Streams

In Bash we know that while the pipe only connects the standard output to the next command's input, there is actually one more standard stream, the standard error stream.

PowerShell expands on this idea by adding four distinct streams for outputting messages to the user, each for a different severity level:

1. **Verbose** output — usually only relevant when debugging, and hidden by default. In your scripts you write to this stream with the `Write-Verbose` command. 
2. **Informational** output — normal output when nothing goes wrong. In your own scripts you write this kind of output with `Write-Host`.
3. **Warnings** — something's gone wrong, but was at least partially recoverable. You can output your own warnings with `Write-Warning`. 
4. **Errors** — something's failed! You can output your own errors with `Write-Error`.

To see why have data and message separate is powerful, let's add some message output to our doubling function:

```pwsh
function Get-DoubleValue {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [double]$Number
    )
    process {
        $Answer = $Number * 2
        Write-Host "$Number doubled is $Answer"
        Write-Output $Answer
    }
}
```

Now, let's re-run our pipeline to double and then sum:

```pwsh
1,2,3 | Get-DoubleValue | Get-Sum
```

Notice that we see the messages telling us what one, two, and three doubled are, but adding those messages did not mess up the summing function's inputs, it still only saw 2, 4, & 6 as its inputs, so it still calculated 12!

#### What About Redirecting to Files?

So far we've only focused on one kind of 'plumbing' in Unix/Linux, piping, but what about stream redirection, i.e. the Bash redirection operators like `>` & `>>`, etc.? If you think about it, these operators are also double-jobbing, they are used for two distinct purposes:

1. To send data to files
2. To send outputs to logs

Again, PowerShell separates these tasks, providing separate dedicated tools for each purpose:

1. Data gets written to files with an appropriate output command, e.g. `Out-File`.
2. PowerShell provides a dedicated logging feature — [Transcripts](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.host/start-transcript?view=powershell-7.4)

### Putting Order on Arguments with Defined Parameters

Before we go any further we need other pause for a note on jargon — for all intents and purposes *arguments* and *parameters* are synonyms. So far in this series we've chosen to use *argument* because that's the jargon used in both the JavaScript and Bash communities and documentation. However, PowerShell's authors made the other choice, so in syntax, documentation, and the broader community, the word you'll see is *parameter*. For your own sanity, and for ease of searching online, I strongly recommend that when you think about PowerShell, you think about parameters rather than arguments.

Again, to understand what PowerShell does differently, let's remind ourselves of how arguments work in Bash — basically, it's the Wild West! The arguments just arrive as strings in a pseudo array, and it's up to the programmer to group them into some kind of logical structure. In theory, anything goes, but thankfully some conventions have emerged thanks to popular tools like  `getops`. But the bottom line remains, the best we can hope for as users is that the developers of the command we're thinking of using chose to be consistent, follow some kind of convention, and provided a good  `man` page!

PowerShell could not be more different — if you want your functions, and hence your scripts or commands, to support parameters, you need to define them explicitly!

We've already seen hints of this in our little example functions. The `param()` function is used to define parameters. At the very very least all parameters need to be given a variable name, but they should also be given a type so PowerShell can give you basic data validation automatically, and you can then start adding more validations and options as you desire. One of those options is to tag a parameter as being connected to the input pipeline.

Having these kinds of rigorous parameter definitions has some powerful advantages:

1. Automatic interactive prompts when required parameters are missing (e.g. running `Write-Error` with no arguments results in a prompt for a message).
2. IDEs can provide powerful tooks to help delveopers.
3. The standard `Get-Command` command can be used to see the parameters any command supports (e.g. `Get-Command Write-Error -ShowCommandInfo` shows the parameters the `Write-Error` command supports)

### Common Parameters

PowerShell's next superpower is a set of standard parameters that all the standard commands support!

There are lots of conventions on the Unix/Linux command line, but remember, it's the Wild West, so there are no rules! For example, a lot of Unix/Linux commands use `-v` to enable verbose mode, but many others use it to output their version number!

You get none of that chaos with PowerShell, instead, there is a documented list of standard parameters for all commands — they're [described in detail in the documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_commonparameters?view=powershell-7.4). 

Note that not all of the standard parameters are mandatory, some only make sense for certain types of command.

Some of my favourite standard parameters:

* `-Verbose` to enable verbose output
* `-WhatIf` to enable dry-run mode, only available on commands that perform changes or ddstructive actions.
* `-ErrorAction` to specify how the command should handle an error. I generally use this to force a critically important command to succeed or kill the entire script with `-ErrorAction Stop`.

What's even better is that you can add support for common parameters to your own functions with just a single line of code! And function your write that should support `-Verbose` and friends simply needs to include the line `[CmdletBinding()]` at the very top of the function/script!

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

Naming conventions genereally emerge as suggestions by language maintaineres, or they evolve naturally within the community. In theory the naming conventions in PowerShell are just suggestions, but I've never seen such clear recommendations so strongly suggested or zealously followed as those in PowerShell. By default, when a module is loaded each imported function or variable that does not follow the naming conventions triggers as warning! So, if someone shares code on GitHub that breaks the rules, every users who tries to use that code will be warned about the impropper names. That sets up a pretty good incentive for developers to follow the rules!

The fundamental rule is simple and powerful — in PowerShell, **commands and functions are strickly named using the `Verb-Noun` pattern**. Basically, what action the command takes on what thing.

There are no enforced rules for the nouns, just a strong recommendation to be clear and consisten, but there is literally [a list of approved verbs](https://learn.microsoft.com/en-us/powershell/scripting/developer/cmdlet/approved-verbs-for-windows-powershell-commands?view=powershell-7.4)! The list is more than just a list, it also contains descriptions of how specific verbs should be interpreted, and there are disambigucations for verbs that could be easily confised.

Because these rules are so strongly enforced, you can usually guess what the right command might be, e.g. you convert data to CSV format with `ConvertTo-Csv`, to XML with `ConvertTo-Xml`, and to JSON with `ConvertTo-Json`.

I strongly reocmmend you get into the habit, right from the start, of naming all your scripts and functions using the `Verb-Noun` convention.

## A VERY Basic Syntax Primer

TO DO

## Final Thoughts

TO DO
