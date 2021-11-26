// import the needed modules (just Luxon)
import { DateTime } from "luxon"; // using a named export, no default from the luxon module

/**
 * A sleeps-to-Christmas calculator.
 */
export default class S2XmasCalculator{
	/**
	 * The default icons.
	 * 
	 * @type {{sleep: string, christmas: string}}
	 */
	static get defaultIcons(){
		return {
			sleep: '😴',
			christmas: '🎄'
		}
	}

	/**
	 * @param {object} [icons] - the icons to use.
	 * @param {sting} [icons.sleep] - an emoji to represent sleep.
	 * @param {string} [icons.christmas] - an emoji to reprsent Christmas.
	 */
	constructor(){
		this._sleepIcon = this.constructor.defaulIcons.sleep;
		this._christmasIcon = this.constructor.defaulIcons;
	}
	
	/**
	 * The Emoji representing sleep.
	 * 
	 * @type {string}
	 */
	get sleepIcon(){
		return this._sleepIcon;
	}
	set sleepIcon(s){
		this._sleepIcon = String(s); // force to a string
	}
	
	/**
	 * The Emoji reprsenting Christmas.
	 * 
	 * @type {string}
	 */
	get christmasIcon(){
		return this._christmasIcon;
	}
	set christmasIcon(c){
		this._christmasIcon = String(c); // forece to a string
	}

	/**
	 * The date for the next Christmas.
	 * 
	 * @returns {LuxonDateTime}
	 */
	static nextChristmas(){
		const today = DateTime.now().startOf('day');
		if(today.day === 25 && today.month === 12){
			return today;
		}
		let xmas = DateTime.fromObject({ day: 25, month: 12, year: today.year });
		if(today > xmas) xmas = xmas.plus({ year: 1 });
		return xmas;
	}
	
	/**
	 * The number of sleeps until Christmas.
	 * 
	 * @returns {number}
	 */
	static numSleeps(){
		const today = DateTime.now().startOf('day');
		if(today.day === 25 && today.month === 12){
			return 0;
		}
		return Math.abs(today.diff(this.nextChristmas(), 'days').as('days'));
	}

	/**
	 * Generate the sleeps message.
	 * 
	 * @returns {string}
	 */
	sleeps(){
		const numSleeps = this.constructor.numSleeps();
		if(numSleeps === 0){
			// it's Christmas!
			return "No more sleeps — it's Christmas 😀🎄🎁";
		}else if(numSleeps === 1){
			// it's Christmas Eve!
			return `Nearly there, just one more sleep till Christmas ${this.christmasIcon}!!!`;
		}else{
			return `${numSleeps} sleeps ${this.sleepIcon} till Christmas ${this.christmasIcon}`;
		}
	}

	/**
	 * Write the number of sleeps till Christmas to STDOUT.
	 */
	printSleeps(){
		console.log(this.sleeps());
	}
};