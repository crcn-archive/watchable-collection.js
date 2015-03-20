var WatchableObject = require("watchable-object");

function WatchableCollection(source) {
    WatchableObject.call(this);
    this.source = source || [];
}

WatchableObject.extend(WatchableCollection, {

    /**
     */

    map: function(fn) {
        return this.source.map(fn);
    },

    /**
     */

    filter: function(fn) {
        return this.source.filter(fn);
    }
});

module.exports = WatchableCollection;