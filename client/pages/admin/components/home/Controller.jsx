var React = require('react/addons');
var Moment = require('moment');


var Component = React.createClass({
    getInitialState: function () {

        return this.getThisMoment();
    },
    componentDidMount: function () {

        this.interval = setInterval(this.refreshTime, 1000);
    },
    componentWillUnmount: function () {

        clearInterval(this.interval);
    },
    refreshTime: function () {

        this.setState(this.getThisMoment());
    },
    getThisMoment: function () {

        var thisMoment = Moment();

        return {
            second: thisMoment.format('ss'),
            minute: thisMoment.format('mm'),
            hour: thisMoment.format('HH'),
            day: thisMoment.format('DD'),
            month: thisMoment.format('MM'),
            year: thisMoment.format('YYYY')
        };
    },
    render: function () {

        return (
            <section className="section-home container">
                <div className="row">
                    <div className="col-sm-7">
                        <h1 className="page-header">Admin</h1>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="well text-center">
                                    <div className="stat-value">
                                        {this.state.hour}
                                    </div>
                                    <div className="stat-label">hour</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="well text-center">
                                    <div className="stat-value">
                                        {this.state.minute}
                                    </div>
                                    <div className="stat-label">minute</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="well text-center">
                                    <div className="stat-value">
                                        {this.state.second}
                                    </div>
                                    <div className="stat-label">second</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="well text-center">
                                    <div className="stat-value">
                                        {this.state.year}
                                    </div>
                                    <div className="stat-label">year</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="well text-center">
                                    <div className="stat-value">
                                        {this.state.month}
                                    </div>
                                    <div className="stat-label">month</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="well text-center">
                                    <div className="stat-value">
                                        {this.state.day}
                                    </div>
                                    <div className="stat-label">day</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5">
                        <h1 className="page-header">Throttle guage</h1>
                        <div className="text-center">
                            <i className="fa fa-dashboard bamf"></i>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
});


module.exports = Component;
