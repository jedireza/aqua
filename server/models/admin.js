'use strict';
const AdminGroup = require('./admin-group');
const Assert = require('assert');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');


const schema = Joi.object({
    _id: Joi.object(),
    groups: Joi.object().description('{ groupId: name, ... }').default(),
    name: Joi.object({
        first: Joi.string().required(),
        middle: Joi.string().allow(''),
        last: Joi.string().allow('')
    }),
    permissions: Joi.object().description('{ permission: boolean, ... }'),
    timeCreated: Joi.date().default(NewDate(), 'time of creation'),
    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    })
});


class Admin extends MongoModels {
    static async create(name) {

        Assert.ok(name, 'Missing name argument.');

        const document = new this({
            name: this.nameAdapter(name)
        });
        const admins = await this.insertOne(document);

        return admins[0];
    }

    static findByUsername(username) {

        Assert.ok(username, 'Missing username argument.');

        const query = { 'user.name': username.toLowerCase() };

        return this.findOne(query);
    }

    static nameAdapter(name) {

        Assert.ok(name, 'Missing name argument.');

        const nameParts = name.trim().split(/\s/);

        return {
            first: nameParts.shift(),
            middle: nameParts.length > 1 ? nameParts.shift() : '',
            last: nameParts.join(' ')
        };
    }

    constructor(attrs) {

        super(attrs);

        Object.defineProperty(this, '_groups', {
            writable: true,
            enumerable: false
        });
    }

    fullName() {

        return `${this.name.first} ${this.name.last}`.trim();
    }

    async hasPermissionTo(permission) {

        Assert.ok(permission, 'Missing permission argument.');

        if (this.permissions && this.permissions.hasOwnProperty(permission)) {
            return this.permissions[permission];
        }

        await this.hydrateGroups();

        let groupHasPermission = false;

        Object.keys(this._groups).forEach((group) => {

            if (this._groups[group].hasPermissionTo(permission)) {
                groupHasPermission = true;
            }
        });

        return groupHasPermission;
    }

    async hydrateGroups() {

        if (this._groups) {
            return this._groups;
        }

        this._groups = {};

        const groups = await AdminGroup.find({
            _id: {
                $in: Object.keys(this.groups)
            }
        });

        this._groups = groups.reduce((accumulator, group) => {

            accumulator[group._id] = group;

            return accumulator;
        }, {});

        return this._groups;
    }

    isMemberOf(group) {

        Assert.ok(group, 'Missing group argument.');

        return this.groups.hasOwnProperty(group);
    }

    async linkUser(id, name) {

        Assert.ok(id, 'Missing id argument.');
        Assert.ok(name, 'Missing name argument.');

        const update = {
            $set: {
                user: { id, name }
            }
        };

        return await Admin.findByIdAndUpdate(this._id, update);
    }

    async unlinkUser() {

        const update = {
            $unset: {
                user: undefined
            }
        };

        return await Admin.findByIdAndUpdate(this._id, update);
    }
}


Admin.collectionName = 'admins';
Admin.schema = schema;
Admin.indexes = [
    { key: { 'user.id': 1 } },
    { key: { 'user.name': 1 } }
];


module.exports = Admin;
