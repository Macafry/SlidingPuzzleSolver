const SIZE = 4;
const ROTATION = 'CCW';


let game = new SliderPuzzleRotator(SIZE, ROTATION);
let interface = new SliderPuzzleInterface(game, IMAGE_LINKS['Zill'], $('#main').get(0));

window.addEventListener("keydown", (e) => interface.slide(e.key));

interface.init().then(()=> {
    console.log('initialized');
    interface.shuffle();
    interface.helpMode();
    console.log('ready');
});

