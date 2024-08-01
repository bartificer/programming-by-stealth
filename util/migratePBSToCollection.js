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
for(const instalmentFile of instalmentFiles){
    // handle the processing limit
    numProcessed++;
    if(limit && numProcessed > limit){
        console.log(`Reached limit of ${limit} files, stopping`);
        break;
    }

    console.debug(`Processing '${instalmentFile}'`);

    // slurp the file
    const instalmentLines = fs.readFileSync(path.join(docsDir, instalmentFile), 'utf8').toString().split('\n');
    console.log(`Read ${instalmentLines.length} line(s)`);

    //
    // extract the relevant info from the file
    //

    // find and extract the title & instalment number
    let titleLine = 0;
    let title = '';
    let instalmentNumber = 0;
    if(instalmentLines[0].match(/^---/)){
        titleLine++;
        while(!instalmentLines[titleLine].match(/^---/)){
            titleLine++;
        }
        titleLine++;
    }
    // the title should now be the current line
    let titleMatch = instalmentLines[titleLine].match(/^#[ ](?:PBS|Instalment)[ ](\d+)(?:[ ]of[ ]X)?[ ][–—][ ](.+)$/);
    if(titleMatch){
        title = titleMatch[2];
        instalmentNumber = titleMatch[1];
        console.debug(`Found title '${title}' & instalment number '${instalmentNumber}' in ${instalmentFile}`);
    }else{
        console.warn(`Failed to match title in ${instalmentFile}`);
    }

    // find the next/prev link line numbers
    let lastContentLine = instalmentLines.length - 2; // there is a blank line on the end!
    while(instalmentLines[lastContentLine].match(/^-[ ]/)) lastContentLine--;

    // try find an approximate publishing date from the filename of the first instalment MP3 file name
    let iso8601Date = false;
    for(const line of instalmentLines){
        let dateMatch;
        if(dateMatch = line.match(/CCATP_([0-9]{4})_([0-9]{2})_([0-9]{2}).mp3/)){
            iso8601Date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
            console.debug(`Found post date ${iso8601Date} in filename ${dateMatch[0]}`);
            break; // exit the loop
        }
    }

    //
    // build the output contents
    //
    let outputLines = [];

    // build the front matter
    outputLines.push('---');
    outputLines.push(`title: ${title}`);
    outputLines.push(`instalment: ${instalmentNumber}`);
    outputLines.push('creators: [bart, allison]');
    if(iso8601Date){
        outputLines.push(`date: ${iso8601Date}`);
    }
    outputLines.push('---');

    // copy the contents lines
    let currentLine = titleLine + 1;
    while(currentLine <= lastContentLine){
        outputLines.push(instalmentLines[currentLine]);
        currentLine++;
    }

    //
    // Write the output file
    //

    // build the output path
    const outputFile = path.join(outputDir, instalmentFile);

    // write the contents to the file
    try{
        fs.writeFileSync(outputFile, outputLines.join("\n"));
        console.log(`Successfully migrated '${instalmentFile}' to '${outputFile}'`);
    }catch(err){
        console.error(`Failed to write output to '${outputFile}' with error: ${err}`);
    }
}