'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/admin-groups/search/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/admin-groups/search/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Groups Create New Reducer', () => {

    lab.test('it handles a CREATE_NEW action', (done) => {

        Store.dispatch({
            type: Constants.CREATE_NEW,
            request: {
                data: {
                    name: 'Sales'
                }
            }
        });

        const state = Store.getState().createNew;

        Code.expect(state.loading).to.be.true();

        done();
    });


    lab.test('it handles a CREATE_NEW_RESPONSE action (resetting values on success)', (done) => {

        let state = Store.getState().createNew;
        const originalName = state.name;

        Store.dispatch({
            type: Constants.CREATE_NEW_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'Something went wrong.'
            }
        });

        state = Store.getState().createNew;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.name).to.be.equal(originalName);

        Store.dispatch({
            type: Constants.CREATE_NEW_RESPONSE,
            err: null,
            response: {}
        });

        state = Store.getState().createNew;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.name).to.be.equal('');

        done();
    });


    lab.test('it handles a SHOW_CREATE_NEW action', (done) => {

        Store.dispatch({
            type: Constants.SHOW_CREATE_NEW
        });

        const state = Store.getState().createNew;

        Code.expect(state.show).to.be.true();

        done();
    });


    lab.test('it handles a HIDE_CREATE_NEW action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_CREATE_NEW
        });

        const state = Store.getState().createNew;

        Code.expect(state.show).to.be.false();

        done();
    });
});
