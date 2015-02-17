var Lab = require('lab');
var Code = require('code');
var StatusEntry = require('../../../server/models/status-entry');


var lab = exports.lab = Lab.script();


lab.experiment('Status Entry Class', function () {

    lab.test('it instantiates an instance', function (done) {

        var statusEntry = new StatusEntry({});

        Code.expect(statusEntry).to.be.an.instanceOf(StatusEntry);

        done();
    });
});
