module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split('\n').map(x => { return parseInt(x, 10)});
    }

    day.partOne = function(){
        let count = 0;

        console.log(count);
    }

    day.partTwo = function(){
        let count = 0;

        console.log(count);
    }

    return day;
}