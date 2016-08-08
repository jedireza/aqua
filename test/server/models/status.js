'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../config');
const Status = require('../../../server/models/status');


const lab = exports.lab = Lab.script();


lab.experiment('Status Class Methods', () => {

    lab.before((done) => {

        Status.connect(Config.get('/hapiMongoModels/mongodb'), (err, db) => {

            done(err);
        });
    });


    lab.after((done) => {

        Status.deleteMany({}, (err, count) => {

            Status.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', (done) => {

        Status.create('Order', 'Complete', (err, result) => {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(Status);

            done();
        });
    });


    lab.test('it returns an error when create fails', (done) => {

        const realInsertOne = Status.insertOne;
        Status.insertOne = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('insert failed'));
        };

        Status.create('Order', 'Fulfilled', (err, result) => {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            Status.insertOne = realInsertOne;

            done();
        });
    });
});
