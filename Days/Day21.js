module.exports = function(input){

    var day = require('./Base.js');

    let parsedInput;

    day.setup = function(){
        parsedInput = input.trim().replace(/\r/g, "").split("\n").map(line => parseInt(line.match(/\d+$/g)[0][0], 10));
    }

    day.partOne = function(){
        let position = [parsedInput[0], parsedInput[1]];
        let score = [0, 0];
        let dice = deterministicDice();

        let turn = 0;

        while (score[0] < 1000 && score[1] < 1000){
            playTurn(turn, dice, position, score);
            turn = turn ? 0 : 1;
        }

        let losingScore = score[0] < score[1] ? score[0] : score[1];
        let totalRolls = dice.getTotalRolls();
        console.log(totalRolls * losingScore);
    }

    day.partTwo = function(){
        let firstTurn = 0;
        let positions = [parsedInput[0], parsedInput[1]];
        let scores = [0, 0];
        let universeAmount = 1;
        let diceRoll = diracDice().getRolls();
        let winningUniverses = [0, 0];

        playDiracTurn(firstTurn, positions, scores, universeAmount, diceRoll, winningUniverses);

        console.log(winningUniverses[0] > winningUniverses[1] ? winningUniverses[0] : winningUniverses[1]);
    }

    function playTurn(turn, dice, position, score){
        let roll = dice.getThree();
        position[turn] = ((position[turn] - 1 + roll) % 10) + 1;
        score[turn] += position[turn];
    }

    function deterministicDice(){
        let index = 1;
        let totalRolls = 0;

        function getNext(){
            let val = index;
            totalRolls++;
            index = index < 100 ? index+1 : 1;
            return val;
        }

        function getThree(){
            return getNext() + getNext() + getNext();
        }

        function getTotalRolls(){
            return totalRolls;
        }

        return {
            getNext : getNext,
            getThree : getThree,
            getTotalRolls : getTotalRolls
        }
    }

    function playDiracTurn(turn, positions, scores, amount, diceRoll, winners){
        if (scores[0] >= 21) { winners[0] += amount; return; }
        if (scores[1] >= 21) { winners[1] += amount; return; }

        // slightly faster to cache current turn values than copy position/score array
        let currPos = positions[turn];
        let currScore = scores[turn];

        for (let i = 0; i < diceRoll.length; i++) {
            positions[turn] = ((positions[turn] - 1 + diceRoll[i][0]) % 10) + 1;
            scores[turn] += positions[turn];
            let newAmount = amount * diceRoll[i][1];

            playDiracTurn(turn ? 0 : 1, positions, scores, newAmount, diceRoll, winners);

            positions[turn] = currPos;
            scores[turn] = currScore;
        }
    }

    function diracDice(){
        function getRolls(){
            // We just count the similar permutations of rolling 3d3
            // 3 can only happen once (1, 1, 1), 4 can happen 3 times (2, 1, 1) | (1, 2, 1) | (1, 1, 2), etc.
            return [ [3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1] ];
        }

        return {
            getRolls : getRolls
        }
    }

    return day;
}