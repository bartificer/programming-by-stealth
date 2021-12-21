#!/usr/bin/env node

// import the class from the module
import Replicator from "./src/Replicator.class.mjs";

// create a replicator
const kitchenFriend = new Replicator();
console.log(`initial charge: ${kitchenFriend.charge}`);

// show the menu
console.log('The Menu:', Replicator.menu);

// make a pancake
console.log(kitchenFriend.replicate('pancakes'));
console.log(`remaining charge: ${kitchenFriend.charge}`);

// add tacos to the menu
Replicator.addMenuItem('taco', '🌮', '42');
console.log('The updated Menu:', Replicator.menu);

// have 2 tacos
console.log(kitchenFriend.replicate('taco', 2));
console.log(`remaining charge: ${kitchenFriend.charge}`);