const SIZE = 4;

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


let game = new SliderPuzzle(SIZE);
$('#main').html(game.toTable());

function shuffle() {
    game.shuffle();
    $('#main').html(game.toTable());
}


window.addEventListener("keydown", (e) => slide(e, game));


shuffle();

let solver = new SliderPuzzleSolver(game);
let moves = solver.solveSequence().reverse();
console.log(moves.length);

function step() {
    game.move(moves.pop());
    $('#main').html(game.toTable());
}

async function autoStep() {
    for (let i = 1; i <= moves.length; i++) {
        step();
        await new Promise(r => setTimeout(r, 2000));
    }
}
