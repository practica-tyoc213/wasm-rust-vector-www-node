import {Universe, ADot} from "vector2d-test";
import { memory } from "vector2d-test/vector2d_test_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#00AA00";
const LIGTH_GRAY = "#EEE";

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
var ctx = canvas.getContext("2d");

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;


universe.load();
console.log("Loaded...");
const renderLoop = () => {
  universe.tick();

  requestAnimationFrame(renderLoop);
};

const toCanvas = (event) => {
    const boundingRect = canvas.getBoundingClientRect();
    const canvasLeft = (event.clientX - boundingRect.left);
    const canvasTop = (event.clientY - boundingRect.top);
    return {canvasLeft, canvasTop};
}

canvas.addEventListener("mousemove", event => {
    const boundingRect = canvas.getBoundingClientRect();

    //- console.log(boundingRect);
    const canvasLeft = (event.clientX - boundingRect.left);
    const canvasTop = (event.clientY - boundingRect.top);
    //- console.log(canvasLeft, canvasTop);
    universe.move_mouse(event.offsetX, event.offsetY);
    //clearBG();
    //drawDots();
});

canvas.addEventListener("mousedown", event => {
    let {canvasLeft, canvasTop} = toCanvas(event);
    universe.set_mouse_down(canvasLeft, canvasTop);
});


canvas.addEventListener("mouseup", event => {
    universe.set_mouse_up(event.offsetX, event.offsetY);
});



requestAnimationFrame(renderLoop);



const clearBG = ()  => {
    ctx.fillStyle = LIGTH_GRAY;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawDots = () => {
    // NOTE: draw dots has moved to `lib.rs`
    const cellsPtr = universe.dots();
    //- console.log("cellsPtr", cellsPtr)
    const cellsCount = universe.dot_count();
    const cells = new Int32Array(memory.buffer, cellsPtr, cellsCount*3);
    //- console.log("cells.A", cells);
    const cells2 = new Array<ADot>(memory.buffer, cellsPtr, cellsCount);
    //- console.log("cells.B", cells2);
    //- console.log("n-cells", cellsCount);
    let myDots = universe.dots_array();
    //- console.log("myDots", myDots)
    //- let myDotsMap = universe.dots_map();
    //- console.log("myDotsMap", myDotsMap);
  
    ctx.beginPath();
    ctx.fillStyle = ALIVE_COLOR;
    // I don't like this, but it works!
    for(let idx = 0; idx<(cellsCount*3); idx+=3){
        let x = cells[idx+1];
        let y = cells[idx+2];
        //- console.log(x, y);

        ctx.fillRect(
            x + 1,
            y + 1,
            CELL_SIZE,
            CELL_SIZE
        );
    }
    ctx.stroke();
};

// This is not called from rust!!!
export function reaload_universe_with(x) {
    console.log("reaload_universe_with called!");
    console.log(x);
}


async function initialize_world(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
    //   mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //   body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
initialize_world('http://localhost:8000/users/1', { answer: 42 })
    .then(data => {
      universe.set_dots_now(JSON.stringify(data.vectors));
    });