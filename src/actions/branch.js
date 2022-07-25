import { resetBranchAnswers, setAnswers } from './answer';
import { entryBranchAdd, entryBranchEdit } from './entry-branch';
import { fetchEntry } from './entry-common';
import { clearErrors } from './validator';

import {
    SET_UP_BRANCH_ADD,
    SET_UP_BRANCH_EDIT,
    RESET_BRANCH,
    SAVE_BRANCH,
    DELETE_BRANCH
} from './';

/**
 * Set up a branch ADD
 *
 * @param currentInputRef
 * @param currentInputIndex
 * @returns {{type, payload: {currentInputRef: *, currentInputIndex: *}}}
 */
export function branchAdd({ currentInputRef, currentInputIndex }) {
    return {
        type: SET_UP_BRANCH_ADD,
        payload: {
            currentInputRef,
            currentInputIndex
        }
    };
}

/**
 * Set up a branch EDIT
 *
 * @param currentInputRef
 * @param currentInputIndex
 * @returns {{type, payload: {currentInputRef: *, currentInputIndex: *}}}
 */
export function branchEdit({ currentInputRef, currentInputIndex }) {
    return {
        type: SET_UP_BRANCH_EDIT,
        payload: {
            currentInputRef,
            currentInputIndex
        }
    };
}

/**
 * Set up the branch entry for an ADD
 *
 * @param currentInputRef
 * @param currentInputIndex
 * @param ownerInputRef
 * @param ownerEntryUuid
 * @returns {function(*)}
 */
export function setUpEntryBranchAdd({ currentInputRef, currentInputIndex, ownerInputRef, ownerEntryUuid }) {
    return ((dispatch) => {
        // Branch Add
        dispatch(branchAdd({ currentInputRef, currentInputIndex }));
        // Branch Entry Add
        dispatch(entryBranchAdd({ ownerInputRef, ownerEntryUuid }));
    });
}

/**
 *
 * @returns {{type: string, payload: {}}}
 */
export function reset() {
    return {
        type: RESET_BRANCH,
        payload: {}
    };
}

/**
 * Set up the branch entry for an EDIT
 *
 * @param network
 * @param projectSlug
 * @param formRef
 * @param ownerInputRef
 * @param uuid
 * @param currentInputRef
 * @param currentInputIndex
 * @param branchEntry
 * @returns {function(*=)}
 */
export function setUpEntryBranchEdit({ network, projectSlug, formRef, ownerInputRef, uuid, currentInputRef, currentInputIndex, branchEntry }) {

    return (dispatch) => {

        // If we already have the branch entry
        if (branchEntry) {

            // Set up the answers
            dispatch(setAnswers({ answers: branchEntry.branch_entry.answers }));

            // Branch edit
            dispatch(branchEdit({
                currentInputRef,
                currentInputIndex
            }));

            // Branch Entry edit
            dispatch(entryBranchEdit({ branchEntry }));

        } else {
            // If we need to fetch it from the server
            dispatch(fetchEntry({
                network,
                projectSlug,
                formRef,
                ownerInputRef,
                uuid,
                isBranch: true
            })).then((response) => {
                if (response.action.payload) {
                    // When fetch entry dispatch resolves
                    setTimeout(() => {

                        // Set up the answers
                        dispatch(setAnswers({ answers: response.action.payload.branch_entry.answers }));

                        // Branch edit
                        dispatch(branchEdit({
                            currentInputRef,
                            currentInputIndex
                        }));

                        // No need to dispatch Branch Entry edit, as entry has been fetched
                        // dispatch(entryBranchEdit({ uuid, ownerInputRef, ownerEntryUuid }));

                    }, 1000);
                }
            });
        }

    };
}

/**
 * Save a branch entry
 *
 * @param entry
 * @returns {{type: string, payload: {entry: *}}}
 */
export function saveBranch({ entry }) {
    return {
        type: SAVE_BRANCH,
        payload: {
            entry
        }
    };
}

/**
 * Delete a branch entry
 *
 * @param uuid
 * @param ownerInputRef
 * @returns {{type, payload: {uuid: *, ownerInputRef: *}}}
 */
export function deleteBranch({ uuid, ownerInputRef }) {
    return {
        type: DELETE_BRANCH,
        payload: {
            uuid,
            ownerInputRef
        }
    };
}

/**
 *
 * @param uuid
 * @param project
 * @param formRef
 * @param ownerInputRef
 * @returns {function(*)}
 */
export function resetBranch({ uuid, project, formRef, ownerInputRef }) {

    return (dispatch) => {

        // Reset branch
        dispatch(reset());

        // Reset the answers
        dispatch(resetBranchAnswers(project, formRef, ownerInputRef));

        // Reset the entry errors
        dispatch(clearErrors(uuid));
    };

}
