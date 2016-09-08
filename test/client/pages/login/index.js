'use strict';
const Code = require('code');
const CreateMemoryHistory = require('history/lib/createMemoryHistory');
const Lab = require('lab');
const Proxyquire = require('proxyquire');
const ReactDOM = require('react-dom');


const lab = exports.lab = Lab.script();
const TestLocation = CreateMemoryHistory();
const stub = {
    ReactRouter: {
        HistoryLocation: TestLocation
    }
};
const App = Proxyquire('../../../../client/pages/login/index.jsx', {
    'react-router': stub.ReactRouter
});
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


lab.experiment('Login App', () => {

    lab.test('it renders', (done) => {

        App.blastoff();

        Code.expect(App.mainElement).to.be.an.object();

        done();
    });
});
