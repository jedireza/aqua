'use strict';
const Async = require('async');
const AuthAttempt = require('../../../server/models/auth-attempt');
const Code = require('code');
const Config = require('../../../config');
const Lab = require('lab');


const lab = exports.lab = Lab.script();
const mongoUri = Config.get('/hapiMongoModels/mongodb/uri');
const mongoOptions = Config.get('/hapiMongoModels/mongodb/options');


lab.experiment('AuthAttempt Class Methods', () => {

    lab.before((done) => {

        AuthAttempt.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        AuthAttempt.deleteMany({}, (err, count) => {

            AuthAttempt.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        AuthAttempt.create('127.0.0.1', 'ren', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(AuthAttempt);

            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = AuthAttempt.insertOne;
        AuthAttempt.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        AuthAttempt.create('127.0.0.1', 'ren', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            AuthAttempt.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns false when abuse is not detected', (done) => {

        AuthAttempt.abuseDetected('127.0.0.1', 'ren', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.equal(false);

            done();
        });
    });


    lab.test('it returns true when abuse is detected for user + ip combo', (done) => {

        const authAttemptsConfig = Config.get('/authAttempts');
        const authSpam = [];
        const authRequest = function (cb) {

            AuthAttempt.create('127.0.0.1', 'stimpy', (err, result) => {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.object();

                cb();
            });
        };

        for (let i = 0; i < authAttemptsConfig.forIpAndUser; ++i) {
            authSpam.push(authRequest);
        }

        Async.parallel(authSpam, () => {

            AuthAttempt.abuseDetected('127.0.0.1', 'stimpy', (err, result) => {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.equal(true);

                done();
            });
        });
    });


    lab.test('it returns true when abuse is detected for an ip and multiple users', (done) => {

        const authAttemptsConfig = Config.get('/authAttempts');
        const authSpam = [];
        const authRequest = function (i, cb) {

            const randomUsername = 'mudskipper' + i;
            AuthAttempt.create('127.0.0.2', randomUsername, (err, result) => {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.object();

                cb();
            });
        };

        for (let i = 0; i < authAttemptsConfig.forIp; ++i) {
            authSpam.push(authRequest.bind(null, i));
        }

        Async.parallel(authSpam, () => {

            AuthAttempt.abuseDetected('127.0.0.2', 'yak', (err, result) => {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.equal(true);

                done();
            });
        });
    });


    lab.test('it returns an error when count fails', (done) => {

        const realCount = AuthAttempt.count;
        AuthAttempt.count = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('count failed'));
        };

        AuthAttempt.abuseDetected('127.0.0.1', 'toastman', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            AuthAttempt.count = realCount;

            done();
        });
    });
});
