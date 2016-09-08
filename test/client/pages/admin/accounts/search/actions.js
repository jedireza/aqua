'use strict';
const Code = require('code');
const Constants = require('../../../../../../client/pages/admin/accounts/search/constants');
const FluxConstant = require('flux-constant');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    ApiActions: {
        get: function () {

            stub.ApiActions.get.mock.apply(null, arguments);
        },
        post: function () {

            stub.ApiActions.post.mock.apply(null, arguments);
        }
    },
    Store: {

        dispatch: function () {

            stub.Store.dispatch.mock.apply(null, arguments);
        }
    },
    ReactRouter: {
        browserHistory: {
            push: () => {}
        }
    }
};
const Actions = Proxyquire('../../../../../../client/pages/admin/accounts/search/actions', {
    '../../../../actions/api': stub.ApiActions,
    './store': stub.Store,
    'react-router': stub.ReactRouter
});


lab.experiment('Admin Accounts Search Actions', () => {

    lab.test('it calls ApiActions.get from getResults', (done) => {

        stub.ApiActions.get.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.getResults({});
    });


    lab.test('it calls browserHistory.push from changeSearchQuery', (done) => {

        const scrollTo = global.window.scrollTo;

        global.window.scrollTo = function () {

            global.window.scrollTo = scrollTo;

            done();
        };

        stub.ReactRouter.browserHistory.push = function (config) {

            stub.ReactRouter.browserHistory.push = () => {};

            Code.expect(config.pathname).to.be.a.string();
            Code.expect(config.query).to.be.an.object();
        };

        Actions.changeSearchQuery({});
    });


    lab.test('it calls dispatch from showCreateNew', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.SHOW_CREATE_NEW) {

                done();
            }
        };

        Actions.showCreateNew();
    });


    lab.test('it calls dispatch from hideCreateNew', (done) => {

        stub.Store.dispatch.mock = function (action) {

            if (action.type === Constants.HIDE_CREATE_NEW) {

                done();
            }
        };

        Actions.hideCreateNew();
    });


    lab.test('it calls ApiActions.post from createNew (success)', (done) => {

        const scrollTo = global.window.scrollTo;

        global.window.scrollTo = function () {

            global.window.scrollTo = scrollTo;

            done();
        };

        stub.Store.dispatch.mock = () => {};

        stub.ReactRouter.browserHistory.push = function (path) {

            stub.ReactRouter.browserHistory.push = () => {};

            Code.expect(path).to.be.a.string();
        };

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {});
        };

        Actions.createNew({});
    });


    lab.test('it calls ApiActions.post from createNew (failure)', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(new Error('sorry pal'));

            done();
        };

        Actions.createNew({});
    });
});
