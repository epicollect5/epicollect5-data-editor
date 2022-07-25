import {
    SET_UP_ENTRY_ADD
} from './';

/**
 *
 * @param parentEntryUuid
 * @param parentFormRef
 * @returns {{type, payload: {parentEntryUuid: *, parentFormRef: *}}}
 */
export function entryAdd({ parentEntryUuid, parentFormRef }) {
    return {
        type: SET_UP_ENTRY_ADD,
        payload: {
            parentEntryUuid,
            parentFormRef
        }
    };
}

