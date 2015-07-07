/* global window */
var React = require('react/addons');
var Paging = require('../../../../components/Paging');
var Actions = require('../../actions/User');
var UserStore = require('../../stores/User');
var FilterForm = require('./FilterForm');
var CreateNewForm = require('./CreateNewForm');
var Results = require('./Results');


var Component = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {

        UserStore.resetResults();
        UserStore.resetCreateNew();

        Actions.getResults(this.context.router.getCurrentQuery());

        return {
            results: UserStore.getResults(),
            createNew: UserStore.getCreateNew()
        };
    },
    componentWillReceiveProps: function (nextProps) {

        Actions.getResults(this.context.router.getCurrentQuery());
    },
    componentDidMount: function () {

        UserStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        UserStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            results: UserStore.getResults(),
            createNew: UserStore.getCreateNew()
        });
    },
    onFiltersChange: function (event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.context.router.transitionTo('users', {}, this.refs.filters.state);
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
                    query={this.context.router.getCurrentQuery()}
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
