'use strict';
const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');


const Link = ReactRouter.Link;
const propTypes = {
    data: PropTypes.array
};


class Results extends React.Component {
    render() {

        const rows = this.props.data.map((record) => {

            return (
                <tr key={record._id}>
                    <td>
                        <Link
                            className="btn btn-default btn-sm"
                            to={`/admin/accounts/${record._id}`}>

                            Edit
                        </Link>
                    </td>
                    <td>{record.name.first} {record.name.last}</td>
                    <td>{record.user ? record.user.name : '---'}</td>
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
                            <th className="stretch">name</th>
                            <th>username</th>
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

Results.propTypes = propTypes;


module.exports = Results;
