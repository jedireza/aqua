'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const DetailsForm = require('./details-form.jsx');
const DeleteForm = require('./delete-form');
const StatusStore = require('../../stores/status');
const Actions = require('../../actions/status');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        StatusStore.resetDetails();
        StatusStore.resetDelete();

        Actions.getDetails(this.props.params);

        return {
            details: StatusStore.getDetails(),
            delete: StatusStore.getDelete()
        };
    }

    componentDidMount () {

        StatusStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        StatusStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState({
            details: StatusStore.getDetails(),
            delete: StatusStore.getDelete()
        });
    }

    render () {

        if (this.state.details.hydrated && this.state.details.fetchFailure) {
            return (
                <section className="section-status-details container">
                    <h1 className="page-header">
                        <Link to="/admin/statuses">Statuses</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.details.error}
                    </div>
                </section>
            );
        }

        return (
            <section className="section-status-details container">
                <h1 className="page-header">
                    <Link to="/admin/statuses">Statuses</Link> / {this.state.details.name}
                </h1>
                <div className="row">
                    <div className="col-sm-6">
                        <DetailsForm data={this.state.details} />
                        <DeleteForm
                            details={this.state.details}
                            data={this.state.delete}
                        />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = Component;
