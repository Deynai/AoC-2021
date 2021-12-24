module.exports = function(input){

    var day = require('./Base.js');
    var HashSet = require("../Util/HashSet.js");
    var Queue = require("../Util/Queue.js");

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.replace(/\r/g, "").split('\n').map(x => x.split(""));
    }

    function initialiseState(pInput){

        let spaces = [];
        let bugs = [];
        let deltas = [[0,1], [0,-1], [1,0], [-1,0]];
        let roomXvalues = { 3 : "A", 5 : "B", 7 : "C", 9 : "D" };

        for (let i = 0; i < pInput.length; i++){
            spaces[i] = [];
            for (let j = 0; j < pInput[0].length; j++){
                let char = pInput[i][j];

                if (char === " " || char === "#" || char === undefined) { continue; }
                
                // create spaces
                let newSpace = createSpace("", [], null, [i, j]);
                spaces[i][j] = newSpace;

                if (i === 1){
                    newSpace.type = "hall";
                } 
                else{
                    newSpace.type = roomXvalues[j];
                }
                
                // create bugs
                if (char !== "."){
                    let newBug = createBug(char, 0, 0, [i, j]);
                    bugs.push(newBug);
                }
            }
        }

        // connect spaces
        for (let i = 0; i < pInput.length; i++){
            for (let j = 0; j < pInput[0].length; j++){
                if (!spaces[i][j]) { continue; }
                let space = spaces[i][j];

                for (let d = 0; d < deltas.length; d++){
                    let delta = deltas[d];
    
                    let dpos = [i + delta[0], j + delta[1]];
                    if (pInput[dpos[0]][dpos[1]] !== "#" && pInput[dpos[0]][dpos[1]] !== " "){
                        space.connectedSpaces.push(spaces[dpos[0]][dpos[1]]);
                    }
                }

                if (space.connectedSpaces.length > 2){
                    space.type = "door";
                }
            }
        }

        return {
            bugs : bugs,
            spaces : spaces
        }
    }

    day.partOne = function(){
        let state = initialiseState(parsedInput);

        let finishedState = solvePuzzle(state.bugs, state.spaces);

        console.log(finishedState.weight);
    }

    day.partTwo = function(){
        let extendedInput = input.replace(/\r/g, "").split('\n');
        let insertion = "  #D#C#B#A#\n  #D#B#A#C#".split('\n');
        extendedInput.splice(3, 0, insertion[0]);
        extendedInput.splice(4, 0, insertion[1]);

        let extendedInputCharArray = extendedInput.map(x => x.split(""));

        let state = initialiseState(extendedInputCharArray);
        let finishedState = solvePuzzle(state.bugs, state.spaces);

        console.log(finishedState.weight);
    }

    function solvePuzzle(bugs, spaces){
        // our plan is to perform an A* search.
        // the positions of each bug (amphipod) and how far they have moved define the state
        // the heuristic is defined by the minimum distance each bug must travel assuming they can move directly to the hole through others

        // each step we dequeue the lowest value set of bugs, set the state, and for each bug perform a DFS through the maze to find all valid moves it can make.
        // each move creates a new state for which the heuristic is calculated and added to the sorted queue

        // when we find a state for which every bug is located within its room, we are done, and A* ensures it's minimal
        
        let queue = new Queue();
        let visited = new HashSet();

        queue.enqueue(createState(bugs));

        while (!queue.isEmpty()){
            let currState = queue.dequeue();
            let hash = hashState(currState);

            if (visited.contains(hash)) { continue; }
            visited.add(hash);

            if (checkFinished(currState, spaces)) { return currState; }

            setBugsInSpaces(currState.bugs, spaces);
            
            for (let i = 0; i < currState.bugs.length; i++){
                let bug = currState.bugs[i];
                let viableMoves = getViableMoves(bug, spaces);

                for (let m = 0; m < viableMoves.length; m++){
                    let move = viableMoves[m];
                    
                    let newBugs = copyBugs(currState.bugs);
                    newBugs[i] = performMove(newBugs[i], move);

                    queue.enqueueSorted(createState(newBugs), queueComparator);
                }
            }
        }
    }

    function performMove(bug, move){
        let oldPos = bug.position;
        let distance = Math.abs(oldPos[0] - move[0]) + Math.abs(oldPos[1] - move[1]);
        let distanceMoved = bug.distanceMoved + distance;
        let moveCount = bug.moveCount + 1;

        return createBug(bug.type, distanceMoved, moveCount, move);
    }

    function setBugsInSpaces(bugs, spaces){

        clearBugsFromSpaces(spaces);

        for (let b = 0; b < bugs.length; b++){
            let bug = bugs[b];

            spaces[bug.position[0]][bug.position[1]].occupant = bug;
        }
    }

    function clearBugsFromSpaces(spaces){
        for (let i = 0; i < spaces.length; i++){
            for (let j = 0; j < spaces[i].length; j++){
                if (spaces[i][j]){
                    spaces[i][j].occupant = null;
                }
            }
        }
    }

    function copyBugs(bugs){
        let newBugs = [];

        for (let i = 0; i < bugs.length; i++){
            let bug = bugs[i];

            let newBug = createBug(bug.type, bug.distanceMoved, bug.moveCount, bug.position);
            newBugs[i] = newBug;
        }

        return newBugs;
    }

    function getViableMoves(bug, spaces){
        let moves = [];
        let seenPositions = new HashSet();

        getViableMovesRecurse(bug, bug.position, moves, seenPositions, spaces);

        return moves;
    }

    function getViableMovesRecurse(bug, pos, moves, seenPositions, spaces){
        let posString = pos.join(",");
        let space = spaces[pos[0]][pos[1]];

        if (seenPositions.contains(posString)) { return; }
        seenPositions.add(posString);

        if (checkValidMove(bug, space, spaces)){
            moves.push(pos);
        }

        for (let i = 0; i < space.connectedSpaces.length; i++){
            let connectedSpace = space.connectedSpaces[i];

            if (connectedSpace.occupant !== null) { continue; }

            getViableMovesRecurse(bug, connectedSpace.position, moves, seenPositions, spaces);
        }
    }

    function checkValidMove(bug, space, spaces){
        if (bug.moveCount === 0 && space.type === "hall"){
            return true;
        }

        if (bug.moveCount === 1 && space.type === bug.type) {
            // check everything in this room is same bug type
            // it's enough to know whether the space below is blocked (empty) or occupied by same type

            let pos = space.position;
            pos = [pos[0] + 1, pos[1]];
            let spaceBelow = spaces[pos[0]][pos[1]];

            if (spaceBelow === undefined || (spaceBelow.occupant !== null && spaceBelow.occupant.type === bug.type)){
                return true;
            }
        }

        return false;
    }

    function checkFinished(state, spaces){
        let bugs = state.bugs;

        for (let i = 0; i < bugs.length; i++){
            let bug = bugs[i];

            if (spaces[bug.position[0]][bug.position[1]].type !== bug.type){
                return false;
            }
        }
        
        return true;
    }

    function hashState(state){
        let hash = "";

        for (let i = 0; i < state.bugs.length; i++){
            let bug = state.bugs[i];

            hash += bug.type + bug.score() + "," + bug.position.join(",") + "|";
        }

        //hash += state.weight;

        return hash;
    }

    function createState(bugs){
        let weight = 0;
        let heuristic = 0;

        for (let i = 0; i < bugs.length; i++){
            let bug = bugs[i];
            weight += bug.score();

            let columnDiff = Math.abs(bug.position[1] - (bug.typePow*2 + 3));
            if (columnDiff) { 
                columnDiff++;
                if (bug.position[0] > 1) {
                    columnDiff++;
                }
            }

            heuristic += (columnDiff)*bug.multiplier;
        }

        return {
            bugs : bugs,
            weight : weight + heuristic
        }
    }

    function createSpace(type, connectedSpaces, occupant, position){
        return {
            type : type,
            connectedSpaces: connectedSpaces,
            occupant : occupant,
            position : position
        }
    }

    function createBug(type, distanceMoved, moveCount, position){
        let typePow = type.charCodeAt(0) - 65;
        let multiplier = Math.pow(10, typePow);
        let pos = [position[0], position[1]];

        let score = function(){
            return distanceMoved * multiplier;
        }

        return {
            type : type,
            typePow : typePow,
            distanceMoved : distanceMoved,
            moveCount : moveCount,
            position : pos,
            multiplier : multiplier,
            score : score
        }
    }

    function queueComparator(state1, state2){
        return state1.weight < state2.weight;
    }

    return day;
}