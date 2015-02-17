var Glue = require('glue');
var Manifest = require('./manifest');


var composeOptions = {
    relativeTo: __dirname
};


module.exports = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);
