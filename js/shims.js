;(function () {
  if (Array.prototype.map === undefined) {
    Array.prototype.map = function (thisFunction) {
      var result = [];
      for (var i = 0; i < this.length; i++) {
        result.push(thisFunction(this[i]));
      }
      return result;
    }
  }
})();