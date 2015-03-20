var WatchableObject = require("watchable-object");

function WatchableCollection(source) {
    WatchableObject.call(this);
    this.source = source || [];
    this.length = this.source.length;
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
        this.setProperties({
            length: this.source.length
        });
    }
});

module.exports = WatchableCollection;