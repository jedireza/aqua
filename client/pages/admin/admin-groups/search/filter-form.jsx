'use strict';
const FilterFormHoc = require('../../../../components/admin/filter-form-hoc.jsx');
const React = require('react');
const SelectControl = require('../../../../components/form/select-control.jsx');
const TextControl = require('../../../../components/form/text-control.jsx');


const propTypes = {
    linkInputState: React.PropTypes.func,
    linkSelectState: React.PropTypes.func,
    loading: React.PropTypes.bool,
    state: React.PropTypes.object
};
const defaultValues = {
    name: '',
    sort: '_id',
    limit: '20',
    page: '1'
};


class FilterForm extends React.Component {
    render() {

        return (
            <div className="row">
                <div className="col-sm-4">
                    <TextControl
                        name="name"
                        label="Name search"
                        value={this.props.state.name}
                        onChange={this.props.linkInputState}
                        disabled={this.props.loading}
                    />
                </div>
                <div className="col-sm-4">
                    <SelectControl
                        name="sort"
                        label="Sort by"
                        value={this.props.state.sort}
                        onChange={this.props.linkSelectState}
                        disabled={this.props.loading}>

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
                        value={this.props.state.limit}
                        onChange={this.props.linkSelectState}
                        disabled={this.props.loading}>

                        <option value="10">10 items</option>
                        <option value="20">20 items</option>
                        <option value="50">50 items</option>
                        <option value="100">100 items</option>
                    </SelectControl>
                </div>
            </div>
        );
    }
}

FilterForm.propTypes = propTypes;


module.exports = FilterFormHoc(FilterForm, defaultValues);
