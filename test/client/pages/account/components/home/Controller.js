var React = require('react');
var ReactDOM = require('react-dom');
var Lab = require('lab');
var Code = require('code');
var Component = require('../../../../../../client/pages/account/components/home/Controller.jsx');


var lab = exports.lab = Lab.script();
var container = global.document.createElement('div');


lab.experiment('Account Home Component', function () {

    lab.test('it renders normally', function (done) {

        var ComponentEl = React.createElement(Component, {});
        var component = ReactDOM.render(ComponentEl, container);

        Code.expect(component).to.exist();
        ReactDOM.unmountComponentAtNode(container);
        done();
    });


    lab.test('it refreshes the time with interval handler', function (done) {

        var realSetInterval = setInterval;

        setInterval = function (handler, time) {

            return realSetInterval(function () {

                handler();
                setInterval = realSetInterval;
                ReactDOM.unmountComponentAtNode(container);
                done();
            });
        };

        var ComponentEl = React.createElement(Component, {});

        ReactDOM.render(ComponentEl, container);
    });
});
