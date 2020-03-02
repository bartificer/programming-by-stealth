//
// Define globally scoped helper variables
//

// a lookup table for the various templates
var TEMPLATES = {
	forms: {
		addBaseCurrency: '', // loaded by document ready handler
		showHideRates: '' // loaded by document ready handler
	},
	errorCard: '', // loaded by document ready handler
	currencies: {
		col: '',  // loaded by document ready handler
		loadingCard: '',  // loaded by document ready handler
		displayCard: '' // loaded by document ready handler
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
	DISPLAY_CURRENCIES[curCode] = CURRENCIES[curCode].defaultDisplay ? true : false;
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
	TEMPLATES.forms.addBaseCurrency = $('#addCardFormTpl').html();
	TEMPLATES.forms.showHideRates = $('#showHideRatesFormTpl').html();
	TEMPLATES.errorCard = $('#errorCardTpl').html();
	TEMPLATES.currencyCardCol = $('#currencyCardColTpl').html();
	TEMPLATES.currencies.col = $('#currencyColTpl').html();
	TEMPLATES.currencies.loadingCard = $('#currencyLoadingCardTpl').html();
	TEMPLATES.currencies.displayCard = $('#currencyDisplayCardTpl').html();
	
	// get refences to the place-holders for the various UI components
	const $currencyControls = $('#currency_controls'); // where the global UI cards go
	const $cards = $('#currency_cards'); // where the currency cards go
	
	// load the currency data
	await loadCurrencyRates();
	
	// add the Currency Selection form into the page
	$currencyControls.empty().append(biuldCurrencySelectionFormUI());
	
	// load all the currency cards
	//$cards.empty().append(buildCurrencyCards());
	
	// load the placeholders for the currency cards into the page
	//$cards.empty().append(buildCurrencyCardPlaceholders());
	
	// add the New Card Form into the page
	//$cards.append(buildNewCardFormUI());
	
	// load the cards for the default currencies
	//for(const curCode of SORTED_CURRENCY_CODES){
	//	if(CURRENCIES[curCode].defaultCard){
	//		showCurrencyCard(curCode, true).catch(function(e){
	//			console.error(`failed to show '${curCode}'`, e);
	//		});
	//	}
	//}
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
function biuldCurrencySelectionFormUI(){
	// build the show/hide rates form
	const $currencySelectionForm = $(Mustache.render(
		TEMPLATES.forms.showHideRates,
		CURRENCY_CONTROL_VIEW
	));
	
	// enable the appropriate toggles
	for(const curCode of SORTED_CURRENCY_CODES){
		if(DISPLAY_CURRENCIES[curCode]){
			$(`input[value='${curCode}']`, $currencySelectionForm).prop('checked', true);
		}
	}
	
	// add event handlers to all the toggles and trigger them to get the
	// inital rendering right
	$('input[type="checkbox"]', $currencySelectionForm).on('input', function(){
		// get a reference to a jQuery object representing the toggle
		const $toggle = $(this);
		
		// get the currency the toggle controls
		const curCode = $toggle.val();
		
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
		
		// save the states to the global variable
		DISPLAY_CURRENCIES[curCode] = $toggle.prop('checked') ? true : false;
		
		// show/hide the rates for this currency in all cards
		const $rateLis = $(`li.currencyRate[data-currency='${curCode}']`);
		if(DISPLAY_CURRENCIES[curCode]){
			$rateLis.show();
		}else{
			$rateLis.hide();
		}
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
		TEMPLATES.forms.addBaseCurrency,
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
			
		// show the requested card (avoid unhandled promise rejection)
		showCurrencyCard(curCode).catch(function(e){
			console.error(`failed to show '${curCode}'`, e);
		});		
	});
	
	// return the form
	return $addCardForm;
}

/**
 * A function to build the the card, and its contianing col, for a given currency.
 *
 * @param {string} curCode
 */
function buildCurrencyCardCol(curCode){
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
			rate: numeral(CURRENCIES[curCode].rates[toCurCode]).format('0,0[.]00'),
			rawRate: CURRENCIES[curCode].rates[toCurCode],
			...CURRENCIES[toCurCode]
		});
	}
	console.debug(`generated view for '${curCode}':`, cardView);
	
	// generate the HTML
	const cardHTML = Mustache.render(TEMPLATES.currencyCardCol, cardView);
	
	// convert the HTML to a jQuery object
	const $card = $(cardHTML);
	
	// hide the currencies that should not be showing
	for(const toCurCode of SORTED_CURRENCY_CODES){
		if(!DISPLAY_CURRENCIES[toCurCode]){
			$(`li.currencyRate[data-currency='${toCurCode}']`, $card).hide();
		}
	}
	
	// LEFT OFF HERE!!!
	
	//// add a click handler to the close button
	//$('button.close', $card).click(function(){
	//	// hide the card
	//	$currencyCardCol(curCode).hide();
	//	
	//	// update the add card select
	//	updateAddCardSelectOptions();
	//});

	//// add an input handler to the base amount text box
	//$('input.baseAmount', $card).on('input', function(){
	//	// convert the DOM object for the input to a jQuery object
	//	const $input = $(this);
	//	
	//	// get a reference to the card's form
	//	const $form = $input.closest('form');
	//	
	//	// enable the display of the validation state on the form
	//	$form.addClass('was-validated');
	//	
	//	// read the base amount for the form
	//	let baseAmount = $input.val();
	//	
	//	// default to 1 if invalid
	//	if($input.is(':invalid')){
	//		baseAmount = 1;
	//	}
	//	
	//	// remove a trailing dot if present ('4.' to '4')
	//	baseAmount = String(baseAmount).replace(/[.]$/, '');
	//	
	//	// do the conversion
	//	updateCardConversions(curCode, baseAmount);
	//});
	
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
		$cards = $cards.add(buildCurrencyCardCol(baseCurCode));
	}
	
	// return the placeholder cards
	return $cards;
}

/**
 * A function to build the placeholder cards for each currency.
 *
 * @return {jQuery} Returns a single jQuery object representing all the cards.
 */
function buildCurrencyCardPlaceholders(){
	let $placeholderCards = $(); // empty jQuery object
	for(const curCode of SORTED_CURRENCY_CODES){
		const $card = $(Mustache.render(
			TEMPLATES.currencies.col, // the template
			{ // the view
				base: {
					code: curCode,
					...CURRENCIES[curCode]
				}
			},
			{ // the partials
				loadingCard: TEMPLATES.currencies.loadingCard
			}
		)).hide();
		$placeholderCards = $placeholderCards.add($card);
	}
	
	// return the placeholder cards
	return $placeholderCards;
}

//
// Helper functions
//

/**
 * Get a jQuery object representing the col for a given currency card.
 * 
 * @param {string} curCode
 * @return {jQuery}
 */
function $currencyCardCol(curCode){
	return $(`.currencyCol[data-currency=${curCode}]`);
}

//
// LEGACY
//

/**
 * An asynchronous function to show the card for a given currency.
 *
 * @param {string} curCode - The three-letter code for the currency to load.
 * @param {boolean} [skipFocus=false] - Pass a truthy value to skip the
 * focusing of the card after loading.
 * @throws {TypeError} A type error is throw if the currency code is not valid.
 */
async function showCurrencyCard(curCode, skipFocus){
	// validate the currency code
	curCode = String(curCode).toUpperCase();
	if(!curCode.match(/^[A-Z]{3}$/)){
		throw new TypeError(`Invalid country code: ${curCode}`);
	}
	
	// get the col for the currency
	const $curCol = $(`.currencyCol[data-currency='${curCode}']`);
	
	// if the card has already been loaded, just show it and exit
	if($curCol.data('loaded')){
		console.debug(`card for '${curCode}' already loaded, so just showing it`);
		
		// show the col
		$curCol.show();
		
		// focus the card if appropriate
		if(!skipFocus) $('input.baseAmount', $curCol).focus();
		
		// update the select in the add card form
		updateAddCardSelectOptions();
		
		// end the function
		return;
	}
	
	// if the card is in the process of loading, do nothing
	if($curCol.data('loading')){
		console.debug(`card for '${curCode}' already loading, will not start another load`);
		return;
	}
	
	// if we got here, try render the card
	$curCol.data('loading', true).show();
	try{
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
		for(const cc of SORTED_CURRENCY_CODES){
			if(cc === curData.base) continue; // skip self
			cardView.rates.push({
				code: cc,
				rate: numeral(curData.rates[cc]).format('0,0[.]00'),
				rawRate: curData.rates[cc],
				...CURRENCIES[cc]
			});
		}
		console.debug(`generated view for '${curData.base}':`, cardView);
		
		// generate the HTML
		const cardHTML = Mustache.render(TEMPLATES.currencies.displayCard, cardView);
		
		// convert the HTML to a jQuery object
		const $card = $(cardHTML);
		
		// hide the currencies that should not be showing
		for(const cc of SORTED_CURRENCY_CODES){
			if(!DISPLAY_CURRENCIES[cc]){
				$(`li.currencyRate[data-currency='${cc}']`, $card).hide();
			}
		}
		
		// add a click handler to the close button
		$('button.close', $card).click(function(){
			// hide the card
			$curCol.hide();
			
			// update the add card select
			updateAddCardSelectOptions();
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
		
		// replace the placeholder with the card
		$curCol.empty().append($card);
		
		// focus the card if appropriate
		if(!skipFocus) $('input.baseAmount', $curCol).focus();
	}catch(err){
		// log the error's details to the console
		console.log(`failed to render currency '${curCode}'`, err);
		
		// generate an error card
		const errorCardHTML = Mustache.render(
			TEMPLATES.errorCard, // template string
			{ // view
				message: `Failed to load '${curCode}'.`
			} 
		);
		
		// show the error card
		$curCol.empty().append(errorCardHTML);
		
		// remove the loading flag from the col
		$curCol.data('loading', false);
		
		// end the function
		return;
	}
	
	// mark the col as loaded and 
	$curCol.data('loading', false).data('loaded', true);
	
	// update the rendering of the select for adding cards
	updateAddCardSelectOptions();
}

/**
 * Update the conversions within a loaded card for a given currency.
 * 
 * @param {string} curCode - The three-letter code for the card to update.
 * @param {number} baseAmount - The amount of the base currency to convert.
     * @throws {TypeError} A type error is throw if the currency code or amount
     * are not valid.
     * @throws {Error} A generic error is thrown if the currency's card is not
     * loaded.
 */
function updateCardConversions(curCode, baseAmount){
	// validate the currency code
	curCode = String(curCode).toUpperCase();
	if(!curCode.match(/^[A-Z]{3}$/)){
		throw new TypeError(`Invalid country code: ${curCode}`);
	}
	
	// get the col for the currency
	const $curCol = $(`.currencyCol[data-currency='${curCode}']`);
	
	// if the card has not been loaded, throw an error
	if(!$curCol.data('loaded')){
		throw new Error(`Currency ${curCode} is not loaded`);
	}
	
	// validate the amount
	if(!String(baseAmount).match(/^\d+(?:[.]\d+)?$/)){
		throw new TypeError(`Invalid base amount: ${baseAmount}`);
	}
	
	// update all the renderings of the base amount
	$('.baseAmount', $curCol).text(numeral(baseAmount).format('0,0[.]00'));
	
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
		$convSpan.text(numeral(convAmount).format('0,0[.]00'));
	}
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
		const $curCol = $(`.currencyCol[data-currency='${curCode}']`);
		
		// enabled/disable this option based on the visibility
		// of the matching card
		$opt.prop('disabled', $curCol.is(':hidden') ? false : true );
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