var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Hoek = require('hoek');
var Paging = require('../../../client/components/Paging');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;
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

        TestUtils.Simulate.click(paging.refs.prev.getDOMNode());
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

        TestUtils.Simulate.click(paging.refs.next.getDOMNode());
    });
});
