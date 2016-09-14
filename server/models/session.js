'use strict';
const Async = require('async');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Uuid = require('node-uuid');


class Session extends MongoModels {
    static generateKeyHash(callback) {

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
                key,
                hash: results.hash
            });
        });
    }

    static create(userId, callback) {

        const self = this;

        Async.auto({
            keyHash: this.generateKeyHash.bind(this),
            newSession: ['keyHash', function (results, done) {

                const document = {
                    userId,
                    key: results.keyHash.hash,
                    time: new Date()
                };

                self.insertOne(document, done);
            }],
            clean: ['newSession', function (results, done) {

                const query = {
                    userId,
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
    }

    static findByCredentials(id, key, callback) {

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
    }
}


Session.collection = 'sessions';


Session.schema = Joi.object().keys({
    _id: Joi.object(),
    userId: Joi.string().required(),
    key: Joi.string().required(),
    time: Joi.date().required()
});


Session.indexes = [
    { key: { userId: 1 } }
];


module.exports = Session;
