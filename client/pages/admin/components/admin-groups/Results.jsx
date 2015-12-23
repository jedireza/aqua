var React = require('react');
var ReactRouter = require('react-router');
var LinkedStateMixin = require('react-addons-linked-state-mixin');


var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedStateMixin],
    getDefaultProps: function () {

        return {
            data: []
        };
    },
    render: function () {

        var rows = this.props.data.map(function (record) {

            return (
                <tr key={record._id}>
                    <td>
                        <Link
                            className="btn btn-default btn-sm"
                            to={`/admin/admin-groups/${record._id}`}>

                            Edit
                        </Link>
                    </td>
                    <td>{record._id}</td>
                    <td>{record.name}</td>
                </tr>
            );
        });

        return (
            <div className="table-responsive">
                <table className="table table-striped table-results">
                    <thead>
                        <tr>
                            <th></th>
                            <th>id</th>
                            <th className="stretch">name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});


module.exports = Component;
