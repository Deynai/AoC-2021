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
        val["visited"] = 0;

        let node = new Node(val);
        return node;
    }

    day.partOne = function(){
        let validPaths = [];
        walkGraph(validPaths, oneVisitOnly = true);
        console.log(validPaths.length);
    }

    day.partTwo = function(){
        let validPaths = [];
        walkGraph(validPaths, oneVisitOnly = false);
        console.log(validPaths.length);
    }

    function walkGraph(validPaths, oneVisitOnly){
        let allNodes = buildGraph(parsedInput);
        let startNode = allNodes["start"];
        walkGraphRecurse(startNode, [], allNodes, validPaths, oneVisitOnly);
    }

    function walkGraphRecurse(node, path, graph, validPaths, visitedSmallTwice){
        // end conditions
        if (node.value["name"] == "start" && path.length > 0) { return; }
        if (node.value["name"] == "end"){
            validPaths.push(path.join(" -> ") + " -> end");
            return;
        }

        // update this node to a visited state
        node.value["visited"] += 1;
        path.push(node.value["name"]);
        if (!node.value["isBig"] && node.value["visited"] > 1){
            visitedSmallTwice = true;
        }

        // get a list of valid connections from this point
        let validLinks = [];
        for (let i = 0; i < node.links.length; i++){
            let linkedNode = node.links[i];

            if(linkedNode.value["isBig"] || !linkedNode.value["visited"] || !visitedSmallTwice){
                validLinks.push(linkedNode);
            }
        }

        // recurse on each valid connection
        for (let i = 0; i < validLinks.length; i++){
            let nextNode = validLinks[i];
            walkGraphRecurse(nextNode, path, graph, validPaths, visitedSmallTwice);
        }

        // undo visited state
        if(!node.value["isBig"] && node.value["visited"] > 1){
            visitedSmallTwice = false;
        }
        path.splice(-1, 1);
        node.value["visited"] -= 1;
    }

    function isUpper(text){
        let character = text.charAt(0);
        return character == character.toUpperCase();
    }

    return day;
}