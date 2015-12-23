'use strict';
const Constants = require('../../../../../../client/pages/admin/admin-groups/search/constants');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-addons-test-utils');
const Store = require('../../../../../../client/pages/admin/admin-groups/search/store');


const lab = exports.lab = Lab.script();
const stub = {
    Actions: {
        getResults: () => {}
    }
};
const Page = Proxyquire('../../../../../../client/pages/admin/admin-groups/search/index.jsx', {
    './actions': stub.Actions
});
const container = global.document.createElement('div');
const defaultProps = {
    ref: function () {

        if (defaultProps.ref.impl) {
            defaultProps.ref.impl.apply(null, arguments);
        }
    },
    location: {
        query: {}
    }
};


lab.experiment('Admin Groups Search Page', () => {

    lab.afterEach((done) => {

        ReactDOM.unmountComponentAtNode(container);

        done();
    });


    lab.test('it renders', (done) => {

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);

        done();
    });


    lab.test('it updates props with new query location data', (done) => {

        stub.Actions.getResults = function () {

            stub.Actions.getResults = () => {};

            done();
        };

        // initial render
        let PageEl = React.createElement(Page, defaultProps);
        ReactDOM.render(PageEl, container);

        // update props and render again
        const props = Object.assign({}, defaultProps, {
            location: {
                query: {
                    foo: 'bar'
                }
            }
        });
        PageEl = React.createElement(Page, props);
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


    lab.test('it handles a filter change (with event)', (done) => {

        stub.Actions.changeSearchQuery = function () {

            done();
        };

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const form = ReactTestUtils.findRenderedDOMComponentWithTag(page.els.filters, 'form');

            ReactTestUtils.Simulate.submit(form);
        };

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);
    });


    lab.test('it handles a filter change (without event)', (done) => {

        stub.Actions.changeSearchQuery = function () {

            done();
        };

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(page.els.filters, 'select');
            const limitField = selects.filter((select) => {

                return select.name === 'limit';
            })[0];

            ReactTestUtils.Simulate.change(limitField, {
                target: {
                    name: 'limit',
                    value: '10'
                }
            });
        };

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);
    });


    lab.test('it handles a page change', (done) => {

        stub.Actions.changeSearchQuery = function () {

            done();
        };

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const nextButton = page.els.paging.els.next;

            ReactTestUtils.Simulate.click(nextButton);
        };

        const PageEl = React.createElement(Page, defaultProps);

        Store.dispatch({
            type: Constants.GET_RESULTS_RESPONSE,
            err: null,
            response: {
                data: [],
                pages: {
                    current: 2, prev: 1, hasPrev: true,
                    next: 3, hasNext: true, total: 3
                },
                items: {
                    limit: 10, begin: 11, end: 20, total: 30
                }
            }
        });

        ReactDOM.render(PageEl, container);
    });


    lab.test('it handles shows the create new form', (done) => {

        stub.Actions.showCreateNew = function () {

            done();
        };

        defaultProps.ref.impl = function (page) {

            defaultProps.ref.impl = undefined;

            const newButton = page.els.createNew;

            ReactTestUtils.Simulate.click(newButton);
        };

        const PageEl = React.createElement(Page, defaultProps);

        ReactDOM.render(PageEl, container);
    });
});
