import {
    SET_UP_ENTRY_BRANCH_ADD, SET_UP_ENTRY_BRANCH_EDIT
} from './';
import { addTitleToEntry, entryComplete } from './entry-common';

/**
 *
 * @param ownerInputRef
 * @param ownerEntryUuid
 * @returns {{type, payload: {ownerInputRef: *, ownerEntryUuid: *}}}
 */
export function entryBranchAdd({ ownerInputRef, ownerEntryUuid }) {
    return {
        type: SET_UP_ENTRY_BRANCH_ADD,
        payload: {
            ownerInputRef,
            ownerEntryUuid
        }
    };
}

/**
 *
 * @param branchEntry
 * @returns {{type, payload: {uuid: *}}}
 */
export function entryBranchEdit({ branchEntry }) {
    return {
        type: SET_UP_ENTRY_BRANCH_EDIT,
        payload: {
            branchEntry
        }
    };
}

/**
 * Save a branch entry to the form
 *
 * @param form
 * @param ownerInputRef
 * @param inputs
 * @returns {function(*)}
 */
export function saveEntryBranch({ form, ownerInputRef, inputs }) {
    return (dispatch) => {
        // Add title
        dispatch(addTitleToEntry(form, inputs, ownerInputRef, true));
        // Mark as complete
        dispatch(entryComplete(true));
    };
}
