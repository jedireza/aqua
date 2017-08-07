'use strict';
const React = require('react');
const ReactRouter = require('react-router-dom');


const Route = ReactRouter.Route;


const RouteStatus = function (outerProps) {

    const inline = function (innerProps) {

        if (innerProps.staticContext) {
            innerProps.staticContext.code = outerProps.code;
        }

        return outerProps.children;
    };

    return (
        <Route render={inline} />
    );
};


module.exports = RouteStatus;
