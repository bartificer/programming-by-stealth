//
// Encapsulate the data related to the Hoonyaker
//

const hoonyaker = {
	name: 'Hoonyaker',
	descriptionHTML: 'a fictitious currency invented by podcast listener and <em>Nosillacastaway</em> Kaylee that happens to equal about one US Dollar',
	symbol: '₪',
	symbolHTML: '<i class="fas fa-shekel-sign mx-1" title="₪" aria-hidden></i><span class="sr-only">₪</span>',
	numDecimalPlaces: 3
};

//
// Define the functions related to the Hoonyaker
//

/**
 * Generate a plain-text description of the Hoonyaker.
 * 
 * @return {string}
 */
function describeHoonyaker(){
	// use jQuery to convert HTML to text
	const plainTextDesc = $(`<p>${hoonyaker.descriptionHTML}</p>`).text();
	return `The ${hoonyaker.name} is ${plainTextDesc}. It's symbol is ${hoonyaker.symbol}, and it has ${hoonyaker.numDecimalPlaces} decimal places.`;
}

/**
 * Generate an HTML description of the Hoonyaker.
 * 
 * @return {string}
 */
function describeHoonyakerHTML(){
	return `<p>The ${hoonyaker.name} is ${hoonyaker.descriptionHTML}. It's symbol is ${hoonyaker.symbolHTML}, and it has ${hoonyaker.numDecimalPlaces} decimal places.</p>`
}

/**
 * Render an amount in Hoonyakers as plain text.
 * 
 * @param {number} amount
 * @return {string}
 */
function asHoonyakers(amount){
	// format the number
	const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(hoonyaker.numDecimalPlaces)}`);
	return `${hoonyaker.symbol}${formattedAmount}`;
}

/**
 * Render an amount in Hoonyakers as HTML.
 * 
 * @param {number} amount
 * @return {string}
 */
function asHoonyakersHTML(amount){
	// format the number
	const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(hoonyaker.numDecimalPlaces)}`);
	return `${hoonyaker.symbolHTML}${formattedAmount}`;
}