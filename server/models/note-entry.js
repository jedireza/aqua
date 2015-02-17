var Joi = require('joi');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;


var NoteEntry = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    }
});


NoteEntry.schema = Joi.object().keys({
    data: Joi.string().required(),
    timeCreated: Joi.date().required(),
    userCreated: Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }).required()
});


module.exports = NoteEntry;
