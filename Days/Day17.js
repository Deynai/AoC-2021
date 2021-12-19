module.exports = function(input){

    var day = require('./Base.js');

    day.setup = function(){
    }

    function initTarget(text){
        let ranges = [...input.matchAll(/-?\d+/g)].map(x => parseInt(x[0], 10));

        let x = [ranges[0], ranges[1]];
        let y = [ranges[2], ranges[3]];

        function inRange(i,j){
            return (i >= x[0] && i <= x[1] && j >= y[0] && j <= y[1]);
        }
        
        return {
            x: x,
            y: y,
            inRange: inRange
        }
    }

    day.partOne = function(){
        let target = initTarget(input);
        
        // Due to the input we need only consider when the target is below 0.
        // The probe goes up and down symmetrically and will be at a height of zero again, with velocity = -1 - v0.
        // The upper bound is therefore where it falls to the final edge of the target in one step which happens when velocity is target.y[0], i.e when v0 = -1 - target.y[0].
        // Finding the final height is then just v + v-1 + v-2 + ... + 1 = v(v+1)/2
        // e.g with target.y[0] = -6, v0 is 5, and the max height is 5*6/2 = 15.

        let maxVelocity = -1 - target.y[0];
        let maxHeight = maxVelocity * (maxVelocity + 1)/2;

        return console.log(maxHeight);
    }

    day.partTwo = function(){
        // for simplicity we find search bounds for vx and vy and simulate each.
        // an alternative for large input would be to consider vx and vy separately and then find all permutations that overlap the target with the same number of steps.
        
        let target = initTarget(input);

        let vyBounds = [target.y[0], 1 - target.y[0]];
        let vxBounds = [0, target.x[1]];

        let validInitialVelocityCount = 0;

        for (let vy = vyBounds[0]; vy <= vyBounds[1]; vy++){
            for (let vx = vxBounds[0]; vx <= vxBounds[1]; vx++){
                if(checkIfHitsTarget(vx, vy, target)){
                    validInitialVelocityCount++;
                }
            }
        }

        console.log(validInitialVelocityCount);
    }

    function checkIfHitsTarget(vx, vy, target){
        let x = 0;
        let y = 0;

        while (x <= target.x[1] && y >= target.y[0]){
            y += vy;
            vy--;
            x += vx;
            vx = vx > 0 ? vx - 1 : 0;

            if (target.inRange(x,y)){
                return true;
            }
        }

        return false;
    }

    return day;
}