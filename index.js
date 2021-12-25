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


const renderLoop = () => {
  universe.tick();

  clearBG();
  drawDots();

  requestAnimationFrame(renderLoop);
};

const toCanvas = (event) => {
    const boundingRect = canvas.getBoundingClientRect();
    const canvasLeft = (event.clientX - boundingRect.left);
    const canvasTop = (event.clientY - boundingRect.top);
    return (canvasLeft, canvasTop);
}

canvas.addEventListener("mousemove", event => {
    const boundingRect = canvas.getBoundingClientRect();

    //- console.log(boundingRect);
    const canvasLeft = (event.clientX - boundingRect.left);
    const canvasTop = (event.clientY - boundingRect.top);
    //- console.log(canvasLeft, canvasTop);
    universe.move_mouse(event.offsetX, event.offsetY);
    clearBG();
    drawDots();
});

canvas.addEventListener("mousedown", event => {
    let x, y = toCanvas(event);
    universe.set_mouse_down(x, y);
});


canvas.addEventListener("mouseup", event => {
    universe.set_mouse_up(event.x, event.y);
});



requestAnimationFrame(renderLoop);



const clearBG = ()  => {
    ctx.fillStyle = LIGTH_GRAY;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawDots = () => {
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