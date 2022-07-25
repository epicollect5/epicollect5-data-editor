import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import { connect } from 'react-redux';
import EC5_LIBRARIES from 'ec5-libraries';
import Branch from '../Branch';
import BranchEntryRow from '../../components/BranchEntryRow';
import { deleteBranch } from '../../actions/branch';
import { branchOpen, branchClosed } from '../../actions/general';
import parameters from '../../constants/parameters';
import strings from '../../constants/strings';
import { truncateWithEllipses } from '../../utils/Utils';


class BranchQuestion extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            uuid: null,
            showModal: false
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.quit = this.quit.bind(this);
        this.deleteBranch = this.deleteBranch.bind(this);
    }


    branchEntryTable() {

        const { errors, branchEntries, ownerInput } = this.props;
        const branchEntryTableHtml = [];
        const branchEntriesList = branchEntries[ownerInput.ref];

        if (!branchEntriesList) {
            return null;
        }

        // If we have branch entries for this branch
        Object.keys(branchEntriesList)
            .forEach((uuid) => {

                let errorMessage = null;
                if (errors[uuid]) {
                    errorMessage = (
                        <span className="ec5-error"><i className="material-icons">warning</i></span>
                    );
                }
                branchEntryTableHtml.push(
                    <BranchEntryRow
                        key={uuid}
                        uuid={branchEntriesList[uuid].i}
                        title={branchEntriesList[uuid].branch_entry.title}
                        errorMessage={errorMessage}
                        deleteBranch={() => {
                            this.deleteBranch(branchEntriesList[uuid].id);
                        }}
                        viewEditBranch={() => {
                            this.openModal(branchEntriesList[uuid].id);
                        }}
                    />
                );

            });
        return (
            <table className="table table-bordered table-striped table-responsive">
                <tbody>
                {branchEntryTableHtml}
                </tbody>
            </table>
        );
    }

    openModal(uuid = null) {

        // Let the app reducer know the branch is open
        this.props.branchOpen();

        this.setState({
            showModal: true,
            uuid
        });
    }

    closeModal() {

        // Let the app reducer know the branch is closed
        this.props.branchClosed();

        this.setState({ showModal: false });
    }

    quit() {
        this.closeModal();
    }

    deleteBranch(uuid) {
        this.props.deleteBranch({
            uuid,
            ownerInputRef: this.props.ownerInput.ref
        });
    }

    render() {

        const { ownerEntryUuid, ownerInput, formRef, isFormEdit, external, project, branchEntries } = this.props;
        const branchEntryTable = this.branchEntryTable();
        const branchEntriesLimit = project.getEntryLimit(ownerInput.ref);
        const numberOfBranchEntries = (branchEntries[ownerInput.ref] ? Object.keys(branchEntries[ownerInput.ref]).length : 0);

        // Branch entry edit notice for internal form entry edits
        let editBranchNotice = null;
        if (isFormEdit && !external) {
            editBranchNotice = (
                <span
                    className="ec5-notice"
                >
                    {strings.viewing_branches}
                </span>
            );
        }

        return (
            <div
                className="form-group ec5-card col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">
                <div id="question" className="ec5-label">
                    <p>{ownerInput.question}
                    </p>
                </div>
                <div className="ec5-branch-list">
                    {editBranchNotice}
                    <p>
                        <button
                            className="btn btn-action"
                            disabled={branchEntriesLimit !== null && numberOfBranchEntries >= branchEntriesLimit}
                            onClick={() => {
                                this.openModal();
                            }}
                        >
                            {strings.add_branch}
                        </button>
                    </p>
                    <div className="ec5-table-container">
                        {branchEntryTable}
                    </div>
                </div>
                <Modal
                    className="ec5-branch-modal"
                    show={this.state.showModal}
                    keyboard={false}
                    backdrop="static"
                >
                    <Modal.Body>
                        <Branch
                            formRef={formRef}
                            uuid={this.state.uuid}
                            ownerInput={ownerInput}
                            ownerEntryUuid={ownerEntryUuid}
                            quit={this.quit}
                        />
                    </Modal.Body>
                    <Modal.Footer/>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {

    const { projectReducer, formReducer, answerReducer, validatorReducer, branchReducer, entryBranchReducer, generalReducer } = state;
    const { answers } = answerReducer;
    const { errors } = validatorReducer;
    const { project } = projectReducer;
    const { formRef } = formReducer;
    const isFormEdit = (formReducer.type === parameters.EDIT);
    const { branchEntries } = branchReducer;
    const isBranchEdit = (branchReducer.type === parameters.EDIT);
    const { network, external } = generalReducer;
    const { entry } = entryBranchReducer;

    return {
        entry,
        project,
        formRef,
        isFormEdit,
        isBranchEdit,
        branchEntries,
        answers,
        errors,
        network,
        external
    };
}

BranchQuestion.propTypes = {
    formRef: React.PropTypes.string,
    ownerInput: React.PropTypes.object,
    ownerEntryUuid: React.PropTypes.string,
    branchEntries: React.PropTypes.object,
    deleteBranch: React.PropTypes.func,
    branchOpen: React.PropTypes.func,
    branchClosed: React.PropTypes.func,
    errors: React.PropTypes.object,
    isFormEdit: React.PropTypes.bool,
    external: React.PropTypes.bool
};

export default connect(mapStateToProps, { deleteBranch, branchOpen, branchClosed })(BranchQuestion);
