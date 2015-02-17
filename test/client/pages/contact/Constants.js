var Lab = require('lab');
var Code = require('code');
var Constants = require('../../../../client/pages/contact/Constants');


var lab = exports.lab = Lab.script();


lab.experiment('Contact Constants', function () {

    lab.test('it loads', function (done) {

        Code.expect(Constants).to.exist();
        done();
    });
});
