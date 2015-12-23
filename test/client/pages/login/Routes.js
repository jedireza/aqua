var Lab = require('lab');
var Code = require('code');
var Routes = require('../../../../client/pages/login/Routes.jsx');


var lab = exports.lab = Lab.script();


lab.experiment('Login Routes', function () {

    lab.test('it loads', function (done) {

        Code.expect(Routes).to.exist();
        done();
    });
});
