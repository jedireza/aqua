var React = require('react/addons');
var ReactRouter = require('react-router');


module.exports = {
    AppHandler: React.createClass({
        render: function () {

            return React.createElement(ReactRouter.RouteHandler);
        }
    }),
    StubHandler: React.createClass({
        render: function () {

            return React.createElement('div', {});
        }
    })
};
