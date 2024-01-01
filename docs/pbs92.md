# PBS 92 of X — Currency Grid Solution

In this instalment we'll be describing my sample solution to the challenge set at the end of [PBS 89](https://bartificer.net/pbs89).

## Matching Podcast Episode

Listen along to this instalment on [episode 630 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2020/03/ccatp-630/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_03_14.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_03_14.mp3" >Download the MP3</a>

## The Challenge

The challenge was to start with the currency conversion web app we've been developing for quite a few months now, and add an entire new interface to it.

For reference, this is the starting point I used:

* [See my **starting point** functioning — rawcdn.githack.com/…](https://rawcdn.githack.com/bartificer/programming-by-stealth/3c2a630d78790cfa45cdc38a03ee0e9911f07c66/instalmentResources/pbs89/pbs88-challengeSolution/index.html)
* [View the source code for my starting point — github.com/…](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentResources/pbs89/pbs88-challengeSolution/index.html)

The app had been built around the concept of *currency cards* where each card showed the conversions from one base currency to a number of other target currencies. Users could add or remove cards as they wished, and enable or disable target currencies on the cards.

This is one common approach to currency conversion, and it caters best to people who are interested in seeing what a specific currency is doing against a number of other currencies.

A different common approach is a grid showing the conversion rates between multiple currencies all at once. You read your base currency from one axis, and your target currency along the other, and where they meet, you get the conversion rate between the base and the target currencies.

The challenge was to expand the web app so it supports both approaches, allowing users to toggle between them as they desire. The underlying information is the same in each view, but the presentation is very different.

The motivations behind the challenge were two-fold. The most straightforward motivation was to give you all an opportunity to refresh your knowledge of HTML and Bootstrap tables. The second, more ulterior motive, was to illustrate the point that adding a previously un-imagined new feature to an existing app is often more difficult than creating a whole new app! It would have been much easier to create a separate web app to show a currency grid, but it sounds easier to just add a grid view into your existing app!

For context — it took me three times as long to get my app ready for the grid that it took me to implement the grid!

Here's my sample solution so you can see it in action and view the code:

* [See **my sample solution** functioning — rawcdn.githack.com/…](https://rawcdn.githack.com/bartificer/programming-by-stealth/0c3f8a9dd99477c60fab31694756691e22610024/instalmentResources/pbs92/pbs89-challengeSolution/index.html)
* [View the source code for my sample solution — github.com/…](https://github.com/bartificer/programming-by-stealth/tree/master/instalmentResources/pbs92/pbs89-challengeSolution)
* [Download my sample solution — rawcdn.githack.com/…](https://rawcdn.githack.com/bartificer/programming-by-stealth/0c3f8a9dd99477c60fab31694756691e22610024/instalmentZips/pbs92.zip)

## Refactoring

Many of us may know the term *refactoring* from our maths classes, but that's not what we're going to talk about here. Software engineers have re-cycled the term to describe a common programming task. Sometimes you need to **change how code does something without changing what it does**, and those kinds of tasks are referred to as **refactoring**.

In this case I needed to retain all the user-facing functionality of my existing card view while completely re-designing the underlying implementation to enable the addition of the grid view.

### From Fetching On-demand to Pre-loading

My cards app fetched data from the currency conversion web service when the user added a card. No data was fetched until a card was loaded, and a separate request was made for each card. That model works great for cards, but you can't generate a useful grid from incomplete data!

I needed to completely re-design my app's flow to pre-fetch all needed currency data, then render all the cards, but keep all but the default cards hidden, and then hide and show cards at the user's request.

As Allison demonstrated in her solution to the initial currency card challenge, making multiple requests was never actually needed! Once you've fetched the rates for one currency you actually have all you need to calculate the rates between any two arbitrary currencies!

So, in preparation for adding my grid I decided to re-write my underlying code to pre-fetch the conversions for one master currency (being a good European I chose the Euro), use that data to calculate all other needed rates, and then generate all my cards from that data. I would then replace the existing event handlers which fetched data for each currency on demand with replaced them with event handlers that simply hide and show the pre-generated cards as requested.

From a user's point of view the only change would be that cards loaded instantly instead of starting as a spinner and then being filled in when the associated AJAX request completed. With fast modern internet the difference would be almost unnoticeable, but over a slow connection it would make the app behave in a more user-friendly way.

#### Simple Arithmetic to Replace Multiple AJAX Calls

To get from a single set of rates to the complete set of all possible rates involves two pieces of simple arithmetic.

Firstly, **the rate from currency B to currency A is the reciprocal of the rate from currency A to Currency B**. If you're like me, and your high-school arithmetic is a little rusty, the reciprocal of A is one divided by A. So, if we know the rate from Euro to Dollar is `1.11`, then the rate from Dollar to Euro is `1 / 1.11`, or approximately `0.9`.

Given that our starting point is a list of all rates from a master currency to every other supported currency, we can now calculate the rate from every supported currency to our master currency.

Secondly, **rates can be multiplied**. If you know the rate from currency A to currency C, and from currency C to currency B, then the rate from A to B is  simply the product of those two rates, i.e `AtoB = AtoC * CtoB`.

As a practical example, let's assume our master currency is the Euro, and that the web service returned a rate of `1.11` from Euro to US Dollar, and `0.89` from Euro to British Pound. We can get the rate from Dollar to Pound by first taking the reciprocal of the rate from Euro to Dollar to get the rate from Dollar to Euro, and then multiply that by the rate from Euro to Pound . i.e. `(1 / 1.11) * 0.89`, which gives a rate of `0.8` British Pounds per US Dollar.

That's quit difficult to describe clearly in English, but since it's just basic arithmetic it's actually quite easy to express in JavaScript!

While refactoring my code I decided to break the loading of the rates out into a separate function which I named `loadCurrencyRates()`. That function makes an AJAX call to the currency conversion web service requesting the rates for the Euro against all supported currencies. It then does some validation on that data and stores those rates. Then it applies the maths described above to calculate all the rates needed to build the cards (and later the grid).

For completeness, this is the full function:

```js
/**
 * Load the exchange rates for all currencies by loading the rates for one
 * currency and then inverting them.
 *
 * The rates are injected into the CURRENCIES data structure.
 *
 * @throws {RangeError} A Range Error is thrown if the Euro data is missing any expected rates.
 */
async function loadCurrencyRates(){
	const eurData = await $.ajax({ // could throw Error
		url: CURRENCY_API_URL,
		method: 'GET',
		cache: false,
		data: {
			base: 'EUR'
		}
	});
	console.debug(`received Euro exchange rates: `, eurData);
	
	// store the Euro rates and throw an error if any expected currency is missing
	CURRENCIES.EUR.rates = {};
	for(const toCur of SORTED_CURRENCY_CODES){
		// deal with the special case of the Euro mapping to itself
		if(toCur === 'EUR'){
			// store the Euro to Euro rate
			CURRENCIES.EUR.rates.EUR = 1;
		}else{
			// store the rate or throw an error
			if(eurData.rates[toCur]){
				CURRENCIES.EUR.rates[toCur] = eurData.rates[toCur];
			}else{
				throw RangeError(`no data received for currency '${toCur}'`);
			}
		}
	};
	
	// generate the rates for all other currencies
	for(const fromCode of SORTED_CURRENCY_CODES){
		// skip the Euro
		if(fromCode === 'EUR') continue;
		
		// calculate the rate to Euro by inverting the rate from Euro
		const toEuro = 1 / eurData.rates[fromCode];
		CURRENCIES[fromCode].rates = { EUR: toEuro};
		for(const toCode of SORTED_CURRENCY_CODES){
			// skip the Euro
			if(toCode === 'EUR') continue;
			
			// check for self
			if(fromCode === toCode){
				CURRENCIES[fromCode].rates[toCode] = 1;
			}else{
				const rate = toEuro * eurData.rates[toCode];
				CURRENCIES[fromCode].rates[toCode] = rate;
			}
		}
	}

	console.debug('Finished currency rate conversions');
}
```

If we ignore the AJAX request, the various checks to detect conversions to self and from Euro, and the storage of the calculated rates into the `CURRENCIES` data structure, we are left with the following simple lines implementing the actual math:

```js
// generate the rates for all other currencies
for(const fromCode of SORTED_CURRENCY_CODES){
	// calculate the rate to Euro by inverting the rate from Euro
	const toEuro = 1 / eurData.rates[fromCode];
	for(const toCode of SORTED_CURRENCY_CODES){
		const rate = toEuro * eurData.rates[toCode];
	}
}
```

It really is just a simple division followed by a simple multiplication!

### Reorganising is a Form of Refactoring

Simply re-organising the same code into a more organised structure is a very important type of refactoring.

Code that starts off doing one simple task is likely to be organised in a very straight forward way. It could well be entirely embedded within the app's HTML file, and most if not all of the logic could well be contained within the event handlers.

The former was definitely true for my starting point for this challenge, and the latter was a little bit true. I did have some functions, but I also had a lot of logic embedded directly within event handlers.

I made the judgement that my code had evolved in complexity to the point that it needed to be re-organised before it could efficiently be expanded. The efficiency here is not in terms of computer CPU or RAM, but clarity, and hence developer sanity — in other words *future Bart* needed a helping hand from *present Bart* 🙂

#### Splitting Out the JavaScript

The first thing I did was take the JavaScript out of the HTML file and move it into a pair of separate JavaScript files which I then included into the HTML using `<script>` tags with an `src` attribute. I chose to move the currencies data structure into one file, and all the rest of the JavaScript into another.

My logic was simple — I wanted to be able to use tabs within my code editor to quickly jump between the HTML templates in the HTML file, the currencies data structure in `currencyData.js`, and the JavaScript that actually implements the app's functionality in `index.js`. Switching tabs is just so much quicker and easier than scrolling up and down, so this simple moving around of the code would make my life that little bit easier while working to add the grid.

#### Functions for Everything

The next step I chose to take was to break the long chunks of code in my event handlers into well named functions. This makes the event handlers much easier to read, and potentially facilitates code-reuse.

To illustrate the legibility concept, let's look at my finished input handler for the toggles for turning on or off currencies:

```js
// add event handlers to all the toggles and trigger them to get the
// inital rendering right
$('input[type="checkbox"]', $currencySelectionForm).on('input', function(){
	// get a reference to a jQuery object representing the toggle
	const $toggle = $(this);
	
	// get the currency the toggle controls
	const curCode = $toggle.val();
	
	// save the state to the global variable
	DISPLAY_CURRENCIES[curCode] = $toggle.prop('checked') ? true : false;
	
	// update the rendering for the currency in all cards and in the grid
	if(DISPLAY_CURRENCIES[curCode]){
		showCurrencyCardConversions(curCode);
		showGridCurrency(curCode);
	}else{
		hideCurrencyCardConversions(curCode);
		hideGridCurrency(curCode);
	}
	
	// update the rates show/hide UI
	updateRatesUI();
}).trigger('input');
```

This event handler does a lot of work, but because that work has been broken down into clearly named functions, the code within the event handler is so clear as to be almost self-documenting!

As a practical example of functions facilitating code re-use, consider the function `assertCurrencyCode()`. As I was breaking the code into functions I very quickly noticed a pattern, many of these functions expected a three-letter currency code as an argument. Since I believe in defensive programming I consider it important to validate all input to functions. Copy-and-pasting the same validation code over and over again is clearly not a good solution, so I wrote a function to do that work, and named it `assertCurrencyCode()`.

## Coercion & Assertion

My `assertCurrencyCode()` function serves as a good illustration of two common ideas in software engineering — assertions and coercions. This function implements a common *design pattern* that ensures functions are operating on valid data while being as forgiving as possible.

You can think of data validation as having two obvious possible extreme approaches — you can simply not bother with any validation and assume all the data is good and write your code accordingly, or, you can enforce your assumptions with rigorous tests and throw an error if anything is any way not as demanded.

Neither of these extremes is optimal, though I would argue that over-zealous validation is a lot better than no validation at all!

But, we don't need to be extremists — there is a third way!

We can start by trying to *coerce* invalid values into valid value, and then, only of that fails, throw an error.

A simple example of this approach would be a function that returns the reciprocal of a number. The code wants a number as the argument, so let's implement the function with extremist validation:

```js
function reciprocal(n){
  if(typeof n !== 'number') throw new TypeError('must pass a number!');
  return 1/n;
}
```

That's definitely easy to write, and very clear. It also works as expected when you follow the rules:

```js
console.log(reciprocal(42)); // 0.023809523809523808
```

And, it deals with obvious errors appropriately:

```js
console.log(reciprocal('💩')); // throws a TypeError
```

But, the function also fails at times when it really shouldn't:

```js
console.log(reciprocal('42')); // throws a TypeError
```

Sure, the string `'42'` is not technically a number, but it could be trivially converted to one, so why throw an error? That's just mean 🙂

Let's re-write this function with a coercion to avoid unnecessary meanness:

```js
function reciprocal(n){
	nNum = Number(n); // will return a number or NaN
	if(isNaN(nNum)) throw new TypeError('must pass a number!');
	return 1/nNum;
}
```

This version of the function still works as expected with perfect inputs and garbage inputs:

```js
console.log(reciprocal(42)); // 0.023809523809523808
console.log(reciprocal('💩')); // throws a TypeError
```

But it now deals with numeric strings properly too:

```js
console.log(reciprocal('42')); // 0.023809523809523808
```

The other concept is *assertion*. This is where you throw an error when something that must be true isn't.

Since I needed to validate three-letter currency codes over an over again, I chose to write a validation function that would coerce when possible, and behave as an assertion when coercion failed.

For context, a country code is only valid if both of the following are true:

1. The value is a three-letter upper-case string.
2. The string corresponds to the ISO 4217 code for one of the currencies supported by my app.

Here's my code for this validation function:

```js
/**
 * Check that a given value is a valid and supported 3-digit ISO 4217 currency
 * codes. Invalid values will throw an error.
 *
 * This function will coerce values by converting to upper case before testing,
 * and return that coerced version.
 * 
 * @param {*} val — the value to test.
 * @return {string} The original string forced to upper case.
 * @throws {TypeError} A Type Error is thrown if the value is not a string.
 * @throws {RangeError} A Range Error is thrown if the value is a string but
 * not a valid and supported code.
 */
function assertCurrencyCode(val){
	// if we didn't get a string, throw a type error
	if(typeof val !== 'string') throw new TypeError(`invalid country code, must be a string: '${val}'`);
	
	// force the string to upper case
	val = val.toUpperCase();
	
	// make sure the string is a key in the currencies database
	if(!CURRENCIES[val]) throw new RangeError(`invalid or un-supported country code: '${val}'`);
	
	// if we got here, all is well, return the upper-cased string
	return val;	
}
```

As you can see, nearly valid values like `'eur'` get converted to `'EUR'` without an error being thrown, but invalid values result in an error being thrown. In other words, **the function coerces when it can, and asserts when it must**.

Because the function could coerce the value, it needs to be used with the assignment operator. Here's an example of the function in use:

```js
/**
 * Get a jQuery object representing the column for a given currency in the grid.
 * This will be a single jQuery object representing a th and many tds.
 * 
 * @param {string} curCode
 * @return {jQuery}
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function $currencyGridCol(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	return $(`th[data-col-currency=${curCode}], td[data-col-currency=${curCode}]`, $('#currency_grid'));
}
```

## Adding the Grid

After all that refactoring my app looked identical to how it looked when I started! But, under the hood, the code was now ready for new functionality to be added.

The first step was to visually create a space into which the grid could be added.

### Making Visual Room for the Grid

I made three significant decisions:

1. The UI for toggling currencies on and off would be shared between the card and grid views — toggling a currency on would both add it as a row within a card, and a row and column within the grid.
2. I would use Bootstrap tabbed panes to switch between views
3. I would use a table to display the grid since it is tabular data.

Adding the tabs in such a way that the rate picker remained visible at all times involved re-organising my containers, and that meant all the existing adaptive behaviour no longer worked.

Rather than trying to fix nested grids that jumped around in all the wrong ways when moving between break points I simply stripped out all responsive classes, shrunk my browser windows as small as it would go, got it to look right at that size, then widened my window one break point at a time and added the classes to make the interface work at every breakpoint.

Don't be afraid to start over sometimes — it's often a much quicker and better solution than trying to edit existing code!

The hard part is knowing when to edit and when to start over. I'm afraid there's no easy answer for that — it's just something you learn from experience.

### Implementing the Grid

With all the rates already calculated, generation of the table itself was quite straight forward. I chose to use a [small Bootstrap table](https://getbootstrap.com/docs/4.4/content/tables/#small-table) with [hoverable rows](https://getbootstrap.com/docs/4.4/content/tables/#hoverable-rows).

Initially I used two-decimal places when displaying the rates, but that proved problematic — some of the rates are so small relative to each other that they were showing as zero, which obviously can't be correct! With a little experimenting I found that the minimum number of decimal places needed to show all rates in a meaningfully way was four, so that's what my grid uses. Since rates are plain numbers (or as scientists would say, *dimensionless*), not amounts of any given currency, the rules for the number of decimal places to show for any given currency are irrelevant. 

Another problem I soon noticed was that when you show a lot of currencies on a small screen the table becomes too wide to fit on the screen. Rather than having the col overflow I chose to use Bootstrap's built-in support for horizontally scrollable tables, which the Bootstrap rather confusing calls [Responsive tables](https://getbootstrap.com/docs/4.4/content/tables/#responsive-tables).

#### Nested Loops, Clones & Lodash

To generate a currency grid you need to be comfortable nesting loops within loops, both for creating your view, and within your template.

Given the structure of HTML tables, your outer loop will take care of each row on at a time, and the inner loop each cell within the row. In both cases you are iterating over the list of supported currencies.

The outer loop is iterating over the same information needed to generate the toggles for enabling and disabling currencies, for adding currency cards, and for building the cards themselves. For that reason I chose to create a single view object for all three of those templates and store it in the global scope with as `CURRENCY_CONTROL_VIEW`.

This view takes the following form:

```json
{
  "currencies": [
    {
      "code": "AUD",
      "name": "Australian Dollar",
      "symbol": "$",
      "icon": "<i class=\"fas fa-dollar-sign\"></i>",
      "defaultDisplay": true,
      "decimalDigits": 2
    },
    // …
    {
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "icon": "<i class=\"fas fa-dollar-sign\"></i>",
      "defaultCard": true,
      "defaultDisplay": true,
      "decimalDigits": 2
    }
  ]
}
```

Rather than re-inventing the wheel I chose to use this existing view as a starting point for the view for my grid.

The tempting thing to do would be to create a new variable, assign it equal to this existing view, and then start making the needed alterations. Because JavaScript variables hold references to objects rather than the objects themselves, this would result in the original view being altered rathe than a copy, not what we want!

We could manually duplicate the view by looping over it and copying all the data one item at a time, but that's no less work than just re-creating it from scratch really.

Instead, I chose not to re-invent the wheel, but reach for one of my favourite open-source JavaScript libraries — [Lodash](https://lodash.com) (pronounced *low-dash* because it's a fork of the older library [underscore.js](https://underscorejs.org)).

Lodash contains a dizzying array of helpful little utility functions that really should be added to the core JavaScript language. One of those functions does a deep clone of nested objects — [`_.cloneDeep()`](https://lodash.com/docs/4.17.15#cloneDeep).

So, using a clone of my existing view as a starting point I then added the extra data needed for the grid:

```js
// build the view
const gridView = _.cloneDeep(CURRENCY_CONTROL_VIEW);
for(const curObj of gridView.currencies){
	curObj.conversions = [];
	for(const toCode of SORTED_CURRENCY_CODES){
		curObj.conversions.push({
			...CURRENCIES[toCode],
			code: toCode,
			rate: numeral(CURRENCIES[curObj.code].rates[toCode]).format('0,0[.]0000'),
			rawRate: CURRENCIES[curObj.code].rates[toCode],
			base: {
				name: curObj.name,
				code: curObj.code,
				icon: curObj.icon,
				symbol: curObj.symbol
			}
		});
	}
}
```

This generated a nested view of the following form:

```json
{
  "currencies": [
    {
      "code": "AUD",
      "name": "Australian Dollar",
      "symbol": "$",
      "icon": "<i class=\"fas fa-dollar-sign\"></i>",
      "defaultDisplay": true,
      "decimalDigits": 2,
      "conversions": [
        {
          "name": "Australian Dollar",
          "symbol": "$",
          "icon": "<i class=\"fas fa-dollar-sign\"></i>",
          "defaultDisplay": true,
          "decimalDigits": 2,
          "rates": { /* … */ },
          "code": "AUD",
          "rate": "1",
          "rawRate": 1,
          "base": {
            "name": "Australian Dollar",
            "code": "AUD",
            "icon": "<i class=\"fas fa-dollar-sign\"></i>",
            "symbol": "$"
          }
        },
        // …
        {
          "name": "US Dollar",
          "symbol": "$",
          "icon": "<i class=\"fas fa-dollar-sign\"></i>",
          "defaultCard": true,
          "defaultDisplay": true,
          "decimalDigits": 2,
          "rates": { /* … */ },
          "code": "USD",
          "rate": "0.6279",
          "rawRate": 0.6279122370504411,
          "base": {
            "name": "Australian Dollar",
            "code": "AUD",
            "icon": "<i class=\"fas fa-dollar-sign\"></i>",
            "symbol": "$"
          }
        }
      ]
    },
    // …
    {
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "icon": "<i class=\"fas fa-dollar-sign\"></i>",
      "defaultCard": true,
      "defaultDisplay": true,
      "decimalDigits": 2,
      "conversions": [
        {
          "name": "Australian Dollar",
          "symbol": "$",
          "icon": "<i class=\"fas fa-dollar-sign\"></i>",
          "defaultDisplay": true,
          "decimalDigits": 2,
          "rates": { /* … */ },
          "code": "AUD",
          "rate": "1.5926",
          "rawRate": 1.592579250720461,
          "base": {
            "name": "US Dollar",
            "code": "USD",
            "icon": "<i class=\"fas fa-dollar-sign\"></i>",
            "symbol": "$"
          }
        },
        // …
        {
          "name": "US Dollar",
          "symbol": "$",
          "icon": "<i class=\"fas fa-dollar-sign\"></i>",
          "defaultCard": true,
          "defaultDisplay": true,
          "decimalDigits": 2,
          "rates": { /* … */ },
          "code": "USD",
          "rate": "1",
          "rawRate": 1,
          "base": {
            "name": "US Dollar",
            "code": "USD",
            "icon": "<i class=\"fas fa-dollar-sign\"></i>",
            "symbol": "$"
          }
        }
      ]
    }
  ]
}
```

This view is very large, and looks very duplicative, but that's fine, because much of it is simply references to parts of the `CURRENCIES` data structure, so there is much less actual duplication than there first appears to be, and the value of having things like the symbols and names duplicated is that the template can be much simpler and easier to read.

This is my entire template for the grid:

<!-- {% raw %} -->
```html
<!-- The currency grid template -->
<script type="text/html" id="currencyGridTableTpl">
	<div class="table-responsive border-top-0">
		<table class="table table-sm table-hover m-0 border-top-0 text-dark" id="currency_grid">
			<thead class="border-top-0">
				<tr>
					<th  class="border-top-0">&nbsp;</th>
					{{#currencies}}
					<th title="To {{name}}" data-toggle="tooltip" class="text-center border-top-0 currencyGridCell" data-col-currency="{{{code}}}">
						<small class="text-secondary">{{{icon}}}</small>
						<br />
						{{code}}
					</th>
					{{/currencies}}
				</tr>
			</thead>
			<tbody>
			{{#currencies}}
				<tr class="currencyGridRow" data-row-currency="{{{code}}}">
					<th title="From {{name}}" data-toggle="tooltip">
						<small class="text-secondary">{{{icon}}}</small>
						<span class="text-primary">{{code}}</span>
					</th>
					{{#conversions}}
						<td class="currencyGridCell text-center" data-col-currency="{{{code}}}" title="{{{base.name}}} → {{name}}" data-toggle="tooltip">{{{rate}}}</td>
					{{/conversions}}
				</tr>
			{{/currencies}}
			</tbody>
		</table>
	</div>
</script>
```
<!-- {% endraw %} -->

Notice there are three loops:

1. A loop to add all the column headings (`{{#currencies}} … {{/currencies}}`)
2. A loop to add all the rows of rates ( also `{{#currencies}} … {{/currencies}}`)
3. A loop within the row loop to add the cells (`{{#conversions}} … {{/conversions}}`)

#### Rows with Heading Cells

Visually, the only thing of note about the table is the use of `<td>` cells within the body of the table. The reason for this is that in a grid like this the first cell in every row is a heading.

A common misunderstanding is that `<th>` cells go in the `<thead>` and `<td>` cells in the `<tbody>`. While that does tend to be true for most tables, it's not a requirement or a rule — both kinds of the cell can be used anywhere within a table a cell can be used. When a cell contains data it should be a *table data* cell, i.e. a `<td>`, and when it contains a heading of some kind it should be a *table heading* cell, i.e. a `<th>`.

#### Adding/Removing Currencies

My approach was to generate the entire table when the page loads, with all but the default currencies hidden, then, as currencies are enabled and disabled, hide and show both the relevant rows and columns.

As with my solution to the previous challenge, I chose to use data attributes to embed the three-letter currency codes into the HTML elements themselves. In this case each row was given a data attribute named `data-row-currency` and the class `currencyGridRow`, and each data cell and column header an attribute named `data-col-currency` and the class `currencyGridCell`.

Getting references to the row or column for a given currency then becomes as simple as:

```js
/**
 * Get a jQuery object representing the row for a given currency in the grid.
 * 
 * @param {string} curCode
 * @return {jQuery}
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function $currencyGridRow(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	return $(`tr[data-row-currency=${curCode}]`, $('#currency_grid'));
}

/**
 * Get a jQuery object representing the column for a given currency in the grid.
 * This will be a single jQuery object representing a th and many tds.
 * 
 * @param {string} curCode
 * @return {jQuery}
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function $currencyGridCol(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	return $(`th[data-col-currency=${curCode}], td[data-col-currency=${curCode}]`, $('#currency_grid'));
}
```

## Some Fit and Finish

At this point I had a complete working solution, but I wanted to add a few tweaks to make the UI just that little bit more human friendly.

The big problem I wanted to address is that the grid had to contain very minimalist headings to save space and minimise the need for horizontal scrolling. That meant omitting the full currency names completely. Similarly, each cell is limited to showing just a number.

What's missing here is context. Firstly, what is the `JPY` again? and secondly, the cell with `JPY` as the column heading and `EUR` as the row heading, is that the rate from Euro to Yen or Yen to Euro?

I chose to use `title` attributes to add information into both the row and column heading cells, and the data cells, and then to expose those titles to users using Bootstrap's [Tooltips](https://getbootstrap.com/docs/4.4/components/tooltips/) component.

For the row and column headers I added the direction and the currency names, and for the cells containing rates I chose to add both currency names and the conversion direction.

The second little piece of polish I chose to apply is to add just a little more highlighting of the current cell when hovering. Bootstrap's `.table-hover` class does a good job of highlighting the current row, but not of drawing attention to the current cell. To do that I added one custom CSS declaration into a `<style>` tag in the page's `<head>` section:

```css
td.currencyGridCell:hover{
	background-color: darkgray;
}
```

As a reminder, this CSS selector uses the `:hover` pseudo-class to set the background colour to dark grey on all table data cells with the class `.currencyGridCell` when they are being hovered over.

## New Challenge — A World Clock App

As much fun as this currency converter web app has been, it's time to move on!

The currency converter was our first real-world web app. We built it up piece by piece, and now it's time to start over on a new app which we'll also build up over a few challenges.

The challenge now is to make a start on a web app for showing the current time in an arbitrary timezone. This initial *minimal viable product* (as the startup jargon goes) should display a clock showing the current time, and allow the user to control the following:

1. The timezone the clock shows the current time in.
2. Whether or not the clock shows 12 hour time or 24 hours time.
3. Whether or not the clock shows seconds.
4. Whether or not the clock shows pulsing dividers between the parts of the time.

Rather than implementing your own timezone conversion, please use either JavaScript's built-in date functions, or, better yet, an open source library dedicated to making date and time operations easy. I'd recommend using [moment.js](https://momentjs.com) with its [optional timezone extension](https://momentjs.com/timezone/).

Instalment 95 will be dedicated to a sample solution to this challenge.

 - [← PBS 91 — JavaScript RE Objects](pbs91)
 - [Index](index)
 - [PBS 93 — Encapsulation with JavaScript Objects →](pbs93)
