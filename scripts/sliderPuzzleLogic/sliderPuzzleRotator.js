function rotateCW(matrix) {
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
}

const ROTATIONS = ['NONE', 'CW', '180', 'CCW']

class SliderPuzzleRotator extends SliderPuzzle {
    #rotation // NONE, CW, 180, CWW 
    #rotate
    #unrotate

    constructor(size, rotation){
        if(ROTATIONS.indexOf(rotation) === -1) {
            throw new Error('Invalid Rotation State')
        }

        super(size);
        this.#rotation = rotation;

        this.#setMaps();
    }

    #setMaps() {
        // base
        const board = this._gameState;
        const size = this._size;

        // initialize useful arrays
        const boardIndices = Array.from({length: size * size}, (_, i) => i);
        const directionIndices = [0, 1, 2, 3];


        let rotatedBlockBoard = Array.from({length: size}, (_, i) => 
            board.slice(i * size, (i + 1) * size)
        );

        const directions = ['up', 'left', 'down', 'right']
        let rotatedDirections = ['up', 'left', 'down', 'right']


        // find rotated array
        let rotationCount = ROTATIONS.indexOf(this.#rotation);

        for(let i = 0; i < rotationCount; i++) {
            rotatedBlockBoard = rotateCW(rotatedBlockBoard);
            rotatedDirections.push(rotatedDirections.shift());
        }

        const rotatedBoard = rotatedBlockBoard.flat();

        // build maps
        this.#rotate =  Object.fromEntries(
            boardIndices.map(i => [board[i], rotatedBoard[i]])
                .concat(directionIndices.map(i => [directions[i], rotatedDirections[i]])) 
        )

        this.#unrotate = Object.fromEntries(
            boardIndices.map(i => [rotatedBoard[i], board[i]]) 
                .concat(directionIndices.map(i => [rotatedDirections[i], directions[i]])) 
        )
    }

    rotate(straight) {
        return this.#rotate[straight];
    }

    unrotate(rotated) {
        return this.#unrotate[rotated];
    }

    move(direction) {
        super.move(this.rotate(direction));
    }

    toTable() {
        const gameState = this._gameState;
        const size =  this._size;
        const area =  size * size;

        let blockBoard = Array.from({length: size}, (_, i) => 
            gameState.slice(i * size, (i + 1) * size)
        );


        // find rotated array
        let rotationCount = ROTATIONS.indexOf(this.#rotation);

        for(let i = 0; i < rotationCount; i++) {
            blockBoard = rotateCW(blockBoard);
        }

        const table = blockBoard.map(row => {
            const tr = row.map(x => `<td>${x}</td>`).join('\n');
            return `<tr>\n${tr}\n</tr>`
        }).join('\n');

        return `<table>\n${table}\n</table>`;
    }

    toString(rotated=false) {
        if(rotated)
            return this._gameState.map(this.rotate).toString() 
        
        return this._gameState.toString() 
    };
}