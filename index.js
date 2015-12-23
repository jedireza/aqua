'use strict';

const Glue = require('glue');
const Manifest = require('./manifest');


const composeOptions = {
    relativeTo: __dirname,
    preRegister: function(server, next){

        require('babel-core/register')({
            presets: ['react', 'es2015']
        });

        next();
    }
};


module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);
