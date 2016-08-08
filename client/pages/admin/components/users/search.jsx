/* global window */
'use strict';
const React = require('react');
const Paging = require('../../../../components/paging');
const Actions = require('../../actions/user');
const UserStore = require('../../stores/user');
const FilterForm = require('./filter-form');
const CreateNewForm = require('./create-new-form');
const Results = require('./results');


class Component extends React.Component {
    getInitialState () {

        UserStore.resetResults();
        UserStore.resetCreateNew();

        Actions.getResults(this.context.location.query);

        return {
            results: UserStore.getResults(),
            createNew: UserStore.getCreateNew()
        };
    }

    componentWillReceiveProps (nextProps) {

        Actions.getResults(nextProps.location.query);
    }

    componentDidMount () {

        UserStore.addChangeListener(this.onStoreChange);
    }

    componentWillUnmount () {

        UserStore.removeChangeListener(this.onStoreChange);
    }

    onStoreChange () {

        this.setState({
            results: UserStore.getResults(),
            createNew: UserStore.getCreateNew()
        });
    }

    onFiltersChange (event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.context.history.pushState(null, '/admin/users', this.refs.filters.state);
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
            <section className="section-users container">
                <div className="page-header">
                    <button
                        ref="createNew"
                        className="btn btn-default pull-right"
                        onClick={this.onNewClick}>

                        Create new
                    </button>
                    <h1>Users</h1>
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
    location: React.PropTypes.object,
    history: React.PropTypes.object
};


module.exports = Component;
