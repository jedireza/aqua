'use strict';
const Code = require('code');
const Lab = require('lab');
const NoteEntry = require('../../../server/models/note-entry');


const lab = exports.lab = Lab.script();


lab.experiment('Status Entry Class', () => {

    lab.test('it instantiates an instance', (done) => {

        const noteEntry = new NoteEntry({});

        Code.expect(noteEntry).to.be.an.instanceOf(NoteEntry);

        done();
    });
});
