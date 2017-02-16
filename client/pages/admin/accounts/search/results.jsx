'use strict';
const React = require('react');
const ReactRouter = require('react-router');


const Link = ReactRouter.Link;
const propTypes = {
    data: React.PropTypes.array
};


class Results extends React.Component {
    render() {

        const rows = this.props.data.map((record) => {

            return (
                <tr key={record.id}>
                    <td>
                        <Link
                            className="btn btn-default btn-sm"
                            to={`/admin/accounts/${record.id}`}>

                            Edit
                        </Link>
                    </td>
                    <td>{record.first} {record.last}</td>
                    <td>{record.User ? record.User.username : '---'}</td>
                    <td>{record.id}</td>
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
