'use strict';
const Account = require('../../../server/models/account');
const Async = require('async');
const Code = require('code');
const Config = require('../../../config');
const Lab = require('lab');


const lab = exports.lab = Lab.script();
const mongoUri = Config.get('/hapiMongoModels/mongodb/uri');
const mongoOptions = Config.get('/hapiMongoModels/mongodb/options');


lab.experiment('Account Class Methods', () => {

    lab.before((done) => {

        Account.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        Account.deleteMany({}, (err, count) => {

            Account.disconnect();
            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        Account.create('Ren Höek', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Account);

            done();
        });
    });


    lab.test('it correctly sets the middle name when create is called', (done) => {

        Account.create('Stimpson J Cat', (err, account) => {

            Code.expect(err).to.not.exist();
            Code.expect(account).to.be.an.instanceOf(Account);
            Code.expect(account.name.middle).to.equal('J');

            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = Account.insertOne;
        Account.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        Account.create('Stimpy Cat', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Account.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by username', (done) => {

        Async.auto({
            account: function (cb) {

                Account.create('Stimpson J Cat', cb);
            },
            accountUpdated: ['account', function (results, cb) {

                const fieldsToUpdate = {
                    $set: {
                        user: {
                            id: '95EP150D35',
                            name: 'stimpy'
                        }
                    }
                };

                Account.findByIdAndUpdate(results.account._id, fieldsToUpdate, cb);
            }]
        }, (err, results) => {

            if (err) {
                return done(err);
            }

            Account.findByUsername('stimpy', (err, account) => {

                Code.expect(err).to.not.exist();
                Code.expect(account).to.be.an.instanceOf(Account);

                done();
            });
        });
    });
});
