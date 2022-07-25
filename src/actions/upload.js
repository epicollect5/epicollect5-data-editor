import fetch from 'isomorphic-fetch';
import EC5_LIBRARIES from 'ec5-libraries';
import config from '../constants/config';
import parameters from '../constants/parameters';
import { addErrors, clearAllErrors } from './validator';
import JsonFormatter from '../utils/JsonFormatter';
import {
    UPLOADING,
    FINISHED_UPLOADING,
    FINISHED_UPLOADING_WITH_ERRORS,
    CLEAR_ALL_UPLOAD_ERRORS
} from './';
import { getAuthorisationHeader } from '../utils/Utils';

export function uploading() {
    return {
        type: UPLOADING,
        payload: {}
    };
}

function finishedUploading() {
    return {
        type: FINISHED_UPLOADING,
        payload: {}
    };
}

function finishedUploadingWithErrors(errors) {
    return {
        type: FINISHED_UPLOADING_WITH_ERRORS,
        payload: {
            errors
        }
    };
}

/**
 *
 * @returns {{type: string, payload: {}}}
 */
function clearAllUploadErrors() {
    return {
        type: CLEAR_ALL_UPLOAD_ERRORS,
        payload: {}
    };
}

/**
 *
 * @returns {function(*)}
 */
export function removeErrors() {

    return ((dispatch) => {

        // Clear all upload errors
        dispatch(clearAllUploadErrors());
        // Clear all validator errors
        dispatch(clearAllErrors());
    });
}

/**
 *
 * @param project
 * @param uuid
 * @param uploadErrors
 * @returns {function(*)}
 */
function handleErrors(project, uuid, uploadErrors) {

    return ((dispatch) => {

        // Error
        dispatch(finishedUploadingWithErrors(uploadErrors));

        // Add errors to the validator (if relating to particular inputs)
        const validatorErrors = {};
        for (const error of uploadErrors) {
            // Check the source is an input ref
            if (project.inputExists(error.source)) {
                // Add or create then add the error
                if (!validatorErrors[error.source]) {
                    validatorErrors[error.source] = [];
                }
                validatorErrors[error.source].push(error.code);
            }
        }
        // Add errors to the validator reducer
        dispatch(addErrors(uuid, validatorErrors));
    });
}

/**
 * @param network
 * @param project
 * @param formRef
 * @param branchEntry
 * @param branchUuids
 * @param branchEntries
 * @returns {function(*)}
 */
export function uploadEntryBranch(network, project, formRef, branchEntry, branchUuids = [], branchEntries = {}) {

    return ((dispatch) => {

        const options = Object.assign({}, config.FETCH_OPTIONS);
        options.headers.Authorization = getAuthorisationHeader(network.jwtToken);
        options.method = 'POST';
        options.body = JSON.stringify({
            data: JsonFormatter.makeJsonEntry({
                owner_input_ref: branchEntry.relationships.branch.data.owner_input_ref,
                owner_entry_uuid: branchEntry.relationships.branch.data.owner_entry_uuid,
                entry_type: branchEntry.type,
                entry_uuid: branchEntry.id,
                form_ref: formRef,
                created_at: branchEntry.branch_entry.created_at,
                device_id: '',
                platform: parameters.WEB,
                title: branchEntry.branch_entry.title,
                answers: JSON.stringify(branchEntry.branch_entry.answers),
                last_updated: project.getStructureLastUpdated()
            })
        });

        return fetch(`${network.serverUrl}${network.api}${config.UPLOAD_URL}/${project.getSlug()}`, options)
            .then((response) => {

                // Check for errors
                if (response.status === 200) {

                    if (branchUuids.length > 0) {
                        // Upload next branch
                        const branchUuid = branchUuids.pop();
                        const nextBranchEntry = branchEntries[branchUuid];
                        dispatch(uploadEntryBranch(network, project, formRef, nextBranchEntry, branchUuids, branchEntries));
                    } else {
                        // Success
                        // Dispatch finished uploading
                        dispatch(finishedUploading());
                    }

                }

                return response.json();

            }).then((json) => {

                // Check if any errors
                if (json.errors) {
                    dispatch(handleErrors(project, branchEntry.id, json.errors));
                }
            }).catch((err) => {
                // Error
                console.log('upload error', err);
                dispatch(finishedUploadingWithErrors([{ code: 'ec5_125' }]));
            });
    });

}

/**
 * @param network
 * @param project
 * @param formRef
 * @param formEntry
 * @param branchEntries
 * @returns {function(*)}
 */
export function uploadEntry(network, project, formRef, formEntry, branchEntries = []) {

    return ((dispatch) => {

        const options = Object.assign({}, config.FETCH_OPTIONS);
        options.headers.Authorization = getAuthorisationHeader(network.jwtToken);
        options.method = 'POST';
        options.body = JSON.stringify({
            data: JsonFormatter.makeJsonEntry({
                parent_form_ref: formEntry.relationships.parent.data ? formEntry.relationships.parent.data.parent_form_ref : '',
                parent_entry_uuid: formEntry.relationships.parent.data ? formEntry.relationships.parent.data.parent_entry_uuid : '',
                entry_type: formEntry.type,
                entry_uuid: formEntry.id,
                form_ref: formRef,
                created_at: formEntry.entry.created_at,
                device_id: '',
                platform: parameters.WEB,
                title: formEntry.entry.title,
                answers: JSON.stringify(formEntry.entry.answers),
                last_updated: project.getStructureLastUpdated()
            })
        });


        // Upload main entry
        return fetch(`${network.serverUrl}${network.api}${config.UPLOAD_URL}/${project.getSlug()}`, options)
            .then((response) => {

                // Check for errors
                if (response.status === 200) {

                    // Loop and upload branch entries

                    const flatBranchEntries = {};
                    // Retrieve a flatter object where the uuids are the keys, rather than nested in ownerInputRefs
                    Object.keys(branchEntries).forEach((ownerInputRef) => {
                        Object.keys(branchEntries[ownerInputRef]).forEach((uuid) => {
                            flatBranchEntries[uuid] = branchEntries[ownerInputRef][uuid];
                        });
                    });
                    // Obtain an array of just the uuids
                    const branchUuids = Object.keys(flatBranchEntries);

                    if (branchUuids.length > 0) {
                        // Upload first branch
                        const branchUuid = branchUuids.pop();
                        const branchEntry = flatBranchEntries[branchUuid];
                        dispatch(uploadEntryBranch(network, project, formRef, branchEntry, branchUuids, flatBranchEntries));
                    } else {
                        // Success
                        // Dispatch finished uploading
                        dispatch(finishedUploading());
                    }

                }

                return response.json();

            }).then((json) => {

                // Check if any errors
                if (json.errors) {
                    dispatch(handleErrors(project, formEntry.id, json.errors));
                }
            }).catch((err) => {
                console.log('upload error', err);
                // Error
                dispatch(finishedUploadingWithErrors([{ code: 'ec5_125' }]));
            });
    });
}

