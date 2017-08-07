/* global window */
'use strict';
const App = require('./app.jsx');
const ReactDOM = require('react-dom');


const Page = {
    blastoff: function () {

        this.mainElement = ReactDOM.render(
            App,
            window.document.getElementById('app-mount')
        );
    }
};


module.exports = Page;


/* $lab:coverage:off$ */
if (!module.parent) {
    window.page = Page;
    Page.blastoff();
}
/* $lab:coverage:on$ */
