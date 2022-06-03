/* Rectangular Maze Canvas
   by: poypoyan */

// constants
const vertexX = 20,
    vertexY = 20,
    cellPixel = 15,
    animateDelay = 25,
    backColor = 'black',
    frontColor = 'white',
    extColor1 = '#5588ee';

// number of cell width (X) and height (Y)
let cellsX = 2 * vertexX - 1,
    cellsY = 2 * vertexY - 1;

// create canvas
const canvas = document.createElement('canvas');
canvas.width = cellsX * cellPixel;
canvas.height = cellsY * cellPixel;
canvas.style = 'border: 3px solid ' + backColor;
canvas.innerHTML = 'Your browser does not support the canvas element.';
document.body.insertBefore(canvas, document.body.childNodes[0]);

// background fill. can also be used for clearing canvas
const ctxBack = canvas.getContext('2d');
function clearCanvas(){
    ctxBack.fillStyle = backColor;
    ctxBack.fillRect(0, 0, canvas.width, canvas.height);
}

// cell fill
const ctxCell = canvas.getContext('2d');
function fillCell(color, idx){
    ctxCell.fillStyle = color;
    ctxCell.fillRect(cellPixel * (idx % cellsX), cellPixel * Math.floor(idx / cellsY), cellPixel, cellPixel);
}

// create graph
// derive (initial) vertex indices (should be empty after algorithm completion)
let vertices = new Set();
for(let i = 0; i < vertexX; i++){
    for(let j = 0; j < vertexY; j++){
        vertices.add(2 * (cellsY * i + j));
    }
}
// initialize finalized vertices (should be full after algorithm completion)
let verticesFinal = new Set();

// derive graph traversal structure for maze generation algorithm
// structure: {<vertex index>: [[<connecting edge index>, <other vertex connected to that edge>], ...], ...}
// type: map of int to array of pairs.
let ctxNum = cellsX * cellsY;
let graphStruct = new Map();
vertices.forEach((vertex) => {
    graphStruct.set(vertex, new Array());
    if(vertex - cellsY >= 0) graphStruct.get(vertex).push([vertex - cellsY, vertex - 2 * cellsY]);
    if(vertex + cellsY < ctxNum) graphStruct.get(vertex).push([vertex + cellsY, vertex + 2 * cellsY]);
    if(vertex % cellsX != 0) graphStruct.get(vertex).push([vertex - 1, vertex - 2]);
    if(vertex % cellsX != cellsX - 1) graphStruct.get(vertex).push([vertex + 1, vertex + 2]);
});

// animation functions
function initDraw(algoStart, algoLoop){
    let [updateCellsInit, algoData] = algoStart(vertices, verticesFinal);
    clearCanvas();
    // updates change cell colors
    updateCellsInit[0].forEach((vertex) => {fillCell(frontColor, vertex);});
    updateCellsInit[1].forEach((vertex) => {fillCell(frontColor, vertex);});
    reDraw(algoData, algoLoop);
}
function reDraw(algoData, algoLoop){
    let updateCells = algoLoop(algoData, vertices, verticesFinal);
    // updates change cell colors
    updateCells[0].forEach((vertex) => {fillCell(backColor, vertex);});
    updateCells[1].forEach((vertex) => {fillCell(frontColor, vertex);});
    updateCells[2].forEach((vertex) => {fillCell(extColor1, vertex);});
    if(vertices.size) setTimeout(() => {reDraw(algoData, algoLoop)}, animateDelay);
}
