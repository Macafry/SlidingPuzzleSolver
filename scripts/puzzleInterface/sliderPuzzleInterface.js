
class SliderPuzzleInterface {
    #imgTags;
    #game;
    #size;
    #tileWidth;
    #tileHeight;
    #imgSrc;
    #helpMode;
    #moves; 

    targetElement;

    constructor(game, imgSrc, targetElement){
      this.#game = game;
      this.#size = game.size;
      this.#imgSrc = imgSrc;
      this.targetElement = targetElement;
      this.#helpMode = false;
      this.#moves = [];
    }

    async init() {
      return this.#splitImageIntoTiles(this.#imgSrc)
                 .then(x => this.#imgTags = x.map((src, i) => `<img src="${src}" alt="${i+1}">`))
                 .then(() => this.#imgTags.unshift(`<img src="${this.#zeroTile()}" alt="0">`))
                 .then(() => this.render())
    }

    async #splitImageIntoTiles(imageSrc) {
      const tileCountX = this.#size;
      const tileCountY = this.#size;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageSrc;
  
      let imageSCRs = [];
    
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
    
        const tileWidth = img.width / tileCountX;
        const tileHeight = img.height / tileCountY;
        this.#tileWidth =  tileWidth;    
        this.#tileHeight =  tileHeight;    
    
        for (let i = 0; i < tileCountY; i++) {
          for (let j = 0; j < tileCountX; j++) {
            const tileCanvas = document.createElement('canvas');
            tileCanvas.width = tileWidth;
            tileCanvas.height = tileHeight;
            const tileCtx = tileCanvas.getContext('2d');
            tileCtx.drawImage(canvas, j * tileWidth, i * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
    
            imageSCRs.push(tileCanvas.toDataURL('image/png'));
          }
        }
      } 

      return img.decode().then(() => {return imageSCRs});
    }

    #zeroTile() {
      const tileCanvas = document.createElement('canvas');
      tileCanvas.width = this.#tileWidth;
      tileCanvas.height = this.#tileHeight;
      const tileCtx = tileCanvas.getContext('2d');

      return tileCanvas.toDataURL('image/png')
    }

    slide(key) {
      if (key === undefined) {
        return;
      }

      const keyMaps = {
        w: 'up',
        a: 'left',
        s: 'down',
        d: 'right',
        up: 'up',
        left: 'left',
        down: 'down',
        right: 'right',
        arrowup: 'up',
        arrowleft: 'left',
        arrowdown: 'down',
        arrowright: 'right',
      };


      const direction = keyMaps[key.toLowerCase()];

      if (direction === undefined) {
        return;
      }

      if(this.#helpMode && direction !== this.nextMove()){
        return;
      }

      this.#game.move(direction);
      this.render();

      if(this.#helpMode) {
        this.#moves.shift();
        this.#helpMode = this.#moves.length > 0;
      }

    }

    shuffle() {
      this.#game.shuffle();
      this.render();
    }

    render() {
      const numberTable = this.#game.toTable();
      const imgTable = this.#imgTags
                           .map((x,i) => [x,i])
                           .reduce((previous, [x,i]) => {
                              let oldTag = `<td>${i}</td>`;
                              let newTag = `<td>${x}</td>`;
                              return previous.replace(oldTag, newTag)
                            }, numberTable);
      
      this.targetElement.innerHTML = imgTable;
    } 

    #solveMoves() {
      let solver = new SliderPuzzleSolver(game);
      let moves = solver.solveSequence();

      if (this.#game instanceof SliderPuzzleRotator) {
        return moves.map(x => game.unrotate(x));
      }

      return moves;
    }

    helpMode() {
      this.#helpMode = true;
      this.#moves = this.#solveMoves();
    }

    nextMove() {
      if(!this.#helpMode) {
        return undefined;
      }

      return this.#moves[0];
    }

    helpStep() {
      this.slide(this.nextMove());
      this.render();
    }

    async autoSolver() {
      while(this.#helpMode) {
        this.helpStep();
        await new Promise(r => setTimeout(r, 500));
      }
    }
}
