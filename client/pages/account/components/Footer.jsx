var React = require('react/addons');


var Component = React.createClass({
    render: function () {

        return (
            <div className="footer">
                <div className="container">
                    <span className="copyright pull-right">
                        &#169; 2014 Acme, Inc.
                    </span>
                    <ul className="links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/login/logout">Sign out</a></li>
                    </ul>
                </div>
            </div>
        );
    }
});


module.exports = Component;
