# PBS 84 of X — Objects as Dictionaries in JavaScript (Redux & Update)

As we near the end of our initial exploration of client-side web technologies I want to re-visit some key JavaScript features so cement what we already know, and add some new features brought to the language in more recent releases of the ECMA standard that underpins JavaScript.

Since objects are so ubiquitous in JavaScript I want to start there, and I want to start with their most fundamental use, as so-called _dictionaries_.

You can [download this instalment’s ZIP file here](https://www.bartbusschots.ie/s/wp-content/uploads/2019/10/pbs84.zip) or [here on GitHub](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentZips/pbs84.zip).

# Matching Postcast Episode 611

Listen along to this instalment on [episode 611 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/10/ccatp-611/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_10_19.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_10_19.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

You can enter all the examples on this page into the JavaScript console in the file `pbs84a.html` from this instalment’s ZIP file.

## Dictionaries in JavaScript

_Dictionary_ is not a JavaScript keyword, and dictionaries are not formally defined in the JavaScript specification — it’s a _term-of-art_ used by programmers to describe a very common type of data structure that’s supported in just about every language. Programmers use many synonyms for the same concept, so you might also see dictionaries referred to as _hash tables_, _hashes_, or _associative arrays_.

A dictionary is a collection of name-value pairs, also referred to as key-value pairs. A traditional dictionary contains word definitions indexed by words. The definitions are the values, and the words are the names/keys.

Name-value pairs are often referred to as _properties_, so you may also see the names/keys referred to as _property names_.

In JavaScript we use basic objects as dictionaries. To be extremely specific, we use objects with the prototype `Object`. Because Javascript uses objects for just about everything, programmers have come up with all sorts of words and phrases for describing basic objects used as dictionaries including _plain objects_, _un-prototyped objects_, and even POJOs (an acronym for _**p**lain **o**ld **J**avaScript **o**bjects_).

**The official Javascript documentation and built-in JavaScript function names refer to name-value pairs as _properties_, and the names as _property names_ and _keys_.**

### Creating Dictionaries with Object Literals (Redux)

The simplest way to create an object is using so-called object literals. These consist of comma-separated name-value pairs where the names and values are separated by a colon character. If the name contains characters that can’t be used in variable names it must be quoted, and the value can be any valid JavaScript value, including named variables.

That sounds complicated, but let’s look at the declaration of a dictionary storing profits per day as a collection of name-value pairs where the names are abbreviations of the days of the week, and each value a number of Euro as a floating-point number. You’ll find this declaration in `pbs84a.html`:

```JavaScript
const dailyProfits = {
  mon: 252.80,
  tue: 125.93,
  wed: 130.32,
  thur: 321.74,
  fri: 330.59,
  sat: 428.26,
  sun: 0
};
```

### Accessing Dictionary Values (Redux)

JavaScript supports two distinct syntaxes for accessing a specific value within a dictionary.

The simplest syntax to read uses the period to decent into an object. I.e. the value for a given key can be addressed as `object.key`. For example, the profits for Wednesday in the example object above are `dailyProfits.wed`. Can use this notation to access the value like we can any variable, and, we can use it to alter the value, e.g.:

```JavaScript
// access a value within a dictionary
console.log(`Wednesday's profits were €${dailyProfits.wed}`);

// alter a value within a dictionary
dailyProfits.wed = 135.32;

// access the altered value
console.log(`Wednesday's profits are now €${dailyProfits.wed}`);
```

This syntax can only be used when you know the exact name of the key you wish to access, and, when the key does not contain any characters that can’t be used in variable names.

When our keys contain characters that can’t be used in variable names, or, when we want to use the value of another variable as the key, we need the more advanced square bracket syntax. Here we surround the value to be used as the key with square brackets and place them directly after the object name, i.e. `object[key]`. We can re-write our dot-syntax example above as:

```JavaScript
// access a value within a dictionary
console.log(`Wednesday's profits were €${dailyProfits['wed']}`);

// alter a value within a dictionary
dailyProfits['wed'] = 138.38;

// access the altered value
console.log(`Wednesday's profits are now €${dailyProfits['wed']}`);
```

Notice that the key is a string. If we left out the quotation marks JavaScript would treat `wed` as a variable name, and try use that variable’s value as the key. This is something you often want to do intentionally, especially within loops.

If your code often encodes data in dictionaries indexed by week day you would probably store the weekdays in an array and then use that array to loop over your keys. Below is the definition of the days array in the file `pbs84a.html`:

```JavaScript
const dayAbbrs = ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'];
```

We can now use this array to loop over all the entries in our profits dictionary like so:

```JavaScript
for(const d of dayAbbrs){
  console.log(`€${dailyProfits[d]} profit!`);
}
```

Note that `d` is not the string `'d'`, but a variable named `d` (not quoted). The first time through the loop `d` will have the value `'mon'`, so `dailyProfits[d]` will be interpreted as `dailyProfits['mon']`. The second time through the loop `d` will have the value `'tue'`, so `dailyProfits[d]` will be interpreted as `dailyProfits['tue']`, and so on.

### Nested Dictionaries (Redux)

The value for a given key within a dictionary can itself be a dictionary (i.e. an object), and programmers refer to this kind of recursive structure as being _nested_.

Object literals, the dot syntax, and the square bracket syntax all support nesting.

As an example let’s look at a more detailed dictionary of weekly sales as defined in `pbs84a.html`:

```JavaScript
const dailySales = {
  mon: {
    itemsSold: 56,
    profit: 252.80
  },
  tue: {
    itemsSold: 31,
    profit: 125.93
  },
  wed: {
    itemsSold: 33,
    profit: 130.32
  },
  thur: {
    itemsSold: 40,
    profit: 321.74
  },
  fri: {
    itemsSold: 44,
    profit: 330.59
  },
  sat: {
    itemsSold: 62,
    profit: 428.26
  },
  sun: {
    itemsSold: 0,
    profit: 0
  }
};
```

Monday’s profits would now be at `dailySales.mon.profit`, and at `dailySales['mon']['profit']`.

Also note that you can mix the dot and square bracket syntaxes, so Monday’s profits are also at `dailySales['mon'].profit` and `dailySales.mon['profit']`.

You can see this for yourself by entering the following in the JavaScript console on `pbs84a.html`:

```JavaScript
console.log(`dailySales.mon.profit evaluates to: ${dailySales.mon.profit}`);
console.log(`dailySales['mon']['profit'] evaluates to: ${dailySales['mon']['profit']}`);
console.log(`dailySales['mon'].profit evaluates to: ${dailySales['mon'].profit}`);
console.log(`dailySales.mon['profit'] evaluates to: ${dailySales.mon['profit']}`);
```

To facilitate more human-friendly outputs, `pbs84a.html` defines a better version of the array of day abbrevations. This array stores a list of dictionaries, one for each day of the week. Each of those dictionaries defines two keys, `name`, and `abbr`. The values for the `name` key are the human-friendly names of the days, and the values for the `abbr` key are the abbreviations:

```JavaScript
const days = [
  { name: 'Monday', abbr: 'mon' },
  { name: 'Tuesday', abbr: 'tue' },
  { name: 'Wednesday', abbr: 'wed' },
  { name: 'Thursday', abbr: 'thur' },
  { name: 'Friday', abbr: 'fri' },
  { name: 'Saturday', abbr: 'sat' },
  { name: 'Sunday', abbr: 'sun' }
];
```

We can now print out our daily data with a loop like so:

```JavaScript
for(const d of days){
  console.log(`We made €${dailySales[d.abbr].profit} profit by selling ${dailySales[d.abbr].itemsSold} items on ${d.name}!`);
}
```

Notice the use of both the dot and square bracket syntaxes.

In the real world we would probably make the code a little easier to read by creating a variable to hold the current day’s data within the loop:

```JavaScript
for(const d of days){
  const dData = dailySales[d.abbr];
  console.log(`We made €${dData.profit} profit by selling ${dData.itemsSold} items on ${d.name}!`);
}
```

### The Dictionary’s Keys (Redux)

JavaScript provides the `Object.keys()` function for extracting the keys from a given dictionary and returning them as an array of strings, e.g.:

```JavaScript
console.log(Object.keys(dailySales));
```

## Shorthand Property Names (New)

It’s quite common to end up in a situation where you have a variable with a given name that you wish to use within an object as a key with the same name. Before ECMA Script 2015 (AKA ES6) you had to duplicate the variable name within object literals. As a contrived example, imagine we have two variables named `alice` & `bob` that contain these people’s OS preference. We then want to create an object containing multiple poeple’s preferences, including Alice’s and Bob’s. Before ES6 we had to write code of the form:

```JavaScript
const bob = 'Linux';
const alice = 'macOS';
// …
const osPrefs1 = {
  bob: bob,
  alice: alice,
  charlie: 'Windows'
};
console.log(osPrefs1);
```

Notice the annoying duplication of `bob` and `alice`. Why is this? To the left of the `:` these are key names, to the right, values. Since the variable containing the desired value has the same name as the desired key, we get duplication.

Since ES 6 we can remove this duplication like so:

```JavaScript
const osPrefs2 = {
  bob,
  alice,
  charlie: 'Windows'
};
console.log(osPrefs2);
```

Notice that the properties are still comma-separated, but there’s no `:` in the definitions for the `bob` or `alice` properties. `bob` is simply interpreted as `bob: bob`, making for less typing and cleaner code 🙂

## The Spread Operator within Dictionaries

ECMAScript 2018 brought along another nice new pice of object-related syntax — the ability to merge all the properties from an existing dictionary into a new one by adding support for the spread operator (`...`) to object literals.

To incorporate all the key-value pairs from an existing dictionary into a new dictionary simply pre-fix the name of the existing dictionary with `...` within an object literal. As an example, imagine we have an existing object that defines the OS preferences of all the men in the office, and we want to create a new object that includes all the men’s preference and those of the women in the office, we can do that with the spread operator:

```JavaScript
const menOSPrefs = {
  bob: 'Linux',
  charlie: 'Windows'
};

// …

const allOSPrefs = {
  ...menOSPrefs,
  alice: 'macOS',
  charlene: 'Linux'
};
console.log(allOSPrefs);
```

In the above example `allOsPrefs` will contain four key-value pairs with keys `bob`, `charlie`, `alice`, and `charlene`.

## Object Destructuring (New)

Object destructuring is an extremely powerful new syntax introduced with ECMAScript 2015 AKA ES6. We’re just going to scratch the surface here — for much more details see [the Mozilla Developer Network entry titled _Destructuring Assignment_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring).

_Object destructuring_ is a fancy term for a new syntax that allows you to reach into an existing dictionary and extract one or more properties and use them anywhere JavaScript can accept a value. The most common use for the technique is to convert key-value pairs in dictionaries into stand-alone variables.

In general you’ll recognise object destructuring because the syntax looks like an object literal on the left side of an assignment operator (`=`) instead of the right.

Object destructuring is much more difficult to describe than to demonstrate, so let’s just move straight to a practical illustration of the most common use-case!

### Converting Dictionary Entries to Variables

For these examples we’ll be using the dictionary userOSPerfs defined in the file pbs84a.html:

```JavaScript
const userOSPrefs = {
  alice: 'macOS',
  bob: 'Linux',
  charlie: 'windows'
};
```

Note that because we’ll be declaring variables over and over again, you’ll need to refresh the page between examples to avoid errors caused by re-declaring the same variable.

Given the above dictionary, we can use object destructuring to create a variable named `bob` from the `bob` key like so:

```JavaScript
const {bob} = userOSPrefs;
console.log(`bob evaluates to: ${bob}`);
```

This will create the variable `bob` with the value `'Linux'`.

We can create as many variables as we like within a single assignment. The following will create two variables from our dictionary, `alice` & `charlie`:

```JavaScript
const {alice, charlie} = userOSPrefs;
console.log(`alice evaluates to: ${alice}`);
console.log(`charlie evaluates to: ${charlie}`);
```

This will create a variable named `alice` with the value `'macOS'` and a variable named `charlie` with the value `'Windows'`.

### Gathering the ‘Rest’

The spread operator can be used within the object destructuring syntax to create a new dictionary with the name of your choice that contains all entries not already destructured into another variable. In other words, we can gather up the left overs into a new dictionary!

Again, using our above example dictionary `userOSPrefs` we can extract Bob’s record into a variable named `bob`, and everyone else into a new dictionary named `notBob` like so:

```JavaScript
const {bob, ...notBob} = userOSPrefs;
console.log(bob);
console.log(notBob);
```

This will create two variables, one named `bob` with the value ‘Linux’, and one named `notBob` that’s a dictionary containing the keys `alice` and `charlie` with the same values they had in the original `userOSPrefs` dictionary.

### Default Values

What happens if you try extract a key that the dictionary doesn’t define? Ordinarily your new variable will be created with the value `undefined`. You can specify a default value to use should there be no matching key like so (again, using our above dictionary `userOSPrefs`):

```JavaScript
const {tom='Windows', alice='Linux'} = userOSPrefs;
console.log(`tom evaluates to: ${tom}`);
console.log(`alice evaluates to: ${alice}`);
```

This will create two variables, one named `tom`, and one named `alice`. Because the dictionary `userOSPrefs` does not define a key named `tom`, the variable `tom` gets the default value `'Windows'`. Because the dictionary `userOSPrefs` does define a key named `alice`, the variable `alice` gets the value `'macOS'` from the dictionary rather than the default value `'Linux'`.

### Extracting to a Different Name

Being able to suck multiple keys out of a dictionary and turn them into variables with the same names all in a single line of code is a lovely convenience, but what if you want to alter the names? It turns out you can!

Using our sample `userOSPrefs` dictionary from before, we can create variables for the keys `bob` and `charlie` named `Robert` and `Charles` like so:

```JavaScript
const {bob: Robert, charlie: Charles} = userOSPrefs;
console.log(`Robert evaluates to: ${Robert}`);
console.log(`Charles evaluates to: ${Charles}`);
```

Note that this syntax can be used with default values too:

```JavaScript
const {bob: Robert='macOS', tom: Thomas='macOS'} = userOSPrefs;
console.log(`Robert evaluates to: ${Robert}`);
console.log(`Thomas evaluates to: ${Thomas}`);
```

Since `bob` exists in the `userOSPrefs` dictionary with the value `'Linux'`, the variable `Robert` will have the value `'Linux'`, but since `tom` does not exist in the dictionary the variable `Thomas` will have the specified default value of `'macOS'`.

### Destructuring into Existing Variables

So far all our examples have involved destructuring a dictionary into a newly created variable. We’ve always used `const`, but it works the same with `let` and `var` too.

It is possible to use destructuring to assign new values to existing variables, but there’s a catch, and it’s one that’s very likely to catch you out!

Curly braces already have a meaning when not pre-fixed by a keyword like `const`, `let`, or `var` — they indicate a code block. If you try use the destructuring syntax as we’ve seen it thus far without a `const`, `let`, or `var`, you’ll get a syntax error. JavaScript will interpret the curly braces as a code block and try to read the destructuring syntax as a regular JavaScript statement, and conclude that it’s garbage! The way around this is very simple — just wrap the entire assignment in round brackets!

```JavaScript
let alice = 'OS/2 Warp';
let bob = 'OS/2 Warp';

// …

({alice, bob} = userOSPrefs);
console.log(`alice evaluates to: ${alice}`);
console.log(`bob evaluates to: ${bob}`);
```

## Conclusions

Having now reminded ourselves of how JavaScript objects can be used as dictionaries, and seen how recent versions of the language have added some nice new features, we’re ready to look at another very common use of objects in JavaScript — arrays.