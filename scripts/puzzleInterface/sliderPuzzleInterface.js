
class SliderPuzzleInterface {
    #imgTags;
    #game;
    #size;
    #tileWidth;
    #tileHeight;
    #imgSrc;
    #moves; 
    #helpMode;
    #swapMode;
    #swapCache

    targetElement;

    constructor(game, imgSrc, targetElement){
      this.#game = game;
      this.#size = game.size;
      this.#imgSrc = imgSrc;
      this.targetElement = $(targetElement);
      this.#helpMode = false;
      this.#moves = [];
    }

    async init() {
      return this.#splitImageIntoTiles(this.#imgSrc)
                 .then(x => this.#imgTags = x.map((src, i) => `<img src="${src}" alt="${i+1}">`))
                 .then(() => this.#imgTags.unshift(`<img src="${this.#zeroTile()}" alt="0">`))
                 .then(() => this.targetElement.html(
                      `<div class="game">
                          <div class="display mx-auto"></div>
                          <div class="controls mt-8">
                              <div class="buttons container-fluid">
                                  <div class="row mx-auto">
                                      <div class="col-sm-4 p-1 h-100"></div>
                                      <div class="col-sm-4 p-1 h-100"><button class="arrow up">↑</button></div>
                                      <div class="col-sm-4 p-1 h-100"></div>
                                  </div>
                                  <div class="row mx-auto">
                                      <div class="col-sm-4 p-1 h-100"><button class="arrow left">←</button></div>
                                      <div class="col-sm-4 p-1 h-100"><button class="arrow down">↓</button></div>
                                      <div class="col-sm-4 p-1 h-100"><button class="arrow right">→</button></div>
                                  </div>
                              </div>
                              <div class="actions container-fluid">
                                  <div class="row mx-auto mt-2">
                                      <div class="col-sm-4 p-1 h-100"><button class="help">Help Mode</button></div>
                                      <div class="col-sm-4 p-1 h-100"><button class="swap">Swap Mode</button></div>
                                      <div class="col-sm-4 p-1 h-100"><button class="shuffle">Shuffle Pieces</button></div>
                                  </div>
                              </div>
                          </div>
                      </div>`
                 ))
                 .then(() => this.render())
                 .then(() => {
                    this.targetElement.find('.up')   .on('click', () => this.slide('up'));
                    this.targetElement.find('.left') .on('click', () => this.slide('left'));
                    this.targetElement.find('.down') .on('click', () => this.slide('down'));
                    this.targetElement.find('.right').on('click', () => this.slide('right'));

                    this.targetElement.find('.swap').on('click', () => this.swapMode());
                    this.targetElement.find('.help').on('click', () => this.helpMode());
                    this.targetElement.find('.shuffle').on('click', () => this.shuffle());
                  })
    }

    get display() {
      return this.targetElement.find('.display');
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

      this.targetElement.find('.arrow').removeClass('next-move');

      if (this.#helpMode) {
        const nextMoveClass = '.' + this.nextMove();
        this.targetElement.find(nextMoveClass).addClass('next-move');
      } else {
        this.targetElement.find('.help').removeClass('mode-on');
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
                              let newTag = `<td class="tile tile-${i}">${x}</td>`;
                              return previous.replace(oldTag, newTag)
                            }, numberTable);
      

      
      this.display.html(imgTable);
      Array.from($('.tile')).forEach(element => {
        const tileValue = parseInt(element.className.match(/tile tile-(\d+)/)[1]);
        $(element).on('click', () => this.selectSwap(tileValue));
      });

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
      // help mode on
      this.#helpMode = true;
      this.targetElement.find('.help').addClass('mode-on');

      // swap mode off
      this.#swapMode = false;
      this.targetElement.find('.swap').removeClass('mode-on');
      this.targetElement.find('.tile').removeClass('swap-cache');
      
      // solve
      this.#moves = this.#solveMoves();

      if(this.#moves.length === 0) {
        // help mode off
        this.#helpMode = false;
        this.targetElement.find('.help').removeClass('mode-on');
      } else {
        // visual aid
        const nextMoveClass = '.' + this.nextMove();
        this.targetElement.find(nextMoveClass).addClass('next-move');
      }

    }

    swapMode() {
      // help mode off
      this.#helpMode = false;
      this.targetElement.find('.help').removeClass('mode-on');

      // swap mode on
      this.#swapMode = !this.#swapMode;
      this.targetElement.find('.swap').toggleClass('mode-on');

      // eh
      this.targetElement.find('.tile').removeClass('swap-cache');
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

    selectSwap(tileValue) {
      if(!this.#swapMode){
        return;
      }

      const trueValue = this.#game.rotate(tileValue);
      if (this.#swapCache === undefined) {
        this.#swapCache = trueValue;
        this.targetElement.find(`.tile-${tileValue}`).addClass('swap-cache');
      } else {
        this.#game.swapPieces(trueValue, this.#swapCache);
        this.#swapCache = undefined;
        this.targetElement.find('.tile').removeClass('swap-cache');
        this.render();
      }

    }
}
