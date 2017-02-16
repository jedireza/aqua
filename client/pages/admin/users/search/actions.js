/* global window */
'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const ReactRouter = require('react-router');
const Store = require('./store');


class Actions {
    static getResults(data) {

        ApiActions.get(
            '/api/users',
            data,
            Store,
            Constants.GET_RESULTS,
            Constants.GET_RESULTS_RESPONSE
        );
    }
    /*
    static getSqlResults(data) {
        ApiActions.get(
            '/api/sqlusers',
            data,
            Store,
            Constants.GET_SQL_RESULTS,
            Constants.GET_SQL_RESULTS_RESPONSE
        );
    }*/


    static changeSearchQuery(data) {

        ReactRouter.browserHistory.push({
            pathname: '/admin/users',
            query: data
        });

        window.scrollTo(0, 0);
    }

    static showCreateNew(data) {

        Store.dispatch({
            type: Constants.SHOW_CREATE_NEW
        });
    }

    static hideCreateNew(data) {

        Store.dispatch({
            type: Constants.HIDE_CREATE_NEW
        });
    }

    static createNew(data) {

        ApiActions.post(
            '/api/users',
            data,
            Store,
            Constants.CREATE_NEW,
            Constants.CREATE_NEW_RESPONSE,
            (err, response) => {

                if (!err) {
                    this.hideCreateNew();

                    const path = `/admin/users/${response.id}`;

                    ReactRouter.browserHistory.push(path);

                    window.scrollTo(0, 0);
                }
            }
        );
    }
}


module.exports = Actions;
