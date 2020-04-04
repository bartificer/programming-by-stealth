//
// Define the data related to the Hoonyaker
//

const hoonyakerName = 'Hoonyaker';
const hoonyakerDescriptionHTML = 'a fictitious currency invented by podcast listener and <em>Nosillacastaway</em> Kaylee that happens to equal about one US Dollar';
const hoonyakerSymbol = '₪'; // think 'n' for NosillaCast (ignore that it's a Shekel)
const hoonyakerSymbolHTML = '<i class="fas fa-shekel-sign mx-1" title="₪" aria-hidden></i><span class="sr-only">₪</span>';
const hoonyakerNumDecimalPlaces = 3;

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
	const plainTextDesc = $(`<p>${hoonyakerDescriptionHTML}</p>`).text();
	return `The ${hoonyakerName} is ${plainTextDesc}. It's symbol is ${hoonyakerSymbol}, and it has ${hoonyakerNumDecimalPlaces} decimal places.`;
}

/**
 * Generate an HTML description of the Hoonyaker.
 * 
 * @return {string}
 */
function describeHoonyakerHTML(){
	return `<p>The ${hoonyakerName} is ${hoonyakerDescriptionHTML}. It's symbol is ${hoonyakerSymbolHTML}, and it has ${hoonyakerNumDecimalPlaces} decimal places.</p>`
}

/**
 * Render an amount in Hoonyakers as plain text.
 * 
 * @param {number} amount
 * @return {string}
 */
function asHoonyakers(amount){
	// format the number
	const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(hoonyakerNumDecimalPlaces)}`);
	return `${hoonyakerSymbol}${formattedAmount}`;
}

/**
 * Render an amount in Hoonyakers as HTML.
 * 
 * @param {number} amount
 * @return {string}
 */
function asHoonyakersHTML(amount){
	// format the number
	const formattedAmount = numeral(amount).format(`0,0[.]${'0'.repeat(hoonyakerNumDecimalPlaces)}`);
	return `${hoonyakerSymbolHTML}${formattedAmount}`;
}
