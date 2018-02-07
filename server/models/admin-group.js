'use strict';
const Assert = require('assert');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Slug = require('slug');


const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    permissions: Joi.object().description('{ permission: boolean, ... }')
});


class AdminGroup extends MongoModels {
    static async create(name) {

        Assert.ok(name, 'Missing name argument.');

        const document = new this({
            _id: Slug(name).toLowerCase(),
            name
        });
        const groups = await this.insertOne(document);

        return groups[0];
    }

    hasPermissionTo(permission) {

        Assert.ok(permission, 'Missing permission argument.');

        if (this.permissions && this.permissions.hasOwnProperty(permission)) {
            return this.permissions[permission];
        }

        return false;
    }
}


AdminGroup._idClass = String;
AdminGroup.collectionName = 'adminGroups';
AdminGroup.schema = schema;


module.exports = AdminGroup;
