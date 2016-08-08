'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const DetailsForm = require('./details-form.jsx');
const UserForm = require('./user-form');
const StatusForm = require('./status-form.jsx');
const NoteForm = require('./note-form.jsx');
const DeleteForm = require('./delete-form');
const AccountStore = require('../../stores/account');
const StatusStore = require('../../stores/status');
const Actions = require('../../actions/account');
const StatusActions = require('../../actions/status');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getInitialState () {

        AccountStore.resetDetails();
        AccountStore.resetUser();
        AccountStore.resetStatus();
        AccountStore.resetNote();
        AccountStore.resetDelete();
        StatusStore.resetResults();

        Actions.getDetails(this.props.params);
        StatusActions.getResults({ pivot: 'Account', limit: 99 });

        return {
            details: AccountStore.getDetails(),
            user: AccountStore.getUser(),
            status: AccountStore.getStatus(),
            note: AccountStore.getNote(),
            delete: AccountStore.getDelete(),
            statuses: StatusStore.getResults()
        };
    }

    componentDidMount () {

        AccountStore.addChangeListener(this.onStoreChange);
        StatusStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        AccountStore.removeChangeListener(this.onStoreChange);
        StatusStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState({
            details: AccountStore.getDetails(),
            user: AccountStore.getUser(),
            status: AccountStore.getStatus(),
            note: AccountStore.getNote(),
            delete: AccountStore.getDelete(),
            statuses: StatusStore.getResults()
        });
    }

    render () {

        if (this.state.details.hydrated && this.state.details.fetchFailure) {
            return (
                <section className="section-account-details container">
                    <h1 className="page-header">
                        <Link to="/admin/accounts">Accounts</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.details.error}
                    </div>
                </section>
            );
        }

        return (
            <section className="section-account-details container">
                <h1 className="page-header">
                    <Link to="/admin/accounts">Accounts</Link> / {this.state.details.name.first} {this.state.details.name.last}
                </h1>
                <div className="row">
                    <div className="col-sm-8">
                        <DetailsForm data={this.state.details} />
                        <UserForm
                            details={this.state.details}
                            data={this.state.user}
                        />
                        <DeleteForm
                            details={this.state.details}
                            data={this.state.delete}
                        />
                    </div>
                    <div className="col-sm-4">
                        <StatusForm
                            details={this.state.details}
                            data={this.state.status}
                            list={this.state.statuses}
                        />
                        <NoteForm
                            details={this.state.details}
                            data={this.state.note}
                        />
                    </div>
                </div>
            </section>
        );
    }
}


module.exports = Component;
