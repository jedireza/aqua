'use strict';
const Assert = require('assert');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Slug = require('slug');


const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    pivot: Joi.string().required()
});


class Status extends MongoModels {
    static async create(pivot, name) {

        Assert.ok(pivot, 'Missing pivot argument.');
        Assert.ok(name, 'Missing name argument.');

        const document = new this({
            _id: Slug(`${pivot}-${name}`).toLowerCase(),
            name,
            pivot
        });
        const statuses = await this.insertOne(document);

        return statuses[0];
    }
}


Status._idClass = String;
Status.collectionName = 'statuses';
Status.schema = schema;
Status.indexes = [
    { key: { pivot: 1 } },
    { key: { name: 1 } }
];


module.exports = Status;
