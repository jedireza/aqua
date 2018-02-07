'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');


const schema = Joi.object({
    adminCreated: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required()
    }).required(),
    data: Joi.string().required(),
    timeCreated: Joi.date().default(NewDate(), 'time of creation')
});


class NoteEntry extends MongoModels {}


NoteEntry.schema = schema;


module.exports = NoteEntry;
