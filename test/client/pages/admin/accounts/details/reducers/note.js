'use strict';
const Code = require('code');
const Constants = require('../../../../../../../client/pages/admin/accounts/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../../client/pages/admin/accounts/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Accounts Note Reducer', () => {

    lab.test('it handles a GET_DETAILS_RESPONSE action (only setting notes if present)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        let state = Store.getState().note;

        Code.expect(state.accountId).to.equal('abcxyz');

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                notes: [{}]
            }
        });

        state = Store.getState().note;

        Code.expect(state.notes).to.have.length(1);

        done();
    });


    lab.test('it handles a NEW_NOTE action', (done) => {

        Store.dispatch({
            type: Constants.NEW_NOTE,
            request: {
                data: {
                    newNote: 'toasting bread'
                }
            }
        });

        const state = Store.getState().note;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.newNote).to.equal('toasting bread');

        done();
    });


    lab.test('it handles a NEW_NOTE_RESPONSE action (only setting notes if present)', (done) => {

        Store.dispatch({
            type: Constants.NEW_NOTE_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz'
            }
        });

        let state = Store.getState().note;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.newNote).to.equal('toasting bread');

        Store.dispatch({
            type: Constants.NEW_NOTE_RESPONSE,
            err: null,
            response: {
                _id: 'abcxyz',
                notes: [{}]
            }
        });

        state = Store.getState().note;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.newNote).to.equal('');
        Code.expect(state.notes).to.have.length(1);

        done();
    });


    lab.test('it handles a HIDE_NOTE_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_NOTE_SAVE_SUCCESS
        });

        const state = Store.getState().note;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
