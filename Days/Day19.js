module.exports = function(input){

    var day = require('./Base.js');

    let scannerOffsets = [];

    day.setup = function(){
    }

    function initScanners(input){
        let scannerInput = input.trim().replace(/\r/g, "").split("\n\n");
        
        let scanners = [];
        for (let i = 0; i < scannerInput.length; i++){
            scanners[i] = newScanner(scannerInput[i].split("\n"));
        }

        return scanners;
    }
    
    function newScanner(scannerInput){
        let data = [];
        let id = parseInt(scannerInput[0].replace(/[- scanner]+/g, ""), 10);

        for (let i = 1; i < scannerInput.length; i++){
            let splitLine = scannerInput[i].split(",").map(n => parseInt(n, 10));
            data[i-1] = {
                x : splitLine[0],
                y : splitLine[1],
                z : splitLine[2]
            }
        }

        return {
            id : id,
            data : data,
            complete : false
        }
    }

    day.partOne = function(){
        let scanners = initScanners(input);
        let points = {};

        for (let i = 0; i < scanners[0].data.length; i++){
            let d = scanners[0].data[i];
            points[`${d.x},${d.y},${d.z}`] = d;
        }
        scanners[0].complete = true;

        for (let i = 0; i < scanners.length; i++){
            if (scanners[i].complete) { continue; }

            let result = findMaxMatches(points, scanners[i]);
            if (result.maxMatches >= 12){
                mergePoints(points, result.maxScanner);
                scanners[result.maxScanner.id].complete = true;
                scannerOffsets.push(result.maxOffset);
                i = 0;
            }
        }

        let count = 0;

        for (const point in points){
            if (!points.hasOwnProperty(point)) { continue; }
            count++;
        }

        console.log(count);
    }

    day.partTwo = function(){
        let maxDistance = 0;

        for (let i = 0; i < scannerOffsets.length-1; i++){
            for (let j = i + 1; j < scannerOffsets.length; j++){
                let a = scannerOffsets[i];
                let b = scannerOffsets[j];

                let distance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs (a.z - b.z);

                if (distance > maxDistance){
                    maxDistance = distance;
                }
            }
        }

        console.log(maxDistance);
    }

    let rotations = [
        {x : "x", y : "y", z : "z", xn : 1, yn : 1, zn : 1}, {x : "x", y : "z", z : "y", xn : 1, yn : 1, zn : -1}, {x : "x", y : "y", z : "z", xn : 1, yn : -1, zn : -1}, {x : "x", y : "z", z : "y", xn : 1, yn : -1, zn : 1},
        {x : "x", y : "y", z : "z", xn : -1, yn : -1, zn : 1}, {x : "x", y : "z", z : "y", xn : -1, yn : -1, zn : -1}, {x : "x", y : "y", z : "z", xn : -1, yn : 1, zn : -1}, {x : "x", y : "z", z : "y", xn : -1, yn : 1, zn : 1},
        {x : "y", y : "x", z : "z", xn : 1, yn : -1, zn : 1}, {x : "y", y : "z", z : "x", xn : 1, yn : -1, zn : -1}, {x : "y", y : "x", z : "z", xn : 1, yn : 1, zn : -1}, {x : "y", y : "z", z : "x", xn : 1, yn : 1, zn : 1},
        {x : "y", y : "x", z : "z", xn : -1, yn : 1, zn : 1}, {x : "y", y : "z", z : "x", xn : -1, yn : -1, zn : 1}, {x : "y", y : "x", z : "z", xn : -1, yn : -1, zn : -1}, {x : "y", y : "z", z : "x", xn : -1, yn : 1, zn : -1},
        {x : "z", y : "y", z : "x", xn : 1, yn : 1, zn : -1}, {x : "z", y : "x", z : "y", xn : 1, yn : 1, zn : 1}, {x : "z", y : "y", z : "x", xn : 1, yn : -1, zn : 1}, {x : "z", y : "x", z : "y", xn : 1, yn : -1, zn : -1},
        {x : "z", y : "y", z : "x", xn : -1, yn : 1, zn : 1}, {x : "z", y : "x", z : "y", xn : -1, yn : 1, zn : -1}, {x : "z", y : "y", z : "x", xn : -1, yn : -1, zn : -1}, {x : "z", y : "x", z : "y", xn : -1, yn : -1, zn : 1}
    ]

    function findMaxMatches(aPoints, scannerB){
        let maxMatches = 0;
        let maxRotatedScanner;
        let maxOffset;

        for (const point in aPoints){
            if (!aPoints.hasOwnProperty(point)) { continue; }
            let a_d = aPoints[point];

            for (let r = 0; r < rotations.length; r++){
                
                let rotatedB = rotateScanner(r, scannerB);
            
                for (let j = 0; j < rotatedB.data.length; j++){
                    let b_d = rotatedB.data[j];
                
                    let matches = 0;

                    let offset = { 
                        x : a_d.x - b_d.x,
                        y : a_d.y - b_d.y,
                        z : a_d.z - b_d.z
                    };

                    let offsetScanner = setOffsetScanner(offset, rotatedB);
                
                    for (let k = 0; k < rotatedB.data.length; k++){
                        let bPoint = offsetScanner.data[k];
                        if (aPoints[pointString(bPoint)]){
                            matches++;
                        }
                    }
    
                    if (matches > maxMatches){
                        maxMatches = matches;
                        maxRotatedScanner = copyScanner(offsetScanner);
                        maxOffset = { x : offset.x, y : offset.y, z : offset.z };
                    }
                }
            }
        }

        return {
            maxMatches : maxMatches,
            maxScanner : maxRotatedScanner,
            maxOffset : maxOffset
        }
    }

    function mergePoints(points, scanner){
        for (let i = 0; i < scanner.data.length; i++){
            points[pointString(scanner.data[i])] = scanner.data[i];
        }
    }

    function rotateScanner(rotationNumber, scanner){
        let rotator = rotations[rotationNumber];

        let newData = [];

        for (let i = 0; i < scanner.data.length; i++){
            let data = scanner.data[i];

            newData[i] = {
                x: data[rotator.x] * rotator.xn,
                y: data[rotator.y] * rotator.yn,
                z: data[rotator.z] * rotator.zn
            }
        }

        return {
            id: scanner.id,
            data : newData
        }
    }

    function copyScanner(scanner){
        let newData = [];
        for (let i = 0; i < scanner.data.length; i++){
            let d = scanner.data[i];
            newData[i] = {x : d.x, y : d.y, z : d.z};
        }

        return {
            id : scanner.id,
            data : newData
        }
    }

    function setOffsetScanner(offset, scanner){
        let newData = [];

        for (let i = 0; i < scanner.data.length; i++){
            let data = scanner.data[i];

            newData[i] = { 
                x : data.x + offset.x,
                y : data.y + offset.y,
                z : data.z + offset.z
            }
        }

        return {
            id : scanner.id,
            data : newData
        }
    }

    function pointString(point){
        return `${point.x},${point.y},${point.z}`;
    }

    return day;
}