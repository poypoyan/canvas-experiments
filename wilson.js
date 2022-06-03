/* Wilson's algorithm
   by: poypoyan */

// helper functions
function randomElementInSet(inputSet){
    return [...inputSet][Math.floor(Math.random() * inputSet.size)];
}
function randomElementInArr(inputArr){
    return inputArr[Math.floor(Math.random() * inputArr.length)];
}
function includedButNotLast(inputArr, element){
    return ![-1, inputArr.length - 1].includes(inputArr.indexOf(element));
}

// algorithm proper
function wilsonStart(vertices, verticesFinal){   // run once
    let update = [new Array(), new Array()];   // [0]: on, [1]: temp
    // custom data of algorithm
    let data = {'temp': new Array(), 'currVert': null};
    // let data = {'temp': new Array(), 'currVert': null, 'prevEdge': null};
    // make a random vertex final
    let firstVert = randomElementInSet(vertices);
    vertices.delete(firstVert);
    verticesFinal.add(firstVert);
    update[0].push(firstVert);
    return [update, data];
}
function wilsonLoop(data, vertices, verticesFinal){   // run inside loop
    let update = [new Array(), new Array(), new Array()];   // [0]: off, [1]: on, [2]: temp

    if(!data['temp'].length){
        // make another random vertex temporary
        let newVert = randomElementInSet(vertices);
        data['temp'].push(newVert);
        data['currVert'] = newVert;
        update[2].push(newVert);
    } else if(includedButNotLast(data['temp'], data['currVert'])){
        // turn off the temp vertices right of currVert
        let sliceIdxVert = data['temp'].indexOf(data['currVert']) + 1;
        update[0].push.apply(update[0], data['temp'].slice(sliceIdxVert, -1));
        // revert the temp vertices to left vertices of currVert
        data['temp'].splice(sliceIdxVert);
    } else if(verticesFinal.has(data['currVert'])){
        // add the temp vertices to verticesFinal
        newFinalVerts = data['temp'].filter((cell, idx) => {return idx % 2 == 0 || idx != data['temp'] - 1;});
        newFinalVerts.forEach((cell) => {
            update[1].push(cell);
            vertices.delete(cell);
            verticesFinal.add(cell);
        });
        data['temp'] = new Array();
    } else {
        // traverse through random edge and next vertex of currVert
        let newEdgeVert = randomElementInArr(graphStruct.get(data['currVert']));
        // let newEdgeVert = randomElementInArr(
        //     graphStruct.get(data['currVert']).filter((pair) => {   // ...not the just traversed edge
        //         return pair[0] != data['prevEdge'];
        //     })
        // );
        data['temp'].push.apply(data['temp'], newEdgeVert);
        data['currVert'] = newEdgeVert[1];
        // data['prevEdge'] = newEdgeVert[0];
        update[1].push.apply(update[1], newEdgeVert);
        update[2].push.apply(update[2], newEdgeVert);
    }
    return update;
}
