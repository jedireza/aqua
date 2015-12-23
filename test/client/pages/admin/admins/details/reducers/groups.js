'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/admins/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/admins/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Admins Groups Reducer', () => {

    lab.test('it handles a GET_DETAILS_RESPONSE action (only setting groups if present)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        let state = Store.getState().groups;

        Code.expect(state.adminId).to.equal('abcxyz');
        Code.expect(state.groups).to.have.length(0);

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                groups: {
                    sales: 'Sales',
                    service: 'Service'
                }
            }
        });

        state = Store.getState().groups;

        Code.expect(state.groups).to.have.length(2);

        done();
    });


    lab.test('it handles a GET_GROUP_OPTIONS_RESPONSE action (only setting options if present)', (done) => {

        let state = Store.getState().groups;
        const originalOptionCount = state.options.length;

        Store.dispatch({
            type: Constants.GET_GROUP_OPTIONS_RESPONSE,
            err: null,
            response: {}
        });

        state = Store.getState().groups;

        Code.expect(state.options).to.have.length(originalOptionCount);

        Store.dispatch({
            type: Constants.GET_GROUP_OPTIONS_RESPONSE,
            err: null,
            response: {
                data: [{}]
            }
        });

        state = Store.getState().groups;

        Code.expect(state.options).to.have.length(1);

        done();
    });


    lab.test('it handles a SAVE_GROUPS action', (done) => {

        Store.dispatch({
            type: Constants.SAVE_GROUPS,
            request: {
                data: {
                    groups: {
                        sales: 'Sales',
                        service: 'Service'
                    }
                }
            }
        });

        const state = Store.getState().groups;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.groups.sales).to.equal('Sales');
        Code.expect(state.groups.service).to.equal('Service');

        done();
    });


    lab.test('it handles a SAVE_GROUPS_RESPONSE action (only setting groups if present)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_GROUPS_RESPONSE,
            err: null,
            response: {
                groups: {}
            }
        });

        let state = Store.getState().groups;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.groups).to.have.length(0);

        Store.dispatch({
            type: Constants.SAVE_GROUPS_RESPONSE,
            err: null,
            response: {
            }
        });

        state = Store.getState().groups;

        Code.expect(state.loading).to.be.false();

        done();
    });


    lab.test('it handles a HIDE_GROUPS_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_GROUPS_SAVE_SUCCESS
        });

        const state = Store.getState().groups;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
