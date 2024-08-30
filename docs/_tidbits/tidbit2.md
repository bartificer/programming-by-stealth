---
title: It's OK to Play a Different Game!
instalment: 2
creators: [bart, allison]
tags: [programming, fun]
date: 2022-02-07
opengraph:
  audio: https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2022_02_06.mp3
---
Some recent activity in the PBS community inspired some terminal hackery, and triggered an important old memory. I want to share the memory, share some terminal hackery, and hopefully inspire you to do a little programming for pure fun too.

Allison recently recorded [a segment on using the `egrep` command to play the hip word-game *du-jour*, Wordle](https://www.podfeet.com/blog/2022/01/wordle-ttt-17/). Great minds clearly think alike, because the first thing I thought of when someone described the game to me was regular expressions and searching with `grep` and `egrep`! Allison's post sparked some fun activity in the NosillaCast Slack as others got their nerd on too to expand on Allison's technique. That was fun and cool, but what triggered this tidbit is a less positive word that kept intruding into the conversation — *cheat*. People seemed to feel the need to be defensive, to apologise for their nerd fun, and that made me a little sad.

The point of this tidbit is to argue that it's not just OK, but it's great to play a different game. If you're into word games, play Wordle, but if you're into computers, there's another game you play — exploring Wordle as a computational problem! 

**Unless you're deceiving people, it's not just OK to play a different game, it's fun, and you'll probably learn something too!**

## Matching Podcast Episode

Listen along to this instalment on [episode 714 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2022/02/ccatp-714/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2022_02_06.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2022_02_06.mp3" >Download the MP3</a>

## Instalment Resources

* The instalment ZIP file — [tidbit2.zip](https://github.com/bartificer/programming-by-stealth/raw/master/instalmentZips/tidbit2.zip).

## 8 Queens

I want to start by taking you down memory lane, to the autumn of 1997, some time around Halloween. Back then I was a naive but excited first year science student in what's now [Maynooth University](https://www.maynoothuniversity.ie/), and I was taking Computer Science by default. The norm in Ireland back then was to take general science degrees and specialise after graduation with a masters degree or a doctorate. Maynooth was no exception, and I was happy to have gotten a place in *MH201 – General Science*.

I chose Maynooth because I wanted to be an Astronomer, and the Astronomer I most admired, [Prof. Susan McKenna-Lawlor](https://en.wikipedia.org/wiki/Susan_McKenna-Lawlor), was there. The way the general science degree worked is that first years had to take four subjects, maths, and any three from Experimental Physics, Mathematical Physics, Biology, Chemistry, or Computer Science. Clearly, to become an astronomer I needed all the physics I could get, so I was always going to do maths and the two physicses, but what about my fourth subject? At the time I found biology too boring and chemistry too intimidating, so I literally chose Computer Science because it seemed the least annoying fourth subject, and maybe we'd get to do something with games or something.

In September 1997 I thought computers existed for one reason, and one reason only, to run games! By Christmas I was pompously telling anyone who'd listen that I wasn't interested in computer games anymore 'because computers *are* the game'! Today, I'm an IT professional, I write open source code for fun, and I podcast about computers just about every week. What changed?

I took *CS101 – Principles of Computer Programming*! At the time the course was taught by the man who would both instil my deep love of programming, and introduce me to the Mac — [Dr. John Keating](https://www.maynoothuniversity.ie/people/john-keating). Maynooth's CS101 as it was then is one of the biggest inspirations behind this Programming by Stealth series — CS101 taught us Java, but that was incidental to the real purpose of the course, to teach us the fundamental concepts of programming in general, so we could transition other languages as and when we wanted or needed to.

By around the middle of the first term we'd made it as far as arrays, and even as far as multi-dimensional arrays. To finish out the topic John (Dr. Keating asks students to call him by his name rather than his title) set us a two-week assignment, and it wasn't at all what I was expecting. At first glance, it didn't even seem to be about arrays! The challenge was to find a solution to *the 8 Queens Problem*. If you don't mind spoilers, you can read all about it on Wikipedia, but let me explain.

The problem to be solved is very simple — find a way of placing 8 queens on a chess board so none of them can take each other. I.e., arrange 8 pieces on an 8x8 grid where no two pieces share a row, column, or diagonal.

This is the first programming challenge that utterly hooked me. Encouraged by the offer of a 110% grade for an *exceptional* solution I dived in and spent literally hours at night in the computer labs honing my code. I didn't just want to find one solution, I wanted to find them all! I didn't just want to figure out how many there were, but the most efficient way to find them.

There's no mention of arrays or loops in the assignment, but both are obviously needed to arrive at a solution. The chess board can be represented as an 8x8 2D array of booleans, where `true` means there is a queen on that square, and `false` means there isn't. Checking if the current arrangement is a valid solution is a function that takes an array as an argument and uses loops to count the `true`s on each row, column, and diagonal, and return a boolean depending on whether or not any row, column, or diagonal had more than 1 `true`. Iterating over the search space was just a simple loop that moved the furthest right queen forward by one square, wrapped if she went off the top, and when ever there was a wrapping, moving the queen in the previous column by 1 too, also wrapping if needed, and also moving the queen in the previous column to that by 1 etc..

It didn't take me that long to get a naive first solution working, and to find a valid arrangement. That was 100% in the bag, because John's marking scheme was supremely simple — if it compiles and does what it's supposed to, you get full marks, no matter how you did it. I was John who taught me the mantra I love to repeat — *"there are infinitely many correct solutions to any programming problem"*.

But I didn't stop there, remember, there were ten more percent up for grabs! Could I get my program to find print all the solutions — easy, rather than stopping the process when a solution is found, just keep going until every possible arrangement has been checked.

OK, now I know how many there are, can I get my program to arrive at an answer more quickly? Clearly, starting with all the queens along the bottom row is inefficient because until all of them but one are off that row there can't possibly be a solution, so maybe it's quicker to start with the queens on the primary diagonal? Yes, but not by much. Maybe it's quicker to use a loop to randomly place the queens, check for a solution, and repeat until one is found? Nope! Maybe a hybrid solution is best — start by randomly placing the queens, then iterate from there? I'm not sure I ever proved that was actually better, but it's what I settled on in the end, because I liked that it gave me different solutions, and that it felt faster than any simple starting arrangement I tried.

I had a look in my archive folder, but sadly I don't have a copy of my code, I'm sure 42 year old me would find a lot to critique in it, but, I got my 110%, and more importantly, I learned that it's fun to use computers to explore games, that there are games around traditional games.

I'm rubbish at chess, I don't enjoy it, but I had so much fun exploring ways of getting a computer to solve a puzzle based on it! Chess is the original game, the 8 Queens problem itself is a derived game, and John's programming assignment was a game derived from a game derived from a game!

Bottom line, **I wasn't cheating at the 8 Queens problem, I was playing a different game!**

## Wordle on Terminal (*Turdle*? ... err no ... *Terminurdle*?)

So enter [Wordle](https://www.powerlanguage.co.uk/wordle/)!

In case you're not familiar with the game — each day there's a 5-letter word to try find in six guesses. To guess you type a 5-letter word into a grid, and when you submit it, your 5 letters change colour — if any letter goes grey then it's not in the word anywhere, if any letter goes yellow then it is in the word somewhere, but not at that position, and if it goes green it's in the word at that position.

In her terminal experimentations Allison used the dictionary file present in POSIX operating systems like the Mac and Linux, but I went a different route, I knew Wordle was a JavaScript game, so I used my browser's developer tools to search the code for the word list and found it as an array. (For a fantastic description of how Wordle works, check out [this great blog post](https://reichel.dev/blog/reverse-engineering-wordle.html#looking-for-network-requests)).

I used the array from the JavaScript code to create a text file named `wordleWords.txt` that lists the words one-per-line. This means all the terminal commands designed to operate on lines of text can now be used to operator on single words. I've added the file to this instalment's ZIP file. 

OK, armed with my word list, I opened a terminal and got stuck in!

The first hurdle was picking a random word — I didn't want to guess the same word every time, so I set about finding a way to randomly pick a single word from my list. The solution I settled on combined two commands; `sort --random-sort` to jumble up my list, and `head -1` to extract just the fist line:

```sh
cat wordleWords.txt | sort --random-sort | head -1
```

On February 6 2022 that gave me a first guess of `thyme` which sadly gave me all grey squares 🙁

While this is not the funnest information, it is information, so we can use it to narrow down the list of possible answers. Like Allison, I used the `egrep` command to perform pattern-matching using the PCRE regular expression syntax.

So, how do we use a regular expression to find words that **don't** contain any of the letters in `thyme`? Normally, `egrep` filters text down to just the lines that `**do** contain a given pattern, but we want the opposite. That's where the `-v` (for *inVert*) flag comes in. Using this flag makes grep return the lines that *don't* contain the given pattern instead of those that do.

What pattern do we want to give? We want to exclude words that contain *any* of our known-bad guesses, and the easiest way to do that is with a PCRE *character class*. 

Putting those two things together, inserting `egrep '[thyme]'` into our chain of commands will filter the words file down to only the lines that don't contain any of the characters in `thyme`. By adding that into my chain I used the following to choose my second guess:

```sh
cat wordleWords.txt | egrep -v '[thyme]' | sort --random-sort | head -1
```

That gave me `ovoid`.

That got me four more greys, `ovo` & `d`, and one yellow, `i` at position 4. Adding the grey letters to the existing character class for exclusions is easy: `egrep '[thymeovd]'`, but what about the yellow? 

The yellow `i` at position 4 gives us two new pieces of information:

1. There is an `i`  somewhere in the word.
2. What ever is at position 4, it's not an `i`!

Dealing with the first piece of new information is easy — as well as a list of letters to omit, we need to start a new list of letters to include. As long as there's just one letter we don't even need the extra power of PCRE, so we can literally just `grep 'i'`, but if we get another yellow character in a later guess, our command would be easier to update if we used a character class, so `egrep '[i]'` probably makes more sense.

Now, how do we deal with the second piece of information, that what ever is at position 4, it's not an `i`? This provides an opportunity to use *inverted character classes*. By starting a character class with the hat AKA caret symbol (`^`), the meaning flips, and the class becomes *'any character except these'*. In PCRE the symbol `.` means *'any single character'*, so by including `egrep '...[^i].'` we've captured the fact that the `i` can't be at position 4. 

Adding these two commands into my chain gave me the following command for generating my third guess:

```sh
cat wordleWords.txt | egrep -v '[thymeovd]' | egrep '[i]' | egrep '...[^i].' | sort --random-sort | head -1
```

That game me `incur`.

The result — the `i` turned yellow again, so not only is it not in the 4th position, it's also not in the first. All the other letters turned grey, so the word doesn't contain any of `ncur` either. Updating our command chain to include this new information I got the following to generate my fourth guess:

```sh
cat wordleWords.txt | egrep -v '[thymeovdncur]' | egrep '[i]' | egrep '[^i]..[^i].' | sort --random-sort | head -1
```

That gave me `skiff`, which proved a very fruitful guess, the first three letters went green, and the two `f`s grey. We now know the first three letters, so we can update our pattern to incorporate that: `egrep 'ski[^i].'`. We also know the final word doesn't contain an `f`, so we can update our exclude list to `egrep -v '[thymeovdncurf]'`. This gives the following command to generate my fifth guess:

```sh
cat wordleWords.txt | egrep -v '[thymeovdncurf]' | grep 'i' | egrep 'ski[^i].' | sort --random-sort | head -1
```

This gives `skill`, which is the correct answer 🎉 😀

## Taking Things to the Next Level?

If I've inspired you to have a play yourself, here are some fun things to consider.

Firstly, why not try solve the 8 Queens problem yourself in your favourite language?

When you do, something interesting to note is that with 8 queens on a 8x8 board we are near the edge of what is and isn't reasonably computable. There are 64 squares on the board (8 times 8), so there are 64 possible places for the first piece, then 63 for the second, 62 for the third, and so on. That gives 178,462,987,637,760, or about 1.8x10^14 board positions to test! Adding just one more row, column, and queen doesn't just add a few more combinations, it adds a **lot** more — there are now 81 possible first positions, then 80, then 79, and so on, and you need to go on for one extra piece too, so that gives approximately 94,670,977,330,000,000, or 9.5x10^16. By the time you get to a 20x20 board with 20 queens no super computer on the planet can help you!

Why not start experimenting with the size, and see how far you get before the wait for solutions becomes intolerable?

When it comes to Wordle, the most obvious short-coming of my naive terminal-only approach is the choice of initial words. For the first few picks every word with multiple occurrences of the same letter is wasteful, but near the end all words are possible answers, so for at least the first guess you should exclude all words with doubles, and then at some point later you need to let them into the mix. When? Also, there are a lot of words without duplicated letters, which ones are most likely to give you some yellows or greens in your first guess? To figure that you you'd need to do some letter frequency analysis on the word list and then rank the words by how common their letters are. You should then pick your first word from the top handful on that ranked list.

If you re-created the game and fully automated it, you could design different algorithm and race them against each other, fine-tuning to get the perfect Wordle player!

The scope for nerdy fun is endless!

## Final Thoughts

I really hope I've convinced you that not only is it OK to use your nerd skills to play games, it's actually great fun, and you'll learn something too.

Remember, **as long as you're being honest about what you're doing, you're not cheating, you're just playing a different game!**