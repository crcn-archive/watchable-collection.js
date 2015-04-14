var WatchableObject = require("watchable-object");
var watchProperty   = require("./watchProperty");
var runloop         = require("watchable-object/lib/runloop").instance;

function WatchableCollection(source) {
    WatchableObject.call(this);
    this.source = source || [];
    this.length = this.source.length;
    var self = this;
    watchProperty(this, "source", function() {
        self._onChange();
    }).trigger();
}

WatchableObject.extend(WatchableCollection, {

    /**
     */

    at: function(index) {
        return index < this.length ? this.source[index] : void 0;
    },

    /**
     */

    map: function(fn) {
        return this.source.map(fn);
    },

    /**
     */

    filter: function(fn) {
        return this.source.filter(fn);
    },

    /**
     */

    forEach: function(fn) {
        return this.source.forEach(fn);
    },

    /**
     */

    join: function(fn) {
        return this.source.join(fn);
    },

    /**
     */

    pop: function() {
        return this.splice(this.source.length - 1, 1).pop();
    },

    /**
     */

    shift: function() {
        return this.splice(0, 1).pop();
    },

    /**
     */

    push: function() {
        this.source.push.apply(this.source, arguments);
        this._onChange();
    },

    /**
     */

    unshift: function() {
        this.source.unshift.apply(this.source, arguments);
        this._onChange();
    },


    /**
     */

    indexOf: function(value) {
        return this.source.indexOf(value);
    },

    /**
     */

    splice: function(start, index) {
        var repl = Array.prototype.splice.apply(2, arguments);
        var ret = this.source.splice.apply(this.source, arguments);
        this._onChange();
        return ret;
    },

    /**
     */

    _onChange: function() {

        // trigger change
        if (!this.set("length", this.source.length)) {
          this._triggerChange(this);
        }

        // if (this._rl) return this._rl.reDefer();
        // this._rl = runloop.defer(this._watchModels.bind(this));
        this._watchModels();
    },

    /**
     */

    _watchModels: function() {
      if (this._modelWatchers) {
        for (var i = this._modelWatchers.length; i--;) this._modelWatchers[i].dispose();
      }

      var onChange = function() {
        this._triggerChange(this);
      }.bind(this);

      this._modelWatchers = [];
      for (var i = this.source.length; i--;) {
        var model = this.at(0);
        if (model && model.__isWatchableObject) {
          this._modelWatchers.push(model.on("willChange", onChange));
        }
      }
    }
});

module.exports = WatchableCollection;
