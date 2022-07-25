import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastr';
import ProgressBar from '../components/ProgressBar';
import NavBar from '../components/NavBar';
import config from '../constants/config';
import {
    ToastMessageFactory,
    showToastSuccess as showSuccessToast,
    showToastError as showErrorToast
} from '../utils/Toast';
import { setUpEntryFormAdd, setUpEntryFormEdit } from '../actions/form';
import { isValid, jumpToNext, jumpToPrevious } from '../actions/form-branch-common';

class TopContainer extends Component {

    constructor(props, context) {
        super(props, context);

        let formInputs;
        if (this.props.isBranch) {
            formInputs = this.props.project.getFormBranches(this.props.formRef)[this.props.ownerInputRef];
        } else {
            formInputs = this.props.project.getExtraForms()[this.props.formRef].inputs;
        }
        this.state = {
            form: this.props.project.getExtraForms()[this.props.formRef],
            inputs: this.props.project.getInputsExtra(),
            formInputs,
            enableQuitButton: true
        };

        this.validate = this.validate.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.previousQuestion = this.previousQuestion.bind(this);
        this.prevNextKeyDown = this.prevNextKeyDown.bind(this);
        this.quit = this.quit.bind(this);

        //Listener for arrow left and right events
        //See: https://github.com/facebook/react/issues/285
        //document.addEventListener('keydown', this.prevNextKeyDown);
    }

    shouldComponentUpdate(nextProps) {

        //If this is not a branch, but the branch is open, don't update
        if (!this.props.isBranch && this.props.isBranchOpen) {
            //To refresh the project name in navbar
            return false;
        }

        //If we're just turning off the toasts, don't update
        if ((this.props.showSuccess && !nextProps.showSuccess) || (this.props.showError && !nextProps.showError)) {
            return false;
        }

        //Otherwise, update
        return true;
    }

    componentDidUpdate() {
        //If any errors during upload
        if (this.props.showError) {
            //Show first upload error
            showErrorToast(this.container, this.props.toastMessage);
        } else if (this.props.showSuccess) {
            showSuccessToast(this.container, this.props.toastMessage);
        }
    }

    componentWillUnmount() {
        //Remove the previous event handler
       //document.removeEventListener('keydown', this.prevNextKeyDown);
    }

    //todo fix this when there is time ()
    prevNextKeyDown() {

        ////Either we're not a branch and the branch modal is not open i.e. Form Entry
        ////Or we are a branch i.e. Branch Entry
        //if ((!this.props.isBranch && !this.props.isBranchOpen) || this.props.isBranch) {
        //
        ////  const activeElement = document.activeElement;
        ////   const inputs = ['input', 'textarea'];

        ////  console.log(inputs.indexOf(activeElement.tagName.toLowerCase()));
        //
        //  //if (activeElement && (inputs.indexOf(activeElement.tagName.toLowerCase()) === -1)) {
        //       switch (event.key && event.getModifierState('Shift')) {
        //           case 'ArrowLeft':
        //               event.preventDefault();
        //               this.previousQuestion();
        //               break;
        //           case 'ArrowRight':
        //               event.preventDefault();
        //               this.nextQuestion();
        //               break;
        //           default:
        //       }
        ////  }
        //   return false;
        //}
    }

    /**
     * Validate the current question's answer
     */
    validate() {

        const { network, project, currentInputRef, answers, confirmAnswers, isBranch, entry, branchEntries } = this.props;
        const { form, inputs } = this.state;

        return this.props.isValid({
            network,
            project,
            form,
            entry,
            inputs,
            currentInputRef,
            answers,
            confirmAnswers,
            branchEntries,
            isBranch
        });
    }

    /**
     * Go to the next question after validation
     *
     */
    nextQuestion() {

        const { project, currentInputRef, answers, currentInputIndex, ownerInputRef, isBranch } = this.props;
        const { form, inputs, formInputs } = this.state;

        if (this.disableNext()) {
            return;
        }

        //Disable quit button
        this.setState({
            enableQuitButton: false
        }, () => {

            //Validate
            this.validate().then((passed) => {
                //If the validation passed
                if (passed) {

                    //Jump to next question
                    this.props.jumpToNext({
                        project,
                        form,
                        inputs,
                        nextInputRef: formInputs[currentInputIndex + 1],
                        nextInputIndex: currentInputIndex + 1,
                        currentInputRef,
                        answers,
                        ownerInputRef,
                        isBranch
                    });
                }

                //Enable quit button
                this.setState({
                    enableQuitButton: true
                });
            });
        });
    }

    /**
     * Go to the previous question
     *
     */
    previousQuestion() {

        const { currentInputIndex, isBranch, entry } = this.props;
        const { formInputs } = this.state;

        if (this.disablePrevious()) {
            return;
        }

        //Disable quit button
        this.setState({
            enableQuitButton: false
        }, () => {

            this.props.jumpToPrevious(
                entry,
                formInputs,
                currentInputIndex - 1,
                isBranch
            );

            //Enable quit button
            this.setState({
                enableQuitButton: true
            });
        });

    }

    disableNext() {
        const { currentInputIndex, disableButtons } = this.props;
        return (currentInputIndex === this.state.formInputs.length) || !this.isSetUp() || this.isValidating() || disableButtons;
    }

    disablePrevious() {
        const { currentInputIndex, disableButtons } = this.props;
        return currentInputIndex === 0 || !this.isSetUp() || this.isValidating() || disableButtons;
    }

    isSetUp() {
        const { isBranch, isBranchSetUp, isFormSetUp } = this.props;
        if (isBranch) {
            return isBranchSetUp;
        }
        return isFormSetUp;
    }

    isValidating() {
        const { isBranch, isBranchValidating, isFormValidating } = this.props;
        if (isBranch) {
            return isBranchValidating;
        }
        return isFormValidating;
    }

    quit() {
        //If a quit callback was passed in
        if (this.props.quit) {
            this.props.quit();
        } else {
            //Go back to the dataviewer
            window.location.href = this.props.network.serverUrl + config.PROJECT_URL + '/' + this.props.project.getSlug() + config.DATA_VIEWER_URL + config.DATA_VIEWER_RESTORE;
        }
    }

    render() {

        const { currentInputIndex, projectName, formName, network, project } = this.props;

        //Disable previous/next buttons?
        const disableNext = this.disableNext();
        const disablePrevious = this.disablePrevious();

        const projectLogo = `${network.serverUrl}${network.api === 'external' ? config.API_EXTERNAL_URL : config.API_INTERNAL_URL}${config.MEDIA_URL}/${project.getSlug()}/?type=photo&name=logo.jpg&format=project_mobile_logo`;

        return (
            <div>
                <NavBar
                    name={projectName}
                    quit={this.quit}
                    projectLogo={projectLogo}
                />

                <ProgressBar
                    progress={Math.round((currentInputIndex / this.state.formInputs.length) * 100)}
                    disablePrevious={disablePrevious}
                    disableNext={disableNext}
                    previousQuestion={this.previousQuestion}
                    nextQuestion={this.nextQuestion}
                />
                <ToastContainer
                    toastMessageFactory={ToastMessageFactory}
                    ref={(container) => {
                        this.container = container;
                    }}
                    className="toast-top-full-width"
                />
                <h4 className="ec5-form-name text-center">{formName}</h4>
            </div>
        );
    }
}

function mapStateToProps(state) {

    const { formReducer, branchReducer, projectReducer, answerReducer, generalReducer, toastReducer } = state;
    const { project } = projectReducer;
    const { branchEntries } = branchReducer;
    const { answers, confirmAnswers } = answerReducer;
    const { network, isBranchOpen, external } = generalReducer;
    const { showError, showSuccess, toastMessage } = toastReducer;

    return {
        network,
        isBranchOpen,
        project,
        answers,
        confirmAnswers,
        branchEntries,
        isFormSetUp: formReducer.isSetUp,
        isFormValidating: formReducer.isValidating,
        isBranchSetUp: branchReducer.isSetUp,
        isBranchValidating: branchReducer.isValidating,
        showError,
        showSuccess,
        toastMessage,
        external
    };

}

TopContainer.propTypes = {
    projectName: React.PropTypes.string,
    formName: React.PropTypes.string,
    entry: React.PropTypes.object,
    answers: React.PropTypes.object,
    confirmAnswers: React.PropTypes.object,
    branchEntries: React.PropTypes.object,
    isBranch: React.PropTypes.bool,
    disableButtons: React.PropTypes.bool,
    formRef: React.PropTypes.string,
    currentInputIndex: React.PropTypes.number,
    currentInputRef: React.PropTypes.string,
    ownerInputRef: React.PropTypes.string,
    project: React.PropTypes.object,
    isValid: React.PropTypes.func,
    jumpToNext: React.PropTypes.func,
    jumpToPrevious: React.PropTypes.func,
    network: React.PropTypes.object,
    isFormSetUp: React.PropTypes.bool,
    isFormValidating: React.PropTypes.bool,
    isBranchSetUp: React.PropTypes.bool,
    isBranchValidating: React.PropTypes.bool,
    isBranchOpen: React.PropTypes.bool,
    quit: React.PropTypes.func,
    showError: React.PropTypes.bool,
    showSuccess: React.PropTypes.bool,
    toastMessage: React.PropTypes.string
};

export default connect(mapStateToProps, {
    jumpToNext,
    jumpToPrevious,
    isValid,
    setUpEntryFormAdd,
    setUpEntryFormEdit
})(TopContainer);
