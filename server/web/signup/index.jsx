'use strict';
const Layout = require('../layouts/default.jsx');
const React = require('react');


class SignupPage extends React.Component {
    render() {

        const feet = <script src="/public/pages/signup.min.js"></script>;

        return (
            <Layout
                title="Sign up"
                feet={feet}
                activeTab="signup">

                <div className="row">
                    <div className="col-sm-6" id="app-mount"></div>
                    <div className="col-sm-6 text-center">
                        <h1 className="page-header">Campy benefits</h1>
                        <p className="lead">
                            Really, you will love it inside. It's super great!
                        </p>
                        <i className="fa fa-thumbs-o-up bamf"></i>
                    </div>
                </div>
            </Layout>
        );
    }
}


module.exports = SignupPage;
