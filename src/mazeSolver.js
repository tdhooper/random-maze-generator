var MazeSolver = function() {
	var self = this;

  this.solve = function(graph, targetCell) {
    var closedSet = [];
    var startCell = graph.getCellAt(0, 0); // top left cell
    if ( ! targetCell) {
      var targetCell = graph.getCellAt(graph.width - 1, graph.height - 1); // bottom right cell
    }
    var openSet = [startCell];
    var searchCell = startCell;
    var path;

    while(openSet.length > 0) {
      var neighbors = graph.cellDisconnectedNeighbors(searchCell);
      for(var i = 0; i < neighbors.length; i ++) {
        var neighbor = neighbors[i];
        if(neighbor == targetCell) {
          neighbor.parent = searchCell;
          path = neighbor.pathToOrigin();
          openSet = [];
          return path;
        }
        if(!_.include(closedSet, neighbor)) {
          if(!_.include(openSet, neighbor)) {
            openSet.push(neighbor);
            neighbor.parent = searchCell;
            neighbor.heuristic = neighbor.score() + graph.getCellDistance(neighbor, targetCell);
          }
        }
      }
      closedSet.push(searchCell);
      openSet.remove(_.indexOf(openSet, searchCell));
      searchCell = null;

      _.each(openSet, function(cell) {
        if(!searchCell) {
          searchCell = cell;
        }
        else if(searchCell.heuristic > cell.heuristic) {
          searchCell = cell;
        }
      });
    }
  };
};