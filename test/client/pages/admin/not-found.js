'use strict';
const Code = require('code');
const Lab = require('lab');
const NotFound = require('../../../../client/pages/admin/not-found.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Not Found Page', () => {

    lab.test('it renders', (done) => {

        const NotFoundEl = React.createElement(NotFound, {});
        const notFound = TestUtils.renderIntoDocument(NotFoundEl);

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
