module.exports = function(input){

    var day = require('./Base.js');
    var Node = require("../Util/GraphNode.js");

    var parsedInput = '';

    day.setup = function(){
        parsedInput = input.trim().split('\n').map(x => { let splitx = x.trim().split("-"); return {a : splitx[0], b : splitx[1]}});
    }

    function buildGraph(parsedInput){
        let graph = {};

        for (let i = 0; i < parsedInput.length; i++){
            let line = parsedInput[i];

            if (!graph[line.a]) { 
                graph[line.a] = buildNode(line.a);    
            }
            if (!graph[line.b]) {
                graph[line.b] = buildNode(line.b);
            }

            graph[line.a].addLink(graph[line.b]);
            graph[line.b].addLink(graph[line.a]);
        }

        return graph;
    }

    function buildNode(name){
        let val = {};

        val["name"] = name;
        val["isBig"] = isUpper(name);
        val["isVisited"] = 0;
        val["isEnd"] = name === "end";

        let node = new Node(val);
        return node;
    }

    day.partOne = function(){
        let allNodes = buildGraph(parsedInput);

        let validPaths = [];
        let startNode = allNodes["start"];

        walkGraphRecurse(startNode, [], allNodes, validPaths, true);

        console.log(validPaths.length);
    }

    function walkGraphRecurse(node, path, graph, validPaths, visitedSmallTwice){
        // end condition
        if (node.value["isEnd"]){
            validPaths.push(path.join(" -> ") + " -> end");
            return;
        }

        // update this node to a visited state
        node.value["isVisited"] += 1;
        path.push(node.value["name"]);
        if (!node.value["isBig"] && node.value["isVisited"] > 1){
            visitedSmallTwice = true;
        }

        // get a list of valid connections from this point
        let validLinks = [];
        for (let i = 0; i < node.links.length; i++){
            let linkedNode = node.links[i];
            if(linkedNode.value["name"] == "start") { continue; }

            if(linkedNode.value["isBig"]){
                validLinks.push(linkedNode);
            }
            else if(!linkedNode.value["isVisited"] || !visitedSmallTwice){
                validLinks.push(linkedNode);
            }
        }

        // recurse on each valid connection
        for (let i = 0; i < validLinks.length; i++){
            let nextNode = validLinks[i];
            walkGraphRecurse(nextNode, path, graph, validPaths, visitedSmallTwice);
        }

        // undo visited state
        if(!node.value["isBig"] && node.value["isVisited"] > 1){
            visitedSmallTwice = false;
        }
        path.splice(-1, 1);
        node.value["isVisited"] -= 1;
    }

    day.partTwo = function(){
        let allNodes = buildGraph(parsedInput);

        let validPaths = [];
        let startNode = allNodes["start"];

        walkGraphRecurse(startNode, [], allNodes, validPaths, false);

        console.log(validPaths.length);
    }

    function isUpper(text){
        let character = text.charAt(0);
        return character == character.toUpperCase();
    }

    return day;
}