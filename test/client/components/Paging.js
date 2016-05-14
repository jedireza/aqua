var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Lab = require('lab');
var Code = require('code');
var Hoek = require('hoek');
var Paging = require('../../../client/components/Paging.jsx');


var lab = exports.lab = Lab.script();
var defaultProps = {
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


lab.experiment('Paging', function () {

    lab.test('it renders normally', function (done) {

        var props = Hoek.applyToDefaults(defaultProps, {});
        var PagingEl = React.createElement(Paging, props);
        var paging = TestUtils.renderIntoDocument(PagingEl);

        Code.expect(paging).to.exist();
        done();
    });


    lab.test('it handles previous page click', function (done) {

        var props = Hoek.applyToDefaults(defaultProps, {
            onChange: function (page) {

                Code.expect(page).to.equal(defaultProps.pages.prev);
                done();
            }
        });
        var PagingEl = React.createElement(Paging, props);
        var paging = TestUtils.renderIntoDocument(PagingEl);

        TestUtils.Simulate.click(ReactDOM.findDOMNode(paging.refs.prev));
    });


    lab.test('it handles next page click', function (done) {

        var props = Hoek.applyToDefaults(defaultProps, {
            onChange: function (page) {

                Code.expect(page).to.equal(defaultProps.pages.next);
                done();
            }
        });
        var PagingEl = React.createElement(Paging, props);
        var paging = TestUtils.renderIntoDocument(PagingEl);

        TestUtils.Simulate.click(ReactDOM.findDOMNode(paging.refs.next));
    });
});
