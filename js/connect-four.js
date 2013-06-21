;(function (exports) {
  var boardConstants = {
        width: 7,
        height: 6,
        boardEl: document.getElementById("connect-four-board"),
  },
      gameConstants = {
        statusEl: document.getElementById("status-message"),
        statusHole: document.getElementById("turn-indicator"),
        detailsEl: document.getElementById("status-details")
  };

  var Game = function (args) {
    for (var property in args) {
      this[property] = args[property];
    }
    this.winner = 0;
    this.round = 1;
    this.turn = 1;
    this.init();
  };

  Game.prototype.init = function () {
    this.board = new Board(boardConstants);
    this.updateStatus();
  };

  Game.prototype.updateStatus = function (message) {
    this.statusEl.innerHTML = message ? message : "Your move, Player " + this.turn + "."; 
    this.statusHole.dataset.takenByPlayer = this.turn;
  }

  Game.prototype.updateDetails = function (message) {
    this.detailsEl.innerHTML = message ? message  : "";
  }

  Game.prototype.play = function (column) {
    console.log(this.board);
    if (this.winner === 0 && this.board.columnAvailable(column)) {
      var playingHole = this.board.findNextHole(column);
      playingHole.findMatchableHoles(this.board.width,this.board.height);
      playingHole.status = this.turn;
      playingHole.domEl.dataset.takenByPlayer = this.turn;
      if (this.board.checkForWinner(playingHole)) {
        this.updateStatus("Winner: Player " + this.turn + "!");
        this.updateDetails("<a href='#' data-action='reset'>Start a new game</a>.")
        this.board.checkForWinner(playingHole).map(function (hole) {
          hole.domEl.dataset.winner = "true";
        });
        this.winner = this.turn;
        unbindEvent(document, "click", holeClickDelegator);
      } else {
        this.turn = (this.turn === 2) ? 1 : 2;
        this.round = (this.turn === 2) ? this.round + 1 : this.round;
        this.updateStatus();
      } 
    } else if (this.winner === 0 && !this.board.columnAvailable(column)) {
      this.updateDetails("That column is full! Pick another column.");
    } else {
      this.updateStatus("Player " + this.turn + " won!");
      this.updateDetails("<a href='#' data-action='reset'>Start a new game</a>.")
    }
  };

  Game.prototype.reset = function () {
    this.winner = 0;
    this.round = 1;
    this.turn = 1;
    this.updateStatus();
    this.updateDetails();
    this.board.holes.map(function (row) {
      row.map(function (hole) {
        hole.reset();
      });
    });
    bindEvent(document, "click", holeClickDelegator);
  };

  // cross-browser event binder
  var bindEvent = function (element, event, thisFunction) {
    if (element.addEventListener) {
      element.addEventListener(event, thisFunction);
    } else {
      element.attachEvent(event, thisFunction);
    }
  };

  // cross-browser event unbinder
  var unbindEvent = function (element, event, thisFunction) {
    if (element.removeEventListener) {
      element.removeEventListener(event, thisFunction);
    } else {
      element.removeEvent(event, thisFunction);
    }
  };

  // click event delegator for board holes
  var holeClickDelegator = function (event) {
    if (event.srcElement.className === "hole") {
      game.play(event.srcElement.dataset.columnId);
    }
  };

  // click event delegator for game reset
  var resetClickDelegator = function (event) {
    if (event.srcElement.dataset.action === "reset") {
      game.reset();
    }
  };

  var game = new Game(gameConstants);

  bindEvent(document, "click", holeClickDelegator);
  bindEvent(document, "click", resetClickDelegator);
      
})(this);