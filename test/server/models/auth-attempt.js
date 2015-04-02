var Async = require('async');
var Lab = require('lab');
var Code = require('code');
var Config = require('../../../config');
var AuthAttempt = require('../../../server/models/auth-attempt');


var lab = exports.lab = Lab.script();


lab.experiment('AuthAttempt Class Methods', function () {

    lab.before(function (done) {

        AuthAttempt.connect(Config.get('/hapiMongoModels/mongodb'), function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        AuthAttempt.deleteMany({}, function (err, count) {

            AuthAttempt.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', function (done) {

        AuthAttempt.create('127.0.0.1', 'ren', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(AuthAttempt);

            done();
        });
    });


    lab.test('it returns an error when create fails', function (done) {

        var realInsertOne = AuthAttempt.insertOne;
        AuthAttempt.insertOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('insert failed'));
        };

        AuthAttempt.create('127.0.0.1', 'ren', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            AuthAttempt.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns false when abuse is not detected', function (done) {

        AuthAttempt.abuseDetected('127.0.0.1', 'ren', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.equal(false);

            done();
        });
    });


    lab.test('it returns true when abuse is detected for user + ip combo', function (done) {

        var authAttemptsConfig = Config.get('/authAttempts');
        var authSpam = [];
        var authRequest = function (cb) {

            AuthAttempt.create('127.0.0.1', 'stimpy', function (err, result) {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.object();

                cb();
            });
        };

        for (var i = 0; i < authAttemptsConfig.forIpAndUser; i++) {
            authSpam.push(authRequest);
        }

        Async.parallel(authSpam, function () {

            AuthAttempt.abuseDetected('127.0.0.1', 'stimpy', function (err, result) {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.equal(true);

                done();
            });
        });
    });


    lab.test('it returns true when abuse is detected for an ip and multiple users', function (done) {

        var authAttemptsConfig = Config.get('/authAttempts');
        var authSpam = [];
        var authRequest = function (cb) {

            var randomUsername = 'mudskipper' + i;
            AuthAttempt.create('127.0.0.2', randomUsername, function (err, result) {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.object();

                cb();
            });
        };

        for (var i = 0; i < authAttemptsConfig.forIp; i++) {
            authSpam.push(authRequest);
        }

        Async.parallel(authSpam, function () {

            AuthAttempt.abuseDetected('127.0.0.2', 'yak', function (err, result) {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.equal(true);

                done();
            });
        });
    });


    lab.test('it returns an error when count fails', function (done) {

        var realCount = AuthAttempt.count;
        AuthAttempt.count = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('count failed'));
        };

        AuthAttempt.abuseDetected('127.0.0.1', 'toastman', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            AuthAttempt.count = realCount;

            done();
        });
    });
});
