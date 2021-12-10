#!/usr/bin/env node

// import the class as a named export without re-naming it
import S2XmasCalculator from './src/S2XmasCalculator.class.mjs';

// create an instance of the imported class
const calc = new S2XmasCalculator();

// change the icons
calc.sleepIcon = '💤';
calc.christmasIcon = '🎅';

// print the sleeps
calc.printSleeps();