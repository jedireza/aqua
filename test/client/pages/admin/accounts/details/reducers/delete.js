'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/accounts/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/accounts/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Accounts Delete Reducer', () => {

    lab.test('it handles a GET_DETAILS_RESPONSE action', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        const state = Store.getState().delete;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.error).to.be.undefined();

        done();
    });


    lab.test('it handles a DELETE action', (done) => {

        Store.dispatch({
            type: Constants.DELETE
        });

        const state = Store.getState().delete;

        Code.expect(state.loading).to.be.true();

        done();
    });


    lab.test('it handles a DELETE_RESPONSE action', (done) => {

        Store.dispatch({
            type: Constants.DELETE_RESPONSE,
            err: null,
            response: {}
        });

        const state = Store.getState().delete;

        Code.expect(state.loading).to.be.false();

        done();
    });
});
