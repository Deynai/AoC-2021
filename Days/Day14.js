module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput;

    day.setup = function(){
        parsedInput = input.trim().replace(/\r/g, "").split("\n\n");
    }

    function initialiseState(parsedText){

        // conversion rules
        let rules = parsedText[1].split("\n").map(line => {
            let rule = line.split(" -> ");
            return { 
                pair: rule[0],
                char: rule[1],
                result: [rule[0].charAt(0) + rule[1], rule[1] + rule[0].charAt(1)]
            };
        });

        // polymer pairs
        let polymer = {};

        for (let i = 0; i < rules.length; i++){
            polymer[rules[i].pair] = 0;
        }

        for (let i = 0; i < parsedText[0].length - 1; i++){
            let pair = parsedText[0].charAt(i) + parsedText[0].charAt(i + 1);
            polymer[pair]++;
        }

        // individual chars
        let chars = {};

        for (let i = 0; i < rules.length; i++){
            chars[rules[i].char] = 0;
        }
        for (let i = 0; i < parsedText[0].length; i++){
            chars[parsedText[0][i]]++;
        }

        return {
            polymer: polymer,
            rules: rules,
            chars: chars
        }
    }

    day.partOne = function(){
        let state = initialiseState(parsedInput);
        runTicks(10, state);

        let counts = countChars(state);
        console.log(Math.max(...counts) - Math.min(...counts));
    }

    day.partTwo = function(){
        let state = initialiseState(parsedInput);
        runTicks(40, state);

        let counts = countChars(state);
        console.log(Math.max(...counts) - Math.min(...counts));
    }

    function runTicks(steps, state){
        for (let i = 0; i < steps; i++){
            runTick(state);
        }
    }

    function runTick(state){
        let newPolymer = {};

        for (const pair in state.polymer){
            if (state.polymer.hasOwnProperty(pair)) {
                newPolymer[pair] = 0;
            }
        }

        for (let i = 0; i < state.rules.length; i++){
            let rule = state.rules[i];
            let polymerPairCount = state.polymer[rule.pair];

            newPolymer[rule.result[0]] += polymerPairCount;
            newPolymer[rule.result[1]] += polymerPairCount;
            state.chars[rule.char] += polymerPairCount;
        }

        state.polymer = newPolymer;
    }

    function countChars(state){
        let rawCounts = [];

        for (const char in state.chars){
            if (state.chars.hasOwnProperty(char)) {
                rawCounts.push(state.chars[char]);
            }
        }

        return rawCounts;
    }

    return day;
}