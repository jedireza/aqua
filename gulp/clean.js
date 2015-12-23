'use strict';
const Gulp = require('gulp');
const Del = require('del');


Gulp.task('clean', (cb) => {

    Del('./public', cb);
});
