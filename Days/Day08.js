module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim()
        .split('\n')
        .map(x => 
            { 
                let sep = x.split("|").map(words => words.trim().split(" "));
                return { signal: sep[0], output: sep[1] }
            });
    }

    day.partOne = function(){
        let count = 0;
        for (let i = 0; i < parsedInput.length; i++){
            for (let j = 0; j < parsedInput[i].output.length; j++){
                let wordLength = parsedInput[i].output[j].length;
                if (wordLength === 2 || wordLength === 3 || wordLength === 4 || wordLength === 7){
                    count++;
                }
            }
        } 

        console.log(count);
    }

    day.partTwo = function(){
        var outputs = [];
        let count = 0;

        for (let i = 0; i < parsedInput.length; i++){
            outputs[i] = decipherSet(parsedInput[i]);
        }

        for (let i = 0; i < outputs.length; i++){
            let val = parseInt(outputs[i].join(""), 10);
            count += val;
        }

        console.log(count);
    }

    function decipherSet(set){
        // we don't attempt to solve individual letters, it is sufficient to consider pattern lengths and digit overlaps.
        // since all 10 digits are in the encrypted signal we always have one 2, one 3, one 4, three 5, three 6, and one 7 length patterns

        let identifiedPatterns = [];

        // group by size
        let patternsBySize = getPatternsBySize(set);
        
        // can immediately assign the length 2 pattern to 1, length 3 pattern to 7, etc
        fillPatternsKnownByLength(patternsBySize, identifiedPatterns);

        // can deduce which of the 3 lengths of six is which
        deducePatternsWithLengthSix(patternsBySize[6], identifiedPatterns);

        // then the fives
        deducePatternsWithLengthFive(patternsBySize[5], identifiedPatterns);

        // all patterns are identified and the 4 digits can be decoded
        return decodeOutput(set.output, identifiedPatterns);
    }

    function getPatternsBySize(set){
        var patternsBySize = [];

        for (let i = 2; i < 8; i++){
            patternsBySize[i] = [];
        }

        set.signal.forEach(pattern => {
            let splitPattern = pattern.split("");
            let alphabeticalPattern = splitPattern.sort((a,b) => a.localeCompare(b));
            let length = alphabeticalPattern.length;

            patternsBySize[length].push(alphabeticalPattern);
        });

        return patternsBySize;
    }

    function fillPatternsKnownByLength(patternsBySize, identifiedPatterns){
        const knownLengths = [];
        knownLengths[2] = 1; knownLengths[3] = 7; knownLengths[4] = 4; knownLengths[7] = 8;

        for (let i = 0; i < knownLengths.length; i++){
            if (!knownLengths[i]) { continue; }
            identifiedPatterns[knownLengths[i]] = patternsBySize[i][0];
        };
    }

    function deducePatternsWithLengthSix(sixes, identifiedPatterns){

        for (let i = 0; i < sixes.length; i++){

            let pattern = sixes[i];

            if (containsAll(pattern, identifiedPatterns[4])){
                // 9 is the only 6-length which fully contains 4
                identifiedPatterns[9] = pattern;
            }
            else if(containsAll(pattern, identifiedPatterns[1])){
                // 0 and 9 are the only ones that contain 1, but we already know it's not 9.
                identifiedPatterns[0] = pattern;
            }
            else{
                // only other option is 6
                identifiedPatterns[6] = pattern;
            }
        };
    }

    function deducePatternsWithLengthFive(fives, identifiedPatterns){

        for (let i = 0; i < fives.length; i++){
            let pattern = fives[i];

            if (containsAll(pattern, identifiedPatterns[1])){
                // 3 is the only 5-length which fully contains 1
                identifiedPatterns[3] = pattern;
            }
            else if(containsAll(identifiedPatterns[9], pattern)){
                // 9 fully contains 3 and 5, but we already know it's not 3.
                identifiedPatterns[5] = pattern;
            }
            else{
                // only other size 5 pattern is a 2
                identifiedPatterns[2] = pattern;
            }
        };
    }

    function decodeOutput(output, identifiedPatterns){
        let decodedOutput = [];

        for (let i = 0; i < output.length; i++){
            let code = output[i].split("");

            // sloppy to search for matches like this when we could invert the array instead, but we only do it 4 times.
            for (let j = 0; j < identifiedPatterns.length; j++){
                if (isMatch(code, identifiedPatterns[j])){
                    decodedOutput[i] = j;
                    break;
                }
            }
        }

        return decodedOutput;
    }

    function containsAll(set, vals){
        return vals.every(val => set.includes(val));
    }

    function isMatch(code, set){
        return (set.length === code.length && containsAll(set,code));
    }

    return day;
}