'use strict';
const AuthPlugin = require('../../../server/auth');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const MailerPlugin = require('../../../server/mailer');
const SignupPlugin = require('../../../server/api/signup');
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

/*
todo: will need sql script with admin perms on the db to set up db name and user
learned that hapi-sequelize registration was missing next in the correct spot
probably can go through all api handlers and move the models out to the set up scope
instead of the handler scope
*/
const lab = exports.lab = Lab.script();
let request;
let server;
let db;
let Account;
let User;
let Session;
let userFindOne;
let userCreate;
let accountCreate;
let sessionCreateNew;


lab.before((done) => {

    Async.auto({
        prepareData: function (cb){

            PrepareData(cb);
        },
        runServer: ['prepareData', function (results, cb) {

            const plugins = [DBSetup, HapiAuth, AuthPlugin, MailerPlugin, SignupPlugin];
            server = new Hapi.Server();
            server.connection({ port: Config.get('/port/web') });
            server.register(plugins, (err) => {

                if (err) {
                    return cb(err);
                }

                db = server.plugins['hapi-sequelize'][Config.get('/db').database];
                Account = db.models.Account;
                User = db.models.User;
                Session = db.models.Session;
                userFindOne = User.findOne;
                userCreate = User.create;
                accountCreate = Account.create;
                sessionCreateNew = Session.createNew;
                server.initialize(cb);
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


lab.experiment('Signup Plugin', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/signup',
            payload: {
                name: 'Muddy Mudskipper',
                username: 'muddy',
                password: 'dirtandwater',
                email: 'mrmud@mudmail.mud'
            }
        };

        done();
    });
/*
    lab.test('it returns an error when find one fails for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });
    lab.test('it returns a conflict when find one hits for username check', (done) => {

        User.findOne = function (conditions) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.username) {
                    resolve({});
                }
                else {
                    reject(Error('find one failed'));
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;
            done();
        });
    });

    lab.test('it returns an error when find one fails for email check', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.email) {
                    reject(Error('find one failed'));
                }
                else {
                    resolve();
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns a conflict when find one hits for email check', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                if (conditions.where.email) {
                    resolve({});
                }
                else {
                    resolve({});
                }
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            User.findOne = userFindOne;
            done();
        });
    });


    lab.test('it returns an error if any critical setup step fails', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.create = function (username, password, email, callback) {

            return new Promise( (resolve, reject) => {

                reject(Error('create failed'));
            });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            User.findOne = userFindOne;
            User.create = userCreate;
            done();
        });
    });
*/

    lab.test('it finishes successfully (even if sending welcome email fails)', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.create = function (username, password, email) {

            return new Promise( (resolve, reject) => {

                resolve({ id: 'abc' });
            });
        };

        Account.create = function (name) {

            return new Promise( (resolve, reject) => {

                resolve({
                    setUser: function (user){

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve({});
                        });

                    }
                });
            });
        };


        const realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(new Error('Whoops.'));
        };

        Session.createNew = function (username, callback) {

            callback(null, {});
        };

        const realWarn = console.warn;
        console.warn = function () {

            console.warn = realWarn;
            done();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            User.findOne = userFindOne;
            User.create = userCreate;
            Account.create = accountCreate;
            Session.createNew = sessionCreateNew;

            server.plugins.mailer.sendEmail = realSendEmail;
        });
    });


    lab.test('it finishes successfully', (done) => {

        User.findOne = function (conditions, callback) {

            return new Promise( (resolve, reject) => {

                resolve();
            });
        };

        User.create = function (username, password, email) {

            return new Promise( (resolve, reject) => {

                resolve({ id: 'abc' });
            });
        };

        Account.create = function (name) {

            return new Promise( (resolve, reject) => {

                resolve({
                    setUser: function (user){

                        return new Promise( (inner_resolve, inner_reject) => {

                            inner_resolve({});
                        });

                    }
                });
            });
        };


        const realSendEmail = server.plugins.mailer.sendEmail;
        server.plugins.mailer.sendEmail = function (options, template, context, callback) {

            callback(null, {});
        };

        Session.createNew = function (username, callback) {

            callback(null, {});
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            User.findOne = userFindOne;
            User.create = userCreate;
            Account.create = accountCreate;
            Session.createNew = sessionCreateNew;

            server.plugins.mailer.sendEmail = realSendEmail;

            done();
        });
    });
/*    */
});
