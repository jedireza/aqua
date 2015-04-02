var Async = require('async');
var Lab = require('lab');
var Code = require('code');
var Config = require('../../../config');
var Account = require('../../../server/models/account');


var lab = exports.lab = Lab.script();

lab.experiment('Account Class Methods', function () {

    lab.before(function (done) {

        Account.connect(Config.get('/hapiMongoModels/mongodb'), function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        Account.deleteMany({}, function (err, count) {

            Account.disconnect();
            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', function (done) {

        Account.create('Ren Höek', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Account);

            done();
        });
    });


    lab.test('it correctly sets the middle name when create is called', function (done) {

        Account.create('Stimpson J Cat', function (err, account) {

            Code.expect(err).to.not.exist();
            Code.expect(account).to.be.an.instanceOf(Account);
            Code.expect(account.name.middle).to.equal('J');

            done();
        });
    });


    lab.test('it returns an error when create fails', function (done) {

        var realInsertOne = Account.insertOne;
        Account.insertOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('insert failed'));
        };

        Account.create('Stimpy Cat', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Account.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by username', function (done) {

        Async.auto({
            account: function (cb) {

                Account.create('Stimpson J Cat', cb);
            },
            accountUpdated: ['account', function (cb, results) {

                var fieldsToUpdate = {
                    $set: {
                        user: {
                            id: '95EP150D35',
                            name: 'stimpy'
                        }
                    }
                };

                Account.findByIdAndUpdate(results.account._id, fieldsToUpdate, cb);
            }]
        }, function (err, results) {

            if (err) {
                return done(err);
            }

            Account.findByUsername('stimpy', function (err, account) {

                Code.expect(err).to.not.exist();
                Code.expect(account).to.be.an.instanceOf(Account);

                done();
            });
        });
    });
});
