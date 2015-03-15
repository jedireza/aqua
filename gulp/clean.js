var Gulp = require('gulp');
var Clean = require('gulp-clean');


Gulp.task('clean', function () {

    return Gulp.src('./public', { read: false }).pipe(Clean());
});
