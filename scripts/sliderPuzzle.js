class SliderPuzzle {
    #size;
    #area;
    #gameState;

    constructor(size) {
        this.#size = size;
        this.#area = size * size;

        this.#gameState = Array.from({length: this.#area}, (_, i) => i + 1);
        this.#gameState[this.#area - 1] = 0;
    }

    get gameState() {
        return [...this.#gameState];
    }

    get size() {
        return this.#size;
    }


    inversions() {
        let inversionCount = 0;
        const gameState = this.#gameState;

        for(let i = 0; i < gameState.length; i++) {
            for(let j = i + 1; j < gameState.length; j++) {
                
                let x = gameState[i];
                let y = gameState[j];
    
                if( x === 0 || y === 0) 
                    continue;
    
                if( y < x ) {
                    inversionCount++;
                }
            }
        }
    
        return inversionCount;
    }

    move(direction) {

        let gameState = this.#gameState;
        const size = this.#size;
        const gapIndex = gameState.indexOf(0);
    
        switch(direction) {
            case 'up':
    
                if(gapIndex >= size * (size - 1)) 
                    break;
    
                gameState[gapIndex] = gameState[gapIndex + size];
                gameState[gapIndex + size] = 0;
    
                break;
    
            case 'down':
    
                if(gapIndex < size) 
                    break;
    
                gameState[gapIndex] = gameState[gapIndex - size];
                gameState[gapIndex - size] = 0;
        
                break;
            
            case 'right':
    
                if( (gapIndex % size) === 0) 
                    break;
                
                gameState[gapIndex] = gameState[gapIndex - 1];
                gameState[gapIndex - 1] = 0;
    
                break;
    
            case 'left':
    
                if( (gapIndex % size) === (size - 1)) 
                    break;
    
                gameState[gapIndex] = gameState[gapIndex + 1];
                gameState[gapIndex + 1] = 0;
        
                break;
        }
    }

    shuffle() {
        const directions = ['up', 'down', 'left', 'right'];
        for(let i = 0; i < 100000; i++){
            const direction = directions[Math.floor(Math.random() * directions.length)];
            this.move(direction);
        }
    }


    toTable() {
        const gameState = this.#gameState;
        const size =  this.#size;
        const area =  this.#area;

        let table = '<table>\n';

        for(let i = 0; i < area; i += size) {

            let row = gameState.slice(i, i + size)
                               .map(x => `<td>${x}</td>`)
                               .join('\n');

            table += `<tr>\n${row}\n</tr>\n`;
        }

        table += '</table>'

        return table;
    }

    toString() { 
        this.#gameState.toString() 
    };

    stateString() {
        this.#gameState.toString() 
    }

}