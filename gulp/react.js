var Gulp = require('gulp');
var Newer = require('gulp-newer');
var React = require('gulp-react');
var Rename = require('gulp-rename');


Gulp.task('react', function () {

    var reactErrorHandler = function (err) {

        console.log('[react]', err.message);
        this.emit('end');
    };

    return Gulp.src('./client/**/*.jsx')
        .pipe(Newer('./client/**/*.jsx'))
        .pipe(React())
        .on('error', reactErrorHandler)
        .pipe(Rename(function (path) {
            path.extname = '.react.js';
        }))
        .pipe(Gulp.dest('./client'));
});
