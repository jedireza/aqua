'use strict';
const Code = require('code');
const Constants = require('../../../../../../client/pages/admin/accounts/details/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
const Store = require('../../../../../../client/pages/admin/accounts/details/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {
        getDetails: () => {},
        getStatusOptions: () => {}
    }
};
const Page = Proxyquire('../../../../../../client/pages/admin/accounts/details/index.jsx', {
    './actions': stub.Actions
});
const container = global.document.createElement('div');
const defaultProps = {
    ref: function () {

        if (defaultProps.ref.impl) {
            defaultProps.ref.impl.apply(null, arguments);
        }
    },
    params: {}
};


lab.experiment('Admin Accounts Details Page', () => {

    lab.afterEach((done) => {

        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it renders', (done) => {

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);

        done();
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

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);
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

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);
    });


    lab.test('it renders with hydrated state', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                name: {
                    first: 'Ren',
                    middle: '',
                    last: 'Hoek'
                }
            }
        });

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const heading = ReactTestUtils.findRenderedDOMComponentWithTag(page, 'h1');

            Code.expect(heading.textContent).to.include('Ren Hoek');

            done();
        };

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);
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

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);

        Store.dispatch({
            type: 'UNKNOWN'
        });
    });
});
