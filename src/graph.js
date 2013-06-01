var Graph = function(width, height) {
  this.width = width;
  this.height = height;
  this.cells = [];
  this.removedEdges = [];

  var self = this;

  this.getCellAt = function (x, y) {
    if(x >= this.width || y >= this.height || x < 0 || y < 0) {
    	return null;
    }
    if(!this.cells[x]) {
    	return null;
    }
    return this.cells[x][y];
  };

  this.getCellDistance = function (cell1, cell2) {
    var xDist = Math.abs(cell1.x - cell2.x);
    var yDist = Math.abs(cell1.y - cell2.y);
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  },

  // Returns true if there is an edge between cell1 and cell2
  this.areConnected = function(cell1, cell2) {
  	if(!cell1 || !cell2) {
  		return false;
  	}
  	if(Math.abs(cell1.x - cell2.x) > 1 || 
  		Math.abs(cell1.y - cell2.y) > 1) {
  		return false;
  	}

  	var removedEdge = _.detect(this.removedEdges, function(edge) {
  		return _.include(edge, cell1) && _.include(edge, cell2);
  	});

  	return removedEdge == undefined;
  };

  this.cellUnvisitedNeighbors = function(cell) {
  	return _.select(this.cellConnectedNeighbors(cell), function(c) {
      return !c.visited;
    });
  };

  // Returns all neighbors of this cell that ARE separated by an edge (maze line)
  this.cellConnectedNeighbors = function(cell) {
    return _.select(this.cellNeighbors(cell), function(c) {
      return self.areConnected(cell, c);
    });
  };

  // Returns all neighbors of this cell that are NOT separated by an edge
  // This means there is a maze path between both cells.
  this.cellDisconnectedNeighbors = function (cell) {
    return _.reject(this.cellNeighbors(cell), function(c) {
      return self.areConnected(cell, c);
    });
  }

  // Returns all neighbors of this cell, regardless if they are connected or not.
  this.cellNeighbors = function (cell) {
    var neighbors = [];
    var topCell = this.getCellAt(cell.x, cell.y - 1);
    var rightCell = this.getCellAt(cell.x + 1, cell.y);
    var bottomCell = this.getCellAt(cell.x, cell.y + 1);
    var leftCell = this.getCellAt(cell.x - 1, cell.y);

    if(cell.y > 0 && topCell) {
      neighbors.push(topCell);
    }
    if(cell.x < this.width && rightCell) {
      neighbors.push(rightCell);
    }
    if(cell.y < this.height && bottomCell) {
      neighbors.push(bottomCell);
    }
    if(cell.x > 0 && leftCell) {
      neighbors.push(leftCell);
    }

    return neighbors;
  }

  this.removeEdgeBetween = function(cell1, cell2) {
  	this.removedEdges.push([cell1, cell2]);
  };

  this.removeAllEdges = function() {
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        var cell1 = this.getCellAt(i, j);
        var cell2 = this.getCellAt(i + 1, j);
        var cell3 = this.getCellAt(i, j + 1);
        if (cell2) {
          this.removedEdges.push([cell1, cell2]);
        }
        if (cell3) {
          this.removedEdges.push([cell1, cell3]);
        }
      }
    }
  };

  this.addEdgeBetween = function(cell1, cell2) {
    _.each(this.removedEdges, function(edge, index) {
      if (
        (edge[0] == cell1 && edge[1] == cell2)
        || (edge[0] == cell2 && edge[1] == cell1)
      ) {
        this.removedEdges.splice(index, 1);
      }
    }, this);
  };

  for(var i = 0; i < this.width; i++) {
  	this.cells.push([]);
  	row = this.cells[i];

  	for(var j = 0; j < this.height; j++) {
  		var cell = new Cell(i, j, this);
  		row.push(cell);
  	}
  }
};