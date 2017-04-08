'use strict';
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {}
};
const Form = Proxyquire('../../../../../../client/pages/admin/users/details/roles-form.jsx', {
    './actions': stub.Actions
});
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Admin Users Roles Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, {});
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it renders with roles data', (done) => {

        const props = {
            account: {
                id: '1D',
                name: 'Stimpson J. Cat'
            },
            admin: {
                id: '2D',
                name: 'Ren Hoek'
            }
        };
        const FormEl = React.createElement(Form, props);
        const RootEl = React.createElement(MemoryRouter, {}, FormEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const form = ReactTestUtils.findRenderedComponentWithType(root, Form);

        Code.expect(form).to.exist();

        done();
    });
});
