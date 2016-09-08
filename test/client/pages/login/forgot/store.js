'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/login/constants');
const Lab = require('lab');
const Store = require('../../../../../client/pages/login/forgot/store');


const lab = exports.lab = Lab.script();


lab.experiment('Login Forgot Store', () => {

    lab.test('it handles a FORGOT action', (done) => {

        Store.dispatch({
            type: Constants.FORGOT
        });

        const state = Store.getState();

        Code.expect(state.loading).to.be.true();
        Code.expect(state.success).to.be.false();

        done();
    });


    lab.test('it handles a FORGOT_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.FORGOT_RESPONSE
        });

        const state = Store.getState();

        Code.expect(state.loading).to.be.false();

        done();
    });


    lab.test('it handles a FORGOT_RESPONSE action (validation errors)', (done) => {

        Store.dispatch({
            type: Constants.FORGOT_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                validation: {
                    keys: ['name']
                },
                message: 'name is required'
            }
        });

        const state = Store.getState();

        Code.expect(state.loading).to.be.false();
        Code.expect(state.success).to.be.false();
        Code.expect(state.hasError).to.have.length(1);
        Code.expect(state.help).to.have.length(1);

        done();
    });


    lab.test('it handles a FORGOT_RESPONSE action (other error)', (done) => {

        Store.dispatch({
            type: Constants.FORGOT_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState();

        Code.expect(state.loading).to.be.false();
        Code.expect(state.success).to.be.false();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });
});
