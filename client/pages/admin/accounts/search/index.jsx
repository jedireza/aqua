'use strict';
const Actions = require('./actions');
const CreateNewForm = require('./create-new-form.jsx');
const FilterForm = require('./filter-form.jsx');
const Paging = require('../../../../components/paging.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const Results = require('./results.jsx');
const Store = require('./store');
const Qs = require('qs');


const propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
};


class SearchPage extends React.Component {
    constructor(props) {

        super(props);

        const query = Qs.parse(this.props.location.search.substring(1));

        Actions.getResults(query);

        this.els = {};
        this.state = Store.getState();
    }

    componentWillReceiveProps(nextProps) {

        const query = Qs.parse(nextProps.location.search.substring(1));

        Actions.getResults(query);
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

    onFiltersChange(event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        Actions.changeSearchQuery(this.els.filters.state, this.props.history);
    }

    onPageChange(page) {

        this.els.filters.changePage(page);
    }

    onNewClick() {

        Actions.showCreateNew();
    }

    render() {

        return (
            <section className="container">
                <div className="page-header">
                    <button
                        ref={(c) => (this.els.createNew = c)}
                        className="btn btn-default pull-right"
                        onClick={this.onNewClick.bind(this)}>

                        Create new
                    </button>
                    <h1>Accounts</h1>
                </div>
                <FilterForm
                    ref={(c) => (this.els.filters = c)}
                    loading={this.state.results.loading}
                    query={Qs.parse(this.props.location.search.substring(1))}
                    onChange={this.onFiltersChange.bind(this)}
                />
                <Results data={this.state.results.data} />
                <Paging
                    ref={(c) => (this.els.paging = c)}
                    pages={this.state.results.pages}
                    items={this.state.results.items}
                    loading={this.state.results.loading}
                    onChange={this.onPageChange.bind(this)}
                />
                <CreateNewForm
                    history={this.props.history}
                    location={this.props.location}
                    {...this.state.createNew}
                />
            </section>
        );
    }
}

SearchPage.propTypes = propTypes;


module.exports = SearchPage;
