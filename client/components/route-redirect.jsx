'use strict';
const React = require('react');
const ReactRouter = require('react-router-dom');


const Redirect = ReactRouter.Redirect;
const Route = ReactRouter.Route;


const RouteRedirect = function (outerProps) {

    const inline = function (innerProps) {

        if (innerProps.staticContext) {
            innerProps.staticContext.code = outerProps.code;
        }

        return (
            <Redirect from={outerProps.from} to={outerProps.to}/>
        );
    };

    return (
        <Route render={inline}/>
    );
};


module.exports = RouteRedirect;
