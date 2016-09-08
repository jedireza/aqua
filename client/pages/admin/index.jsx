/* global window */
'use strict';
const ReactDOM = require('react-dom');
const Routes = require('./routes.jsx');


const Page = {
    blastoff: function () {

        this.mainElement = ReactDOM.render(
            Routes,
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
