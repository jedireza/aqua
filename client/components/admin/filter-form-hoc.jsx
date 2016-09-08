'use strict';
const LinkState = require('../../helpers/link-state');
const ObjectAssign = require('object-assign');
const React = require('react');


const propTypes = {
    children: React.PropTypes.node,
    loading: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    query: React.PropTypes.object
};


const FilterFormFactory = function (FilterForm, defaultValues) {

    class FilterFormHoc extends React.Component {
        constructor(props) {

            super(props);

            this.state = ObjectAssign({}, defaultValues, props.query);
        }

        componentWillReceiveProps(nextProps) {

            const nextState = ObjectAssign({}, defaultValues, nextProps.query);

            this.setState(nextState);
        }

        onSelectChange(event) {

            this.setState({ page: '1' }, this.props.onChange.bind(this));
        }

        onEnterSubmit(event) {

            if (event.which === 13) {
                event.preventDefault();
                event.stopPropagation();

                this.setState({ page: '1' }, this.props.onChange.bind(this));
            }
        }

        changePage(page) {

            this.setState({ page }, this.props.onChange.bind(this));
        }

        render() {

            return (
                <form
                    onKeyDown={this.onEnterSubmit.bind(this)}
                    onSubmit={this.props.onChange}>

                    <FilterForm
                        state={this.state}
                        loading={this.props.loading}
                        linkInputState={LinkState.bind(this)}
                        linkSelectState={LinkState.bind(this, this.onSelectChange.bind(this))}
                    />
                </form>
            );
        }
    }

    FilterFormHoc.propTypes = propTypes;

    return FilterFormHoc;
};


module.exports = FilterFormFactory;
