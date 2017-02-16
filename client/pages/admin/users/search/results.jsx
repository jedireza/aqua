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

            const id = record.id;
            const link = '/admin/users/' + id;

            return (
                <tr key={id}>
                    <td>
                        <Link
                            className="btn btn-default btn-sm"
                            to={link}>

                            Edit
                        </Link>
                    </td>
                    <td>{record.username}</td>
                    <td>{record.email}</td>
                    <td>{record.isActive}</td>
                    <td className="nowrap">{id}</td>
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

Results.propTypes = propTypes;


module.exports = Results;
