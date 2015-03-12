var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Component = require('../../../../../../client/pages/account/components/home/Controller');


var lab = exports.lab = Lab.script();
var container = global.document.createElement('div');


lab.afterEach(function (done) {

    React.unmountComponentAtNode(container);
    done();
});


lab.experiment('Account Home Component', function () {

    lab.test('it renders normally', function (done) {

        var ComponentEl = React.createElement(Component, {});
        var component = React.render(ComponentEl, container);

        Code.expect(component).to.exist();
        done();
    });


    lab.test('it refreshes the time with interval handler', function (done) {

        var realSetInterval = setInterval;

        setInterval = function (handler, time) {

            return realSetInterval(function () {

                handler();
                setInterval = realSetInterval;
                done();
            });
        };

        var ComponentEl = React.createElement(Component, {});

        React.render(ComponentEl, container);
    });
});
