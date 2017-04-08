'use strict';
const Code = require('code');
const FilterForm = require('./filter-form-fixture.jsx');
const Lab = require('lab');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();
const defaultProps = {
    loading: false,
    query: {},
    onChange: () => {}
};


lab.experiment('Filter Form HOC', () => {

    lab.test('it renders', (done) => {

        const FilterFormEl = React.createElement(FilterForm, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FilterFormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it updates props with new input state data', (done) => {

        const container = document.createElement('div');

        // initial render
        let FilterFormEl = React.createElement(FilterForm, defaultProps);
        ReactDOM.render(FilterFormEl, container);

        // update props and render again
        const props = Object.assign({}, defaultProps, {
            loading: true
        });
        FilterFormEl = React.createElement(FilterForm, props);
        ReactDOM.render(FilterFormEl, container);

        done();
    });


    lab.test('it handles a select menu change event', (done) => {

        const props = Object.assign({}, defaultProps, {
            query: {
                page: '2'
            }
        });
        const FilterFormEl = React.createElement(FilterForm, props);
        const form = ReactTestUtils.renderIntoDocument(FilterFormEl);
        const select = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'select');

        Code.expect(form.state.page).to.equal('2');

        ReactTestUtils.Simulate.change(select, {
            target: {
                name: 'select',
                value: 'b'
            }
        });

        Code.expect(form.state.page).to.equal('1');

        done();
    });


    lab.test('it handles submit on enter key, but not another key', (done) => {

        const props = Object.assign({}, defaultProps, {
            query: {
                page: '2'
            }
        });
        const FilterFormEl = React.createElement(FilterForm, props);
        const form = ReactTestUtils.renderIntoDocument(FilterFormEl);
        const text = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'input');

        Code.expect(form.state.page).to.equal('2');

        ReactTestUtils.Simulate.keyDown(text, { key: 'a' });
        ReactTestUtils.Simulate.keyDown(text, { key: 'Enter', which: 13 });

        Code.expect(form.state.page).to.equal('1');

        done();
    });


    lab.test('it handles a page change', (done) => {

        const FilterFormEl = React.createElement(FilterForm, defaultProps);
        const form = ReactTestUtils.renderIntoDocument(FilterFormEl);

        Code.expect(form.state.page).to.equal('1');

        form.changePage('2');

        Code.expect(form.state.page).to.equal('2');

        done();
    });
});
