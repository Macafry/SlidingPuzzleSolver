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
        const directions = ['up', 'left', 'down', 'right'];
        const size = this._size;

        // No rotation => identity maps
        if (this.#rotation === 'NONE') {
            
            // build maps
            this.#rotate =  Object.fromEntries(
                board.map(x => [x, x]).concat(directions.map(x => [x, x]))
            )

            this.#unrotate = Object.fromEntries(
                board.map(x => [x, x]).concat(directions.map(x => [x, x]))
            )

            return;
        }
        
        
        // initialize useful arrays
        const boardIndices = Array.from({length: size * size}, (_, i) => i);
        const directionIndices = [0, 1, 2, 3];

        // arrays to be rotated
        let rotatedDirections = ['up', 'left', 'down', 'right'];
        let rotatedBlockBoard = Array.from({length: size}, (_, i) => 
            board.slice(i * size, (i + 1) * size)
        );

        // rotate arrays
        let rotationCount = ROTATIONS.indexOf(this.#rotation);

        for(let i = 0; i < rotationCount; i++) {
            rotatedBlockBoard = rotateCW(rotatedBlockBoard);
            rotatedDirections.push(rotatedDirections.shift());
        }

        const rotatedBoard = rotatedBlockBoard.flat();
        const zeroIndex = rotatedBoard.indexOf(0);
        
        // board but with size^2 instead of zero
        const unzeroedBoard = boardIndices.map(i => i + 1);

        // removes the element at the ith position and add a zero at the end
        let syncer = (arr, i) => arr.slice(0,i).concat(arr.slice(i+1)).concat([0]);

        // removes the element corresponding to the rotated zero's index
        // and adds a zero at the end in both arrays 
        const rot = syncer(rotatedBoard, zeroIndex);
        const unrot = syncer(unzeroedBoard, zeroIndex);

        // build maps
        this.#rotate =  Object.fromEntries(
            boardIndices.map(i => [unrot[i], rot[i]])
                .concat(directionIndices.map(i => [directions[i], rotatedDirections[i]])) 
        )

        this.#unrotate = Object.fromEntries(
            boardIndices.map(i => [rot[i], unrot[i]]) 
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
            const tr = row.map(x => `<td>${this.unrotate(x)}</td>`).join('\n');
            return `<tr>\n${tr}\n</tr>`
        }).join('\n');

        return `<table>\n${table}\n</table>`;
    }

}