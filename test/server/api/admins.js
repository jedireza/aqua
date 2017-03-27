'use strict';
const AdminPlugin = require('../../../server/api/admins');
const AuthPlugin = require('../../../server/auth');
const Credentials = require('../fixtures/credentials');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const Async = require('async');
const PrepareData = require('../../lab/prepare-data');
const Proxyquire = require('proxyquire');
const stub = {
    get: function (key){

        if ( key === '/db' ){
            key = '/db_test';
        }
        return Config.get(key);
    }
};

const DBSetup = Proxyquire('../../../dbsetup', { './config' : stub });

const lab = exports.lab = Lab.script();
let request;
let server;
let adminCredentials;
let db;
let Admin;
let User;
let AdminPermissionEntry;
let adminFindById;
let adminSetUser;
let adminPagedFind;
let userFindOne;
let adminCreate;
let adminUpdate;
let adminDestroy;
let adminPermissionEntryDestroy;
let adminPermissionEntryFindAll;
let adminPermissionEntryUpsert;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, AdminPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                Admin = db.models.Admin;
                AdminPermissionEntry = db.models.AdminPermissionEntry;
                User = db.models.User;
                adminFindById = Admin.findById;
                adminCreate = Admin.findCreate;
                adminUpdate = Admin.update;
                adminDestroy = Admin.destroy;
                adminSetUser = Admin.setUser;
                adminPermissionEntryFindAll = AdminPermissionEntry.findAll;
                adminPermissionEntryUpsert = AdminPermissionEntry.upsert;
                adminPermissionEntryDestroy = AdminPermissionEntry.destroy;
                userFindOne = User.findOne;
                server.initialize(cb);
            });
        }],
        adminUser: ['runServer', function (results, cb){

            Credentials( db, '00000000-0000-0000-0000-000000000000', ( err, iresults ) => {

                if ( err ){
                    cb(err);
                }
                adminCredentials = iresults;
                cb(null);
            });
        }]
    }, (err, results ) => {

        if ( err ){
            done(err);
        }
        else {
            done();
        }
    });
});

lab.after((done) => {

    done();
});


lab.experiment('Admins Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admins',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        Admin.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.pagedFind = adminPagedFind;
            done();
        });
    });


    lab.test('it returns an array of documents successfully', (done) => {

        Admin.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            Admin.pagedFind = adminPagedFind;

            done();
        });
    });


    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        Admin.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?username=ren';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            Admin.pagedFind = adminPagedFind;

            done();
        });
    });
});


lab.experiment('Admins Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admins/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.findById = adminFindById;
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/admin not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve( { id: '93EP150D35' });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Admin.findById = adminFindById;

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
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when create fails', (done) => {

        Admin.create = function (name, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('create failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.create = adminCreate;
            done();
        });
    });


    lab.test('it creates a document successfully', (done) => {

        Admin.create = function (name, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Admin.create = adminCreate;

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
                first: 'Ren',
                middle: '',
                last: 'Höek'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        Admin.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.update = adminUpdate;
            done();
        });
    });


    lab.test('it returns not found when find by id misses', (done) => {

        Admin.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Admin.update = adminUpdate;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        Admin.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Admin.update = adminUpdate;

            done();
        });
    });
});


lab.experiment('Admins Plugin Update Permissions', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/admins/93EP150D35/permissions',
            payload:{
                permissionEntries: [
                    {
                        active: true,
                        permission_id: 'abc'
                    },
                    {
                        active: true,
                        permission_id: 'def'
                    }
                ]
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        AdminPermissionEntry.destroy = function (options) {

            return new Promise( (resolve, reject ) => {

                reject(Error('update failed'));
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AdminPermissionEntry.destroy = adminPermissionEntryDestroy;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        AdminPermissionEntry.destroy = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve(2);
            });
        };
        AdminPermissionEntry.upsert = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve({});
            });
        };
        AdminPermissionEntry.findAll = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve([{}]);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            AdminPermissionEntry.destroy = adminPermissionEntryDestroy;
            AdminPermissionEntry.upsert = adminPermissionEntryUpsert;
            AdminPermissionEntry.findAll = adminPermissionEntryFindAll;

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
                groups: ['abc', 'def']
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        Admin.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.update = adminUpdate;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        Admin.findById = function (id) {

            return new Promise( ( resolve, reject ) => {

                resolve({
                    setAdminGroups: function (groups) {

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve([]);
                        });
                    }
                });

            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.array();
            Admin.findById = adminFindById;

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
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when (Admin) find by id fails', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.findById = adminFindById;

            done();
        });
    });

    lab.test('it returns not found when (Admin) find by id misses', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Admin.findById = adminFindById;
            done();
        });
    });

    lab.test('it returns an error when (User) find by username fails', (done) => {

        Admin.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );
            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by username failed'));
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.findById = adminFindById;
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns not found when (User) find by username misses', (done) => {

        Admin.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );

            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Admin.findById = adminFindById;
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns conflict when an admin role already exists', (done) => {

        Admin.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );

            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getAdmin: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve({});

                            });
                        }
                    }
                );
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            Admin.findById = adminFindById;
            User.findOne = userFindOne;
            done();
        });
    });

    lab.test('it returns conflict when the admin is linked to another user', (done) => {

        Admin.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve({});

                            });
                        }
                    }
                );
            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getAdmin: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            Admin.findById = adminFindById;
            User.findOne = userFindOne;
            done();
        });
    });

    lab.test('it returns an error when find by id and update fails', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '93EP150D35',
                        first: 'Ren',
                        last: 'Höek',
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        },
                        setUser: () => {

                            return new Promise( (inner_resolve, inner_reject) => {

                                inner_reject(Error('find by id and update failed'));
                            });

                        }

                    }
                );
            });
        };

        User.findOne = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '535H0W35',
                        username: 'ren',
                        getAdmin: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.findById = adminFindById;
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it successfuly links an admin and user', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '93EP150D35',
                        first: 'Ren',
                        last: 'Höek',
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        },
                        setUser: () => {

                            return new Promise( (inner_resolve, inner_reject) => {

                                inner_resolve({});
                            });
                        }
                    }
                );
            });
        };

        User.findOne = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        id: '535H0W35',
                        username: 'ren',
                        getAdmin: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();
                            });
                        }
                    }
                );
            });
        };
        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Admin.findById = adminFindById;
            User.findOne = userFindOne;
            done();
        });
    });
});


lab.experiment('Admins Plugin Unlink User', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/admins/93EP150D35/user',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when (Admin) find by id fails', (done) => {

        Admin.findById = function (id, options) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.findById = adminFindById;
            done();
        });
    });


    lab.test('it returns not found when (Admin) find by id misses', (done) => {

        Admin.findById = function (id) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Admin.findById = adminFindById;
            done();
        });
    });


    lab.test('it returns early admin is void of a user', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    setUser: function (user){

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve({});
                        });
                    },
                    getUser: function () {

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve();
                        });
                    }
                });
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Admin.findById = adminFindById;
            done();
        });
    });


    lab.test('it returns an error when find by id and update fails', (done) => {

        Admin.findById = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(
                    {
                        getUser: () => {

                            return new Promise( (inner_resolve, inner_reject ) => {

                                inner_resolve();

                            });
                        }
                    }
                );

            });
        };

        User.findOne = function (options) {

            return new Promise( (resolve, reject) => {

                resolve({
                    getAdmin: function () {

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve();
                        });
                    }
                });
            });
        };

        Admin.setUser = function (user) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id and update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.findById = adminFindById;
            User.findOne = userFindOne;
            Admin.setUser = adminSetUser;
            done();
        });
    });


    lab.test('it successfully unlinks an admin from a user', (done) => {

        Admin.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({
                    setUser: function (user){

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve();
                        });
                    },
                    getUser: function () {

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve({});
                        });
                    }
                });
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Admin.findById = adminFindById;
            done();
        });
    });
});


lab.experiment('Admins Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/admins/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        Admin.destroy = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                reject(Error('delete by id failed'));
            });

        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            Admin.destroy = adminDestroy;
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        Admin.destroy = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                resolve(0);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/admin not found/i);
            Admin.destroy = adminDestroy;

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        Admin.destroy = function (id, callback) {

            return new Promise( (resolve, reject ) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);
            Admin.destroy = adminDestroy;

            done();
        });
    });
});
