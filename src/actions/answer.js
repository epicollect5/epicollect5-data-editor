import {
    SET_ANSWER,
    SET_ANSWERS,
    SET_CONFIRM_ANSWER,
    RESET_BRANCH_ANSWERS,
    RESET_CONFIRM_ANSWERS,
    RESET_ALL_ANSWERS
} from './';

/**
 *
 * @param answer
 * @param inputRef
 * @returns {{type: string, payload: {answer: *, inputRef: *}}}
 */
export function setAnswer(answer, inputRef) {
    return {
        type: SET_ANSWER,
        payload: {
            answer,
            inputRef
        }
    };
}

/**
 *
 * @param answers
 * @returns {{type: string, payload: {answers: *}}}
 */
export function setAnswers({ answers }) {
    return {
        type: SET_ANSWERS,
        payload: {
            answers
        }
    };
}

/**
 *
 * @param answer
 * @param inputRef
 * @returns {{type: string, payload: {answer: *, inputRef: *}}}
 */
export function setConfirmAnswer(answer, inputRef) {
    return {
        type: SET_CONFIRM_ANSWER,
        payload: {
            answer,
            inputRef
        }
    };
}

/**
 *
 * @param project
 * @param formRef
 * @param ownerInputRef
 * @returns {{type: *, payload: {project: *, formRef: *, ownerInputRef: *}}}
 */
export function resetBranchAnswers(project, formRef, ownerInputRef) {
    return {
        type: RESET_BRANCH_ANSWERS,
        payload: {
            project,
            formRef,
            ownerInputRef
        }
    };
}

/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function resetConfirmAnswers() {
    return {
        type: RESET_CONFIRM_ANSWERS,
        payload: {}
    };
}

/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function resetAllAnswers() {
    return {
        type: RESET_ALL_ANSWERS,
        payload: {}
    };
}