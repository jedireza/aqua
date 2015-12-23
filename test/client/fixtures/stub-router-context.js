var React = require('react');
var ObjectAssign = require('object-assign');


var StubRouterContext = function (Component, stubs) {

    var RouterStub = function RouterStub () {};

    ObjectAssign(RouterStub, {
        history: {
            createHref: function () {}
        },
        location: {
            pathname: ''
        }
    }, stubs);

    return React.createClass({
        childContextTypes: {
            history: React.PropTypes.object,
            location: React.PropTypes.object
        },
        getChildContext: function () {

            return {
                history: RouterStub.history,
                location: RouterStub.location
            };
        },
        render: function () {

            return React.createElement(Component, this.props);
        }
    });
};


module.exports = StubRouterContext;
