'use strict';
const AdminPlugin = require('../../../server/api/admins');
const AuthPlugin = require('../../../server/auth');
const AuthenticatedUser = require('../fixtures/credentials-admin');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const MakeMockModel = require('../fixtures/make-mock-model');
const Manifest = require('../../../manifest');
const Path = require('path');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
let request;
let server;
let stub;


lab.before((done) => {

    stub = {
        Admin: MakeMockModel(),
        User: MakeMockModel()
    };

    const proxy = {};
    proxy[Path.join(process.cwd(), './server/models/admin')] = stub.Admin;
    proxy[Path.join(process.cwd(), './server/models/user')] = stub.User;

    const ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/registrations').filter((reg) => {

            if (reg.plugin &&
                reg.plugin.register &&
                reg.plugin.register === 'hapi-mongo-models') {

                return true;
            }

            return false;
        })[0].plugin.options
    };

    const plugins = [HapiAuth, ModelsPlugin, AuthPlugin, AdminPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.initialize(done);
    });
});


lab.after((done) => {

    server.plugins['hapi-mongo-models'].MongoModels.disconnect();
    done();
});


lab.experiment('Admins Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admins',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        stub.Admin.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an array of documents successfully', (done) => {

        stub.Admin.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        stub.Admin.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?username=ren';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admins/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Create', () => {

    lab.beforeEach((done) => {

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


    lab.test('it returns an error when create fails', (done) => {

        stub.Admin.create = function (name, callback) {

            callback(Error('create failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it creates a document successfully', (done) => {

        stub.Admin.create = function (name, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/admins/93EP150D35',
            payload: {
                name: {
                    first: 'Ren',
                    middle: '',
                    last: 'Höek'
                }
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when find by id misses', (done) => {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, undefined);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Update Permissions', () => {

    lab.beforeEach((done) => {

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


    lab.test('it returns an error when update fails', (done) => {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Update Groups', () => {

    lab.beforeEach((done) => {

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


    lab.test('it returns an error when update fails', (done) => {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        stub.Admin.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admins Plugin Link User', () => {

    lab.beforeEach((done) => {

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


    lab.test('it returns an error when (Admin) find by id fails', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (Admin) find by id misses', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns an error when (User) find by username fails', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback(Error('find by username failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns conflict when an admin role already exists', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        stub.User.findByUsername = function (id, callback) {

            const user = {
                roles: {
                    admin: {
                        id: '535H0W35',
                        name: 'Stimpson J Cat'
                    }
                }
            };

            callback(null, user);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns conflict when the admin is linked to another user', (done) => {

        stub.Admin.findById = function (id, callback) {

            const admin = {
                _id: 'DUD3N0T1T',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, admin);
        };

        stub.User.findByUsername = function (id, callback) {

            const user = {
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

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        stub.Admin.findById = function (id, callback) {

            const admin = {
                _id: '93EP150D35',
                name: {
                    first: 'Ren',
                    last: 'Höek'
                }
            };

            callback(null, admin);
        };

        stub.User.findByUsername = function (id, callback) {

            const user = {
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

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfuly links an admin and user', (done) => {

        const admin = {
            _id: '93EP150D35',
            name: {
                first: 'Ren',
                last: 'Höek'
            }
        };
        const user = {
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

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Admins Plugin Unlink User', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/admins/93EP150D35/user',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when (Admin) find by id fails', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (Admin) find by id misses', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns early admin is void of a user', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns early admin is void of a user.id', (done) => {

        stub.Admin.findById = function (id, callback) {

            callback(null, { user: {} });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });


    lab.test('it returns an error when (User) find by id fails', (done) => {

        stub.Admin.findById = function (id, callback) {

            const admin = {
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

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', (done) => {

        stub.Admin.findById = function (id, callback) {

            const admin = {
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

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        stub.Admin.findById = function (id, callback) {

            const admin = {
                _id: '93EP150D35',
                user: {
                    id: '535H0W35',
                    name: 'ren'
                }
            };

            callback(null, admin);
        };

        stub.User.findById = function (id, callback) {

            const user = {
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

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it successfully unlinks an admin from a user', (done) => {

        const user = {
            _id: '535H0W35',
            roles: {
                admin: {
                    id: '93EP150D35',
                    name: 'Ren Höek'
                }
            }
        };
        const admin = {
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

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


lab.experiment('Admins Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/admins/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        stub.Admin.findByIdAndDelete = function (id, callback) {

            callback(Error('delete by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        stub.Admin.findByIdAndDelete = function (id, callback) {

            callback(null, undefined);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        stub.Admin.findByIdAndDelete = function (id, callback) {

            callback(null, 1);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.success).to.be.true();

            done();
        });
    });
});
