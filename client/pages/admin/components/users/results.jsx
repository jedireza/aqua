'use strict';
const React = require('react');
const ReactRouter = require('react-router');


const Link = ReactRouter.Link;


class Component extends React.Component {
    getDefaultProps () {

        return {
            data: []
        };
    }

    render () {

        const rows = this.props.data.map(function (record) {

            return (
                <tr key={record._id}>
                    <td>
                        <Link
                            className="btn btn-default btn-sm"
                            to={`/admin/users/${record._id}`}>

                            Edit
                        </Link>
                    </td>
                    <td>{record.username}</td>
                    <td>{record.email}</td>
                    <td>{record.isActive.toString()}</td>
                    <td>{record._id}</td>
                </tr>
            );
        });

        return (
            <div className="table-responsive">
                <table className="table table-striped table-results">
                    <thead>
                        <tr>
                            <th></th>
                            <th>username</th>
                            <th className="stretch">email</th>
                            <th>active</th>
                            <th>id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}


module.exports = Component;
