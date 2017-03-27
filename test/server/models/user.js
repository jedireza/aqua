'use strict';
const Async = require('async');
const Code = require('code');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const Sequelize = require('sequelize');
const PrepareData = require('../../lab/prepare-data');

const lab = exports.lab = Lab.script();
let Admin;
let User;
let Account;
let userCreate;
let adminFindOne;
let accountFindOne;

const stub = {
    bcrypt: {}
};
const UserConstructor = Proxyquire('../../../server/models/user', { bcrypt: stub.bcrypt });
const AdminConstructor = Proxyquire('../../../server/models/admin', { bcrypt: stub.bcrypt });
const AccountConstructor = Proxyquire('../../../server/models/account', { bcrypt: stub.bcrypt });

const user = {
    username: 'ren',
    password: 'bighouseblues',
    email: 'ren@stimpy.show',
    isActive: true
};

lab.experiment('User Class Methods', () => {

    lab.before((done) => {

        PrepareData( (err, db ) => {

            if ( !err ){
                User = UserConstructor(db, Sequelize.DataTypes);
                Account = AccountConstructor(db, Sequelize.DataTypes);
                Admin = AdminConstructor(db, Sequelize.DataTypes);
                userCreate = User.create;
                adminFindOne = Admin.findOne;
                accountFindOne = Account.findOne;
            }
            done(err);
        });
    });

    lab.test('it creates a password hash combination', (done) => {

        const user_a = User.build( user );

        User.generatePasswordHash(user_a, {}, (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();
            Code.expect(result.password).to.be.a.string();
            Code.expect(result.password_hash).to.be.a.string();

            done();
        });
    });

    lab.test('it returns an error when password hash fails', (done) => {

        const realGenSalt = stub.bcrypt.genSalt;
        stub.bcrypt.genSalt = function (rounds, callback) {

            callback(Error('bcrypt failed'));
        };

        const user_a = User.build( user );

        User.generatePasswordHash(user_a, {}, (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            stub.bcrypt.genSalt = realGenSalt;

            done();
        });
    });

    lab.test('it returns a new instance when create succeeds', (done) => {

        User.create(user).then((result) => {

            Code.expect(result).to.be.an.instanceOf(User.Instance);

            done();
        }, ( err ) => {

            Code.expect(err).to.not.exist();
            done(err);
        });
    });

    lab.test('it returns an error when create fails', (done) => {

        User.create = function (options) {

            return new Promise( (resolve, reject ) => {

                reject(Error('insert failed'));
            });
        };

        User.create(user).then((result) => {

            Code.expect(result).to.not.exist();
            User.create = userCreate;
            done();
        }, (err) => {

            Code.expect(err).to.be.an.object();
            User.create = userCreate;
            done();
        });
    });


    lab.test('it returns a result when finding by login', (done) => {

        Async.auto({
            username: function (cb) {

                User.findByCredentials(user.username, user.password, cb);
            },
            email: function (cb) {

                User.findByCredentials(user.email, user.password, cb);
            }
        }, (err, results) => {

            Code.expect(err).to.not.exist();
            Code.expect(results.username).to.be.an.instanceOf(User.Instance);
            Code.expect(results.email).to.be.an.instanceOf(User.Instance);

            done();
        });
    });

    lab.test('it returns nothing for find by credentials when password match fails', (done) => {

        const realCompare = stub.bcrypt.compare;
        stub.bcrypt.compare = function (key, source, callback) {

            callback(null, false);
        };

        User.findByCredentials(user.username, user.password, (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            stub.bcrypt.compare = realCompare;

            done();
        });
    });

    lab.test('it returns early when finding by login misses', (done) => {

        User.findByCredentials('stimpy', 'dog', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            done();
        });
    });

    lab.test('it returns an error when finding by login fails', (done) => {

        const realFindOne = User.findOne;
        User.findOne = function (options) {

            return new Promise( (resolve, reject ) => {

                reject(Error('find one failed'));
            });
        };

        User.findByCredentials('stimpy', 'dog', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            User.findOne = realFindOne;

            done();
        });
    });

});

lab.experiment('User Instance Methods', () => {

    let stmpyUser;
    lab.before((done) => {

        User.create( { username: 'stmpy', email: 'stmpy@ren.com', password: 'simple' }).then(
            ( result ) => {

                stmpyUser = result;
                done();
            },
            (err) => {

                done(err);
            }
        );
    });

    lab.test('it returns false when roles are missing', (done) => {

        Code.expect(stmpyUser.canPlayRole('admin')).to.equal(false);

        done();
    });


    lab.test('it returns correctly for the specified role', (done) => {

        stmpyUser.roles = { account: { id: '953P150D35' } };

        Code.expect(stmpyUser.canPlayRole('admin')).to.equal(false);
        Code.expect(stmpyUser.canPlayRole('account')).to.equal(true);

        delete user.roles;

        done();
    });


    lab.test('it exits early when hydrating roles where roles are missing', (done) => {

        stmpyUser.hydrateRoles((err, roles) => {

            Code.expect(err).to.not.exist();

            done();
        });
    });

    lab.test('it returns an error when hydrating roles and find by id fails', (done) => {

        Admin.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        stmpyUser.hydrateRoles((err) => {

            Code.expect(err).to.be.an.object();

            Admin.findOne = adminFindOne;

            done();
        });
    });


    lab.test('it returns successful when hydrating roles', (done) => {

        Admin.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve({ id: '953P150D35', first: 'Ren', last: 'Höek' });
            });
        };
        Account.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve({ id: '5250W35', first: 'Stimpson', middle: 'J', last: 'Cat' });
            });
        };

        stmpyUser.hydrateRoles((err) => {

            Code.expect(err).to.not.exist();

            Account.findOne = accountFindOne;
            Admin.findOne = adminFindOne;

            done();
        });
    });


    lab.test('it returns successful when hydrating roles where there are none defined', (done) => {

        const realRoles = stmpyUser.roles;
        stmpyUser.roles = {};

        stmpyUser.hydrateRoles((err, roles) => {

            Code.expect(err).to.not.exist();
            stmpyUser.roles = realRoles;

            done();
        });
    });
});
