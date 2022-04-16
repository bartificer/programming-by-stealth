// import the bundled ES 6 module
import joiner from './joiner-es6.js';

// define a list to join
const foodChoices = [
    'pancakes',
    'waffles',
    'popcorn'
];

// join the list
const foods = joiner().or.sort.join(foodChoices);

// print it
console.log(`I wonder which Allison prefers — ${foods}?`);