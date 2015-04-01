var Joi = require('joi');
var Async = require('async');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var Config = require('../../config');


var AuthAttempt = BaseModel.extend({
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
    [{ ip: 1, username: 1 }],
    [{ username: 1 }]
];


AuthAttempt.create = function (ip, username, callback) {

    var document = {
        ip: ip,
        username: username.toLowerCase(),
        time: new Date()
    };

    this.insertOne(document, function (err, docs) {

        if (err) {
            return callback(err);
        }

        callback(null, docs[0]);
    });
};


AuthAttempt.abuseDetected = function (ip, username, callback) {

    var self = this;

    Async.auto({
        abusiveIpCount: function (done) {

            var query = { ip: ip };
            self.count(query, done);
        },
        abusiveIpUserCount: function (done) {

            var query = {
                ip: ip,
                username: username.toLowerCase()
            };

            self.count(query, done);
        }
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        var authAttemptsConfig = Config.get('/authAttempts');
        var ipLimitReached = results.abusiveIpCount >= authAttemptsConfig.forIp;
        var ipUserLimitReached = results.abusiveIpUserCount >= authAttemptsConfig.forIpAndUser;

        callback(null, ipLimitReached || ipUserLimitReached);
    });
};


module.exports = AuthAttempt;
