module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split(',').map(x => { return parseInt(x, 10)});
    }

    day.partOne = function(){
        let distance = findMinimumDistance(parsedInput, sumDistance);
        console.log(distance);
    }

    day.partTwo = function(){
        let distance = findMinimumDistance(parsedInput, sumTriangleDistance);
        console.log(distance);
    }

    function sumVals(vals){
        var sum = 0;
        for(let i = 0; i < vals.length; i++){
            sum += vals[i];
        }
        return sum;
    }
    
    function findMinimumDistance(crabPositions, distanceFunction){
        let minIndex = Math.min.apply(null, crabPositions);
        let maxIndex = Math.max.apply(null, crabPositions);

        let prevDistance = Number.MAX_VALUE;

        for (let i = minIndex; i < maxIndex; i++){
            let distance = distanceFunction(crabPositions, i);
            if (distance > prevDistance){
                // since the minimum distance has one global minimum we can stop when we start increasing
                // could optimise even further by doing some kind of newton-raphson iterative method but the input is small enough.
                break;
            }
            prevDistance = distance;
        }

        return prevDistance;
    }

    function sumDistance(crabPositions, N){
        let sum = 0;
        for (let i = 0; i < crabPositions.length; i++){
            sum += Math.abs(crabPositions[i] - N);
        }
        return sum;
    }

    function sumTriangleDistance(crabPositions, N){
        let sum = 0;
        for (let i = 0; i < crabPositions.length; i++){
            let val = crabPositions[i];
            sum += (Math.abs(N - val) * (Math.abs(N - val) + 1)) / 2; // triangle numbers: 1 + 2 + 3 + .. + n = n*(n+1)/2
        }
        return sum;
    }

    return day;
}