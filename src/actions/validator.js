import {
    REQUEST_VALIDATION,
    FINISHED_VALIDATION,
    ADD_ERRORS,
    CLEAR_ERROR,
    CLEAR_ERRORS,
    CLEAR_ALL_ERRORS
} from './';

/**
 *
 * @param inputRef
 * @param answers
 * @returns {{type, payload: {inputRef: *, answers: *}}}
 */
export function requestValidation(inputRef, answers) {
    return {
        type: REQUEST_VALIDATION,
        payload: {
            inputRef,
            answers
        }
    };
}

/**
 *
 * @param passed
 * @returns {{type, payload: {passed: *}}}
 */
export function finishedValidation(passed) {
    return {
        type: FINISHED_VALIDATION,
        payload: {
            passed
        }
    };
}

/**
 *
 * @param uuid
 * @param errors
 * @returns {{type, payload: {uuid: *, errors: *}}}
 */
export function addErrors(uuid, errors) {
    return {
        type: ADD_ERRORS,
        payload: {
            uuid,
            errors
        }
    };
}

/**
 *
 * @param uuid
 * @param inputRef
 * @returns {{type, payload: {uuid: *, inputRef: *}}}
 */
export function clearError(uuid, inputRef) {
    return {
        type: CLEAR_ERROR,
        payload: {
            uuid,
            inputRef
        }
    };
}

/**
 *
 * @param uuid
 * @returns {{type, payload: {uuid: *}}}
 */
export function clearErrors(uuid) {
    return {
        type: CLEAR_ERRORS,
        payload: {
            uuid
        }
    };
}

/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function clearAllErrors() {
    return {
        type: CLEAR_ALL_ERRORS,
        payload: {}
    };
}
