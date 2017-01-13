'use strict';
const Gulp = require('gulp');
const Nodemon = require('gulp-nodemon');
const Config = require('./../config.js');


Gulp.task('nodemon', () => {

    const nodeArgs =[];
    
    if(process.env.INSPECTER){
        const nodeArgs = ['--inspect'];
    }

    if (process.env.DEBUGGER) {
        nodeArgs.push('--debug');
        console.log('debug');
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
