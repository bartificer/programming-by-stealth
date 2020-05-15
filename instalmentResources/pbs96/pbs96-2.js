console.log('Hello from an external file included at the top of the body');
console.log(`\tAt this stage the $() function ${ typeof $ === 'undefined' ? 'does NOT' : 'DOES' } exist`);