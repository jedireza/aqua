'use strict';
const Gulp = require('gulp');


Gulp.task('watch', () => {

    global.isWatching = true;
    Gulp.watch('./client/**/*.less', ['less']);
});
