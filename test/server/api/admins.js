var Lab = require('lab');
var Code = require('code');
var Path = require('path');
var Config = require('../../../config');
var Manifest = require('../../../manifest');
var Hapi = require('hapi');
var HapiAuth = require('hapi-auth-cookie');
var Proxyquire = require('proxyquire');
var AuthPlugin = require('../../../server/auth');
var AdminPlugin = require('../../../server/api/admins');
var AuthenticatedUser = require('../fixtures/credentials-admin');


var lab = exports.lab = Lab.script();
var ModelsPlugin, request, server, stub;


lab.before(function (done) {

    stub = {
        Admin: {},
        User: {}
    };


    var proxy = {};
    proxy[Path.join(process.cwd(), './server/models/admin')] = stub.Admin;
    proxy[Path.join(process.cwd(), './server/models/user')] = stub.User;

    ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/plugins')['hapi-mongo-models']
    };

    var plugins = [HapiAuth, ModelsPlugin, AuthPlugin, AdminPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, function (err) {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.after(function (done) {

    server.plugins['hapi-mongo-models'].BaseModel.disconnect();
    done();
});


lab.experiment('Admins Plugin Result List', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/admins',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when paged find fails', function (done) {

        stub.Admin.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an array of documents successfully', function (done) {

        stub.Admin.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an array of documents successfully using filters', function (done) {

        stub.Admin.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url = '/admins?username=stimpy';

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Read', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/admins/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find by id fails', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Create', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'POST',
            url: '/admins',
            payload: {
                name: 'Toast Man'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when create fails', function (done) {

        stub.Admin.create = function (name, callback) {

            callback(Error('create failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it creates a document successfully', function (done) {

        stub.Admin.create = function (name, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Update', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/admins/93EP150D35',
            payload: {
                nameFirst: 'Ren',
                nameLast: 'Höek'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when find by id misses', function (done) {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, undefined);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Update Permissions', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/admins/93EP150D35/permissions',
            payload: {
                permissions: { SPACE_RACE: true }
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Update Groups', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/admins/93EP150D35/groups',
            payload: {
                groups: { sales: 'Sales' }
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Link User', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/admins/93EP150D35/user',
            payload: {
                username: 'ren'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when (Admin) find by id fails', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (Admin) find by id misses', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns an error when (User) find by username fails', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback(Error('find by username failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns conflict when an admin role already exists', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            var user = {
                roles: {
                    admin: {
                        id: '535H0W35',
                        name: 'Stimpson J Cat'
                    }
                }
            };

            callback(null, user);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns conflict when the admin is linked to another user', function (done) {

        stub.Admin.findById = function (id, callback) {

            var admin = {
                _id: 'DUD3N0T1T',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, admin);
        };

        stub.User.findByUsername = function (id, callback) {

            var user = {
                _id: 'N0T1TDUD3',
                roles: {
                    admin: {
                        id: '93EP150D35',
                        name: 'Ren Höek'
                    }
                }
            };

            callback(null, user);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', function (done) {

        stub.Admin.findById = function (id, callback) {

            var admin = {
                _id: '93EP150D35',
                name: {
                    first: 'Ren',
                    last: 'Höek'
                }
            };

            callback(null, admin);
        };

        stub.User.findByUsername = function (id, callback) {

            var user = {
                _id: '535H0W35',
                username: 'ren'
            };

            callback(null, user);
        };

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfuly links an admin and user', function (done) {

        var admin = {
            _id: '93EP150D35',
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        };
        var user = {
            _id: '535H0W35',
            username: 'ren',
            roles: {}
        };

        stub.Admin.findById = function (id, callback) {

            callback(null, admin);
        };

        stub.User.findByUsername = function (id, callback) {

            callback(null, user);
        };

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, admin);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, user);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Admins Plugin Unlink User', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'DELETE',
            url: '/admins/93EP150D35/user',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when (Admin) find by id fails', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (Admin) find by id misses', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns early admin is void of a user', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns early admin is void of a user.id', function (done) {

        stub.Admin.findById = function (id, callback) {

            callback(null, { user: {} });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns an error when (User) find by id fails', function (done) {

        stub.Admin.findById = function (id, callback) {

            var admin = {
                user: {
                    id: '93EP150D35',
                    name: 'ren'
                }
            };

            callback(null, admin);
        };

        stub.User.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', function (done) {

        stub.Admin.findById = function (id, callback) {

            var admin = {
                user: {
                    id: '93EP150D35',
                    name: 'ren'
                }
            };

            callback(null, admin);
        };

        stub.User.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', function (done) {

        stub.Admin.findById = function (id, callback) {

            var admin = {
                _id: '93EP150D35',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, admin);
        };

        stub.User.findById = function (id, callback) {

            var user = {
                _id: '535H0W35',
                roles: {
                    admin: {
                        id: '93EP150D35',
                        name: 'Ren Höek'
                    }
                }
            };

            callback(null, user);
        };

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('find by id and update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully unlinks an admin from a user', function (done) {

        var user = {
            _id: '535H0W35',
            roles: {
                admin: {
                    id: '93EP150D35',
                    name: 'Ren Höek'
                }
            }
        };
        var admin = {
            _id: '93EP150D35',
            user: {
                id: '535H0W35',
                name: 'ren'
            }
        };

        stub.Admin.findById = function (id, callback) {

            callback(null, admin);
        };

        stub.User.findById = function (id, callback) {

            callback(null, user);
        };

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, admin);
        };

        stub.User.findByIdAndUpdate = function (id, update, callback) {

            callback(null, user);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Admins Plugin Delete', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'DELETE',
            url: '/admins/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', function (done) {

        stub.Admin.findByIdAndDelete = function (id, callback) {

            callback(Error('delete by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', function (done) {

        stub.Admin.findByIdAndDelete = function (id, callback) {

            callback(null, undefined);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it deletes a document successfully', function (done) {

        stub.Admin.findByIdAndDelete = function (id, callback) {

            callback(null, 1);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
