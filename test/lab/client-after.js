'use strict';
const Lab = require('lab');


const lab = exports.lab = Lab.script();


lab.experiment('Client After Procedure', () => {

    lab.test('it cleans up those globals', () => {

        global.window && global.window.close();

        delete global['__core-js_shared__'];
        delete global.document;
        delete global.window;
        delete global.navigator;
        delete global.errors;
    });
});
