var Gulp = require('gulp');
var Clean = require('gulp-clean');
var Merge = require('merge-stream');


Gulp.task('clean', function () {

    var build = Gulp.src('./public', { read: false }).pipe(Clean());
    var react = Gulp.src('./client/**/*.react.js', { read: false }).pipe(Clean());

    return Merge(build, react);
});
