//
// Define globally scoped helper variables
//

// a lookup table for the various templates
var TEMPLATES = {
	ui: {
		showHideRates: '', // loaded by document ready handler
		errorCard: '' // loaded by document ready handler
	},
	cards: {
		addCardForm: '',  // loaded by document ready handler
		currencyCardCol: ''  // loaded by document ready handler
	},
	grid: {
		table: '',  // loaded by document ready handler
		currencyRow: ''  // loaded by document ready handler
	}
};

// a view object shared by mutiple UI Forms:
// 1. The currency selection form
// 2. The add Card form
var CURRENCY_CONTROL_VIEW = { currencies: [] };
for(const code of SORTED_CURRENCY_CODES){
	CURRENCY_CONTROL_VIEW.currencies.push({
		code,
		...CURRENCIES[code]
	});
}
console.debug('generated shared view for the currenct-control forms', CURRENCY_CONTROL_VIEW);

// A flag to indicate whether or not each currency should
// be shown as a row within cards
var DISPLAY_CURRENCIES = {};
for(const curCode of SORTED_CURRENCY_CODES){
	DISPLAY_CURRENCIES[curCode] = false;
}

//
// Document ready handler
//

/**
 * The async function that will be invoked by the document ready handler.
 * 
 * @throws {Error} An error is thrown if the document fails to initialise.
 */
async function initCurrencyConverter(){
	// load the templates
	TEMPLATES.ui.showHideRates = $('#showHideRatesFormTpl').html();
	TEMPLATES.ui.errorCard = $('#errorCardTpl').html();
	TEMPLATES.cards.addCardForm = $('#addCardFormTpl').html();
	TEMPLATES.cards.currencyCardCol = $('#currencyCardColTpl').html();
	TEMPLATES.grid.table = $("#currencyGridTableTpl").html();
	
	// get refences to the place-holders for the various UI components
	const $currencyControls = $('#currency_controls'); // where the global UI cards go
	const $cards = $('#currency_cards'); // where the currency cards go
	const $grid = $('#currency_grid'); // where the currency table goes
	
	// load the currency data
	await loadCurrencyRates();
	
	// add the Currency Selection form into the page
	$currencyControls.empty().append(buildRatesSelectionFormUI());
	
	// load all the currency cards
	$cards.empty().append(buildCurrencyCardCols());
	
	// add the New Card Form into the page
	$cards.append(buildNewCardFormUI());
	
	// load the currency grid
	$grid.empty().append(buildCurrencyGrid());
	
	// load the default rates and cards
	for(const curCode of SORTED_CURRENCY_CODES){
		if(CURRENCIES[curCode].defaultDisplay){
			showRate(curCode);
		}
		if(CURRENCIES[curCode].defaultCard){
			showCurrencyCard(curCode, true);
		}
	}
	
	// now that all the templates have loaded, enable the Boostrap Tooltip pluging
	$('[data-toggle="tooltip"]').tooltip();
}

$(async function(){
	initCurrencyConverter().then(
		function(){ // success handler
			console.debug('successfully initialised currency converter');
		},
		function(e){ // error handler
			console.error('failed to initialise currency converter with error:', e);
		}
	);
});

//
// Data Loading Functions
//

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
	console.debug(`received Euro excange rates: `, eurData);
	
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

//
// UI Generation Functions
//

/**
 * A function to build the form for selecting currencies.
 *
 * @return {jQuery}
 */
function buildRatesSelectionFormUI(){
	// build the show/hide rates form
	const $currencySelectionForm = $(Mustache.render(
		TEMPLATES.ui.showHideRates,
		CURRENCY_CONTROL_VIEW
	));
	
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
	
	// return the form
	return $currencySelectionForm;
}

/**
 * A function to build the form used to add cards in the currency card view.
 *
 * @return {jQuery}
 */
function buildNewCardFormUI(){	
	// build the form
	const $addCardForm = $(Mustache.render(
		TEMPLATES.cards.addCardForm,
		CURRENCY_CONTROL_VIEW
	));
		
	// select the first currency in the list
	$('select option', $addCardForm).first().prop('selected', true);

	// add a submit handler to the add currency card form
	$('form', $addCardForm).on('submit', function(){
		// get a reference to the form as a jQuery object
		$form = $(this);
			
		// get the selected currency
		const curCode = $('select', $form).val();
			
		// show the requested card
		showCurrencyCard(curCode);		
	});
	
	// return the form
	return $addCardForm;
}

/**
 * A function to build the the card, and its contianing col, for a given currency.
 *
 * @param {string} curCode
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function buildCurrencyCardCol(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// build the view for the card
	const cardView = {
		base: {
			code: curCode,
			...CURRENCIES[curCode]
		},
		rates: []
	};
	for(const toCurCode of SORTED_CURRENCY_CODES){
		if(toCurCode === curCode) continue; // skip self
		cardView.rates.push({
			code: toCurCode,
			rate: formatCurrencyAmount(CURRENCIES[curCode].rates[toCurCode], toCurCode),
			rawRate: CURRENCIES[curCode].rates[toCurCode],
			...CURRENCIES[toCurCode]
		});
	}
	console.debug(`generated view for '${curCode}':`, cardView);
	
	// generate the HTML
	const cardHTML = Mustache.render(TEMPLATES.cards.currencyCardCol, cardView);
	
	// convert the HTML to a jQuery object
	const $card = $(cardHTML);
	
	// hide the currencies that should not be showing
	for(const toCurCode of SORTED_CURRENCY_CODES){
		if(!DISPLAY_CURRENCIES[toCurCode]){
			$(`li.currencyRate[data-currency='${toCurCode}']`, $card).hide();
		}
	}
	
	// add a click handler to the close button
	$('button.close', $card).click(function(){
		hideCurrencyCard(curCode);
	});

	// add an input handler to the base amount text box
	$('input.baseAmount', $card).on('input', function(){
		// convert the DOM object for the input to a jQuery object
		const $input = $(this);
		
		// get a reference to the card's form
		const $form = $input.closest('form');
		
		// enable the display of the validation state on the form
		$form.addClass('was-validated');
		
		// read the base amount for the form
		let baseAmount = $input.val();
		
		// default to 1 if invalid
		if($input.is(':invalid')){
			baseAmount = 1;
		}
		
		// remove a trailing dot if present ('4.' to '4')
		baseAmount = String(baseAmount).replace(/[.]$/, '');
		
		// do the conversion
		updateCardConversions(curCode, baseAmount);
	});
	
	// return the card
	return $card;
}

/**
 * A function to build the cards, including their cols, for each currency.
 *
 * @return {jQuery} Returns a single jQuery object representing all the cards.
 */
function buildCurrencyCardCols(){
	let $cards = $(); // empty jQuery object
	
	// build and store each card
	for(const baseCurCode of SORTED_CURRENCY_CODES){
		// generate a card for the currency
		const $card = buildCurrencyCardCol(baseCurCode);
		
		// hide the card
		$card.hide();
		
		// append the card into the collection of cards
		$cards = $cards.add($card);
	}
	
	// return the placeholder cards
	return $cards;
}

/**
 * A function to build the currency grid.
 */
function buildCurrencyGrid(){
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
	console.debug('generated view for currency grid:', gridView);
	
	// build the table
	const $table = $(Mustache.render(
		TEMPLATES.grid.table,
		gridView
	));
	
	// hide all the currency grid rows and columns
	$('.currencyGridCell, .currencyGridRow', $table).hide();
	
	// return the table
	return $table;
}

//
// Global currency functions
//

/**
 * Show the card and grid row & column for a given currency.
 *
 * @param {string} curCode - The three-letter code for the currency to load.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function showRate(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// show the currency card conversions
	showCurrencyCardConversions(curCode)
	
	// show the grid row & column for the currency
	showGridCurrency(curCode);
	
	// mark the currency as active
	DISPLAY_CURRENCIES[curCode] = true;
	
	// update the show/hide rate UI
	updateRatesUI();
}

/**
 * Hide the card and grid row & column for a given currency.
 *
 * @param {string} curCode - The three-letter code for the currency to load.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function hideCurrency(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// hide the currency card conversions
	hideCurrencyCardConversions(curCode)
	
	// hide the grid row & column for the currency
	hideGridCurrency(curCode);
	
	// mark the currency as inactive
	DISPLAY_CURRENCIES[curCode] = fale;
	
	// update the show/hide rate UI
	updateRatesUI();
}

//
// Card-view functions
//

/**
 * Show the card for a given currency.
 *
 * @param {string} curCode - The three-letter code for the currency to load.
 * @param {boolean} [skipFocus=false] - Pass a truthy value to skip the
 * focusing of the card after loading.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function showCurrencyCard(curCode, skipFocus){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// get the col for the currency
	const $curCol = $currencyCardCol(curCode);
	
	// show the col
	$curCol.show();
	
	// mark the card as active
	$curCol.data('active', true);
	
	// focus the card if appropriate
	if(!skipFocus) $('input.baseAmount', $curCol).focus();
	
	// update the select in the add card form
	updateAddCardSelectOptions();
}

/**
 * Hide the card for a given currency.
 *
 * @param {string} curCode - The three-letter code for the currency to load.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function hideCurrencyCard(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
		
	// get the col for the currency
	const $curCol = $currencyCardCol(curCode);
		
	// hide the col
	$curCol.hide();
	
	// mark the card as inactive
	$curCol.data('active', false);
		
	// update the select in the add card form
	updateAddCardSelectOptions();
}

/**
 * Show the row within all cards showing the conversion to a given currency.
 *
 * @param {string} curCode - The three-letter code for the currency to show.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function showCurrencyCardConversions(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// show the rows
	$currencyCardLi(curCode).show();
}

/**
 * Hide the row within all cards showing the conversion to a given currency.
 *
 * @param {string} curCode - The three-letter code for the currency to hide.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function hideCurrencyCardConversions(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// hide the rows
	$currencyCardLi(curCode).hide();
}

/**
 * Update the state & display state of each currency switch in the show/hide
 * rates UI as needed.
 */
function updateRatesUI(){
	// loop over all the switches
	$('input:checkbox', $('#showHideRatesForm')).each(function(){
		// get a reference to a jQuery object representing the toggle
		const $toggle = $(this);
			
		// get the currency the toggle controls
		const curCode = $toggle.val();
		
		// set the state of the toggle to match the stored state
		$toggle.prop('checked', DISPLAY_CURRENCIES[curCode] ? true : false );
			
		// updating the styling of the toggle as appropriate
		if($toggle.prop('checked')){
			$toggle.closest('li')
				.removeClass('border-secondary')
				.addClass('border-primary font-weight-bold');
		}else{
			$toggle.closest('li')
				.removeClass('border-primary font-weight-bold')
			.addClass('border-secondary');
		}
	});
}

/**
 * Update the enabled/disabled state of each option in the
 * select for adding cards.
 */
function updateAddCardSelectOptions(){
	// get a reference to the options in the select as a jQuery object
	const $opts = $('#add_currency_sel option');
	
	// loop over all the options in the select and enable/disable as needed
	for(const opt of $opts){
		// convert DOM object to jQuery object
		const $opt = $(opt);
		
		// get the currency code the option represents
		const curCode = $opt.val();
		
		// get a reference to the col for this currency
		const $curCol = $currencyCardCol(curCode);
		
		// enabled/disable this option based on the visibility
		// of the matching card
		$opt.prop('disabled', $curCol.data('active') ? true : false );
	}
	
	// select the first enabled option
	for(const opt of $opts){
		// convert DOM object to jQuery object
		const $opt = $(opt);
		
		// if the current option is not disabled, select it and exit the loop
		if(!$opt.prop('disabled')){
			$opt.prop('selected', true);
			break; // end the loop
		}
	}
}

/**
 * Update the conversions within a loaded card for a given currency.
 * 
 * @param {string} curCode - The three-letter code for the card to update.
 * @param {number} baseAmount - The amount of the base currency to convert.
 * @throws {TypeError} A type error is throw if the currency code or amount
 * are not valid.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown. A `TypeError` is also thrown if an invalid amount
 * is passed.
 */
function updateCardConversions(curCode, baseAmount){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// get the col for the currency
	const $curCol = $(`.currencyCol[data-currency='${curCode}']`);
	
	// validate the amount
	if(!String(baseAmount).match(/^\d+(?:[.]\d+)?$/)){
		throw new TypeError(`Invalid base amount: ${baseAmount}`);
	}
	
	// update all the renderings of the base amount
	$('.baseAmount', $curCol).text(formatCurrencyAmount(baseAmount, curCode));
	
	// loop through each currency in the card and update the conversion
	//const $rateLis = $(`li.currencyRate[data-currency='${curCode}']`);
	const $rateLis = $('li.currencyRate', $curCol);
	for(const li of $rateLis){
		// convert the DOM object to a jQuery object
		const $li = $(li);
		
		// get the rate
		const rate = $li.data('rate');
		
		// get a reference to the converted value place holder
		$convSpan = $('.convertedAmount', $li);
		
		// do the conversion
		const convAmount = baseAmount * rate;
		
		// output the value
		$convSpan.text(formatCurrencyAmount(convAmount, $li.data('currency')));
	}
}

/**
 * Get a jQuery object representing the col for a given currency card.
 * 
 * @param {string} curCode
 * @return {jQuery}
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function $currencyCardCol(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	return $(`.currencyCol[data-currency=${curCode}]`);
}

/**
 * Get a jQuery object representing the list items for a given currency
 * within each currency card.
 * 
 * @param {string} curCode
 * @return {jQuery} A single jQuery object representing many li tags.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function $currencyCardLi(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	return $(`li.currencyRate[data-currency='${curCode}']`);
}

//
// grid-view functions
//

/**
 * Show the row and column for a given currency in the grid.
 *
 * @param {string} curCode - The three-letter code for the currency to show.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function showGridCurrency(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// get the row and column (th & tds) for the currency
	const $curRow = $currencyGridRow(curCode);
	const $curCol = $currencyGridCol(curCode);
	
	// show the row and column
	$curRow.show();
	$curCol.show();
}

/**
 * Hide the row and column for a given currency in the grid.
 *
 * @param {string} curCode - The three-letter code for the currency to load.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function hideGridCurrency(curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	curCode = String(curCode).toUpperCase();
	if(!curCode.match(/^[A-Z]{3}$/)){
		throw new TypeError(`Invalid country code: ${curCode}`);
	}
		
	// get the row and column (th & tds) for the currency
	const $curRow = $currencyGridRow(curCode);
	const $curCol = $currencyGridCol(curCode);
		
	// hide the row and column
	$curRow.hide();
	$curCol.hide();
}

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

//
// Generic helper functions
//

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

/**
 * Given an amount and a currency code, format the ammount with the appropriate
 * number of decimal places. Integer amounts will show no decimal places.
 *
 * This function only formats the number, it does not pre-fix a symbol or
 * currency code.
 *
 * @param {number} amount
 * @param {string} curCode
 * @return {string} The amount as an appropriately formatted string.
 * @throws {Error} An error is thrown if an invalid currency code is passed.
 * If the code is not a string a `TypeError` is thrown, otherwise a
 * `RangeError` is thrown.
 */
function formatCurrencyAmount(amount, curCode){
	// force the code to upper case and validate
	curCode = assertCurrencyCode(curCode);
	
	// build the format string based on the number of digits
	const numDigits = CURRENCIES[curCode].decimalDigits;
	let formatString = '0,0'; // default to no decimal places
	if(numDigits){
		// more than zero digits after the decimal place
		
		// add the optional period
		formatString += '[.]';
		
		// add the needed decimal places
		for(let d = numDigits; d > 0; d--){
			formatString += '0';
		}
	}
	
	// format and return the amount
	return numeral(amount).format(formatString);
}