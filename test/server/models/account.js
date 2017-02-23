'use strict';
const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const PrepareData = require('../../lab/prepare-data');


const lab = exports.lab = Lab.script();
let sequelize;
let Account;
let accountId;


lab.experiment('Account Class Methods', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                sequelize = db;
                Account = sequelize.models.Account;
            }
            done(err);
        });
    });

    lab.test('it returns a new instance when create succeeds', (done) => {

        Account.create({ first: 'Ren', middle: '', last: 'Höek' }).then( (account) => {

            Code.expect(account).to.be.an.instanceOf(Account.Instance);
            done();

        }, ( err ) => {

            done(err);
        });
    });

    lab.test('it correctly sets the middle name when create is called', (done) => {

        const name = Account.parseName('Stimpson J Cat');
        Account.create(name).then( (account) => {

            Code.expect(account.first).to.equal('Stimpson');
            Code.expect(account.middle).to.equal('J');
            Code.expect(account.last).to.equal('Cat');
            Code.expect(account).to.be.an.instanceOf(Account.Instance);
            accountId = account.id;
            done();

        }, ( err ) => {

            done(err);

        });
    });

    lab.test('it returns a result when finding by username', (done) => {

        Async.auto({
            account: function (cb) {

                Account.findById(accountId).then( (account) => {

                    cb(null, account);
                }, ( err ) => {

                    cb(err);
                });
            },
            accountUpdated: ['account', function (results, cb) {

                results.account.update({
                    first: 'stimpy'
                }).then( ( account ) => {

                    cb(null, account);
                }, ( err ) => {

                    cb(err);
                });
            }]
        }, (err, results) => {

            if (err) {
                return done(err);
            }

            Account.findOne( { where : { first: 'stimpy' } } ). then( ( result ) => {

                Code.expect(result).to.be.an.instanceOf(Account.Instance);
                done();
            }, ( err ) => {

                done(err);
            });
        });
    });
});
