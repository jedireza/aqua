'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/statuses/search/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/statuses/search/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Statuses Create New Reducer', () => {

    lab.test('it handles a CREATE_NEW action', (done) => {

        Store.dispatch({
            type: Constants.CREATE_NEW,
            request: {
                data: {
                    pivot: 'Account',
                    name: 'Happy'
                }
            }
        });

        const state = Store.getState().createNew;

        Code.expect(state.loading).to.be.true();

        done();
    });


    lab.test('it handles a CREATE_NEW_RESPONSE action (resetting values on success)', (done) => {

        let state = Store.getState().createNew;
        const originalPivot = state.pivot;
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
        Code.expect(state.pivot).to.be.equal(originalPivot);
        Code.expect(state.name).to.be.equal(originalName);

        Store.dispatch({
            type: Constants.CREATE_NEW_RESPONSE,
            err: null,
            response: {}
        });

        state = Store.getState().createNew;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.pivot).to.be.equal('');
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
