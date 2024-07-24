const SIZE = 4;
const ROTATION = 'CCW';

function slide(e, game) {

    const keyMaps = {
        w: 'up',
        a: 'left',
        s: 'down',
        d: 'right',
        arrowup: 'up',
        arrowleft: 'left',
        arrowdown: 'down',
        arrowright: 'right',
    };


    const direction = keyMaps[e.key.toLowerCase()];

    if (keyMaps === undefined) {
        return;
    }
    
    game.move(direction);
    $('#main').html(game.toTable());
}


let game = new SliderPuzzleRotator(SIZE, ROTATION);
$('#main').html(game.toTable());

function shuffle() {
    game.shuffle();
    $('#main').html(game.toTable());
}


window.addEventListener("keydown", (e) => slide(e, game));

shuffle();

let solver = new SliderPuzzleSolver(game);
let moves = solver.solveSequence().map(x => game.unrotate(x));
console.log(moves.length);

function step() {
    game.move(moves.shift());
    $('#main').html(game.toTable());
}


async function autoStep() {
    for (let i = 1; i <= moves.length; i++) {
        step();
        await new Promise(r => setTimeout(r, 500));
    }
}

