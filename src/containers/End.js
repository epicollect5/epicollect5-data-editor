import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadEntry, uploadEntryBranch, uploading, removeErrors } from '../actions/upload';
import { entryIncomplete } from '../actions/form-branch-common';
import { resetApp } from '../actions/general';
import { showToastError, showToastSuccess } from '../actions/toast';
import Error from '../components/Error';
import Loader from '../components/Loader';
import strings from '../constants/strings';
import config from '../constants/config';

class End extends Component {

    constructor(props, context) {
        super(props, context);


        // Dispatch uploading
        this.props.uploading();
        // Remove all previous upload errors
        this.props.removeErrors();

        // Upload branch entry
        if (this.props.isBranch) {
            this.props.uploadEntryBranch(this.props.network, this.props.project, this.props.formRef, this.props.entry);
        } else {
            // Upload entry
            this.props.uploadEntry(this.props.network, this.props.project, this.props.formRef, this.props.entry, this.props.branchEntries);
        }

        this.goBack = this.goBack.bind(this);
        this.addAnother = this.addAnother.bind(this);
        this.getErrorMessage = this.getErrorMessage.bind(this);
    }

    componentDidUpdate() {

        // If any errors during upload
        if (this.props.uploadErrors.length > 0) {
            // Show first upload error
            this.props.showToastError(this.props.statusCodes[this.props.uploadErrors[0].code]);
        } else if (this.props.hasUploaded) {
            this.props.showToastSuccess(strings.successfully_uploaded);
        }
    }

    getErrorMessage(uploadError) {

        // Check the type of error code received back
        const uploadErrorCode = uploadError;
        const uploadStoppingErrorCodes = config.UPLOAD_STOPPING_ERROR_CODES;

        if (uploadStoppingErrorCodes.includes(uploadErrorCode.code)) {
            return uploadErrorCode.title;
        }

        // todo check here for login/not authorised/private project etc

        return strings.upload_error;
    }

    goBack() {
        // Mark the entry as incomplete to go back
        this.props.entryIncomplete(this.props.isBranch);
    }

    addAnother() {
        // Reset the app
        this.props.resetApp();
    }

    render() {

        const { isUploading, uploadErrors, isEdit, external } = this.props;

        // If we're uploading an entry, show spinner
        if (isUploading) {
            return (
                <div>
                    <Loader />
                </div>
            );
        }

        // If there were errors during the upload
        if (uploadErrors.length > 0) {

            const uploadError = this.getErrorMessage(uploadErrors[0]);

            return (
                <div>
                    <div className="ec5-view text-center">
                        <Error
                            message={uploadError}
                        />
                        <button
                            className="btn btn-action"
                            onClick={this.goBack}
                        >
                            {strings.go_back}
                        </button>
                    </div>
                </div>
            );
        }

        let addAnotherEntry = null;
        let completedText = strings.thank_you_for_your_submission;

        if (!external) {
            // If we're adding entries, allow user to add another one
            if (!isEdit) {
                addAnotherEntry = (
                    <button
                        className="btn btn-action ec5-btn-margin"
                        onClick={this.addAnother}
                    >
                        {strings.add_another_entry}
                    </button>
                );
            }

            completedText = strings.entry_completed;
        }

        return (
            <div>
                <div className="ec5-view text-center">
                    <h2 className="ec5-completed-entry">{completedText}</h2>
                    {addAnotherEntry}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    const { formReducer, branchReducer, answerReducer, validatorReducer, projectReducer, uploadReducer, generalReducer } = state;
    const { formRef } = formReducer;
    const { branchEntries } = branchReducer;
    const { isUploading, hasUploaded } = uploadReducer;
    const uploadErrors = uploadReducer.errors;
    const { project } = projectReducer;
    const { errors } = validatorReducer;
    const { answers, confirmAnswers } = answerReducer;
    const { network, statusCodes, external } = generalReducer;

    return {
        isUploading,
        project,
        hasUploaded,
        answers,
        confirmAnswers,
        errors,
        uploadErrors,
        formRef,
        branchEntries,
        network,
        statusCodes,
        external
    };

}

End.propTypes = {
    isEdit: React.PropTypes.bool,
    project: React.PropTypes.object,
    isUploading: React.PropTypes.bool,
    hasUploaded: React.PropTypes.bool,
    isBranch: React.PropTypes.bool,
    external: React.PropTypes.bool,
    formRef: React.PropTypes.string,
    uploadErrors: React.PropTypes.array,
    entry: React.PropTypes.object,
    branchEntries: React.PropTypes.object,
    uploadEntry: React.PropTypes.func,
    uploadEntryBranch: React.PropTypes.func,
    entryIncomplete: React.PropTypes.func,
    uploading: React.PropTypes.func,
    removeErrors: React.PropTypes.func,
    resetApp: React.PropTypes.func,
    showToastError: React.PropTypes.func,
    showToastSuccess: React.PropTypes.func,
    network: React.PropTypes.object,
    statusCodes: React.PropTypes.object
};

export default connect(mapStateToProps, {
    uploadEntry,
    uploadEntryBranch,
    entryIncomplete,
    resetApp,
    uploading,
    removeErrors,
    showToastError,
    showToastSuccess
})(End);
