'use strict';
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.test('it cleans up those globals', (done) => {

    global.window && global.window.close();

    delete global['__core-js_shared__'];
    delete global.document;
    delete global.window;
    delete global.navigator;
    delete global.errors;

    done();
});
