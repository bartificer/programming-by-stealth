#!/usr/bin/env node

// import the default export with a name of our choosing
import SleepsCalc from './S2XmasCalculator.class.mjs';

// create an instance of the imported class
const calc = new SleepsCalc();

// do the calculatoin
calc.calculate();

// change the icons
calc.sleepIcon = '💤';
calc.christmasIcon = '🎅';

// do the calculation again
calc.calculate();