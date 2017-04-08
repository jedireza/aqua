'use strict';
const Code = require('code');
const Component = require('../../../../client/pages/account/home.jsx');
const Lab = require('lab');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Account Home Page', () => {

    lab.test('it renders', (done) => {

        const ComponentEl = React.createElement(Component, {});
        const component = ReactTestUtils.renderIntoDocument(ComponentEl);

        Code.expect(component).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const ComponentEl = React.createElement(Component, {});

        ReactDOM.render(ComponentEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it refreshes the time with interval handler', (done) => {

        const container = global.document.createElement('div');
        const realSetInterval = setInterval;

        setInterval = function (handler, time) {

            return realSetInterval(() => {

                handler();

                setInterval = realSetInterval;

                ReactDOM.unmountComponentAtNode(container);

                done();
            });
        };

        const ComponentEl = React.createElement(Component, {});

        ReactDOM.render(ComponentEl, container);
    });
});
