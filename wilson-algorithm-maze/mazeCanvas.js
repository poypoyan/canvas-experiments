/* Rectangular Maze Canvas
   by: poypoyan */

function createCanvasObj(vertexX, vertexY, cellPixel, animateDelay, borderColor, domLocation) {
    // derive cell width (X), cell height (Y), and number of all cells
    const cellsX = 2 * vertexX - 1,
    cellsY = 2 * vertexY - 1,
    cellsAll = cellsX * cellsY;

    // initialize vertex indices (should be empty after algorithm completion)
    let vertices = new Array();
    for(let i = 0; i < vertexX; i++) {
        for(let j = 0; j < vertexY; j++) {
            vertices.push(2 * (cellsY * i + j));
        }
    }

    // initialize finalized vertices (should be full after algorithm completion)
    let verticesFinal = new Array();

    // note: vertices and verticesFinal should not have duplicates (i.e. Set-like)
    // but are set to Arrays for more flexible use by the algorithm.

    // derive graph traversal structure for maze generation algorithm
    // structure: {<vertex index>: [[<connecting edge index>, <other vertex connected to that edge>], ...], ...}
    // type: map of int to array of pairs.
    let graphStruct = new Map();
    vertices.forEach((vertex) => {
        graphStruct.set(vertex, new Array());
        if(vertex - cellsY >= 0) graphStruct.get(vertex).push([vertex - cellsY, vertex - 2 * cellsY]);
        if(vertex + cellsY < cellsAll) graphStruct.get(vertex).push([vertex + cellsY, vertex + 2 * cellsY]);
        if(vertex % cellsX != 0) graphStruct.get(vertex).push([vertex - 1, vertex - 2]);
        if(vertex % cellsX != cellsX - 1) graphStruct.get(vertex).push([vertex + 1, vertex + 2]);
    });

    // create canvas
    const canvas = document.createElement('canvas');
    canvas.width = cellsX * cellPixel;
    canvas.height = cellsY * cellPixel;
    canvas.style = 'border: 3px solid ' + borderColor;
    canvas.innerHTML = 'Your browser does not support the canvas element.';
    document.body.insertBefore(canvas, domLocation);

    return {
        'canvas': canvas,
        'cellsX': cellsX,
        'cellsY': cellsY,
        'cellPixel': cellPixel,
        'animateDelay': animateDelay,
        'freshVertices': vertices,   // for re-initialization
        'freshVerticesFinal': verticesFinal,   // for re-initialization
        'graphStruct': graphStruct,
        'vertices': null,   // this and the rest are mutable
        'verticesFinal': null,
        'running': false,
        'justEvented': false   // event guard to prevent parallel runs
    };   // canvasObj
}

// background fill. can also be used for clearing canvas
function clearCanvas(canvasObj, color) {
    const canvas = canvasObj.canvas;

    const ctxBack = canvas.getContext('2d');
    ctxBack.fillStyle = color;
    ctxBack.fillRect(0, 0, canvas.width, canvas.height);
}

// cell fill
function fillCell(canvasObj, color, idx) {
    const canvas = canvasObj.canvas,
        cellsX= canvasObj.cellsX,
        cellsY = canvasObj.cellsY,
        cellPixel = canvasObj.cellPixel;

    const ctxCell = canvas.getContext('2d');
    ctxCell.fillStyle = color;
    ctxCell.fillRect(cellPixel * (idx % cellsX), cellPixel * Math.floor(idx / cellsY), cellPixel, cellPixel);
}

// animation functions
function initDraw(canvasObj, colorsObj, algoStart, algoLoop) {
    const graphStruct = canvasObj.graphStruct;

    // initialize maze generation
    canvasObj.running = true;
    canvasObj.vertices = Array.from(canvasObj.freshVertices);
    canvasObj.verticesFinal = Array.from(canvasObj.freshVerticesFinal);
    let [updateCellsInit, algoData] = algoStart(canvasObj.vertices, canvasObj.verticesFinal, graphStruct);

    // updates change cell colors
    const backColor = colorsObj.backColor,
        frontColor = colorsObj.frontColor;
    clearCanvas(canvasObj, backColor);
    updateCellsInit[0].forEach((vertex) => {fillCell(canvasObj, frontColor, vertex);});

    reDraw(canvasObj, colorsObj, algoData, algoStart, algoLoop);
}

function reDraw(canvasObj, colorsObj, algoData, algoStart, algoLoop) {
    const animateDelay = canvasObj.animateDelay,
        graphStruct = canvasObj.graphStruct;

    let updateCells = algoLoop(algoData, canvasObj.vertices, canvasObj.verticesFinal, graphStruct);

    // updates change cell colors
    const backColor = colorsObj.backColor,
        frontColor = colorsObj.frontColor,
        extraColor = colorsObj.extraColor;
    updateCells[0].forEach((vertex) => {fillCell(canvasObj, backColor, vertex);});
    updateCells[1].forEach((vertex) => {fillCell(canvasObj, frontColor, vertex);});
    updateCells[2].forEach((vertex) => {fillCell(canvasObj, extraColor, vertex);});

    if (!canvasObj.running) {
        initDraw(canvasObj, colorsObj, algoStart, algoLoop);
    } else if(canvasObj.vertices.length) {
        setTimeout(() => {reDraw(canvasObj, colorsObj, algoData, algoStart, algoLoop)}, animateDelay);
    } else {
        canvasObj.running = false;
    }

    canvasObj.justEvented = false;
}
