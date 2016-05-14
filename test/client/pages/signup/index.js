var React = require('react');
var ReactDOM = require('react-dom');
var Lab = require('lab');
var Code = require('code');
var App = require('../../../../client/pages/signup/index.jsx');


var lab = exports.lab = Lab.script();
var mountNode;


lab.before(function (done) {

    mountNode = global.document.createElement('div');
    mountNode.id = 'app-mount';
    global.document.body.appendChild(mountNode);

    done();
});


lab.after(function (done) {

    ReactDOM.unmountComponentAtNode(mountNode);
    global.document.body.removeChild(mountNode);
    delete global.window.app;

    done();
});


lab.experiment('Sign Up App', function () {

    lab.test('it renders normally', function (done) {

        App.blastoff();

        Code.expect(App.mainElement).to.be.an.object();
        done();
    });
});
