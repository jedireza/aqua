'use strict';
const MongoModels = require('mongo-models');


const MakeMockModel = function () {

    const mock = {};

    Reflect.ownKeys(MongoModels).forEach((key) => {

        mock[key] = MongoModels[key];
    });

    return mock;
};


module.exports = MakeMockModel;
