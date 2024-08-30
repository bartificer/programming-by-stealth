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
const failureMessages = []; // an array of strings
const warningMessages = []; // an array of strings
let numCompleted = 0;
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
        const msg = `Failed to match title in '${instalmentFile}'`;
        console.error(msg);
        failureMessages.push(msg);
        continue; // skip on to the next file
    }

    // find the next/prev link line numbers
    let lastContentLine = instalmentLines.length - 2; // there is a blank line on the end!
    while(instalmentLines[lastContentLine].match(/^-[ ]/)) lastContentLine--;

    // try find an approximate publishing date from the filename of the first instalment MP3 file name
    // also capture the audio URL
    let iso8601Date = false;
    let audioURL = '';
    for(const line of instalmentLines){
        // start by finding the Audio element for the podcast episode and extracting the URL
        const audioURLMatch = line.match(/<audio[ ]controls[ ]src="(.+)">/);
        if(audioURLMatch){
            audioURL = audioURLMatch[1];
            console.debug(`Found audio URL ${audioURL}`);

            // now try get the data from the filename in the URL
            const dateMatch = audioURL.match(/(?:CCATP|PBS)_([0-9]{4})_([0-9]{2})_([0-9]{2})[-_0-9a-zA-Z]*[.]mp3/);
            if(dateMatch){
                iso8601Date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
                console.debug(`Found post date ${iso8601Date} in MP3 file ${dateMatch[0]}`);
            }

            // exit the loop
            break;
        }
    }
    if(!audioURL){
        const msg = `Failed to find audio URL '${instalmentFile}'`;
        console.warn(msg);
        warningMessages.push(msg);
    }
    if(!iso8601Date){
        const msg = `Failed to find date in '${instalmentFile}'`;
        console.warn(msg);
        warningMessages.push(msg);
    }

    // check for a mini-series
    let miniSeries = '';
    const miniSeriesMatch = title.match(/^(\w+):[ ]+(.+$)/);
    if(miniSeriesMatch){
        miniSeries = miniSeriesMatch[1];
        title = miniSeriesMatch[2];
    }

    //
    // build the output contents
    //
    let outputLines = [];

    // build the front matter
    outputLines.push('---');
    outputLines.push(`title: ${title}`);
    outputLines.push(`instalment: ${instalmentNumber}`);
    if(miniSeries){
        outputLines.push(`miniseries: ${miniSeries}`);
    }
    outputLines.push('creators: [bart, allison]');
    if(iso8601Date){
        outputLines.push(`date: ${iso8601Date}`);
    }
    if(audioURL){
        outputLines.push('opengraph:');
        outputLines.push(`  audio: ${audioURL}`);
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
        numCompleted++;
    }catch(err){
        const msg = `Failed to write output to '${outputFile}' with error: ${err}`;
        console.error(msg);
        failureMessages.push(msg);
    }
}

// report on outputs
if(numCompleted){
    console.log('');
    console.log(`=== NOTE: Successfully Migrated ${numCompleted} instalment(s) ===`);
}

const numWarnings = warningMessages.length;
if(numWarnings){
    console.log('');
    console.log(`--- WARNING: Not all Files were Perfectly Processed ---`);
    console.log('');
    for(const msg of warningMessages){
        console.log(`- ${msg}`);
    }
}

const numFailedFiles = failureMessages.length;
if(numFailedFiles){
    console.log('');
    console.log(`*** ERROR — FAILED TO PROCESS ${numFailedFiles} FILE(S)***`);
    console.log('');
    for(const msg of failureMessages){
        console.log(`- ${msg}`);
    }
}