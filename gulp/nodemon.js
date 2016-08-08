'use strict';
const Gulp = require('gulp');
const Nodemon = require('gulp-nodemon');


Gulp.task('nodemon', () => {

    const nodeArgs = [];

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
    .on('restart', (files) => {

        console.log('change detected:', files);
    });
});
