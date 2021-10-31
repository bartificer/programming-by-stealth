// import the needed modules (just MomentJS)
import moment from "moment";

// define and export the default icons as a named export
export const defaultIcons = {
	sleep: '😴',
	christmas: '🎄'
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
		const now = moment();
		if(now.date() === 25 && now.month() === 11){
			// it's Christmas!
			console.log("No more sleeps — it's Christmas 😀🎄🎁")
		}else if(now.date() === 24 && now.month() === 11){
			// it's Christmas Eve!
			console.log(`Nearly there, just one more sleep till Christmas ${this.christmasIcon}!!!`);
		}else{
			const xmas = moment(now.startOf('day')).date(25).month(11);
			if(now.isAfter(xmas)) xmas.year(now.year() + 1);
			const numDays = Math.abs(now.startOf('day').diff(xmas, 'days'));
			console.log(`${numDays} sleeps ${this.sleepIcon} till Christmas ${this.christmasIcon}`);
		}
	}
};

// also export the class as the default export
export { S2XmasCalculator as default };