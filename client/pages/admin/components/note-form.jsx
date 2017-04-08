'use strict';
const Alert = require('../../../components/alert.jsx');
const ControlGroup = require('../../../components/form/control-group.jsx');
const LinkState = require('../../../helpers/link-state');
const Moment = require('moment');
const PropTypes = require('prop-types');
const React = require('react');
const Spinner = require('../../../components/form/spinner.jsx');


const propTypes = {
    error: PropTypes.string,
    hasError: PropTypes.object,
    help: PropTypes.object,
    loading: PropTypes.bool,
    newNote: PropTypes.string,
    notes: PropTypes.array,
    saveAction: PropTypes.func,
    showSaveSuccess: PropTypes.bool,
    successCloseAction: PropTypes.func
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

        this.props.saveAction(this.state.newNote);
    }

    render() {

        const alerts = [];

        if (this.props.showSaveSuccess) {
            alerts.push(<Alert
                key="success"
                type="success"
                onClose={this.props.successCloseAction}
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
