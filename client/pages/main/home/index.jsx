'use strict';
const React = require('react');
const ReactHelmet = require('react-helmet');
const ReactRouter = require('react-router-dom');


const Helmet = ReactHelmet.Helmet;
const Link = ReactRouter.Link;


class HomePage extends React.Component {
    render() {

        return (
            <section className="section-home container">
                <Helmet>
                    <title>Aqua</title>
                </Helmet>
                <div className="jumbotron">
                    <h1>Success</h1>
                    <p className="lead">Your website and user system is ready.</p>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">About us</h3>
                            </div>
                            <div className="panel-body">
                                <p>
                                    Bicycle rights jean shorts la croix
                                    vexillologist hell of kitsch. Photo booth
                                    craft beer fixie raw denim hot chicken.
                                    Pickled adaptogen sartorial brooklyn tilde
                                    bay area.
                                </p>
                                <Link to="/about" className="btn btn-info btn-block">
                                    Learn more
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Sign up</h3>
                            </div>
                            <div className="panel-body">
                                <p>
                                    Health goth skateboard tousled umami, tofu
                                    squid organic freegan +1 keytar brunch
                                    post-ironic. Copper mug selfies tattooed
                                    chicharrones short ribs yolo cardigan.
                                </p>
                                <Link to="/signup" className="btn btn-success btn-block">
                                    Learn more
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Contact us</h3>
                            </div>
                            <div className="panel-body">
                                <p>
                                    Roof party readymade tote bag hot chicken
                                    blog. Fam readymade raclette hella quinoa.
                                    Cred pour-over yuccie williamsburg shabby
                                    chic ramps chartreuse messenger bag.
                                </p>
                                <Link to="/contact" className="btn btn-warning btn-block">
                                    Learn more
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = HomePage;
