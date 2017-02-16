'use strict';
const CreateNew = require('./reducers/create-new');
const Redux = require('redux');
const Results = require('./reducers/results');
const SqlResults = require('./reducers/sqlresults');


module.exports = Redux.createStore(
    Redux.combineReducers({
        createNew: CreateNew,
        results: Results,
        sqlResults: SqlResults
    })
);
