var React = require('react/addons');
var ObjectAssign = require('object-assign');
var TextControl = require('../../../../components/form/TextControl');
var SelectControl = require('../../../../components/form/SelectControl');


var Component = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    defaultState: {
        username: '',
        role: '',
        isActive: '',
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
                    <div className="col-sm-3">
                        <TextControl
                            name="username"
                            label="Username search"
                            valueLink={this.linkState('username')}
                            disabled={this.props.loading}
                        />
                    </div>
                    <div className="col-sm-3">
                        <SelectControl
                            name="role"
                            label="Can play role"
                            disabled={this.props.loading}
                            onChange={this.onMenuChange}
                            value={this.state.role}>

                            <option value="">-- choose--</option>
                            <option value="admin">Admin</option>
                            <option value="account">Account</option>
                        </SelectControl>
                    </div>
                    <div className="col-sm-2">
                        <SelectControl
                            name="isActive"
                            label="Active"
                            disabled={this.props.loading}
                            onChange={this.onMenuChange}
                            value={this.state.isActive}>

                            <option value="">-- choose--</option>
                            <option value={true}>true</option>
                            <option value={false}>false</option>
                        </SelectControl>
                    </div>
                    <div className="col-sm-2">
                        <SelectControl
                            name="sort"
                            label="Sort by"
                            disabled={this.props.loading}
                            onChange={this.onMenuChange}
                            value={this.state.sort}>

                            <option value="_id">id &#9650;</option>
                            <option value="-_id">id &#9660;</option>
                            <option value="username">username &#9650;</option>
                            <option value="-username">username &#9660;</option>
                            <option value="email">email &#9650;</option>
                            <option value="-email">email &#9660;</option>
                        </SelectControl>
                    </div>
                    <div className="col-sm-2">
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
