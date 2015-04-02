var Async = require('async');
var Lab = require('lab');
var Code = require('code');
var Config = require('../../../config');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var stub = {
    Account: {},
    Admin: {},
    bcrypt: {}
};
var User = Proxyquire('../../../server/models/user', {
    './account': stub.Account,
    './admin': stub.Admin,
    bcrypt: stub.bcrypt
});
var Admin = require('../../../server/models/admin');
var Account = require('../../../server/models/account');


lab.experiment('User Class Methods', function () {

    lab.before(function (done) {

        User.connect(Config.get('/hapiMongoModels/mongodb'), function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        User.deleteMany({}, function (err, count) {

            User.disconnect();

            done(err);
        });
    });


    lab.test('it creates a password hash combination', function (done) {

        User.generatePasswordHash('bighouseblues', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.object();
            Code.expect(result.password).to.be.a.string();
            Code.expect(result.hash).to.be.a.string();

            done();
        });
    });


    lab.test('it returns an error when password hash fails', function (done) {

        var realGenSalt = stub.bcrypt.genSalt;
        stub.bcrypt.genSalt = function (rounds, callback) {

            callback(Error('bcrypt failed'));
        };

        User.generatePasswordHash('bighouseblues', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            stub.bcrypt.genSalt = realGenSalt;

            done();
        });
    });


    lab.test('it returns a new instance when create succeeds', function (done) {

        User.create('ren', 'bighouseblues', 'ren@stimpy.show', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(User);

            done();
        });
    });


    lab.test('it returns an error when create fails', function (done) {

        var realInsertOne = User.insertOne;
        User.insertOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('insert failed'));
        };

        User.create('ren', 'bighouseblues', 'ren@stimpy.show', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            User.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by login', function (done) {

        Async.auto({
            user: function (cb) {

                User.create('stimpy', 'thebigshot', 'stimpy@ren.show', cb);
            },
            username: ['user', function (cb, results) {

                User.findByCredentials(results.user.username, results.user.password, cb);
            }],
            email: ['user', function (cb, results) {

                User.findByCredentials(results.user.email, results.user.password, cb);
            }]
        }, function (err, results) {

            Code.expect(err).to.not.exist();
            Code.expect(results.user).to.be.an.instanceOf(User);
            Code.expect(results.username).to.be.an.instanceOf(User);
            Code.expect(results.email).to.be.an.instanceOf(User);

            done();
        });
    });


    lab.test('it returns nothing for find by credentials when password match fails', function (done) {

        var realFindOne = User.findOne;
        User.findOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { username: 'toastman', password: 'letmein' });
        };

        var realCompare = stub.bcrypt.compare;
        stub.bcrypt.compare = function (key, source, callback) {

            callback(null, false);
        };

        User.findByCredentials('toastman', 'doorislocked', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            User.findOne = realFindOne;
            stub.bcrypt.compare = realCompare;

            done();
        });
    });


    lab.test('it returns early when finding by login misses', function (done) {

        var realFindOne = User.findOne;
        User.findOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback();
        };

        User.findByCredentials('stimpy', 'dog', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.not.exist();

            User.findOne = realFindOne;

            done();
        });
    });


    lab.test('it returns an error when finding by login fails', function (done) {

        var realFindOne = User.findOne;
        User.findOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('find one failed'));
        };

        User.findByCredentials('stimpy', 'dog', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            User.findOne = realFindOne;

            done();
        });
    });


    lab.test('it returns a result when finding by username', function (done) {

        Async.auto({
            user: function (cb) {

                User.create('horseman', 'eathay', 'horse@man.show', function (err, result) {

                    Code.expect(err).to.not.exist();
                    Code.expect(result).to.be.an.instanceOf(User);

                    cb(null, result);
                });
            }
        }, function (err, results) {

            if (err) {
                return done(err);
            }

            var username = results.user.username;

            User.findByUsername(username, function (err, result) {

                Code.expect(err).to.not.exist();
                Code.expect(result).to.be.an.instanceOf(User);

                done();
            });
        });
    });
});


lab.experiment('User Instance Methods', function () {

    lab.test('it returns false when roles are missing', function (done) {

        var user = new User({ username: 'ren' });

        Code.expect(user.canPlayRole('admin')).to.equal(false);

        done();
    });


    lab.test('it returns correctly for the specified role', function (done) {

        var user = new User({
            username: 'ren',
            roles: {
                account: { _id: '953P150D35' }
            }
        });

        Code.expect(user.canPlayRole('admin')).to.equal(false);
        Code.expect(user.canPlayRole('account')).to.equal(true);

        done();
    });


    lab.test('it exits early when hydrating roles where roles are missing', function (done) {

        var user = new User({ username: 'ren' });

        user.hydrateRoles(function (err) {

            Code.expect(err).to.not.exist();
            done();
        });
    });


    lab.test('it exits early when hydrating roles where hydrated roles exist', function (done) {

        var user = new User({
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

        user.hydrateRoles(function (err) {

            Code.expect(err).to.not.exist();

            done();
        });
    });


    lab.test('it returns an error when hydrating roles and find by id fails', function (done) {

        var realFindById = stub.Admin.findById;
        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        var user = new User({
            username: 'ren',
            roles: {
                admin: {
                    id: '953P150D35',
                    name: 'Ren Höek'
                }
            }
        });

        user.hydrateRoles(function (err) {

            Code.expect(err).to.be.an.object();

            stub.Admin.findById = realFindById;

            done();
        });
    });


    lab.test('it returns successful when hydrating roles', function (done) {

        var realAccountFindById = stub.Account.findById;
        stub.Admin.findById = function (id, callback) {

            callback(null, new Admin({
                _id: '953P150D35',
                name: {
                    first: 'Ren',
                    last: 'Höek'
                }
            }));
        };

        var realAdminFindById = stub.Admin.findById;
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

        var user = new User({
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

        user.hydrateRoles(function (err) {

            Code.expect(err).to.not.exist();

            stub.Account.findById = realAccountFindById;
            stub.Admin.findById = realAdminFindById;

            done();
        });
    });


    lab.test('it returns successful when hydrating roles where there are none defined', function (done) {

        var user = new User({
            username: 'ren',
            roles: {}
        });

        user.hydrateRoles(function (err) {

            Code.expect(err).to.not.exist();

            done();
        });
    });
});
