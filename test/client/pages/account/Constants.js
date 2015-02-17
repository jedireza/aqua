var Lab = require('lab');
var Code = require('code');
var Constants = require('../../../../client/pages/account/Constants');


var lab = exports.lab = Lab.script();


lab.experiment('Account Constants', function () {

    lab.test('it loads', function (done) {

        Code.expect(Constants).to.exist();
        done();
    });
});
