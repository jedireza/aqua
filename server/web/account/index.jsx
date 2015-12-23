'use strict';

const React = require('react');
const Layout = require('../layouts/Plain');


const Component = React.createClass({
    render: function () {

        const neck = [
            <link key="layout" rel="stylesheet" href="/public/layouts/default.min.css" />,
            <link key="page" rel="stylesheet" href="/public/pages/account.min.css" />
        ];
        const feet = <script src="/public/pages/account.min.js"></script>;

        return (
            <Layout
                title="Account"
                neck={neck}
                feet={feet}>

                <div id="app-mount"></div>
            </Layout>
        );
    }
});


module.exports = Component;
