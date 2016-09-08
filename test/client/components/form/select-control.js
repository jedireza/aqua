'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
const SelectControl = require('../../../../client/components/form/select-control.jsx');


const lab = exports.lab = Lab.script();


lab.experiment('SelectControl', () => {

    const props = {
        defaultValue: 'bar',
        children: [
            React.createElement('option', { key: '1', value: 'foo' }, 'Foo'),
            React.createElement('option', { key: '2', value: 'bar' }, 'Bar')
        ]
    };
    const SelectControlEl = React.createElement(SelectControl, props);
    const selectControl = ReactTestUtils.renderIntoDocument(SelectControlEl);


    lab.test('it renders', (done) => {

        Code.expect(selectControl).to.exist();

        done();
    });


    lab.test('it returns the selected value', (done) => {

        Code.expect(selectControl.value()).to.equal('bar');

        done();
    });
});
