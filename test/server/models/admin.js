'use strict';
const Admin = require('../../../server/models/admin');
const AdminGroup = require('../../../server/models/admin-group');
const Code = require('code');
const Config = require('../../../config');
const Fixtures = require('../fixtures');
const Lab = require('lab');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
const config = Config.get('/hapiMongoModels/mongodb');


lab.experiment('Admin Model', () => {

    lab.before(async () => {

        await Admin.connect(config.connection, config.options);
        await Fixtures.Db.removeAllData();
    });


    lab.after(async () => {

        await Fixtures.Db.removeAllData();

        Admin.disconnect();
    });


    lab.test('it parses names into name fields', () => {

        const justFirst = Admin.nameAdapter('Steve');

        Code.expect(justFirst).to.be.an.object();
        Code.expect(justFirst.first).to.equal('Steve');
        Code.expect(justFirst.middle).to.equal('');
        Code.expect(justFirst.last).to.equal('');

        const firstAndLast = Admin.nameAdapter('Ren Höek');

        Code.expect(firstAndLast).to.be.an.object();
        Code.expect(firstAndLast.first).to.equal('Ren');
        Code.expect(firstAndLast.middle).to.equal('');
        Code.expect(firstAndLast.last).to.equal('Höek');

        const withMiddle = Admin.nameAdapter('Stimpson J Cat');

        Code.expect(withMiddle).to.be.an.object();
        Code.expect(withMiddle.first).to.equal('Stimpson');
        Code.expect(withMiddle.middle).to.equal('J');
        Code.expect(withMiddle.last).to.equal('Cat');
    });


    lab.test('it parses returns a full name', async () => {

        const admin = await Admin.create('Stan');
        let name = admin.fullName();

        Code.expect(name).to.equal('Stan');

        admin.name = Admin.nameAdapter('Ren Höek');

        name = admin.fullName();

        Code.expect(name).to.equal('Ren Höek');
    });


    lab.test('it returns a new instance when create succeeds', async () => {

        const admin = await Admin.create('Ren Höek');

        Code.expect(admin).to.be.an.instanceOf(Admin);
    });


    lab.test('it returns an instance when finding by username', async () => {

        const document = new Admin({
            name: Admin.nameAdapter('Stimpson J Cat'),
            user: {
                id: '95EP150D35',
                name: 'stimpy'
            }
        });

        await Admin.insertOne(document);

        const account = await Admin.findByUsername('stimpy');

        Code.expect(account).to.be.an.instanceOf(Admin);
    });


    lab.test('it returns false when checking for membership when groups are missing', async () => {

        const admin = await Admin.create('Ren Höek');

        Code.expect(admin.isMemberOf('sales')).to.equal(false);
    });


    lab.test('it returns false when permissions are missing', async () => {

        const admin = await Admin.create('Ren Höek');
        const hasPermission = await admin.hasPermissionTo('SPACE_MADNESS');

        Code.expect(hasPermission).to.equal(false);
    });


    lab.test('it returns boolean values when the permission exists on the admin', async () => {

        const admin = new Admin({
            name: Admin.nameAdapter('Ren Höek'),
            permissions: {
                SPACE_MADNESS: true,
                UNTAMED_WORLD: false
            }
        });
        const hasPermission = await admin.hasPermissionTo('SPACE_MADNESS');

        Code.expect(hasPermission).to.equal(true);
    });


    lab.test('it returns boolean values when permission exits on the admin group', async () => {

        // create groups

        const salesGroup = new AdminGroup({
            _id: 'sales',
            name: 'Sales',
            permissions: {
                UNTAMED_WORLD: false,
                WORLD_UNTAMED: true
            }
        });
        const supportGroup = new AdminGroup({
            _id: 'support',
            name: 'Support',
            permissions: {
                SPACE_MADNESS: true,
                MADNESS_SPACE: false
            }
        });

        await AdminGroup.insertMany([salesGroup, supportGroup]);

        // admin without group membership

        const documentA = new Admin({
            name: Admin.nameAdapter('Ren Höek')
        });
        const testA1 = await documentA.hasPermissionTo('SPACE_MADNESS');

        Code.expect(testA1).to.equal(false);

        const testA2 = await documentA.hasPermissionTo('UNTAMED_WORLD');

        Code.expect(testA2).to.equal(false);

        // admin with group membership

        const documentB = new Admin({
            name: Admin.nameAdapter('Ren B Höek'),
            groups: {
                sales: 'Sales',
                support: 'Support'
            }
        });

        const testB1 = await documentB.hasPermissionTo('SPACE_MADNESS');

        Code.expect(testB1).to.equal(true);

        const testB2 = await documentB.hasPermissionTo('UNTAMED_WORLD');

        Code.expect(testB2).to.equal(false);
    });


    lab.test('it links and unlinks users', async () => {

        let admin = await Admin.create('Guinea Pig');
        const user = await User.create('guineapig', 'wheel', 'wood@chips.gov');

        Code.expect(admin.user).to.not.exist();

        admin = await admin.linkUser(`${user._id}`, user.username);

        Code.expect(admin.user).to.be.an.object();

        admin = await admin.unlinkUser();

        Code.expect(admin.user).to.not.exist();
    });
});
