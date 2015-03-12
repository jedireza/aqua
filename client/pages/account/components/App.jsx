var React = require('react/addons');
var ReactRouter = require('react-router');
var NavBar = require('./NavBar');
var Footer = require('./Footer');


var Component = React.createClass({
    render: function () {

        return (
            <div>
                <NavBar />
                <ReactRouter.RouteHandler />
                <Footer />
            </div>
        );
    }
});


module.exports = Component;
