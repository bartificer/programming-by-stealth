/**
 * A class for joining arrays of strings like a human would.
 * 
 * @example
 * const j = new Joiner();
 * const arr = ['waffles', 'pancakes', 'popcorn'];
 * const humanString = j.join(); // waffles, pancakes & popcorn
 */
class Joiner{
    /**
     * @param {string} [conjunction='&'] - the conjunction to use between the last two elements in the array 
     * @param {string} [quoteWith=''] - the character to quote each element in the array with. 
     */
    constructor(conjunction='&', quoteWith=''){
        // force all arguments to strings
        if(typeof conjunction !== 'string') conjunction = '&';
        if(typeof quoteWith !== 'string') quoteWith = '';

        this._conjunction = conjunction;
        this._quoteWith = quoteWith;
    }

    //
    // Regular getters and setters for both properties
    //

    /**
     * The conjunction to use between the last two array elements.
     * @type {string}
     */
    get conjunction() { return this._conjunction; }
    set conjunction(c){
        this._conjunction = String(c); // force to string
    }

    /**
     * A character to quote each array element with. Can be an empty string.
     * @type {string}
     */
    get quoteWith() { return this._quoteWith; }
    set quoteWith(qw) {
        if(qw){ // force any truthy value to a string
            this._quoteWith = String(qw);
        }else{
            this._quoteWith = '';
        }
    }

    //
    // the actual joiner function
    //

    /**
     * Join an array of strings like a human would list them.
     * @param {Array.<string>} arr - the strings to join.
     * @returns {string}
     * @throws {TypeError} A Type Error is thrown if invalid arguments are passed.
     */
    join(arr){
        // make sure we got an array
        if(!(arr instanceof Array)){
            throw new TypeError('must pass an array');
        }

        // short-curcuit an empty array
        if(arr.length === 0) return '';

        // assemble the joined string
        const q = this.quoteWith; // cache the quote character
        let ans = q + String(arr[0]) + q; // start with the first element
        for(let i = 1; i < arr.length; i++){
            // figure out the separator
            const sep = i === arr.length - 1 ? ' ' + this.conjunction + ' ' : ', ';
            ans += sep + q + arr[i] + q;
        }
        
        // return the joined string
        return ans;
    }

    //
    // The mutating getters
    //

    /**
     * A mutating getter that sets the conjuction to 'and' and returns a reference to self.
     * @type {Joiner}
     */
    get and(){
        this.conjunction = 'and';
        return this;
    }

    /**
     * A mutating getter that sets the conjuction to '&' and returns a reference to self.
     * @type {Joiner}
     */
    get ampersand(){
        this.conjunction = '&';
        return this;
    }

    /**
     * A mutating getter that sets the conjuction to 'or' and returns a reference to self.
     * @type {Joiner}
     */
    get or(){
        this.conjunction = 'or';
        return this;
    }

    /**
     * A mutating getter that enables quoting with single quotes and returns a reference to self.
     * @type {Joiner}
     */
    get quote(){
        this.quoteWith = "'";
        return this;
    }

    /**
     * A mutating getter that enables quoting with double quotes and returns a reference to self.
     * @type {Joiner}
     */
    get doubleQuote(){
        this.quoteWith = '"';
        return this;
    }
}

/**
 * A factory method to create instances of the `Joiner` class.
 * 
 * This function takes the same arguments as `Joiner`'s constructor.
 * 
 * @param {string} [conjunction='&'] - the conjunction to use between the last two elements in the array 
 * @param {string} [quoteWith=''] - the character to quote each element in the array with. 
 * @returns {Joiner} A new Joiner object
 */
export default function joiner(){
    const ans = new Joiner(...arguments);
    console.log(ans);
    return ans;
};