module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split('\n').map(x => x.trim().split(""));
    }

    day.partOne = function(){
        let moved = true;
        let count = 0;
        while (moved){
            let result = nextStep(parsedInput);
            parsedInput = result.grid;
            moved = result.moved;
            count++;
        }

        console.log(count);
    }

    day.partTwo = function(){
        console.log("\u2605");
    }

    function nextStep(grid){
        let newGrid = [];
        let height = grid.length;
        let width = grid[0].length;
        let moved = false;

        // east
        for (let i = 0; i < height; i++){
            newGrid[i] = [];
            for (let j = 0; j < width; j++){
                if (grid[i][j] === ">"){
                    if (grid[i][(j+1) % width] === "."){
                        newGrid[i][j] = ".";
                        newGrid[i][(j+1) % width] = ">";
                        moved = true;
                    }
                    else{
                        newGrid[i][j] = ">";
                    }
                }
                else{
                    if (!newGrid[i][j]){
                        newGrid[i][j] = grid[i][j];
                    }
                }
            }
        }

        let newGrid2 = [];

        for (let i = 0; i < newGrid.length; i++){
            newGrid2[i] = [];
        }

        // south
        for (let i = 0; i < newGrid.length; i++){
            for (let j = 0; j < newGrid[0].length; j++){
                if (newGrid[i][j] === "v"){
                    if (newGrid[(i+1) % height][j] === "."){
                        newGrid2[i][j] = ".";
                        newGrid2[(i+1) % height][j] = "v";
                        moved = true;
                    }
                    else{
                        newGrid2[i][j] = "v";
                    }
                }
                else{
                    if (!newGrid2[i][j]){
                        newGrid2[i][j] = newGrid[i][j];
                    }
                }
            }
        }

        return {
            grid : newGrid2,
            moved : moved
        }
    }

    return day;
}