var Joi = require('joi');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;


var StatusEntry = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    }
});


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
