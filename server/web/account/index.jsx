var React = require('react/addons');
var Layout = require('../layouts/Plain.jsx');


var Component = React.createClass({
    render: function () {

        var neck = [
            <link key="layout" rel="stylesheet" href="/public/layouts/default.min.css" />,
            <link key="page" rel="stylesheet" href="/public/pages/account.min.css" />
        ];
        var feet = <script src="/public/pages/account.min.js"></script>;

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
