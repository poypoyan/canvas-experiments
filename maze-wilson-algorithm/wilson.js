/*
Wilson's algorithm
by poypoyan

Distributed under the MIT software license. See the accompanying
file LICENSE or https://opensource.org/license/mit/.
*/

// helper functions
function randomElementInArr(inputArr) {
    return inputArr[Math.floor(Math.random() * inputArr.length)];
}
function includedButNotLast(inputArr, element) {
    return ![-1, inputArr.length - 1].includes(inputArr.indexOf(element));
}

// algorithm proper
function wilsonStart(vertices, verticesFinal, graphStruct) {   // run once
    let update = [new Array()];   // [0]: on
    // custom data of algorithm
    let data = {'temp': new Array(), 'currVert': null};
    // make a random vertex final
    let firstVert = randomElementInArr(vertices);
    vertices.splice(vertices.indexOf(firstVert), 1);   // remove one specified element in array
    verticesFinal.push(firstVert);
    update[0].push(firstVert);
    return [update, data];
}
function wilsonLoop(data, vertices, verticesFinal, graphStruct) {   // run inside loop
    let update = [new Array(), new Array(), new Array()];   // [0]: off, [1]: on, [2]: temp

    if(!data['temp'].length) {
        // make another random vertex temporary
        let newVert = randomElementInArr(vertices);
        data['temp'].push(newVert);
        data['currVert'] = newVert;
        update[2].push(newVert);
    } else if(includedButNotLast(data['temp'], data['currVert'])) {
        // turn off the temp vertices right of currVert
        let sliceIdxVert = data['temp'].indexOf(data['currVert']) + 1;
        update[0].push.apply(update[0], data['temp'].slice(sliceIdxVert, -1));
        // revert the temp vertices to left vertices of currVert
        data['temp'].splice(sliceIdxVert);
    } else if(verticesFinal.includes(data['currVert'])) {
        // make temp vertices final
        update[1].push.apply(update[1], data['temp']);
        newFinalVerts = data['temp'].filter((cell, idx) => {return idx % 2 == 0 && idx != data['temp'].length - 1;});
        newFinalVerts.forEach((cell) => {
            vertices.splice(vertices.indexOf(cell), 1);
            verticesFinal.push(cell);
        });
        data['temp'] = new Array();
    } else {
        // traverse through random edge and next vertex of currVert
        let newEdgeVert = randomElementInArr(graphStruct.get(data['currVert']));
        data['temp'].push.apply(data['temp'], newEdgeVert);
        data['currVert'] = newEdgeVert[1];
        update[2].push.apply(update[2], newEdgeVert);
    }
    return update;
}
