'use strict';
const Account = require('../../../server/models/account');
const Admin = require('../../../server/models/admin');
const AdminGroup = require('../../../server/models/admin-group');
const Session = require('../../../server/models/session');
const Status = require('../../../server/models/status');
const User = require('../../../server/models/user');


class Db {
    static async removeAllData() {

        return await Promise.all([
            Account.deleteMany({}),
            Admin.deleteMany({}),
            AdminGroup.deleteMany({}),
            Session.deleteMany({}),
            Status.deleteMany({}),
            User.deleteMany({})
        ]);
    }
}


module.exports = Db;
