'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/users/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/users/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Users Details Reducer', () => {

    lab.test('it handles a GET_DETAILS action', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.hydrated).to.be.false();

        done();
    });


    lab.test('it handles a GET_DETAILS_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                name: {}
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.hydrated).to.be.true();

        done();
    });


    lab.test('it handles a GET_DETAILS_RESPONSE action (error)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.showFetchFailure).to.be.true();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it handles a SAVE_DETAILS action', (done) => {

        Store.dispatch({
            type: Constants.SAVE_DETAILS,
            request: {
                data: {
                    username: 'ren',
                    email: 'ren@hoek',
                    isActive: true
                }
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.username).to.equal('ren');
        Code.expect(state.email).to.equal('ren@hoek');
        Code.expect(state.isActive).to.be.true();

        done();
    });


    lab.test('it handles a SAVE_DETAILS_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                username: 'ren',
                email: 'ren@hoek',
                isActive: true
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.username).to.equal('ren');
        Code.expect(state.email).to.equal('ren@hoek');
        Code.expect(state.isActive).to.be.true();

        done();
    });


    lab.test('it handles a SAVE_DETAILS_RESPONSE action (failure)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_DETAILS_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it handles a HIDE_DETAILS_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_DETAILS_SAVE_SUCCESS
        });

        const state = Store.getState().details;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
