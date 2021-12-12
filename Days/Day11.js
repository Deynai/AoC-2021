module.exports = function(input){

    var day = require('./Base.js');
    var Grid = require('../Util/Grid.js');
    var Queue = require('../Util/Queue.js');
    //var HashSet = require('../Util/Hashset.js');

    var octopi = [];

    day.setup = function(){
        parsedInput = input.trim().split('\n').map(x => x.trim().split("").map(n => parseInt(n, 10)));
        octopi = new Grid(parsedInput);
    }

    day.partOne = function(){
        let steps = 100;
        let flashCount = 0;

        for (let i = 0; i < steps; i++){
            flashCount += runTick(octopi);
        }

        console.log(flashCount);
    }

    function runTick(octos){
        let flashers = new Queue();
        let flashed = [];
        let flashLevel = 10;

        addOneToAllOctos(flashers, octos, flashLevel);
        flashOctos(flashers, flashed, octos, flashLevel);
        setFlashedOctosToZero(flashed, octos);

        let flashCount = flashed.length;
        return flashCount;
    }

    function addOneToAllOctos(flashers, octos, flashLevel){
        octos.iterate((i, j) => {
            octos.grid[i][j] += 1;

            if (octos.grid[i][j] >= flashLevel){
                flashers.enqueue([i, j]);
            }
        })
    }

    function flashOctos(flashers, flashed, octos, flashLevel){
        while (!flashers.isEmpty()){
            let flashLocation = flashers.dequeue();
            flashed.push(flashLocation);

            for (let di = -1; di <= 1; di++){
                for (let dj = -1; dj <= 1; dj++){
                    if (di === 0 && dj === 0) { continue; }

                    let pos = [flashLocation[0] + di, flashLocation[1] + dj];
                    if (!octos.isValid(pos[0], pos[1])) { continue; }
                    
                    octos.grid[pos[0]][pos[1]] += 1;

                    if (octos.grid[pos[0]][pos[1]] === flashLevel){
                        flashers.enqueue(pos);
                    }
                }
            }
        }
    }

    function setFlashedOctosToZero(flashed, octos){
        flashed.forEach(location => {
            octos.grid[location[0]][location[1]] = 0;
        })
    }

    day.partTwo = function(){
        day.setup(); 
        let steps = 10000; // we assume it's less than 10,000
        let maxFlashCount = octopi.width() * octopi.height();

        for (let i = 1; i < steps; i++){
            if(runTick(octopi) === maxFlashCount){
                console.log(i);
                return;
            };
        }

        console.log("Did not find synchronised flashes.");
    }

    return day;
}