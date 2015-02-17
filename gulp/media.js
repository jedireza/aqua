var Gulp = require('gulp');
var Path = require('path');
var Merge = require('merge-stream');


Gulp.task('media', function () {

    var general = Gulp.src('./client/media/**/*')
        .pipe(Gulp.dest(Path.join('./public', 'media')));

    var fonts = Gulp.src('./node_modules/font-awesome/fonts/**')
        .pipe(Gulp.dest(Path.join('./public', 'media', 'font-awesome', 'fonts')));

    return Merge(general, fonts);
});
