'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/admins/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/admins/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Admins Permissions Reducer', () => {

    lab.test('it handles a GET_DETAILS_RESPONSE action (only setting permissions if present)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        let state = Store.getState().permissions;

        Code.expect(state.adminId).to.equal('abcxyz');
        Code.expect(state.permissions).to.have.length(0);

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                permissions: {
                    FOO: true,
                    BAR: false
                }
            }
        });

        state = Store.getState().permissions;

        Code.expect(state.permissions).to.have.length(2);

        done();
    });


    lab.test('it handles a SAVE_PERMISSIONS action', (done) => {

        Store.dispatch({
            type: Constants.SAVE_PERMISSIONS,
            request: {
                data: {
                    permissions: {
                        FOO: true,
                        BAR: false
                    }
                }
            }
        });

        const state = Store.getState().permissions;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.permissions.FOO).to.be.true();
        Code.expect(state.permissions.BAR).to.be.false();

        done();
    });


    lab.test('it handles a SAVE_PERMISSIONS_RESPONSE action (only setting permissions if present)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_PERMISSIONS_RESPONSE,
            err: null,
            response: {
                permissions: {}
            }
        });

        let state = Store.getState().permissions;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.permissions).to.have.length(0);

        Store.dispatch({
            type: Constants.SAVE_PERMISSIONS_RESPONSE,
            err: null,
            response: {
            }
        });

        state = Store.getState().permissions;

        Code.expect(state.loading).to.be.false();

        done();
    });


    lab.test('it handles a HIDE_PERMISSIONS_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_PERMISSIONS_SAVE_SUCCESS
        });

        const state = Store.getState().permissions;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
