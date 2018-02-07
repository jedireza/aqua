'use strict';
const Code = require('code');
const Config = require('../../config');
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('Config', () => {

    lab.test('it gets config data', () => {

        Code.expect(Config.get('/')).to.be.an.object();
    });


    lab.test('it gets config meta data', () => {

        Code.expect(Config.meta('/')).to.match(/this file configures the plot device/i);
    });
});
