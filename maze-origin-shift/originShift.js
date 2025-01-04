/*
Origin Shift algorithm
by poypoyan

Distributed under the MIT software license. See the accompanying
file LICENSE or https://opensource.org/license/mit/.
*/

// helper functions
function randomElementInArr(inputArr) {
    const rndIdx = Math.floor(Math.random() * inputArr.length);
    return [inputArr[rndIdx], rndIdx];
}
function cellXY(cell, sizeX) {
    return [cell % sizeX, Math.floor(cell / sizeX)];
}

// algorithm proper
function originShiftStart(vertices, edges, cellsX, cellsY, graphStruct) {   // run once
    let update = {unvisitedColor: vertices.slice(), currColor: new Array()};
    // custom data of algorithm
    let data = {edgeDirs: new Map(), currVert: null, afterInit: true};
    // make a random vertex curr
    let [firstVert, randIdx] = randomElementInArr(vertices);
    vertices.splice(randIdx, 1);
    update['currColor'].push(firstVert);
    data['currVert'] = firstVert;

    // construct initial maze
    edges.forEach((idx) => {
        let [idxX, idxY] = cellXY(idx, cellsX), [firstX, firstY] = cellXY(firstVert, cellsX);
        if (idxY % 2 === 0 && (idxY !== firstY || idxX > firstX)) {
            update['unvisitedColor'].push(idx);
            data['edgeDirs'].set(idx, [-1, 0]);
        } else if (idxY === firstY && idxX < firstX) {
            update['unvisitedColor'].push(idx);
            data['edgeDirs'].set(idx, [1, 0]);
        } else if (idxX === 0 && idxY < firstY) {
            update['unvisitedColor'].push(idx);
            data['edgeDirs'].set(idx, [0, 1]);
        } else if (idxX === 0 && idxY > firstY) {
            update['unvisitedColor'].push(idx);
            data['edgeDirs'].set(idx, [0, -1]);
        }
    });

    return [update, data];
}
function originShiftLoop(data, vertices, cellsX, cellsY, graphStruct) {   // run inside loop
    // skip first run
    if (data['afterInit']) {
        data['afterInit'] = false;
        return {};
    }
    let update = {blankColor: new Array(), frontColor: [data['currVert']], currColor: new Array()};

    // move currVert
    let [newEdgeVert,] = randomElementInArr(graphStruct.get(data['currVert']));

    if (vertices.includes(newEdgeVert[1])) vertices.splice(vertices.indexOf(newEdgeVert[1]), 1);

    update['frontColor'].push(newEdgeVert[0]);
    if (vertices.length)
        update['currColor'].push(newEdgeVert[1]);
    else   // remove currColor for ending
        update['frontColor'].push(newEdgeVert[1]);

    if (data['edgeDirs'].has(newEdgeVert[0])) {
        data['edgeDirs'].get(newEdgeVert[0]).forEach((_v, i, arr) => {arr[i] *= -1});   // reverse direction
    } else {
        let [currX, currY] = cellXY(data['currVert'], cellsX),
            [edgeX, edgeY] = cellXY(newEdgeVert[0], cellsX),
            [vertX, vertY] = cellXY(newEdgeVert[1], cellsX);

        data['edgeDirs'].set(newEdgeVert[0], [edgeX - currX, edgeY - currY]);

        let deleteEdge = graphStruct.get(newEdgeVert[1]).filter((edgeVert) => {
            let [testEdgeX, testEdgeY] = cellXY(edgeVert[0], cellsX);

            return data['edgeDirs'].has(edgeVert[0]) && testEdgeX - vertX === data['edgeDirs'].get(edgeVert[0])[0]
            && testEdgeY - vertY === data['edgeDirs'].get(edgeVert[0])[1];
        });   // there should be only 1 'away' edge
        data['edgeDirs'].delete(deleteEdge[0][0]);
        update['blankColor'].push(deleteEdge[0][0]);
    }

    data['currVert'] = newEdgeVert[1];
    return update;
}
