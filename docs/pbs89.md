# PBS 89 of X — Currency Converter Challenge

This instalment is an experiment! The intention going forward is to stop combining new content and challenge solutions into single instalments. When the challenges were short and simple this approach worked well, but as the series has moved on the challenges have evolved from small assignments into what could better be described as little coding projects. This is the natural results of an ever-expanding skill-set, and a sign that the series is moving in the right direction.

Keeping the challenge solutions as a mere opening section of a larger instalment has resulted in them becoming rushed, and as such, adding much less value than they should. The discussions of the solutions have been superficial at best lately, and that's simply a waste of time and opportunity. Bigger projects open up bigger questions, and they should be properly explored. In short, I want to switch the focus from the *what* to the *why* of my sample solutions.

So, in this instalment we'll focus purely on my sample solution to the challenge set at the end of [Instalment 88](https://bartificer.net/pbs88) — the addition of a single new feature to our currency conversion web app. We'll end the instalment with a new challenge, one intended to keep you occupied until instalment 92 (about 6 weeks). Instalments 90 and 91 will continue our review of the various hats objects wear in JavaScript.

## The Problem to be Solved

The starting point for this challenge was a working solution to the previous challenge. That's to say, a web app that presents the user with a number of cards containing currency conversion rates. Each card shows the rates for one base currency against a list of other currencies. Users have the ability to dismiss cards and to create new cards for the currencies of their choice. For extra credit there was also the option to add some UI to allow user to choose the currencies listed in the cards.

The challenge was to take this existing web app, and add the ability for users to specify an amount at the top of each card, and show that amount converted on each row of the card, rather than just the rate.

The starting point I used for my sample solution to this challenge was my sample solution to the previous challenge.

* [See my starting point functioning — rawcdn.githack.com/…](https://rawcdn.githack.com/bbusschots/pbs-resources/f4ba373772b77bf617629b723e1df87bd7a3441b/instalmentResources/pbs88/pbs85-challengeSolution/index.html)
* [View the source code for my starting point — github.com/…](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs88/pbs85-challengeSolution/index.html)

## Sample Solution Overview

Before describing the decisions that went into building my solution, let's start by taking a look at the solution in action:

* [See my solution functioning — rawcdn.githack.com/…](https://rawcdn.githack.com/bbusschots/pbs-resources/093672169c6a949eb00ab0874a9bfdadb80bc992/instalmentResources/pbs89/pbs88-challengeSolution/index.html)
* [View the source code for my solution — github.com/…](https://github.com/bbusschots/pbs-resources/blob/master/instalmentResources/pbs89/pbs88-challengeSolution/index.html)

Visually, the most important things to note are the following:

1. My choice of UI — a [Bootstrap Input Group](https://getbootstrap.com/docs/4.4/components/input-group/) with a standard [HTML 5 number input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number) at it's centre, the appropriate currency symbol as a prepend, and a conversion icon as an append.
2. My data validation choices — I chose to use standard HTML 5 form validation (as described in [Instalment 39](https://bartificer.net/pbs39)) in conjunction with [Bootstrap's built-in form validation styles](https://getbootstrap.com/docs/4.4/components/forms/#validation). I also chose not to apply any form validation styles until the first time the user interacts with a given number field.
3. My event handling choice — I chose to have the cards update each time the user changes the number in any way. I did this using the `input` event (not `change` or `keyup`).
4. My error handling choice — I chose to to treat invalid values as `1`.

Looking at the code, the most important things to note are:
* A focus on **generality** — there is a single event handler handing the number field on all cards.
* The use of data attributes to embed information into the cards themselves, hence enabling the desired generality.

## UI Decisions

### Entering the Number

When ever possible I prefer not to re-invent the wheel. Since HTML 5 provides an input type specifically for numbers, I chose to use that. My advice generally is to use the standard HTML 5 tags unless you have a good reason not to!

With the input type chosen, the next question was how to add it to each card. I experimented with Bootstrap inline forms and with adding the form in the header, but in the end the solution that worked best was to add the input as a single item in a regular form in a `.card-body` `<div>`.

A bare number input gave the user very little context, to I chose to add a little extra context by using a Bootstrap input group to add the base currency's icon to the front of the input and a conversion icon to the end.

When adding a UI element to a regular form it usually makes sense to add explanatory text to help the user, but in a small piece of UI that's repeated over and over again that would add too much clutter to be helpful IMO.

The final markup for the input in the relevant Mustache template is as follows:

```html
<div class="card-body p-2">
	<form action="javascript:void(0);" class="form">
		<div class="input-group input-group-sm">
			<div class="input-group-prepend">
				<span class="input-group-text">{{{base.icon}}}</span>
			</div>
			<input type="number" class="baseAmount form-control" placeholder="Amount" aria-label="Amount" value="1.00" min="0.01" step="0.01" required>
			<div class="input-group-append">
				<span class="input-group-text"><i class="fas fa-exchange-alt"></i></span>
			</div>
		</div>
	</form>
</div>
```

By default the `.card-body` class gave a little too much padding, so I added `.p-2` to reduce it a little. Other than that small tweak this is a completely *by the book* implementation.

### Data Validation

Again, to avoid re-inventing the wheel I chose to start by trying to use standard HTML 5 form validation in conjunction with Bootstrap's form validation classes. That proved to be a nice solution, so I never considered anything more complex.

Setting up the validation involved setting a minimum value on the input, and marking it as required. One small niggle with HTML 5 form validation is that the number of decimal places considered valid is determined by the number of decimal places in the step size. This makes the up and down arrows less useful than they could otherwise be.

So, to enable validation this is the markup for the number input:

```html
<input type="number" class="baseAmount form-control" placeholder="Amount" aria-label="Amount" value="1.00" min="0.01" step="0.01" required>
```

By default Bootstrap does not apply its form validation styles. You opt in to them by adding the class `.was-validated` to the form containing the inputs to be styled.

The bright green and red styles for valid and invalid are very eye-catching, which is by design, but they can be distracting in certain situations. In regular full-page forms it might well make sense to have the validation state showing as soon as the page loads, but in a web app like this I found it to be extremely distracting, and I felt it make the app harder to use rather than easier. For that reason I chose not to show the validation state on any card's number input until the first time the user interacts with it. Once the user starts typing the visual feedback becomes valuable, so it makes sense to enable it.

BTW, the way the styling is enabled is by using jQuery to add the `.was-validated` class to the appropriate `<form>` tag in the event handler for the number inputs.

### Event Handling

When should the content of the cards get updated? Should the user type some text, then hit a button to perform the calculation? Or should the change be instantaneous?

There is no universal right answer to that question, it really depends on the context.

If the updates takes a noticeable amount of time to perform then having them triggered each time a character changes won't work well at all. The same is true if the change are really distracting and cause the UI to keep jumping around all over the place. In those situations a button to trigger the update works best.

This case is different though, the updates are effectively instantaneous, and the changes don't result in the UI re-flowing the page or doing anything else very distracting. And, making the user click a button would make it harder on the user since they'd have to switch from their keyboard to their mouse, or explicitly hit enter.

That's why I chose to have the conversions update in real time as the user typed. As discussed in previous instalments, the correct event for this is `input`, not the more obvious `keyup` or `change`.

### Error Handling

With real-time updating of the exchange rates, the next problem becomes what to do when the user types something invalid? The HTML 5 form  validation and the Bootstrap validation styles will show the user something is wrong, but what way should the card be rendered when the input is in an invalid state? Blank each row? Or something else?

I chose to default all invalid values to 1 so they cards always show something useful, even while the number is invalid.

Note that to test for validity I used the built-in HTML 5 CSS pseudo-class `:invalid` in conjunction with jQuery's `.is()` function. One final small tweak is that `4.` is invalid, but it doesn't make sense to treat it as 1, so I added some JavaScript to the event handler to strip off trailing dots. The code below shows the error handling portion of the event handler:

```js
// default to 1 if invalid
if($input.is(':invalid')){
	baseAmount = 1;
}
				
// remove a trailing dot if present ('4.' to '4')
baseAmount = String(baseAmount).replace(/[.]$/, '');
```

## The Code — Keeping it General

In the broad scheme of things, having your code figure out was much information as it can on its own will result in better code. Rather than having a function take 20 arguments, give it one argument that gives it the help it enough information to find the rest by itself.

In this specific instance, the relevant example is that we want the function for updating the conversions in a card to work with as few arguments as possible, and we want to be able to use a single event handler for all the number inputs.

These two aims are very much related since the event handler will be calling the function for updating the conversions.

Let's start by looking at how the function for updating the conversions — `updateCardConversions()`.

The function takes two arguments — the currency who's card should be updated, and the amount of that base currency to convert to each target currency.

Based on just those two things the function figures out which card to update, and which rate to use to update each row.

Updating the actual text in the cards is the easy part — that's just basic jQuery using the `.text()` function to update the content of `<span>`s matching specific CSS selectors. I do have two points to note though. Firstly, when you're being generic you want to base your CSS selectors on classes rather than IDs, and limiting your search to a specific part of the page using the second argument to the `$()` function can be very useful.

For example, the following line generates a jQuery object representing the list items for each currency within a single card:

```
const $rateLis = $('li.currencyRate', $curCol);
```

This works because the list items all have the class `.currenctRate`, and the variable `$curCol` represents the relevant currency's column in the bootstrap grid, so it limits the `$()` function to list items in a single card.

Using classes and jQuery object allows us to find the right places to inject our conversions, but they don't help us find the exact card to update, or, the rate to use when calculating the updated amounts. The key to finding both of those pieces of information is data attributes.

Each grid column knows the currency it represents because it has a data attribute named currency that contains the relevant 3-letter currency code. We can use this data attribute in conjunction with jQuery's `$()` function get a jQuery object representing the correct grid column:

```js
// get the col for the currency
const $curCol = $(`.currencyCol[data-currency='${curCode}']`);
```

This selector is looking for any tag with the class `.currencyCol` and a data attribute named `currency` with the same value as the variable `curCode`.

That gets us half way to where we need to be — we now know where to go looking for all the conversions that need to be calculated.

The next thing we need to do is loop over each list item in the correct card, do the calculation, and then write back the result.

Each conversion is contained within a list item with the class `.currencyRate`, so we can use that fact to build a jQuery object representing all the items and loop over that like so:

```js
const $rateLis = $('li.currencyRate', $curCol);
for(const li of $rateLis){
	// convert the DOM object to a jQuery object
	const $li = $(li);
	
	// …
}
```

The conversion is pretty simple math — multiple the base amount by the rate. The base amount was passed as an argument, so all we're missing is the rate.

My card template stores the rates into each list item in a data attribute named `rate`:

```html
<li class="list-group-item currencyRate" data-currency="{{{code}}}" data-rate="{{{rate}}}">
```

This means the rate can be read very simply:

```js
// get the rate
const rate = $li.data('rate');
```

We now know everything we need, so the actual conversion itself is trivial:

```js
// do the conversion
const convAmount = baseAmount * rate;
```

The final step is to update the numbers in the card.

For each item the amount of the base currency is the same. In my template I write the base amount into each row within a `<span>` with the class `.baseAmount`, so these can all be updated in one go like so:

```js
$('.baseAmount', $curCol).text(numeral(baseAmount).format('0,0[.]00'));
```

Note that most of the content of that line is the formatting of the number so it looks good, the actual logic is much simpler than it looks.

The `$()` function finds all tags with the class `.baseAmount` within the correct card, then jQuery's `.text()` function is used to replace the content of each matched tag with the same value.

The logic for writing out each converted value is similar, but contained within the loop that iterates over each row in turn.

## Some Little Final Touches

I didn't like the way I was rendering each row within a card previously. Both the original amount (then always 1), and the rate had the same visual weight, so the eye was not drawn to the rate as it should be.

Switching from a rate to an actual conversion made that an even worse experience, so I re-designed the rendering of the rows so the base amount would be de-emphasised and both the target currency and the converted value would be emphasised.

I chose to make the target currency stand out by making it `.text-primary`, to make the base amount less distracting by making it `.text-muted`, and to leave the converted amount as the only item on each line rendered in the default black.

The next small tweak I made was to change the formatting of the numbers within each row of the card. In my previous solution I had already started to use the wonderful open source [numeral.js](http://numeraljs.com/) library for formatting the numbers, but I was using the format string `'0,0.00'` which results in numbers that always have two decimal places, even for whole numbers. This was very wasteful of space when the user was converting whole numbers of the base currency, something I expect users will do often!

So, to save space and clutter when a whole number was being converted I changed the format to `'0,0[.]00'` which only shows the decimal places when they're needed.

In my previous solution I focused the entire card each time a new card was added. This was the only sensible thing I could do because there was no form input of any kind within the cards. Now, each card has a number input, and, the most likely thing a user will want to do after creating a card is to change that number, so, the obvious thing to do was to update the code so it focused the input rather than the card:

```js
$('input.baseAmount', $curCol).focus();
```

This focuses the `<input>` tag with the class `.baseAmount` within the relevant card.

Finally, when the page loaded a card was randomly focused. This is because the default cards are rendered using the same function that renders cards added by the user. Because the AJAX queries return in a random order, the focus would jump around as each card loaded. The jumping around was awkward, and the final card to get focus was random.

Since none of the default cards are more important than the other, and the user has not yet shown any preference for any one, the best solution was to focus none of them.

To enable this I added a second, optional, argument to the function for rendering a card — `.showCurrencyCard()`. The default behaviour was left the same, but now when a truthy value is passed as the second argument, `skipFocus`, the focusing step is skipped:

```js
// focus the card if appropriate
if(!skipFocus) $('input.baseAmount', $curCol).focus();
```

Finally, the document ready event handler was updated to pass a `true` as a second argument when loading the default cards:

```js
// load the default currencies
for(const curCode of SORTED_CURRENCY_CODES){
	if(CURRENCIES[curCode].defaultCard){
		showCurrencyCard(curCode, true).catch(function(e){
			console.error(`failed to show '${curCode}'`, e);
		});
	}
}
```

## A New Challenge — Currency Grid View

Using your current currency conversion app or my sample solution as your starting point, allow users to switch between the existing card view and a new grid view.

There should be a row and a column in the grid for each currency, and each cell should show the conversion rate between its row and column currencies.

You should provide UI for hiding and showing each currency, and the grid should initialise with a sub-set of the supported currencies.

You may use any UI you like, but I suggest looking at [Bootstrap Nav Tabs](https://getbootstrap.com/docs/4.4/components/navs/#tabs) (with [Bootstrap's JavaScript tab plugin](https://getbootstrap.com/docs/4.4/components/navs/#javascript-behavior)).

If, like in my sample solution, you are loading each currency with a separate AJAX request you'll need to re-factor your code to load the rates for a single currency and then use some simple maths to derive the rates between the various currencies. I would suggest building a lookup table to map the rates from every currency to every other currency.

Because this is a very substantial challenge, there will be two regular instalments between this instalment and the solution instalment for this challenge. I.e. you have about six weeks 🙂
