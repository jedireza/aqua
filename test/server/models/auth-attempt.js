'use strict';
const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const Config = require('../../../config');
const PrepareData = require('../../lab/prepare-data');


const lab = exports.lab = Lab.script();
let sequelize;
let AuthAttempt;

lab.experiment('AuthAttempt Class Methods', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                sequelize = db;
                AuthAttempt = sequelize.models.AuthAttempt;
            }
            done(err);
        });
    });

    lab.test('it returns a new instance when create succeeds', (done) => {

        AuthAttempt.create( { ip: '127.0.0.1', username: 'ren' } ).then(( result ) => {

            Code.expect(result).to.be.an.instanceOf(AuthAttempt.Instance);
            done();

        }, (err) => {

            Code.expect(err).to.not.exist();
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

            AuthAttempt.create({ ip: '127.0.0.1', username: 'stimpy' }).then( (result) => {

                Code.expect(result).to.be.an.object();
                cb();
            }, (err) => {

                Code.expect(err).to.not.exist();
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
            AuthAttempt.create({ ip: '127.0.0.2', username: randomUsername }).then( (result) => {

                Code.expect(result).to.be.an.object();
                cb();
            }, (err) => {

                Code.expect(err).to.not.exist();
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

            return new Promise( (resolve, reject) => {

                reject(Error('count failed'));
            });
        };

        AuthAttempt.abuseDetected('127.0.0.1', 'toastman', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            AuthAttempt.count = realCount;

            done();
        });
    });
});
