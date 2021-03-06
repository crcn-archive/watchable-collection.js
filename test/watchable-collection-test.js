var WatchableCollection = require("../");
var WatchableObject     = require("watchable-object");
var expect              = require("expect.js");

describe(__filename + "#", function() {

    it("can create a new collection", function() {
        var c = new WatchableCollection([1,2,3,4]);
        expect(c.length).to.be(4);
    });

    it("can call 'at'", function() {
        var c = new WatchableCollection([1,2,3,4,5,6]);
        expect(c.at(3)).to.be(4);
    });

    it("can call 'at' with index longer than length", function() {
        var c = new WatchableCollection([1,2,3,4,5,6]);
        expect(c.at(Infinity)).to.be(void 0);
    });

    it("can call 'map'", function() {
        var mapped = new WatchableCollection([1]).map(function(v) { return { v: v }});

        expect(mapped[0].v).to.be(1);
    });

    it("can call 'forEach'", function() {
        var i = 0;
        var mapped = new WatchableCollection([1]).forEach(function(v) {
            i++;
        });
        expect(i).to.be(1);
    });

    it("can call 'filter'", function() {
        var filtered = new WatchableCollection([1,2,3,4,5]).filter(function(v) {
            return v > 2;
        });
        expect(filtered.length).to.be(3);
    });

    it("can call 'join'", function() {
        var joined = new WatchableCollection([1,2,3,4]).join("+");
        expect(joined).to.be("1+2+3+4");
    });

    it("can call 'pop'", function() {
        var c = new WatchableCollection([1,2,3,4]);
        var v = c.pop();
        expect(c.length).to.be(3);
        expect(v).to.be(4);
    });

    it("can call 'shift'", function() {
        var c = new WatchableCollection([1,2,3,4]);
        var v = c.shift();
        expect(c.length).to.be(3);
        expect(v).to.be(1);
    });

    it("can call 'push'", function() {
        var c = new WatchableCollection([1]);
        c.push(2);
        expect(c.at(1)).to.be(2);
        expect(c.length).to.be(2);
    });


    it("can call 'unshift'", function() {
        var c = new WatchableCollection([1]);
        c.unshift(2);
        expect(c.at(0)).to.be(2);
        expect(c.length).to.be(2);
    });


    it("can call 'indexOf'", function() {
        var c = new WatchableCollection([1,2]);
        expect(c.indexOf(2)).to.be(1);
    });

    it("can call 'splice'", function() {
        var c = new WatchableCollection([1,2,3,4]);
        var vs = c.splice(1, 2);
        expect(c.length).to.be(2);
        expect(vs[0]).to.be(2);
        expect(vs[1]).to.be(3);
    });

    it("can call 'splice' with replaced values", function() {
        var c = new WatchableCollection([1,2,3,4]);
        var vs = c.splice(1, 2, 5, 6, 7);
        expect(c.length).to.be(5);
        expect(vs[0]).to.be(2);
        expect(vs[1]).to.be(3);
        expect(c.at(1)).to.be(5);
        expect(c.at(2)).to.be(6);
        expect(c.at(3)).to.be(7);
    });

    it("triggers a change when the array is modified", function(next) {
        var c = new WatchableCollection([1,2,3,4]);
        var i = 0;

        c.watch(function(){ i++; });

        c.shift();
        c.pop();
        c.splice(0, 1);

        setTimeout(function() {
          expect(i).to.be(1);
          next();
        }, 1);
    });

    it("can set properties on the collection", function() {
        var c = new WatchableCollection([1,2,3,4]);
        c.set("a", 1);
        expect(c.a).to.be(1);
    });

    it("can change the source of the collection", function(next) {
        var c = new WatchableCollection();
        c.set("source", [1,2,3,4]);
        process.nextTick(function() {
          expect(c.length).to.be(4);
          c.set("source", [1,2,3,4,5,6,7]);
          process.nextTick(function() {
            expect(c.length).to.be(7);
            next();
          });
        });
    });

    it("watches for changes on models within the collection", function(next) {
      var c = new WatchableCollection();
      var i = 0;
      c.watch(function() {
        i++;
      });
      c.push(new WatchableObject());
      c.push(new WatchableObject());
      c.at(0).set("name", "blarg");
      c.at(1).set("name", "fdfsd");
      setTimeout(function() {
        expect(i).to.be(1);
        return next();
        c.at(0).set("name", "blig");
        setTimeout(function() {
          expect(i).to.be(2);
          next();
        }, 10);
      }, 10);
    });

    it("disposes watchers for models removed from the collection", function(next) {
      var c = new WatchableCollection();
      var i = 0;
      c.watch(function() {
        i++;
      });
      var m = new WatchableObject();
      c.push(m);
      c.splice(0, 1);
      m.set("name", "blarg");

      process.nextTick(function() {
        expect(i).to.be(1);
        m.set("name", "blig");
        process.nextTick(function() {
          expect(i).to.be(1);
          next();
        });
      });
    });

    xit("only triggers watch once if many models change", function(next) {
      var c = new WatchableCollection();
      var i = 0;
      c.watch(function() {
        i++;
      });
      for (var j = 1; j--;) {
        c.push(new WatchableObject());
      }


      process.nextTick(function() {
        expect(i).to.be(1);
        for (var j = 1; j--;) c.at(j).set("i", j);

        setTimeout(function() {

          expect(i).to.be(2);
          next();
        }, 10);
      });
    });

    it("updates the length of the collection immediately after source changes", function() {
      var c = new WatchableCollection();
      c.set("source", [1,2,3,4]);
      expect(c.length).to.be(4);
    });
});
