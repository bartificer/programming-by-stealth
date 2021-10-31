#!/usr/bin/env node

// import the class as a named export without re-naming it
import { S2XmasCalculator } from './S2XmasCalculator.class.mjs';

// create an instance of the imported class
const calc = new S2XmasCalculator();

// do the calculation
calc.calculate();

// change the icons
calc.sleepIcon = '💤';
calc.christmasIcon = '🎅';

// do the calculation again
calc.calculate();