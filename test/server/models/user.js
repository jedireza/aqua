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
    Account: {},
    Admin: {},
    bcrypt: {}
};
const User = Proxyquire('../../../server/models/user', {
    './account': stub.Account,
    './admin': stub.Admin,
    bcrypt: stub.bcrypt
});
const Admin = require('../../../server/models/admin');
const Account = require('../../../server/models/account');


lab.experiment('User Class Methods', () => {

    lab.before((done) => {

        User.connect(mongoUri, mongoOptions, (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        User.deleteMany({}, (err, count) => {

            User.disconnect();

            done(err);
        });
    });


    lab.test('it creates a password hash combination', (done) => {

        User.generatePasswordHash('bighouseblues', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();
            Code.expect(result.password).to.be.a.string();
            Code.expect(result.hash).to.be.a.string();

            done();
        });
    });


    lab.test('it returns an error when password hash fails', (done) => {

        const realGenSalt = stub.bcrypt.genSalt;
        stub.bcrypt.genSalt = function (rounds, callback) {

            callback(Error('bcrypt failed'));
        };

        User.generatePasswordHash('bighouseblues', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            stub.bcrypt.genSalt = realGenSalt;

            done();
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        User.create('ren', 'bighouseblues', 'ren@stimpy.show', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(User);

            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = User.insertOne;
        User.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        User.create('ren', 'bighouseblues', 'ren@stimpy.show', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            User.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by login', (done) => {

        Async.auto({
            user: function (cb) {

                User.create('stimpy', 'thebigshot', 'stimpy@ren.show', cb);
            },
            username: ['user', function (results, cb) {

                User.findByCredentials(results.user.username, results.user.password, cb);
            }],
            email: ['user', function (results, cb) {

                User.findByCredentials(results.user.email, results.user.password, cb);
            }]
        }, (err, results) => {

            Code.expect(err).to.not.exist();
            Code.expect(results.user).to.be.an.instanceOf(User);
            Code.expect(results.username).to.be.an.instanceOf(User);
            Code.expect(results.email).to.be.an.instanceOf(User);

            done();
        });
    });


    lab.test('it returns nothing for find by credentials when password match fails', (done) => {

        const realFindOne = User.findOne;
        User.findOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { username: 'toastman', password: 'letmein' });
        };

        const realCompare = stub.bcrypt.compare;
        stub.bcrypt.compare = function (key, source, callback) {

            callback(null, false);
        };

        User.findByCredentials('toastman', 'doorislocked', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            User.findOne = realFindOne;
            stub.bcrypt.compare = realCompare;

            done();
        });
    });


    lab.test('it returns early when finding by login misses', (done) => {

        const realFindOne = User.findOne;
        User.findOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback();
        };

        User.findByCredentials('stimpy', 'dog', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            User.findOne = realFindOne;

            done();
        });
    });


    lab.test('it returns an error when finding by login fails', (done) => {

        const realFindOne = User.findOne;
        User.findOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('find one failed'));
        };

        User.findByCredentials('stimpy', 'dog', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            User.findOne = realFindOne;

            done();
        });
    });


    lab.test('it returns a result when finding by username', (done) => {

        Async.auto({
            user: function (cb) {

                User.create('horseman', 'eathay', 'horse@man.show', (err, result) => {

                    Code.expect(err).to.not.exist();
                    Code.expect(result).to.be.an.instanceOf(User);

                    cb(null, result);
                });
            }
        }, (err, results) => {

            if (err) {
                return done(err);
            }

            const username = results.user.username;

            User.findByUsername(username, (err, result) => {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.instanceOf(User);

                done();
            });
        });
    });
});


lab.experiment('User Instance Methods', () => {

    lab.test('it returns false when roles are missing', (done) => {

        const user = new User({ username: 'ren' });

        Code.expect(user.canPlayRole('admin')).to.equal(false);

        done();
    });


    lab.test('it returns correctly for the specified role', (done) => {

        const user = new User({
            username: 'ren',
            roles: {
                account: { _id: '953P150D35' }
            }
        });

        Code.expect(user.canPlayRole('admin')).to.equal(false);
        Code.expect(user.canPlayRole('account')).to.equal(true);

        done();
    });


    lab.test('it exits early when hydrating roles where roles are missing', (done) => {

        const user = new User({ username: 'ren' });

        user.hydrateRoles((err) => {

            Code.expect(err).to.not.exist();

            done();
        });
    });


    lab.test('it exits early when hydrating roles where hydrated roles exist', (done) => {

        const user = new User({
            username: 'ren',
            roles: {
                admin: {
                    id: '953P150D35',
                    name: 'Ren Höek'
                }
            }
        });

        user._roles = {
            admin: {
                _id: '953P150D35',
                name: 'Ren Höek'
            }
        };

        user.hydrateRoles((err) => {

            Code.expect(err).to.not.exist();

            done();
        });
    });


    lab.test('it returns an error when hydrating roles and find by id fails', (done) => {

        const realFindById = stub.Admin.findById;
        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        const user = new User({
            username: 'ren',
            roles: {
                admin: {
                    id: '953P150D35',
                    name: 'Ren Höek'
                }
            }
        });

        user.hydrateRoles((err) => {

            Code.expect(err).to.be.an.object();

            stub.Admin.findById = realFindById;

            done();
        });
    });


    lab.test('it returns successful when hydrating roles', (done) => {

        const realAccountFindById = stub.Account.findById;
        stub.Admin.findById = function (id, callback) {

            callback(null, new Admin({
                _id: '953P150D35',
                name: {
                    first: 'Ren',
                    last: 'Höek'
                }
            }));
        };

        const realAdminFindById = stub.Admin.findById;
        stub.Account.findById = function (id, callback) {

            callback(null, new Account({
                _id: '5250W35',
                name: {
                    first: 'Stimpson',
                    middle: 'J',
                    last: 'Cat'
                }
            }));
        };

        const user = new User({
            username: 'ren',
            roles: {
                account: {
                    id: '5250W35',
                    name: 'Stimpson J Cat'
                },
                admin: {
                    id: '953P150D35',
                    name: 'Ren Höek'
                }
            }
        });

        user.hydrateRoles((err) => {

            Code.expect(err).to.not.exist();

            stub.Account.findById = realAccountFindById;
            stub.Admin.findById = realAdminFindById;

            done();
        });
    });


    lab.test('it returns successful when hydrating roles where there are none defined', (done) => {

        const user = new User({
            username: 'ren',
            roles: {}
        });

        user.hydrateRoles((err) => {

            Code.expect(err).to.not.exist();

            done();
        });
    });
});
