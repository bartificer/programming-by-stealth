#!/usr/bin/env node

// import the default export with a name of our choosing
import SleepsCalc from './S2XmasCalculator-Luxon.class.mjs';

// create an instance of the imported class
const calc = new SleepsCalc();

// do the calculation
calc.calculate();