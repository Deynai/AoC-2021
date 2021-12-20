module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput;

    day.setup = function(){
        parsedInput = input.trim().replace(/\r/g, "").split("\n\n");
    }

    function initialise(pInput){
        let enhancement = pInput[0].split("").map(c => c === "#" ? 1 : 0);

        let image = [];
        let imageInput = pInput[1].split("\n").map(line => line.split(""));
        
        for (let i = 0; i < imageInput.length; i++){
            image[i] = [];
            for (let j = 0; j < imageInput[0].length; j++){
                let cell = imageInput[i][j];
                image[i][j] = cell === "#" ? 1 : 0;
            }
        }

        return {
            enhancement : enhancement,
            image : image,
            parity : 0
        }
    }

    day.partOne = function(){
        let state = initialise(parsedInput);

        runTick(state);
        runTick(state);

        let count = countLitSquares(state);
        console.log(count);
    }
    
    day.partTwo = function(){
        let state = initialise(parsedInput);

        for (let i = 0; i < 50; i++){
            runTick(state);
        }

        let count = countLitSquares(state);
        console.log(count);
    }

    function runTick(state){
        let newImage = [];

        for (let i = 0; i < state.image.length + 2; i++) { 
            newImage[i] = [];
            for (let j = 0; j < state.image[0].length + 2; j++){
                
                let binaryOfPoint = convertPointToBinary(j - 1, i - 1, state.parity, state.image);
                newImage[i][j] = state.enhancement[binaryOfPoint];
            }
        }

        // update parity - all zeros -> enhancement[0], all ones -> enhancement[511] 
        state.parity = state.parity === 0 ? state.enhancement[0] : state.enhancement[state.enhancement.length - 1];

        state.image = newImage;
    }


    function convertPointToBinary(x, y, parity, image){
        let binary = [];

        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                let pX = x + j;
                let pY = y + i;
                // points outside of the image will either all be lit or unlit, according to parity
                let val = checkBounds(pX, pY, image) ? image[pY][pX] : parity;
                binary.push(val);
            }
        }

        binary = parseInt(binary.join(""), 2);

        return binary;
    }

    function checkBounds(x, y, image){
        return x >= 0 && x < image[0].length && y >= 0 && y < image.length;
    }

    function countLitSquares(state){
        let count = 0;

        for (let i = 0; i < state.image.length; i++){
            for (let j = 0; j < state.image[0].length; j++){
                if (state.image[i][j]) { count++; }
            }
        }

        return count;
    }

    return day;
}