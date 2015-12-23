/* global window */
'use strict';
const React = require('react');
const Paging = require('../../../../components/paging');
const Actions = require('../../actions/status');
const StatusStore = require('../../stores/status');
const FilterForm = require('./filter-form');
const CreateNewForm = require('./create-new-form');
const Results = require('./results');


class Component extends React.Component {
    getInitialState () {

        StatusStore.resetResults();
        StatusStore.resetCreateNew();

        Actions.getResults(this.props.location.query);

        return {
            results: StatusStore.getResults(),
            createNew: StatusStore.getCreateNew()
        };
    }

    componentWillReceiveProps (nextProps) {

        Actions.getResults(nextProps.location.query);
    }

    componentDidMount () {

        StatusStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        StatusStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState({
            results: StatusStore.getResults(),
            createNew: StatusStore.getCreateNew()
        });
    }

    onFiltersChange (event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.context.history.pushState(null, '/admin/statuses', this.refs.filters.state);
        window.scrollTo(0, 0);
    }

    onPageChange (page) {

        this.refs.filters.changePage(page);
    }

    onNewClick () {

        Actions.showCreateNew();
    }

    render () {

        return (
            <section className="section-statuses container">
                <div className="page-header">
                    <button
                        ref="createNew"
                        className="btn btn-default pull-right"
                        onClick={this.onNewClick}>

                        Create new
                    </button>
                    <h1>Statuses</h1>
                </div>
                <FilterForm
                    ref="filters"
                    query={this.context.location.query}
                    loading={this.state.results.loading}
                    onChange={this.onFiltersChange}
                />
                <Results data={this.state.results.data} />
                <Paging
                    ref="paging"
                    pages={this.state.results.pages}
                    items={this.state.results.items}
                    loading={this.state.results.loading}
                    onChange={this.onPageChange}
                />
                <CreateNewForm data={this.state.createNew} />
            </section>
        );
    }
}

Component.contextTypes = {
    history: React.PropTypes.object,
    location: React.PropTypes.object
};


module.exports = Component;
