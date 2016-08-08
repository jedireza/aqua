var Lab = require('lab');


var lab = exports.lab = Lab.script();


lab.after(function (done) {

    global.window.close();

    delete global.document;
    delete global.window;
    delete global.navigator;
    delete global.errors;
    done();
});
