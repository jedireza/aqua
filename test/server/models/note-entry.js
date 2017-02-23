'use strict';
const Code = require('code');
const Lab = require('lab');
const PrepareData = require('../../lab/prepare-data');


const lab = exports.lab = Lab.script();
let sequelize;
let NoteEntry;


lab.experiment('Status Entry Class', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                sequelize = db;
                NoteEntry = sequelize.models.NoteEntry;
            }
            done(err);
        });
    });
    lab.test('it instantiates an instance', (done) => {

        NoteEntry.create({ data: 'note entry' }).then( (noteEntry) => {

            Code.expect(noteEntry).to.be.an.instanceOf(NoteEntry.Instance);
            done();
        }, (err) => {

            done(err);
        });
    });
});
