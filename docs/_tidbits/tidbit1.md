---
title: Display Values are not Data!
---
# PBS Tidbit 1 of Y — Display Values are not Data!

Listener [@lbutlr](https://twitter.com/lbutlr/) pointed out [on Twitter](https://twitter.com/lbutlr/status/1221867924589121536) that the sample solution to the challenge set in [PBS 88](./pbs88) Icon as I originally posted it in [PBS 89](./pbs89) had a bug — it sometimes got its maths spectacularly wrong!

![A screenshot showing the bug showing 10k Won being zero Euro, Dollars, etc.](assets/tidbits1/screenshot-1-broken.jpg)

It’s important to note that the bug did not affect all currencies, just some currencies.

The line of code for doing the currency conversion is supremely simple:

```js
const convAmount = baseAmount * rate;
```

How on earth can there be a bug that is something so simple that only manifests for some currencies but not for others?

## Matching Podcast Episode

[Listen along to this instalment](https://www.podfeet.com/blog/2020/02/pbs-tb-1/).

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_02_08-TB1.mp3?autoplay=0&loop=0&controls=1">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2020_02_08-TB1.mp3" >Download the MP3</a>

## Diagnosing the Problem

The first thing I noticed was that the bug affected low-value currencies. When each unit of the currency has a low value then the exchange rates will involve small numbers. Maybe the combination of a big base amount and a tiny exchange rate was exceeding the amount of precision a JavaScript number can store?

Javascript numbers are 64bit numbers (double-precision numbers or simply doubles in programming jargon), so they can only capture so much detail — as a science student I ran into the limit of doubles when doing homework assignments, so I knew it was at least conceivable. Looking more closely that didn’t make sense — the numbers were not big enough, and the rates not small enough for that to be a reasonable explanation.
I was on the right track though — it was a precision problem, but not with JavaScript’s number storage, but with my code!

As explained in the description of the solution in [PBS 89](./pbs89), I used data attributes to store the rate within the relevant row of the card using HTML data attributes. Without thinking about it the value I stored in the data attribute was the rate as displayed to the user — rounded to 2 decimal places!

The data attribute is added into the currency’s item within this part of my Mustache template:

<!-- {% raw %} -->
```html
<li class="list-group-item currencyRate" data-currency="{{{code}}}" data-rate="{{{rate}}}">
```
<!-- {% endraw %} -->

And the rate is added into the view with this line:

```
cardView.rates.push({
  code: cc,
  rate: numeral(curData.rates[cc]).format('0,0[.]00'),
  ...CURRENCIES[cc]
});
```

And there we have it — the view was originally written purely to present information to the user, and I then re-used that view to inject data into the DOM elements. This is a great illustration of why you want to avoid passing information formatted for consumption by humans into computations!
Bottom line — as I suspected, it was indeed a loss of precision, but one of my own making — oops!

There is a silver lining though, I have the power to fix problems I created 🙂

## Fixing the Bug

The solution is fundamentally very simple — add the true rate into view as well as the formatted rate, then use that true rate to populate the data attribute.

The first step was to tweak the code that creates the view to add a new key named rawRate:

```js
cardView.rates.push({
  code: cc,
  rate: numeral(curData.rates[cc]).format('0,0[.]00'),
  rawRate: curData.rates[cc],
  ...CURRENCIES[cc]
});
```

The template could then be updated to use the raw rate:

<!-- {% raw %} -->
```html
<li class="list-group-item currencyRate" data-currency="{{{code}}}" data-rate="{{{rawRate}}}">
```
<!-- {% endraw %} -->

Much better!

![A screenshot showing the converter working as expected](assets/tidbits1/screenshot-2-fixed.png)

You’ll find [the full code for the challenge solution on GitHub](https://github.com/bartificer/programming-by-stealth/blob/master/instalmentResources/pbs89/pbs88-challengeSolution/index.html).

## Related Content

* [The episode of Chit Chat Across the Pond Podcast for the 8th of February 2020](https://www.podfeet.com/blog/2020/02/pbs-tb-1/) which is based in this post.
* [A blog post from Allison Sheridan](https://www.podfeet.com/blog/2020/02/when-currency-rate-decimals-go-wrong/) explaining how she enhanced her sample solution to the same challenge to deal with currencies with different numbers of decimal places.

<pre>
page.collection={{ page.collection | inspect }}
Collection First Doc Details:
{% assign my_collection = site.collections | where: "label", page.collection | first %}
{{ my_collection.docs | first | inspect | strip_html | strip }}
</pre>
