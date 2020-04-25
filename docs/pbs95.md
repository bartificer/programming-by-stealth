# PBS 94 of X — Better JavaScript Class Attributes

This is the third instalment of our step-by-step introduction to Object Oriented (OO) programming, and OO in JavaScript in particular. We started by looking at the foundation upon which OO is built — encapsulation. Encapsulation allows us to combine all the data and functions related to a concept of thing into a single object.  In the previous instalment we looked at how we can uses classes to construct arbitrarily many similar objects. In effect, a class represents a concept of thing in the abstract, and each object constructed by that class is a representation of a concrete example of the concept or things. Specifically, we created a class to represent imaginary currencies, and we used it to built instances of that class to represent the Ferengi Bar of Gold-pressed Latinum and the Quatloo from Star Trek. We focused almost entirely on the most important function within any class — the constructor.

We ended the previous instalment by demonstrating how our current, simple, implementation of data attributes allows users of our classes to by-pass all the data validation we added to our constructors. In this instalment we'll address that using a very powerful JavaScript feature — *getters and setters*.

## The Problem to be Solved

The final implementation of the `ImaginaryCurrency` class from the previous instalment (`ImaginaryCurrency4.js`) implements a best-practices constructor that supports multiple signatures, optional arguments with default values, argument coercion when possible, and error handling when invalid values are specified. As we demonstrated in the previous instalment, this constructor is both flexible and robust.

We can demonstrate the flexibility using the JavaScript console in the file `pbs94d.html` from the previous instalment:

```js
// call the constructor without any arguments
const genericImaginaryCurrency = new ImaginaryCurrency();
$OUT_HTML.append(genericImaginaryCurrency.describeHTML());

// call the constructor specifying only 2 most common attributes
const monopolyDollar = new ImaginaryCurrency(
    'Monopoly Dollar',
    'the currency from the board game <a href="https://en.wikipedia.org/wiki/Monopoly_(game)" target="_blank" rel="noopener">Monopoly</a>'
);
$OUT_HTML.append(monopolyDollar.describeHTML());

// call the constructor specifying some attributes
const buck = new ImaginaryCurrency({
    name: 'Buck',
    descriptionHTML: 'the US Dollar really',
    symbolHTML: '💵'
});
$OUT_HTML.append(buck.describeHTML());

// call the constructor specifying all values
const iou = new ImaginaryCurrency({
    name: 'IOU',
    descriptionHTML: 'money borrowed with every good intention to replay it in the vague future',
    symbol: '💸',
    symbolHTML: '<i class="fas fa-comment-dollar mx-1" title="$" aria-hidden></i><span class="sr-only">$</span></i>',
    numDecimalPlaces: 1
});
$OUT_HTML.append(iou.describeHTML());
```

We can also demonstrate the constructor's robustness:

```js
// numbers are coerced when posible
const bitcoin = new ImaginaryCurrency({
    name: 'Bitcoin',
    descriptionHTML: 'the leading crypto-currency',
    symbol: 'BTC',
    symbolHTML: '<i class="fab fa-bitcoin mx-1" title="BTC" aria-hidden></i><span class="sr-only">BTC</span></i>',
    numDecimalPlaces: "8" // string not number
});
$OUT_HTML.append(bitcoin.describeHTML());
const mathGeekDollar = new ImaginaryCurrency({
    name: 'Math Geek Dollar',
    descriptionHTML: 'the US Dollar as used by math geeks',
    numDecimalPlaces: Math.PI // decimal number not integer
});
$OUT_HTML.append(mathGeekDollar.describeHTML());

// errors are thrown when un-coerceably-invalid values are passed
const imaginaryDollar = new ImaginaryCurrency({
	numDecimalPlaces: '√-1'
});
// throws TypeError since '√-1' is a string that doesn't parseInt()
// message: 'if passed, details.numDecimalPlaces must be an integer greater than or equal to one'
const negativeDollar = new ImaginaryCurrency({
	numDecimalPlaces: -2
});
// throws RangeError since -2 is a number, but not valid
// message: 'details.numDecimalPlaces cannot be less than zero'
```

Clearly, the constructor is doing a good job of protecting the integrity of the data attributes it adds into the instance objects it constructs.

However, if we access the attributes directly, this version of the class produces instances that are powerless to protect themselves from invalid changes to attribute values:

```js
const evilDollar = new ImaginaryCurrency('Evil Dollar');
evilDollar.numDecimalPlaces = '😈'; // invalid value!!!
$OUT_HTML.append(evilDollar.describeHTML());
$OUT_HTML.append(`PI as evil dollars is ${evilDollar.asHTML(Math.PI)}`);
```

The constructor would never have let us set the number of decimal places to an emoji, but we could easily bypass that protection by simply setting the number of decimal places after the constructor has finished creating the instance. As things stand we can protect the initial values of our attributes, but they're defenceless after that. **We need to give our attributes perpetual protection from invalid values!**

## *Getters & Setters* — Functions in Disguise!

The concept of *getters & setters* is not unique to JavaScript, but it's also far from ubiquitous. Some languages have them, but many, including PHP,  don't.

