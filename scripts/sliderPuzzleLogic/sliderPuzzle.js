class SliderPuzzle {
    _size;
    _area;
    _gameState;

    constructor(size) {
        this._size = size;
        this._area = size * size;

        this._gameState = Array.from({length: this._area}, (_, i) => i + 1);
        this._gameState[this._area - 1] = 0;
    }

    get gameState() {
        return [...this._gameState];
    }

    get size() {
        return this._size;
    }

    move(direction) {

        let gameState = this._gameState;
        const size = this._size;
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
        const gameState = this._gameState;
        const size =  this._size;
        const area =  this._area;

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
        return this._gameState.toString() 
    };

}