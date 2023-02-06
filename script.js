// Knights-Travails
// 1. Put together a script that creates a game board and a knight.
// 2. Treat all possible moves the knight could make as children in a tree. 
// Don’t allow any moves to go off the board.
// 3. Decide which search algorithm is best to use for this case. 
// Hint: one of them could be a potentially infinite series.
// 4. Use the chosen search algorithm to find the shortest path between the 
// starting square (or node) and the ending square. Output what that full path looks
// like, e.g.:
//      >knightMoves([3.3], [4,3])
//      ==> You made it in 3 moves! Here's your path:
//          [3,3]
//          [4,5]
//          [2,4]
//          [4,3]

// TO DO: 
// 2. Implement knightmoves
// 3. remove the printing to webpage feature and create simple interface for above


// class for queue data type
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

// class for constructing nodes to be part of graph, using adjacency list implementation
class Node {
    constructor(value) {
        this.value = value;
        this.adjacents = [];
    }

    addAdjacent(node) {
        this.adjacents.push(node);
    }

    isAdjacent(node) {
        if (this.adjacents.find(element => element == node)) {
            return true;
        } else {return false;}
    }
}

// class implemenation for a graph
class Graph {
    constructor(edgeDirection = Graph.UNDIRECTED) {
        this.nodes = new Map();
        this.edgeDirection = edgeDirection;
    }

    addEdge(sourceNode, destinationNode) {
        sourceNode.addAdjacent(destinationNode);

        if(this.edgeDirection === Graph.UNDIRECTED) {
            destinationNode.addAdjacent(sourceNode);
        }

        return [sourceNode, destinationNode];
    }

    addVertex(value) {
        if(this.nodes.has(JSON.stringify(value))) { 
            return this.nodes.get(JSON.stringify(value)); 
        } else {
            const vertex = new Node(value);
            this.nodes.set(JSON.stringify(value), vertex);
            return vertex;
        }
    }

    //implementation of BFS
    // set distance of all adjacents for source to 1 and predecessor to source
    // repeat...
   doBFS(sourceNode) {
        const bfsInfo = []; // array of objects -- {targetNode: node, distance: distance, predecessor: predecessor}
        const queue = new Queue();
        this.nodes.forEach(element => {
            const bfsNodeInfo = {
                targetNode: element.value,
                distanceToSource: null, 
                predecessor: null
            };
            bfsInfo.push(bfsNodeInfo);
        });
        
        const sourceNodeInBfsInfo = bfsInfo.find(element => JSON.stringify(element.targetNode) === JSON.stringify(sourceNode.value)); //can't compare arrays; so, stringify
        
        queue.enqueue(sourceNodeInBfsInfo);
        sourceNodeInBfsInfo.distanceToSource = 0;
        // set distance of all adjacents for source to 1
        //get a list of adjacents for source

        while (!queue.isEmpty()) {
            let dequeuedItem = queue.dequeue();
            
            if (!(dequeuedItem.distanceToSource === null)) {   
                //get dequeuedItem's adjacents
                this.nodes.get(JSON.stringify(dequeuedItem.targetNode)).adjacents.forEach(element1 => {
                    const nodeInBfsInfo = bfsInfo.find(element2 => JSON.stringify(element2.targetNode) === JSON.stringify(element1.value));
                    if (nodeInBfsInfo.distanceToSource === null) {
                        nodeInBfsInfo.predecessor = dequeuedItem.targetNode;
                        const predecessorNode = bfsInfo.find(element => JSON.stringify(element.targetNode) === JSON.stringify(nodeInBfsInfo.predecessor));
                        nodeInBfsInfo.distanceToSource = predecessorNode.distanceToSource + 1;
                        queue.enqueue(nodeInBfsInfo);
                    };
                }); 
                
            };
        }
        return bfsInfo;
    }
}

// The game board needs a method that will give me the shortest path between two nodes.
// It will tell me how many steps were taken and it will list out each vertex visited.

Graph.UNDIRECTED = Symbol('undirected graph'); // two-ways edges
Graph.DIRECTED = Symbol('directed graph');

function chessBoard() {
    const chessBoard = new Graph(edgeDirection = Graph.DIRECTED);

    // create all of the vertexes and add them to the chessboard
    for (i=0; i<8; i++) {
        for (y=0; y<8; y++) {
            let position = chessBoard.addVertex([i,y]);
        };
    };

    //create the edges for each piece
    for (i=0; i<8; i++) {
        for (y=0; y<8; y++) {
            let sourceNode = chessBoard.nodes.get(JSON.stringify([i, y]));
            if ((i+2) < 8 && (y+1) < 8) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i+2), (y+1)])));
            };
            if ((i+2) < 8 && (y-1) >= 0) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i+2),(y-1)])));
            };
            if ((i+1) < 8 && (y+2) < 8) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i+1), (y+2)])));
            };
            if ((i+1) < 8 && (y-2) >= 0) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i+1), (y-2)])));
            };
            if ((i-2) >= 0 && (y+1) < 8) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i-2), (y+1)])));
            };
            if ((i-2) >= 0 && (y-1) >= 0) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i-2), (y-1)])));
            };
            if ((i-1) >= 0 && (y+2) < 8) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i-1), (y+2)])));
            };
            if ((i-1) >= 0 && (y-2) >= 0) {
                chessBoard.addEdge(sourceNode, chessBoard.nodes.get(JSON.stringify([(i-1), (y-2)])));
            };
        };
    };

    return chessBoard;
}

//start position is the source node that you run bfs on
//endposition is the spot your are going to
// find entry in bfsInfo with bfsNodeInfo.targetNode === targetNode, then print this.distance
function knightMoves(startPosition, endPosition) {
    const bfsInfo = chessBoard().doBFS(chessBoard().nodes.get(JSON.stringify(startPosition)));
    const endPositionInBfsInfo = bfsInfo.find(element => JSON.stringify(element.targetNode) === JSON.stringify(endPosition)); 
    const numOfMoves = endPositionInBfsInfo.distanceToSource;
    const positionsTraversed = []; 
    positionsTraversed.unshift(endPositionInBfsInfo.targetNode);
    const queue = new Queue();
    queue.enqueue(endPositionInBfsInfo.predecessor);
    while (!queue.isEmpty()) {
        let dequeuedItem = queue.dequeue();
        nodeInBfsInfo = bfsInfo.find(element => JSON.stringify(element.targetNode) == JSON.stringify(dequeuedItem));
        positionsTraversed.unshift(nodeInBfsInfo.targetNode);
        if (nodeInBfsInfo.predecessor ==! null) {
            queue.enqueue(nodeInBfsInfo.predecessor);
        };
    }
    document.getElementById('content').innerText += `You made it in ${numOfMoves} moves! Here's your path:\n` +
    `[${startPosition}]`;
    positionsTraversed.forEach(element => document.getElementById('content').innerText += `\n[${element}]`);
    document.getElementById('content').innerText += `\n`;
}

document.getElementById('submit').addEventListener('click', () => {
    const startPosition = JSON.parse(document.getElementById('startPosition').value);
    const endPosition = JSON.parse(document.getElementById('endPosition').value);
    knightMoves(startPosition, endPosition);
});