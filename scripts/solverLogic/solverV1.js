class SliderPuzzleSolver{

    #game;
    #solution;
    #size;
    #manhattanMap;

    constructor(game) {
        this.#game = game;
        this.#size = game.size;

        const solLength = game.gameState.length;

        this.#solution = Array.from({length: solLength}, (_, i) => i + 1);
        this.#solution[solLength-1] = 0;

        this.#setManhattanMap();
    }
    
    // is solution

    #setManhattanMap() {
        const solution = this.#solution;
        const size = this.#size;
        
        // 0 is the gap, giving it a distance limits its movement
        let map = {0: {}};

        for(let j = 0; j < solution.length; j++){
            map[0][j] = 0;
        }


        for(let i = 1; i < solution.length; i++) {

            map[i] = {};

            const numIndex = solution.indexOf(i);
            let x1 = numIndex % size;
            let y1 = parseInt(numIndex / size);
            
            for(let j = 0; j < solution.length; j++) {
                let x2 = j % size;
                let y2 = parseInt(j / size);

                let distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);

                map[i][j] = distance;
                
            }
        }
        
        this.#manhattanMap = map;
    }


    // this
    #manhattanDistance(gameState){
        return gameState
                    .map((x, i) => this.#manhattanMap[x][i])
                    .reduce((a,b) => a + b, 0);
    }

    // this
    #possibleMoves(gameStateNode){
    
        const gameState = gameStateNode.state
        const size = this.#size;
        
        const gapIndex = gameState.indexOf(0);
        let moves = {};

        if(!(gapIndex >= size * (size - 1))) {

            let newGameState = [...gameState];

            newGameState[gapIndex] = newGameState[gapIndex + size];
            newGameState[gapIndex + size] = 0;

            moves.up = {
                state: newGameState, 
                from: gameStateNode,
                move: 'up',
                depth: gameStateNode.depth + 1,
                manhattan: this.#manhattanDistance(newGameState),
                string: newGameState.toString(),
            };

        }

        if(!(gapIndex < size)) {

            let newGameState = [...gameState];

            newGameState[gapIndex] = newGameState[gapIndex - size];
            newGameState[gapIndex - size] = 0;

            moves.down =  {
                state: newGameState, 
                from: gameStateNode,
                move: 'down',
                depth: gameStateNode.depth + 1,
                manhattan: this.#manhattanDistance(newGameState),
                string: newGameState.toString(),
            };
        }

        if( (gapIndex % size) !== 0 ) {

            let newGameState = [...gameState];

            newGameState[gapIndex] = newGameState[gapIndex - 1];
            newGameState[gapIndex - 1] = 0;

            moves.right = {
                state: newGameState, 
                from: gameStateNode,
                move: 'right',
                depth: gameStateNode.depth + 1,
                manhattan: this.#manhattanDistance(newGameState),
                string: newGameState.toString(),
            };
        }

        if( (gapIndex % size) !== (size - 1) ) {

            let newGameState = [...gameState];

            newGameState[gapIndex] = newGameState[gapIndex + 1];
            newGameState[gapIndex + 1] = 0;

            moves.left = {
                state: newGameState, 
                from: gameStateNode,
                move: 'left',
                depth: gameStateNode.depth + 1,
                manhattan: this.#manhattanDistance(newGameState),
                string: newGameState.toString(),
            };
        }

        return moves
    }

    solveSequence() {

        const startingState = this.#game.gameState;
        const solutionString = this.#solution.toString();
        
        // initialize root node and current node
        let root = {
            state: startingState, 
            from: undefined,
            move: undefined,
            depth: 0,
            manhattan: this.#manhattanDistance(startingState),
            string: startingState.toString(),
        };
        
        let currentNode = root;

        // other inits 
        let checkedStates = new Set();
        let solved = false;
        
        // Min heap initialization
        const priority = ({string, manhattan, depth}) => {
            if (checkedStates.has(string))
                return Number.POSITIVE_INFINITY;
            
            if (manhattan <= root.manhattan/3)
                return manhattan;
            
            return 1.500001 * manhattan + depth;

        }
                    
        let stateQueue = new PriorityQueue((a, b) => {
            if(priority(a) === priority(b) && a.manhattan === b.manhattan) 
                return a.depth < b.depth
            
            if(priority(a) === priority(b)) 
                return a.manhattan < b.manhattan
                
            return priority(a) < priority(b)
            
        });
        stateQueue.push(root);
        

        // find solution using A*
        while ( stateQueue.size() > 0 ) {

            // find next unprocessed node
            do {
                currentNode = stateQueue.pop();
            } while (checkedStates.has(currentNode.string));
            

            // add neighbor states
            let newMoves = this.#possibleMoves(currentNode);

            Object.entries(newMoves)
                  .forEach((([direction, node]) => {

                if(!checkedStates.has(node.string)){
                    currentNode[direction] = node;
                    stateQueue.push(node);
                }

            }));

            // is solution?
            if(currentNode.string === solutionString) {
                solved = true;
                break;
            }

            // state has been fully processed - check
            checkedStates.add(currentNode.string);

        }

        // womp womp
        if (!solved) {
            throw new Error("Could not Find Solution :(");
        }

        // current state is the solution
        // backtrack to recreate steps until we reach the root
        let moves = [];
        while( currentNode.from !== undefined ) {
            moves.push(currentNode.move);
            currentNode = currentNode.from;
        }

        return moves.reverse();
        
    }
}