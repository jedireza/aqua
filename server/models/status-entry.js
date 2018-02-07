'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');


const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    timeCreated: Joi.date().default(NewDate(), 'time of creation'),
    adminCreated: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required()
    }).required()
});


class StatusEntry extends MongoModels {}


StatusEntry.schema = schema;


module.exports = StatusEntry;
