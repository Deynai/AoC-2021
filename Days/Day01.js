module.exports = function(input){

    var base = require('./Base.js');
    var day = base.prototype;

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split('\n').map(x => { return parseInt(x, 10)});
    }

    day.partOne = function(){
        let count = 0;

        for (let i = 0; i < parsedInput.length; i++) {
            if (parsedInput[i+1] > parsedInput[i]){
                count = count + 1;
            }
        }

        console.log('Part 1 ~ ' + count);
    }

    day.partTwo = function(){
        let count = 0;

        for (let i = 0; i < parsedInput.length - 3; i++) {
            if (parsedInput[i+3] > parsedInput[i]){
                count = count + 1;
            }
        }

        console.log('Part 2 ~ ' +count);
    }

    return day;
}