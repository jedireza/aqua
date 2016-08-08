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
}


module.exports = Component;
