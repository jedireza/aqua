var Gulp = require('gulp');
var Nodemon = require('gulp-nodemon');


Gulp.task('nodemon', function () {

    Nodemon({
        script: 'server.js',
        ext: 'js md',
        ignore: [
            'client/**/*',
            'gulp/**/*',
            'public/**/*'
        ]
    })
    .on('restart', function (files) {

        console.log('change detected:', files);
    });
});
