'use strict';

const React = require('react');
const ClassNames = require('classnames');


const Component = React.createClass({
    tabClass: function (tab) {

        return ClassNames({
            active: this.props.activeTab === tab
        });
    },
    render: function () {

        return (
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/">
                            <img
                                className="navbar-logo"
                                src="/public/media/logo-square.png"
                            />
                            <span className="navbar-brand-label">Aqua</span>
                        </a>
                    </div>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className={this.tabClass('home')}>
                                <a href="/">Home</a>
                            </li>
                            <li className={this.tabClass('about')}>
                                <a href="/about">About</a>
                            </li>
                            <li className={this.tabClass('signup')}>
                                <a href="/signup">Sign up</a>
                            </li>
                            <li className={this.tabClass('contact')}>
                                <a href="/contact">Contact</a>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className={this.tabClass('login')}>
                                <a href="/login">Sign in</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = Component;
