var React = require('react/addons');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../../components/form/ControlGroup');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedState],
    render: function () {

        var notice;
        if (!this.props.data.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        var formElements;
        if (this.props.data.hydrated) {
            var roles = this.props.data.roles || {};
            var rolesUi = [];

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
                                    to="accountDetails"
                                    params={{ id: roles.account.id }}
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
                                    to="adminDetails"
                                    params={{ id: roles.admin.id }}
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
});


module.exports = Component;
