'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/admin-groups/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/admin-groups/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Groups Permissions Reducer', () => {

    lab.test('it handles a GET_DETAILS_RESPONSE action (only setting permissions if present)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                id: 'abcxyz'
            }
        });

        let state = Store.getState().permissions;

        Code.expect(state.adminGroupId).to.equal('abcxyz');
        Code.expect(state.permissionEntries).to.have.length(0);

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                id: 'abcxyz',
                AdminGroupPermissionEntries : [
                    { Id: 'abc',  Permission_Id: 'abc', Active: true },
                    { Id: 'def',  Permission_Id: 'def', Active: false }
                ]
            }
        });

        state = Store.getState().permissions;

        Code.expect(state.permissionEntries).to.have.length(2);

        done();
    });


    lab.test('it handles a SAVE_PERMISSIONS action', (done) => {

        Store.dispatch({
            type: Constants.SAVE_PERMISSIONS,
            request: {
                data: {
                    permissionEntries : [
                        { Id: 'abc',  Permission_Id: 'abc', Active: true },
                        { Id: 'def',  Permission_Id: 'def', Active: false }
                    ]
                }
            }
        });

        const state = Store.getState().permissions;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.permissionEntries[0].Active).to.be.true();
        Code.expect(state.permissionEntries[1].Active).to.be.false();

        done();
    });


    lab.test('it handles a SAVE_PERMISSIONS_RESPONSE action (only setting permissions if present)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_PERMISSIONS_RESPONSE,
            err: null,
            response: {
                permissionEntries: []
            }
        });

        let state = Store.getState().permissions;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.permissionEntries).to.have.length(0);

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
