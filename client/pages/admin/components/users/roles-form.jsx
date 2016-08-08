'use strict';
const React = require('react');
const ReactRouter = require('react-router');
const ControlGroup = require('../../../../components/form/control-group');


const Link = ReactRouter.Link;


class Component extends React.Component {
    render () {

        let notice;

        if (!this.props.data.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        let formElements;
        if (this.props.data.hydrated) {
            const roles = this.props.data.roles || {};
            const rolesUi = [];

            if (roles.account) {
                rolesUi.push(
                    <ControlGroup key="account" label="Account" hideHelp={true}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                disabled={true}
                                value={roles.account.name}
                            />
                            <span className="input-group-btn">
                                <Link
                                    to={`/admin/accounts/${roles.account.id}`}
                                    className="btn btn-default">

                                    View
                                </Link>
                            </span>
                        </div>
                    </ControlGroup>
                );
            }

            if (roles.admin) {
                rolesUi.push(
                    <ControlGroup key="admin" label="Admin" hideHelp={true}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                disabled={true}
                                value={roles.admin.name}
                            />
                            <span className="input-group-btn">
                                <Link
                                    to={`/admin/admins/${roles.admin.id}`}
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

            formElements = <fieldset>
                <legend>Roles</legend>
                {rolesUi}
            </fieldset>;
        }

        return (
            <form>
                {notice}
                {formElements}
            </form>
        );
    }
}


module.exports = Component;
