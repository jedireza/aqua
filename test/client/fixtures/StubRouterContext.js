var React = require('react/addons');
var ObjectAssign = require('object-assign');


var StubRouterContext = function (Component, stubs) {

    var RouterStub = function RouterStub () {};

    ObjectAssign(RouterStub, {
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

    return React.createClass({
        childContextTypes: {
            router: React.PropTypes.func
        },
        getChildContext: function () {

            return {
                router: RouterStub
            };
        },
        render: function () {

            return React.createElement(Component, this.props);
        }
    });
};


module.exports = StubRouterContext;
