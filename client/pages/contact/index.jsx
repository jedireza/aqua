/* global window */
'use strict';
const Form = require('./form');
const React = require('react');
const ReactDOM = require('react-dom');


class App {
    static blastoff () {

        this.mainElement = ReactDOM.render(
            <Form />,
            window.document.getElementById('app-mount')
        );
    }
}


module.exports = App;


/* $lab:coverage:off$ */
if (!module.parent) {
    window.app = App;
    App.blastoff();
}
/* $lab:coverage:on$ */
