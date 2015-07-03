var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/Account');


var Component = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function () {

        return {};
    },
    handleSubmit: function (event) {

        event.preventDefault();
        event.stopPropagation();

        Actions.newNote({
            id: this.props.details._id,
            data: this.state.newNote
        });

        this.setState({ newNote: '' });
    },
    render: function () {

        var alerts = [];
        if (this.props.data.success) {
            alerts.push(<div key="success" className="alert alert-success">
                Success. Changes have been saved.
            </div>);
        }
        else if (this.props.data.error) {
            alerts.push(<div key="danger" className="alert alert-danger">
                {this.props.data.error}
            </div>);
        }

        var notice;
        if (!this.props.details.hydrated) {
            notice = <div className="alert alert-info">
                Loading data...
            </div>;
        }

        var formElements;
        if (this.props.details.hydrated) {
            var noteData = this.props.details.notes || [];
            var noteHistory = noteData.map(function (note) {

                return (
                    <li key={note.timeCreated} className="list-group-item">
                        <div>{note.data}</div>
                        <span
                            title={note.moment.toString()}
                            className="badge">

                            {note.userCreated.name} - {note.moment.fromNow()}
                        </span>
                        <div className="clearfix"></div>
                    </li>
                );
            });

            formElements = <fieldset>
                <legend>Notes</legend>
                {alerts}
                <ControlGroup
                    groupClasses={{ 'form-group-notes': true }}
                    hideLabel={true}
                    hasError={this.props.data.hasError.data}
                    help={this.props.data.help.data}>

                    <textarea
                        ref="newNote"
                        name="newNote"
                        rows="3"
                        className="form-control"
                        valueLink={this.linkState('newNote')}>
                    </textarea>
                    <button
                        ref="newNoteButton"
                        type="submit"
                        className="btn btn-default btn-block">

                        Add new note
                        <Spinner
                            space="left"
                            show={this.props.data.loading}
                        />
                    </button>
                </ControlGroup>
                <ul className="list-group list-group-notes">
                    {noteHistory}
                </ul>
            </fieldset>;
        }

        return (
            <form onSubmit={this.handleSubmit}>
                {notice}
                {formElements}
            </form>
        );
    }
});


module.exports = Component;
