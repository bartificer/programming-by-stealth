// A script to read the JSON for an array of numbers from STDIN and write their
// average to STDOUT

// read and parse STDIN
const numArray = JSON.parse(require('fs').readFileSync(process.stdin.fd, 'utf-8'));

//  calculate and output the average
let total = 0;
for(const num of numArray){
    total += num;
}
console.log(total/numArray.length);