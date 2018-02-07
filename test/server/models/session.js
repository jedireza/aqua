'use strict';
const Code = require('code');
const Config = require('../../../config');
const Fixtures = require('../fixtures');
const Lab = require('lab');
const Session = require('../../../server/models/session');


const lab = exports.lab = Lab.script();
const config = Config.get('/hapiMongoModels/mongodb');


lab.experiment('Session Model', () => {

    lab.before(async () => {

        await Session.connect(config.connection, config.options);
        await Fixtures.Db.removeAllData();
    });


    lab.after(async () => {

        await Fixtures.Db.removeAllData();

        Session.disconnect();
    });


    lab.test('it returns a new instance when create succeeds', async () => {

        const session = await Session.create('ren', 'ip', 'userAgent');

        Code.expect(session).to.be.an.instanceOf(Session);
    });


    lab.test('it returns undefined when finding by credentials session misses', async () => {

        const id = '555555555555555555555555';
        const keyHash = await Session.generateKeyHash();
        const session = await Session.findByCredentials(id, keyHash.key);

        Code.expect(session).to.be.undefined();
    });


    lab.test('it returns undefined when finding by credentials session hits and key match misses', async () => {

        const userId = '000000000000000000000000';
        const ip = '127.0.0.1';
        const userAgent = [
            'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us)',
            ' AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
        ].join('');
        const session = await Session.create(userId, ip, userAgent);

        Code.expect(session).to.be.an.instanceOf(Session);

        const key = `${session.key}poison`;
        const result = await Session.findByCredentials(session._id, key);

        Code.expect(result).to.be.undefined();
    });


    lab.test('it returns a session instance when finding by credentials hits and key match hits', async () => {

        const userId = '000000000000000000000000';
        const ip = '127.0.0.1';
        const userAgent = [
            'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us)',
            ' AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
        ].join('');
        const session = await Session.create(userId, ip, userAgent);

        Code.expect(session).to.be.an.instanceOf(Session);

        const key = session.key;
        const result = await Session.findByCredentials(session._id, key);

        Code.expect(result).to.be.an.instanceOf(Session);
        Code.expect(session._id).to.equal(result._id);
    });


    lab.test('it creates a key hash combination', async () => {

        const result = await Session.generateKeyHash();

        Code.expect(result).to.be.an.object();
        Code.expect(result.key).to.be.a.string();
        Code.expect(result.hash).to.be.a.string();
    });


    lab.test('it updates the last active time of an instance', async () => {

        const userId = '000000000000000000000000';
        const ip = '127.0.0.1';
        const userAgent = [
            'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us)',
            ' AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
        ].join('');
        const session = await Session.create(userId, ip, userAgent);

        await session.updateLastActive();

        Code.expect(session.lastActive).to.be.a.date();
    });
});
