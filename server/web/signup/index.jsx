var React = require('react/addons');
var Layout = require('../layouts/Default.jsx');


var Component = React.createClass({
    render: function () {

        var feet = <script src="/public/pages/signup.min.js"></script>;

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
});


module.exports = Component;
