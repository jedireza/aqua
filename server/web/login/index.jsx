'use strict';
const Layout = require('../layouts/default.jsx');
const React = require('react');


class LoginPage extends React.Component {
    render() {

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
}


module.exports = LoginPage;
