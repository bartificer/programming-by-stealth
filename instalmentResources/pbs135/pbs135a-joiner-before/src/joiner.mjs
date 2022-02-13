/**
 * A module for joining lists of strings like a human would.
 * 
 * This module serves as an example in the {@tutorial pbs} series.
 * 
 * @module PBSJoiner
 * @example
 * joiner().and.join(['pancakes', 'waffles', 'popcorn']) // returns 'pancakes, wafles, and popcorn'
 */

/**
 * A class for joining arrays of strings like a human would.
 */
class Joiner {
  /**
   * @param {string} [conjunction='&'] - the conjunction to use between the last two elements in the array 
   * @param {string} [quoteWith=''] - the character to quote each element in the array with.
   * @param {boolean} [doSort=false] — whether or not to sort the list before joining.
   */
  constructor(conjunction='&', quoteWith='', doSort=false) {
    // force all arguments to their appropriate type
    if (typeof conjunction !== 'string') conjunction = '&';
    if (typeof quoteWith !== 'string') quoteWith = '';
    doSort = doSort ? true : false; 

    this._conjunction = conjunction;
    this._quoteWith = quoteWith;
    this._doSort = doSort;
  }

  //
  // Regular getters and setters for both properties
  //

  /**
   * The conjunction to use between the last two array elements.
   * @type {string}
   */
  get conjunction() { return this._conjunction; }
  set conjunction(c) {
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

  /**
   * Whether or not to sort the list before joining.
   * @type {boolean}
   */
  get doSort() { return this._doSort; }
  set doSort(s){
    this._doSort = s ? true : false; // force to boolean
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

    // sort the array if needed
    let list = [...arr]; //shallow-clone the array before possibly sorting it
    if(this.doSort) list.sort(); // opperates in-place

    // assemble the joined string
    const q = this.quoteWith; // cache the quote character
    let ans = q + String(list[0]) + q; // start with the first element
    for(let i = 1; i < list.length; i++){
      // figure out the separator
      const sep = i === list.length - 1 ? ' ' + this.conjunction + ' ' : ', ';
      ans += sep + q + list[i] + q;
    }
        
    // return the joined string
    return ans;
  }

  //
  // The disgusied pass-through functions
  //

  /**
   * A disguised pass-through function that sets the conjuction to 'and'.
   * @type {Joiner}
   */
  get and(){
    this.conjunction = 'and';
    return this;
  }

  /**
   * A disguised pass-through function that sets the conjuction to '&'.
   * @type {Joiner}
   */
  get ampersand(){
    this.conjunction = '&';
    return this;
  }

  /**
   * A disguised pass-through function that sets the conjuction to 'or'.
   * @type {Joiner}
   */
  get or(){
    this.conjunction = 'or';
    return this;
  }

  /**
   * A disguised pass-through function that enables quoting with a single quote.
   * @type {Joiner}
   */
  get quote(){
    this.quoteWith = "'";
    return this;
  }

  /**
   * A disguised pass-through function that enables quoting with a double quote.
   * @type {Joiner}
   */
  get doubleQuote(){
    this.quoteWith = '"';
    return this;
  }

  /**
   * A disguised pass-through function that enables sorting.
   * @type {Joiner}
   */
  get sort(){
    this.doSort = true;
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
}