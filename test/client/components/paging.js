'use strict';
const Code = require('code');
const Hoek = require('hoek');
const Lab = require('lab');
const Paging = require('../../../client/components/paging.jsx');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();
const defaultProps = {
    pages: {
        current: 2,
        prev: 1,
        hasPrev: true,
        next: 3,
        hasNext: true,
        total: 3
    },
    items: {
        limit: 10,
        begin: 11,
        end: 20,
        total: 30
    }
};


lab.experiment('Paging', () => {

    lab.test('it renders', (done) => {

        const props = Hoek.applyToDefaults(defaultProps, {});
        const PagingEl = React.createElement(Paging, props);
        const paging = ReactTestUtils.renderIntoDocument(PagingEl);

        Code.expect(paging).to.exist();
        done();
    });


    lab.test('it handles previous page click', (done) => {

        const props = Hoek.applyToDefaults(defaultProps, {
            onChange: function (page) {

                Code.expect(page).to.equal(defaultProps.pages.prev);
                done();
            }
        });
        const PagingEl = React.createElement(Paging, props);
        const paging = ReactTestUtils.renderIntoDocument(PagingEl);

        ReactTestUtils.Simulate.click(paging.els.prev);
    });


    lab.test('it handles next page click', (done) => {

        const props = Hoek.applyToDefaults(defaultProps, {
            onChange: function (page) {

                Code.expect(page).to.equal(defaultProps.pages.next);
                done();
            }
        });
        const PagingEl = React.createElement(Paging, props);
        const paging = ReactTestUtils.renderIntoDocument(PagingEl);

        ReactTestUtils.Simulate.click(paging.els.next);
    });
});
