const SIZE = 4;
const ROTATION = 'CCW';
let game;
let interface;

window.addEventListener("keydown", (e) => { 
    if(interface === undefined){
        return;
    }
    
    interface.slide(e.key)
});

$('#update-puzzle').on('click', () => {
    const imgLink = $('#select-image').find(":selected").val();

    if(!imgLink) {
        alert("Please select an image")
        return;
    }

    game = new SliderPuzzleRotator(SIZE, ROTATION);
    interface = new SliderPuzzleInterface(game, imgLink, $('#game-box').get(0));
    interface.init().then(()=> {
        console.log('initialized');
    });
})



