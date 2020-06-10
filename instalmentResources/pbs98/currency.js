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
	 * @param {string} [name='Money']
	 * @param {string} [symbol='#']
	 * @throws {TypeError}
	 * @throws {RangeError}
	 */
	constructor(name, symbol){
		if(!name) name = 'Money';
		if(!symbol) symbol = '#';
		this.name = name; // could throw errpr
		this.symbol = symbol; // could throw error
	}
	
	//
	// Instance functions
	//
	
	/**
	 * Build a clone.
	 * 
	* @return {Denomination}
	 */
	clone(){
		return new this.constructor(this.name, this.symbol);
	}
}