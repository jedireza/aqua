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
        }
    }
};
const Actions = Proxyquire('../../../../client/pages/contact/actions', {
    '../../actions/api': stub.ApiActions
});


lab.experiment('Contact Actions', () => {

    lab.test('it calls ApiActions.post from sendMessage', (done) => {

        stub.ApiActions.post.mock = function (url, data, store, typeReq, typeRes, callback) {

            Code.expect(url).to.be.a.string();
            Code.expect(data).to.be.an.object();
            Code.expect(store).to.be.an.object();
            Code.expect(typeReq).to.be.an.instanceof(FluxConstant);
            Code.expect(typeRes).to.be.an.instanceof(FluxConstant);
            Code.expect(callback).to.not.exist();

            done();
        };

        Actions.sendMessage({});
    });
});
