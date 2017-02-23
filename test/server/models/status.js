'use strict';
const Code = require('code');
const Lab = require('lab');
const Sequelize = require('sequelize');
const PrepareData = require('../../lab/prepare-data');

const lab = exports.lab = Lab.script();
let Status;

const StatusConstructor = require('../../../server/models/status');


lab.experiment('Status Class Methods', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                Status = StatusConstructor(db, Sequelize.DataTypes);
            }
            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        Status.create( { name: 'Order', pivot: 'Complete' }).then( (result) => {

            Code.expect(result).to.be.an.instanceOf(Status.Instance);
            done();
        }, (err) => {

            Code.expect(err).to.not.exist();
            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realCreate = Status.create;
        Status.create = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('insert failed'));
            });
        };

        Status.create( { name: 'Order', pivot: 'Fulfilled' }).then( ( result ) => {

            Code.expect(result).to.not.exist();
            done();
        }, (err) => {

            Code.expect(err).to.be.an.object();
            Status.create = realCreate;
            done();
        });
    });
});
