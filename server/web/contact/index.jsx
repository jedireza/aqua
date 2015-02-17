var React = require('react/addons');
var Layout = require('../layouts/Default.jsx');


var Component = React.createClass({
    render: function () {

        var feet = <script src="/public/pages/contact.min.js"></script>;

        return (
            <Layout
                title="Contact us"
                feet={feet}
                activeTab="contact">

                <div className="row">
                    <div className="col-sm-6" id="app-mount"></div>
                    <div className="col-sm-6 text-center">
                        <h1 className="page-header">Contact us</h1>
                        <p className="lead">
                            Freddy can't wait to hear from you.
                        </p>
                        <i className="fa fa-reply-all bamf"></i>
                        <div>
                            1428 Elm Street &bull; San Francisco, CA 94122
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
});


module.exports = Component;
