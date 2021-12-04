module.exports = function(input){

    var Base = require('./Base.js');
    var day = new Base;

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.split('\n').map(x => { 
                                                let v = x.split(' ');
                                                return [v[0], parseInt(v[1])];
                                            });
    }

    day.partOne = function(){
        var xyz = [0,0]; // depth, distance

        for (let i = 0; i < parsedInput.length; i++){

            let command = parsedInput[i][0];
            let val = parsedInput[i][1];

            switch (command) {
                case 'up':
                    xyz[0] -= val;
                break;
                case 'down':
                    xyz[0] += val;
                break;
                case 'forward':
                    xyz[1] += val;
                break;
                default:
                    break;
            }
        }

        //console.log('Part 1 ~ Depth: ' + xyz[0] + ' Distance: ' + xyz[1] + ' Multiplied: ' + xyz[0]*xyz[1]);
        console.log('Part 1 ~ ' + xyz[0]*xyz[1]);
    }

    day.partTwo = function(){
        var xyz = [0,0,0]; // depth, distance, aim

        for (let i = 0; i < parsedInput.length; i++){

            let command = parsedInput[i][0];
            let val = parsedInput[i][1];

            switch (command) {
                case 'up':
                    xyz[2] -= val;
                break;
                case 'down':
                    xyz[2] += val;
                break;
                case 'forward':
                    xyz[1] += val;
                    xyz[0] += xyz[2] * val;
                break;
                default:
                    break;
            }
        }

        //console.log('Part 2 ~ Depth: ' + xyz[0] + ' Distance: ' + xyz[1] + ' Multiplied: ' + xyz[0]*xyz[1]);
        console.log('Part 2 ~ ' + xyz[0]*xyz[1]);
    }

    return day;
}