'use strict';
const FilterFormHoc = require('../../../../pages/admin/components/filter-form-hoc.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const SelectControl = require('../../../../components/form/select-control.jsx');
const TextControl = require('../../../../components/form/text-control.jsx');


const propTypes = {
    linkInputState: PropTypes.func,
    linkSelectState: PropTypes.func,
    loading: PropTypes.bool,
    state: PropTypes.object
};
const defaultValues = {
    username: '',
    sort: '_id',
    limit: '20',
    page: '1'
};


class FilterForm extends React.Component {
    render() {

        return (
            <div className="row">
                <div className="col-sm-3">
                    <TextControl
                        name="username"
                        label="Username search"
                        value={this.props.state.username}
                        onChange={this.props.linkInputState}
                        disabled={this.props.loading}
                    />
                </div>
                <div className="col-sm-3">
                    <SelectControl
                        name="role"
                        label="Can play role"
                        value={this.props.state.role}
                        onChange={this.props.linkSelectState}
                        disabled={this.props.loading}>

                        <option value="">-- choose--</option>
                        <option value="admin">Admin</option>
                        <option value="account">Account</option>
                    </SelectControl>
                </div>
                <div className="col-sm-2">
                    <SelectControl
                        name="isActive"
                        label="Active"
                        value={this.props.state.isActive}
                        onChange={this.props.linkSelectState}
                        disabled={this.props.loading}>

                        <option value="">-- choose--</option>
                        <option value={true}>true</option>
                        <option value={false}>false</option>
                    </SelectControl>
                </div>
                <div className="col-sm-2">
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
                <div className="col-sm-2">
                    <SelectControl
                        name="limit"
                        label="Limit"
                        value={this.props.state.limit}
                        onChange={this.props.linkSelectState}
                        disabled={this.props.loading}>

                        <option value="5">5 items</option>
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
