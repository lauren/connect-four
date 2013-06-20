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
        rightDiagonalMatches = this.findDiagonalMatches(hole, "right"),
        leftDiagonalMatches = this.findDiagonalMatches(hole, "left");
    if (horizontalMatches.length >= 4) {
      return horizontalMatches;
    } else if (verticalMatches.length >= 4) {
      return verticalMatches;
    } else if (rightDiagonalMatches.length >= 4) {
      return rightDiagonalMatches;
    } else if (leftDiagonalMatches.length >= 4) {
      return leftDiagonalMatches;
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
          if (column > end || column < 0) {
            return matches;
          } else {
            return (holeStatus === board.holes[row][column].status) 
              ? checker(column + 1, matches.concat([board.holes[row][column]]))
              : checker(column + 1, matches);
          }
        };
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

  Board.prototype.findDiagonalMatches = function (hole, direction) {
    var columnIncrementer = direction === "left" ? 1 : -1,
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
              ? checker(row + 1, column + columnIncrementer, matches.concat([board.holes[row][column]]))
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
        maxX = Math.min(boardWidth,holeCol+3);
    return {min: minX, max: maxX};
  };

  Hole.prototype.reset = function () {
    this.status = 0;
    this.domEl.dataset.takenByPlayer = "0";
    this.domEl.dataset.winner = "false";
  };

  exports.Hole = Hole;
  exports.Board = Board;

})(this);