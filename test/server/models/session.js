'use strict';
const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const Sequelize = require('sequelize');
const PrepareData = require('../../lab/prepare-data');

const lab = exports.lab = Lab.script();
let Session;

const stub = {
    bcrypt: {}
};
const SessionConstructor = Proxyquire('../../../server/models/session', { bcrypt: stub.bcrypt });


lab.experiment('Session Class Methods', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                //Session = sequelize.models.Session;
                Session = SessionConstructor(db, Sequelize.DataTypes);
            }
            done(err);
        });
    });


    lab.test('it creates a key hash combination', (done) => {

        Session.generateKeyHash((err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();
            Code.expect(result.key).to.be.a.string();
            Code.expect(result.hash).to.be.a.string();

            done();
        });
    });

    lab.test('it returns an error when key hash fails', (done) => {

        const realGenSalt = stub.bcrypt.genSalt;
        stub.bcrypt.genSalt = function (rounds, callback) {

            callback(Error('bcrypt failed'));
        };

        Session.generateKeyHash((err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            stub.bcrypt.genSalt = realGenSalt;

            done();
        });
    });

    lab.test('it returns a new instance when create succeeds', (done) => {

        Session.createNew('11111111-1111-1111-1111-111111111111', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Session.Instance);

            done();
        });
    });

    lab.test('it returns an error when create fails', (done) => {

        const realCreate = Session.create;
        Session.create = function () {

            return new Promise( (resolve, reject) => {

                reject(Error('insert failed'));
            });
        };

        Session.createNew('ren', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Session.create = realCreate;

            done();
        });
    });


    lab.test('it returns a result when finding by credentials', (done) => {

        Async.auto({
            session: function (cb) {

                Session.createNew('11111111-0000-1111-1111-111111111111', (err, result) => {

                    Code.expect(err).to.not.exist();
                    Code.expect(result).to.be.an.instanceOf(Session.Instance);
                    cb(null, result);
                });
            }
        }, (err, results) => {

            if (err) {
                return done(err);
            }

            const id = results.session.id;
            const key = results.session.key;

            Session.findByCredentials( id, key, (err, result) => {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.instanceOf(Session.Instance);

                done();
            });
        });
    });

    lab.test('it returns nothing for find by credentials when key match fails', (done) => {

        const realFindById = Session.findById;
        Session.findById = function () {

            return new Promise( (resolve, reject ) => {

                resolve({
                    id: '2D',
                    userId: '1D',
                    key: 'letmein'
                });
            });
        };

        const realCompare = stub.bcrypt.compare;
        stub.bcrypt.compare = function (key, source, callback) {

            callback(null, false);
        };

        Session.findByCredentials('2D', 'doorislocked', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            Session.findById = realFindById;
            stub.bcrypt.compare = realCompare;

            done();
        });
    });


    lab.test('it returns an error when finding by credentials fails', (done) => {

        const realFindById = Session.findById;
        Session.findById = function () {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        Session.findByCredentials('2D', 'dog', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Session.findById = realFindById;

            done();
        });
    });


    lab.test('it returns early when finding by credentials misses', (done) => {

        const realFindById = Session.findById;
        Session.findById = function () {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        Session.findByCredentials('2D', 'dog', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            Session.findById = realFindById;

            done();
        });
    });
});
