/**
 * A class representing imaginary currencies.
 */
class ImaginaryCurrency{
	//
	// Define the Constructor
	//
	
	/**
	 * @param {Object} [details={}] - a dictionary of initial values for the currency's properties.
	 * @param {string} [details.name='Imaginary Dollars'] - the currency's name.
	 * @param {string} [details.descriptionHTML='an imaginary currency'] - a discription of the currency, optionally including HTML tags.
	 * @param {string} [details.symbol='$'] - a plain-text version of the currency's symbol.
	 * @param {string} [details.symbolHTML='<i class="fas fa-dollar-sign mx-1" title="$" aria-hidden></i><span class="sr-only">$</span>'] - an HTML version of the currency's symbol.
	 * @param {number} [numDecimalPlaces=2] - the number of decimal places the currency usually displays.
	 */
	constructor(details){
		// ensure details is a dictionary
		if(typeof details !== 'object') details = {};
		
		// initialise all the data attributes
		// use the passed value if possible, otherwise, use a default
		if(typeof details.name === 'string'){
			this.name = details.name;
		}else{
			this.name = 'Imaginary Dollars';
		}
		if(typeof details.descriptionHTML === 'string'){
			this.descriptionHTML = details.descriptionHTML;
		}else{
			this.descriptionHTML = 'an imaginary currency';
		}
		if(typeof details.symbol === 'string'){
			this.symbol = details.symbol;
		}else{
			this.symbol = '$';
		}
		if(typeof details.symbolHTML === 'string'){
			this.symbolHTML = details.symbolHTML;
		}else{
			this.symbolHTML = '<i class="fas fa-dollar-sign mx-1" title="$" aria-hidden></i><span class="sr-only">$</span>';
		}
		// best-effort to convert the number of decimal places to a number
		const numDecimalPlaces = parseInt(details.numDecimalPlaces);
		if(!isNaN(numDecimalPlaces) && numDecimalPlaces >= 0){
			this.numDecimalPlaces = numDecimalPlaces;
		}else{
			this.numDecimalPlaces = 2;
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