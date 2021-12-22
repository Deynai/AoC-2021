module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split('\n');
    }

    function parseLine(line){
        let splitLine = line.split(" ");

        let toggle = splitLine[0];

        let numbers = [...splitLine[1].matchAll(/-?\d+/g)].map(x => parseInt(x[0], 10));

        return {
            toggle : toggle,
            x : [numbers[0], numbers[1]],
            y : [numbers[2], numbers[3]],
            z : [numbers[4], numbers[5]]
        }
    }

    day.partOne = function(){
        let rebootSteps = parsedInput.map(line => parseLine(line));
        let regions = [];
        
        for (let i = 0; i < rebootSteps.length; i++){
            let cuboid = rebootSteps[i];
            if (Math.abs(cuboid.x[0]) > 50 || Math.abs(cuboid.y[0]) > 50 || Math.abs(cuboid.z[0]) > 50) { continue; }

            createNewRegions(cuboid, regions);
        }

        let count = countRegions(regions);

        console.log(count);
    }

    day.partTwo = function(){
        let rebootSteps = parsedInput.map(line => parseLine(line));
        let regions = [];
        
        for (let i = 0; i < rebootSteps.length; i++){
            let cuboid = rebootSteps[i];
            
            createNewRegions(cuboid, regions);
        }

        let count = countRegions(regions);

        console.log(count);
    }

    function createNewRegions(cuboid, regions){
        // the idea behind this is to split unions of sets (cuboids) into sums of intersections of cuboids.
        // suppose B is an "on" state, then:  | A u B | = | A | + | B | - | A n B |
        // suppose B is an "off" state, then: | A u ¬B | = | A | - | A n B |

        // we can extend this further by expanding unions/intersections
        // | (A u B) u C | = | A u C | + | B u C | - | (A u C) n (B u C) |
        //                 = | A u C | + | B u C | - | (A n B) u C |
        //                 = | A | + | C | - | A n C | + | B | + | C | - | B n C | - (| A n B | + | C | - | A n B n C |)
        //                 = | A | + | B | + | C | - | A n B | - | A n C | - | B n C | + | A n B n C |

        // we get a nice pattern where each new union subtracts all pairs, then adds all triples, then subtracts all quadruples, etc
        // and for the "off" cuboids we get a very similar pattern where we only miss the first | C | term.

        let newRegions = [];

        if (cuboid.toggle === "on"){
            newRegions.push(createRegion(true, cuboid.x, cuboid.y, cuboid.z));
        }

        for (let i = 0; i < regions.length; i++){
            let region = regions[i];

            let newRegion = findIntersection(region, cuboid);
            if (newRegion !== null){
                newRegions.push(newRegion);
            }
        }

        for (let i = 0; i < newRegions.length; i++){
            regions.push(newRegions[i]);
        }
    }

    function findIntersection(region, cuboid){
        let xMin = Math.max(region.x[0], cuboid.x[0]);
        let xMax = Math.min(region.x[1], cuboid.x[1]);
        if (xMax < xMin) { return null; }

        let yMin = Math.max(region.y[0], cuboid.y[0]);
        let yMax = Math.min(region.y[1], cuboid.y[1]);
        if (yMax < yMin) { return null; }

        let zMin = Math.max(region.z[0], cuboid.z[0]);
        let zMax = Math.min(region.z[1], cuboid.z[1]);
        if (zMax < zMin) { return null; }

        return createRegion(!region.positive, [xMin, xMax], [yMin, yMax], [zMin, zMax]);
    }

    function createRegion(positive, xBounds, yBounds, zBounds){
        return {
            positive : positive,
            x : xBounds,
            y : yBounds,
            z : zBounds
        }
    }

    function countRegions(regions){
        let count = 0;

        for (let i = 0; i < regions.length; i++){
            let region = regions[i];
            let size = (region.x[1] - region.x[0] + 1) * (region.y[1] - region.y[0] + 1) * (region.z[1] - region.z[0] + 1);
            count += region.positive ? size : -size;
        }

        return count;
    }

    return day;
}