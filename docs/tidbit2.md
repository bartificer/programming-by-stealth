# PBS Tibit 2 of Y — It's OK to Play a Different Game!

Some recent activity in the PBS community inspired some terminal hackery, and triggered an important old memory. I want to share the memory, share some terminal hackery, and hopefully inspire you to do a little programming for pure fun too.

Allison recently recorded a segment on using the `grep` command to play the hip game *du-jour* Wordle. Great minds clearly think alike, because the first thing I thought of when someone described the game to me was regular expressions and searching with `grep` and `egrep`! Allison's post sparked some fun activity in the NosillaCast Slack as others got their nerd on too to expand on Allison's technique. That was fun and cool, but what triggered this tidbit is a less positive word that kept intruding into the conversation — *cheat*. People seemed to feel the need to be defensive, to apologise for their nerd fun, and that made me a little sad.

The point of this tidbit is to argue that it's not just OK, but it's great to play a different game. If you're into word games, play Wordle, but if you're into computers, there's another game you play — exploring Wordle as a computational problem! 

**Unless you're deceiving people, it's not just OK to play a different game, it's fun, and you'll probably learn something too!**

## Matching Podcast Episode

TO DO

## 8 Queens

I want to start by taking you down memory lane, to the autumn of 1997, some time around Halloween. Back then I was a naive but excited first year science student in what's now Maynooth University, and I was taking Computer Science by default. The norm in Ireland back then was to take general science degrees and specialise after graduation with a masters degree or a doctorate. Maynooth was no exception, and I was happy to have gotten a place in *MH201 – General Science*.

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

So enter Wordle!

In case you're not familiar with the game — each day there's a 5-letter word to try find in six guesses. To guess you type a 5-letter word into a grid, and when you submit it, your 5 letters change colour — if any letter goes grey then it's not in the word anywhere, if any letter goes yellow then it is in the word somewhere, but not at that position, and if it goes green it's in the word at that position.

In her terminal experimentations Allison used the dictionary file present in POSIX operating systems like the Mac and Linux, but I went a different route, I knew Wordle was a JavaScript game, so I used my brower's developer tools to search the code for the word list and found it as an array. (For a fantastic description of how Wordle works, check out this great blog post TO DO).

Armed with my word list saved as a TXT file I set about automating my guesses with terminal commands.

The first hurdle was picking a random word — I didn't want to guess the same word every time, so set about finding a way to randomly pick a single word from my list. The solution I settled on combined two commands `sort --random-sort` to jumble up my list, and `head -1` to extract just the fist line:

```sh
cat wordleWords.txt | sort --random-sort | head -1
```

On February 6 2022 that gave me a first guess of `thyme` which sadly gave me all grey squares 🙁

Oh well, we can use regular expressions to exclude all words that contain any of those letters by combining character classes in regular expressions with the `-v` for *in__v__ert* flag.

In PCRE regular expressions, a list of characters in square brackets is referred to as a *character class* means *'any one of these'*. Both `grep` and `egrep` allow you to flip the logic of their search with the `-v` flag, so inserting `egrep '[thyme]'` into our chain of commands will filter out words file down to only the lines that don't contain any of the characters in `thyme`. By adding that into my chain I used the following to choose my second guess:

```sh
cat wordleWords.txt | egrep -v '[thyme]' | sort --random-sort | head -1
```

That gave me `ovoid`.

That got me four more greys, `ovo` & `d`, and one yellow, `i` at position 4. Adding the grey letters to the existing character class is easy: `egrep '[thymeovd]'`, but what about the yellow? This provides an opportunity to use *inverted character classes*. By starting a character class with the hat symbol, the meaning flips, and the class becomes *'any character except these'*. In PCRE the symbol `.` means *'any single character'*, so by including `egrep '...[^i].'` we've captured the fact that the `i` can't be at position 4. What we haven't captured yet is that there must be an `i`, we can do this with a very simply `grep`: `grep 'i'`. Adding these two commands into my chain game me the following command for generating my third guess:

```sh
cat wordleWords.txt | egrep -v '[thymeovd]' | grep 'i' | egrep '...[^i].' | sort --random-sort | head -1
```

That game me `incur`.

The result — the `i` turned yellow again, so not only is it not in the 4th position, it's also not in the first. All the other letters turned grey, so the word doesn't contain any of `ncur` either. Updating our command chain to include this new information I got the following to generate my fourth guess:

```sh
cat wordleWords.txt | egrep -v '[thymeovdncur]' | grep 'i' | egrep '[^i]..[^i].' | sort --random-sort | head -1
```

That gave me `skiff`, which proved a very fruitful guess, the first three letters went green, and the two `f`s grey. We now know the first three letters, so we can update our pattern to incorporate that: `egrep 'ski[^i].'`. We also know the final word doesn't contain an `f`, so we can update our exclude list to `egrep -v '[thymeovdncurf]'`. This gives the following command to generate my fifth guess:

```sh
cat wordleWords.txt | egrep -v '[thymeovdncurf]' | grep 'i' | egrep 'ski[^i].' | sort --random-sort | head -1
```

This gives `skill`, which is the correct answer 🎉 😀

TO DO — how to take things further

## Final Thoughts

TO DO

## Related Content

* TO DO