import React, { Component } from 'react';
import { connect } from 'react-redux';
import Error from '../components/Error';
import SaveEntry from '../components/SaveEntry';
import QuestionContainer from './questions/QuestionContainer';
import End from './End';
import Loader from '../components/Loader';
import TopContainer from './TopContainer';
import { setUpEntryFormAdd, setUpEntryFormEdit, saveEntry } from '../actions/form';
import parameters from '../constants/parameters';

class Form extends Component {

    constructor(props, context) {
        super(props, context);

        // If we have a uuid, it means we're editing, so use the provided inputRef, otherwise default to null
        let currentInputRef = this.props.uuid ? this.props.inputRef : null;
        // Default input index to 0
        let currentInputIndex = 0;

        // Attempt to get the correct input ref and index
        if (!this.props.project.inputExists(currentInputRef)) {
            currentInputIndex = 0;
            currentInputRef = this.props.project.getInputRefFromIndex(this.props.formRef, currentInputIndex);
        } else {
            currentInputIndex = this.props.project.getInputIndexFromRef(this.props.formRef, currentInputRef);
        }

        this.state = {
            form: this.props.project.getExtraForms()[this.props.formRef],
            currentInputRef,
            currentInputIndex,
            inputs: this.props.project.getInputsExtra()
        };

        this.saveEntry = this.saveEntry.bind(this);
        this.addEntry = this.addEntry.bind(this);
        this.editEntry = this.editEntry.bind(this);
    }

    componentWillMount() {

        // Set up the form by dispatching the setUpEntryForm action, setting the current input ref and index
        if (!this.props.uuid) {
            // ADD
            this.addEntry();
        } else {
            // EDIT
            this.editEntry();
        }
    }

    addEntry() {
        this.props.setUpEntryFormAdd({
            formRef: this.props.formRef,
            currentInputRef: this.state.currentInputRef,
            currentInputIndex: this.state.currentInputIndex,
            parentEntryUuid: this.props.parentEntryUuid,
            parentFormRef: this.props.parentFormRef
        });
    }

    editEntry() {
        this.props.setUpEntryFormEdit({
            network: this.props.network,
            projectSlug: this.props.project.getSlug(),
            formRef: this.props.formRef,
            uuid: this.props.uuid,
            currentInputRef: this.state.currentInputRef,
            currentInputIndex: this.state.currentInputIndex,
            parentEntryUuid: this.props.parentEntryUuid,
            parentFormRef: this.props.parentFormRef
        });
    }

    /**
     * Save the main entry
     * ie upload it and its branches to the server
     */
    saveEntry() {
        const { form, inputs } = this.state;
        // Save the entry
        this.props.saveEntry(form, inputs);

    }

    render() {

        const {
            formRef, type, isSetUp, entry, currentInputIndex, currentInputRef,
            entryComplete, isRejected, error, project, statusCodes
        } = this.props;
        const isEdit = (type === parameters.EDIT);

        const top = (
            <TopContainer
                formName={project.getFormName(formRef)}
                projectName={project.getProjectName()}
                isEdit={isEdit}
                formRef={formRef}
                isBranch={false}
                entry={entry}
                currentInputRef={currentInputRef}
                currentInputIndex={currentInputIndex}
                saveEntry={this.saveEntry}
                // Disable buttons if the entry is complete
                disableButtons={entryComplete}
            />
        );

        // If an Entry fetch has been rejected
        if (isRejected && error) {
            return (
                <div>
                    {top}
                    <Error
                        message={statusCodes[error.message]}
                    />
                </div>
            );
        }

        // If the Entry is complete
        if (entryComplete) {
            return (
                <div>
                    { top }
                    <End
                        isBranch={false}
                        isEdit={isEdit}
                        entry={entry}
                        currentInputRef={currentInputRef}
                        currentInputIndex={currentInputIndex}
                    />
                </div>
            );
        }

        // If we're still setting up, show loader
        if (!isSetUp) {
            return (
                <div>
                    {top}
                    <Loader />
                </div>
            );

        }

        // If  we have no currentInputRef
        if (!currentInputRef) {
            // End of form
            return (
                <div>
                    {top}
                    <SaveEntry
                        saveEntry={this.saveEntry}
                    />
                </div>
            );
        }

        // Question
        return (
            <div>
                {top}
                <QuestionContainer
                    form={this.state.form}
                    inputs={this.state.inputs}
                    entry={entry}
                    currentInputRef={currentInputRef}
                />
            </div>
        );
    }

}

function mapStateToProps(state) {

    const { formReducer, projectReducer, validatorReducer, generalReducer, entryReducer } = state;
    const { type, currentInputRef, currentInputIndex, isSetUp, entryComplete, isSavingAndQuiting } = formReducer;
    const { project } = projectReducer;
    const { isValidating } = validatorReducer;
    const { network, statusCodes } = generalReducer;
    const { entry, isRejected, error } = entryReducer;

    return {
        type,
        isSetUp,
        isValidating,
        project,
        currentInputRef,
        currentInputIndex,
        entry,
        entryComplete,
        isSavingAndQuiting,
        network,
        isRejected,
        error,
        statusCodes
    };

}

Form.propTypes = {
    type: React.PropTypes.string,
    uuid: React.PropTypes.string,
    isSetUp: React.PropTypes.bool,
    entryComplete: React.PropTypes.bool,
    formRef: React.PropTypes.string,
    parentEntryUuid: React.PropTypes.string,
    parentFormRef: React.PropTypes.string,
    inputRef: React.PropTypes.string,
    entry: React.PropTypes.object,
    currentInputIndex: React.PropTypes.number,
    currentInputRef: React.PropTypes.string,
    project: React.PropTypes.object,
    saveEntry: React.PropTypes.func,
    setUpEntryFormAdd: React.PropTypes.func,
    setUpEntryFormEdit: React.PropTypes.func,
    network: React.PropTypes.object,
    isRejected: React.PropTypes.bool,
    error: React.PropTypes.object,
    statusCodes: React.PropTypes.object
};

export default connect(mapStateToProps, {
    setUpEntryFormAdd,
    setUpEntryFormEdit,
    saveEntry
})(Form);
