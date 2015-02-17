var Lab = require('lab');
var Code = require('code');
var Constants = require('../../../../../client/pages/admin/constants/AdminGroup');


var lab = exports.lab = Lab.script();


lab.experiment('Admin Admin Group Constants', function () {

    lab.test('it loads', function (done) {

        Code.expect(Constants).to.exist();
        done();
    });
});
