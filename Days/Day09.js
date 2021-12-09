module.exports = function(input){

    const day = require('./Base.js');
    const Grid = require("../Util/Grid.js");
    const HashSet = require("../Util/HashSet.js")
    const Queue = require("../Util/Queue.js");

    var caves;

    day.setup = function(){
        let parsedInput = input.trim()
                            .split('\n')
                            .map(line => { 
                                return [... line.trim()].map(num => parseInt(num, 10)); });
        
        caves = new Grid(parsedInput);
    }

    day.partOne = function(){
        let lowPoints = findLowPoints(caves);

        let count = 0;
        for (let i = 0; i < lowPoints.length; i++){
            count += caves.grid[lowPoints[i][0]][lowPoints[i][1]] + 1;
        }

        console.log(count);
    }

    function findLowPoints(caves){
        let lowPoints = [];

        caves.iterate((i,j) => {
            if (isLowPoint(i, j, caves)){
                lowPoints.push([i, j]);
            }
        })

        return lowPoints;
    }

    function isLowPoint(i, j, caves){
        let neighbours = getNeighbours([i,j], caves);

        for (let k = 0; k < neighbours.length; k++){
            let pos = neighbours[k];
            if (caves.grid[pos[0]][pos[1]] <= caves.grid[i][j]){
                return false;
            }
        }

        return true;
    }

    day.partTwo = function(){
        let lowPoints = findLowPoints(caves);
        let basins = [];

        for (let i = 0; i < lowPoints.length; i++){
            basins.push(scanBasin(lowPoints[i], caves));
        }

        basins.sort((a,b) => b - a);

        console.log(basins[0] * basins[1] * basins[2]);
    }

    function scanBasin(lowPoint, caves){
        const hashset = new HashSet();
        const queue = new Queue();

        queue.enqueue(lowPoint);
        hashset.add(`${lowPoint[0]},${lowPoint[1]}`);

        while (!queue.isEmpty()){
            let pos = queue.dequeue();

            let neighbours = getNeighbours(pos, caves);

            neighbours.forEach(n => {
                if (caves.grid[n[0]][n[1]] !== 9 && caves.grid[n[0]][n[1]] > caves.grid[pos[0]][pos[1]] && !hashset.contains(`${n[0]},${n[1]}`)){
                    queue.enqueue(n);
                    hashset.add(`${n[0]},${n[1]}`);
                }
            })
        }

        return hashset.length();
    }

    function getNeighbours(pos, caves){
        const deltas = [[0,1],[0,-1],[1,0],[-1,0]];
        let neighbours = [];

        for (let i = 0; i < deltas.length; i++){
            let di = pos[0] + deltas[i][0];
            let dj = pos[1] + deltas[i][1];

            if (!inBounds(di, dj, caves)) { continue; }

            neighbours[neighbours.length] = [di,dj];
        }

        return neighbours;
    }

    function inBounds(i, j, caves){
        return (i >= 0 && i < caves.grid.length && j >= 0 && j < caves.grid[0].length);
    }

    return day;
}