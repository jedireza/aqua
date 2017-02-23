'use strict';
const Code = require('code');
const Lab = require('lab');
const Sequelize = require('sequelize');
const PrepareData = require('../../lab/prepare-data');

const lab = exports.lab = Lab.script();
let StatusEntry;

const StatusEntryConstructor = require('../../../server/models/status-entry');

lab.experiment('Status Entry Class', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                StatusEntry = StatusEntryConstructor(db, Sequelize.DataTypes);
            }
            done(err);
        });
    });
    lab.test('it instantiates an instance', (done) => {

        StatusEntry.create({ name: 'status the entry' }).then( (result) => {

            Code.expect(result).to.be.an.instanceOf(StatusEntry.Instance);
            done();
        }, (err) => {

            done(err);
        });
    });
});
