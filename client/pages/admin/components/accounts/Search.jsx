/* global window */
var React = require('react/addons');
var ReactRouter = require('react-router');
var Paging = require('../../../../components/Paging.react');
var Actions = require('../../actions/Account');
var AccountStore = require('../../stores/Account');
var FilterForm = require('./FilterForm.react');
var CreateNewForm = require('./CreateNewForm.react');
var Results = require('./Results.react');


var State = ReactRouter.State;
var Navigation = ReactRouter.Navigation;


var Component = React.createClass({
    mixins: [ State, Navigation ],
    getInitialState: function () {

        AccountStore.resetResults();
        AccountStore.resetCreateNew();

        Actions.getResults(this.getQuery());

        return {
            results: AccountStore.getResults(),
            createNew: AccountStore.getCreateNew()
        };
    },
    componentWillReceiveProps: function(nextProps) {

        Actions.getResults(this.getQuery());
    },
    componentDidMount: function () {

        AccountStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        AccountStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            results: AccountStore.getResults(),
            createNew: AccountStore.getCreateNew()
        });
    },
    onFiltersChange: function (event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.transitionTo('accounts', {}, this.refs.filters.state);
        window.scrollTo(0, 0);
    },
    onPageChange: function (page) {

        this.refs.filters.changePage(page);
    },
    onNewClick: function () {

        Actions.showCreateNew();
    },
    render: function () {

        return (
            <section className="section-accounts container">
                <div className="page-header">
                    <button
                        ref="createNew"
                        className="btn btn-default pull-right"
                        onClick={this.onNewClick}>

                        Create new
                    </button>
                    <h1>Accounts</h1>
                </div>
                <FilterForm
                    ref="filters"
                    query={this.getQuery()}
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
});


module.exports = Component;
