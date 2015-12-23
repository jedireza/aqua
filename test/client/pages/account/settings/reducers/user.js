'use strict';
const Code = require('code');
const Constants = require('../../../../../../client/pages/account/settings/constants');
const Lab = require('lab');
const Store = require('../../../../../../client/pages/account/settings/store');


const lab = exports.lab = Lab.script();


lab.experiment('Account User Reducer', () => {

    lab.test('it handles a GET_USER action', (done) => {

        Store.dispatch({
            type: Constants.GET_USER
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.hydrated).to.be.false();

        done();
    });


    lab.test('it handles a GET_USER_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.GET_USER_RESPONSE,
            err: null,
            response: {}
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.hydrated).to.be.true();

        done();
    });


    lab.test('it handles a GET_USER_RESPONSE action (error)', (done) => {

        Store.dispatch({
            type: Constants.GET_USER_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.showSaveSuccess).to.be.false();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it handles a SAVE_USER action', (done) => {

        Store.dispatch({
            type: Constants.SAVE_USER,
            request: {
                data: {
                    username: 'ren',
                    email: 'ren@hoek'
                }
            }
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.username).to.equal('ren');
        Code.expect(state.email).to.equal('ren@hoek');

        done();
    });


    lab.test('it handles a SAVE_USER_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_USER_RESPONSE,
            err: null,
            response: {
                username: 'ren',
                email: 'ren@hoek'
            }
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.username).to.equal('ren');
        Code.expect(state.email).to.equal('ren@hoek');

        done();
    });


    lab.test('it handles a SAVE_USER_RESPONSE action (failure)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_USER_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it handles a HIDE_USER_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_USER_SAVE_SUCCESS
        });

        const state = Store.getState().user;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
