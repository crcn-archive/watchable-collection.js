var WatchableCollection = require("../")
var expect              = require("expect.js");

describe(__filename + "#", function() {
    it("can create a new collection", function() {
        new WatchableCollection();
    });
});