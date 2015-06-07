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

    sort: function(fn) {
        return this.source.sort(fn);
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
    }
});

module.exports = WatchableCollection;
