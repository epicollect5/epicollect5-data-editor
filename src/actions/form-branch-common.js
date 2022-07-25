import fetch from 'isomorphic-fetch';
import EC5_LIBRARIES from 'ec5-libraries';
import Validator from '../utils/Validator';
import Jumps from '../utils/Jumps';
import { requestValidation, finishedValidation, addErrors, clearError } from './validator';
import { addAnswerToEntry, setWasJumped } from './entry-common';
import { resetConfirmAnswers } from './answer';
import config from '../constants/config';
import JsonFormatter from '../utils/JsonFormatter';
import { getAuthorisationHeader } from '../utils/Utils';

import {
    NEXT_QUESTION,
    PREVIOUS_QUESTION,
    ENTRY_INCOMPLETE
} from './';

/**
 * Function to return a branch append value
 * if isBranch is true
 *
 * @param isBranch
 * @returns {string}
 */
export function getBranchAppend (isBranch) {
    return isBranch ? '_BRANCH' : '';
}

/**
 * Go to the next question
 * Set the next input ref/index
 *
 * @param nextInputRef
 * @param nextInputIndex
 * @param isBranch
 * @returns {{type: string, payload: {nextInputRef: *, nextInputIndex: *}}}
 */
export function next (nextInputRef, nextInputIndex, isBranch = false) {
    return {
        type: NEXT_QUESTION + getBranchAppend(isBranch),
        payload: {
            nextInputRef,
            nextInputIndex
        }
    };
}

/**
 * Go to the previous question
 * Set the previous input ref/index
 *
 * @param previousInputRef
 * @param previousInputIndex
 * @param isBranch
 * @returns {{type: string, payload: {previousInputRef: *, previousInputIndex: *}}}
 */
export function previous (previousInputRef, previousInputIndex, isBranch = false) {
    return {
        type: PREVIOUS_QUESTION + getBranchAppend(isBranch),
        payload: {
            previousInputRef,
            previousInputIndex
        }
    };
}

/**
 * Check the uniqueness of an answer across all local branch entries
 *
 * @param entry
 * @param currentInput
 * @param currentInputRef
 * @param currentAnswer
 * @param branchEntries
 * @returns {boolean}
 */
function checkUniquenessBranch ({ entry, currentInput, currentInputRef, currentAnswer, branchEntries }) {

    let unique = true;

    //Only check for uniqueness if the following is satisfied
    if (currentAnswer !== '' && (currentInput.uniqueness === 'hierarchy' || currentInput.uniqueness === 'form')) {

        const ownerInputRef = entry.relationships.branch.data.owner_input_ref;

        //If we already have entries saved for this branch
        if (branchEntries[ownerInputRef]) {

            Object.keys(branchEntries[ownerInputRef]).forEach((uuid) => {

                //Skip if the uuid is the same, as we're editing the same branch
                if (uuid === entry.id) {
                    return;
                }
                const branchEntry = branchEntries[ownerInputRef][uuid];
                const answers = branchEntry.branch_entry.answers;
                let entryAnswer = currentAnswer;
                let storedEntryAnswer = answers[currentInputRef].answer;

                //If strings, lower case
                if (typeof entryAnswer === 'string') {
                    entryAnswer = entryAnswer.toLowerCase();
                    storedEntryAnswer = storedEntryAnswer.toLowerCase();
                }
                //Check if the same
                if (entryAnswer === storedEntryAnswer) {
                    //Not unique
                    unique = false;
                }
            });
        }
    }

    return unique;
}

/**
 * Check the uniqueness of an answer, if relevant
 *
 * @param network
 * @param project
 * @param form
 * @param entry
 * @param currentInput
 * @param currentInputRef
 * @param currentAnswer
 * @param branchEntries
 * @param isBranch
 * @returns {*}
 */
function checkUniqueness ({ network, project, form, entry, currentInput, currentInputRef, currentAnswer, branchEntries, isBranch }) {

    //Only check for uniqueness if the following is satisfied
    if (currentAnswer !== '' && (currentInput.uniqueness === 'hierarchy' || currentInput.uniqueness === 'form')) {

        const options = Object.assign({}, config.FETCH_OPTIONS);
        options.headers.Authorization = getAuthorisationHeader(network.jwtToken);
        options.method = 'POST';
        options.body = JSON.stringify({
            data: JsonFormatter.makeJsonUniqueEntry(form.details.ref, entry, currentInputRef, currentAnswer, project.getStructureLastUpdated())
        });
        let serverResponse;

        return fetch(`${network.serverUrl}${network.api}${config.UNIQUENESS_URL}/${project.getSlug()}`, options)
            .then((response) => {

                serverResponse = response;
                //If ok, return json
                return response.json();
            }).then((json) => {

                //Check for errors
                if (serverResponse.status === 200) {

                    //Check branch uniqueness
                    if (isBranch) {

                        //Not unique
                        if (!checkUniquenessBranch({
                            entry,
                            currentInput,
                            currentInputRef,
                            currentAnswer,
                            branchEntries
                        })) {
                            //Not unique
                            const error = new Error('ec5_22');
                            error.errors = [{
                                code: 'ec5_22',
                                source: 'form-branch-common'
                            }];
                            throw error;
                        }
                    }

                    //If ok, return true
                    return true;
                }

                //Not unique
                const error = new Error('ec5_22');
                if (json.errors) {
                    error.errors = json.errors;
                }
                throw error;

            });
    }

    //Return empty resolved promise
    return new Promise((resolve) => {
        resolve();
    });

}

/**
 * Check an answer is valid
 *
 * @param network
 * @param project
 * @param form
 * @param entry
 * @param inputs
 * @param currentInputRef
 * @param answers
 * @param confirmAnswers
 * @param branchEntries
 * @param isBranch
 * @returns {function(*=)}
 */
export function isValid ({ network, project, form, entry, inputs, currentInputRef, answers, confirmAnswers, branchEntries, isBranch }) {

    const currentInput = inputs[currentInputRef].data;

    //Get this current answer
    const currentAnswer = typeof answers[currentInputRef] !== 'undefined' ? answers[currentInputRef] : EC5_LIBRARIES.AnswerService.createDefaultAnswer(currentInput).answer;

    return (dispatch) => {

        let valid = true;

        //Validate
        dispatch(requestValidation(currentInputRef, answers));

        //Clear any previous errors for this input
        dispatch(clearError(entry.id, currentInputRef));

        //Check if the answer is unique
        return checkUniqueness({
            network,
            project,
            form,
            entry,
            currentInput,
            currentInputRef,
            currentAnswer,
            branchEntries,
            isBranch
        }).then(() => {

            //Passed uniqueness check

            //Validate the current answer(s)
            const validator = new Validator();
            if (!validator.validate(inputs, currentInputRef, answers, confirmAnswers)) {
                //If failed, dispatch the finishedValidation action
                dispatch(finishedValidation(false));
                //Dispatch add errors action
                dispatch(addErrors(entry.id, validator.errors));

                valid = false;
                return valid;
            }

            //Add the validated answer to the main entry object
            dispatch(addAnswerToEntry(currentInputRef, currentAnswer, isBranch));

            //If this input is a group, loop each group input and validate
            if (currentInput.type === EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_GROUP_TYPE) {

                const group = form.group[currentInputRef];
                for (let i = 0; i < group.length; i++) {

                    const groupInputRef = group[i];
                    const groupInput = inputs[groupInputRef].data;
                    let groupAnswer;


                    console.log(groupInputRef);
                    console.log(groupInput);
                    console.log(JSON.stringify(answers));

                    //Get this group answer (or if none, empty string)
                    if (answers[groupInputRef] !== undefined) {
                        groupAnswer = answers[groupInputRef];
                    } else {
                        groupAnswer = EC5_LIBRARIES.AnswerService.createDefaultAnswer(groupInput).answer;
                    }

                    //Clear any previous errors for this input
                    dispatch(clearError(entry.id, groupInputRef));

                    //Validate the group answer(s)
                    if (!validator.validate(inputs, groupInputRef, answers, confirmAnswers)) {
                        //If failed, dispatch the finishedValidation action
                        dispatch(finishedValidation(false));
                        //Dispatch add errors action
                        dispatch(addErrors(entry.id, validator.errors));
                        valid = false;
                    } else {
                        //Add the validated answer to the main entry object
                        dispatch(addAnswerToEntry(groupInputRef, groupAnswer, isBranch));
                    }

                }
            }

            //If any errors encountered, return
            if (!valid) {
                return valid;
            }

            //If passed, dispatch the finishedValidation action
            dispatch(finishedValidation(true));

            return true;

        }).catch((error) => {

            //Failed
            if (error.errors) {
                //If failed, dispatch the finishedValidation action
                dispatch(finishedValidation(false));
                //Dispatch add errors action
                dispatch(addErrors(entry.id, {
                    [currentInputRef]: [error.errors[0].code]
                }));
                return false;
            }

            return false;

        });

    };
}

/**
 * Determine whether a jump is needed and set next input ref/index
 *
 * @param project
 * @param form
 * @param inputs
 * @param nextInputRef
 * @param nextInputIndex
 * @param currentInputRef
 * @param answers
 * @param ownerInputRef
 * @param isBranch
 * @returns {function(*)}
 */
export function jumpToNext ({ project, form, inputs, nextInputRef, nextInputIndex, currentInputRef, answers, ownerInputRef, isBranch }) {

    return (dispatch) => {

        const currentInput = inputs[currentInputRef].data;

        //Get this current answer
        const currentAnswer = typeof answers[currentInputRef] !== 'undefined' ? answers[currentInputRef] : EC5_LIBRARIES.AnswerService.createDefaultAnswer(currentInput).answer;

        //Process jumps
        const jumps = new Jumps();

        //Get the latest next input ref and input index
        const { newNextInputRef, newNextInputIndex } = jumps.jumpNext({
            project,
            formRef: form.details.ref,
            answer: currentAnswer,
            input: currentInput,
            nextInputRef,
            nextInputIndex,
            ownerInputRef,
            isBranch
        });

        //If questions were jumped, update state
        if (nextInputRef !== newNextInputRef) {

            //Loop round each input to be jumped and dispatch jumped action
            for (let inputIndex = nextInputIndex; inputIndex < newNextInputIndex; inputIndex++) {

                //Get this input ref
                let inputRef;
                //Branches take their input ref from form.branch
                if (isBranch) {
                    inputRef = form.branch[ownerInputRef][inputIndex];
                } else {
                    //Forms take their input ref from form.inputs
                    inputRef = form.inputs[inputIndex];
                }

                const input = inputs[inputRef].data;
                //Set was_jumped = true for this input ref
                dispatch(setWasJumped(input, isBranch));

                //If this input is a group, loop each group input and set was_jumped = true
                if (input.type === EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_GROUP_TYPE) {

                    const group = form.group[inputRef];
                    for (let groupInputIndex = 0; groupInputIndex < group.length; groupInputIndex++) {
                        const groupInputRef = group[groupInputIndex];
                        const groupInput = inputs[groupInputRef].data;
                        //Set was_jumped = true for this group input ref
                        dispatch(setWasJumped(groupInput, isBranch));
                    }
                }
            }

        }

        //Reset any confirm answers
        dispatch(resetConfirmAnswers());

        //Go to the next question
        dispatch(next(newNextInputRef, newNextInputIndex, isBranch));
    };
}

/**
 * Determine whether you need to jump to a previous question
 *
 * @param entry
 * @param inputs
 * @param previousInputIndex
 * @param isBranch
 * @returns {function(*)}
 */
export function jumpToPrevious (entry, inputs, previousInputIndex, isBranch = false) {

    return (dispatch) => {

        const previousInputRef = inputs[previousInputIndex];
        //Process jumps
        const jumps = new Jumps();
        const answers = entry[entry.type].answers;
        const { newPreviousInputRef, newPreviousInputIndex } = jumps.jumpPrevious(answers, inputs, previousInputRef, previousInputIndex);

        //Go to the previous question
        dispatch(previous(newPreviousInputRef, newPreviousInputIndex, isBranch));
    };
}

/**
 *
 * @returns {{type: string, payload: {}}}
 */
export function entryIncomplete (isBranch = false) {
    return {
        type: ENTRY_INCOMPLETE + getBranchAppend(isBranch),
        payload: {}
    };
}
