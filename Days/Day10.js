module.exports = function(input){

    var day = require('./Base.js');
    var Stack = require('../Util/Stack.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split('\n').map(x => x.trim().split(""));
    }

    day.partOne = function(){
        const errors = [];

        for (let i = 0; i < parsedInput.length; i++){
            errors.push(findLineCorruption(parsedInput[i]).error);
        }

        console.log(errors.reduce((a, b) => a + b, 0));
    }

    const chars = { 
        "{" : { char: "{", pair: "}" , isClose : false },
        "[" : { char: "[", pair: "]" , isClose : false }, 
        "(" : { char: "(", pair: ")" , isClose : false },
        "<" : { char: "<", pair: ">" , isClose : false },
        "}" : { char: "}", pair: "{" , isClose : true },
        "]" : { char: "]", pair: "[" , isClose : true },
        ")" : { char: ")", pair: "(" , isClose : true },
        ">" : { char: ">", pair: "<" , isClose : true }
    };

    function findLineCorruption(line){
        let stack = new Stack();

        for (let i = 0; i < line.length; i++){
            let curr = chars[line[i]];

            if (!curr.isClose) { 
                stack.add(curr); 
                continue; 
            }

            if (stack.peek().char === curr.pair) {
                stack.pop();
                continue;
            }

            // error
            return {
                error: syntaxErrorScore(curr.char),
                stack : stack
            }
        }

        // no error
        return {
            error : 0,
            stack : stack
        };
    }

    const errorScore = {")" : 3, "]" : 57, "}" : 1197, ">" : 25137};
    
    function syntaxErrorScore(character){
        return errorScore[character];
    }

    day.partTwo = function(){
        let uncorruptedStacks = [];
        let scores = [];

        for (let i = 0; i < parsedInput.length; i++){
            let corruptionResult = findLineCorruption(parsedInput[i]);
            if (corruptionResult.error === 0){
                uncorruptedStacks.push(corruptionResult.stack); 
            }
        }

        for (let i = 0; i < uncorruptedStacks.length; i++){
            scores.push(valueStack(uncorruptedStacks[i]));
        }

        scores.sort((a,b) => a - b);
        console.log(scores[(scores.length-1)/2]);
    }

    const points = {")" : 1, "]" : 2, "}" : 3, ">" : 4};

    function valueStack(stack){
        let score = 0;

        while (!stack.isEmpty()){
            let char = stack.pop();

            score *= 5;
            score += points[char.pair];
        }

        return score;
    }

    return day;
}