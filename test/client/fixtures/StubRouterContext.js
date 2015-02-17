var React = require('react/addons');
var ObjectAssign = require('object-assign');


var StubRouterContext = function (Component, stubs) {

    return React.createClass({
        childContextTypes: {
            makePath: React.PropTypes.func,
            makeHref: React.PropTypes.func,
            transitionTo: React.PropTypes.func,
            replaceWith: React.PropTypes.func,
            goBack: React.PropTypes.func,
            getCurrentPath: React.PropTypes.func,
            getCurrentRoutes: React.PropTypes.func,
            getCurrentPathname: React.PropTypes.func,
            getCurrentParams: React.PropTypes.func,
            getCurrentQuery: React.PropTypes.func,
            isActive: React.PropTypes.func
        },
        getChildContext: function () {

            return ObjectAssign({
                makePath: function () {},
                makeHref: function () {},
                transitionTo: function () {},
                replaceWith: function () {},
                goBack: function () {},
                getCurrentPath: function () {},
                getCurrentRoutes: function () {},
                getCurrentPathname: function () {},
                getCurrentParams: function () {},
                getCurrentQuery: function () {},
                isActive: function () {}
            }, stubs);
        },
        render: function () {

            return React.createElement(Component, this.props);
        }
    });
};


module.exports = StubRouterContext;
