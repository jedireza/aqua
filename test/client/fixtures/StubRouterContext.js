var React = require('react/addons');
var ObjectAssign = require('object-assign');


var StubRouterContext = function (Component, stubs) {

    return React.createClass({
        childContextTypes: {
            router: React.PropTypes.object
        },
        getChildContext: function () {

            return {
                router: ObjectAssign({
                    makePath: function () {},
                    makeHref: function () {},
                    transitionTo: function () {},
                    replaceWith: function () {},
                    goBack: function () {},
                    getCurrentPath: function () {},
                    getCurrentRoutes: function () {},
                    getCurrentPathname: function () {},
                    getCurrentParams: function () {},
                    getParams: function () {},
                    getCurrentQuery: function () {},
                    getQuery: function () {},
                    isActive: function () {}
                }, stubs)
            };
        },
        render: function () {

            return React.createElement(Component, this.props);
        }
    });
};


module.exports = StubRouterContext;
