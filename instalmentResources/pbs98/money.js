//
// === The Denomination Class ==
//

class Denomination{
	//
	// The 'symbol' property
	//

	/**
	 * @type {string}
	 */
	get symbol(){
		return this._symbol;
	}

	/**
	 * @type {string}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	set symbol(s){
		if(is.not.string(s)){
			throw new TypeError('symbol must be a string');
		}
		if(is.empty(s)){
			throw new RangeError('symbol cannot be empty');
		}
		this._symbol = s;
	}

	//
	// The 'singularName', 'pluralName' & 'name' properties
	//

	/**
	 * @type {string}
	 */
	get singularName(){
		return this._singularName;
	}

	/**
	 * @type {string}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	set singularName(sn){
		if(is.not.string(sn)){
			throw new TypeError('singularName must be a string');
		}
		if(is.empty(sn)){
			throw new RangeError('singularName cannot be empty');
		}
		this._singularName = sn;
	}

	/**
	 * @type {string}
	 */
	get pluralName(){
		return this._pluralName;
	}

	/**
	 * @type {string}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	set pluralName(pn){
		if(is.not.string(pn)){
			throw new TypeError('pluralName must be a string');
		}
		if(is.empty(pn)){
			throw new RangeError('pluralName cannot be empty');
		}
		this._pluralName = pn;
	}

	/**
	 * An alias for `singularName`.
	 *
	 * @type {string}
	 */
	get name(){
		return this.singularName;
	}

	/**
	 * An alias for `singularName`.
	 * @type {string}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	set name(n){
		this.singularName = n; // could throw error
	}

	//
	// The Constructor
	//

	/**
	 * @param {string} [symbol='#']
	 * @param {string} [singularName='Coin']
	 * @param {string} [pluralName] - defaults to the singular name with an 's' appended.
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	constructor(symbol, singularName, pluralName){
		if(!symbol) symbol = '#';
		this.symbol = symbol; // could throw error
		if(!singularName) singularName = 'Coin';
		this.singularName = singularName; // could throw error
		if(!pluralName) pluralName = `${this.singularName}s`;
		this.pluralName = pluralName; // could throw error
	}
}

//
// === The Currency Class ===
//

class Currency{
	//
	// Class Functions (helper functions in this case)
	//

	/**
	 * Coerce a value to a floating point number if possible.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	static coerceAmount(amount){
		amount = parseFloat(amount);
		if(is.nan(amount)) throw new TypeError('amount must be a number');
		return amount;
	}

	/**
	 * Convert an amount to a human-friendly integer string, e.g. 1234.56 → '1,235'.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	static amountAsHumanInt(amount){
		amount = this.coerceAmount(amount);
		return numeral(amount).format('0,0');
	}

	//
	// The 'name' property
	//

	/**
	 * @type {string}
	 */
	get name(){
		return this._name;
	}

	/**
	 * @type {string}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	set name(n){
		if(is.not.string(n)){
			throw new TypeError('name must be a string');
		}
		if(is.empty(n)){
			throw new RangeError('name cannot be empty');
		}
		this._name = n;
	}

	//
	// The 'denomination' property
	//

	/**
	 * @type {Denomination}
	 */
	get denomination(){
		return this._denomination;
	}

	/**
	 * @type {Denomination}
	 * @throws {TypeError}
	 */
	set denomination(d){
		if(!(d instanceof Denomination)){
			throw new TypeError('denomination must be an instance of the class Denomination');
		}
		this._denomination = d;
	}

	//
	// The 'subDenomination' property
	//

	/**
	 * @type {Denomination}
	 */
	get subDenomination(){
		return this._subDenomination || null;
	}

	/**
	 * @type {Denomination}
	 * @throws {TypeError}
	 */
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

	//
	// The 'subDenominationOrder'
	//

	/**
	 * @type {number}
	 */
	get subDenominationOrder(){
		return this._subDenominationOrder || 0;
	}

	/**
	 * Must be a whole number greater than or equal to zero.
	 * @type {number}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
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

	//
	// The 'imaginary' & 'real' properties
	//

	/**
	 * @type {boolean}
	 */
	get imaginary(){
		return this._imaginary;
	}

	/**
	 * @type {boolean}
	 */
	set imaginary(i){
		this._imaginary = i ? true : false;
	}

	/**
	 * @type {boolean}
	 */
	get real(){
		return !this._imaginary;
	}

	/**
	 * @type {boolean}
	 */
	set real(r){
		this._imaginary = r ? false : true;
	}

	//
	// The Cosntructor
	//

	/**
	 * @param {Object} [details]
	 * @param {string} [details.name="Generic Dollar"] - defaults to an imaginary generic dollar.
	 * @param {Denomination} [details.denomination] - the primary denomination, defaults to the Dollar.
	 * @param {Denomination|null} [details.subDenomination] - the secondary denomination, defaults to the Cent. Pass null or a subDenominationOrder of 0 not to have a secondary denomination.
	 * @param {number} [details.subDenominationOrder=2]
	 * @param {boolean} [details.imaginary=false] - whether or not the currency is imaginary.
	 * Generally defaults to false, but defaults to true if no name is passed.
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	constructor(details){
		if(is.not.object(details)){
			details = {};
		}
		let defaultToImaginary = false;
		if(is.undefined(details.name)){
			this.name =  'Generic Dollar';
			defaultToImaginary = true;
		}else{
			this.name = details.name; // could throw error
		}
		if(is.undefined(details.denomination)){
			this.denomination = new Denomination('$', 'Dollar');
		}else{
			this.denomination = details.denomination;
		}
		if(is.null(details.subDenomination) || details.subDenominationOrder === 0){
			this.subDenominationOrder = 0;
		}else{
			if(is.undefined(details.subDenomination)){
				this.subDenomination = new Denomination('¢', 'Cent');
			}else{
				this.subDenomination = details.subDenomination;
			}
			if(is.undefined(details.subDenominationOrder)){
				this.subDenominationOrder = 2;
			}else{
				this.subDenominationOrder = details.subDenominationOrder;
			}
		}
		if(is.undefined(details.imaginary)){
			this.imaginary = defaultToImaginary;
		}else{
			this.imaginary = details.imaginary;
		}
	}

	//
	// The Instance Functions
	//

	/**
	 * Convert an amount to a human-friendly sting with the appropriate number of decimal
	 * places based on the subDenominationOrder. E.g. 1234.567 with order 2 → '1,124.57'.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
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

	/**
	 * Split a decimal amount into a number of primary and secondary denominations.
	 * The secondary denomination will be rounded to the nearest whole number.
	 *
	 * @param {number} amount
	 * @return {number[]} The primary and secondary amouns as an array of two integers.
	 * @throws {TypeError}
	 */
	splitAmount(amount){
		amount = parseFloat(amount);
		if(is.nan(amount)) throw new TypeError('amount must be a number');

		// short-circuit the simple case were there is no seconardy denomination
		if(this.subDenominationOrder === 0){
			return [Math.round(amount), 0];
		}

		// short-circuit the case where the amount is an integer
		if(is.integer(amount)){
			return [amount, 0];
		}

		//
		// calculate the primary amount
		//

		// NOTE - Math.floor() does not behave as expected with negative numbers
		// so need the absolute value before flooring.

		// keep a record of whether or not the amount is negative
		const isNegative = amount < 0;

		// get the absolute value of the amount
		const absAmount = Math.abs(amount);

		// get the absolute and actual values of the primary amount
		const absPrimaryAmount = Math.floor(absAmount);
		let primaryAmount = isNegative ? 0 - absPrimaryAmount : absPrimaryAmount;

		//
		// calculate the secondary amount
		//

		// start with just the decimal part of the amount, e.g. 0.123
		let secondaryAmount = Math.abs(amount) - absPrimaryAmount;

		// calculate the number of secondary units in one primary based on the order
		const numSecInPri = Math.pow(10, this.subDenominationOrder); // e.g. 100

		// multiply by the number of secondary units in one primary, e.g. 12.3
		secondaryAmount *= numSecInPri;

		// round to the nearest whole number, e.g. 12
		secondaryAmount = Math.round(secondaryAmount);

		// deal with the special case where the secondary amount gets rounded
		// up to be a whole primary unit
		if(secondaryAmount === numSecInPri){
			secondaryAmount = 0;
			if(isNegative){
				primaryAmount--;
			}else{
				primaryAmount++;
			}
		}

		// return the two amounts
		return [primaryAmount, secondaryAmount];
	}

	/**
	 * Render an amount as a string using the primary denomination's symbol
	 * and the default number of decimal places.
	 *
	 * Note that for negative amounts the minus sign will be pre-fixed before
	 * the symbol.
	 *
	 * @param {number} amount
	 * @return {string} E.g. '$12.34' and '-$12.34'
	 * @throws {TypeError}
	 */
	amountAsString(amount){
		amount = parseFloat(amount);

		// build and return the string
		let ans = `${is.negative(amount) ? '-' : ''}${this.denomination.symbol}`;
		ans += this.amountAsHumanFloat(Math.abs(amount));
		return ans;
	}

	/**
	 * Render an amount as a short human string.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsHumanString(amount){
		amount = parseFloat(amount);
		const [primaryAmount, secondaryAmount] = this.splitAmount(amount);

		// build and return the string
		let ans = `${is.negative(primaryAmount) ? '-' : ''}${this.denomination.symbol}`;
		ans += this.constructor.amountAsHumanInt(Math.abs(primaryAmount));
		if(secondaryAmount > 0 && this.subDenominationOrder > 0){
			ans += ` & ${this.subDenomination.symbol}`;
			ans += this.constructor.amountAsHumanInt(Math.abs(secondaryAmount));
		}
		return ans;
	}

	/**
	 * Render an amount as an English string.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsEnglishString(amount){
		amount = parseFloat(amount);
		const [primaryAmount, secondaryAmount] = this.splitAmount(amount);

		// build and return the string
		let ans = `${is.negative(primaryAmount) ? ' minus ' : ''}`;
		ans += this.constructor.amountAsHumanInt(Math.abs(primaryAmount));
		ans += ` ${primaryAmount === 1 ? this.denomination.singularName : this.denomination.pluralName}`;
		if(secondaryAmount > 0 && this.subDenominationOrder > 0){
			ans += ` and ${this.constructor.amountAsHumanInt(secondaryAmount)} `;
			if(secondaryAmount === 1){
				ans += this.subDenomination.singularName;
			}else{
				ans += this.subDenomination.pluralName;
			}
		}
		return ans;
	}
}

//
// === The Monetary Amount Class ===
//

class MonetaryAmount{
	//
	// The 'currency' property
	//

	/**
	 * @type {Currency}
	 */
	get currency(){
		return this._currency;
	}

	/**
	 * @type {Currency}
	 * @throws {TypeError}
	 */
	set currency(c){
		if(!(c instanceof Currency)){
			throw new TypeError('currency must be an instance of the class Currency');
		}
		this._currency = c;
	}

	//
	// The 'amount' property
	//

	/**
	 * @type {number}
	 */
	get amount(){
		return this._amount;
	}

	/**
	 * @type {number}
	 * @throws {TypeError}
	 */
	set amount(a){
		this._amount = Currency.coerceAmount(a); // could throw error
	}

	//
	// The Cosntructor
	//

	/**
	 * @param {number} [amount=0]
	 * @param {Currency} [currency] - the currency, defaults to the defaults for the Currency constructor.
	 * @throws {TypeError}
	 */
	constructor(amount, currency){
		if(is.undefined(amount)){
			this.amount = 0;
		}else{
			this.amount = Currency.coerceAmount(amount); // could throw error
		}
		if(is.undefined(currency)){
			this.currency = new Currency();
		}else{
			this.currency = currency; // could throw error
		}
	}

	//
	// The Instance Functions
	//

	/**
	 * Add an amount to this amount.
	 *
	 * @param {number|CurrencyAmount} amount — a number or a CurrencyAmount in the same currency.
	 * @return {CurrencyAmount} Returmns a reference to self to facilitate function chaning.
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
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

	/**
	 * Split the amount into a number of primary and secondary denominations.
	 * The secondary denomination will be rounded to the nearest whole number.
	 *
	 * @return {number[]}
	 */
	split(){
		return this.currency.splitAmount(this.amount);
	}

	/**
	 * Render the amount as a string using the primary denomination's symbol
	 * and the default number of decimal places.
	 *
	 * @return {string}
	 */
	asString(){
		return this.currency.amountAsString(this.amount);
	}

	/**
	 * Render the amount as a short human string.
	 *
	 * @return {string}
	 */
	asHumanString(){
		return this.currency.amountAsHumanString(this.amount);
	}

	/**
	 * Render the amount as an English string.
	 *
	 * @return {string}
	 */
	asEnglishString(){
		return this.currency.amountAsEnglishString(this.amount);
	}
}
