var React = require('react/addons');
var Lab = require('lab');
var Code = require('code');
var Form = require('../../../../../../client/pages/admin/components/admin-groups/FilterForm');


var lab = exports.lab = Lab.script();
var TestUtils = React.addons.TestUtils;


lab.experiment('Admin Admin Group Filter Form', function () {

    lab.test('it renders normally', function (done) {

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();
        done();
    });


    lab.test('it handles unmounting', function (done) {

        var container = global.document.createElement('div');
        var FormEl = React.createElement(Form, {});

        React.render(FormEl, container);
        React.unmountComponentAtNode(container);

        done();
    });


    lab.test('it receives new props', function (done) {

        var FormEl = React.createElement(Form, {});
        var form = TestUtils.renderIntoDocument(FormEl);

        Code.expect(form.state.limit).to.equal(20);

        form.setProps({
            query: {
                limit: 10
            }
        });

        Code.expect(form.state.limit).to.equal(10);

        done();
    });


    lab.test('it handles a menu change', function (done) {

        var FormEl = React.createElement(Form, {
            onChange: function () {

                done();
            }
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var selects = TestUtils.scryRenderedDOMComponentsWithTag(form, 'select');
        var limit = selects[selects.length - 1];

        TestUtils.Simulate.change(limit, { target: { value: 10 } });
    });


    lab.test('it handles submit on enter key, but not another key', function (done) {

        var FormEl = React.createElement(Form, {
            onChange: function () {

                done();
            }
        });
        var form = TestUtils.renderIntoDocument(FormEl);
        var formNode = form.getDOMNode();

        TestUtils.Simulate.keyDown(formNode, { key: 'a' });
        TestUtils.Simulate.keyDown(formNode, { key: 'Enter', which: 13 });
    });


    lab.test('it handles a page change', function (done) {

        var FormEl = React.createElement(Form, {
            onChange: function () {

                done();
            }
        });
        var form = TestUtils.renderIntoDocument(FormEl);

        form.changePage('2');
    });
});
