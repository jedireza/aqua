'use strict';

const Joi = require('joi');
const Async = require('async');
const Bcrypt = require('bcrypt');
const ObjectAssign = require('object-assign');
const BaseModel = require('hapi-mongo-models').BaseModel;
const Account = require('./account');
const Admin = require('./admin');


const User = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);

        Object.defineProperty(this, '_roles', {
            writable: true,
            enumerable: false
        });
    },
    canPlayRole: function (role) {

        if (!this.roles) {
            return false;
        }

        return this.roles.hasOwnProperty(role);
    },
    hydrateRoles: function (callback) {

        if (!this.roles) {
            this._roles = {};
            return callback(null, this._roles);
        }

        if (this._roles) {
            return callback(null, this._roles);
        }

        const self = this;
        const tasks = {};

        if (this.roles.account) {
            tasks.account = function (done) {

                Account.findById(self.roles.account.id, done);
            };
        }

        if (this.roles.admin) {
            tasks.admin = function (done) {

                Admin.findById(self.roles.admin.id, done);
            };
        }

        Async.auto(tasks, (err, results) => {

            if (err) {
                return callback(err);
            }

            self._roles = results;

            callback(null, self._roles);
        });
    }
});


User._collection = 'users';


User.schema = Joi.object().keys({
    _id: Joi.object(),
    isActive: Joi.boolean().default(true),
    username: Joi.string().token().lowercase().required(),
    password: Joi.string(),
    email: Joi.string().email().lowercase().required(),
    roles: Joi.object().keys({
        admin: Joi.object().keys({
            id: Joi.string().required(),
            name: Joi.string().required()
        }),
        account: Joi.object().keys({
            id: Joi.string().required(),
            name: Joi.string().required()
        })
    }),
    resetPassword: Joi.object().keys({
        token: Joi.string().required(),
        expires: Joi.date().required()
    }),
    timeCreated: Joi.date()
});


User.indexes = [
    { key: { username: 1, unique: true } },
    { key: { email: 1, unique: true } }
];


User.generatePasswordHash = function (password, callback) {

    Async.auto({
        salt: function (done) {

            Bcrypt.genSalt(10, done);
        },
        hash: ['salt', function (results, done) {

            Bcrypt.hash(password, results.salt, done);
        }]
    }, (err, results) => {

        if (err) {
            return callback(err);
        }

        callback(null, {
            password: password,
            hash: results.hash
        });
    });
};

User.create = function (username, password, email, callback) {

    const self = this;

    Async.auto({
        passwordHash: this.generatePasswordHash.bind(this, password),
        newUser: ['passwordHash', function (results, done) {

            const document = {
                isActive: true,
                username: username.toLowerCase(),
                password: results.passwordHash.hash,
                email: email.toLowerCase(),
                timeCreated: new Date()
            };

            self.insertOne(document, done);
        }]
    }, (err, results) => {

        if (err) {
            return callback(err);
        }

        results.newUser[0].password = results.passwordHash.password;

        callback(null, results.newUser[0]);
    });
};


User.findByCredentials = function (username, password, callback) {

    const self = this;

    Async.auto({
        user: function (done) {

            const query = {
                isActive: true
            };

            if (username.indexOf('@') > -1) {
                query.email = username.toLowerCase();
            }
            else {
                query.username = username.toLowerCase();
            }

            self.findOne(query, done);
        },
        passwordMatch: ['user', function (results, done) {

            if (!results.user) {
                return done(null, false);
            }

            const source = results.user.password;
            Bcrypt.compare(password, source, done);
        }]
    }, (err, results) => {

        if (err) {
            return callback(err);
        }

        if (results.passwordMatch) {
            return callback(null, results.user);
        }

        callback();
    });
};


User.findByUsername = function (username, callback) {

    const query = { username: username.toLowerCase() };
    this.findOne(query, callback);
};


module.exports = User;
