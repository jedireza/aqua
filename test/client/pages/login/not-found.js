'use strict';
const Code = require('code');
const Lab = require('lab');
const NotFound = require('../../../../client/pages/login/not-found.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Login Not Found Component', () => {

    lab.test('it renders', (done) => {

        const NotFoundEl = React.createElement(NotFound, {});
        const notFound = ReactTestUtils.renderIntoDocument(NotFoundEl);

        Code.expect(notFound).to.exist();

        done();
    });


    lab.test('it handles unmounting', (done) => {

        const container = global.document.createElement('div');
        const NotFoundEl = React.createElement(NotFound, {});

        ReactDOM.render(NotFoundEl, container);
        ReactDOM.unmountComponentAtNode(container);

        done();
    });
});
