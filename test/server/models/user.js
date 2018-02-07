'use strict';
const Account = require('../../../server/models/account');
const Admin = require('../../../server/models/admin');
const Code = require('code');
const Config = require('../../../config');
const Fixtures = require('../fixtures');
const Lab = require('lab');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
const config = Config.get('/hapiMongoModels/mongodb');


lab.experiment('User Model', () => {

    lab.before(async () => {

        await User.connect(config.connection, config.options);
        await Fixtures.Db.removeAllData();
    });


    lab.after(async () => {

        await Fixtures.Db.removeAllData();

        User.disconnect();
    });


    lab.test('it returns a new instance when create succeeds', async () => {

        const user = await User.create('ren', 'bighouseblues', 'ren@stimpy.show');

        Code.expect(user).to.be.an.instanceOf(User);
    });


    lab.test('it returns undefined when finding by credentials user misses', async () => {

        const user = await User.findByCredentials('steve', '123456');

        Code.expect(user).to.be.undefined();
    });


    lab.test('it returns undefined when finding by credentials user hits and password match misses', async () => {

        const user = await User.findByCredentials('ren', '123456');

        Code.expect(user).to.be.undefined();
    });


    lab.test('it returns an instance when finding by credentials user hits and password match hits', async () => {

        const withUsername = await User.findByCredentials('ren', 'bighouseblues');

        Code.expect(withUsername).to.be.an.instanceOf(User);

        const withEmail = await User.findByCredentials('ren@stimpy.show', 'bighouseblues');

        Code.expect(withEmail).to.be.an.instanceOf(User);
    });


    lab.test('it returns an instance when finding by email', async () => {

        const user = await User.findByEmail('ren@stimpy.show');

        Code.expect(user).to.be.an.instanceOf(User);
    });


    lab.test('it returns an instance when finding by username', async () => {

        const user = await User.findByUsername('ren');

        Code.expect(user).to.be.an.instanceOf(User);
    });


    lab.test('it creates a password hash combination', async () => {

        const password = '3l1t3f00&&b4r';
        const result = await User.generatePasswordHash(password);

        Code.expect(result).to.be.an.object();
        Code.expect(result.password).to.equal(password);
        Code.expect(result.hash).to.be.a.string();
    });


    lab.test('it returns boolean values when checking if a user can play roles', async () => {

        let user;

        user = await User.findByUsername('ren');
        user = await User.findByIdAndUpdate(user._id, {
            $set: {
                roles: {
                    account: {
                        id: '555555555555555555555555',
                        name: 'Ren Hoek'
                    }
                }
            }
        });

        Code.expect(user.canPlayRole('admin')).to.equal(false);
        Code.expect(user.canPlayRole('account')).to.equal(true);
    });


    lab.test('it hydrates roles when both admin and account are missing', async () => {

        let user;

        user = await User.findByUsername('ren');
        user = await User.findByIdAndUpdate(user._id, {
            $set: {
                roles: {}
            }
        });

        await user.hydrateRoles();

        Code.expect(user._roles).to.be.an.object();
        Code.expect(Object.keys(user._roles)).to.have.length(0);
    });


    lab.test('it hydrates roles when an account role is present', async () => {

        const account = await Account.create('Run Hoek');

        let user;

        user = await User.findByUsername('ren');
        user = await User.findByIdAndUpdate(user._id, {
            $set: {
                roles: {
                    account: {
                        id: `${account._id}`,
                        name: account.fullName()
                    }
                }
            }
        });

        await user.hydrateRoles();

        Code.expect(user._roles).to.be.an.object();
        Code.expect(Object.keys(user._roles)).to.have.length(1);
        Code.expect(user._roles.account).to.be.an.instanceOf(Account);
    });


    lab.test('it hydrates roles when an admin role is present', async () => {

        const admin = await Admin.create('Run Hoek');

        let user;

        user = await User.findByUsername('ren');
        user = await User.findByIdAndUpdate(user._id, {
            $set: {
                roles: {
                    admin: {
                        id: `${admin._id}`,
                        name: admin.fullName()
                    }
                }
            }
        });

        await user.hydrateRoles();

        Code.expect(user._roles).to.be.an.object();
        Code.expect(Object.keys(user._roles)).to.have.length(1);
        Code.expect(user._roles.admin).to.be.an.instanceOf(Admin);
    });


    lab.test('it links and unlinks roles', async () => {

        let user = await User.create('guineapig', 'wheel', 'wood@chips.gov');
        const [admin, account] = await Promise.all([
            Admin.create('Guinea Pig'),
            Account.create('Guinea Pig')
        ]);

        Code.expect(user.roles.admin).to.not.exist();
        Code.expect(user.roles.account).to.not.exist();

        user = await user.linkAdmin(`${admin._id}`, admin.fullName());
        user = await user.linkAccount(`${account._id}`, account.fullName());

        Code.expect(user.roles.admin).to.be.an.object();
        Code.expect(user.roles.account).to.be.an.object();

        user = await user.unlinkAdmin();
        user = await user.unlinkAccount();

        Code.expect(user.roles.admin).to.not.exist();
        Code.expect(user.roles.account).to.not.exist();
    });


    lab.test('it hydrates roles and caches the results for subsequent access', async () => {

        const user = await User.findByUsername('ren');

        await user.hydrateRoles();

        Code.expect(user._roles).to.be.an.object();
        Code.expect(Object.keys(user._roles)).to.have.length(1);
        Code.expect(user._roles.admin).to.be.an.instanceOf(Admin);

        const roles = await user.hydrateRoles();

        Code.expect(user._roles).to.equal(roles);
    });
});
