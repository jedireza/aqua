'use strict';
const Async = require('async');
const Code = require('code');
const Config = require('../../../config');
const Lab = require('lab');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
const mongoUri = Config.get('/hapiMongoModels/mongodb/uri');
const mongoOptions = Config.get('/hapiMongoModels/mongodb/options');
const stub = {
    bcrypt: {}
};
const Session = Proxyquire('../../../server/models/session', { bcrypt: stub.bcrypt });


lab.experiment('Session Class Methods', () => {

    lab.before((done) => {

        Session.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        Session.deleteMany({}, (err, count) => {

            Session.disconnect();

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

        Session.create('ren', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Session);

            done();
        });
    });

    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = Session.insertOne;
        Session.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        Session.create('ren', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Session.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by credentials', (done) => {

        Async.auto({
            session: function (cb) {

                Session.create('1D', (err, result) => {

                    Code.expect(err).to.not.exist();
                    Code.expect(result).to.be.an.instanceOf(Session);

                    cb(null, result);
                });
            }
        }, (err, results) => {

            if (err) {
                return done(err);
            }

            const id = results.session._id.toString();
            const key = results.session.key;

            Session.findByCredentials(id, key, (err, result) => {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.instanceOf(Session);

                done();
            });
        });
    });


    lab.test('it returns nothing for find by credentials when key match fails', (done) => {

        const realFindById = Session.findById;
        Session.findById = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { _id: '2D', userId: '1D', key: 'letmein' });
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

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('find by id failed'));
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

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback();
        };

        Session.findByCredentials('2D', 'dog', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            Session.findById = realFindById;

            done();
        });
    });
});
