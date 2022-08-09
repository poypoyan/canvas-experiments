# wilson-algorithm-maze
Wilson's Algorithm for Maze Generation Demo

Video: https://youtu.be/Hy_GaNRMUuI

It is frustrating to watch in the beginning, but Wilson's algorithm has a beautiful property that it outputs random spanning trees uniformly. This means that this algorithm 1) doesn't produce loop pathways, and 2) doesn't have any bias (e.g on long pathways, short pathways, etc).

## To Improve
Because the canvas is created "globally" (i.e. not inside function/code block) and `setTimeout()` is asynchronous, I decided that the "Generate Maze!" button just refreshes the whole page for now.

## Links
Original paper: https://dl.acm.org/doi/10.1145/237814.237880

Reference: https://weblog.jamisbuck.org/2011/1/20/maze-generation-wilson-s-algorithm
