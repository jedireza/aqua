var Async = require('async');
var Lab = require('lab');
var Code = require('code');
var Config = require('../../../config');
var Proxyquire = require('proxyquire');


var lab = exports.lab = Lab.script();
var stub = {
    AdminGroup: {}
};
var Admin = Proxyquire('../../../server/models/admin', {
    './admin-group': stub.AdminGroup
});
var AdminGroup = require('../../../server/models/admin-group');


lab.experiment('Admin Class Methods', function () {

    lab.before(function (done) {

        Admin.connect(Config.get('/hapiMongoModels/mongodb'), function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        Admin.deleteMany({}, function (err, count) {

            Admin.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', function (done) {

        Admin.create('Ren Höek', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Admin);

            done();
        });
    });


    lab.test('it correctly sets the middle name when create is called', function (done) {

        Admin.create('Stimpson J Cat', function (err, admin) {

            Code.expect(err).to.not.exist();
            Code.expect(admin).to.be.an.instanceOf(Admin);
            Code.expect(admin.name.middle).to.equal('J');

            done();
        });
    });


    lab.test('it returns an error when create fails', function (done) {

        var realInsertOne = Admin.insertOne;
        Admin.insertOne = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('insert failed'));
        };

        Admin.create('Stimpy Cat', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Admin.insertOne = realInsertOne;

            done();
        });
    });


    lab.test('it returns a result when finding by username', function (done) {

        Async.auto({
            admin: function (cb) {

                Admin.create('Ren Höek', cb);
            },
            adminUpdated: ['admin', function (cb, results) {

                var fieldsToUpdate = {
                    $set: {
                        user: {
                            id: '95EP150D35',
                            name: 'ren'
                        }
                    }
                };

                Admin.findByIdAndUpdate(results.admin._id, fieldsToUpdate, cb);
            }]
        }, function (err, results) {

            if (err) {
                return done(err);
            }

            Admin.findByUsername('ren', function (err, admin) {

                Code.expect(err).to.not.exist();
                Code.expect(admin).to.be.an.instanceOf(Admin);

                done();
            });
        });
    });
});


lab.experiment('Admin Instance Methods', function () {

    lab.before(function (done) {

        Admin.connect(Config.get('/hapiMongoModels/mongodb'), function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        Admin.deleteMany({}, function (err, result) {

            Admin.disconnect();

            done(err);
        });
    });


    lab.test('it returns false when groups are not found', function (done) {

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        });

        Code.expect(admin.isMemberOf('sales')).to.equal(false);

        done();
    });


    lab.test('it returns boolean values for set group memberships', function (done) {

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales',
                support: 'Support'
            }
        });

        Code.expect(admin.isMemberOf('sales')).to.equal(true);
        Code.expect(admin.isMemberOf('support')).to.equal(true);

        done();
    });


    lab.test('it exits early when hydrating groups where groups are missing', function (done) {

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        });

        admin.hydrateGroups(function (err) {

            Code.expect(err).to.not.exist();

            done();
        });
    });


    lab.test('it exits early when hydrating groups where hydrated groups exist', function (done) {

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            },
            _groups: {
                sales: new AdminGroup({
                    _id: 'sales',
                    name: 'Sales',
                    permissions: {
                        SPACE_MADNESS: true,
                        UNTAMED_WORLD: false
                    }
                })
            }
        });

        admin.hydrateGroups(function (err) {

            Code.expect(err).to.not.exist();

            done();
        });
    });


    lab.test('it returns an error when hydrating groups and find by id fails', function (done) {

        var realFindById = stub.AdminGroup.findById;
        stub.AdminGroup.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            }
        });

        admin.hydrateGroups(function (err) {

            Code.expect(err).to.be.an.object();

            stub.AdminGroup.findById = realFindById;

            done();
        });
    });


    lab.test('it successfully hydrates groups', function (done) {

        var realFindById = stub.AdminGroup.findById;
        stub.AdminGroup.findById = function (id, callback) {

            var group = new AdminGroup({
                _id: 'sales',
                name: 'Sales',
                permissions: {
                    SPACE_MADNESS: true,
                    UNTAMED_WORLD: false
                }
            });

            callback(null, group);
        };

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            }
        });

        admin.hydrateGroups(function (err) {

            Code.expect(err).to.not.exist();

            stub.AdminGroup.findById = realFindById;

            done();
        });
    });


    lab.test('it exits early when the permission exists on the admin', function (done) {

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            permissions: {
                SPACE_MADNESS: true,
                UNTAMED_WORLD: false
            }
        });

        admin.hasPermissionTo('SPACE_MADNESS', function (err, permit) {

            Code.expect(err).to.not.exist();
            Code.expect(permit).to.equal(true);

            done();
        });
    });


    lab.test('it returns an error when checking permission and hydrating groups fails', function (done) {

        var realHydrateGroups = Admin.prototype.hydrateGroups;
        Admin.prototype.hydrateGroups = function (callback) {

            callback(Error('hydrate groups failed'));
        };

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales'
            }
        });

        admin.hasPermissionTo('SPACE_MADNESS', function (err) {

            Code.expect(err).to.be.an.object();

            Admin.prototype.hydrateGroups = realHydrateGroups;

            done();
        });
    });


    lab.test('it returns correct permission from hydrated group permissions', function (done) {

        var admin = new Admin({
            name: {
                first: 'Ren',
                last: 'Höek'
            },
            groups: {
                sales: 'Sales',
                support: 'Support'
            }
        });

        admin._groups = {
            sales: new AdminGroup({
                _id: 'sales',
                name: 'Sales',
                permissions: {
                    UNTAMED_WORLD: false,
                    WORLD_UNTAMED: true
                }
            }),
            support: new AdminGroup({
                _id: 'support',
                name: 'Support',
                permissions: {
                    SPACE_MADNESS: true,
                    MADNESS_SPACE: false
                }
            })
        };

        Async.auto({
            test1: function (cb) {

                admin.hasPermissionTo('SPACE_MADNESS', cb);
            },
            test2: function (cb) {

                admin.hasPermissionTo('UNTAMED_WORLD', cb);
            }
        }, function (err, results) {

            Code.expect(err).to.not.exist();
            Code.expect(results.test1).to.equal(true);
            Code.expect(results.test2).to.equal(false);

            done(err);
        });
    });
});
