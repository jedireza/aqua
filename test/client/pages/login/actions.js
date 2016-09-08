'use strict';
const Code = require('code');
const FluxConstant = require('flux-constant');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const stub = {
    ApiActions: {
        post: function () {

            stub.ApiActions.post.mock.apply(null, arguments);
        },
        delete: function () {

            stub.ApiActions.delete.mock.apply(null, arguments);
        }
    },
    ReturnUrlActions: {
        clearReturnUrl: function () {}
    }
};
const Actions = Proxyquire('../../../../client/pages/login/actions', {
    '../../actions/api': stub.ApiActions,
    '../../actions/return-url': stub.ReturnUrlActions
});


lab.experiment('Login Actions', () => {

    lab.test('it calls ApiActions.post from forgot', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.forgot({});
    });


    lab.test('it calls ApiActions.post from login (redirect to returnUrl)', (done) => {

        const returnUrl = '/deep/link';
        const localStorage = global.window.localStorage;
        const windowLocation = global.window.location;

        global.window.localStorage = {
            getItem: function () {

                global.window.localStorage = localStorage;

                return returnUrl;
            }
        };

        Object.defineProperty(global.window.location, 'href', {
            configurable: true,
            set: function (value) {

                global.window.location = windowLocation;

                Code.expect(value).to.equal(returnUrl);

                done();
            }
        });

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {});
        };

        Actions.login({});
    });


    lab.test('it calls ApiActions.post from login (redirect to admin)', (done) => {

        const localStorage = global.window.localStorage;
        const windowLocation = global.window.location;

        global.window.localStorage = {
            getItem: function () {

                global.window.localStorage = localStorage;

                return undefined;
            }
        };

        Object.defineProperty(global.window.location, 'href', {
            configurable: true,
            set: function (value) {

                global.window.location = windowLocation;

                Code.expect(value).to.equal('/admin');

                done();
            }
        });

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {
                user: {
                    roles: {
                        admin: {}
                    }
                }
            });
        };

        Actions.login({});
    });


    lab.test('it calls ApiActions.post from login (redirect to account)', (done) => {

        const localStorage = global.window.localStorage;
        const windowLocation = global.window.location;

        global.window.localStorage = {
            getItem: function () {

                global.window.localStorage = localStorage;

                return undefined;
            }
        };

        Object.defineProperty(global.window.location, 'href', {
            configurable: true,
            set: function (value) {

                global.window.location = windowLocation;

                Code.expect(value).to.equal('/account');

                done();
            }
        });

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.exist();

            callback(null, {
                user: {
                    roles: {
                        account: {}
                    }
                }
            });
        };

        Actions.login({});
    });


    lab.test('it calls ApiActions.post from login (error)', (done) => {

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

        Actions.login({});
    });


    lab.test('it calls ApiActions.delete from logout', (done) => {

        stub.ApiActions.delete.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.undefined();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.logout();
    });


    lab.test('it calls ApiActions.post from reset', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.reset({});
    });
});
