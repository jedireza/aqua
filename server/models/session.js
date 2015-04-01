var Joi = require('joi');
var Uuid = require('node-uuid');
var Async = require('async');
var Bcrypt = require('bcrypt');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;


var Session = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    }
});


Session._collection = 'sessions';


Session.schema = Joi.object().keys({
    _id: Joi.object(),
    userId: Joi.string().required(),
    key: Joi.string().required(),
    time: Joi.date().required()
});


Session.indexes = [
    [{ userId: 1 }]
];


Session.generateKeyHash = function (callback) {

    var key = Uuid.v4();

    Async.auto({
        salt: function (done) {

            Bcrypt.genSalt(10, done);
        },
        hash: ['salt', function (done, results) {

            Bcrypt.hash(key, results.salt, done);
        }]
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        callback(null, {
            key: key,
            hash: results.hash
        });
    });
};


Session.create = function (userId, callback) {

    var self = this;

    Async.auto({
        keyHash: this.generateKeyHash.bind(this),
        newSession: ['keyHash', function (done, results) {

            var document = {
                userId: userId,
                key: results.keyHash.hash,
                time: new Date()
            };

            self.insertOne(document, done);
        }],
        clean: ['newSession', function (done, results) {

            var query = {
                userId: userId,
                key: { $ne: results.keyHash.hash }
            };

            self.deleteOne(query, done);
        }]
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        results.newSession[0].key = results.keyHash.key;

        callback(null, results.newSession[0]);
    });
};


Session.findByCredentials = function (id, key, callback) {

    var self = this;

    Async.auto({
        session: function (done) {

            self.findById(id, done);
        },
        keyMatch: ['session', function (done, results) {

            if (!results.session) {
                return done(null, false);
            }

            var source = results.session.key;
            Bcrypt.compare(key, source, done);
        }]
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        if (results.keyMatch) {
            return callback(null, results.session);
        }

        callback();
    });
};


module.exports = Session;
