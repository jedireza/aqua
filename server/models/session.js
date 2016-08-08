'use strict';

const Joi = require('joi');
const Uuid = require('node-uuid');
const Async = require('async');
const Bcrypt = require('bcrypt');
const ObjectAssign = require('object-assign');
const BaseModel = require('hapi-mongo-models').BaseModel;


const Session = BaseModel.extend({
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
    { key: { userId: 1 } }
];


Session.generateKeyHash = function (callback) {

    const key = Uuid.v4();

    Async.auto({
        salt: function (done) {

            Bcrypt.genSalt(10, done);
        },
        hash: ['salt', function (results, done) {

            Bcrypt.hash(key, results.salt, done);
        }]
    }, (err, results) => {

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

    const self = this;

    Async.auto({
        keyHash: this.generateKeyHash.bind(this),
        newSession: ['keyHash', function (results, done) {

            const document = {
                userId: userId,
                key: results.keyHash.hash,
                time: new Date()
            };

            self.insertOne(document, done);
        }],
        clean: ['newSession', function (results, done) {

            const query = {
                userId: userId,
                key: { $ne: results.keyHash.hash }
            };

            self.deleteOne(query, done);
        }]
    }, (err, results) => {

        if (err) {
            return callback(err);
        }

        results.newSession[0].key = results.keyHash.key;

        callback(null, results.newSession[0]);
    });
};


Session.findByCredentials = function (id, key, callback) {

    const self = this;

    Async.auto({
        session: function (done) {

            self.findById(id, done);
        },
        keyMatch: ['session', function (results, done) {

            if (!results.session) {
                return done(null, false);
            }

            const source = results.session.key;
            Bcrypt.compare(key, source, done);
        }]
    }, (err, results) => {

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
