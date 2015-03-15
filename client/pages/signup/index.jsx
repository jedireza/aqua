/* global window */
var React = require('react/addons');
var FormView = require('./Form');


var App = {
    blastoff: function () {

        this.mainElement = React.render(
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
