var Lab = require('lab');
var Code = require('code');
var NoteEntry = require('../../../server/models/note-entry');


var lab = exports.lab = Lab.script();


lab.experiment('Status Entry Class', function () {

    lab.test('it instantiates an instance', function (done) {

        var noteEntry = new NoteEntry({});

        Code.expect(noteEntry).to.be.an.instanceOf(NoteEntry);

        done();
    });
});
