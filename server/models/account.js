var Joi = require('joi');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var StatusEntry = require('./status-entry');
var NoteEntry = require('./note-entry');


var Account = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    }
});


Account._collection = 'accounts';


Account.schema = Joi.object().keys({
    _id: Joi.object(),
    user: Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }),
    name: Joi.object().keys({
        first: Joi.string().required(),
        middle: Joi.string().allow(''),
        last: Joi.string().required()
    }),
    status: Joi.object().keys({
        current: StatusEntry.schema,
        log: Joi.array().items(StatusEntry.schema)
    }),
    notes: Joi.array().items(NoteEntry.schema),
    verification: Joi.object().keys({
        complete: Joi.boolean(),
        token: Joi.string()
    }),
    timeCreated: Joi.date()
});


Account.indexes = [
    [{ 'user.id': 1 }],
    [{ 'user.name': 1 }]
];


Account.create = function (name, callback) {

    var nameParts = name.trim().split(/\s/);

    var document = {
        name: {
            first: nameParts.shift(),
            middle: nameParts.length > 1 ? nameParts.shift() : undefined,
            last: nameParts.join(' ')
        },
        timeCreated: new Date()
    };

    this.insertOne(document, function (err, docs) {

        if (err) {
            return callback(err);
        }

        callback(null, docs[0]);
    });
};


Account.findByUsername = function (username, callback) {

    var query = { 'user.name': username.toLowerCase() };
    this.findOne(query, callback);
};


module.exports = Account;
