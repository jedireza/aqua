var Lab = require('lab');
var Code = require('code');
var Routes = require('../../../../client/pages/account/Routes.react');


var lab = exports.lab = Lab.script();


lab.experiment('Account Routes', function () {

    lab.test('it loads', function (done) {

        Code.expect(Routes).to.exist();
        done();
    });
});
