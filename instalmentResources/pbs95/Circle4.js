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
		// call the radius setter
		this.radius = radius;
	}
	
	//
	// Define getters and setters for the radius
	//
	
	/**
	 * @type {number}
	 */
	get radius(){
		return this._radius;
	}
	
	/**
	 * @type {number}
	 * @throws {TypeError} A type error is thrown if a non-numeric value is passed as the radius.
	 * @throws {RangeError} A range error is thrown if the radius is negative.
	 */
	set radius(radius){
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
	// Define getters and setters for the derived property diameter
	//
	
	/**
	 * @type {number}
	 */
	get diameter(){
		return this._radius * 2;
	}
	
	/**
	 * @type {number}
	 * @throws {TypeError} A type error is thrown if a non-numeric value is passed as the diameter.
	 * @throws {RangeError} A range error is thrown if the diameter is negative.
	 */
	set diameter(diameter){
		const diameterNumber = parseFloat(diameter);
		if(isNaN(diameterNumber)){
			throw new TypeError('diameter must be a number greater than or equal to zero');
		}
		if(diameterNumber < 0){
			throw new RangeError('diameter cannot be negative');
		}
		if(diameterNumber === 0){
			this._radius = 0; // avoid divide-by-zero error
		}else{
			this._radius = diameterNumber / 2;
		}
	}
	
	//
	// Define getters and setters for the derived property circumference
	//
	
	/**
	 * @type {number}
	 */
	get circumference(){
		return this._radius * 2 * this.π;
	}
	
	/**
	 * @type {number}
	 * @throws {TypeError} A type error is thrown if a non-numeric value is passed as the diameter.
	 * @throws {RangeError} A range error is thrown if the diameter is negative.
	 */
	set circumference(circumference){
		const circumferenceNumber = parseFloat(circumference);
		if(isNaN(circumferenceNumber)){
			throw new TypeError('circumerence must be a number greater than or equal to zero');
		}
		if(circumferenceNumber < 0){
			throw new RangeError('circumference cannot be negative');
		}
		if(circumferenceNumber === 0){
			this._radius = 0; // avoid divide-by-zero error
		}else{
			this._radius = circumferenceNumber / (2 * this.π);
		}
	}
	
	//
	// Define getters and setters for the derived property area
	//
	
	/**
	 * @type {number}
	 */
	get area(){
		return this.π * Math.pow(this._radius, 2);
	}
	
	/**
	 * @type {number}
	 * @throws {TypeError} A type error is thrown if a non-numeric value is passed as the area.
	 * @throws {RangeError} A range error is thrown if the area is negative.
	 */
	set area(area){
		const areaNumber = parseFloat(area);
		if(isNaN(areaNumber)){
			throw new TypeError('area must be a number greater than or equal to zero');
		}
		if(areaNumber < 0){
			throw new RangeError('area cannot be negative');
		}
		if(areaNumber === 0){
			this._radius = 0; // avoid divide-by-zero error
		}else{
			this._radius = Math.sqrt(areaNumber / this.π);
		}
	}
	
	//
	// Define a permissive read-only attribute with an author credit
	//
	
	/**
	 * @type {string}
	 */
	get classAuthor(){
		return 'Bart Busschots of Bartificer Creations at https://bartificer.net/';
	}
	
	//
	// Define an assertive read-only attribute defining the value for PI to be used in the class.
	//
	
	/**
	 * @type {number}
	 */
	get π(){
		return 3.1415;
	}
	
	/**
	 * @throws {Error} An error is thrown when an attempt is made to assign a value to this
	 * read-only attribute.
	 */
	set π(pi){
		throw new Error('π is a read-only attribute');
	}
}