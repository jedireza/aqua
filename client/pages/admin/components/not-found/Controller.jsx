var React = require('react/addons');
var ReactRouter = require('react-router');


var Link = ReactRouter.Link;


var Component = React.createClass({
    render: function () {

        return (
            <section className="section-not-found container">
                <h1 className="page-header">Not Found</h1>
                <p>That route didn't match any handlers.</p>
                <Link to="home">Go to home screen</Link>
            </section>
        );
    }
});


module.exports = Component;
