module.exports = function(input){

    var Base = require('./Base.js');
    var day = new Base;

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.split('\n').map(x => x.trim());
    }

    day.partOne = function(){
        var length = parsedInput[0].length;
        var counts = [];
        for (let i = 0; i < length; i++){
            counts[i] = 0;
        }

        for (let i = 0; i < parsedInput.length; i++){
            for (let j = 0; j < parsedInput[i].length; j++){
                counts[j] += (parsedInput[i][j] === '1') ? 1 : -1;
            }
        }

        var gammaRate = '';
        var epsilonRate = '';

        for (let i = 0; i < length; i++){
            gammaRate += (counts[i] > 0) ? '1' : '0';
            epsilonRate += (counts[i] > 0) ? '0' : '1';
        }

        var product = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);

        console.log('Part 1 ~ ' + product);
    }

    day.partTwo = function(){
        var oxygenGeneratorRating = findRating(mostCommonIndex('1', '0'));
        var cO2ScrubberRating = findRating(mostCommonIndex('0', '1'));

        var product = parseInt(oxygenGeneratorRating, 2) * parseInt(cO2ScrubberRating, 2);

        console.log('Part 2 ~ ' +product);
    }

    function findRating(tokenFinder){
        var list = parsedInput;
        var length = parsedInput[0].length;
        
        for (let i = 0; i < length; i++){
            let mostCommonToken = tokenFinder(list, i);
            list = list.filter(filterByIndexValue(i, mostCommonToken));

            if (list.length === 1) { break; }
        }

        return list[0];
    }

    function mostCommonIndex(trueResult, falseResult){
        return function(list, index){
            let count = 0;

            for (let i = 0; i < list.length; i++){
                count += list[i][index] === '1' ? 1 : -1;
            }

            return (count >= 0) ? trueResult : falseResult;
        }
    }

    function filterByIndexValue(index, value){
        return function(entry){
            return entry[index] == value;
        }
    }

    return day;
}