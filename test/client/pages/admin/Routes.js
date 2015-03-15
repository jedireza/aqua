var Lab = require('lab');
var Code = require('code');
var Routes = require('../../../../client/pages/admin/Routes');


var lab = exports.lab = Lab.script();


lab.experiment('Admin Routes', function () {

    lab.test('it loads', function (done) {

        Code.expect(Routes).to.exist();
        done();
    });
});
