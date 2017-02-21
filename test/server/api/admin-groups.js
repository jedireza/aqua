'use strict';
const AdminGroupsPlugin = require('../../../server/api/admin-groups');
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
        //is there a way to access the origianl function?
        //without loading ConfigOriginal
        return Config.get(key);
    }
};

const DBSetup = Proxyquire('../../../dbsetup', { './config' : stub });

const lab = exports.lab = Lab.script();
let request;
let server;
let adminCredentials;
let db;
let AdminGroup;
let AdminGroupPermissionEntry;
let adminGroupFindById;
let adminGroupCreate;
let adminGroupUpdate;
let adminGroupDestroy;
let adminGroupPermissionEntryDestroy;
let adminGroupPermissionEntryUpsert;
let adminGroupPermissionEntryFindAll;
let adminGroupPagedFind;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, AdminGroupsPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                AdminGroup = db.models.AdminGroup;
                AdminGroupPermissionEntry = db.models.AdminGroupPermissionEntry;
                adminGroupFindById = AdminGroup.findById;
                adminGroupCreate = AdminGroup.findCreate;
                adminGroupUpdate = AdminGroup.update;
                adminGroupDestroy = AdminGroup.destroy;
                adminGroupPermissionEntryDestroy = AdminGroupPermissionEntry.destroy;
                adminGroupPermissionEntryUpsert = AdminGroupPermissionEntry.upsert;
                adminGroupPermissionEntryFindAll = AdminGroupPermissionEntry.findAll;
                adminGroupPagedFind = AdminGroup.pagedFind;
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


lab.experiment('Admin Groups Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admin-groups',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        AdminGroup.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AdminGroup.pagedFind = adminGroupPagedFind;
            done();
        });

    });

    lab.test('it returns an array of documents successfully', (done) => {

        AdminGroup.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            AdminGroup.pagedFind = adminGroupPagedFind;

            done();
        });
    });


    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        AdminGroup.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?name=ren';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();
            AdminGroup.pagedFind = adminGroupPagedFind;

            done();
        });
    });

});

lab.experiment('Admin Groups Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/admin-groups/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        AdminGroup.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('find by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AdminGroup.findById = adminGroupFindById;
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        AdminGroup.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/Admin group not found/i);
            AdminGroup.findById = adminGroupFindById;

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        AdminGroup.findById = function (id, callback) {

            return new Promise( (resolve, reject) => {

                resolve({ id: '93EP150D35' });
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            AdminGroup.findById = adminGroupFindById;

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Create', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/admin-groups',
            payload: {
                name: 'Sales'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when create fails', (done) => {

        AdminGroup.create = function (name, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('create failed'));
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AdminGroup.create = adminGroupCreate;
            done();
        });
    });


    lab.test('it creates a document successfully', (done) => {

        AdminGroup.create = function (name, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            AdminGroup.create = adminGroupCreate;

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/admin-groups/sales',
            payload: {
                name: 'Salez'
            },
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        AdminGroup.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AdminGroup.update = adminGroupUpdate;
            done();
        });
    });


    lab.test('it returns not found when find by id misses', (done) => {

        AdminGroup.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            AdminGroup.update = adminGroupUpdate;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        AdminGroup.update = function (id, update, callback) {

            return new Promise( (resolve, reject) => {

                resolve({});
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            AdminGroup.update = adminGroupUpdate;

            done();
        });
    });
});

lab.experiment('Admin Groups Plugin Update Permissions', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/admin-groups/sales/permissions',
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

        AdminGroupPermissionEntry.destroy = function (options) {

            return new Promise( (resolve, reject ) => {

                reject(Error('update failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AdminGroupPermissionEntry.destroy = adminGroupPermissionEntryDestroy;
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        AdminGroupPermissionEntry.destroy = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve(2);
            });
        };
        AdminGroupPermissionEntry.upsert = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve({});
            });
        };
        AdminGroupPermissionEntry.findAll = function (options) {

            return new Promise( (resolve, reject ) => {

                resolve([{}]);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            AdminGroupPermissionEntry.destroy = adminGroupPermissionEntryDestroy;
            AdminGroupPermissionEntry.upsert = adminGroupPermissionEntryUpsert;
            AdminGroupPermissionEntry.findAll = adminGroupPermissionEntryFindAll;

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/admin-groups/93EP150D35',
            credentials: adminCredentials
        };

        done();
    });


    lab.test('it returns an error when delete by id fails', (done) => {

        AdminGroup.destroy = function (options) {

            return new Promise( (resolve, reject) => {

                reject(Error('delete by id failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            AdminGroup.destroy = adminGroupDestroy;
            done();
        });
    });


    lab.test('it returns a not found when delete by id misses', (done) => {

        AdminGroup.destroy = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(0);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/Admin Group not found/i);
            AdminGroup.destroy = adminGroupDestroy;

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        AdminGroup.destroy = function (options) {

            return new Promise( (resolve, reject) => {

                resolve(1);
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);
            AdminGroup.destroy = adminGroupDestroy;

            done();
        });
    });
});
