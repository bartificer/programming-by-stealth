/**
 * A basic implementation of a class representing imaginary currencies.
 */
class ImaginaryCurrency{
	//
	// Define the Constructor
	//
	
	/**
	 * A basic constructor that expects a value to be passed for every attribute.
	 * 
	 * @param {Object} details - a dictionary of initial values for the currency's properties.
	 * @param {string} details.name - the currency's name.
	 * @param {string} details.descriptionHTML - a discription of the currency, optionally including HTML tags.
	 * @param {string} details.symbol - a plain-text version of the currency's symbol.
	 * @param {string} details.symbolHTML - an HTML version of the currency's symbol.
	 * @param {number} numDecimalPlaces - the number of decimal places the currency usually displays.
	 */
	constructor(details){
		// initialise all the data attributes
		this.name = details.name;
		this.descriptionHTML = details.descriptionHTML;
		this.symbol = details.symbol;
		this.symbolHTML = details.symbolHTML;
		this.numDecimalPlaces = details.numDecimalPlaces;
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