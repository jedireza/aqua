'use strict';
const Code = require('code');
const Form = require('../../../../client/components/admin/delete-form.jsx');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('Delete Form', () => {

    lab.test('it renders', (done) => {

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);

        Code.expect(form).to.exist();

        done();
    });


    lab.test('it renders with error state', (done) => {

        const FormEl = React.createElement(Form, {
            error: 'sorry pal'
        });
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const alerts = ReactTestUtils.scryRenderedDOMComponentsWithClass(form, 'alert-danger');

        Code.expect(form).to.exist();
        Code.expect(alerts).to.have.length(1);

        done();
    });


    lab.test('it handles a submit event (canceled confirmation)', (done) => {

        const confirm = global.window.confirm;

        global.window.confirm = function () {

            global.window.confirm = confirm;

            return false;
        };

        const FormEl = React.createElement(Form, {});
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag, {
            stopPropagation: function () {

                done();
            }
        });
    });


    lab.test('it handles a submit event (cofirmed)', (done) => {

        const confirm = global.window.confirm;

        global.window.confirm = function () {

            global.window.confirm = confirm;

            return true;
        };

        const FormEl = React.createElement(Form, {
            action: function () {

                done();
            }
        });
        const form = ReactTestUtils.renderIntoDocument(FormEl);
        const formTag = ReactTestUtils.findRenderedDOMComponentWithTag(form, 'form');

        ReactTestUtils.Simulate.submit(formTag);
    });
});
