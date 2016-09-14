'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');


class StatusEntry extends MongoModels {}


StatusEntry.schema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    timeCreated: Joi.date().required(),
    userCreated: Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }).required()
});


module.exports = StatusEntry;
