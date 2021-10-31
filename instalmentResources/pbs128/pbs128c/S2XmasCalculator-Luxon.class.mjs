// import the needed modules (just Luxon)
import { DateTime } from "luxon"; // using a named export, no default from the luxon module

// define and export the default icons as a named export
export const defaultIcons = {
	sleep: '💤',
	christmas: '🎅'
};

// define and export the class as a named export
export class S2XmasCalculator{
	// define a basic constructor
	constructor(){
		this._sleepIcon = defaultIcons.sleep;
		this._christmasIcon = defaultIcons.christmas;
	}
	
	// add some simple getters and setters
	
	// the sleep icon
	get sleepIcon(){
		return this._sleepIcon;
	}
	set sleepIcon(s){
		this._sleepIcon = String(s); // force to a string
	}
	
	// the christmas icon
	get christmasIcon(){
		return this._christmasIcon;
	}
	set christmasIcon(c){
		this._christmasIcon = String(c); // forece to a string
	}
	
	// define the function for generating the text
	calculate(){
		const today = DateTime.now().startOf('day');
		if(today.day === 25 && today.month === 12){
			// it's Christmas!
			console.log("No more sleeps — it's Christmas 😀🎄🎁")
		}else if(today.day === 24 && today.month === 12){
			// it's Christmas Eve!
			console.log(`Nearly there, just one more sleep till Christmas ${this.christmasIcon}!!!`);
		}else{
			let xmas = DateTime.fromObject({ day: 25, month: 12, year: today.year });
			if(today > xmas) xmas = xmas.plus({ year: 1 });
			const numDays = Math.abs(today.diff(xmas, 'days').as('days'));
			console.log(`${numDays} sleeps ${this.sleepIcon} till Christmas ${this.christmasIcon}`);
		}
	}
};

// also export the class as the default export
export { S2XmasCalculator as default };