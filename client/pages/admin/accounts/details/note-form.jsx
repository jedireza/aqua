'use strict';
const Actions = require('./actions');
const Alert = require('../../../../components/alert.jsx');
const ControlGroup = require('../../../../components/form/control-group.jsx');
const LinkState = require('../../../../helpers/link-state');
const Moment = require('moment');
const React = require('react');
const Spinner = require('../../../../components/form/spinner.jsx');


const propTypes = {
    accountId: React.PropTypes.string,
    error: React.PropTypes.string,
    hasError: React.PropTypes.object,
    help: React.PropTypes.object,
    loading: React.PropTypes.bool,
    notes: React.PropTypes.array,
    showSaveSuccess: React.PropTypes.bool
};


class NoteForm extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            newNote: ''
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            newNote: nextProps.newNote
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        event.stopPropagation();

        const id = this.props.accountId;
        const data = {
            data: this.state.newNote
        };

        Actions.newNote(id, data);
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={Actions.hideNoteSaveSuccess}
                message="Success. Changes have been saved."
            />);
        }

        if (this.props.error) {
            alerts.push(<Alert
                key="danger"
                type="danger"
                message={this.props.error}
            />);
        }

        const noteHistory = this.props.notes.map((note) => {

            const moment = Moment(note.timeCreated);

            return (
                <li key={note.timeCreated} className="list-group-item">
                    <div>{note.data}</div>
                    <span
                        title={moment.toString()}
                        className="badge">

                        {note.userCreated.name} - {moment.fromNow()}
                    </span>
                    <div className="clearfix"></div>
                </li>
            );
        });

        const formElements = <fieldset>
            <legend>Notes</legend>
            {alerts}
            <ControlGroup
                groupClasses={{ 'form-group-notes': true }}
                hideLabel={true}
                hasError={this.props.hasError.data}
                help={this.props.help.data}>

                <textarea
                    ref="newNote"
                    name="newNote"
                    rows="3"
                    className="form-control"
                    value={this.state.newNote}
                    onChange={LinkState.bind(this)}
                >
                </textarea>
                <button
                    ref="newNoteButton"
                    type="submit"
                    className="btn btn-default btn-block"
                    disabled={this.props.loading}>

                    Add new note
                    <Spinner
                        space="left"
                        show={this.props.loading}
                    />
                </button>
            </ControlGroup>
            <ul className="list-group list-group-notes">
                {noteHistory}
            </ul>
        </fieldset>;

        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                {formElements}
            </form>
        );
    }
}

NoteForm.propTypes = propTypes;


module.exports = NoteForm;
