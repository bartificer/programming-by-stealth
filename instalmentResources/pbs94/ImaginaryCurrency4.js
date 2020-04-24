/**
 * A class representing imaginary currencies.
 */
class ImaginaryCurrency{
	//
	// Define the Constructor
	//
	
	/**
	 * @signature Name & Description
	 * @param {string} details - the currency's name. If passed, must be a non-empty string.
	 * @param {string} [descHTML='an imaginary currency'] - the currency's description, including HTML tags. If passed, must be a non-empty string.
	 * @throws {TypeError} A Type Error is thrown when the name or description are not strings. 
	 * @throws {RangeError} A Range Error is thrown when the name or description are empty strings.
	 * 
	 * @signature Details
	 * @param {Object} [details={}] - a dictionary of initial values for the currency's properties. If passed, must be an object.
	 * @param {string} [details.name='Imaginary Dollar'] - the currency's name. If present, must be a non-empty string.
	 * @param {string} [details.descriptionHTML='an imaginary currency'] - a discription of the currency, optionally including HTML tags. If present, must be a non-empty string.
	 * @param {string} [details.symbol='$'] - a plain-text version of the currency's symbol. If present, must be a non-empty string.
	 * @param {string} [details.symbolHTML='<i class="fas fa-dollar-sign mx-1" title="$" aria-hidden></i><span class="sr-only">$</span>'] - an HTML version of the currency's symbol. If present, must be a non-empty string.
	 * @param {number} [numDecimalPlaces=2] - the number of decimal places the currency usually displays. If present, must be a number greater than or equal to zero. The value will be coerced to an integer if possible.
	 * @throws {TypeError} A Type Error is thrown when the details parameter is not an object, or, if any of the named properties are defined but of the wrong type. 
	 * @throws {RangeError} A Range Error is thrown when any of the named properties of the passed details object have the correct type, but an invalid value.
	 */
	constructor(details, descHTML){
		// figure out which argument option was used
		// ensure details will always be an object before it is processed
		if(typeof details === 'undefined'){
			details = {};
		} else if(typeof details === 'string'){
			if(details === ''){
				throw new RangeError('the first argument cannot be an empty string');
			}else{
				details = { name: details};
				if(typeof descHTML !== 'undefined'){
					if(typeof descHTML === 'string'){
						if(descHTML === ''){
							throw new RangeError('the second argument cannot be an empty string');
						}else{
							details.descriptionHTML = descHTML
						}
					}else{
						throw new RangeError('if passed, second argument must be a non-empty string');
					}
				}
			}
		}else if(typeof details !== 'object'){
			throw new TypeError('if passed, first argument must be an object or a non-empty string');
		}
		
		
		// initialise all the data attributes
		// validate any passed values, and use the default for unspecified values
		if(typeof details.name === 'undefined'){
			this.name = 'Imaginary Dollar';
		}else{
			if(typeof details.name === 'string'){
				if(details.name.length > 0){
					this.name = details.name;
				}else{
					throw new RangeError('details.name cannot be empty');
				}
			}else{
				throw new TypeError("if passed, details.name must be a non-empty string");
			}
		}
		if(typeof details.descriptionHTML === 'undefined'){
			this.descriptionHTML = 'an imaginary currency';
		}else{
			if(typeof details.descriptionHTML === 'string'){
				if(details.descriptionHTML.length > 0){
					this.descriptionHTML = details.descriptionHTML;
				}else{
					throw new RangeError('details.descriptionHTML cannot be empty');
				}
			}else{
				throw new TypeError("if passed, details.descriptionHTML must be a non-empty string");
			}
		}
		if(typeof details.symbol === 'undefined'){
			this.symbol = '$';
		}else{
			if(typeof details.symbol === 'string'){
				if(details.symbol.length > 0){
					this.symbol = details.symbol;
				}else{
					throw new RangeError('details.symbol cannot be empty');
				}
			}else{
				throw new TypeError("if passed, details.symbol must be a non-empty string");
			}
		}
		if(typeof details.symbolHTML === 'undefined'){
			this.symbolHTML = '<i class="fas fa-dollar-sign mx-1" title="$" aria-hidden></i><span class="sr-only">$</span>';
		}else{
			if(typeof details.symbolHTML === 'string'){
				if(details.symbolHTML.length > 0){
					this.symbolHTML = details.symbolHTML;
				}else{
					throw new RangeError('details.symbolHTML cannot be empty');
				}
			}else{
				throw new TypeError("if passed, details.symbolHTML must be a non-empty string");
			}
		}
		if(typeof details.numDecimalPlaces === 'undefined'){
			this.numDecimalPlaces = 2;
		}else{
			// best-effort to convert the number of decimal places to a number
			const numDecimalPlaces = parseInt(details.numDecimalPlaces);
			if(isNaN(numDecimalPlaces)){
				throw new TypeError('if passed, details.numDecimalPlaces must be an integer greater than or equal to one');
			}else{
				if(numDecimalPlaces >= 0){
					this.numDecimalPlaces = numDecimalPlaces;
				}else{
					throw new RangeError('details.numDecimalPlaces cannot be less than zero');
				}
			}
		}
	}
	
	//
	// Define the Instance Functions
	//
	
	/**
	 * Generate a plain-text description of the imaginary currency.
	 * 
	 * @return {string}
	 */
	describe(){
		// use jQuery to convert HTML to text
		const plainTextDesc = $(`<p>${this.descriptionHTML}</p>`).text();
		return `The ${this.name} is ${plainTextDesc}. Its symbol is ${this.symbol}, and it has ${this.numDecimalPlaces} decimal places.`;
	}

	/**
	 * Generate an HTML description of the imaginary currency.
	 * 
	 * @return {string}
	 */
	describeHTML(){
		return `<p>The ${this.name} is ${this.descriptionHTML}. Its symbol is ${this.symbolHTML}, and it has ${this.numDecimalPlaces} decimal places.</p>`
	}

	/**
	 * Render an amount in the imaginary currency as plain text.
	 * 
	 * @param {number} amount
	 * @return {string}
	 */
	as(amount){
		// format the number
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbol}${formattedAmount}`;
	}

	/**
	 * Render an amount in the imaginary currency as HTML.
	 * 
	 * @param {number} amount
	 * @return {string}
	 */
	asHTML(amount){
		// format the number
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbolHTML}${formattedAmount}`;
	}
}