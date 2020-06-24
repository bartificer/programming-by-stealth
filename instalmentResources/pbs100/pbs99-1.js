console.log('Hello from an external file included in the head');
console.log(`\tAt this stage the $() function ${ typeof $ === 'undefined' ? 'does NOT' : 'DOES' } exist`);