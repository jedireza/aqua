var Lab = require('lab');
var Code = require('code');
var Constants = require('../../../../client/pages/signup/constants');


var lab = exports.lab = Lab.script();


lab.experiment('Sign Up Constants', function () {

    lab.test('it loads', function (done) {

        Code.expect(Constants).to.exist();
        done();
    });
});
