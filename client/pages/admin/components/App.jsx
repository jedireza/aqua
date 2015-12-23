var React = require('react');
var ReactRouter = require('react-router');
var NavBar = require('./NavBar.jsx');
var Footer = require('./Footer.jsx');


var Component = React.createClass({
    render: function () {

        return (
            <div>
                <NavBar />
                {this.props.children}
                <Footer />
            </div>
        );
    }
});


module.exports = Component;
