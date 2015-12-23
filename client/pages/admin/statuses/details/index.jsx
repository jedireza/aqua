'use strict';
const Actions = require('./actions');
const DeleteForm = require('../../../../../client/components/admin/delete-form.jsx');
const DetailsForm = require('./details-form.jsx');
const React = require('react');
const ReactRouter = require('react-router');
const Store = require('./store');


const Link = ReactRouter.Link;
const propTypes = {
    params: React.PropTypes.object
};


class DetailsPage extends React.Component {
    constructor(props) {

        super(props);

        Actions.getDetails(this.props.params.id);

        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    render() {

        if (!this.state.details.hydrated) {
            return (
                <section className="container">
                    <h1 className="page-header">
                        <Link to="/admin/statuses">Statuses</Link> / loading...
                    </h1>
                </section>
            );
        }

        if (this.state.details.showFetchFailure) {
            return (
                <section className="container">
                    <h1 className="page-header">
                        <Link to="/admin/statuses">Statuses</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.details.error}
                    </div>
                </section>
            );
        }

        const id = this.state.details._id;
        const name = this.state.details.name;

        return (
            <section className="container">
                <h1 className="page-header">
                    <Link to="/admin/statuses">Statuses</Link> / {name}
                </h1>
                <div className="row">
                    <div className="col-sm-8">
                        <DetailsForm {...this.state.details} />
                        <DeleteForm
                            {...this.state.delete}
                            action={Actions.delete.bind(Actions, id)}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

DetailsPage.propTypes = propTypes;


module.exports = DetailsPage;
