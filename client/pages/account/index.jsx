/* global window */
var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Routes = require('./Routes.jsx');


var App = {
    blastoff: function () {

        this.mainElement = ReactDOM.render(
            Routes,
            window.document.getElementById('app-mount')
        );
    }
};


module.exports = App;


/* $lab:coverage:off$ */
if (!module.parent) {
    window.app = App;
    App.blastoff();
}
/* $lab:coverage:on$ */
