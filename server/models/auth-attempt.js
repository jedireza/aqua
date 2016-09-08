'use strict';
const Joi = require('joi');
const Async = require('async');
const ObjectAssign = require('object-assign');
const BaseModel = require('hapi-mongo-models').BaseModel;
const Config = require('../../config');


const AuthAttempt = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    }
});


AuthAttempt._collection = 'authAttempts';


AuthAttempt.schema = Joi.object().keys({
    _id: Joi.object(),
    username: Joi.string().lowercase().required(),
    ip: Joi.string().required(),
    time: Joi.date().required()
});


AuthAttempt.indexes = [
    { key: { ip: 1, username: 1 } },
    { key: { username: 1 } }
];


AuthAttempt.create = function (ip, username, callback) {

    const document = {
        ip,
        username: username.toLowerCase(),
        time: new Date()
    };

    this.insertOne(document, (err, docs) => {

        if (err) {
            return callback(err);
        }

        callback(null, docs[0]);
    });
};


AuthAttempt.abuseDetected = function (ip, username, callback) {

    const self = this;

    Async.auto({
        abusiveIpCount: function (done) {

            const query = { ip };
            self.count(query, done);
        },
        abusiveIpUserCount: function (done) {

            const query = {
                ip,
                username: username.toLowerCase()
            };

            self.count(query, done);
        }
    }, (err, results) => {

        if (err) {
            return callback(err);
        }

        const authAttemptsConfig = Config.get('/authAttempts');
        const ipLimitReached = results.abusiveIpCount >= authAttemptsConfig.forIp;
        const ipUserLimitReached = results.abusiveIpUserCount >= authAttemptsConfig.forIpAndUser;

        callback(null, ipLimitReached || ipUserLimitReached);
    });
};


module.exports = AuthAttempt;
