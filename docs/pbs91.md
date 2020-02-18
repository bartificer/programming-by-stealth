# PBS 91 of X — JavaScript RE Objects

Over the past few instalments we've been looking at many of the different *hats* objects wear in JavaScript. We've seen how JavaScript uses Objects to implement dictionaries/hash tables, arrays, strings, functions of various kinds, and to wrap primitive values when they need object-like behaviour. In this instalment we'll be looking at our penultimate *hat* — regular expressions.

As a gentle reminder, Regular Expressions, also known as RegExps or simply REs are a means of representing text patterns. 

We'll start by reminding ourselves of the syntax for regular expression literals in JavaScript. Next we'll look at some of the useful functions provided by the built-in RegExp class, and how they allow us to do two extremely common RE-related tasks — checking whether or not strings match a given pattern, and using patterns to break strings into meaningful components, or *string parsing* if you prefer fancier jargon 🙂. After that we'll take a quick look at how the String and Array built-in classes make use of REs, and will finish with a nice new RE feature being added in ES2018 TO CHECK

<!-- more -->

## Regular Expressions on JavaScript

Regular expressions are an abstract theoretical computer science concept, and many different languages have been devised to express them. JavaScript uses one of the most common RE languages — *Perl Compatible Regular Expressions*, or PCRE.

Different programming languages choose to implement REs in very different ways. Some languages have just minimal support for REs, storing them simply as strings. Others integrate them deeply, providing native representations and implementations. While JavaScript doesn't integrate REs quite as deeply as Perl does, it does have extremely good RE support, including RE literals and a built-in class (`RegExp`) for storing RE objects.

We covered REs in detail in instalments XXXXXX TO DO, but let's quickly go over the highlights again, starting with RE literals.

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
const bothedMovieLine = 'lying, dog-faced pony soldier';
```

In JavaScript, RE literals consist of PCRE patters enclosed by forward slashes (`/`) followed by zero or more flags. As a simple example, here's an RE literal to match all occurrences of `cat` or `dog` in any case: 

```js
const schemeRE = /cat|dog/gi;
```

The RE itself is `cat|dog`, which you'd read as *'cat or dog'*, and `g` & `i` are flags — `g` for *global*, and `i` for *case insensitive*.

I'm not going to repeat the entire syntax here, instead, I'll recommend two very good links on Mozilla's excellent developer portal:

1. [Regular Expressions Guide — developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
2. [Regular Expressions Cheatsheet — developer.mozilla.org/…](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet)

I will point out a few highlights though:

| Quantity Specifier | Meaning | Example |
| :---: | :--- | : -- |
| `|` | or | `/cat|dog/` *cat or dog*
| `?` | zero or one of … | `/https?/` *http optionally followed by an s* |
| `*` | zero or more of … | `/a*/` *any number of a characters, including none* |
| `+` | one or more of … | `/a+/` *one or more a characters* | 
| `{n}` | exactly `n` of … | `/b{2}/` *two b characters* |
| `{x, y}` | between `x` and `y` (inclusive) of … | `/\d{1,3}/` *one, two, or three digits* |

| Character Descriptor | Meaning |
| :---: | :--- |
| `.` | any one character |
| `\d` | any digit |
| `\w` | any word character |
| `\s` | any blank space character |
| `\D` | any character that's not a digit |
| `\W` | any non-word character |
| `\S` | any non-space character |
| `\t` | a tab character |
| `\n` | a newline character |

| Position Indicator | Meaning |
| :---: | :--- |
| `^` | the start of the string (or of a line with the `m` flag) |
| `$` | the end of the string (or of a line with the `m` flag) |
| `\b` | a word boundary (start or end of a word) |

Character classes — TO DO

Capture Groups — TO DO