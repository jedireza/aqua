var Path = require('path');
var Gulp = require('gulp');
var Newer = require('gulp-newer');
var Concat = require('gulp-concat');
var Less = require('gulp-less');


Gulp.task('less', function () {

    var bundleConfigs = [{
        entries: [
            './client/core/bootstrap.less',
            './client/core/font-awesome.less'
        ],
        dest: './public',
        outputName: 'core.min.css'
    }, {
        entries: './client/layouts/default.less',
        dest: './public/layouts',
        outputName: 'default.min.css'
    }, {
        entries: './client/pages/account/index.less',
        dest: './public/pages',
        outputName: 'account.min.css'
    }, {
        entries: './client/pages/admin/index.less',
        dest: './public/pages',
        outputName: 'admin.min.css'
    }, {
        entries: './client/pages/home/index.less',
        dest: './public/pages',
        outputName: 'home.min.css'
    }];

    return bundleConfigs.map(function (bundleConfig) {

        return Gulp.src(bundleConfig.entries)
            .pipe(Newer(Path.join(bundleConfig.dest, bundleConfig.outputName)))
            .pipe(Concat(bundleConfig.outputName))
            .pipe(Less({ compress: true }))
            .pipe(Gulp.dest(bundleConfig.dest));
    });
});
