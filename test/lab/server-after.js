'use strict';
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.test('it cleans up those globals', (done) => {

    delete global['__core-js_shared__'];

    done();
});
