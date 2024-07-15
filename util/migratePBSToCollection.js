const fs = require('node:fs');
const path = require('node:path');

// see if a limit was passed as the first arg
let limit = process.argv[2];
if(limit){
    if(limit.match(/^[1-9]\d*$/)){
        limit = parseInt(limit);
        console.log(`Limited to processing ${limit} instalment(s)`);
    }else{
        console.error(`Invalid limit '${limit}' - must be an integer greater than zero`);
        process.exit(1);
    }
}else{
    limit = false;
}

// generate the needed paths
const docsDir = path.join(path.resolve(__dirname, '..'), 'docs');
console.debug(`Reading instalments from: ${docsDir}`);
const outputDir = path.join(docsDir, '_pbs');
console.debug(`Outputting updated files to: ${outputDir}`);

// make sure the output dir excists
if (fs.existsSync(outputDir)){
    console.debug('Output dir exists');
}else{
    fs.mkdirSync(outputDir);
    console.log(`Created output dir: ${outputDir}`);
}

// get the list of PBS instalment files
const instalmentFiles = [];
const allDocs = fs.readdirSync(docsDir);
for(const docName of allDocs){
    if(docName.match(/^pbs\d+[.]md$/)){
        instalmentFiles.push(docName);
    }
}
console.debug(`Found ${instalmentFiles.length} instalment files`);

// Loop over each intalment up to the limit
let numProcessed = 0;
for(const instalementFile of instalmentFiles){
    // handle the processing limit
    numProcessed++;
    if(limit && numProcessed > limit){
        console.log(`Reached limit of ${limit} files, stopping`);
        break;
    }

    console.debug(`Processing '${instalementFile}'`);

    // slurp the file
    const instalmentLines = fs.readFileSync(path.join(docsDir, instalementFile), 'utf8').toString().split('\n');
    console.log(`Read ${instalmentLines.length} line(s)`);

    // find and extract the title details
    let titleLine = 0;
    let title = '';
    if(instalmentLines[0].match(/^---/)){
        titleLine++;
        while(!instalmentLines[titleLine].match(/^---/)){
            titleLine++;
        }
        titleLine++;
    }
    // the title should now be the current line
    let titleMatch = instalmentLines[titleLine].match(/^#[ ](?:PBS|Instalment)[ ]\d+[ ]of[ ]X[ ][–—][ ](.+)$/);
    if(titleMatch){
        title = titleMatch[1];
        console.debug(`Found title '${title}' in ${instalementFile}`);
    }else{
        console.warn(`Failed to match title in ${instalementFile}`);
    }

    // find the next/prev link line numbers
    // TO DO

    // build the output path
    // TO DO

    // build the output contents
    // TO DO
}