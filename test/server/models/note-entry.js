'use strict';
const Code = require('code');
const Lab = require('lab');
const NoteEntry = require('../../../server/models/note-entry');


const lab = exports.lab = Lab.script();


lab.experiment('NoteEntry Model', () => {

    lab.test('it instantiates an instance', () => {

        const noteEntry = new NoteEntry({
            data: 'Important stuff.',
            adminCreated: {
                id: '111111111111111111111111',
                name: 'Root Admin'
            }
        });

        Code.expect(noteEntry).to.be.an.instanceOf(NoteEntry);
    });
});
