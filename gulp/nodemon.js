'use strict';
const Gulp = require('gulp');
const Nodemon = require('gulp-nodemon');

Gulp.task('nodemon', () => {

    const nodeArgs = [];

    if (process.env.DEBUG && process.env.DEBUG.indexOf('INSPECTER') > -1) {
        nodeArgs.push('--inspect');
    }

    if (process.env.DEBUG && process.env.DEBUG.indexOf('DEBUGGER') > -1) {
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
        nodeArgs
    })
    .on('restart', (files) => {

        console.log('change detected:', files);
    });
});
