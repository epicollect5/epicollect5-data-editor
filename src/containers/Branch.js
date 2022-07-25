import React, { Component } from 'react';
import { connect } from 'react-redux';
import { truncateWithEllipses } from '../utils/Utils';
import QuestionContainer from './questions/QuestionContainer';
import TopContainer from './TopContainer';
import Loader from '../components/Loader';
import Error from '../components/Error';
import End from './End';
import { setUpEntryBranchAdd, setUpEntryBranchEdit, saveBranch, resetBranch } from '../actions/branch';
import { saveEntryBranch } from '../actions/entry-branch';
import parameters from '../constants/parameters';
import strings from '../constants/strings';
import config from '../constants/config';

class Branch extends Component {

    /**
     * NOTE: This class is special
     * Either it is initialised via a modal as part of a main form entry
     * Or is is the main entry itself
     *
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);

        this.state = {
            form: this.props.project.getExtraForm(this.props.formRef),
            branch: this.props.project.getFormBranches(this.props.formRef)[this.props.ownerInput.ref],
            currentInputRef: this.props.project.getBranchInputRefFromIndex(this.props.formRef, this.props.ownerInput.ref, 0),
            currentInputIndex: 0,
            inputs: this.props.project.getInputsExtra(),
            jumpQuestionChanged: false
        };

        //Bind 'this'
        this.saveEntry = this.saveEntry.bind(this);
        this.quit = this.quit.bind(this);
        this.addEntry = this.addEntry.bind(this);
        this.editEntry = this.editEntry.bind(this);
    }

    componentDidMount() {

        //Set up the branch by dispatching the setUpEntryBranch action, setting the current input ref and index
        if (this.props.uuid) {
            //EDIT
            this.editEntry();
        } else {
            //Set up the branch by dispatching the setUpEntryBranch action, setting the current input ref and index
            //ADD
            this.addEntry();
        }
    }

    componentDidUpdate() {

        const { isBranchOpen, entryComplete, entry } = this.props;

        //If the entry has now been marked as completed
        //And we're in a branch modal
        if (isBranchOpen && entryComplete) {
            this.props.saveBranch({ entry });
            this.quit();
        }
    }

    addEntry() {
        this.props.setUpEntryBranchAdd({
            currentInputRef: this.state.currentInputRef,
            currentInputIndex: this.state.currentInputIndex,
            ownerInputRef: this.props.ownerInput.ref,
            ownerEntryUuid: this.props.ownerEntryUuid
        });
    }

    editEntry() {

        let branchEntry;
        const { network, project, formRef, uuid, ownerInput, ownerEntryUuid, branchEntries } = this.props;
        const { currentInputRef, currentInputIndex } = this.state;

        //If we have any branches for this ownerInput.ref, check if this entry is stored locally
        if (branchEntries[ownerInput.ref]) {
            const branchUuids = Object.keys(branchEntries[ownerInput.ref]);
            //Check if we already have the branch locally
            for (const branchUuid of branchUuids) {
                if (branchUuid === uuid) {
                    branchEntry = branchEntries[ownerInput.ref][branchUuid];
                    break;
                }
            }
        }
        this.props.setUpEntryBranchEdit({
            network,
            projectSlug: project.getSlug(),
            formRef,
            ownerInputRef: ownerInput.ref,
            uuid,
            currentInputRef,
            currentInputIndex,
            branchEntry
        });
    }

    saveEntry() {
        const { ownerInput } = this.props;
        const { form, inputs } = this.state;
        //Save the branch entry
        this.props.saveEntryBranch({ form, ownerInputRef: ownerInput.ref, inputs });
    }

    quit() {

        const { isBranchOpen, project, formRef, ownerInput, entry } = this.props;

        if (isBranchOpen) {
            //If we are in a branch modal, i.e. part of a main form entry
            //Reset the branch entry
            this.props.resetBranch({ uuid: entry.id, project, formRef, ownerInputRef: ownerInput.ref });

            //Call passed down quitBranch callback
            this.props.quit();
        } else {
            //Go back to the dataviewer
            window.location.href = this.props.network.serverUrl + config.PROJECT_URL + '/' + this.props.project.getSlug() + config.DATA_VIEWER_URL + config.DATA_VIEWER_RESTORE;
        }

    }

    render() {

        const {
            isBranchOpen, entryComplete, type, formRef, isSetUp, entry, currentInputIndex,
            currentInputRef, ownerInput, isRejected, error, project, statusCodes
        } = this.props;
        const isEdit = (type === parameters.EDIT);
        const projectExtra = project.getProjectExtra();
        let projectName = '';
        let formName = '';

        //if branch is open, show branch question in navbar
        if (isBranchOpen) {
            projectName = projectExtra.inputs[ownerInput.ref].data.question;
            //shorten otherwise it does not fit
            projectName = truncateWithEllipses(projectName, window.EC5_LIBRARIES.PARAMETERS.MAX_BRANCH_QUESTION_RENDERING_LENGHT);
        } else {
            formName = project.getFormName(formRef) + ' - ' + projectExtra.inputs[ownerInput.ref].data.question;
            projectName = project.getProjectName();
        }

        const top = (
            <TopContainer
                projectName={projectName}
                formName={formName}
                isEdit={isEdit}
                formRef={formRef}
                isBranch
                ownerInputRef={ownerInput.ref}
                entry={entry}
                currentInputRef={currentInputRef}
                currentInputIndex={currentInputIndex}
                saveEntry={this.saveEntry}
                //Disable buttons if the entry is complete
                disableButtons={entryComplete}
                quit={this.quit}
            />
        );

        //If an Entry fetch has been rejected
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

        //If the branch modal is not open, that means the branch IS the main form here
        //So go straight to upload
        if (!isBranchOpen && entryComplete) {
            return (
                <div>
                    {top}
                    <End
                        isBranch
                        isEdit={type === parameters.EDIT}
                        entry={entry}
                        currentInputRef={currentInputRef}
                        currentInputIndex={currentInputIndex}
                    />
                </div>
            );
        }

        //If entry is not set up
        if (!isSetUp) {
            return (
                <div className="ec5-branch">
                    {top}
                    <Loader/>
                </div>
            );
        }

        //If we have no currentInputRef
        if (!currentInputRef) {

            //On first load, currentInputIndex is 0
            if (currentInputIndex === 0) {
                return null;
            }

            //End of branch
            return (
                <div className="ec5-branch">
                    {top}
                    <div className="ec5-view text-center">
                        <button
                            className="btn btn-action"
                            onClick={this.saveEntry}
                        >
                            {strings.save_branch_entry}
                        </button>
                    </div>
                </div>
            );
        }

        //Question
        return (
            <div className="ec5-branch">
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

    const { branchReducer, entryBranchReducer, projectReducer, validatorReducer, generalReducer } = state;
    const {
        type,
        branchEntries,
        currentInputRef,
        currentInputIndex,
        isSetUp
    } = branchReducer;
    const { entry, entryComplete, isRejected, error } = entryBranchReducer;
    const { project } = projectReducer;
    const { isValidating } = validatorReducer;
    const { network, isBranchOpen, statusCodes } = generalReducer;

    return {
        isBranchOpen,
        type,
        entry,
        entryComplete,
        isSetUp,
        isValidating,
        project,
        currentInputRef,
        currentInputIndex,
        branchEntries,
        network,
        isRejected,
        error,
        statusCodes
    };
}

Branch.propTypes = {
    type: React.PropTypes.string,
    uuid: React.PropTypes.string,
    isSetUp: React.PropTypes.bool,
    formRef: React.PropTypes.string,
    ownerInput: React.PropTypes.object,
    ownerEntryUuid: React.PropTypes.string,
    entry: React.PropTypes.object,
    entryComplete: React.PropTypes.bool,
    isBranchOpen: React.PropTypes.bool,
    isRejected: React.PropTypes.bool,
    branchEntries: React.PropTypes.object,
    currentInputIndex: React.PropTypes.number,
    currentInputRef: React.PropTypes.string,
    project: React.PropTypes.object,
    setUpEntryBranchAdd: React.PropTypes.func,
    setUpEntryBranchEdit: React.PropTypes.func,
    saveEntryBranch: React.PropTypes.func,
    saveBranch: React.PropTypes.func,
    resetBranch: React.PropTypes.func,
    quit: React.PropTypes.func,
    network: React.PropTypes.object,
    error: React.PropTypes.object,
    statusCodes: React.PropTypes.object
};

export default connect(mapStateToProps, {
    setUpEntryBranchAdd,
    setUpEntryBranchEdit,
    saveEntryBranch,
    saveBranch,
    resetBranch
})(Branch);
