module.exports = function(input){

    var Base = require('./Base.js');
    var day = new Base;

    var parsedInput; // {s: {x:, y:}, f: {x:, y:}} []
    var minValue;
    var maxValue;

    day.setup = function(){
        parsedInput = input.trim()
            .split('\n')
            .map(x => {
                let matches = [...x.trim().matchAll(/-?\d+/g)];
                return { s: { x: Number(matches[0][0]), y: Number(matches[1][0]) }, f: { x: Number(matches[2][0]), y: Number(matches[3][0])}}
            });      

        const sortedNumbers = [...input.matchAll(/-?\d+/g)].map(m => Number(m[0])).sort((x,y) => x - y);
        minValue = sortedNumbers[0];
        maxValue = sortedNumbers[sortedNumbers.length-1];
    }

    function initBoard(){
        var board = [];
        for (let i = minValue; i < maxValue + 1; i++){
            board[i] = [];

            for(let j = minValue; j < maxValue + 1; j++){
                board[i][j] = 0;
            }
        }

        return board;
    }

    day.partOne = function(){
        var board = initBoard();

        for (let i = 0; i < parsedInput.length; i++){
            addToBoard(parsedInput[i].s, parsedInput[i].f, board, true);
        }

        console.log(`Part 1 ~ ${sumOverlaps(board)}`);
    }

    day.partTwo = function(){
        var board = initBoard();

        for (let i = 0; i < parsedInput.length; i++){
            addToBoard(parsedInput[i].s, parsedInput[i].f, board, false);
        }

        console.log(`Part 2 ~ ${sumOverlaps(board)}`);
    }

    function addToBoard(s, f, board, straightOnly){
        if (straightOnly && s.x !== f.x && s.y !== f.y) { return; }

        const delta = { x: f.x - s.x, y: f.y - s.y };
        const gcd = Math.abs(gcdRecurse(delta.x, delta.y));
        const step = { x: delta.x / gcd, y: delta.y / gcd };

        for(let i = 0; i < gcd + 1; i++){
            board[s.x + i*step.x][s.y + i*step.y] += 1;
        }
    }

    function sumOverlaps(board){
        var overlaps = 0;

        for (let i = minValue; i < maxValue + 1; i++){
            for (let j = minValue; j < maxValue + 1; j++){
                if (board[i][j] > 1){
                    overlaps++;
                }
            }
        }

        return overlaps;
    }

    function gcdRecurse(a, b){
        if (b){
            return gcdRecurse(b, a % b);
        }
        return a;
    }

    return day;
}