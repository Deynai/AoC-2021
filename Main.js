require('dotenv').config();

const args = process.argv.slice(2);
const dayNumber = args[0];
const isTest = args[1];
const testFilePath = args[2];

if(isTest){
    loadTestInput(testFilePath);
}
else{
    loadInput();
}

function loadInput(){
    let FetchInput = require('./Util/FetchInput.js');
    let loader = new FetchInput();

    loader.day(dayNumber);

    loader.status.on('loaded', (err, data) => {
        if (err) {console.error(err);}
        runDay(data.toString());
    })
}

function loadTestInput(filename){
    let FetchInput = require('./Util/FetchInput.js');
    let path = './TestInput/' + filename + '.txt';
    let loader = new FetchInput();

    loader.fromFile(path);

    loader.status.on('loaded', (err, data) => {
        if (err) {console.error(err);}
        runDay(data.toString());
    })
}

function runDay(input){
    let dayModulePath = './Days/Day' + dayNumber.toString().padStart(2, '0');
    let DayModule = require(dayModulePath);
    let day = new DayModule(input);

    day.setup();
    day.partOne();
    day.partTwo();
}
