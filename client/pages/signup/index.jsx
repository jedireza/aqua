/* global window */
var React = require('react');
var ReactDOM = require('react-dom');
var FormView = require('./Form.jsx');


var App = {
    blastoff: function () {

        this.mainElement = ReactDOM.render(
            <FormView />,
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
