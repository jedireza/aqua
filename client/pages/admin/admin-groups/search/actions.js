/* global window */
'use strict';
const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const ReactRouter = require('react-router');
const Store = require('./store');


class Actions {
    static getResults(data) {

        ApiActions.get(
            '/api/admin-groups',
            data,
            Store,
            Constants.GET_RESULTS,
            Constants.GET_RESULTS_RESPONSE
        );
    }

    static changeSearchQuery(data) {

        ReactRouter.browserHistory.push({
            pathname: '/admin/admin-groups',
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
            '/api/admin-groups',
            data,
            Store,
            Constants.CREATE_NEW,
            Constants.CREATE_NEW_RESPONSE,
            (err, response) => {

                if (!err) {
                    this.hideCreateNew();

                    ReactRouter.browserHistory.replace(window.location);
                }
            }
        );
    }
}


module.exports = Actions;
