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
		this.name = name; // could throw errpr
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
	 * @param {string} [name='Money']
	 * @param {string} [imaginary=false]
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	constructor(name, imaginary){
		if(!name) name = 'Money';
		this.name = name; // could throw errpr
		this.imaginary = imaginary;
	}
}

//
// === The Monetary Amount Class ===
//

class MonetaryAmount{
	// LEFT OFF HERE!!!
}