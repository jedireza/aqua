'use strict';
const Code = require('code');
const Lab = require('lab');
const StatusEntry = require('../../../server/models/status-entry');


const lab = exports.lab = Lab.script();


lab.experiment('Status Model', () => {

    lab.test('it instantiates an instance', () => {

        const statusEntry = new StatusEntry({
            id: 'account-happy',
            name: 'Happy',
            adminCreated: {
                id: '111111111111111111111111',
                name: 'Root Admin'
            }
        });

        Code.expect(statusEntry).to.be.an.instanceOf(StatusEntry);
    });
});
