'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/accounts/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/accounts/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Accounts Status Reducer', () => {

    lab.test('it handles a GET_DETAILS_RESPONSE action (only setting status if present)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        let state = Store.getState().status;

        Code.expect(state.accountId).to.equal('abcxyz');

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                status: {
                    current: {
                        id: 'some-status'
                    },
                    log: [{
                        id: 'some-status'
                    }]
                }
            }
        });

        state = Store.getState().status;

        Code.expect(state.current.id).to.equal('some-status');
        Code.expect(state.log).to.have.length(1);
        Code.expect(state.newStatus).to.equal('some-status');

        done();
    });


    lab.test('it handles a GET_STATUS_OPTIONS_RESPONSE action (only setting options if present)', (done) => {

        let state = Store.getState().status;
        const originalOptionCount = state.options.length;

        Store.dispatch({
            type: Constants.GET_STATUS_OPTIONS_RESPONSE,
            err: null,
            response: {}
        });

        state = Store.getState().status;

        Code.expect(state.options).to.have.length(originalOptionCount);

        Store.dispatch({
            type: Constants.GET_STATUS_OPTIONS_RESPONSE,
            err: null,
            response: {
                data: [{}]
            }
        });

        state = Store.getState().status;

        Code.expect(state.options).to.have.length(1);

        done();
    });


    lab.test('it handles a NEW_STATUS action', (done) => {

        Store.dispatch({
            type: Constants.NEW_STATUS,
            request: {
                data: {
                    status: 'some-status'
                }
            }
        });

        const state = Store.getState().status;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.newStatus).to.equal('some-status');

        done();
    });


    lab.test('it handles a NEW_STATUS_RESPONSE action (only setting status if present)', (done) => {

        Store.dispatch({
            type: Constants.NEW_STATUS_RESPONSE,
            err: null,
            response: {}
        });

        let state = Store.getState().status;

        Code.expect(state.loading).to.be.false();

        Store.dispatch({
            type: Constants.NEW_STATUS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                status: {
                    current: {
                        id: 'some-status'
                    },
                    log: [{
                        id: 'some-status'
                    }]
                }
            }
        });

        state = Store.getState().status;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.newStatus).to.equal('some-status');
        Code.expect(state.log).to.have.length(1);

        done();
    });


    lab.test('it handles a HIDE_STATUS_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_STATUS_SAVE_SUCCESS
        });

        const state = Store.getState().status;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
