'use strict';
const Gulp = require('gulp');
const Concat = require('gulp-concat');
const Less = require('gulp-less');


Gulp.task('less', () => {

    const bundleConfigs = [{
        entries: [
            './client/core/bootstrap.less',
            './client/core/font-awesome.less'
        ],
        dest: './public',
        outputName: 'core.min.css'
    }, {
        entries: './client/pages/account/index.less',
        dest: './public/pages',
        outputName: 'account.min.css'
    }, {
        entries: './client/pages/admin/index.less',
        dest: './public/pages',
        outputName: 'admin.min.css'
    }, {
        entries: './client/pages/main/index.less',
        dest: './public/pages',
        outputName: 'main.min.css'
    }];

    return bundleConfigs.map((bundleConfig) => {

        return Gulp.src(bundleConfig.entries)
            .pipe(Concat(bundleConfig.outputName))
            .pipe(Less({ compress: true }))
            .pipe(Gulp.dest(bundleConfig.dest));
    });
});
