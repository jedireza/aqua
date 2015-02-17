var Lab = require('lab');
var Code = require('code');
var Composer = require('../../index');


var lab = exports.lab = Lab.script();


lab.experiment('App', function () {

    lab.test('it composes a server', function (done) {

        Composer(function (err, composedServer) {

            Code.expect(composedServer).to.be.an.object();
            done(err);
        });
    });
});
