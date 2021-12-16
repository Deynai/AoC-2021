module.exports = function(input){

    var day = require('./Base.js');
    var Grid = require("../Util/Grid.js");
    var Queue = require("../Util/Queue.js");

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().replace(/\r/g, "").split("\n").map(x => x.split("").map(n => parseInt(n, 10)));
    }

    day.partOne = function(){
        let cave = new Grid(parsedInput);
        let bestPathFinalState = findPath(cave, cave.height(), cave.width());
        console.log(bestPathFinalState.actualRisk);
    }

    day.partTwo = function(){
        let cave = new Grid(parsedInput);
        let bestPathFinalState = findPath(cave, cave.height()*5, cave.width()*5);
        console.log(bestPathFinalState.actualRisk);
    }

    function findPath(cave, caveHeight, caveWidth){
        let bestScoreForPosition = {};
        let queue = new Queue();
        let deltas = [[0,1],[0,-1],[1,0],[-1,0]];
        let end = getState(caveWidth - 1, caveHeight - 1, 0, cave);
        let count = 0;

        let startingState = {id: "0,0", x : 0, y : 0, actualRisk : 0, score: 0};
        queue.enqueue(startingState);
        isBestScore(startingState, bestScoreForPosition);

        while (!queue.isEmpty()){
            let currState = queue.dequeue();

            //if (bestScoreForPosition[currState.id].seen) { continue; }
            //bestScoreForPosition[currState.id].seen = true;

            count++;

            if (currState.id === end.id) { console.log(count); return currState; }

            deltas.forEach(d => {
                let pos = [currState.x + d[0], currState.y + d[1]]
                if (!isGridPosValid(pos[1], pos[0], caveHeight, caveWidth)) { return; }
                let posState = getState(pos[0], pos[1], currState.actualRisk, cave, caveHeight, caveWidth);
                if (isBestScore(posState, bestScoreForPosition)){
                    queue.enqueueSorted(posState, queueSorter);
                }
            })
        }
    }

    function isBestScore(state, bestScoreForPosition){
        if (bestScoreForPosition[state.id] === undefined || state.score < bestScoreForPosition[state.id].score){
            bestScoreForPosition[state.id] = {x : state.x, y : state.y, score: state.score };
            return true;
        }
        return false;
    }

    function getState(x, y, startRisk, grid, caveHeight, caveWidth){
        let heuristic = 0;//(caveHeight - y + caveWidth - x - 2);
        let newRisk = getGridRisk(x, y, grid);
        let actualRisk = startRisk + newRisk;
        let score = heuristic + actualRisk;

        return {
            id: x + "," + y,
            x: x,
            y: y,
            actualRisk: actualRisk,
            score: score
        }
    }

    function getGridRisk(x, y, cave){
        let gridIncrement = Math.floor(x / cave.width()) + Math.floor(y / cave.height());
        let baseGridRisk = cave.grid[y % cave.height()][x % cave.width()];

        return gridRisk = ((baseGridRisk + gridIncrement - 1) % 9) + 1;
    }

    function isGridPosValid(i, j, caveHeight, caveWidth){
        return i >= 0 && i < caveHeight && j >= 0 && j < caveWidth;
    }

    function queueSorter(a, b){
        return a.score < b.score;
    }

    return day;
}