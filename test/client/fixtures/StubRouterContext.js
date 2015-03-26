var React = require('react/addons');
var ObjectAssign = require('object-assign');


var router = function () {};
router.makePath = function () {};
router.makeHref = function () {};
router.transitionTo = function () {};
router.replaceWith = function () {};
router.goBack = function () {};
router.getCurrentPath = function () {};
router.getCurrentRoutes = function () {};
router.getCurrentPathname = function () {};
router.getCurrentParams = function () {};
router.getParams = function () {};
router.getCurrentQuery = function () {};
router.getQuery = function () {};
router.isActive = function () {};


var StubRouterContext = function (Component, stubs) {

    return React.createClass({
        childContextTypes: {
            router: React.PropTypes.func
        },
        getChildContext: function () {

            ObjectAssign(router, stubs);

            return {
                router: router
            };
        },
        render: function () {

            return React.createElement(Component, this.props);
        }
    });
};


module.exports = StubRouterContext;
