'use strict';
const Account = require('./account');
const Admin = require('./admin');
const Assert = require('assert');
const Bcrypt = require('bcrypt');
const Joi = require('joi');
const MongoModels = require('mongo-models');
const NewDate = require('joistick/new-date');


const schema = Joi.object({
    _id: Joi.object(),
    email: Joi.string().email().lowercase().required(),
    isActive: Joi.boolean().default(true),
    password: Joi.string(),
    resetPassword: Joi.object({
        token: Joi.string().required(),
        expires: Joi.date().required()
    }),
    roles: Joi.object({
        admin: Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required()
        }),
        account: Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required()
        })
    }).default(),
    timeCreated: Joi.date().default(NewDate(), 'time of creation'),
    username: Joi.string().token().lowercase().required()
});


class User extends MongoModels {
    static async create(username, password, email) {

        Assert.ok(username, 'Missing username argument.');
        Assert.ok(password, 'Missing password argument.');
        Assert.ok(email, 'Missing email argument.');

        const passwordHash = await this.generatePasswordHash(password);
        const document = new this({
            email,
            isActive: true,
            password: passwordHash.hash,
            username
        });
        const users = await this.insertOne(document);

        users[0].password = passwordHash.password;

        return users[0];
    }

    static async findByCredentials(username, password) {

        Assert.ok(username, 'Missing username argument.');
        Assert.ok(password, 'Missing password argument.');

        const query = { isActive: true };

        if (username.indexOf('@') > -1) {
            query.email = username.toLowerCase();
        }
        else {
            query.username = username.toLowerCase();
        }

        const user = await this.findOne(query);

        if (!user) {
            return;
        }

        const passwordMatch = await Bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return user;
        }
    }

    static findByEmail(email) {

        Assert.ok(email, 'Missing email argument.');

        const query = { email: email.toLowerCase() };

        return this.findOne(query);
    }

    static findByUsername(username) {

        Assert.ok(username, 'Missing username argument.');

        const query = { username: username.toLowerCase() };

        return this.findOne(query);
    }

    static async generatePasswordHash(password) {

        Assert.ok(password, 'Missing password argument.');

        const salt = await Bcrypt.genSalt(10);
        const hash = await Bcrypt.hash(password, salt);

        return { password, hash };
    }

    constructor(attrs) {

        super(attrs);

        Object.defineProperty(this, '_roles', {
            writable: true,
            enumerable: false
        });
    }

    canPlayRole(role) {

        Assert.ok(role, 'Missing role argument.');

        return this.roles.hasOwnProperty(role);
    }

    async hydrateRoles() {

        if (this._roles) {
            return this._roles;
        }

        this._roles = {};

        if (this.roles.account) {
            this._roles.account = await Account.findById(this.roles.account.id);
        }

        if (this.roles.admin) {
            this._roles.admin = await Admin.findById(this.roles.admin.id);
        }

        return this._roles;
    }

    async linkAccount(id, name) {

        Assert.ok(id, 'Missing id argument.');
        Assert.ok(name, 'Missing name argument.');

        const update = {
            $set: {
                'roles.account': { id, name }
            }
        };

        return await User.findByIdAndUpdate(this._id, update);
    }

    async linkAdmin(id, name) {

        Assert.ok(id, 'Missing id argument.');
        Assert.ok(name, 'Missing name argument.');

        const update = {
            $set: {
                'roles.admin': { id, name }
            }
        };

        return await User.findByIdAndUpdate(this._id, update);
    }

    async unlinkAccount() {

        const update = {
            $unset: {
                'roles.account': undefined
            }
        };

        return await User.findByIdAndUpdate(this._id, update);
    }

    async unlinkAdmin() {

        const update = {
            $unset: {
                'roles.admin': undefined
            }
        };

        return await User.findByIdAndUpdate(this._id, update);
    }
}


User.collectionName = 'users';
User.schema = schema;
User.indexes = [
    { key: { username: 1 }, unique: true },
    { key: { email: 1 }, unique: true }
];


module.exports = User;
