'use strict';

const React = require('react');
const Layout = require('../layouts/Default');


const Component = React.createClass({
    render: function () {

        const feet = <script src="/public/pages/login.min.js"></script>;

        return (
            <Layout
                title="Sign in"
                feet={feet}
                activeTab="login">

                <div className="row">
                    <div className="col-sm-6" id="app-mount"></div>
                </div>
            </Layout>
        );
    }
});


module.exports = Component;
