import { setAnswers, resetAllAnswers } from './answer';
import { clearAllErrors } from './validator';
import {
    SET_UP_FORM_ADD,
    SET_UP_FORM_EDIT,
    ENTRY_COMPLETE,
    RESET_FORM,
    ADD_FORM_REF
} from './';
import { entryAdd } from './entry';
import { fetchEntry, addTitleToEntry } from './entry-common';

/**
 *
 * @returns {{type: string, payload: {}}}
 */
function entryComplete() {
    return {
        type: ENTRY_COMPLETE,
        payload: {}
    };
}

/**
 *
 * @param formRef
 * @returns {{type: *, payload: {formRef: *}}}
 */
export function addFormRef({ formRef }) {
    return {
        type: ADD_FORM_REF,
        payload: {
            formRef
        }
    };
}

/**
 * Set up a form ADD
 *
 * @param formRef
 * @param currentInputRef
 * @param currentInputIndex
 * @returns {{type, payload: {formRef: *, currentInputRef: *, currentInputIndex: *}}}
 */
function formAdd({ formRef, currentInputRef, currentInputIndex }) {
    return {
        type: SET_UP_FORM_ADD,
        payload: {
            formRef,
            currentInputRef,
            currentInputIndex
        }
    };
}

/**
 * Set up a form EDIT
 *
 * @param formRef
 * @param currentInputRef
 * @param currentInputIndex
 * @returns {{type, payload: {formRef: *, currentInputRef: *, currentInputIndex: *}}}
 */
function formEdit({ formRef, currentInputRef, currentInputIndex }) {
    return {
        type: SET_UP_FORM_EDIT,
        payload: {
            formRef,
            currentInputRef,
            currentInputIndex
        }
    };
}

/**
 * Set up the form entry for an ADD
 *
 * @param formRef
 * @param currentInputRef
 * @param currentInputIndex
 * @param parentEntryUuid
 * @param parentFormRef
 * @returns {{type: string, payload: {formRef: *, currentInputRef: *, currentInputIndex: *, parentEntryUuid: *, parentFormRef: *}}}
 */
export function setUpEntryFormAdd({ formRef, currentInputRef, currentInputIndex, parentEntryUuid, parentFormRef }) {
    return ((dispatch) => {
        // Entry add
        dispatch(entryAdd({ parentEntryUuid, parentFormRef }));
        // Form add
        dispatch(formAdd({ formRef, currentInputRef, currentInputIndex }));
    });
}

/**
 * Set up the form entry for an EDIT
 *
 * @param network
 * @param projectSlug
 * @param uuid
 * @param formRef
 * @param currentInputRef
 * @param currentInputIndex
 * @param parentEntryUuid
 * @param parentFormRef
 * @returns {function(*)}
 */
export function setUpEntryFormEdit({ network, projectSlug, uuid, formRef, currentInputRef, currentInputIndex, parentEntryUuid, parentFormRef }) {
    return ((dispatch) => {
        dispatch(fetchEntry({
            network,
            projectSlug,
            uuid,
            formRef,
            parentEntryUuid,
            parentFormRef
        })).then((response) => {
                if (response.action.payload) {
                    // When fetch entry dispatch resolves
                    setTimeout(() => {

                        // Set up the answers
                        dispatch(setAnswers({ answers: response.action.payload.entry.answers }));

                        // Form edit
                        dispatch(formEdit({
                            formRef,
                            currentInputRef,
                            currentInputIndex
                        }));

                    }, 1000);
                }

            }
        );
    });
}

/**
 * Save the entry
 *
 * @param form
 * @param inputs
 * @returns {function(*)}
 */
export function saveEntry(form, inputs) {
    return (dispatch) => {
        // Add title
        dispatch(addTitleToEntry(form, inputs));
        // Mark the entry as complete
        dispatch(entryComplete());
    };
}

/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function resetForm() {
    return {
        type: RESET_FORM,
        payload: {}
    };
}
