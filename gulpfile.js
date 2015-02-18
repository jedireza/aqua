var gulp = require('gulp');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var jade = require('gulp-jade');
var concat = require('gulp-concat');


var paths = {
    scripts: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js'
    ],
    less: [
        './node_modules/bootstrap/less/bootstrap.less',
        './src/less/font-awesome.less',
        './src/less/index.less',
    ],
    jade: './src/jade/*.jade'
};


gulp.task('copy', function (cb) {

    return gulp.src('./node_modules/font-awesome/fonts/*.*')
        .pipe(gulp.dest('./public/fonts/'));
});


gulp.task('less', function (cb) {

    return gulp.src(paths.less)
        .pipe(less({
            compress: true
        }))
        .pipe(concat('build.css'))
        .pipe(gulp.dest('public'));
});


gulp.task('scripts', function () {

    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(concat('build.js'))
        .pipe(gulp.dest('public'));
});


gulp.task('jade', function () {

    return gulp.src(paths.jade)
        .pipe(jade({}))
        .pipe(gulp.dest('./'));
});


gulp.task('watch', function() {

    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.jade, ['jade']);
});


gulp.task('default', ['copy', 'scripts', 'less', 'jade', 'watch']);
