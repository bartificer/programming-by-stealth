#!/usr/bin/env node

import joiner from './joiner.mjs';

const favFoods = ['pancakes', 'waffles', 'popcorn'];
console.log(joiner().ampersand.join(favFoods));
console.log(joiner().quote.sort.and.join(favFoods));
console.log(joiner().doubleQuote.or.join(favFoods));