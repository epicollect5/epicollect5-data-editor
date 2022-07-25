import fetch from 'isomorphic-fetch';
import config from '../constants/config';
import {
    FETCH_ENTRY,
    SET_WAS_JUMPED,
    ADD_TITLE_TO_ENTRY,
    ADD_ANSWER_TO_ENTRY,
    ENTRY_COMPLETE
} from './';
import { getAuthorisationHeader } from '../utils/Utils';
import { getBranchAppend } from './form-branch-common';

/**
 *
 * @param input
 * @param isBranch
 * @returns {{type: string, payload: {inputRef: *}}}
 */
export function setWasJumped(input, isBranch = false) {
    return {
        type: SET_WAS_JUMPED + getBranchAppend(isBranch),
        payload: {
            input
        }
    };
}

/**
 * Add title to entry
 *
 * @param form
 * @param inputs
 * @param ownerInputRef
 * @param isBranch
 * @returns {{type: string, payload: {form: *, inputs: *, ownerInputRef: *}}}
 */
export function addTitleToEntry(form, inputs, ownerInputRef = '', isBranch = false) {
    return {
        type: ADD_TITLE_TO_ENTRY + getBranchAppend(isBranch),
        payload: {
            form,
            inputs,
            ownerInputRef
        }
    };
}

/**
 * Add an answer for a question to the main form entry object
 *
 * @param inputRef
 * @param answer
 * @param isBranch
 * @returns {{type: string, payload: {inputRef: *, answer: *}}}
 */
export function addAnswerToEntry(inputRef, answer, isBranch = false) {
    return {
        type: ADD_ANSWER_TO_ENTRY + getBranchAppend(isBranch),
        payload: {
            inputRef,
            answer
        }
    };
}

/**
 * Action to fetch an entry asynchronously
 *
 * @param network
 * @param projectSlug
 * @param uuid
 * @param formRef
 * @param parentEntryUuid
 * @param parentFormRef
 * @param ownerInputRef
 * @param isBranch
 * @returns {function(*)}
 */
export function fetchEntry({ network, projectSlug, uuid, formRef, parentEntryUuid, parentFormRef, ownerInputRef, isBranch }) {

    let url;

    if (isBranch) {
        url = `${network.serverUrl}${network.api}${config.ENTRIES_URL}/${projectSlug}
        ?form_ref=${formRef}&branch_ref=${ownerInputRef}&uuid=${uuid}`;
    } else {
        url = `${network.serverUrl}${network.api}${config.ENTRIES_URL}/${projectSlug}?form_ref=${formRef}&uuid=${uuid}`;
        // Is this a child form entry?
        if (parentEntryUuid && parentFormRef) {
            url = `${url}&parent_uuid=${parentEntryUuid}&parent_form_ref=${parentFormRef}`;
        }
    }

    const options = Object.assign({}, config.FETCH_OPTIONS);
    options.headers.Authorization = getAuthorisationHeader(network.jwtToken);

    const promise = fetch(url, options).then((response) => {
        return response.json();
    }).then((json) => {

        // Check if any errors
        if (json.errors) {
            const errors = json.errors;
            for (const error of errors) {
                // Throw the first error
                throw new Error(error.code);
            }
        }

        return json;

    }).then((json) => {
        // Check if we don't have an entry
        if (!json || json.data.entries.length === 0) {
            // Throw error
            throw new Error('ec5_239');
        }

        return json.data.entries[0];

    });

    return (dispatch) => {
        return dispatch({
            type: FETCH_ENTRY + getBranchAppend(isBranch),
            payload: promise
        }).catch((err) => {
            console.log(err);
        });
    };
}

/**
 *
 * @returns {{type: string, payload: {}}}
 */
export function entryComplete(isBranch = false) {
    return {
        type: ENTRY_COMPLETE + getBranchAppend(isBranch),
        payload: {}
    };
}