var gulp        = require("gulp");
var istanbul    = require("gulp-istanbul");
var react       = require("gulp-react");
var mocha       = require("gulp-mocha");
var plumber     = require("gulp-plumber");
var jshint      = require("gulp-jshint");

var karma    = require("karma").server;
var options  = require("yargs").argv;

/**

/**
 */

var paths = {
    testFiles: ["test/**/*-test.js"],
    appFiles: ["lib/**/*.js"],
    allFiles: ["test/**", "lib/**"],
    covFiles: ["coverage/**/*"]
};

/**
 */

var mochaOptions = {
    bail: options.bail !== 'false',
    reporter: options.reporter || 'dot',
    grep: options.grep || options.only
}

/**
 */

gulp.task("test-coverage", function (complete) {

    // reset coverage on each task cycle - keep this
    // here in case "watch" is called
    global.__coverage__ = {};

    gulp.
    src(paths.appFiles).
    pipe(istanbul()).
    pipe(istanbul.hookRequire()).
    on("finish", function () {
        gulp.
        src(paths.testFiles).
        pipe(plumber()).
        pipe(mocha(mochaOptions)).
        pipe(istanbul.writeReports({
            coverageVariable: "__coverage__",
            reporters: ["text","text-summary", "lcov"]
        })).
        on("end", complete);
    });
});

/**
 */

gulp.task("test-browser", function(complete) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, complete);
});


/**
 */

gulp.task("lint", function() {
    return gulp.run(["jsxhint", "jsxcs"]);
});

/**
 */

gulp.task("jsxcs", function() {
    return gulp.
    src(paths.appFiles).
    pipe(jsxcs({
        "preset": "google",
        "requireParenthesesAroundIIFE": true,
        "maximumLineLength": 120,
        "validateLineBreaks": "LF",
        "validateIndentation": 2,
        "validateQuoteMarks": "\"",

        "disallowKeywords": ["with"],
        "disallowSpacesInsideObjectBrackets": null,
        "disallowImplicitTypeConversion": ["string"],
        "requireCurlyBraces": [],

        "safeContextKeyword": "self"
    }))
});

/**
 * IMPORTANT: run this command AFTER watch - e.g: gulp test-coverage watch browser-sync
 */

gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "./"
        },
        files: paths.covFiles
    })
});

/**
 */

gulp.task("test", function (complete) { 
    gulp.
    src(paths.testFiles, { read: false }).
    pipe(plumber()).
    pipe(mocha(mochaOptions)).
    on("end", complete);
});

var iofwatch = process.argv.indexOf("watch");

/**
 * runs previous tasks (1 or more)
 */

gulp.task("watch", function () {
    gulp.watch(paths.allFiles, process.argv.slice(2, iofwatch));
});

/**
 */

gulp.task("default", function () {
    return gulp.run("test-coverage");
});

/**
 */

gulp.doneCallback = function (err) {


    // a bit hacky, but fixes issue with testing where process
    // doesn't exist process. Also fixes case where timeout / interval are set (CC)
    if (!~iofwatch) process.exit(err ? 1 : 0);
};