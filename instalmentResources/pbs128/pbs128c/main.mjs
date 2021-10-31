#!/usr/bin/env node

// import the MomentJS and Luxon versions of the class and default icons using named imports
import { S2XmasCalculator as SleepsCalcMJS,
         defaultIcons as iconsMJS } from './S2XmasCalculator-Moment.class.mjs';
import { S2XmasCalculator as SleepsCalcLux,
         defaultIcons as iconsLux } from './S2XmasCalculator-Luxon.class.mjs';

// show both sets of default icons
console.log('MomentJS Variant Icons:', iconsMJS);
console.log('Luxon Variant Icons:', iconsLux);

// create an instance of each of the classes
const calcMJS = new SleepsCalcMJS();
const calcLux = new SleepsCalcLux();

// do the calculation with each
calcMJS.calculate();
calcLux.calculate();