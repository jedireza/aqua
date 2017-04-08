'use strict';
const ControlGroup = require('../../../../components/form/control-group.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');


const Link = ReactRouter.Link;
const propTypes = {
    account: PropTypes.object,
    admin: PropTypes.object
};


class RolesForm extends React.Component {
    render() {

        const rolesUi = [];

        if (this.props.account) {
            rolesUi.push(
                <ControlGroup key="account" label="Account" hideHelp={true}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            value={this.props.account.name}
                        />
                        <span className="input-group-btn">
                            <Link
                                to={`/admin/accounts/${this.props.account.id}`}
                                className="btn btn-default">

                                View
                            </Link>
                        </span>
                    </div>
                </ControlGroup>
            );
        }

        if (this.props.admin) {
            rolesUi.push(
                <ControlGroup key="admin" label="Admin" hideHelp={true}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            disabled={true}
                            value={this.props.admin.name}
                        />
                        <span className="input-group-btn">
                            <Link
                                to={`/admin/admins/${this.props.admin.id}`}
                                className="btn btn-default">

                                View
                            </Link>
                        </span>
                    </div>
                </ControlGroup>
            );
        }

        if (rolesUi.length === 0) {
            rolesUi.push(
                <ControlGroup key="empty" hideLabel={true} hideHelp={true}>
                    <span className="label label-default">
                        no roles defined
                    </span>
                </ControlGroup>
            );
        }

        const formElements = <fieldset>
            <legend>Roles</legend>
            {rolesUi}
        </fieldset>;

        return (
            <form>
                {formElements}
            </form>
        );
    }
}

RolesForm.propTypes = propTypes;


module.exports = RolesForm;
