#!/usr/bin/env node

import Replicator from "./src/Replicator.class.mjs";

const rep = new Replicator();
console.log(`initial charge: ${rep.charge}`);
console.log('The Menu:', Replicator.menu);
console.log(rep.replicate('pancakes'));
console.log(`remaining charge: ${rep.charge}`);
Replicator.addMenuItem('taco', '🌮', '42');
console.log('The updated Menu:', Replicator.menu);