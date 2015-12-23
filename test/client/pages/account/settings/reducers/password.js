'use strict';
const Code = require('code');
const Constants = require('../../../../../../client/pages/account/settings/constants');
const Lab = require('lab');
const Store = require('../../../../../../client/pages/account/settings/store');


const lab = exports.lab = Lab.script();


lab.experiment('Account Password Reducer', () => {

    lab.test('it handles a SAVE_PASSWORD action', (done) => {

        Store.dispatch({
            type: Constants.SAVE_PASSWORD
        });

        const state = Store.getState().password;

        Code.expect(state.loading).to.be.true();

        done();
    });


    lab.test('it handles a SAVE_PASSWORD_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_PASSWORD_RESPONSE
        });

        const state = Store.getState().password;

        Code.expect(state.loading).to.be.false();

        done();
    });


    lab.test('it handles a SAVE_PASSWORD_RESPONSE action (error)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_PASSWORD_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().password;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.showSaveSuccess).to.be.false();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it handles a HIDE_PASSWORD_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_PASSWORD_SAVE_SUCCESS
        });

        const state = Store.getState().password;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
