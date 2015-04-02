var Lab = require('lab');
var Code = require('code');
var ParseValidation = require('../../../client/helpers/parseValidation');


var lab = exports.lab = Lab.script();


lab.experiment('Parse Validation Helper', function () {

    lab.test('it handles no validation errors', function (done) {

        var result = ParseValidation(undefined, undefined);

        Code.expect(result.error).to.not.exist();
        Code.expect(result.hasError).to.be.an.object();
        Code.expect(Object.keys(result.hasError).length).to.equal(0);
        Code.expect(result.help).to.be.an.object();
        Code.expect(Object.keys(result.help).length).to.equal(0);

        done();
    });


    lab.test('it handles validation errors with keys', function (done) {

        var validation = {
            keys: ['name']
        };
        var message = 'name is required';
        var result = ParseValidation(validation, message);

        Code.expect(result.error).to.not.exist();
        Code.expect(result.hasError).to.be.an.object();
        Code.expect(result.hasError.name).to.equal(true);
        Code.expect(result.help).to.be.an.object();
        Code.expect(result.help.name).to.equal('name is required');

        done();
    });


    lab.test('it handles validation errors with keys (matching the because pattern)', function (done) {

        var validation = {
            keys: ['name']
        };
        var message = 'name failed because [name is required]';
        var result = ParseValidation(validation, message);

        Code.expect(result.error).to.not.exist();
        Code.expect(result.hasError).to.be.an.object();
        Code.expect(result.hasError.name).to.equal(true);
        Code.expect(result.help).to.be.an.object();
        Code.expect(result.help.name).to.equal('name is required');

        done();
    });


    lab.test('it handles validation errors without keys', function (done) {

        var validation = {};
        var message = 'something else happened';
        var result = ParseValidation(validation, message);

        Code.expect(result.error).to.equal('something else happened');
        Code.expect(result.hasError).to.be.an.object();
        Code.expect(Object.keys(result.hasError).length).to.equal(0);
        Code.expect(result.help).to.be.an.object();
        Code.expect(Object.keys(result.help).length).to.equal(0);

        done();
    });
});
