'use strict';
const Code = require('code');
const Constants = require('../../../../../../client/pages/admin/users/details/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');
const Store = require('../../../../../../client/pages/admin/users/details/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {
        getDetails: () => {}
    }
};
const Page = Proxyquire('../../../../../../client/pages/admin/users/details/index.jsx', {
    './actions': stub.Actions
});
const container = global.document.createElement('div');
const defaultProps = {
    ref: function () {

        if (defaultProps.ref.impl) {
            defaultProps.ref.impl.apply(null, arguments);
        }
    },
    match: {
        params: {}
    }
};
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Admin Users Details Page', () => {

    let RootEl;

    lab.beforeEach((done) => {

        const PageEl = React.createElement(Page, defaultProps);

        RootEl = React.createElement(MemoryRouter, {}, PageEl);

        done();
    });


    lab.afterEach((done) => {

        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it renders', (done) => {

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            Code.expect(page).to.exist();

            done();
        };

        ReactDOM.render(RootEl, container);
    });


    lab.test('it renders with dehydrated state', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS
        });

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const heading = ReactTestUtils.findRenderedDOMComponentWithTag(page, 'h1');

            Code.expect(heading.textContent).to.include('loading');

            done();
        };

        ReactDOM.render(RootEl, container);
    });


    lab.test('it renders with fetch failure state', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something failed'
            }
        });

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const heading = ReactTestUtils.findRenderedDOMComponentWithTag(page, 'h1');

            Code.expect(heading.textContent).to.include('Error');

            done();
        };

        ReactDOM.render(RootEl, container);
    });


    lab.test('it renders with hydrated state', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                username: 'ren'
            }
        });

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const heading = ReactTestUtils.findRenderedDOMComponentWithTag(page, 'h1');

            Code.expect(heading.textContent).to.include('ren');

            done();
        };

        ReactDOM.render(RootEl, container);
    });


    lab.test('it handles a store change', (done) => {

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const setState = page.setState;

            page.setState = function () {

                page.setState = setState;

                done();
            };
        };

        ReactDOM.render(RootEl, container);

        Store.dispatch({
            type: 'UNKNOWN'
        });
    });
});
