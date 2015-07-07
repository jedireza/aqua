/* global window */
var React = require('react/addons');
var Paging = require('../../../../components/Paging');
var Actions = require('../../actions/Admin');
var AdminStore = require('../../stores/Admin');
var FilterForm = require('./FilterForm');
var CreateNewForm = require('./CreateNewForm');
var Results = require('./Results');


var Component = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {

        AdminStore.resetResults();
        AdminStore.resetCreateNew();

        Actions.getResults(this.context.router.getCurrentQuery());

        return {
            results: AdminStore.getResults(),
            createNew: AdminStore.getCreateNew()
        };
    },
    componentWillReceiveProps: function (nextProps) {

        Actions.getResults(this.context.router.getCurrentQuery());
    },
    componentDidMount: function () {

        AdminStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        AdminStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            results: AdminStore.getResults(),
            createNew: AdminStore.getCreateNew()
        });
    },
    onFiltersChange: function (event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.context.router.transitionTo('admins', {}, this.refs.filters.state);
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
            <section className="section-admins container">
                <div className="page-header">
                    <button
                        ref="createNew"
                        className="btn btn-default pull-right"
                        onClick={this.onNewClick}>

                        Create new
                    </button>
                    <h1>Admins</h1>
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
