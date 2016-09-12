'use strict';
const Concat = require('gulp-concat');
const Gulp = require('gulp');
const Jade = require('gulp-jade');
const Less = require('gulp-less');
const Merge = require('merge-stream');
const Path = require('path');
const Uglify = require('gulp-uglify');


const paths = {
    scripts: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './src/index.js',
    ],
    less: [
        './node_modules/bootstrap/less/bootstrap.less',
        './src/font-awesome.less',
        './src/index.less',
    ],
    jade: './src/*.jade'
};


Gulp.task('copy', function (cb) {

    const screenshots = Gulp.src('./src/screenshots/*')
        .pipe(Gulp.dest(Path.join('./public', 'screenshots')));

    const fonts = Gulp.src('./node_modules/font-awesome/fonts/**')
        .pipe(Gulp.dest(Path.join('./public', 'fonts')));

    return Merge(screenshots, fonts);
});


Gulp.task('less', function (cb) {

    return Gulp.src(paths.less)
        .pipe(Less({
            compress: true
        }))
        .pipe(Concat('build.css'))
        .pipe(Gulp.dest('public'));
});


Gulp.task('scripts', function () {

    return Gulp.src(paths.scripts)
        .pipe(Uglify())
        .pipe(Concat('build.js'))
        .pipe(Gulp.dest('public'));
});


Gulp.task('jade', function () {

    return Gulp.src(paths.jade)
        .pipe(Jade({}))
        .pipe(Gulp.dest('./'));
});


Gulp.task('watch', function() {

    Gulp.watch(paths.scripts, ['scripts']);
    Gulp.watch(paths.less, ['less']);
    Gulp.watch(paths.jade, ['jade']);
});


Gulp.task('default', ['copy', 'scripts', 'less', 'jade', 'watch']);
