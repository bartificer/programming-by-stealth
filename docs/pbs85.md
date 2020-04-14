# PBS 85 of X — Objects as Arrays in JavaScript (Redux & Update)

There are many programming concepts that are common to the vast majority of programming languages, but each language implements these concepts in their own unique and special way. In JavaScript, objects are used to implement many concepts. I like to think of JavaScript objects as a single language feature that wears many hats. In [the previous instalment](https://bartificer.net/pbs84) we focused on one of these hats, JavaScript’s use of objects to implement dictionaries. In this instalment we’ll look at another hat JavaScript objets get to wear — arrays. As with the previous instalment, this instalment will be a mixture of consolidated reminders of things we’ve met before, and of some new features added to arrays in more recent versions of the JavaScript language.

We’ll also look at a sample solution to the challenge set at the end of instalment 83, but unusually, we’ll do that after our look at arrays.

You can [download this instalment’s ZIP file here](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs85.zip) or [here on GitHub](https://cdn.jsdelivr.net/gh/bbusschots/pbs-resources/instalmentZips/pbs85.zip) (now via the JSDelivr CDN). If you prefer, you can access this instalment’s resources directly at the following links:

*   `pbs85a.html`:  
    [View Page](https://rawcdn.githack.com/bbusschots/pbs-resources/d52db74056e78a9e298a691c716b487c93db910f/instalmentResources/pbs85/pbs85a.html) or  
    [View Source](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs85/pbs85a.html)
*   PBS 83 Challenge Solution:  
    [View Page](https://rawcdn.githack.com/bbusschots/pbs-resources/d52db74056e78a9e298a691c716b487c93db910f/instalmentResources/pbs85/pbs83-challengeSolution/index.html) or  
    [View Source](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs85/pbs83-challengeSolution/index.html)

# Matching Postcast Episode 613

Listen along to this instalment on [episode 613 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/11/ccatp-613/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_11_02.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_11_02.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Array Basics (Redux)

Regardless of the language you are using, conceptually, an array is a data structure consisting of an ordered list of values. Generally the values could be anything, from simple booleans, numbers or strings, to dictionaries, instances of classes, regular expressions, functions, or arrays. As a general rule, if the language you’re using can store a value in a variable, then it can probably store that value in an array.

Notice that we have a potentially nested structure because arrays can contain arrays! In fact, things get even more complicated, because arrays can contain dictionaries as well as other arrays, and dictionaries can contain arrays as well as other dictionaries. Generally speaking, regardless of the language you’re using, you’ll build your data structures by nesting dictionaries and arrays as needed. Note that in JavaScript, with the exception of booleans, numbers, and strings (sort of), everything else that goes into a data structure is an object wearing one of its many hats!

Before we get specific and limit our attention to JavaScript arrays, let’s remind ourselves of the fundamental properties of arrays in general. Regardless of the language, arrays generally have the following properties:

1.  The entries in an array are ordered and numbered, and usually indexed from 0 rather than from 1. I.e. the first element in an array is generally referred to as _element zero_, the second as _element one_, and so on.
2.  Arrays can contain empty slots in the list. I.e. it’s OK to have values at positions 0 and 2, but not at position 1.
3.  Arrays have a length, and its usually defined as the number of positions from the start of the array to the highest populated position. So, an array with only a single value at position 9 will have a length of 10 (remember that pesky zero index!).

### JavaScript Arrays

As mentioned in the introduction, JavaScript uses objects to implement the array concept. At their most fundamental level, JavaScript arrays are dictionaries with numeric keys numbered from zero. To make them behave in an array-like-way, JavaScript arrays are not just dictionaries though, they’re instances of the built-in prototype/class `Array`. It’s this class that provides the additional array features above and beyond what a simple dictionary provides.

So, in Javascript, arrays are objects of type `Array`.

The `Array` prototype adds just one proprty of note to arrays — `.length`. JavaScript defines an array’s length as one greater than the highest index that contains a value, or zero if the array contains no values. So, if you have an array with 10 values indexed from zero to nine, then that array’s `.length` will be 10, but an array with a single value at index 9 will also have a `.length` of 10.

### Creating Arrays with Array Literals

In JavaScript we can create arrays using the array literal syntax. This syntax simply consists of comma-separated values enclosed within square brackets.

For example, to create an array containing a boolean, a number, and a string you could do something like:

```JavaScript
const myArray = [true, 42, 'life, the universe, and everything'];
```

Array literals can contain any valid JavaScript value, including variables, array literals, and object literals.

### Accessing Array Elements

Since JavaScript arrays are fundamentally just objects with numeric keys, the rules for accessing individual values are the same as those for any other object. However, note that because numbers are not valid variable names, array elements can’t be accessed using the dot syntax, they must be accessed using the square bracket syntax:

```JavaScript
const myArray = ['one', 'two', 'three'];
console.log(myArray[1]); // outputs 'two'
myArray[1] = 'TWO!!';
console.log(myArray[1]); // outputs 'TWO!!'
```

**Note that in JavaScript, object keys are always cast to strings, so `myArray[1]` is interpreted as `myArray['1']`**.

### Standard Array Functions

Because JavaScript arrays are all instances of the built-in `Array` class, they all have the instance functions that class’s prototype defines. You can find the full list on [MDN’s documentation of the Array class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype), but below are some common examples we’ve seen before in this series.

Note that these examples are intended to be run from the JavaScript console on the file `pbs85a.html` from this instalment’s zip file. The examples make use of an array named days defined within that files global scope as follows:

```JavaScript
var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];	
```

OK, let’s look at the actual examples now:

```JavaScript
// combine into a string with a separator
console.log(days.join(', '));

// extract the last two elements of the array
console.log(days.slice(-2));

// remove the first element of the array
console.log(days.shift());
console.log(days); // now shorter!

// add an element to the front of the array
console.log(days.unshift('Monday'));
console.log(days); // now longer again!

// remove the last element of the array
console.log(days.pop());
console.log(days); // now shorter!

// add an element to the end of the array
console.log(days.push('Sunday'));
console.log(days); // now longer again!

// sort the array
days.sort();
console.log(days); // now in alphabetical order

// reverse the array
days.reverse();
console.log(days); // now in reverse alphabetical order
```

The `Array` class also provides a few useful static functions. We’ve seen both of the noteworthy ones already in this series:

```JavaScript
// test if a value is an array
console.log(Array.isArray(['boogers']));
console.log(Array.isArray(42));

// try convert a value to an array if possible
console.log(Array.from("test"));
```

Because the above snippets altered the value of the `days` array, please refresh `pbs85a.html` before continuing.

### The Spread Operator within Arrays

The spread operator can be used to include all the elements from an existing array into an array literal:

```JavaScript
const a1 = [2, 4, 6, 8];
const a2 = [0, ...a1, 10];
console.log(a2); // prints [0, 2, 4, 6, 8, 10]
```

A very common use of the spread operator is to create a so-called shallow clone of an array. Before explaining what a shallow clone is, it’s important to remember that in JavaScript, when any object is stored in any variable, including in a dictionary or an array, what is actually stored is a reference to the object, not the object itself. Most of the time this subtly is irrelevant, but there are times when it really matters.

To illustrate the point, let’s inadvertently alter the `days` array in `pbs85a.html`:

```JavaScript
const revDays = days;
revDays.reverse();
console.log(revDays); // ["Sunday", "Saturday", "Friday", "Thursday", "Wednesday", "Tuesday", "Monday"]
console.log(days); // ["Sunday", "Saturday", "Friday", "Thursday", "Wednesday", "Tuesday", "Monday"] !!!
```

Because `days` contains a reference to an array object, when we assigned `revDays` to the value of `days`, `revDays` stored a copy of the **reference**, not a copy of the array. This means both `days` and `revDays` refer to the same array. So when we altered `revDays`, we also altered `days`.

Using the spread operator in conjunction with the array literal syntax we can get around this problem by creating a new array that contains the values from the original array:

```JavaScript
const revDays = [...days]; // shallow clone
revDays.reverse();
console.log(revDays); // ["Sunday", "Saturday", "Friday", "Thursday", "Wednesday", "Tuesday", "Monday"]
console.log(days); // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
```

Why do we call this a _shallow copy_? Because only the values stored in the array get copied. If the array’s values are themselves references, then we are yet again copying references, as illustrated with this example:

```JavaScript
const deepArray = [ //an array of arrays
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const shallowClone = [...deepArray];
shallowClone[0].reverse();
console.log(shallowClone); // [[3, 2, 1], [4, 5, 6], [7, 8, 9]]
console.log(deepArray); // [[3, 2, 1], [4, 5, 6], [7, 8, 9]] !!!
```

## Looping Over Arrays (Redux)

Again, the examples below will work with the days array defined in the file `pbs85a.html` from this instalment’s ZIP file.

One of the most common things to want to do with an array is loop over it. We’ve seen quite a few ways of doing that through out this series, but there are two particularly common approaches you’ll see used in sample code etc..

Firstly, there’s the traditional way of looping over an array with a basic `for` loop:

```JavaScript
// show the number of letters in each day
for(let i = 0; i < days.length; i++){
  const curDay = days[i];
  console.log(`${curDay} has ${curDay.length} letters`);
}
```

ES6 introduced a whole new kind of loop specifically designed for looping over arrays in a more concise and easier to read way — the `for...of` loop:

```JavaScript
// show the number of letters in each day
for(const day of days){
  console.log(`${day} has ${day.length} letters`);
}
```

## Array Destructuring (New)

In the previous instalment we say how the new object destructuring syntax can be used to create multiple variables from a dictionary in one step. It’s probably no surprise that there’s a similar syntax for creating multiple variables from an array in a single step. Just like the object destructuring syntax looked very similar to the object literal syntax, the array destructuring syntax looks very similar to the array literal syntax. Like with object destructuring, the big give-away for spotting array destructuring is that it occurs to the left of an assignment operator.

We won’t be going into all the details of this complex new syntax here, but if you’re interested you can get all the details from the [‘Destructuring assignment’ page on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring).

This syntax is much more difficult to describe than to show, so let’s just show it!

```JavaScript
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// create three variables named d1, d2 & d3 in one step
const [d1, d2, d3] = days;
console.log(`d1=${d1}, d2=${d2} & d3=${d3}`);
```

You don’t have to capture all the values, if you only want the first and third you can leave a slot empty:

```JavaScript
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// create two variables, skipping a value
const [d1a, , d3a] = days;
console.log(`d1a=${d1a} & d3a=${d3a}`);
```

You can also use the rest operator (`...`) to capture all the remaining elements into an array:

```JavaScript
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// collect the rest
const [d1b, d2b, ...dRest] = days;
console.log(`d1b=${d1b}, d2b=${d2b} & dRest=${dRest.join('|')}`);
```

A very common use for array destructuring is capturing the results of a regular expression match that contains capture groups. As a reminder, the `.match()` function from the `String` prototype takes a regular expression as an argument, and assuming the string the function is called on matches the RE (and that the RE doesn’t specify the g flag), returns an array where the first element is the entire matching sub-string, followed by all matched capture groups.

As a practical example, let’s make use of the `dollarAmount` RE defined in the global scope of the file `pbs85a.html` from this instalment’s ZIP file:

```JavaScript
// a regular expression for matching dollar amounts
// the first capture group matches the number of dollars
// the second capture group matches the number of cents, if any
var dollarAmountRE = /[$](\d+)(?:[.](\d{2}))?/;
```

This RE matches the symbol `$` followed by one or more digits in the first capture group followed by zero or one occurrences of a non-capturing group consisting of the `.` symbol followed by two digits in the second capture group. In other words, if the RE matches the first capture group will always capture the number of dollars, and if there are cents, they will be captured by the second capture group.

Let’s see this RE in action to see what the `.match()` function actually returns. Firstly, let’s match a dollar amount without any cents:

```JavaScript
console.log("That dress costs $500!!!".match(dollarAmountRE));
// prints: ["$500", "500", undefined]
```

Note we get an array with three elements, the full match, the first capture group, and the second capture group. Since the second capture group was not actually matched, it has the value `undefined`.

Now let’s see what happens when do have some cents:

```JavaScript
console.log("I hate prices like $9.99 because they work 🙁".match(dollarAmountRE));
// prints: ["$9.99", "9", "99"]
```

Again, we get an array with three elements, the full match, the first capture group, and the second capture group.

We can use argument destructuring to extract the dollars and cents into separate variables in a single step:

```JavaScript
const sodaPrice = '$2.99';
const [, sodaDollars, sodaCents] = sodaPrice.match(dollarAmountRE);
console.log(`The soda costs ${sodaDollars} dollars and ${sodaCents} cents.`);
```

Notice the use of the leading comma to ignore the first value in the array returns by the `.match()`. function.

## PBS 83 Challenge Solution

The challenge set at the end of instalment 83 was to use the free exchange rates API at [https://exchangeratesapi.io](http://exchangeratesapi.io) to generate a collection of Bootstrap cards showing the exchange rates between currencies. There had to be at least three cards, each showing the rates for one currency against at least 5 others.

You can find my full sample solution in the folder `pbs83-challengeSolution` in this instalment’s ZIP file.

Before looking at a few smaller things in detail, I want to describe my overall design.

I chose to use the Bootstrap grid to lay out my cards so they could be responsive, and to use a Mustache template embedded directly in the document to render each card. The reason I chose to embed the template rather than loading it from an external file is two-fold: firstly, there’s just one small simple template, and secondly, having the template embedded avoids using AJAX to load a local file, so the example will work when opened directly in a browser from the local file system (i.e. no need for a web server like MAMP).

To facilitate the display of the currency data I built a dictionary named `CURRENCIES` defining the english names, symbols, and icons for each supported currency. The dictionary is indexed by three-letter ISO 4217 currency codes. Rather than hard-coding the currencies to display I chose to define them in globally scoped variables named `DEFAULT_CURRENCIES` (the currencies for my 3 cards), and `DISPLAY_CURRENCIES` (the currencies to display within each card). Both of these variables are arrays of ISO 4217 currency codes.

To generate the HTML for each card I chose to write a stand-alone asynchronous function named `buildCurrencyCard()`. The function takes an ISO 4217 code as its only argument, and returns an HTML string. The function uses AJAX to fetch the exchange rates, combines those downloaded rates with information from the currencies dictionary to build a view object, and then generates the HTML using the embedded Mustache template.

Finally, the document ready handler loops over the currencies defined in the `DEFAULT_CURRENCIES`, calls `buildCurrencyCard()` with each to build an array of promises, and then uses `Promise.all()` to create a single promise for all three HTML snippets. When the promise resolves the three snippets are added into the document.

The first thing I want to highlight is the template’s use of a Mustache section for repeating part of the template multiple times. I.e., I use a section to create a loop in my template. Each card has to display multiple rates, so the repeated section describes how to display a single rate. I’ve highlighted the section within the full template below:

```XHTML
<div  class="col-12 col-md-6 col-lg-4">
  <div class="card m-3">
    <h2 class="card-header h4">
      {{{base.icon}}} {{base.name}}
      <small class="badge badge-primary badge-pill float-right">{{base.code}}</small>
    </h2>
    <ul class="list-group list-group-flush">
      {{#rates}}
      <li class="list-group-item">
        <h3 class="d-inline h6 mr-2 text-secondary">{{code}}</h3>
        {{base.symbol}}1 = {{symbol}}{{rate}}
        <small class="text-muted">{{name}}</small>
      </li>
    {{/rates}}
    </ul>
  </div>
</div>
```

For more on loops within Mustache templates, [see Instalment 73](https://bartificer.net/pbs73).

By using named mustaches the template in effect defines the structure of the expected view. In this case the template expects just two top-level keys, `base`, and `rates`. `base` should be a dictionary defining at least `base.code`, `base.name`, `base.icon` & `base.symbol`. Because it will be used to loop over a section, `rates` must be an array of dictionaries. Each of those dictionaries must defined at least `code`, `name`, `rate` & `symbol`.

I’d like to draw your attention to the fact that all the needed information exists, but not in one place, and not in the required format. The rates come from the ex change rates API, and the rest from the `CURRENCIES` dictionary. Between fetching the exchange rates via AJAX and rendering the card template with Mustache, the `buildCurrencyCard()` function has to generate a view object of the above form. I’ve highlighted the section of the function that does that work below:

```JavaScript
async function buildCurrencyCard(curCode){
  // validate the currency code
  curCode = String(curCode).toUpperCase();
  if(!curCode.match(/^[A-Z]{3}$/)){
    throw new TypeError(`Invalid country code: ${curCode}`);
  }
		
  // fetch the data for the currency
  const curData = await $.ajax({ // could throw Error
    url: CURRENCY_API_URL,
    method: 'GET',
    cache: false,
    data: {
      base: curCode
    }
  });
  console.debug(`received currency data for '${curCode}': `, curData);
		
  // build the view for the card
  const cardView = {
    base: {
      code: curData.base,
      ...CURRENCIES[curData.base]
    },
    rates: []
  };
  for(const cur of DISPLAY_CURRENCIES){
    if(cur === curData.base) continue; // skip self
    cardView.rates.push({
      code: cur,
      rate: curData.rates[cur],
      ...CURRENCIES[cur]
    });
  }
  console.debug('generated view:', cardView);
		
  // generate and return the HTML
  return Mustache.render(CURRENCY_CARD_TPL, cardView);
}
```

To help you understand what the code is doing I added `console.debug()` statement to print both the raw data from the API and the final view object to the JavaScript console.

Notice the use of the spread operator (`...`) to import multiple keys into a dictionary at once.

## A Challenge

Using your own solution to the challenge set in [PBS 83](https://bartificer.net/pbs83) (the currency converter), or my sample solution, start the process of turning this static page into a simple web app by adding the following interactive features:

1.  The ability for users to dismiss a card by clicking on some kind of close button.
2.  The ability for users to add new cards for currencies of their choice using the UI of your choice.

## Final Thoughts

We’ve now looked at the two most obvious hats JavaScript objects wear, but there are plenty of hats left on the proverbial Javascript object hat stand! JavaScript functions are also objects, as are JavaScript regular expressions, and in some situations, so are Javascript strings. We’ll examine all these hats in upcoming instalments in the lead-up to re-visiting the biggest hat of all — prototyped objects, or instances of prototypes/classes.