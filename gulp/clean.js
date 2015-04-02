var Gulp = require('gulp');
var Del = require('del');


Gulp.task('clean', function (cb) {

    Del('./public', cb);
});
