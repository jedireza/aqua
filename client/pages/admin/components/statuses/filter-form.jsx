'use strict';
const React = require('react');
const ObjectAssign = require('object-assign');
const TextControl = require('../../../../components/form/text-control');
const SelectControl = require('../../../../components/form/select-control');


class Component extends React.Component {
    getInitialState () {

        return ObjectAssign({}, this.defaultState, this.props.query);
    }

    componentWillReceiveProps (nextProps) {

        const nextState = ObjectAssign({}, this.defaultState, nextProps.query);

        this.setState(nextState);
    }

    onMenuChange (event) {

        const newState = { page: 1 };

        newState[event.target.name] = event.target.value;
        this.setState(newState, this.props.onChange);
    }

    onEnterSubmit (event) {

        if (event.which === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.setState({ page: 1 }, this.props.onChange);
        }
    }

    changePage (page) {

        this.setState({ page: page }, this.props.onChange);
    }

    render () {

        return (
            <form onKeyDown={this.onEnterSubmit} onSubmit={this.props.onChange}>
                <div className="row">
                    <div className="col-sm-3">
                        <TextControl
                            name="pivot"
                            label="Pivot search"
                            valueLink={this.linkState('pivot')}
                            disabled={this.props.loading}
                        />
                    </div>
                    <div className="col-sm-3">
                        <TextControl
                            name="name"
                            label="Name search"
                            valueLink={this.linkState('name')}
                            disabled={this.props.loading}
                        />
                    </div>
                    <div className="col-sm-3">
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
                            <option value="pivot">pivot &#9650;</option>
                            <option value="-pivot">pivot &#9660;</option>
                        </SelectControl>
                    </div>
                    <div className="col-sm-3">
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
}

Component.defaultState = {
    pivot: '',
    name: '',
    sort: '_id',
    limit: 20,
    page: 1
};


module.exports = Component;
