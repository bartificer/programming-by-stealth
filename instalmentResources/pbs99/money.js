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
// === The Currency Class (parent class to DecimalCurrency & DenominatedCurrency) ===
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
	// The abstract 'length' property
	//
	
	/**
	 * The number of denominations making up the currency. Each child class
	 * must implement a getter for this property.
	 *
	 * @abstract
	 * @type {number}
	 */
	get length(){
		throw new Error('abstract instance data attribute .length not implemented by child class');
	}
	
	/**
	 * @throws {Error}
	 */
	set length(l){
		throw new Error('read-only attribute');
	}

	//
	// The Constructor
	//

	/**
	 * @param {Object} [details]
	 * @param {string} [details.name="Generic Dollar"] - defaults to an imaginary generic dollar.
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
	 * Convert an amount to a human-friendly string.
	 *
	 * This default implementation inserts commas for thousand separators and
	 * rounds non-whole numbers to two decimal places.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {Error}
	 */
	amountAsHumanFloat(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error
		return numeral(amount).format('0,0[.]00');
	}

	/**
	 * Split a decimal amount into an array of integer amounts in the
	 * appropriate number of denominations.
	 *
	 * This default imlementation simply rounds the amount to the nearest whole
	 * and returns that as the only value in an array. Child classes supporting
	 * more than a single denomination must override.
	 *
	 * @param {number} amount
	 * @return {number[]}
	 * @throws {TypeError}
	 */
	splitAmount(amount){
		amount = parseFloat(amount);
		return [Math.round(amount)];
	}

	/**
	 * All child classes must override this function to render an amount as a
	 * string.
	 * 
	 * @abstract
	 * @param {number} amount
	 * @return {string} E.g. '$12.34' and '-$12.34'
	 * @throws {Error}
	 */
	amountAsString(amount){
		throw new Error('abstract instance function .amountAsString() not implemented by child class');
	}

	/**
	 * All child classes must override this function to render an amount as a
	 * short human string.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {Error}
	 */
	amountAsHumanString(amount){
		throw new Error('abstract instance function .amountAsHumanString() not implemented by child class');
	}

	/**
	 * All child classes must override this function to render an amount as an
	 * English string.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {Error}
	 */
	amountAsEnglishString(amount){
		throw new Error('abstract instance function .amountAsEnglishString() not implemented by child class');
	}
}

//
// === The Decimal Currency Class (Child of Currency) ===
//

class DecimalCurrency extends Currency{
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
	// Implement abstract 'length' property.
	//
	
	/**
	 * @type {number}
	 */
	get length(){
		return this.subDenominationOrder ? 2 : 1;
	}
	
	//
	// The Constructor
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
		// call the parent class's constructor
		super(details);
		
		// deal with data attributes unique to this child class
		if(is.not.object(details)){
			details = {};
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
	}

	//
	// The Instance Functions
	//

	/**
	 * Override the function to convert an amount to a human-friendly sting.
	 *
	 * The returned string will have the appropriate number of decimal places
	 * based on the subDenominationOrder.
	 * E.g. 1234.567 with order 2 → '1,124.57'.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsHumanFloat(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error

		// short-circuit the case where there is no secondary denomination
		// call the parent class's default function
		if(this.subDenominationOrder === 0){
			return super.amountAsHumanInt(amount);
		}

		// build a format string with the appropriate number of decimal places
		const formatString = `0,0[.]${'0'.repeat(this.subDenominationOrder)}`;

		// format and return
		return numeral(amount).format(formatString);
	}

	/**
	 * Implement the abstract function to split a decimal amount into ammounts
	 * of the primary and secondary denominations.
	 *
	 * The amount in the secondary denomination will be rounded to the nearest
	 * whole number.
	 *
	 * If teh amount is negative, both returned values will also be negative.
	 *
	 * @param {number} amount
	 * @return {number[]} The primary and secondary amouns as an array of two integers.
	 * @throws {TypeError}
	 */
	splitAmount(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error

		// short-circuit the simple case were there is no seconardy denomination
		if(this.subDenominationOrder === 0){
			return [Math.round(amount), 0];
		}

		// short-circuit the case where the amount is an integer
		if(is.integer(amount)){
			return [amount, 0];
		}
		
		// NOTE - Math.floor() does not behave as expected with negative numbers
		// so need the absolute value before flooring.

		// keep a record of whether or not the amount is negative
		const isNegative = amount < 0;

		//
		// calculate the primary amount
		//

		// get the absolute value of the amount
		const absAmount = Math.abs(amount);

		// get the absolute and actual values of the primary amount
		const absPrimaryAmount = Math.floor(absAmount);

		//
		// calculate the secondary amount
		//

		// start with just the decimal part of the amount, e.g. 0.123
		let absSecondaryAmount = Math.abs(amount) - absPrimaryAmount;

		// calculate the number of secondary units in one primary based on the order
		const numSecInPri = Math.pow(10, this.subDenominationOrder); // e.g. 100

		// multiply by the number of secondary units in one primary, e.g. 12.3
		absSecondaryAmount *= numSecInPri;

		// round to the nearest whole number, e.g. 12
		absSecondaryAmount = Math.round(absSecondaryAmount);

		// deal with the special case where the secondary amount gets rounded
		// up to be a whole primary unit
		if(absSecondaryAmount === numSecInPri){
			absSecondaryAmount = 0;
			absPrimaryAmount++;
		}
		
		// re-negate if needed
		let primaryAmount = isNegative ? 0 - absPrimaryAmount : absPrimaryAmount;
		let secondaryAmount = isNegative ? 0 - absSecondaryAmount : absSecondaryAmount;

		// return the two amounts
		return [primaryAmount, secondaryAmount];
	}

	/**
	 * Implement the abstract function to render an amount as a string.
	 *
	 * THe returned string will use the primary denomination's symbol and the
	 * default number of decimal places.
	 *
	 * Note that for negative amounts the minus sign will be pre-fixed before
	 * the symbol.
	 *
	 * @param {number} amount
	 * @return {string} E.g. '$12.34' and '-$12.34'
	 * @throws {TypeError}
	 */
	amountAsString(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error

		// build and return the string
		let ans = `${is.negative(amount) ? '-' : ''}${this.denomination.symbol}`;
		ans += this.amountAsHumanFloat(Math.abs(amount));
		return ans;
	}

	/**
	 * Implement the abstract function to render an amount as a short human
	 * string.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsHumanString(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error
		const [primaryAmount, secondaryAmount] = this.splitAmount(amount);
		const absPrimaryAmount = Math.abs(primaryAmount);
		const absSecondaryAmount = Math.abs(secondaryAmount);

		// build and return the string
		let ans = `${is.negative(primaryAmount) ? '-' : ''}${this.denomination.symbol}`;
		ans += this.constructor.amountAsHumanInt(absPrimaryAmount);
		if(absSecondaryAmount > 0 && this.subDenominationOrder > 0){
			ans += ` & ${this.subDenomination.symbol}`;
			ans += this.constructor.amountAsHumanInt(absSecondaryAmount);
		}
		return ans;
	}

	/**
	 * Implement the abstract function to render an amount as an English
	 * string.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsEnglishString(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error
		const [primaryAmount, secondaryAmount] = this.splitAmount(amount);
		const absPrimaryAmount = Math.abs(primaryAmount);
		const absSecondaryAmount = Math.abs(secondaryAmount);

		// build and return the string
		let ans = is.negative(primaryAmount) ? 'minus ' : '';
		ans += `${this.constructor.amountAsHumanInt(absPrimaryAmount)} `;
		ans += absPrimaryAmount === 1 ? this.denomination.singularName : this.denomination.pluralName;
		if(absSecondaryAmount > 0 && this.subDenominationOrder > 0){
			ans += ` and ${this.constructor.amountAsHumanInt(absSecondaryAmount)} `;
			if(absSecondaryAmount === 1){
				ans += this.subDenomination.singularName;
			}else{
				ans += this.subDenomination.pluralName;
			}
		}
		return ans;
	}
}

//
// === The Denominated Currency Class (child of Currency) ===
//

/**
 * A list of the denominations that make up a currecny and the rates between
 * them as an array of Denomination objects separated by whole numbers greater
 * than one.
 *
 * E.g. If a currency's larget denomination is the Bar, and each Bar consists
 * of 20 Strips, and each Strip 100 Slips, then the correct representation
 * would be:
 *
 * `[Bar, 20, Strip, 100, Slip]`
 * 
 * @typedef {Array} DenominationRateList
 */

class DenominatedCurrency extends Currency{
	//
	// Class Functions (Helper functions in this case)
	//
	
	/**
	 * Coerce a value to a denomination rate if possible.
	 *
	 * A denomination rate is the number of a smaller denomination that makes
	 * up one of the next largest denomination, so, it must be a whole number
	 * greater than one.
	 *
	 * @param {*} rate
	 * @return {number}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	static coerceDenominationRate(rate){
		const errMsg = 'rate must be a whole number greater than one';
		rate = parseInt(rate);
		if(is.nan(rate)) throw new TypeError(errMsg);
		if(rate <= 1) throw new RangeError(errMsg);
		return rate;
	}
	
	/**
	 * Coerce a value to a denomination rate list if possible.
	 *
	 * @param {*} list
	 * @return {DenominationRateList}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	static coerceDenominationRateList(list){
		const errMsg = 'list must be an array of denominations separated by rates';
		if(is.not.array(list)) throw new TypeError(errMsg);
		if(list.length < 1) throw new RangeError('list cannot be empty');
		const denominationRateList = [];
		const rateList = [];
		const listCopy = [...list]; // a shallow copy
		
		// start with the largest denomination
		if(!(listCopy[0] instanceof Denomination)){
			throw new TypeError(errMsg);
		}
		denominationRateList.push(listCopy.shift());
		
		// then move forward in pairs
		while(listCopy.length > 0){
			const rate = this.coerceDenominationRate(listCopy.shift());
			const denomination = listCopy.shift();
			if(!(denomination instanceof Denomination)){
				throw new TypeError(errMsg);
			}
			denominationRateList.push(rate, denomination);
		}
		
		// return the list
		return denominationRateList;
	}
	
	//
	// The 'denominations' property
	//

	/**
	 * @type {DenominationRateList}
	 */
	get denominations(){
		const ans = [this._denominationList[0]];
		for(let i = 1; i < this._denominationList.length; i++){
			ans.push(this._rateList[i - 1], this._denominationList[i]);
		}
		return ans;
	}

	/**
	 * @type {Denomination}
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	set denominations(drl){
		drl = this.constructor.coerceDenominationRateList(drl);
		this._denominationList = [drl[0]];
		this._rateList = [];
		for(let i = 1; i < drl.length; i += 2){
			this._rateList.push(drl[i]);
			this._denominationList.push(drl[i + 1]);
		}
	}
	
	/**
	 * The primary denomination.
	 *
	 * @type {Denomination}
	 */
	get denomination(){
		return this._denominationList[0];
	}
	
	/**
	 * @throws {Error}
	 */
	set denomination(d){
		throw new Error('read-only property, set .denominations instead');
	}
	
	/**
	 * @type {Denomination[]}
	 */
	get denominationList(){
		return [...this._denominationList]; // shallow clone
	}
	
	/**
	 * @throws {Error}
	 */
	set denominationList(dl){
		throw new Error('read-only property, set .denominations instead');
	}
	
	/**
	 * @type {number[]}
	 */
	get rateList(){
		return [...this._rateList]; // shallow clone
	}
	
	/**
	 * @throws {Error}
	 */
	set RateList(rl){
		throw new Error('read-only property, set .denominations instead');
	}
	
	//
	// Implement abstract 'length' property.
	//
	
	/**
	 * @type {number}
	 */
	get length(){
		return this._denominationList.length;
	}

	//
	// The Constructor
	//

	/**
	 * @param {Object} [details]
	 * @param {string} [details.name='Buttons']
	 * @param {DenominationRateList} [details.denominations] - the denominations and the ratios between them from the largest to the smallest. Defaults to a single denomination of Buttons.
	 * @param {boolean} [details.imaginary=false] - whether or not the currency is imaginary.
	 * Generally defaults to false, but defaults to true if no name is passed.
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	constructor(details){
		if(is.not.object(details)){
			details = {};
		}
		
		// default the name and imaginary status before calling the parent constructor
		if(is.undefined(details.name)){
			details.name = "Buttons";
			if(is.undefined(details.imaginary)){
				details.imaginary = true;
			}
		}
		
		// call the parent class's constructor
		super(details);
		
		// deal with data attributes unique to this child class
		if(is.undefined(details.denominations)){
			this.denominations = [new Denomination('B', 'Button')];
		}else{
			this.denominations = details.denominations;
		}
	}

	//
	// The Instance Functions
	//

	/**
	 * Override the function to convert an amount to a human-friendly sting.
	 *
	 * For single denominations the conversion from the Currency class will be
	 * used. For currencies with multiple denominations, the number of decimal
	 * places will be the order of magnitude of the rate between the largest
	 * and smallest denominations.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsHumanFloat(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error
		
		// default single-denomination currencies to the parent class
		if(this.length === 1){
			return super.amountAsHumanFloat(amount);
		}
		
		// calculate the total rate between the smallest and largest denominations
		let totalRate = 1;
		for(const rate of this.rateList){
			totalRate *= rate;
		}
		
		// get the order of magnitude of the total rate
		// simply the number of digits minus one
		const order = String(totalRate).length - 1;
		
		// build a format string with the appropriate number of decimal places
		const formatString = `0,0[.]${'0'.repeat(order)}`;

		// format and return
		return numeral(amount).format(formatString);
	}

	/**
	 * Override the function to split a decimal amount into ammounts of each
	 * denomination.
	 *
	 * The amount will be interpreted as being in the largest denomination.
	 *
	 * The amount in the smallest denomination will be rounded to the nearest
	 * whole number.
	 *
	 * If the amount is negative, all returned sub-amounts will be negative.
	 *
	 * @param {number} amount
	 * @return {number[]} The amounts as an array of integers, largest denomination first.
	 * @throws {TypeError}
	 */
	splitAmount(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error
		
		// if there's only one denomination, use the default implementation from the parent class
		if(this.length === 1){
			return super.splitAmount(amount);
		}
		
		const amounts = [];
		
		//
		// round to a whole number of the smallest denomination
		//
		
		// NOTE - Math.floor() does not behave as expected with negative numbers
		// so need the absolute value before flooring.
		
		// to avoid rounding problems, convert to absolute value if negative and remember
		const isNegative = amount < 0;
		let absAmount = Math.abs(amount);
		
		// Start with the amount in the largest denomination
		let currentAbsAmount = Math.floor(absAmount);
		amounts.push(currentAbsAmount);
		
		// keep just the decimal part
		absAmount = absAmount - currentAbsAmount;
		
		//loop over the remaining denominations
		for(let rate of this.rateList){
			// if there's nothing left, exit the loop
			if(absAmount === 0) break;
			
			// multiple by the current rate
			absAmount *= rate;
			
			// get and store the whole number part
			currentAbsAmount = Math.floor(absAmount);
			amounts.push(currentAbsAmount);
			
			// keep just the decimal part
			absAmount = absAmount - currentAbsAmount;
		}
		
		// if the decimal part is >= 0.5, increment the lowest denomination by 1 and ripple up if needed
		if(absAmount >= 0.5){
			// increment the lowest denomination
			amounts[amounts.length - 1]++;
			
			// ripple the increment up the denominations if needed
			let doneRippling = false;
			for(let i = this.rateList.length - 1; !doneRippling && i >= 0; i--){
				if(amounts[i+1] === this.rateList[i]){
					amounts[i+1] = 0;
					amounts[i]++;
				}else{
					doneRippling = true;
				}
			}
		}
		
		// re-negate if needed
		if(isNegative){
			for(let i = 0; i < amounts.length; i++){
				amounts[i] = 0 - amounts[i];
			}
		}
		
		// return the amounts
		return amounts;
	}

	/**
	 * Implement the abstract function to render an amount as a string.
	 *
	 * The returned string will consist of the symbol for the largest
	 * denomination followed by the number as a human-friendly floating
	 * point number.
	 * 
	 * Note that for negative amounts the minus sign will be pre-fixed before
	 * the first symbol.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsString(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error

		// build and return the string
		let ans = is.negative(amount) ? '-' : '';
		ans += this.denomination.symbol;
		ans += this.amountAsHumanFloat(Math.abs(amount));
		return ans;
	}

	/**
	 * Implement the abstract function to render an amount as a short human
	 * string.
	 *
	 * The amount will be rendered as a list if denomination symbols and
	 * amounts, with zero-valued denominations skipped. If the amount is
	 * zero the largest denomination symbol will be shown, followed by a
	 * zero.
	 *
	 * If the amount is negative the minus sign will be pre-fixed before the
	 * symbold for the largest denomination.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsHumanString(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error
		
		// short-circut zero
		if(amount === 0){
			return `${this.denomination.symbol}0`;
		}
		
		// split the amount into denominations
		const denominatedAmounts = this.splitAmount(amount);
		
		// filter down to non-zero amounts, pre-fix symbols, and format
		const formattedAmounts = [];
		for(let i = 0; i < denominatedAmounts.length; i++){
			// skip zero amounts
			if(denominatedAmounts[i] === 0) continue;
			
			// format the amount
			let formattedAmount = this.denominationList[i].symbol;
			formattedAmount += this.constructor.amountAsHumanInt(Math.abs(denominatedAmounts[i]));
			formattedAmounts.push(formattedAmount);
		}
		
		// assemble the final answer and return it
		return `${is.negative(amount) ? '-' : ''}${formattedAmounts.join(' ')}`;
	}

	/**
	 * Implement the abstract function to render an amount as an English
	 * string.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsEnglishString(amount){
		amount = this.constructor.coerceAmount(amount); // could throw error
		
		// short-circut zero
		if(amount === 0){
			return `zero ${this.denomination.pluralName}`;
		}
		
		// split the amount into denominations
		const denominatedAmounts = this.splitAmount(amount);
		
		// filter down to non-zero amounts, format, and post-fix names
		const formattedAmounts = [];
		for(let i = 0; i < denominatedAmounts.length; i++){
			// skip zero amounts
			if(denominatedAmounts[i] === 0) continue;
			
			// format the amount
			const absDenominatedAmount = Math.abs(denominatedAmounts[i]);
			let formattedAmount = this.constructor.amountAsHumanInt(absDenominatedAmount) + ' ';
			if(absDenominatedAmount === 1){
				formattedAmount += this.denominationList[i].singularName;
			}else{
				formattedAmount += this.denominationList[i].pluralName;
			}
			formattedAmounts.push(formattedAmount);
		}
		
		// assemble the final answer and return it
		return `${is.negative(amount) ? 'minus ' : ''}${humanJoiner.join(formattedAmounts)}`;
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
	// The Constructor
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
