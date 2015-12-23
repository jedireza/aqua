'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/admins/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/admins/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Admins User Reducer', () => {

    lab.test('it handles a GET_DETAILS_RESPONSE action (only setting user if present)', (done) => {

        let state = Store.getState().user;
        const originalId = state.id;
        const originalName = state.name;

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        state = Store.getState().user;

        Code.expect(state.adminId).to.equal('abcxyz');
        Code.expect(state.id).to.equal(originalId);
        Code.expect(state.name).to.equal(originalName);

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                user: {
                    id: '123789',
                    name: 'ren'
                }
            }
        });

        state = Store.getState().user;

        Code.expect(state.id).to.equal('123789');
        Code.expect(state.name).to.equal('ren');

        done();
    });


    lab.test('it handles a LINK_USER action', (done) => {

        Store.dispatch({
            type: Constants.LINK_USER,
            request: {}
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.true();

        done();
    });


    lab.test('it handles a LINK_USER_RESPONSE action (only setting user if present)', (done) => {

        let state = Store.getState().user;
        const originalId = state.id;
        const originalName = state.name;

        Store.dispatch({
            type: Constants.LINK_USER_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.id).to.equal(originalId);
        Code.expect(state.name).to.equal(originalName);

        Store.dispatch({
            type: Constants.LINK_USER_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                user: {
                    id: '789123',
                    name: 'stimpy'
                }
            }
        });

        state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.id).to.equal('789123');
        Code.expect(state.name).to.equal('stimpy');

        done();
    });


    lab.test('it handles a UNLINK_USER action', (done) => {

        Store.dispatch({
            type: Constants.UNLINK_USER,
            request: {}
        });

        const state = Store.getState().user;

        Code.expect(state.loading).to.be.true();

        done();
    });


    lab.test('it handles a UNLINK_USER_RESPONSE action (only resetting user if present)', (done) => {

        Store.dispatch({
            type: Constants.UNLINK_USER_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        let state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.id).to.be.undefined();
        Code.expect(state.name).to.be.undefined();

        Store.dispatch({
            type: Constants.UNLINK_USER_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                user: {
                    id: '789123',
                    name: 'stimpy'
                }
            }
        });

        state = Store.getState().user;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.id).to.equal('789123');
        Code.expect(state.name).to.equal('stimpy');

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
