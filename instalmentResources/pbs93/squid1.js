//
// Encapsulate the data and functions related to the Squid
//

const squid = {
	//
	// The data
	//
	
	name: 'Squid',
	descriptionHTML: 'a fictitious currency invented by <a href="https://bartb.ie/">Bart</a> that happens to equal about one Euro these days, even though it started life being about equal to an Irish Punt 🙂',
	symbol: '₴',
	symbolHTML: '<i class="fas fa-hryvnia mx-1" title="₴" aria-hidden></i><span class="sr-only">₴</span>',
	numDecimalPlaces: 2,
	
	//
	// The functions
	//
	
	/**
	 * Generate a plain-text description of the Hoonyaker.
	 * 
	 * @return {string}
	 */
	describe: function(){
		// use jQuery to convert HTML to text
		const plainTextDesc = $(`<p>${this.descriptionHTML}</p>`).text();
		return `The ${this.name} is ${plainTextDesc}. Its symbol is ${this.symbol}, and it has ${this.numDecimalPlaces} decimal places.`;
	},

	/**
	 * Generate an HTML description of the Hoonyaker.
	 * 
	 * @return {string}
	 */
	describeHTML: function(){
		return `<p>The ${this.name} is ${this.descriptionHTML}. Its symbol is ${this.symbolHTML}, and it has ${this.numDecimalPlaces} decimal places.</p>`
	},

	/**
	 * Render an amount in Hoonyakers as plain text.
	 * 
	 * @param {number} amount
	 * @return {string}
	 */
	as: function(amount){
		// format the number
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbol}${formattedAmount}`;
	},

	/**
	 * Render an amount in Hoonyakers as HTML.
	 * 
	 * @param {number} amount
	 * @return {string}
	 */
	asHTML: function(amount){
		// format the number
		const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(this.numDecimalPlaces)}`);
		return `${this.symbolHTML}${formattedAmount}`;
	}
};