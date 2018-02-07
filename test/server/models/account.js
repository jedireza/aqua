'use strict';
const Account = require('../../../server/models/account');
const Code = require('code');
const Config = require('../../../config');
const Fixtures = require('../fixtures');
const Lab = require('lab');
const User = require('../../../server/models/user');


const lab = exports.lab = Lab.script();
const config = Config.get('/hapiMongoModels/mongodb');


lab.experiment('Account Model', () => {

    lab.before(async () => {

        await Account.connect(config.connection, config.options);
        await Fixtures.Db.removeAllData();
    });


    lab.after(async () => {

        await Fixtures.Db.removeAllData();

        Account.disconnect();
    });


    lab.test('it parses names into name fields', () => {

        const justFirst = Account.nameAdapter('Steve');

        Code.expect(justFirst).to.be.an.object();
        Code.expect(justFirst.first).to.equal('Steve');
        Code.expect(justFirst.middle).to.equal('');
        Code.expect(justFirst.last).to.equal('');

        const firstAndLast = Account.nameAdapter('Ren Höek');

        Code.expect(firstAndLast).to.be.an.object();
        Code.expect(firstAndLast.first).to.equal('Ren');
        Code.expect(firstAndLast.middle).to.equal('');
        Code.expect(firstAndLast.last).to.equal('Höek');

        const withMiddle = Account.nameAdapter('Stimpson J Cat');

        Code.expect(withMiddle).to.be.an.object();
        Code.expect(withMiddle.first).to.equal('Stimpson');
        Code.expect(withMiddle.middle).to.equal('J');
        Code.expect(withMiddle.last).to.equal('Cat');
    });


    lab.test('it parses returns a full name', async () => {

        const account = await Account.create('Stan');
        let name = account.fullName();

        Code.expect(name).to.equal('Stan');

        account.name = Account.nameAdapter('Ren Höek');

        name = account.fullName();

        Code.expect(name).to.equal('Ren Höek');
    });


    lab.test('it returns an instance when finding by username', async () => {

        const document = new Account({
            name: Account.nameAdapter('Stimpson J Cat'),
            user: {
                id: '95EP150D35',
                name: 'stimpy'
            }
        });

        await Account.insertOne(document);

        const account = await Account.findByUsername('stimpy');

        Code.expect(account).to.be.an.instanceOf(Account);
    });


    lab.test('it returns a new instance when create succeeds', async () => {

        const account = await Account.create('Ren Höek');

        Code.expect(account).to.be.an.instanceOf(Account);
    });


    lab.test('it links and unlinks users', async () => {

        let account = await Account.create('Guinea Pig');
        const user = await User.create('guineapig', 'wheel', 'wood@chips.gov');

        Code.expect(account.user).to.not.exist();

        account = await account.linkUser(`${user._id}`, user.username);

        Code.expect(account.user).to.be.an.object();

        account = await account.unlinkUser();

        Code.expect(account.user).to.not.exist();
    });
});
