// A script to read the JSON for an array of numbers from STDIN and write their
// average to STDOUT

// read, parse, and process STDIN
let count = 0;
let total = 0;
for(const num of JSON.parse(require('fs').readFileSync(process.stdin.fd, 'utf-8'))){
    count++;
    total += num;
}

// calculate and output the average
console.log(total/count);