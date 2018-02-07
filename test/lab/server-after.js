'use strict';
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('Server After Procedure', () => {

    lab.test('it cleans up those globals', () => {

        delete global['__core-js_shared__'];
    });
});
