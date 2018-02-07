'use strict';
const Account = require('../../../server/models/account');
const Admin = require('../../../server/models/admin');
const Session = require('../../../server/models/session');
const Slug = require('slug');
const User = require('../../../server/models/user');


class Credentials {
    static authHeader(username, password) {

        const combo = `${username}:${password}`;
        const combo64 = (new Buffer(combo)).toString('base64');

        return `Basic ${combo64}`;
    }

    static async createRootAdminUser() {

        let [admin, user, session] = await Promise.all([
            Admin.create('Root Admin'),
            User.create('root', 'root', 'root@stimpy.show'),
            undefined
        ]);
        const adminUpdate = {
            $set: {
                groups: {
                    root: 'Root'
                },
                user: {
                    id: `${user._id}`,
                    name: 'root'
                }
            }
        };
        const userUpdate = {
            $set: {
                'roles.admin': {
                    id: `${admin._id}`,
                    name: 'Root Admin'
                }
            }
        };

        session = await Session.create(`${user._id}`, '127.0.0.1', 'Lab');

        [admin, user] = await Promise.all([
            Admin.findByIdAndUpdate(admin._id, adminUpdate),
            User.findByIdAndUpdate(user._id, userUpdate)
        ]);

        return {
            scope: Object.keys(user.roles),
            roles: { admin },
            user,
            session
        };
    }

    static async createAdminUser(name, username, password, email, groups = []) {

        let [admin, user, session] = await Promise.all([
            Admin.create(name),
            User.create(username, password, email),
            undefined
        ]);
        const adminUpdate = {
            $set: {
                groups: groups.reduce((accumulator, group) => {

                    accumulator[Slug(group).toLowerCase()] = group;

                    return accumulator;
                }, {}),
                user: {
                    id: `${user._id}`,
                    name: username
                }
            }
        };
        const userUpdate = {
            $set: {
                'roles.admin': {
                    id: `${admin._id}`,
                    name
                }
            }
        };

        session = await Session.create(`${user._id}`, '127.0.0.1', 'Lab');

        [admin, user] = await Promise.all([
            Admin.findByIdAndUpdate(admin._id, adminUpdate),
            User.findByIdAndUpdate(user._id, userUpdate)
        ]);

        return {
            scope: Object.keys(user.roles),
            roles: { admin },
            user,
            session
        };
    }

    static async createAccountUser(name, username, password, email) {

        let [account, user, session] = await Promise.all([
            Account.create(name),
            User.create(username, password, email),
            undefined
        ]);
        const adminUpdate = {
            $set: {
                user: {
                    id: `${user._id}`,
                    name: username
                }
            }
        };
        const userUpdate = {
            $set: {
                'roles.account': {
                    id: `${account._id}`,
                    name
                }
            }
        };

        session = await Session.create(`${user._id}`, '127.0.0.1', 'Lab');

        [account, user] = await Promise.all([
            Account.findByIdAndUpdate(account._id, adminUpdate),
            User.findByIdAndUpdate(user._id, userUpdate)
        ]);

        return {
            scope: Object.keys(user.roles),
            roles: { account },
            user,
            session
        };
    }
}


module.exports = Credentials;
