# PBS 98 of X — Building with Classes Part 1: *Has-A*

I had promised that this instalment would focus on the very important concept of *inheritance*, but as I started to try to write the notes I realised we need to build some more context before we're ready for that final piece of the object orientation puzzle.

Both this instalment and the next, when we will finally meet inheritance, share a theme — using individual classes as building blocks for larger abstractions. We've said that classes allow us to represent things or concepts in code, well, things and concepts interact with each other to form larger systems, and so can classes!

## Instalment Resources

This instalment uses 3 example files:

* [Download ZIP File](https://rawcdn.githack.com/bartificer/programming-by-stealth/cb5c0b3c7bd1ee2e359015033aa9b707191c8841/instalmentZips/pbs98.zip)
* [View source code online at GitHub](https://github.com/bartificer/programming-by-stealth/tree/master/instalmentResources/pbs98)
* View the HTML file in your browser:
	* [`pbs98.html`](https://rawcdn.githack.com/bartificer/programming-by-stealth/cb5c0b3c7bd1ee2e359015033aa9b707191c8841/instalmentResources/pbs98/pbs98.html)

## Matching Podcast Episode

Listen along to this instalment on [episode 642 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2020/05/ccatp-642/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_06_13.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_06_13.mp3" >Download the MP3</a>

## Building with Classes

Regardless of the app you're building, the chances are high it will require representing more than a single concept or thing. If you're writing a note-taking app you may only need a few classes — perhaps one to represent notes and one to represent folders. But, if you're writing something bigger like a game you're very likely to need tens, or even hundreds, of classes — just think about all the characters, things, and concepts that fill a virtual world!

In the object-oriented world view classes can be related in of two ways.

Firstly, classes can have instances of another classes as properties — a hypothetical class representing a forest would definitely contain some instances of a class representing trees! In addition it would probably contain some instances of a class representing wild flowers too, and maybe even some instances of a class representing bears! Many programmers refer to this kind of a relationship as a *has-a* relationship. This the type of relationship we'll be focusing on in this instalment.

Secondly, classes can be more specific versions of other classes. A hypothetical class to represent Poodles could be a more specific version of a class to represent dogs in general. Many programmers call this an *is-a* relationship, and those will be the focus of the next instalment. As you may have guessed, the mechanism for implementing *is-a* relationships is inheritance.

## *has-a* Relationships are Simple

The *has-a* relationship really is very simple to describe — instances of one class have instances of another as the values for one or more of their instance data attributes. Instead of the values of instancedata attributes being booleans or numbers or strings, they are instances of other classes.

There is no new syntax to learn, it really is just as simple as assigning the value of a data attribute to an instance object.

I could finish this instalment here, but instead, let's spend the remainder of this instalment cementing our recently acquired understanding of classes in general, and illustrating some *has-a* relationships,

## A Worked Example — Currency Amounts

In this example we'll build a suite of classes to represent amounts of money in specific currencies.

We'll model this requirement using three interrelated concepts.  *Amounts of money* have a given *currency*, and a *currency* has one or two *denominations*. For example, the sum of money $5.45 is in *US Dollars*, which have two denominations, *Dollars* and *Cents*. We'll write three classes to represent these three concepts — `MonetaryAmount`, `Currency`, and `Denomination`.

There will be two *has-a* relationships between our classes — monetary amounts have a currency, and currencies have one or two denominations.

Note that some currencies, both real and imagined, have only a primary denomination, they do not have anything analogous to Cents. A good real-world example of this is the Japanese Yen.

You'll find the full code for the worked example in the file `money.js`, and you can interact with this file via the JavaScript console on the file `pbs98.html`.

As you can see, the code in `money.js` is long! The intention is not to go through every line of the file in detail, but instead, to focus on a few highlights that serve to illustrate important concepts. I commented the code heavily in the hope that it would make sense by itself.

Note that the code in `money.js` assumes that two open-source libraries have been loaded before loading `money.js`:

1. The [is.js](https://is.js.org) type-checking library.
2. The [numeral.js](http://numeraljs.com) number formatting library.

## Where to Begin?

When working on a programming task like this, one question you may well have is where to begin? What should be your starting point? Simple — start with the most fundamental building blocks. In this case amounts have currencies which have denominations, so the denominations are the most fundamental block. Until you've defined those you can't define currencies, and until you've defined currencies you can't define monetary amounts.

## Step 1 — The `Denomination` Class

For the most part this is a very simple little class. It has no class data attributes, no class function, and not even any instance functions. It simply has some getters and setters which work together to define a handful of instance data attributes, and a constructor.

The three true properties are the denomination's symbol (e.g. `'p'`), singular name (e.g. `'Penny'`), and plural name (e.g. `'Pennies'`).

As a reminder of how getters and setters can be used together with a private instance data attribute to create a single property with data validation, let's look at the getter and setter for the symbol property:

```js
get symbol(){
  return this._symbol;
}
	
set symbol(s){
  if(is.not.string(s)){
    throw new TypeError('symbol must be a string');
  }
  if(is.empty(s)){
    throw new RangeError('symbol cannot be empty');
  }
  this._symbol = s;
}
```

The actual information is stored in this private instance data attribute `_symbol`. The getter simply returns that value of that private instance attribute, while the setter first does some data validation, and only stores values that meet the desired constraints into the private variables. The setter throws an error if it's unhappy.

These three elements together create what appears to be a single instance data attribute to users of the class. We can illustrate this on the JavaScript console:

```js
const penny = new Denomination('p', 'Penny', 'Pennies');
console.log(penny.symbol); // logs 'p'
penny.symbol = 'ƥ';
console.log(penny.symbol); // logs 'ƥ'
penny.symbol = new Date(); // throws TypeError
```

This class also provides an opportunity to illustrate one of the more powerful things getters and setters can do. Each pair of getters and setters does not have to have a corresponding private variable, multiple pairs of getters and setters can interact with the same private variable.

In this case I chose to add a pair of getters and setters to create a property named `name` that is simply an alias for the singular name:

```js
get name(){
  return this.singularName;
}

set name(n){
  this.singularName = n; // could throw error
}
```
Note that my code does not directly interact with any private variable, instead, it interacts directly with the instance data attribute `singularName` which is implemented using a pair of getters and setters. In effect we have one getter calling another, and one setter calling another.

You can see this aliased attribute in action using the JavaScript console:

```js
const den1 = new Denomination();
console.log(`${den1.name}, ${den1.singularName}`); // Coin, Coin
den1.singularName = 'Hoonyaker';
console.log(`${den1.name}, ${den1.singularName}`); // Hoonyaker, Hoonyaker
den1.name = 'Squid';
console.log(`${den1.name}, ${den1.singularName}`); // Squid, Squid
den1.name = new Date(); // throws TypeError
```

Finally, we can use this simple class to remind ourselves of some best practices for constructors.

As a general rule, constructors should work when no arguments are passed at all, and should use sane defaults for each of the instance data attributes. You should also try to order the optional arguments by likelihood that users want to specify a custom value for them.

```js
constructor(symbol, singularName, pluralName){
  if(!symbol) symbol = '#';
  this.symbol = symbol; // could throw error
  if(!singularName) singularName = 'Coin';
  this.singularName = singularName; // could throw error
  if(!pluralName) pluralName = `${this.singularName}s`;
  this.pluralName = pluralName; // could throw error
}
```

Notice that I chose to order my arguments symbol, then singular name, then plural name. The defaults for the symbol and singular name are very much by-the-book, but the default for the plural name is a little more clever — it defaults to the singular name with an `'s'` appended.

Also note that constructors should avoid duplicating validation code needlessly. Instead, they should leverage the class's setters which should already be doing all the needed validation. Finally, notice that I like to leave comments to my future self reminding me that calls to the setters could throw errors.

We can now see this constructor in action on the JavaScript console:

```js
const defaultDen = new Denomination();
console.log(`${defaultDen.symbol}, ${defaultDen.singularName}, ${defaultDen.pluralName}`);
// above logs: #, Coin, Coins

const symDen = new Denomination('¢');
console.log(`${symDen.symbol}, ${symDen.singularName}, ${symDen.pluralName}`);
// above logs: ¢, Coin, Coins

const cent = new Denomination('¢', 'Cent');
console.log(`${cent.symbol}, ${cent.singularName}, ${cent.pluralName}`);
// above logs: ¢, Cent, Cents

const penny = new Denomination('p', 'Penny', 'Pennies');
console.log(`${penny.symbol}, ${penny.singularName}, ${penny.pluralName}`);
// above logs: p, Penny, Pennies
```

## Step 2 — The `Currency` Class

Now that we have defined the concept of a denomination with our `Denomination` class we can move on to the `Currency` class. This is the most complex class in the suite. It has class (AKA static) functions, many instance data attributes implemented with getters and setters, a constructor, and many instance functions.

I want to use a pair of similar functions to illustrate when something should be a class function, and when it should be an instance function. Functions that don't interact with any instance data attributes **should** be class functions, functions that do **must** be instance functions, or they can't work!

In this case we have a function that takes a number and converts it to a human-friendly integer string, i.e. something like `4567.89` to `4,568`. This function does not interact with any instance data attributes, so it's implemented as a class function:

```js
static amountAsHumanInt(amount){
  amount = this.coerceAmount(amount);
  return numeral(amount).format('0,0');
}
```

We can see this function in action on the JavaScript console:

```js
console.log(Currency.amountAsHumanInt(1234.56)); // 1,235
```

Notice that because it is a class function it's the class that appears to the left of the dot operator.

Also notice that our `amountAsHumanInt()` class function calls another class function, `coerceAmount()`. This works because within class functions the keyword `this` is a reference to the class the functions belong to.

Because currencies can use different numbers of decimal places, the code to render an amount as a human-friendly decimal number must check the number of decimal places to perform its function, so it **must** be an instance function:

```js
amountAsHumanFloat(amount){
  amount = this.constructor.coerceAmount(amount); // could throw error
		
  // short-curcuit the case where there is no secondary denomination
  if(this.subDenominationOrder === 0){
    return this.constructor.amountAsHumanInt(amount);
  }
		
  // build a format string with the appropriate number of decimal places
  const formatString = `0,0[.]${'0'.repeat(this.subDenominationOrder)}`;
		
  // format and return
  return numeral(amount).format(formatString);
}
```

Notice that this instance function calls the class function `coerceAmount()` too, but because that line of code is within an instance function, `this` is not a reference to the class, but a reference to the instance on which the function was called. To reach up to the class we need to use `this.constructor`.

It's also worth noting that it's very common to implement validation and coercion functions as class functions.

Next I want to draw your attention to our first example of a *has-a* relationship. All currencies have a primary denomination, so there is a getter and setter which combined with a private variable provide an instance data attribute named `denomination` to represent that primary denomination. The code looks utterly unremarkable:

```js
get denomination(){
  return this._denomination;
}
	
set denomination(d){
  if(!(d instanceof Denomination)){
    throw new TypeError('denomination must be an instance of the class Denomination');
  }
  this._denomination = d;
}
```

The only thing that makes this attribute in any way remarkable is that it's value must be an instance of the class `Denomination`. When I said there was no special syntax for *has-a* relationships I really wasn't kidding 😉

Note the use of the `instanceof` operator for data validation (see [instalment 94](https://bartificer.net/pbs94) for more).

The other *has-a* relationship is the optional secondary denomination (the Cent to the Dollar as it were) which I chose to name `subDenomination`. This instance data attribute is related to the number of decimal places (stored as an attribute named `subDenominationOrder` for mathematical reasons). If there is no secondary denomination, like with the Japanese Yen, then the number of decimal places must be zero. I also chose to implement there not being a secondary denomination by setting `subDenomination` to `null`.

Because we have two related attributes, both of their setters must call each other:

```js
set subDenomination(sd){
  if(is.null(sd) || is.undefined(sd)){
      delete this._subDenomination;
      this._subDenominationOrder = 0;
  }
  if(!(sd instanceof Denomination)){
      throw new TypeError('subDenomination must be an instance of the class Denomination');
  }
  this._subDenomination = sd;
}

// …

set subDenominationOrder(sdo){
  sdo = parseInt(sdo);
  if(is.nan(sdo) || is.not.number(sdo)){
    throw new TypeError('subDenominationOrder must be a whole number greater than or equal to zero');
  }
  if(sdo < 0){
    throw new RangeError("subDomainOrder can't be negative");
  }
  this._subDenominationOrder = sdo;
  if(sdo === 0){
    this._subDenomination = null;
  }
}
```

Another interesting pair of instance data attributes is `real` and `imaginary`. Clearly, these are related properties, any currency that is imaginary is not real, and *vice-versa*. The best way to implement this is with a single private variable and one pair of getters and setters that invert the value as they get and set it:

```js
get imaginary(){
  return this._imaginary;
}
	
set imaginary(i){
  this._imaginary = i ? true : false;
}
	
get real(){
  return !this._imaginary;
}
	
set real(r){
  this._imaginary = r ? false : true;
}
```

Because this class has many attributes, it serves as a good reminder that no function should ever take more than 5 arguments. When you need more, replace the individual arguments with a single dictionary supporting as many keys are you wish.

Other than the class functions, instance data attributes, and constructor the class also provides some instance functions, one for splitting an amount into a whole number of each denomination (rounding as needed), and a collection of functions for converting amounts into strings of various formats. All these functions are very much by-the-book.

We can see this class in action on the JavaScript console:

```js
const usd = new Currency({
	name: 'US Dollar',
	denomination: new Denomination('$', 'Dollar'),
	subDenomination: new Denomination('¢', 'Cent')
});
console.log(usd.splitAmount(1.234)); // [1, 23]
console.log(usd.amountAsString(1.234)); // $1.23
console.log(usd.amountAsHumanString(1.234)); // $1 & ¢23
console.log(usd.amountAsEnglishString(1.234)); // 1 Dollar and 23 Cents

const yen = new Currency({
	name: 'Japanese Yen',
	denomination: new Denomination('¥', 'Yen', 'Yen'),
	subDenominationOrder: 0
});
console.log(yen.amountAsEnglishString(2.3)); // 2 Yen
```

Note that the singular and plural of Yen is Yen, hence passing it to the `Denomination` constructor twice.

## Step 3 — the `MonetaryAmount` Class

This final class is much simpler than the `Currency` class. Most of the work has actually been done already with the `Currency` class.

The `MonetaryAmount` class has no class data attributes or functions. It has just two instance data attributes, `amount` & `currency` — the second being another example of a *has-a* relationship.

While the class does implement a lot of instance functions, most of them are just very simple wrappers around similar functions in the `Currency` class. A good example of this is the `.asEnglishString()` instance function. This simply calls the currency's instance `.amountAsEnglishString()` function with the amount:

```js
asEnglishString(){
  return this.currency.amountAsEnglishString(this.amount);
}
```

I do however want to take a moment to look at the `.add()` instance function because it serves as a nice example of a function that accepts more than one argument signature. The function is written so that the amount to be added to the current amount can be passed in one of two ways — as a `CurrencyAmount` object with the same currency, or as a number.  This means that the function has to decide how to process the argument by testing it to figure out what it is first:

```js
add(amount){
  if(amount instanceof MonetaryAmount){
    if(this.currency !== amount.currency){
      throw new RangeError('the amount to be added must be in the same currency as the amount');
    }
    this.amount += amount.amount;
  }else{
    this.amount += Currency.coerceAmount(amount); // could throw error
  }
		
  // return a reference to self to facilitate function chaining
  return this;
}
```

We can use the JavaScript console to illustrate both possible uses of the function:

```js
const euro = new Currency({
  name: 'Euro',
  denomination: new Denomination('€', 'Euro')
});
const bartMoney = new MonetaryAmount(4, euro);
console.log(bartMoney.asString()); // €4
bartMoney.add(2);
console.log(bartMoney.asString()); // €6
const donation = new MonetaryAmount(10, euro);
bartMoney.add(donation);
console.log(bartMoney.asString()); // €16
```

One final thing to note about the `.add()` instance function is that it facilitates function chaining by returning a reference to itself, i.e. by returning `this`. You see this approach used heavily in many common open-source APIs, including jQuery.

We can see function chaining in action in the JavaScript console:

```js
const monopoly = new Currency({
  name: 'MonopolyMoney',
  subDenominationOrder: 0, // monopoly dollars have no cents!
  imaginary: true
});
const allisonMoney = new MonetaryAmount(200, monopoly);
console.log(allisonMoney.asString()); // $200
console.log(allisonMoney.add(100).asString()); // $300
```

## Final Thoughts

Hopefully this worked example has illustrated the power of *has-a* relationships, and, cemented concepts we've recently encountered like instance & class data attributes & functions, constructors, and getters & setters.

We're now ready to learn about inheritance, and the power of *is-a* relationships in the next instalment.

Note that with the addition of this un-planned instalment, you all have an extra two weeks to work on your solutions to the challenge set at the end of [instalment 96](https://bartificer.net/pbs96) 🙂