module.exports = function(input){

    var Base = require('./Base.js');
    var day = new Base;

    var parsedInput = '';
    var bingoNumbers = [];
    var bingoBoards = [];

    day.setup = function(){
        parsedInput = input.trim().split('\n');
        bingoNumbers = parsedInput[0].split(',').map(x => x.trim());

        let remainingInput = parsedInput.slice(2);

        for (let i = 0; i < remainingInput.length; i += 6){
            let boardIndex = i / 6;
            let board = new Array(5);
            for(let j = 0; j < 5; j++){
                let row = remainingInput[i + j].split(' ').map(x => x.trim()).filter(e => e != '');
                board[j] = row;
            }
            bingoBoards[boardIndex] = board;
        }
    }

    day.partOne = function() {
        for (let i = 0; i < bingoNumbers.length; i++){
            var number = bingoNumbers[i];

            for (let bIndex = 0; bIndex < bingoBoards.length; bIndex++){
                let result = addNumberToBoard(bingoBoards[bIndex], number);

                if (result){
                    console.log('Part 1 ~ ' + calculateScore(bingoBoards[bIndex], number));
                    return;
                }
            }
        }
    }

    function addNumberToBoard(board, number){
        for (let i = 0; i < 5; i++){
            for (let j = 0; j < 5; j++){
                if (board[i][j] == number){
                    board[i][j] = 'X';
                    return checkIfBoardWins(i, j, board);
                }
            }
        }
    }

    function checkIfBoardWins(y, x, board){

        if (board[0][x] == 'X' && board[1][x] == 'X' && board[2][x] == 'X' && board[3][x] == 'X' && board[4][x] == 'X'){
            return true;
        }
        if (board[y][0] == 'X' && board[y][1] == 'X' && board[y][2] == 'X' && board[y][3] == 'X' && board[y][4] == 'X'){
            return true;
        }

        return false;
    }

    function calculateScore(board, number){
        let count = 0;

        for (let i = 0; i < 5; i++){
            for (let j = 0; j < 5; j++){
                if (board[i][j] != 'X'){
                    count += Number(board[i][j]);
                }
            }
        }

        return count * number;
    }

    day.partTwo = function(){
        day.setup();
        let activeBoardCount = bingoBoards.length;

        for (let i = 0; i < bingoNumbers.length; i++){
            var number = bingoNumbers[i];

            for (let bIndex = 0; bIndex < bingoBoards.length; bIndex++){
                if (bingoBoards[bIndex] == 'complete'){continue;}
                let result = addNumberToBoard(bingoBoards[bIndex], number);

                if (result){
                    if(activeBoardCount == 1){
                        //console.log(`Part 2 ~ Final Board ${bIndex} complete with score: ` + calculateScore(bingoBoards[bIndex], number));
                        console.log(`Part 2 ~ ` + calculateScore(bingoBoards[bIndex], number));
                    }
                    bingoBoards[bIndex] = 'complete';
                    activeBoardCount--;
                }
            }
        }
    }

    return day;
}