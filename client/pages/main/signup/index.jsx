'use strict';
const Form = require('./form.jsx');
const React = require('react');
const ReactHelmet = require('react-helmet');


const Helmet = ReactHelmet.Helmet;


class SignupPage extends React.Component {
    render() {

        return (
            <section className="section-home container">
                <Helmet>
                    <title>Sign up</title>
                </Helmet>
                <div className="row">
                    <div className="col-sm-6">
                        <Form />
                    </div>
                    <div className="col-sm-6 text-center">
                        <h1 className="page-header">Campy benefits</h1>
                        <p className="lead">
                            Really, you will love it inside. It’s super great!
                        </p>
                        <i className="fa fa-thumbs-o-up bamf"></i>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = SignupPage;
