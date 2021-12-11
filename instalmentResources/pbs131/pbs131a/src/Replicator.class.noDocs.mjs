import is from 'is_js';
import {cloneDeep} from 'lodash-es';

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

function isCharge(val){
    return String(val).match(/^\d+$/) ? true : false;
}

function assertCharge(val){
    if(!isCharge(val)) throw new TypeError('invalid charge, must be an integer greater than 0');
}

class Replicator{
    static get menu(){
        return cloneDeep(menu);
    }

    static addMenuItem(name, icon, energyCost){
        if(is.empty(name)) throw new TypeError('name must be a non-empty string');
        if(is.empty(icon)) throw new TypeError('icon must be a non-empty string');
        assertCharge(energyCost);
        menu[name] = {energyCost: parseInt(energyCost), icon};
    }

    constructor(initialCharge){
        this._charge = 0;
        if(is.not.undefined(initialCharge)){
            this.recharge(initialCharge);
        }else{
            this.recharge(100);
        }
    }

    get charge(){
        return this._charge;
    }

    recharge(charge){
        assertCharge(charge);
        this._charge += parseInt(charge);
    }

    replicate(item){
        if(is.undefined(menu[item])){
            throw new RangeError(`unknown food item '${item}'`);
        }
        if(this.charge - menu[item].energyCost < 0){
            throw new Error(`insufficient charge available - ${item} requires a charge of ${menu[item].energyCost} unit(s), but there's only ${this.charge}`);
        }
        this._charge -= menu[item].energyCost;
        return menu[item].icon;
    }
}

export default Replicator;