---
title: PowerShell Tames Monty
instalment: 13
creators: [bart, Allison]
date: 2025-06-19
---

Way back in 2015 when myself and Allison started this series I made a point of evangelising the power of coding skills — when you can program, you can turn your ideas, big and small, into reality. Sometimes that results in substantial projects that take up years of your life, like XKPasswd, and sometimes that results in a simple little script written on a rainy morning simply for the pleasure of finding things out (to borrow a phrase from the great Richard Feynman). 

It's impossible to count the ways coding skills can empower, but one of them is the ability to quickly and easily experiment with things to help you really understand them. That's the root cause of this little tidbit — I was reminded of a problem I knew I only half understood just as I was starting some annual leave, so I decided to do something about it. That something was a little PowerShell script to simulate the problem.

This tidbit serves three purposes really: it illustrates how the ability to program empowers, it demonstrates the value of experimenting, and it serves as a little reminder that PowerShell remains next on our agenda after we finish the Jekyll series.

You may have noticed I titled this tidbit *'PowerShell Tames Monty'*, so what's with that odd title? And what does this little script actually do?

Well, it all started with a passing comment on a discussion I was listening to on some podcast (can't remember which and it's not important) on the dangers of AI. As an example of how humans are easy to manipulate because we're predictably illogical, the guest threw out three little words that set me off. She cited the infamous [Monty Hall Problem](https://en.wikipedia.org/wiki/Monty_Hall_problem) 😀

## Matching Podcast Episodes

TO DO

## The Monty Hall Problem

Back in the 1970s, Monty Hall was the legendary host of a US TV game show named *[Let's Make a Deal](https://en.wikipedia.org/wiki/Let%27s_Make_a_Deal)* (which I was surprised to discover is still on the air!). The show involves audience members having to choose to trade something they can see for something they can't. Some of the prizes are fantastic, and some are hilariously useless duds. As best as I can tell, the exact scenario that now bears the former host's name never actually appeared on the show! It seems it was simply inspired by it.

Anyway, in 1975, a reader sent a letter (closest the 70s got to social media 😉) to *The American Statistician* magazine with the challenge we now know as *the Monty Hall Problem*:

> Suppose you're on a game show, and you're given the choice of three doors: Behind one door is a car; behind the others, goats. You pick a door, say No. 1, and the host, who knows what's behind the doors, opens another door, say No. 3, which has a goat. He then says to you, "Do you want to pick door No. 2?" Is it to your advantage to switch your choice?

So, you have three doors, one with a shiny new car, and two with dummy prizes. You pick a door, the host opens one of the wrong doors, and you get to choose to stick with your original choice or to switch to the other closed door. Statistically, which choice gives you the best odds of winning the car?

Most people, me included, initially assume it's a toss-up — there's a one-in-three chance the car is behind each door, so there's no difference between them … right? … **WRONG!**

Switching actually **doubles** your chance of winning to two-in-three — huh‽🤯

Before I started my experiments, I half-understood what was going on, but each time I'd try to explain it, I'd be forced to revert to the kind of hand-waving that made it clear to both me and the person I was trying to explain it to that I didn't fully understand what was going on. I'd gotten as far as understanding one of two important insights, but only one, it was the act of writing the script that opened my eyes to the second insight.

OK, so what did I understand before I started to code?

I knew that when you have unconnected events like coin flips and dice rolls, the flips and rolls that come before have no effect on the probabilities of the next flip. Whether you rolled no sixes in your ten previous rolls or six sixes makes no difference; you still have a one-in-six chance of rolling a six next time!

I also knew that the Monty Hall Problem is not like that because the events **are** connected. The key is this little phrase within the original puzzle:  _"and the host, **who knows what's behind the doors**, opens another door"_.

So, the first door you guess absolutely has a one-in-three chance of being the correct one, but once Monty opens one of the two mystery doors, he adds information to the system. This means things have changed for your second decision. There are now two doors in play, not three, so if you make a new random choice, your odds just went to 50/50. If you played 60 games you'd be right 30 times rather than just 20!

That much I understood — if you randomly guess again, you get a one-in-two chance of a car. Great, but the expert on the podcast said something even more impressive. They said that when you do the math, always switching doors gives you a two-in-three chance of winning a car. That would mean that you'd win 40 out of 60 games. That's insane! That was the bit that I still didn't get. Boosting my odds from one-in-three to one-in-two, great, but getting to better than that, how is that even possible?

## Code is More Expressive than English

I've been noodling the Monty Hall Problem for years, but I've been doing it in my head, with my internal monologue, in English. Describing something algorithmic in English is not very efficient. Famously, [asking kids to describe the steps to making a peanut butter sandwich](https://www.today.com/parents/parents/teacher-pbj-sandwich-rcna203417) and watching the results of following those instructions literally is hilarious, and very very messy 🙂

I wanted to express the game in code, so I had to be precise, and I had to think about **Monty's Options** at the second step. I had only ever thought about the game from **my point of view**, but to write the code, I had to break out of that very human tunnel vision and look at the big picture, and then it became so obvious I simply couldn't understand how I'd never seen it before.

My first choice is completely unconstrained; there are three doors, and I can pick any one of them. But when Monty has to open a door, his choices are actually surprisingly constrained — he can't open the door I've chosen, and he can't open the one with the car. So let's consider what that means for Monty when I guess right, and when I guess wrong.

When my first guess is correct, Monty can open either of the two doors I haven't picked because both have goats. Regardless of which one he chooses to open, I'll always lose if I switch, and win if I stick.

But what happens when my first guess is wrong? Monty can't choose the door I guessed, which has a goat, and he can't choose the door with the car, so he has no choice at all. There's only one door he can open, so the one he leaves closed **must** have the car. So, **if my first guess is wrong, I'm guaranteed to win the car if I switch!**

Since probabilities always add up to 1, if the chance my first guess is right is one in three (0.33), that means the chance my first guess is wrong is two in three (0.66 because 1-0.33 is 0.66), so **if I always choose to switch, I win two-thirds of the time!**

## Hmmm … I Guess … But Really?

OK, so before I even finished writing my script, let alone run it, I was already pretty sure I'd figured it out, but I still wanted to finish the script to be absolutely sure I really did actually understand it completely this time.

If I actually understood the solution, then I should be able to prove three things:

1. The strategy of never switching should be the worst, giving a success rate of one in three.
2. The strategy of randomly choosing to stick or switch should be a little better, giving a success rate of one in two (as explained above)
3. The strategy of always switching should give me the best results, successfully winning the car two out of three times

I actually had a quick and dirty result quite quickly, but I wasn't satisfied with that. I was really getting sucked into this problem now, so I decided to keep going. I refactored and extended my crude initial script to bring it into line with best practices. That way, I'd get to practice my PowerShell skills, and I'd have some fun content to talk to Allison about!

## PowerShell Meets Monty Hall

Before we look at the code, I want to stress again that this final script is not a *quick-and-dirty* hack; you don't need to do this much work to quickly test something in PowerShell! Your PowerShell absolutely doesn't need to be this intricate to work **once**, but if you want something maintainable that will do its job reliably for a long time, then this **is** a good example of why you should use PowerShell.

### Random Considerations

Before I wrote one character of PowerShell, I spent a little time thinking about getting some really high-quality random numbers for this exercise. Since this entire exercise is about testing probabilities, we really do need **actually random random numbers**, numbers that just look random but still have patterns in them would completely throw off our results!

I started by checking on the current state of [Random.Org's free web API](https://www.random.org/clients/http/).

The TL;DR is:

1. They still offer a free HTTP-based API that can generate random integers within a specified range
2. But that free API is rate-limited in two ways:
   1. You can get a maximum of 10,000 random integers per query
   2. If your IP address makes *'too many'* queries, you'll get block-listed, so play nice!

OK, so that's what the API can provide, what do I actually need?

Well, to run a single simulation, I need to make four random choices:

1. Monty chooses a door to hide the car behind (integer between 1 & 3 inclusive)
2. I choose one of three doors as my initial guess (integer between 1 & 3 inclusive)
3. Monty chooses a wrong door to open, and he sometimes has to pick between two possible doors (integer between 1 & 2 inclusive)
4. For the random strategy, I need to make a boolean choice to stick or switch (integer between 1 & 2 inclusive)

So, I need two random numbers between 1 and 3, and two between 1 and 2 for each simulation.

I chose to make two calls to the API per run of the script:

1. Ask for 10,000 random integers between 1 & 3 (`https://www.random.org/integers/?num=10000&min=1&max=3&col=1&base=10&format=plain&rnd=new`)
2. Ask for 10,000 random integers between 1 and 2 (`https://www.random.org/integers/?num=10000&min=1&max=2&col=1&base=10&format=plain&rnd=new`)

Breaking the query strings in the URLs down, the parameters are:

* `num` is the number of random integers being requested
* `min` is the lowest allowed random value
* `max` is the highest allowed random value
* `col` is the number of columns to organise the output into (`1` means one number per line)
* `base` is the numbering system to use (base 10 as opposed to binary or hexadecimal in this case)
* `format` can be either `html` to see the results on a web page, or `plain` to get the random numbers as plain text.
* `rnd=new` is what the docs say to use when you want truly random numbers (there are other options for the rare situations you want something more complex, like a deterministic random sequence or intentionally pseudo-random numbers)

All in all, this gives us a nice balance between quality and quantity. The script can run up to 5,000 high-quality simulations per execution.

RANDOM.ORG offers *true* random numbers to anyone on the Internet. The randomness comes from atmospheric noise, which for many purposes is better than the pseudo-random number algorithms typically used in computer programs.

### Running the Script

Before we look at the code, let's run it!

You'll find the script in the instalment ZIP as `Invoke-MontyHallSimulation.ps1` (notice that it complies with PowerShell's recommended verb-noun naming convention).

> Note that I didn't take the time to test this script on older versions of PowerShell, so to prevent issues, I marked it as requiring the current stable release, PowerShell `7.5.*,` with the following `requires` directive:
>
> ```powershell
> #Requires -version 7.5
> ```
>
> If you try to run the script on older versions of PowerShell, it won't run, but assuming you installed PowerShell in the usual way (as described in TidBit 11), you should be able to upgrade with a simple `brew upgrade powershell/tap/powershell` on the Mac or `winget upgrade --id Microsoft.PowerShell` on Windows (Linux users will need to use the appropriate package manager for their distro).
{: .warning}

Open a PowerShell terminal by entering the command `pwsh` and change into the folder where you saved the script.

Because I took the time to implement expressive parameter definitions and to write help comments (PowerShell's equivalent of [JSDoc](https://pbs.bartificer.net/pbs130)) you can quickly see the script's required and supported parameters with the command:

``` powershell
Get-Help ./Invoke-MontyHallSimulation.ps1
```

That shows a lot more than we need to get started with the script, so just focus on the last part of the *SYNTAX* section which shows the following usage summary:

```text
…Invoke-MontyHallSimulation.ps1 [[-Count] <int>] [-Quiet] [-Silent] [<CommonParameters>]
```

For now, simply notice that all the parameters are in square braces, marking them all as **optional**. So, we can simply run our script in its default mode with the command:

```powershell
& ./Invoke-MontyHallSimulation.ps1
```

This produces a **lot** of output because it runs the game a thousand times, printing the details of each game to the informational output stream as it goes, and when all the simulations are run it prints out a summary of the aggregated results to the informational output stream too before finally outputting a dictionary with those same aggregate results to the data output stream.

**BART: above paragraph might need more explanation. You may have told us what an "informational output stream" vs. "data output stream" is, but if you did it was 7 months ago. Or maybe it's just too many words that sound the same to me?** 

Note that I chose to emit the information both to the human-facing informational output stream and to the data output stream so the script can be pipelined. For example, we can convert the dictionary with the results to JSON and write that to a file with the command:

```powershell
& ./Invoke-MontyHallSimulation.ps1 | ConvertTo-Json | Out-File -FilePath "results.json" -Encoding utf8
```

This still shows us the informational output, but the dictionary written to the data stream now goes to a file named `results.json` in JSON format:

```json
{
  "RandomWins": 495,
  "RandomWinPercentage": 49.5,
  "SwitchWins": 646,
  "GamesPlayed": 1000,
  "StickWins": 354,
  "SwitchWinPercentage": 64.6,
  "StickWinPercentage": 35.4
}
```

(I chose to keep things simply and simply output the important data points as a flat dictionary, but you could make your data structure as complex as you like of course. Since the points of data outputs is to feed into other script not to be viewed by humans I didn't go to the extra effort of making it an ordered dictionary, but PowerShell does support those if you really want they keys to appear in a specific order.)

If we want to suppress the data stream to stop it cluttering our terminal, we can simply tell PowerShell to discard it by piping it to `Out-Null`.

Before we see that in action, let's take a moment to explore the optional parameters the script provides:

```powershell
Get-Help ./Invoke-MontyHallSimulation.ps1 -Parameter *
```

This shows all the details PowerShell knows about the parameters I defined, including both my human-friendly descriptions from the help comments and the metadata from the parameter definitions themselves:

```text
-Count <Int32>
    The number of times to run the simulation, defaults to 1,000 and is limited to 5,000.
    
    Required?                    false
    Position?                    1
    Default value                1000
    Accept pipeline input?       true (ByValue)
    Aliases                      
    Accept wildcard characters?  false
    

-Quiet [<SwitchParameter>]
    If specified, suppresses output describing each game to the console. Ignored if -Verbose is specified, and has no effect if -Silent is specified.
    
    Required?                    false
    Position?                    named
    Default value                False
    Accept pipeline input?       false
    Aliases                      
    Accept wildcard characters?  false
    

-Silent [<SwitchParameter>]
    If specified, suppresses all console output other than errors and warnings. Ignored if -Verbose is specified, and supercedes -Quiet.
    
    Required?                    false
    Position?                    named
    Default value                False
    Accept pipeline input?       false
    Aliases                      
    Accept wildcard characters?  false
```

For our final example, let's use the `-Quiet` option to suppress the output from each individual game, let's increase the number of games simulated to the maximum, and let's suppress the data stream:

```powershell
& ./Invoke-MontyHallSimulation.ps1 -Count 5000 -Quiet | Out-Null
```

Now we just see what really matters, the final results from simulating a lot of games:

```text
Final Results:
 - Games Played: 5,000
 - Stick Strategy: 1,674 Wins (33.48%)
 - Switch Strategy: 3,326 Wins (66.52%)
 - Random Strategy: 2,507 Wins (50.14%)
```

So, do my three assumptions hold up to testing?

**Yes**, always sticking does indeed give you a one-in-three chance, randomly sticking or switching does indeed increase that to a one-in-two chance, and always switching does indeed give you a stunning two-in-three chance of a car!

### Some Code Highlights

Including the detailed help comments has grown this little script to nearly 375 lines, so I won't duplicate it here. Simply open the script in your favourite text editor to have a look yourself.

Looking at the script at the highest level, I want to draw your attention to three things:

1. I used a `begin` block for my setup, did my work in a `process` block, and since there was no cleanup necessary, I omitted the `end` block.
2. I used `#region` directives to give related chunks of code meaningful names. These labels are used by PowerShell-aware IDEs like VSCode to help you navigate around the script. (Look for them in the collapsible *OUTLINE* section of the default left sidebar.)
3. I took the time to refactor duplicated chunks of code into functions, and I defined those functions within the `begin` block, and took the time to add help comments and expressive parameter definitions to each of those, as well as to the overall script.

I don't think there would be much value in going through each line of code in the script, but I do want to draw your attention to a few key features.

#### PowerShell Makes it Easy to Call Web APIs

The script fetches the random numbers it needs from Random.Org using their API, and this is the section of the code that handles that:

```powershell
try {
	$RandomNumbersRawString = Invoke-WebRequest -Uri $RandomDotOrgUri -Method Get | Select-Object -ExpandProperty Content
} catch {
	Write-Error "Failed to retrieve random numbers from Random.org with error: '$_'" -ErrorAction Stop
}
```

The commandlet that does the work is `Invoke-WebRequest`, and I just give it two parameters, the URL (`-Uri`), and the HTTP method (`-Method`). In most cases, you can omit the `-Method` and let `Invoke-WebRequest` decide which to use based on your other parameters, but since the Random.Org docs were very explicit that the API **only** supports `get` I decided to be explicit.

`Invoke-WebRequest` returns a dictionary with lots of potentially useful information about the HTTP request that was sent and the HTTP response that was received, but since I just wanted to get the returned numbers as a big, long string, I needed the value from just one specific key, `Content`. I could have saved the response to a variable and then accessed the content as `$variableName.Content`, but that's inefficient in terms of code readability and memory usage, so I filter the dictionary down to just the one key I want by piping it to `Select-Object`. If you're going to write good PowerShell, you absolutely need to make friends with `Select-Object` and its friend `Where-Object` (put a pin in that).

Finally, notice the call to `Invoke-WebRequest` is in a `try` block. This is because the commandlet will throw an error if it gets an HTTP response code of 400 or higher, in other words, if the HTTP request goes wrong with either a client-side problem (Error codes `4**`) or on the server side (Error codes `5**`).

#### PowerShell Encourages Filtering rather than Looping

When it comes time to figure out which doors Monty could open, a JavaScript programmer might loop over all the doors and check if each one is the guessed door or the correct door and store the ones that are neither in a new array. PowerShell doesn't encourage that design pattern; instead, PowerShell encourages filtering whenever possible.

This is the line of code that builds the array of door numbers Monty can choose from:

```power
$RemainingDoors = 1..3 | Where-Object { $_ -ne $CarDoor -and $_ -ne $GuessDoor }
```

That probably looks confusing, so let's break it down.

We're building a list that will be saved to a variable named `$RemainingDoors`, so the line starts with that variable name followed by the assignment operator. So far, so utterly normal, but now let's look at how the list that will be saved gets created by moving our attention to the other side of the assignment operator. 

The first thing that happens is that the range operator (`..`) is used to create a list of all the integers from `1` to `3` (inclusive). In other words, we start with a list of all possible doors. That list is then piped to the `Where-Object` commandlet. This commandlet filters lists. It takes a list as input, applies some kind of test to each item in that list, and returns a new list containing only the items that pass the test. In this case, we're using a code block as our test, and the special variable `$_` represents *the value being tested*. So in this case, `$_` will have the value `1`, then `2`, and finally `3`, and only the values that are neither equal to the door we picked nor the door that has the car will pass the test.

If this approach is vaguely ringing some bells, it's likely because the `jq` language works similarly.

When you come to PowerShell after many years of programming in C-style languages like C, C++, Java, JavaScript, or PHP, this takes some getting used to, but stick with it, once you get used to thinking in terms of filtering rather than looping you'll find it's extremely powerful and results in simpler and clearer code.

## Final Thoughts

This little script is a perfect example of why I really value my coding skills. My current job doesn't require much traditional coding, so these kinds of little side projects are more important than ever, but honestly, that's not why I chose to spend the first day of my hard-earned annual leave writing a script to simulate an imaginary TV gameshow — **I did it because it was fun 😀**.

I knew I _nearly_ understood the Monty Hall problem, and I knew it would be fun to experiment with it. To code it up, set it off, and then watch it in action. I knew scripting it up would force me to deepen my understanding of it, and I was fairly sure I'd finally figure it out for once and for all in the process. I was right, and so was Richard Feynman — there is real pleasure in finding things out!

Finally, I hope this little tidbit helped to re-whet your appetite for our upcoming PowerShell series!
