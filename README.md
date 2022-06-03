# wilson-algorithm-maze
Wilson's Algorithm for Maze Generation Demo (in Canvas HTML and JS)

Video: https://youtu.be/Hy_GaNRMUuI

It is frustrating to watch at the beginning, but Wilson's algorithm has a beautiful property that it outputs random spanning trees uniformly. In the case of maze generation, it means that this algorithm 1) doesn't produce loop pathways, and 2) doesn't have bias on long pathways, short pathways, etc.

## Conjecture
I am thinking of a restriction wherein the random walk does not choose the edge it *just* traversed. In other words, the random walk does not "walk backward". This may lessen the average walking time, hence making the algorithm faster on average, but I am not sure if the above property still holds. What is shown in the video does not have the restriction, but nonetheless, the code portions that activate the restriction are commented in the source code.

## Limitation
Because `setTimeout()` is asynchronous, the "Generate Maze" button just refreshes the page.

## Links
Original paper: https://dl.acm.org/doi/10.1145/237814.237880

Reference: https://weblog.jamisbuck.org/2011/1/20/maze-generation-wilson-s-algorithm
