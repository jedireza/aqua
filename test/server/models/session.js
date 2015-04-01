var Async = require('async');
var Lab = require('lab');
var Code = require('code');
var Config = require('../../../config');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var stub = {
    bcrypt: {}
};
var Session = Proxyquire('../../../server/models/session', { bcrypt: stub.bcrypt });


lab.experiment('Session Class Methods', function () {

    lab.before(function (done) {

        Session.connect(Config.get('/hapiMongoModels/mongodb'), function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        Session.deleteMany({}, function (err, count) {

            Session.disconnect();

            done(err);
        });
    });


    lab.test('it creates a key hash combination', function (done) {

        Session.generateKeyHash(function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();
            Code.expect(result.key).to.be.a.string();
            Code.expect(result.hash).to.be.a.string();

            done();
        });
    });


    lab.test('it returns an error when key hash fails', function (done) {

        var realGenSalt = stub.bcrypt.genSalt;
        stub.bcrypt.genSalt = function (rounds, callback) {

            callback(Error('bcrypt failed'));
        };

        Session.generateKeyHash(function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            stub.bcrypt.genSalt = realGenSalt;

            done();
        });
    });


    lab.test('it returns a new instance when create succeeds', function (done) {

        Session.create('ren', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Session);

            done();
        });
    });

    lab.test('it returns an error when create fails', function (done) {

        var realInsertOne = Session.insertOne;
        Session.insertOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('insert failed'));
        };

        Session.create('ren', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Session.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by credentials', function (done) {

        Async.auto({
            session: function (cb) {

                Session.create('1D', function (err, result) {

                    Code.expect(err).to.not.exist();
                    Code.expect(result).to.be.an.instanceOf(Session);

                    cb(null, result);
                });
            }
        }, function (err, results) {

            if (err) {
                return done(err);
            }

            var id = results.session._id.toString();
            var key = results.session.key;

            Session.findByCredentials(id, key, function (err, result) {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.instanceOf(Session);

                done();
            });
        });
    });


    lab.test('it returns nothing for find by credentials when key match fails', function (done) {

        var realFindById = Session.findById;
        Session.findById = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { _id: '2D', userId: '1D', key: 'letmein' });
        };

        var realCompare = stub.bcrypt.compare;
        stub.bcrypt.compare = function (key, source, callback) {

            callback(null, false);
        };

        Session.findByCredentials('2D', 'doorislocked', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            Session.findById = realFindById;
            stub.bcrypt.compare = realCompare;

            done();
        });
    });


    lab.test('it returns an error when finding by credentials fails', function (done) {

        var realFindById = Session.findById;
        Session.findById = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('find by id failed'));
        };

        Session.findByCredentials('2D', 'dog', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Session.findById = realFindById;

            done();
        });
    });


    lab.test('it returns early when finding by credentials misses', function (done) {

        var realFindById = Session.findById;
        Session.findById = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback();
        };

        Session.findByCredentials('2D', 'dog', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            Session.findById = realFindById;

            done();
        });
    });
});
