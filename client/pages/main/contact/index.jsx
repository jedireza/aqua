'use strict';
const Form = require('./form.jsx');
const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class ContactPage extends React.Component {
    render() {

        return (
            <section className="section-contact container">
                <Helmet>
                    <title>Contact us</title>
                </Helmet>
                <div className="row">
                    <div className="col-sm-6">
                        <Form />
                    </div>
                    <div className="col-sm-6 text-center">
                        <h1 className="page-header">Contact us</h1>
                        <p className="lead">
                            Freddy can’t wait to hear from you.
                        </p>
                        <i className="fa fa-reply-all bamf"></i>
                        <div>
                            1428 Elm Street &bull; San Francisco, CA 94122
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = ContactPage;
