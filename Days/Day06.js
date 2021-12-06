module.exports = function(input){

    var Base = require('./Base.js');
    var day = new Base;

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split(',').map(x => { return parseInt(x, 10)});
    }

    day.partOne = function(){
        const numberOfStates = 8;
        const ticks = 80;
        const states = initStates(numberOfStates, parsedInput);

        for (let i = 0; i < ticks; i++){
            runTick(states);
        }

        console.log(countLanternfish(states));
    }

    function initStates(numberOfStates, input){
        let states = [];

        for (let i = 0; i < numberOfStates + 1; i++){
            states[i] = 0;
        }

        for (let i = 0; i < input.length; i++){
            states[input[i]]++;
        }

        return states;
    }

    function runTick(states){
        const zeros = states[0];

        for (let i = 0; i < states.length - 1; i++){
            states[i] = states[i+1];
        }
        states[8] = 0;

        states[6] += zeros;
        states[8] += zeros;
    }

    function countLanternfish(states){
        let count = 0;
        for (let i = 0; i < states.length; i++){
            count += states[i];
        }
        return count;
    }

    day.partTwo = function(){
        const numberOfStates = 8;
        const ticks = 256;
        const states = initStates(numberOfStates, parsedInput);

        for (let i = 0; i < ticks; i++){
            runTick(states);
        }

        console.log(countLanternfish(states));
    }

    return day;
}