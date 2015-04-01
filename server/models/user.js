var Joi = require('joi');
var Async = require('async');
var Bcrypt = require('bcrypt');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var Account = require('./account');
var Admin = require('./admin');


var User = BaseModel.extend({
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

        var self = this;
        var tasks = {};

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

        Async.auto(tasks, function (err, results) {

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
    email: Joi.string().email().lowercase().required(),
    password: Joi.string(),
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
    [{ username: 1 }, { unique: true }],
    [{ email: 1 }, { unique: true }]
];


User.generatePasswordHash = function (password, callback) {

    Async.auto({
        salt: function (done) {

            Bcrypt.genSalt(10, done);
        },
        hash: ['salt', function (done, results) {

            Bcrypt.hash(password, results.salt, done);
        }]
    }, function (err, results) {

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

    var self = this;

    Async.auto({
        passwordHash: this.generatePasswordHash.bind(this, password),
        newUser: ['passwordHash', function (done, results) {

            var document = {
                isActive: true,
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: results.passwordHash.hash,
                timeCreated: new Date()
            };

            self.insertOne(document, done);
        }]
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        results.newUser[0].password = results.passwordHash.password;

        callback(null, results.newUser[0]);
    });
};


User.findByCredentials = function (username, password, callback) {

    var self = this;

    Async.auto({
        user: function (done) {

            var query = {
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
        passwordMatch: ['user', function (done, results) {

            if (!results.user) {
                return done(null, false);
            }

            var source = results.user.password;
            Bcrypt.compare(password, source, done);
        }]
    }, function (err, results) {

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

    var query = { username: username.toLowerCase() };
    this.findOne(query, callback);
};


module.exports = User;
