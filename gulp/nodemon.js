var Gulp = require('gulp');
var Nodemon = require('gulp-nodemon');


Gulp.task('nodemon', function () {

    var nodeArgs = [];
    if (process.env.DEBUGGER) {
        nodeArgs.push('--debug');
    }

    Nodemon({
        script: 'server.js',
        ext: 'js md',
        ignore: [
            'client/**/*',
            'gulp/**/*',
            'public/**/*',
            'node_modules/**/*'
        ],
        nodeArgs: nodeArgs
    })
    .on('restart', function (files) {

        console.log('change detected:', files);
    });
});
