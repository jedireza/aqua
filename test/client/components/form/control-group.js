'use strict';
const Code = require('code');
const ControlGroup = require('../../../../client/components/form/control-group.jsx');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-dom/test-utils');


const lab = exports.lab = Lab.script();


lab.experiment('ControlGroup', () => {

    lab.test('it renders', (done) => {

        const props = {
            children: 'Hi'
        };
        const ControlGroupEl = React.createElement(ControlGroup, props);
        const controlGroup = ReactTestUtils.renderIntoDocument(ControlGroupEl);
        const controlGroupTag = ReactTestUtils.findRenderedDOMComponentWithTag(controlGroup, 'div');

        Code.expect(controlGroupTag.textContent).to.equal('Hi');
        done();
    });


    lab.test('it renders without label or help elements', (done) => {

        const props = {
            children: 'Hi',
            hideLabel: true,
            hideHelp: true
        };
        const ControlGroupEl = React.createElement(ControlGroup, props);
        const controlGroup = ReactTestUtils.renderIntoDocument(ControlGroupEl);
        const labelEls = ReactTestUtils.scryRenderedDOMComponentsWithTag(controlGroup, 'label');
        const helpEls = ReactTestUtils.scryRenderedDOMComponentsWithClass(controlGroup, 'help-block');

        Code.expect(labelEls.length).to.equal(0);
        Code.expect(helpEls.length).to.equal(0);

        done();
    });
});
