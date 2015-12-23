'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/accounts/search/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/accounts/search/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Accounts Results Reducer', () => {

    lab.test('it handles a GET_RESULTS action', (done) => {

        Store.dispatch({
            type: Constants.GET_RESULTS
        });

        const state = Store.getState().results;

        Code.expect(state.hydrated).to.be.false();
        Code.expect(state.loading).to.be.true();

        done();
    });


    lab.test('it handles a GET_RESULTS_RESPONSE action', (done) => {

        Store.dispatch({
            type: Constants.GET_RESULTS_RESPONSE,
            err: null,
            response: {
                data: [],
                pages: {},
                items: {}
            }
        });

        const state = Store.getState().results;

        Code.expect(state.hydrated).to.be.true();
        Code.expect(state.loading).to.be.false();
        Code.expect(state.data).to.an.array();
        Code.expect(state.pages).to.an.object();
        Code.expect(state.items).to.an.object();

        done();
    });
});
