'use strict';
const FilterFormHoc = require('../../../../../client/pages/admin/components/filter-form-hoc.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const SelectControl = require('../../../../../client/components/form/select-control.jsx');
const TextControl = require('../../../../../client/components/form/text-control.jsx');


const propTypes = {
    linkInputState: PropTypes.func,
    linkSelectState: PropTypes.func,
    loading: PropTypes.bool,
    state: PropTypes.object
};
const defaultValues = {
    page: '1',
    select: 'a',
    text: ''
};


class FilterForm extends React.Component {
    render() {

        return (
            <div>
                <TextControl
                    name="text"
                    label="Text input"
                    value={this.props.state.text}
                    onChange={this.props.linkInputState}
                    disabled={this.props.loading}
                />
                <SelectControl
                    name="select"
                    label="Select input"
                    value={this.props.state.select}
                    onChange={this.props.linkSelectState}
                    disabled={this.props.loading}>

                    <option value="a">A</option>
                    <option value="b">B</option>
                </SelectControl>
            </div>
        );
    }
}

FilterForm.propTypes = propTypes;


module.exports = FilterFormHoc(FilterForm, defaultValues);
