'use strict';
const BabelRegister = require('babel-core/register');
const Glue = require('glue');
const Manifest = require('./manifest');


const composeOptions = {
    relativeTo: __dirname,
    preRegister: function (server, next) {

        BabelRegister();

        next();
    }
};


module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);
