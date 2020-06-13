//
// === The Denomination Class ==
//

class Denomination{
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
	// The Cosntructor
	//
	
	/**
	 * @param {string} [name='Coin']
	 * @param {string} [symbol='#']
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	constructor(name, symbol){
		if(!name) name = 'Coin';
		if(!symbol) symbol = '#';
		this.name = name; // could throw error
		this.symbol = symbol; // could throw error
	}
}

//
// === The Currency Class ===
//

class Currency{
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
			throw new TypeError('denomination must be an instanece of the class Denomination');
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
			throw new TypeError('subDenomination must be an instanece of the class Denomination');
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
			this.denomination = new Denomination('Dollar', '$');
		}else{
			this.denomination = details.denomination;
		}
		if(is.null(details.subDenomination) || details.subDenominationOrder === 0){
			this.subDenominationOrder = 0;
		}else{
			if(is.undefined(details.subDenomination)){
				this.subDenomination = new Denomination('Cent', '¢');
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
	 * Split a decimal amount into a number of primary and secondary denominations.
	 * The secondary denomination will be rounded to the nearest whole number.
	 *
	 * @param {number} amount
	 * @return {number[]}
	 * @throws {TypeError}
	 */
	splitAmount(amount){
		amount = parseFloat(amount);
		if(is.nan(amount)) throw new TypeError('amount must be a number');
		
		// NOTE - Math.floor() does not behave as expected with negative numbers
		// so use the absolute value when calculating the primary amount, then
		// re-negate if needed
		const isNegative = amount < 0;
		let primaryAmount = Math.floor(Math.abs(amount));
		let secondaryAmount = 0;
		if(this.subDenominationOrder > 0){
			secondaryAmount = Math.abs(amount) - primaryAmount;
			secondaryAmount *= Math.pow(10, this.subDenominationOrder);
			secondaryAmount = Math.round(secondaryAmount);
			if(secondaryAmount === Math.pow(10, this.subDenominationOrder)){
				secondaryAmount = 0;
				if(isNegative){
					primaryAmount--;
				}else{
					primaryAmount++;
				}
			}
		}
		if(isNegative) primaryAmount = 0 - primaryAmount;
		return [primaryAmount, secondaryAmount];
	}
	
	/**
	 * Render an amount as a string using the primary denomination's symbol
	 * and the default number of decimal places.
	 *
	 * @param {number} amount
	 * @return {string}
	 * @throws {TypeError}
	 */
	amountAsString(amount){
		amount = parseFloat(amount);
		if(is.nan(amount)) throw new TypeError('amount must be a number');
		let ans = this.symbol;
		if(this.subDenominationOrder === 0){
			ans += numeral(amount).format('0,0');
		}else{
			ans += numeral(amount).format('0,0[.]' + '0'.repeat(this.subDenominationOrder));
		}
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
		if(is.nan(amount)) throw new TypeError('amount must be a number');
		const (primaryAmount, secondaryAmount) = this.splitAmount(amount);
		
		let ans = is.negative(primaryAmount) ? '-' : '';
		ans += this.denomination.symbol;
		ans += numeral(Math.abs(primaryAmount)).format('0,0');
		if(secondaryAmount > 0 && this.subDenominationOrder > 0){
			ans += ' & ' + this.subDenomination.symbol;
			ans += numeral(secondaryAmount).format('0,0');
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
		if(is.nan(amount)) throw new TypeError('amount must be a number');
		const (primaryAmount, secondaryAmount) = this.splitAmount(amount);
		
		let ans = is.negative(primaryAmount) ? 'minus ' : '';
		ans += numeral(Math.abs(primaryAmount)).format('0,0')
		ans += ' ' + this.denomination.name;
		if(primaryAmount > 1) ans += 's';
		if(secondaryAmount > 0 && this.subDenominationOrder > 0){
			ans += ' and ';
			ans += numeral(secondaryAmount).format('0,0');
			ans += ' ' + this.subDenomination.name;
			if(secondaryAmount > 1) ans += 's';
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
			throw new TypeError('currency must be an instanece of the class Currency');
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
		a = parseFloat(a);
		if(is.nan(a)){
			throw new TypeError('amount must be a number');
		}
		this._amount = a;
	}
	
	//
	// The Cosntructor
	//
	
	/**
	 * @param {Object} [details]
	 * @param {Currency} [details.currency] - the currency, defaults to the defaults for the Currency constructor.
	 * @param {number} [details.amount=0]
	 * @throws {TypeError}
	 */
	constructor(details){
		if(is.not.object(details)){
			details = {};
		}
		if(is.undefined(details.amount)){
			this.amount = 0;
		}else{
			details.amount = parseFloat(details.amount);
			if(is.nan(details.amount)){
				throw new TypeError('amount must be a number');
			}
			this.amount = details.amount;
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
			amount = parseFloat(amount);
			if(is.nan(amount)){
				throw new TypeError('amount must be a number or an instance of MonetaryAmount');
			}
			this.amount += amount;
		}
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