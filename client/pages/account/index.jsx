/* global window */
var React = require('react/addons');
var ReactRouter = require('react-router');
var Routes = require('./Routes');


var HistoryLocation = ReactRouter.HistoryLocation;


var App = {
    blastoff: function () {

        var self = this;

        ReactRouter.run(Routes, HistoryLocation, function (Handler) {

            self.mainElement = React.render(
                <Handler />,
                window.document.getElementById('app-mount')
            );
        });
    }
};


module.exports = App;


/* $lab:coverage:off$ */
if (!module.parent) {
    window.app = App;
    App.blastoff();
}
/* $lab:coverage:on$ */
