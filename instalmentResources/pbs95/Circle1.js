/**
 * A class to represent a Circle.
 */
class Circle{
	/**
	 * @param {number} [radius=1]
	 * @throws {TypeError} A type error is thrown if a non-numeric value is passed as the radius.
	 * @throws {RangeError} A range error is thrown if the radius is negative.
	 */
	constructor(radius=1){
		const radiusNumber = parseFloat(radius);
		if(isNaN(radiusNumber)){
			throw new TypeError('radius must be a number greater than or equal to zero');
		}
		if(radiusNumber < 0){
			throw new RangeError('radius cannot be negative');
		}
		this._radius = radiusNumber;
	}
	
	//
	// Define naive getters and setters for the radius
	//
	
	/**
	 * @type {number}
	 */
	get radius(){
		return this._radius;
	}
	
	/**
	 * @type {number}
	 */
	set radius(radius){
		this._radius = radius;
	}
}