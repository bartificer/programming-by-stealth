# PBS 91 of X — JavaScript RE Objects

Over the past few instalments we've been looking at many of the different *hats* objects wear in JavaScript. We've seen how JavaScript uses objects to implement dictionaries/hash tables, arrays, strings, functions of various kinds, and to wrap primitive values when they need object-like behaviour. In this instalment we'll be looking at our penultimate *hat* — regular expressions.

As a gentle reminder, Regular Expressions, also known as RegExps or simply REs, are a means of representing text patterns. 

We'll start by reminding ourselves of the syntax for regular expression literals in JavaScript. Next we'll look at some of the useful functions provided by the built-in RegExp class, and how they allow us to do three extremely common RE-related tasks — checking whether or not strings match a given pattern, and using patterns to extract meaningful information from strings, or *string parsing* if you prefer fancier jargon 🙂 We'll finish by re-visiting some instance functions provided by the built-in `String` class which make use of regular expressions.

## Matching Podcast Episode

Listen along to this instalment on [episode 626 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2020/02/ccatp-626/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_02_22.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_02_22.mp3" >Download the MP3</a>

## Regular Expressions in JavaScript

Regular expressions are an abstract theoretical computer science concept, and many different languages have been devised to express them. JavaScript uses one of the most common RE languages — *Perl Compatible Regular Expressions*, or PCRE.

Different programming languages choose to implement REs in very different ways. Some languages have just minimal support for REs, storing them simply as strings. Others integrate them deeply, providing native representations and implementations. While JavaScript doesn't integrate REs quite as deeply as Perl does, it does have extremely good RE support, including RE literals and a built-in class (`RegExp`) for storing RE objects.

We looked at regular expressions way back in [instalment 18](https://pbs.bartificer.net/pbs18), but let's quickly go over the highlights again, starting with RE literals.

## Regular Expression Literals

Throughout this series within a series looking at all the different hats JavaScript makes objects wear we've already seen many of the types of literal JavaScript supports. We've see object literals, array literals, function literals, and string literals:

```js
// an object literal representing a simple dictionary
const contactDetails = {
	twiter: '@ltpod',
	web: 'http://www.bartb.ie/',
	gitHub: 'https://github.com/bartificer'
};

// an array literal
const mucusSynonyms = ['bogies', 'boogers', 'snot'];

// a function literal
const insulter = function(){
	window.alert('Your mother was a hamster, and your father smelled of elderberries!');
};

// a string literal
const botchedMovieLine = 'lying, dog-faced pony soldier';
```

In JavaScript, RE literals consist of PCRE patterns enclosed by forward slashes (`/`) followed by zero or more flags. As a simple example, here's an RE literal to match all occurrences of `cat` or `dog` in any case: 

```js
const schemeRE = /cat|dog/gi;
```

The RE itself is `cat|dog`, which you'd read as *'cat or dog'*, and `g` & `i` are flags — `g` for *global*, and `i` for *case insensitive*.

## PCRE Syntax Refresher

I'm not going to repeat the entire syntax here, instead, I'll recommend two very good links on Mozilla's excellent developer portal:

1. [Regular Expressions Guide — developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
2. [Regular Expressions Cheatsheet — developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet)

But, let's run through a few highlights all the same.

### Escaping Special Characters

Firstly, special characters are escaped with a backslash character (`\`).

### Flags

Secondly, while there are a total of six possible flags (as of ES2018), there are three particularly important ones:

| flag | Meaning                                                                                                                                                                            |
| :--: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `g`  | Perform a **global** search. This flag alters the behaviour or many functions that use regular expressions, the details will be in the documentation for the function in question. |
| `i`  | Perform as **case-insensitive** search.                                                                                                                                            |
| `m`  | Perform a multi-line search, i.e. interpret `^` as _start of line_ instead of _start of string_, and `$` as _end of line_ instead of _end of string_.                              |

### Character Classes

PCRE provides us with many codes for specifying a single occurrence of a given special character, or a single individual character from a related group of characters. The table below is far from an exhaustive list, but it covers the ones you're most likely to need regularly.

| Character Descriptor | Meaning                                                      |
| :------------------: | :----------------------------------------------------------- |
|         `.`          | Any one character.                                           |
|         `\d`         | Any digit.                                                   |
|         `\w`         | Any word character (a to z, A to Z, 0 to 9, and underscore). |
|         `\s`         | any blank space character.                                   |
|         `\D`         | any character that's not a digit.                            |
|         `\W`         | any non-word character.                                      |
|         `\S`         | any non-space character.                                     |
|         `\t`         | a tab character.                                             |
|         `\n`         | a newline character.                                         |

As well as supporting many pre-defined character classes, PCRE also lets us define our own by listing the contents of our desired class within square brackets. For example, the character class to match any single un-accented lower-case western vowel is `[aeiou]`.

PCRE also allows us to specify ranges of characters within our character classes, so the following character class represents a single lower-case hexadecimal digit — `[0-9a-f]`.

Finally, we can negate our entire character class by starting it with the carat symbol (`^`), so, any one character that's not a lower-case western vowel can be matched with `[^aeiou]`.

### Position Indicators

PCRE also gives us a number of position indicators to help us anchor our pattern within a string. Again, the table below is not exhaustive.

| Position Indicator | Meaning                                                   |
| :----------------: | :-------------------------------------------------------- |
|        `^`         | the start of the string (or of a line with the `m` flag). |
|        `$`         | the end of the string (or of a line with the `m` flag).   |
|        `\b`        | a word boundary (start or end of a word).                 |

### Quantity Specifiers

As well as allowing us to specify which characters we want where, PCRE also allows us to specify how often parts of the pattern should repeat. Again, not an exhaustive list, but some of the common PCRE quantity specifiers are shown in the table below.

| Quantity Specifier | Meaning                              | Example                                             |
| :----------------: | :----------------------------------- | :-------------------------------------------------- |
|        `|`         | or                                   | `/cat|dog/` _cat or dog_                            |
|        `?`         | zero or one of …                     | `/https?/` _http optionally followed by an s_       |
|        `*`         | zero or more of …                    | `/a*/` _any number of a characters, including none_ |
|        `+`         | one or more of …                     | `/a+/` _one or more a characters_                   |
|       `{n}`        | exactly `n` of …                     | `/b{2}/` _two b characters_                         |
|      `{x, y}`      | between `x` and `y` (inclusive) of … | `/\d{1,3}/` _one, two, or three digits_             |

### Groupings (Capturing & Non-Capturing)

Plain parentheses serve a dual role in PCRE. They allow you to group parts of a pattern together so they can be addressed as a group by the various operators and quantity specifiers, but they also act as so-called *capture groups*. Each opening parenthesis starts a numbered sub-pattern, and some of the regular expression-related functions allow us to make use of these numbered sub-patterns. The sub-patterns are numbered from the left, and patterns can be nested within each other.

As an example, given the following RE: `/((\d{2}):(\d{2}))(:(\d{2}))?/`, the strings `12:01` and `12:01:02` would both match. The final set of parenthesis group the `:\d{2}` together so the `?` makes that entire piece of the pattern optional.

If we take the second of those two strings (`12:01:02`) and match it against the regular expression then the parentheses also mean that there will be five numbered sub-patterns, or capture groups, populated. Starting form the left the first open parenthesis is part of a set that encloses `(\d{2}):(\d{2})`, so the first numbered match will be `12:01`. The second opening parenthesis only encloses `\d{2}`, so it will match just `12`. Similarly the third opening parenthesis will match `01`. The fourth opening parenthesis encapsulates `:(\d{2})`, so it will match `:02`. Finally, the fifth opening parenthesis encapsulates just `\d{2}`, so it will match `02`.

Of those five example capture groups four capture useful information — 1 captures the time without seconds, 2 captures the hours, 3 the minutes, and 5 the seconds, but 4 captures nothing of value, it's only there to connect the third colon to the seconds and make them optional as a group, not individually. We need this grouping to make the RE work, but we don't want to capture it!

Non-capturing groups allow us to group parts of an RE together without them being captured. A non-capturing groups starts with `(?:` and ends with `)`. So, we can re-write our sample RE to only capture the four useful groupings like so: `/((\d{2}):(\d{2}))(?::(\d{2}))?/`.

## The RegExp Class

JavaScript represents regular expressions with the built-in class `RegExp`. For full documentation of all properties and functions [see the class's page on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

We're going to confine our look at this class to just two functions — those that encapsulate the two most common use-cases for regular expressions — validation, and parsing.

While there is a `RegExp` constructor available for use, you're better off using RE literals to create `RegExp` objects. Why? Because the constructor takes a string as an argument, so the backslash character needs to be double-escaped, one for the string, then again for the RE. This is very confusing to look at!

To prove this point, the following two assignments result in `RegExp` objects representing the same pattern:

```js
const hasWebScheme1 = /^https?:\/\//i;
const hasWebScheme2 = new RegExp('^https?:\\/\\/', 'i');
```

Note that `RegExp` instance functions can be directly invoked on RE literals, even when they have flags:

```js
const doesMatch1 = /^\d+$/.test(42); // true
const doesMatch2 = /^https?:\/\//i.test('HttP://www.podfeet.com/'); // true
```

### Validation with `.test()`

The first common task regular expressions are used for is to validate input of some kind to be sure it meets some required pattern.

When validating data all you're interested in is a yes/no answers, you're not interested in capturing sub-patterns or anything like that. The `RegExp` class provides and instance function dedicated to this use — `.test()`. It takes the string to test as an argument, and returns `true` if the string matches the pattern, and `false` otherwise.

For one-off tests it makes sense to use the `.test()` function on an RE literal:

```
const valToTest = 42;
const isOK = /^\d+$/.test(valToTest);
console.log(`testing '${valToTest}' resulted in ${isOK}`);
```

When making multiple tests it's more efficient to create an RE object once, then re-use that object as needed:

```js
const okRE = /^\d+$/;
const valsToTest = [42, 'boogers', '99'];
for(const val of valsToTest){
	const isOK = okRE.test(val);
	console.log(`testing '${val}' resulted in ${isOK}`);
}
```

### Parsing and Extracting with `.exec()`

Parsing is a little more involved than testing, and this is where *capture groups* come into their own. By parsing we mean processing text in order to extract meaningful information. 

For example, we can use a regular expression with three capture groups to break a time apart into its component pieces:

```js
const timeParseRE = /^(\d{2}):(\d{2}):(\d{2})$/;
```

Given this RE, we can use the `.exec()` instance function from the `RegExp` class to parse a given string. This function takes the string to parse as an argument, and has many possible return values depending on both the RE flags and whether or not the string matched the RE.

Let's start by assuming the RE does not have the global (`g`) flag set (as is the case with our example). In this scenario `.exec()` will return one of two things — if the RE does not match it will return `null`, and if it does match it will return an array. Assuming a match, the first element in the array (i.e. the _zeroth_ element) will be the full matched string. This will be followed by the matched values for each capture group in the RE, so, the first capture group will be at position 1, the second at position 2, etc..

Given our example RE above we can see this in action:

```js
console.log(timeParseRE.exec('boogers')); // null
console.log(timeParseRE.exec('12:01:02')); // ["12:01:02", "12", "01", "02"]
```

In the real world we would extract the parts into sensibly named variables, probably using restructuring assignment:

```js
const [, hrs, mins, secs] = timeParseRE.exec('12:01:02');
console.log(`hrs=${hrs}, mins=${mins} & secs=${secs}`);
```

Notice the leading comma to discard the un-wanted first item in the array.

So far we have been breaking a single time into pieces, what if we wanted to find all times in a long string of text? This is where the global flag comes into play.

If the RE that `.exec()` is called on has the global (`g`) flag set then the RE object becomes *stateful* and remembers the location in a string immediately following the previous match. If you pass the same string in again the search will resume from where it left off. This will keep happening until there are no more matches, at which point `null` will be returned, and the internal state gets reset.

This behaviour is extremely un-obvious and clunky, and there are proposals to fix it in a future version of the language, but for now, it's the best we can do. If we update our previous RE to remove the start and end of string indicators we can look over a string of text and pull out all the times:

```js
// define a string to search
const stringToSearch = "I thought we might meet at 07:00, but that was too early for Bob so I suggested 10:00, but that was too late for Alice, so we settled on 08:00 in meeting room 3.";

// define a global RE
const globalTimeRE = /(\d{2}):(\d{2})(?::(\d{2}))?/g;

// loop over the string using .exec() on the RE
let match = null;
while(match = globalTimeRE.exec(stringToSearch)){
	const [, hr, min, sec] = match;
	console.log(`Found time with hours='${hr}', minutes='${min}', and seconds='${sec}'`);
}
```

## REs in `String` Instance Functions

Given how closely related regular expressions and strings are, it's quite logical for some of the instance functions provided by the built-in `String` class to utilise regular expressions. Below are some of the highlights, again, this is by no means an exhaustive list.

### Finding Patterns in Strings

The built-in `String` class provides two functions for finding a pattern within a string. These functions are similar to the `.exec()` function provided by the `RegExp` class, but mirrored. While `.exec()` is invoked on RE objects and passed a string, these functions are invoked on strings and passed an RE.

The first of this pair of functions is `.match()`. This function behaves differently depending on whether or not the RE its passed has the global flag set. If the global flag is set it returns an array of all complete matches, ignoring the capture groups. If the global flag is not set it returns only the first match, in the same format as returned by `.exec()` from the RegExp class, i.e. with its sub-matches. Regardless of whether or not the global flag is set, if the string doesn't match the regular expression at all, `null` is returned.

If we're interested in finding a single date within a string and breaking it into pieces we could use an RE without the global flag:

```js
const meetStr = "meet Bob at 10:00 tomorrow";
const dateMatch = meetStr.match(/\b(\d{2}):(\d{2})\b/);
if(dateMatch){
	const [mTime, mH, mM] = dateMatch;
	console.log(`The meeting is at ${mTime} (hours='${mH}' & minutes='${mM}')`);
}else{
	console.log('No idea when the meeting is 🙁');
}
```

Note the use of the word boundary position indicator (`\b`) within the RE, and the use of destructuring assignment to split the array into separate named variables.

If, on the other hand, we want to extract all times from a string but don't want the sub-parts we can use an RE with the global flag set:

```js
const inputStr = "I wanted to meet at 08:00, but that was too early for Bob, so he suggested 10:00, but that was too late for Alice, so we settled on 09:00";
const matchedTimes = inputStr.match(/\b\d{2}:\d{2}\b/g);
if(matchedTimes){
	console.log(`found ${matchedTimes.length} times: ${matchedTimes.join(', ')}`);
}else{
	console.log('No times found 🙁');
}
```

At the moment we're forced to choose between two sub-optimal options when it comes to finding multiple matches in a string — either we give up getting the sub-matches (capture groups), or we use the unintuitive state-full behaviour of the `.exec()` function from the RegExp class. The good news is change is coming — there is a draft specification for a new function named `.matchAll()` for the `String` class that will take an RE as an argument and return an iterator to iterate over all matches, giving sub-matches for each match. For now (February 2020), this function is not in the official spec, and not widely supported in browsers.

### Replacing Patterns within Strings with `.replace()`

The next function I want to highlight from the `String` class is `.replace()`. This function can accept an RE object as the first argument. Depending on whether or not the passed RE has the global flag set, either the first occurrence of the pattern or all occurences will be replaced by the replacement string passed as the second argument.

The replacement string can include a number of special values based on the regular expression. You can include the entire match in the replacement string with `$&` and the matched capture groups with `$1`, `$2` etc.. Because the `$` character has a meaning within the replacement string you need to use `$$` to represent an actual dollar character.

Note that this function is a little more complex than this simply description implies — the first argument can be a string rather than an RE, and the second argument can be a function rather than a string. If you want to learn more about this function [see the relevant MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace).

As a simple example, let's use this function to replace all arbitrarily capitalised variants of the word `NosillaCast` with the nicely inter-capped version:

```js
const originStr = "The Nosillacast Rocks! Those nosillacastaways sure know how to geek!";
const fixedStr = originStr.replace(/nosillacast/gi, 'NosillaCast');
console.log(`Before:\n${originStr}\n\nAfter:\n${fixedStr}`);
```

Note the use of both the `i` and `g` flags. The `i` flag ensures our pattern matches regardless of case, and the `g` ensure we replace all occurrences of the pattern, not just the first.

Also note that because we did not wrap the letters `nosillacast` with word boundary position indicators (`\b`), `nosillacastaways` was matched as well as `Nosillacast`.

This simple example does not use capture groups, so let's take things up a notch and use the `.replace()` function to convert American dates to US Dates.

```js
const usDateStr = "I had a great time 12/25/2019, I'm hoping 12/25/2020 is as good!";
const euDateStr = usDateStr.replace(/\b(\d{2})\/(\d{2})\/(\d{4})\b/g, '$2-$1-$3');
console.log(`Before:\n${usDateStr}\n\nAfter:\n${euDateStr}`);
```

### Splitting Strings into Arrays with `.split()`

The final `String` instance function I want to highlight is `.split()`. This function splits a string into an array of strings based on a delimiter which is passed as an argument. That delimiter can be a string, but it can also be a regular expression object.

When parsing input from users or a remote data source there's often subtle variations in the format that your code should take into account. For example, if you ask users for a comma-separated list of items will they add a space after the comma or not?

The following example will split a string on a comma followed by zero or more spaces:

```js
const rawList = 'something, something else,another thing,  one last thing';
const splitList = rawList.split(/,[ ]*/);
console.log(splitList); // ["something", "something else", "another thing", "one last thing"]
```
Notice that this RE split on a comma with one space, no spaces, and two spaces, and that in each case, the entire matched pattern was treated as the delimiter and removed.

## Final Thoughts

We've now revisited all the *hats* objects wear in JavaScript that I think are worth focusing on but one. I've left what is arguably the most powerful and important hat of all until the very end of this little series within a series. JavaScript uses objects to represent classes. JavaScript's implementation of object orientation is extremely unusual, and before ES6 there was no way of writing your own classes without coming face-to-face with the intricate details of this unusual approach. This make writing classes in JavaScript extremely confusing. We initially learned to do it the hard way all the way back in instalments [17](https://pbs.bartificer.net/pbs17), [27](https://pbs.bartificer.net/pbs27), [28](https://pbs.bartificer.net/pbs28) & [29](https://pbs.bartificer.net/pbs2), and it didn't go well. It simply didn't click into place for Allison and many others. We tried again using the modern ES6 syntax in instalments [46](https://pbs.bartificer.net/pbs46), [47](https://pbs.bartificer.net/pbs47) & [48](https://pbs.bartificer.net/pbs48), but again, it didn't click. I'm hoping the third time is a charm! I'm hoping the third time will be a charm! My plan is to avoid any mention of the pre-ES6 way of doing things, to keep things simple, and to spread the topic over two instalments.

Before we dive into our third attempt at understanding JavaScript classes we'll dedicate the next instalment to the solution to the challenge set in [instalment 89](https://pbs.bartificer.net/pbs89).
