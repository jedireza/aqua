var Lab = require('lab');
var Code = require('code');
var Constants = require('../../../../../client/pages/admin/constants/User');


var lab = exports.lab = Lab.script();


lab.experiment('Admin User Constants', function () {

    lab.test('it loads', function (done) {

        Code.expect(Constants).to.exist();
        done();
    });
});
