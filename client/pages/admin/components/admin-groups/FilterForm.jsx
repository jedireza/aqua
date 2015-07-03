var React = require('react/addons');
var ObjectAssign = require('object-assign');
var TextControl = require('../../../../components/form/TextControl');
var SelectControl = require('../../../../components/form/SelectControl');


var Component = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    defaultState: {
        name: '',
        sort: '_id',
        limit: 20,
        page: 1
    },
    getInitialState: function () {

        return ObjectAssign({}, this.defaultState, this.props.query);
    },
    componentWillReceiveProps: function (nextProps) {

        var nextState = ObjectAssign({}, this.defaultState, nextProps.query);
        this.setState(nextState);
    },
    onMenuChange: function (event) {

        var newState = { page: 1 };
        newState[event.target.name] = event.target.value;
        this.setState(newState, this.props.onChange);
    },
    onEnterSubmit: function (event) {

        if (event.which === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.setState({ page: 1 }, this.props.onChange);
        }
    },
    changePage: function (page) {

        this.setState({ page: page }, this.props.onChange);
    },
    render: function () {

        return (
            <form onKeyDown={this.onEnterSubmit} onSubmit={this.props.onChange}>
                <div className="row">
                    <div className="col-sm-4">
                        <TextControl
                            name="name"
                            label="Name search"
                            valueLink={this.linkState('name')}
                            disabled={this.props.loading}
                        />
                    </div>
                    <div className="col-sm-4">
                        <SelectControl
                            name="sort"
                            label="Sort by"
                            disabled={this.props.loading}
                            onChange={this.onMenuChange}
                            value={this.state.sort}>

                            <option value="_id">id &#9650;</option>
                            <option value="-_id">id &#9660;</option>
                            <option value="name">name &#9650;</option>
                            <option value="-name">name &#9660;</option>
                        </SelectControl>
                    </div>
                    <div className="col-sm-4">
                        <SelectControl
                            name="limit"
                            label="Limit"
                            disabled={this.props.loading}
                            onChange={this.onMenuChange}
                            value={this.state.limit}>

                            <option value={10}>10 items</option>
                            <option value={20}>20 items</option>
                            <option value={50}>50 items</option>
                            <option value={100}>100 items</option>
                        </SelectControl>
                    </div>
                </div>
            </form>
        );
    }
});


module.exports = Component;
