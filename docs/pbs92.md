# PBS 92 of X — Currency Grid Solution

In this instalment we'll be describing my sample solution to the challenge set at the end of PBS 89. The challenge was to start with the currency conversion web app we've been developing for quite a few months now, and add an extra feature to it.

The app had been built around the concept of *currency cards*, each card showed the conversions from one base currency to a number of other currencies. Users could add or remove cards as they wished, and enable or disable conversion currencies on the cards.

This is one common approach to currency conversion, and it caters best to people who are interested in seeing what a specific currency is doing against a number of other currencies.

A different common approach is a grid showing the conversion rates between multiple currencies all at once. You read your base currency from one axis, and your destination currency along the other, and where they meet, you get the conversion rate between those currencies.

The challenge was to expand the web app so it supports both approaches, allowing users to toggle between them as they desire. The underlying information is the same, but the presentation is very different.

The motivations behind setting the challenge were two-fold. The most straightforward motivation was to give you all an opportunity to refresh your knowledge of HTML tables. The second, more ulterior motive, was to illustrate the point that adding a previously un-imagined new feature to an existing app is often more difficult than creating a whole new app! It would have been much easier to create a separate web app for the grid view, but it sounds easier to just add the grid view into your existing app!

It took me three times as long to get my app ready for the grid that it took me to implement the grid!

## Refactoring

Most of us probably know the term *refactoring* from high-school maths classes, but that's not what we're going to talk about here. Software engineers have re-cycled the term to describe a common programming task. Sometimes you need to change how the code does something without changing what it does.

In this case I needed to retain all the user-facing functionality of my existing converter while completely re-designing the underlying implementation.

### From Fetching On-demand to Pre-loading

My cards app fetched data from the currency conversion web service when the user added a card. No data was fetched until a card was loaded, and a separate request was made for each card. That works great for cards, but you can't generate a useful grid from incomplete data!

As Allison demonstrated in her solution to the currency cards challenge, making multiple requests was never needed — Once you've fetched the rates for one currency you actually have all you need to calculate the rates between any two arbitrary currencies!

So, in preparation for adding my grid I would need to re-design my card interface so it fetched the data for a single master currency on page load, then calculated all the other rates from that original reply, and generate all cards at once, hiding all but those shown by default. When a user 'adds' a currency there is no need to fetch anything, it simply becomes a matter of showing the already generated hidden card. Similarly, closing a card is simply a matter of hiding it!

To get from a single set of rates to the complete set of all possible rates involves two pieces of simple arithmetic.

Firstly, **the rate from currency B to currency A is the reciprocal of the rate from currency A to Currency B**. If you're like me, and your high-school arithmetic is a little rusty, the reciprocal of A is one divided by A. So, if we know the rate from Euro to Dollar is `1.11`, then the rate from Dollar to Euro is `1/1.11`, or approximately `0.9`.

Given that our starting point is a list of all rates from a master currency to every other supported currency, we can now calculate the rate from every supported currency to our master currency.

Secondly, **rates can be multiplied**. If you know the rate from currency A to currency C, and from currency C to currency B, then the rate from A to B is  simply the product of those two rates.

If we assume our master currency is the Euro, and that the web service returned a rate of `1.11` from Euro to US Dollar, and `0.89` from Euro to British Pound. We can get the rate from Dollar to Pound by first taking the reciprocal of the rate from Euro to Dollar to get the rate from Dollar to Euro, and then multiply that by the rate from Euro to Pound . i.e. `(1 / 1.11) * 0.89`, which gives a rate of 0.8 British Pounds per US Dollar.

That's all very difficult to say in English, but quite easy to write in JavaScript!

While refactoring my code I decided to break the loading of the rates out into a separate function which I named `loadCurrencyRates()`. That function makes an AJAX call to the currency conversion web service requesting the rates for the Euro against all supported currencies. It then does some validation on that data and stores those rates. Then it applies the maths described above to calculate all the needed rates.

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

If we ignore the AJAX request, the various checks to detect conversions from to self and from Euro, and the storage of the calculated rates into the `CURRENCIES` data structure we are left with the following simple lines implementing the actual math:

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

Before adding a whole bunch more logic into my code to implement the grid I took the time to implement two distinct forms of re-organisation.

#### Splitting Out the JavaScript

The first thing I did was take the JavaScript out of the HTML file and move it into a pair of separate JavaScript files when I then included using `<script>` tags with an `src` attribute. I chose to move the currencies data structure into one file, and all the rest of the JavaScript into another.

My logic was simple, I wanted to be able to use tabs within my code editor to quickly jump between the HTML templates in the HTML file, the currencies data structure in `currencyData.js`, and the JavaScript that actually implements the app's functionality in `index.js`. Switching tabs is just so much quicker and easier than scrolling up and down each time you need to check something!

#### Functions for Everything

The next step I chose to take was to break the long chunks of code in my event handlers into well named functions. This makes the event handlers much easier to read, as demonstrated by the input handler for the toggles for turning on or off currencies:

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

This event handler does a lot of work, but because that work has been broken down into clearly named functions the code for the event handler is so clear as to be almost self-documenting!

## Coercion & Assertion

When it comes to data validation there are two obvious approaches, each a different extreme — you can simple assume all the data is good, and write your code accordingly, or, you can enforce your assumptions with rigorous tests and throw an error if anything is not exactly as expected.

Neither are optimal, though I would argue the latter is definitely the lesser of two evils!

There is a third way — coercion. If possible convert the input to the needed format, if not, then throw an error.

I chose to write a coercion function for currency codes and then use it for validation in every function that takes a currency code as an argument, and there turned out to be very many of those!

In this specific instance I need my currency code to be a three-character-long all upper-case string representing a supported currency. A value like `'eur'` does not meet those criteria, but it's pretty easy to coerce it into a valid value by simply converting it to upper case.

Another common data validation technique is assertion — if something is not true, throw an error.

It can be very useful to combine both of these techniques in a single data validation function. A good example of this approach in my sample solution is the function `assertCurrencyCode()`. This function takes a value to be tested/coerced as its only argument, and returns a valid value or throws an error if it can't:

```js
/**
 * Check that a given value is a valid and supported 3-digit ISO 4217 currency
 * codes. Invalid values will throw an error.
 *
 * This function will coerce values by converting to upper case before testing,
 * and return that coerced version.
 * 
 * @param {*} val — the vaue to test.
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
	if(!CURRENCIES[val]) throw new TypeError(`invalid or un-supported country code: '${val}'`);
	
	// if we got here, all is well, return the upper-cased string
	return val;	
}
```

This function is used for validation in every other function that takes a currency code as an argument, e.g.:

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

After all that refactoring my app looked identical to how it had looked before! But, under the hood the code was now ready for new functionality to be added to it.

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

TO DO