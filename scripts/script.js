const SIZE = 4;
const ROTATION = 'CCW';
let game;
let interface;
let v2

window.addEventListener("keydown", (e) => interface?.slide(e.key));

$('#update-puzzle').on('click', () => {
    const imgLink = $('#select-image').find(":selected").val();

    if(!imgLink) {
        alert("Please select an image")
        return;
    }

    game = new SliderPuzzleRotator(SIZE, ROTATION);
    interface = new SliderPuzzleInterface(game, imgLink, $('#game-box').get(0));
    interface.init().then(() => console.log('initialized'));
})

function test(iters=100) {

    let times = [];
    let moveCounts = [];


    let sumTime = 0;
    let sumTime2 = 0;
    let sumMoves = 0;
    let sumMoves2 = 0;

    for(let k = 0; k < iters; k++) {
        interface.shuffle();
        interface.shuffle();
        interface.shuffle();
        interface.shuffle();
        interface.shuffle();
        
        v2 = new SliderPuzzleSolver(game);


        let startTime = performance.now()
        let moves = v2.solveSequence();
        let endTime = performance.now()

        let time = endTime - startTime;
        let movesCount = moves.length;

        times.push(time);
        moveCounts.push(moves.length);

        sumTime += time;
        sumTime2 += time * time;
        
        sumMoves += movesCount;
        sumMoves2 += movesCount * movesCount;
    }
    

    let result = {
        avgTime: sumTime / iters,
        avgMoves: sumMoves / iters,
        sdTime: Math.sqrt( (sumTime2 - sumTime * sumTime / iters) / (iters - 1) ),
        sdMoves: Math.sqrt( (sumMoves2 - sumMoves * sumMoves / iters) / (iters - 1) ),
        times: times,
        moves: moveCounts,
    };


    console.log(JSON.stringify(result));
}

