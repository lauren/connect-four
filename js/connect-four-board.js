;(function (exports) {

  // board constructor
  var Board = function (args) {
    this.holes = [];
    for (var property in args) {
      this[property] = args[property];
    }
    this.init();
  };

  // initialize a 2D array with the board and matching
  // DOM elements
  Board.prototype.init = function () {
    for (var i = 0; i < this.height; i++) {
      this.holes.push([]);
      var newRow = document.createElement("div");
      newRow.id = "row-" + i;
      newRow.className = "row";
      this.boardEl.appendChild(newRow);
      for (var j = 0; j < this.width; j++)  {
        this.holes[i].push(new Hole({status: 0, row: newRow, rowId: i, columnId: j}));
      }
    }
  };

  Board.prototype.columnAvailable = function (column) {
    return (this.holes[0][column].status === 0);
  };

  Board.prototype.findNextHole = function (column) {
    var row = this.height - 1;
    while (row >= 0) {
      if (this.holes[row][column].status === 0) {
        return this.holes[row][column];
      } else {
        row -= 1;
      }
    }
    return false;
  };

  Board.prototype.checkForWinner = function (hole) {
    var horizontalMatches = this.findHorizontalMatches(hole),
        verticalMatches = this.findVerticalMatches(hole),
        rightUpDiagonalMatches = this.findDiagonalMatches(hole, "right", "up"),
        leftUpDiagonalMatches = this.findDiagonalMatches(hole, "left", "up"),
        rightDownDiagonalMatches = this.findDiagonalMatches(hole, "right", "down"),
        leftDownDiagonalMatches = this.findDiagonalMatches(hole, "left", "down");
    console.log("horizontal");
    console.log(horizontalMatches);
    console.log("vertical");
    console.log(verticalMatches);
    console.log("right up diag");
    console.log(rightUpDiagonalMatches);
    console.log("left up diag");
    console.log(leftUpDiagonalMatches);
    console.log("right down diag");
    console.log(rightDownDiagonalMatches);
    console.log("left down diag");
    console.log(leftDownDiagonalMatches);
    if (horizontalMatches.length >= 4) {
      return horizontalMatches;
    } else if (verticalMatches.length >= 4) {
      return verticalMatches;
    } else if (rightUpDiagonalMatches.length >= 4) {
      return rightUpDiagonalMatches;
    } else if (leftUpDiagonalMatches.length >= 4) {
      return leftUpDiagonalMatches;
    } else if (rightDownDiagonalMatches.length >= 4) {
      return rightDownDiagonalMatches;
    } else if (leftDownDiagonalMatches.length >= 4) {
      return leftDownDiagonalMatches;
    } else {
      return false;
    }
  };

  Board.prototype.findHorizontalMatches = function (hole) {
    var board = this,
        row = hole.rowId,
        boundaries = hole.findMatchableHoles(this.width),
        start = boundaries.min,
        end = boundaries.max,
        holeStatus = hole.status,
        checker = function (column, matches) {
          console.log("column");
          console.log(column);
          console.log("column status");
          console.log(board.holes[row][column]);
          console.log("matches");
          console.log(matches);
          if (column > end || column < 0 || matches.length >= 4) {
            return matches;
          } else {
            return (holeStatus === board.holes[row][column].status) 
              ? checker(column + 1, matches.concat([board.holes[row][column]]))
              : checker(column + 1, []);
          }
        };
    console.log("hole");
    console.log(hole);
    console.log("boundaries");
    console.log(boundaries);
    return checker(start, []);
  };

  Board.prototype.findVerticalMatches = function (hole) {
    var board = this,
        column = hole.columnId,
        currentRow = hole.rowId,
        numRows = this.height,
        checker = function (row, matches) {
          if (row >= numRows) {
            return matches;
          } else {
            return (hole.status === board.holes[row][column].status) 
              ? checker(row + 1, matches.concat([board.holes[row][column]])) 
              : matches;
          }
        };
    return checker(currentRow, []);
  };

  Board.prototype.findDiagonalMatches = function (hole, xDirection, yDirection) {
    var columnIncrementer = xDirection === "left" ? 1 : -1,
        rowIncrementer = yDirection === "down" ? 1 : -1
        board = this,
        currentColumn = hole.columnId,
        currentRow = hole.rowId,
        numRows = this.height,
        numColumns = this.width,
        checker = function (row, column, matches) {
          if (column >= numColumns || row >= numRows || column < 0 || row < 0) {
            return matches;
          } else {
            return (hole.status === board.holes[row][column].status)
              ? checker(row + rowIncrementer, column + columnIncrementer, matches.concat([board.holes[row][column]]))
              : matches;
          }
        }
    return checker(currentRow, currentColumn, []);
  };

  var Hole = function (args) {
    for (var property in args) {
      this[property] = args[property];
    }
    this.init();
  };

  // Hole.init creates a DOM element for itself
  Hole.prototype.init = function () {
    var newDomHole = document.createElement("div");
    newDomHole.className = "hole";
    newDomHole.dataset.rowId = this.rowId;
    newDomHole.dataset.columnId = this.columnId;
    this.domEl = newDomHole;
    this.row.appendChild(newDomHole);
  };

  // Hole.play checks if Hole is empty, and if so
  // fills it with the provided player's piece

  Hole.prototype.play = function (playerId) {
    if (this.status === 0) {
      this.status = playerId;
      this.newDomHole.className = "hole" + playerId;
      return; 
    } else {
      return false;
    }
  };

  Hole.prototype.findMatchableHoles = function (boardWidth) {
    var holeCol = this.columnId;
        holeRow = this.rowId,
        minX = Math.max(0,holeCol-3),
        maxX = Math.min(boardWidth-1,holeCol+3);
    return {min: minX, max: maxX};
  };

  Hole.prototype.reset = function () {
    this.status = 0;
    this.domEl.dataset.takenByPlayer = "0";
    this.domEl.dataset.winner = "false";
  };

  exports.Board = Board;

})(this);