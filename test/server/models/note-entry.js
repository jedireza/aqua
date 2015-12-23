'use strict';

const Lab = require('lab');
const Code = require('code');
const NoteEntry = require('../../../server/models/note-entry');


const lab = exports.lab = Lab.script();


lab.experiment('Status Entry Class', () => {

    lab.test('it instantiates an instance', (done) => {

        const noteEntry = new NoteEntry({});

        Code.expect(noteEntry).to.be.an.instanceOf(NoteEntry);

        done();
    });
});
