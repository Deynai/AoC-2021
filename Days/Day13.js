module.exports = function(input){

    var day = require('./Base.js');
    var HashSet = require("../Util/HashSet.js");

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().replace(/\r/g, "").split('\n\n').map(x => x.trim().split("\n"));
    }

    function parseInput(){
        let dots = parsedInput[0].map(line => {
            let splitLine = line.split(",");
            return {
                x : parseInt(splitLine[0], 10),
                y : parseInt(splitLine[1], 10)
            }
        });
        
        let folds = parsedInput[1].map(line => { 
            let splitLine = line.replace(/fold along /, "").split("=");
            return { 
                axis: splitLine[0],
                value : parseInt(splitLine[1], 10) }
        })

        return {
            dots: dots,
            folds: folds
        }
    }

    day.partOne = function(){
        let state = parseInput();

        fold(state.folds[0].axis, state.folds[0].value, state);

        console.log(countDots(state));
    }
    
    day.partTwo = function(){
        let state = parseInput();

        for (let i = 0; i < state.folds.length; i++){
            fold(state.folds[i].axis, state.folds[i].value, state);
        }

        displayDots(state);
    }

    function fold(axis, val, state){
        for (let i = 0; i < state.dots.length; i++){
            let dot = state.dots[i];
            let delta = dot[axis] - val;
            dot[axis] = delta > 0 ? val - delta : dot[axis];
        }
    }

    function countDots(state){
        let hashSet = new HashSet();

        for (let i = 0; i < state.dots.length; i++){
            let dot = state.dots[i];
            hashSet.tryAdd(`${dot.x},${dot.y}`);
        }

        return hashSet.length();
    }

    function displayDots(state){
        let display = [];

        for (let i = 0; i < state.dots.length; i++){
            let dot = state.dots[i];
            if (!display[dot.y]){
                display[dot.y] = [];
            }
            display[dot.y][dot.x] = "@ ";
        }

        for (let i = 0; i < display.length; i++){
            if (!display[i]) { continue; }
            let line = "";
            for (let j = 0; j < display[i].length; j++){
                line += display[i][j] ? display[i][j] : "  ";
            }
            console.log(line);
        }
    }

    return day;
}