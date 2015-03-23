var Gulp = require('gulp');
var Rimraf = require('gulp-rimraf');


Gulp.task('clean', function () {

    return Gulp.src('./public', { read: false }).pipe(Rimraf());
});
