'use strict';
const App = require('../../../../client/pages/account/index.jsx');
const Code = require('code');
const Lab = require('lab');
const ReactDOM = require('react-dom');


const lab = exports.lab = Lab.script();
let mountNode;


lab.before((done) => {

    mountNode = global.document.createElement('div');
    mountNode.id = 'app-mount';
    global.document.body.appendChild(mountNode);

    done();
});


lab.after((done) => {

    ReactDOM.unmountComponentAtNode(mountNode);
    global.document.body.removeChild(mountNode);
    delete global.window.app;

    done();
});


lab.experiment('Account App', () => {

    lab.test('it renders', (done) => {

        App.blastoff();

        Code.expect(App.mainElement).to.be.an.object();

        done();
    });
});
