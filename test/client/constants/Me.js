var Lab = require('lab');
var Code = require('code');
var Constants = require('../../../client/constants/Me');


var lab = exports.lab = Lab.script();


lab.experiment('Me Constants', function () {

    lab.test('it loads', function (done) {

        Code.expect(Constants).to.exist();
        done();
    });
});
