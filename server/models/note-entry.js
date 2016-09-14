'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');


class NoteEntry extends MongoModels {}


NoteEntry.schema = Joi.object().keys({
    data: Joi.string().required(),
    timeCreated: Joi.date().required(),
    userCreated: Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }).required()
});


module.exports = NoteEntry;
