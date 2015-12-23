/* global window */
'use strict';
const Form = require('./form.jsx');
const React = require('react');
const ReactDOM = require('react-dom');


class Page {
    static blastoff() {

        this.mainElement = ReactDOM.render(
            <Form />,
            window.document.getElementById('app-mount')
        );
    }
}


module.exports = Page;


/* $lab:coverage:off$ */
if (!module.parent) {
    window.page = Page;
    Page.blastoff();
}
/* $lab:coverage:on$ */
