module.exports = function(input){

    var day = require('./Base.js');

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split('\n');
    }

    day.partOne = function(){
        let sum = createSnailNumber(parsedInput[0]);

        for (let i = 1; i < parsedInput.length; i++){
            let snail = createSnailNumber(parsedInput[i]);
            sum = addSnails(sum,snail);
        }

        let mag = snailMagnitude(sum);
        
        console.log(mag);
    }

    day.partTwo = function(){
        let maxMagnitude = 0;

        for (let i = 0; i < parsedInput.length; i++){
            for (let j = 0; j < parsedInput.length; j++){
                if (i === j){ continue; }

                let leftSnail = createSnailNumber(parsedInput[i]);
                let rightSnail = createSnailNumber(parsedInput[j]);

                let sum = snailMagnitude(addSnails(leftSnail, rightSnail));

                if (sum > maxMagnitude){
                    maxMagnitude = sum;
                }
            }
        }

        console.log(maxMagnitude);
    }
    
    return day;
}

function snailMagnitude(node){
    let mag = 0;

    mag += !isNaN(node.x) ? node.x * 3 : snailMagnitude(node.x) * 3;
    mag += !isNaN(node.y) ? node.y * 2 : snailMagnitude(node.y) * 2;

    return mag;
}

function addSnails(x, y){
    x.side = "x";
    y.side = "y";
    let sumSnail = snailNode(x, y, null, "root")
    x.p = sumSnail;
    y.p = sumSnail;
    reduceSnail(sumSnail);
    return sumSnail;
}

function reduceSnail(snail){
    if (checkForExplosions(1, snail)){
        return reduceSnail(snail);
    }

    if (checkForSplits(snail)){
        return reduceSnail(snail);
    }
}

function checkForExplosions(depth, node){
    if (depth > 4){
        explodeSnailNode(node);
        return true;
    }
    else{
        if (isNaN(node.x) && checkForExplosions(depth + 1, node.x)){
            return true;
        }
        if (isNaN(node.y) && checkForExplosions(depth + 1, node.y)){
            return true;
        }
    }

    return false;
}

function checkForSplits(node){
    if (!isNaN(node.x)){
        if (node.x > 9){
            splitSnailNode("x", node);
            return true;
        }
    }
    else if (checkForSplits(node.x)){
        return true;
    }

    if (!isNaN(node.y)){
        if (node.y > 9){
            splitSnailNode("y", node);
            return true;
        }
    }
    else if (checkForSplits(node.y)){
        return true;
    }

    return false;
}

function createSnailNumber(line){
    let state = {index: 1, depth: 0};
    let root = createSnailNode(null, state, line, "root");

    return root;
}

function createSnailNode(parent, state, line, side){
    let newNode = snailNode();
    newNode.p = parent;
    newNode.side = side;

    if (line[state.index] === "["){
        state.index++;
        newNode.x = createSnailNode(newNode, state, line, "x");
    }
    else{
        newNode.x = parseInt(line[state.index++], 10);
    }

    state.index += 1;

    if (line[state.index] === "["){
        state.index++;
        newNode.y = createSnailNode(newNode, state, line, "y");
    }
    else{
        newNode.y = parseInt(line[state.index++], 10);
    }

    state.index++;

    return newNode;
}

function snailNode(x, y, parent, side){
    return {
        p : parent,
        side : side,
        x : x,
        y : y
    }
}

function explodeSnailNode(node){
    recurseLeftExplode(node.x, node.side, node.p);
    recurseRightExplode(node.y, node.side, node.p);

    node.p[node.side] = 0;
}

function recurseLeftExplode(val, side, node){
    if (node === null){
        return;
    }

    if (side === "x") {
        recurseLeftExplode(val, node.side, node.p);
    }

    else {
        if (!isNaN(node.x)){
            node.x += val;
            return;
        }
        else{
            addToRightMost(val, node.x);
        }
    }
}

function recurseRightExplode(val, side, node){
    if (node === null){
        return;
    }

    if (side === "y") {
        recurseRightExplode(val, node.side, node.p);
    }

    else {
        if (!isNaN(node.y)){
            node.y += val;
            return;
        }
        else{
            addToLeftMost(val, node.y);
        }
    }
}

function addToRightMost(val, node){
    if (!isNaN(node.y)){
        node.y += val;
        return;
    }
    else{
        addToRightMost(val, node.y);
    }
}

function addToLeftMost(val, node){
    if (!isNaN(node.x)){
        node.x += val;
        return;
    }
    else{
        addToLeftMost(val, node.x);
    }
}

function splitSnailNode(side, node){
    let val = node[side];
    let x = Math.floor(val/2);
    let y = Math.ceil(val/2);

    let newNode = snailNode(x, y, node, side);
    node[side] = newNode;
}