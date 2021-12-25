module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().replace(/\r/g, "").split('\n');
    }

    function parseCommands(pInput){
        let commands = [];

        for (let i = 0; i < pInput.length; i++){
            let line = pInput[i];
            commands[i] = toCommand(line);
        }

        return commands;
    }

    function toCommand(line){
        let splitLine = line.split(" ");

        let val = parseInt(splitLine[2], 10);
        if (isNaN(val)) { val = splitLine[2]; }

        return{
            op : splitLine[0],
            a : splitLine[1],
            value : val
        }
    }

    function getMagicNumbers(commands){
        let magicNumbers = [];
        for (let index = 0; index < 14; index++){
            let magic = {};
            for (let c = 0; c < 18; c++){
                let cIndex = index * 18 + c;
                if (c === 5){
                    magic["k"] = commands[cIndex].value;
                }
                if (c === 15){
                    magic["m"] = commands[cIndex].value;
                }
            }
            magicNumbers.push(magic);
        }
        return magicNumbers;
    }

    day.partOne = function(){
        // our plan here is to use a DFS pathfinding approach where we pick one digit at a time and backtrack when we reach an invalid state/contradiction

        // by inspecting the puzzle input we find each digit is processed separately with 18 line blocks of commands
        // these blocks have similar structure and we find important "magic numbers", k and m, that appear on lines 5 and 15.
        // each block effectively performs: z = (z % 26 + k = i) ? z/26 : z + m + i, where k,m are the magic numbers and i is the input digit.

        // To reach z = 0 by the end we must have enough of these conditions satisified such that z is divided by 26 enough to reduce to zero.
        // We find we have 7 blocks where k > 10 and 7 blocks where k < 10
        // Therefore to reach z = 0 by the end we must satisfy the z/26 condition every time k < 10.

        // This gives us 2 criteria to greatly reduce the number of digits to search: 
        // When k < 10, we must pick i such that it satisfies the condition (z % 26 + k = i).
        // When k > 10 and k < 10 on the following block, we must pick an i that allows (z + m + i) to satisfy the (z % 26 + k = i) condition next block.
        // It's possible to do this several steps in advance to directly solve the problem but we can easily brute force the remaining possibilities.
        // In fact it turns out the first criteria alone is enough for a ~27ms runtime and with both it's ~20ms.

        let commands = parseCommands(parsedInput);
        let magicNumbers = getMagicNumbers(commands);

        findInputNumberRecurseHigh(0, [], magicNumbers, commands);
    }

    day.partTwo = function(){
        let commands = parseCommands(parsedInput);
        let magicNumbers = getMagicNumbers(commands);

        findInputNumberRecurseLow(0, [], magicNumbers, commands);
    }

    function findInputNumberRecurseHigh(z, state, magicNumbers, commands){
        let index = state.length-1;
        let newZ = 0;

        // let's get the ALU to perform this block and find the new z value.
        if (index >= 0){
            let logicUnit = ALU();
            logicUnit.register["z"] = z;
            logicUnit.pushInput(state[index]);
            for(let c = 0; c < 18; c++){
                runCommand(commands[index * 18 + c], logicUnit);
            }
            newZ = logicUnit.register["z"];
        }

        index++;

        // end condition
        if (state.length === 14){
            if (newZ === 0){
                console.log(state.join(""));
                return true;
            }
            return false;
        }

        // When k < 10, we must pick i such that it satisfies the condition (z % 26 + k = i).
        if (index >= 2 && magicNumbers[index]["k"] < 0){
            let magicK = magicNumbers[index]["k"];

            let inputNumber = newZ % 26 + magicK;
            if (inputNumber < 1 || inputNumber > 9){
                return false; // if it's not possible we need to backtrack
            }
            
            state.push(inputNumber);
            if (findInputNumberRecurseHigh(newZ, state, magicNumbers, commands)) { return true; };
            state.splice(-1, 1);
            return false;
        }
        
        // When k > 10 and k < 10 on the following block, we must pick an i that allows (z + m + i) to satisfy the (z % 26 + k = i) condition next block.
        if (index >= 2 && magicNumbers[index]["k"] > 0 && magicNumbers[index+1]["k"] < 0){
            let magicM = magicNumbers[index]["m"];
            let nextMagicK = magicNumbers[index+1]["k"];

            for (let i = 9; i > 0; i--){
                let nextInputNumber = (i + magicM) % 26 + nextMagicK;
                if (nextInputNumber > 0 && nextInputNumber < 10){
                    state.push(i);
                    if (findInputNumberRecurseHigh(newZ, state, magicNumbers, commands) ) { return true; };
                    state.splice(-1, 1);
                }
            }
            return false;
        }

        // Otherwise just brute force
        for (let i = 9; i > 0; i--){
            state.push(i);
            if (findInputNumberRecurseHigh(newZ, state, magicNumbers, commands)) { return true; };
            state.splice(-1, 1);
        }
    }

    function findInputNumberRecurseLow(z, state, magicNumbers, commands){
        let index = state.length-1;
        let newZ = 0;

        if (index >= 0){
            let logicUnit = ALU();
            logicUnit.register["z"] = z;
            logicUnit.pushInput(state[index]);
            for(let c = 0; c < 18; c++){
                runCommand(commands[index * 18 + c], logicUnit);
            }
            newZ = logicUnit.register["z"];
        }

        index++;

        if (state.length === 14){
            if (newZ === 0){
                console.log(state.join(""));
                return true;
            }
            return false;
        }

        if (index >= 2 && magicNumbers[index]["k"] < 0){
            let magicK = magicNumbers[index]["k"];

            let inputNumber = newZ % 26 + magicK;
            if (inputNumber < 1 || inputNumber > 9){
                return false;
            }
            
            state.push(inputNumber);
            if (findInputNumberRecurseLow(newZ, state, magicNumbers, commands)) { return true; };
            state.splice(-1, 1);
            return false;
        }
        
        if (index >= 2 && magicNumbers[index]["k"] > 0 && magicNumbers[index+1]["k"] < 0){
            let magicM = magicNumbers[index]["m"];
            let nextMagicK = magicNumbers[index+1]["k"];

            for (let i = 1; i < 10; i++){
                let nextInputNumber = (i + magicM) % 26 + nextMagicK;
                if (nextInputNumber > 0 && nextInputNumber < 10){
                    state.push(i);
                    if (findInputNumberRecurseLow(newZ, state, magicNumbers, commands) ) { return true; };
                    state.splice(-1, 1);
                }
            }
            return false;
        }

        for (let i = 1; i < 10; i++){
            state.push(i);
            if (findInputNumberRecurseLow(newZ, state, magicNumbers, commands)) { return true; };
            state.splice(-1, 1);
        }
    }

    function runCommand(command, logicUnit){
        if (command.op === "inp"){
            logicUnit[command.op](command.a);
            return;
        }

        let value = isNaN(command.value) ? logicUnit.register[command.value] : command.value;
        logicUnit[command.op](command.a, value);
    }

    function ALU(){
        let register = { w : 0, x : 0, y : 0, z : 0 };
        let inputNumbers = [];
        let index = 0;
        let crashed = false;

        function pushInput(i){
            inputNumbers.push(i);
        }

        function getInput(){
            return inputNumbers;
        }

        function inp(a){
            register[a] = inputNumbers[index++];
        }

        function add(a, b){
            register[a] = register[a] + b;
        }

        function mul(a, b){
            register[a] = register[a] * b;
        }

        function div(a, b){
            if (b === 0) { crashed = true; return; }
            register[a] = Math.floor(register[a] / b);
        }

        function mod(a, b){
            if (b === 0) { crashed = true; return; }
            register[a] = register[a] % b;
        }

        function eql(a, b){
            register[a] = register[a] === b ? 1 : 0;
        }

        return {
            pushInput : pushInput,
            getInput : inputNumbers,
            register : register,
            index : index,
            inp : inp,
            add : add,
            mul : mul,
            div : div,
            mod : mod,
            eql : eql,
            crashed : crashed
        }
    }

    return day;
}