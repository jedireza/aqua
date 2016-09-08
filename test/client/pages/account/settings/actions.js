'use strict';
const Code = require('code');
const Constants = require('../../../../../client/pages/account/settings/constants');
const FluxConstant = require('flux-constant');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    ApiActions: {
        get: function () {

            stub.ApiActions.get.mock.apply(null, arguments);
        },
        put: function () {

            stub.ApiActions.put.mock.apply(null, arguments);
        }
    },
    Store: {

        dispatch: function () {

            stub.Store.dispatch.mock.apply(null, arguments);
        }
    }
};
const Actions = Proxyquire('../../../../../client/pages/account/settings/actions', {
    '../../../actions/api': stub.ApiActions,
    './store': stub.Store
});


lab.experiment('Account Settings Actions', () => {

    lab.test('it calls ApiActions.get from getDetails', (done) => {

        stub.ApiActions.get.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.getDetails();
    });


    lab.test('it calls ApiActions.put from saveDetails', (done) => {

        stub.ApiActions.put.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.saveDetails({});
    });


    lab.test('it calls dispatch from hideDetailsSaveSuccess', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.HIDE_DETAILS_SAVE_SUCCESS) {

                done();
            }
        };

        Actions.hideDetailsSaveSuccess();
    });


    lab.test('it calls ApiActions.get from getUser', (done) => {

        stub.ApiActions.get.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.getUser();
    });


    lab.test('it calls ApiActions.put from saveUser', (done) => {

        stub.ApiActions.put.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.saveUser({});
    });


    lab.test('it calls dispatch from hideUserSaveSuccess', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.HIDE_USER_SAVE_SUCCESS) {

                done();
            }
        };

        Actions.hideUserSaveSuccess();
    });


    lab.test('it calls ApiActions.put from savePassword', (done) => {

        stub.ApiActions.put.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.savePassword({
            password: 'toasting',
            passwordConfirm: 'toasting'
        });
    });


    lab.test('it calls dispatch from savePassword (passwords mismatch)', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.SAVE_PASSWORD_RESPONSE) {

                done();
            }
        };

        Actions.savePassword({
            password: 'toasting',
            passwordConfirm: 'bread'
        });
    });


    lab.test('it calls dispatch from hidePasswordSaveSuccess', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.HIDE_PASSWORD_SAVE_SUCCESS) {

                done();
            }
        };

        Actions.hidePasswordSaveSuccess();
    });
});
