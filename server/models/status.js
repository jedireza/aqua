'use strict';
const BaseModel = require('hapi-mongo-models').BaseModel;
const Joi = require('joi');
const ObjectAssign = require('object-assign');
const Slug = require('slug');


const Status = BaseModel.extend({
    constructor: function (attrs) {

        ObjectAssign(this, attrs);
    }
});


Status._collection = 'statuses';


Status._idClass = String;


Status.schema = Joi.object().keys({
    _id: Joi.string(),
    pivot: Joi.string().required(),
    name: Joi.string().required()
});


Status.indexes = [
    { key: { pivot: 1 } },
    { key: { name: 1 } }
];


Status.create = function (pivot, name, callback) {

    const document = {
        _id: Slug(pivot + ' ' + name).toLowerCase(),
        pivot,
        name
    };

    this.insertOne(document, (err, docs) => {

        if (err) {
            return callback(err);
        }

        callback(null, docs[0]);
    });
};


module.exports = Status;
