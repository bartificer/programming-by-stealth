class Nerdtouche{
	//
	// --- Class Data Attributes ---
	//
	
	/**
	 * The number of emoji that make up one Nerdtouche.
	 *
	 * @type {number}
	 */
	static get length(){
		return 3;
	}
	
	/**
	 * @throws {Error} The length of Nerdtouches cannot be changed, so an error
	 * is thrown if an attempt is made to do so.
	 */
	static set length(l){
		throw new Error(`Nerdtouches will always be ${this.length} emoji long!`);
	}
	
	/**
	 * The default handle to use when none is specified.
	 *
	 * @type {string}
	 */
	static get defaultHandle(){
		return this._defaultHandle || 'Some Nerd';
	}
	
	/**
	 * @throws {TypeError} A Type Error is thrown if the value is not a string.
	 * @throws {RangeError} A Range Error is thrown if the value is an empty
	 * string.
	 */
	static set defaultHandle(h){
		if(is.not.string(h)) throw new TypeError('Default Handle must be a string');
		if(is.empty(h)) throw new RangeError("Default Handle can't be an empty string");
		this._defaultHandle = e;
	}
	
	/**
	 * The default emoji to use when none is specified.
	 *
	 * @type {string}
	 */
	static get defaultEmoji(){
		return this._defaultEmoji || '⁉️';
	}
	
	/**
	 * @throws {TypeError} A Type Error is thrown if the value is not a string.
	 * @throws {RangeError} A Range Error is thrown if the value is a string
	 * that doesn't contain exactly one Unicode grapheme.
	 */
	static set defaultEmoji(e){
		if(is.not.string(e)) throw new TypeError('Default Emoji must be a string');
		if(!this.isEmoji(e)) throw new RangeError('Default Emoji must be a single Unicode character');
		this._defaultEmoji = e;
	}
	
	/**
	 * A count of the number of Nerdtouches created.
	 *
	 * @type {number}
	 */
	static get count(){
		return this._count || 0;
	}
	
	/**
	 * @throws {Error} Only the constructor should update the count, so 
	 * attempts to do so directly will result in an error being thrown.
	 */
	static set count(c){
		throw new Error('Only the constructor may update the counter!');
	}
	
	//
	// --- Class Functions ---
	//
	
	/**
	 * Test the passed value to see if it's a single emoji.
	 *
	 * Testing if something is an emoji is not straightforward, so to keep 
	 * things simple any single unicode grapheme (visible character) will count
	 * as an emoji. Even detecting single unicode graphemes is not 
	 * straightforward, so rather than re-inventing the wheel, this function
	 * uses the open-source
	 * [grapheme-splitter](https://github.com/orling/grapheme-splitter/)
	 * library. 
	 *
	 * @param {*} val - The value to test.
	 * @return {boolean}
	 * @see {@link https://github.com/orling/grapheme-splitter/}
	 */
	static isEmoji(val){
		if(is.not.string(val)){
			return false;
		}
		return (new GraphemeSplitter()).countGraphemes(val) === 1;
	}
	
	/**
	 * Find all Nerdtouches within a given container. If not container is
	 * specified the entire document is searched.
	 *
	 * @param {jQuery} [$container]
	 * @return {jQuery}
	 * @throws {TypeError} A Type Error is thrown if a container is specified
	 * but is not a jQuery object.
	 */
	static $find($container){
		if(is.not.undefined($container)){
			if(is.not.object($container) || !$container.jquery){
				throw new TypeError('If passed, the container must be a jQuery object');
			}
		}else{
			$container = $(document);
		}
		return $('.nerdtouche', $container);
	}
	
	//
	// --- Instance Data Attributes ---
	//
	
	/**
	 * The real name or nickname the Nerdtouche represents.
	 * 
	 * @type {string}
	 */
	get handle(){
		return this._handle;
	}
	
	/**
	 * @throws {TypeError} A Type Error is thrown if the handle is not a string.
	 * @throws {RangeError} A Range Error is thrown if the handle is an emtpy string.
	 */
	set handle(h){
		if(is.not.string(h)) throw new TypeError('Handle must be a string');
		if(is.empty(h)) throw new RangeError('Handle cannot be an empty string');
		this._handle = h;
	}
	
	/**
	 * The emoji that make up the Nerdtouche.
	 *
	 * @type {string[]}
	 */
	get emoji(){
		return [...this._emoji] // shallow clone with spread opperator
	}
	
	/**
	 * @throws {TypeError} A Type Error is thrown if the emoji are not an array
	 * of strings.
	 * @throws {RangeError} A Range Error is thrown if there are the wrong
	 * amount of strings in the array, or if any of the strings contain
	 * anything other than a single emoji.
	 */
	set emoji(e){
		const errMsg = `emoji must be an array of ${this.constructor.length} single Unicode graphemes`;
		if(is.not.array(e) || !is.all.string(e)){
			throw new TypeError(errMsg);
		}
		for(const emoji of e){
			if(!this.constructor.isEmoji(emoji)){
				throw new RangeError('each emoji must be a single Unicode graphemes');
			}
		}
		if(e.length < this.constructor.length){
			throw new TypeError(errMsg);
		}
		this._emoji = e.slice(0, this.constructor.length);
	}
	
	/**
	 * The unique class added to all HTML renderings of this nerdtouche.
	 * 
	 * @type {string}
	 */
	get uniqueClass(){
		return `nerdtouche-${this._sequenceNumber}`;
	}
	
	/**
	 *
	 */
	set uniqueClass(uc){
		throw new Error("Nerdtouche's unique classes can't be changed");
	}
	
	//
	// --- Constructor ---
	//
	
	/**
	 * @param {string} [handle]
	 * @param {...string} [emoji]
	 * @throws {Error} An error is thrown on invalid args.
	 */
	constructor(handle, ...emoji){
		// set defaults if needed
		if(is.undefined(handle)) handle = this.constructor.defaultHandle;
		while(emoji.length < this.constructor.length){
			emoji.push(this.constructor.defaultEmoji);
		}
		
		// store the instance data
		this.handle = handle; // could throw error
		this.emoji = emoji; // could throw error
		
		// increment the instance counter and store the sequence number
		this.constructor._count = this.constructor.count + 1;
		this._sequenceNumber = this.constructor.count;
	}
	
	//
	// --- Instance Functions ---
	//
	
	/**
	 * Get the Nerdtouche as a string.
	 *
	 * @return {string}
	 */
	asString(){
		return `(${this.emoji.join('')})`;
	}
	
	/**
	 * Get the Nerdtouche as a freshly created JQuery object.
	 * 
	 * @return {jQuery}
	 */
	as$(){
		// build the nerdtouche
		const $nerdtouche = $('<span>').html(this.emoji.join('<br>'));
		$nerdtouche.attr('title', this.handle);
		$nerdtouche.addClass('nerdtouche badge badge-secondary badge-pill p-1 m-1 align-middle');
		$nerdtouche.addClass(this.uniqueClass);
		$nerdtouche.css({
			fontSize: '0.5em',
			lineHeight: 1.5
		});
		
		// add a data attribute linking back to the instance object
		$nerdtouche.data('nerdtouche-object', this);
		
		// return the nerdtouche
		return $nerdtouche;
	}
	
	/**
	 * Get the Nerdtouche as Bootstrap-4-styled HTML.
	 *
	 * @return {string}
	 */
	asHTML(){
		return this.as$()[0].outerHTML;
	}
	
	/**
	 * Append this nerdtouche to a given container.
	 * 
	 * @param {jQuery} $container
	 * @return {jQuery} Returns a reference to the container.
	 * @throws {TypeError} A Type Error is thrown if a valid container is not passed.
	 */
	appendTo($container){
		if(is.not.object($container) || !$container.jquery){
			throw new TypeError('the container must be a jQuery object');
		}
		return $container.append(this.as$());
	}
	
	
	/**
	 * Find all coppies of this nerdtouche within a given container. If no
	 * container is specified the entire document is searched.
	 *
	 * @param {jQuery} [$container]
	 * @return {jQuery}
	 * @throws {TypeError} A Type Error is thrown if a container is specified
	 * but is not a jQuery object.
	 */
	$find($container){
		if(is.not.undefined($container)){
			if(is.not.object($container) || !$container.jquery){
				throw new TypeError('If passed, the container must be a jQuery object');
			}
		}else{
			$container = $(document);
		}
		return $(`.${this.uniqueClass}`, $container);
	}
}