'use strict';
const Code = require('code');
const Lab = require('lab');
const LinkState = require('../../../client/helpers/link-state');


const lab = exports.lab = Lab.script();
const mockComponent = {
    state: {},
    setState: function (data, callback) {

        mockComponent.setState.mock.apply(null, arguments);
    }
};
const linkState = LinkState.bind(mockComponent);


lab.experiment('Link State Helper', () => {

    lab.test('it sets shallow state', (done) => {

        mockComponent.setState.mock = function (data, callback) {

            Code.expect(data.foo).to.equal('toast');

            done();
        };

        linkState({
            target: {
                name: 'foo',
                value: 'toast'
            }
        });
    });

    lab.test('it accepts an optional callback', (done) => {

        mockComponent.setState.mock = function (data, callback) {

            Code.expect(data.foo).to.equal('toast');

            callback();
        };

        linkState(() => {

            done();
        }, {
            target: {
                name: 'foo',
                value: 'toast'
            }
        });
    });

    lab.test('it sets deep state (when that state level exists)', (done) => {

        mockComponent.state = {
            foo: {
                bar: undefined
            }
        };
        mockComponent.setState.mock = function (data, callback) {

            Code.expect(data.foo.bar).to.equal('toast');

            done();
        };

        linkState({
            target: {
                name: 'foo.bar',
                value: 'toast'
            }
        });
    });


    lab.test('it sets deep state (when that state level is missing)', (done) => {

        mockComponent.state = {};
        mockComponent.setState.mock = function (data, callback) {

            Code.expect(data.foo.bar).to.equal('toast');

            done();
        };

        linkState({
            target: {
                name: 'foo.bar',
                value: 'toast'
            }
        });
    });


    lab.test('it sets deep state (when that state level is undefined)', (done) => {

        mockComponent.state = {
            foo: {
                bar: undefined
            }
        };
        mockComponent.setState.mock = function (data, callback) {

            Code.expect(data.foo.bar.baz).to.equal('toast');

            done();
        };

        linkState({
            target: {
                name: 'foo.bar.baz',
                value: 'toast'
            }
        });
    });
});
