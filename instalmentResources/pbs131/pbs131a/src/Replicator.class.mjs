/**
 * Why cook when you can use a replicator! Sadly this module can't provide a real replicator, but it can at least give you a simulated digital one 🙂
 * @module PBSReplicator
 * @requires is_js
 * @see {@link https://is.js.org}
 * @requires lodash-es
 * @see {@link https://lodash.com}
 */
import is from 'is_js';
import {cloneDeep} from 'lodash-es';

/**
 * The menu of foods supported by all replicators indexed by name.
 * @type {Object.<string, MenuItem>}
 */
const menu = {
    pancakes: {
        energyCost: 11,
        icon: '🥞'
    },
    popcorn: {
        energyCost: 1,
        icon: '🍿'
    }
};

/**
 * Test if a given value is a valid replicator charge.
 * @param {*} val - The value to test.
 * @returns {boolean}
 * @see The {@link ChargeAmount} type definition.
 */
function isCharge(val){
    return String(val).match(/^\d+$/) ? true : false;
}

/**
 * Assert that a given value is a valid replicator charge by testing it, and
 * throwing an error if it isn't.
 * @param {*} val - The value to assert.
 * @returns {number} Returns the test value forced to be a number.
 * @throws {TypeError} Throws a Type Error if the asserted value is not valid.
 * @see Data validated by the {@link module:PBSReplicator~isCharge isCharge()} function.
 */
function assertCharge(val){
    if(!isCharge(val)) throw new TypeError('invalid charge, must be an integer greater than 0');
    return parseInt(val);
}

/**
 * A virtual Star Trek-style replicator.
 * 
 * Replicators have a charge that gets exhausted by replicating food.
 * Replicators can be recharged.
 * 
 * All replicators share a single menu which is accessible and updatable via
 * static functions.
 */
class Replicator{
    /**
     * The menu shared by all replicators as a dictionary of named menu items.
     * @type {Object.<string, MenuItem>}
     */
    static get menu(){
        return cloneDeep(menu);
    }

    /**
     * Add a new item to the shared menu.
     * @param {string} name - The item's name.
     * @param {string} icon - An icon to represent the item, ideally a single
     * emoji.
     * @param {ChargeAmount} energyCost - The amount of energy it takes to
     * replicate one of the item.
     * @throws {TypeError} A Type Error is thrown if invalid arguments are
     * passed.
     */
    static addMenuItem(name, icon, energyCost){
        if(is.empty(name)) throw new TypeError('name must be a non-empty string');
        if(is.empty(icon)) throw new TypeError('icon must be a non-empty string');
        assertCharge(energyCost);
        menu[name] = {energyCost: parseInt(energyCost), icon};
    }

    /**
     * Replicators default to an initial charge of 100, but an alternative
     * initial charge can be passed.
     * @param {ChargeAmount} [initialCharge=100] - The replicator's initial charge.
     */
    constructor(initialCharge){
        this._charge = 0;
        if(is.not.undefined(initialCharge)){
            this.recharge(initialCharge);
        }else{
            this.recharge(100);
        }
    }

    /**
     * The replicator's current charge level.
     * @type {ChargeAmount}
     */
    get charge(){
        return this._charge;
    }

    /**
     * Add charge to the replicator.
     * @param {ChargeAmount} charge
     * @throws {TypeError} Throws a Type Error on invalid args.
     */
    recharge(charge){
        assertCharge(charge);
        this._charge += parseInt(charge);
    }

    /**
     * Make some food from the menu.
     * @param {string} item - The name of the item to make.
     * @param {number} [num=1] - The amount of the item to make. Note that
     * nonsense values are ignored.
     * @returns {string} The icons representing the created food.
     * @throws {RangeError} A Range Error is thrown if the named food doesn't
     * exist on the menu, or if making the food would consume more energy than
     * is available.
     * @see #charge
     * @see #recharge
     */
    replicate(item, num){
        if(is.undefined(menu[item])){
            throw new RangeError(`unknown food item '${item}'`);
        }
        let numItems = 1;
        if(String(num).match(/^\d+$/) && num > 0){
            numItems = parseInt(num);
        }
        const cost = menu[item].energyCost * numItems;
        if(this.charge - cost < 0){
            throw new RangeError(`insufficient charge available - ${item}x${numItems} requires a charge of ${cost} unit(s), but there's only ${this.charge}`);
        }
        this._charge -= cost;
        return menu[item].icon.repeat(numItems);
    }
}

export default Replicator;