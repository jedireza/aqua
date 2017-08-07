'use strict';
const React = require('react');
const ReactRouter = require('react-router-dom');
const AppUniversal = require('./app-universal.jsx');


const BrowserRouter = ReactRouter.BrowserRouter;


const App = (
    <BrowserRouter>
        <AppUniversal />
    </BrowserRouter>
);


module.exports = App;
