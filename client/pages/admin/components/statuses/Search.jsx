/* global window */
var React = require('react/addons');
var ReactRouter = require('react-router');
var Paging = require('../../../../components/Paging');
var Actions = require('../../actions/Status');
var StatusStore = require('../../stores/Status');
var FilterForm = require('./FilterForm');
var CreateNewForm = require('./CreateNewForm');
var Results = require('./Results');


var State = ReactRouter.State;
var Navigation = ReactRouter.Navigation;


var Component = React.createClass({
    mixins: [ State, Navigation ],
    getInitialState: function () {

        StatusStore.resetResults();
        StatusStore.resetCreateNew();

        Actions.getResults(this.getQuery());

        return {
            results: StatusStore.getResults(),
            createNew: StatusStore.getCreateNew()
        };
    },
    componentWillReceiveProps: function(nextProps) {

        Actions.getResults(this.getQuery());
    },
    componentDidMount: function () {

        StatusStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        StatusStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            results: StatusStore.getResults(),
            createNew: StatusStore.getCreateNew()
        });
    },
    onFiltersChange: function (event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.transitionTo('statuses', {}, this.refs.filters.state);
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
