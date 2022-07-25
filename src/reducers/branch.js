import {
    NEXT_QUESTION_BRANCH,
    PREVIOUS_QUESTION_BRANCH,
    SAVE_BRANCH,
    SET_UP_BRANCH_ADD,
    SET_UP_BRANCH_EDIT,
    RESET_BRANCH,
    ENTRY_COMPLETE_BRANCH,
    ENTRY_INCOMPLETE_BRANCH,
    RESET_APP,
    DELETE_BRANCH
} from '../actions/';
import parameters from '../constants/parameters';

const initialState = {
    type: parameters.ADD,
    isSetUp: false,
    entryComplete: false,
    entryUploaded: false,
    currentInputRef: null,
    currentInputIndex: 0,
    errors: {},
    branchEntries: {}
};

const branchReducer = (state = initialState, action) => {

    const payload = action.payload;
    const branchEntries = JSON.parse(JSON.stringify(state.branchEntries));

    switch (action.type) {
        case SET_UP_BRANCH_ADD: {

            // Set the current input ref and input index
            return Object.assign({}, state, {
                isSetUp: true,
                type: parameters.ADD,
                currentInputRef: payload.currentInputRef,
                currentInputIndex: payload.currentInputIndex
            });
        }
        case SET_UP_BRANCH_EDIT:

            // Set the current input ref and input index
            return Object.assign({}, state, {
                isSetUp: true,
                type: parameters.EDIT,
                currentInputRef: payload.currentInputRef,
                currentInputIndex: payload.currentInputIndex
            });
        case NEXT_QUESTION_BRANCH:
            return Object.assign({}, state, {
                currentInputRef: payload.nextInputRef,
                currentInputIndex: payload.nextInputIndex
            });
        case PREVIOUS_QUESTION_BRANCH:
            return Object.assign({}, state, {
                currentInputRef: payload.previousInputRef,
                currentInputIndex: payload.previousInputIndex
            });
        case SAVE_BRANCH: {

            // Add entry to the current object of branch entries
            // Deep clone
            const entry = JSON.parse(JSON.stringify(payload.entry));

            // Index by ownerInputRef
            if (!branchEntries[entry.relationships.branch.data.owner_input_ref]) {
                branchEntries[entry.relationships.branch.data.owner_input_ref] = {};
            }

            // Then index by uuid
            branchEntries[entry.relationships.branch.data.owner_input_ref][entry.id] = entry;

            return Object.assign({}, state, {
                branchEntries
            });
        }
        case DELETE_BRANCH:

            // Delete the entry for this ownerInputRef-uuid
            delete branchEntries[payload.ownerInputRef][payload.uuid];
            return Object.assign({}, state, {
                branchEntries
            });

        case RESET_BRANCH: {

            // Perform deep clone of the initialState object
            const resetState = JSON.parse(JSON.stringify(initialState));
            // But we want to keep the branchEntries
            resetState.branchEntries = branchEntries;
            return resetState;
        }
        case ENTRY_COMPLETE_BRANCH:
            return Object.assign({}, state, {
                entryComplete: true
            });
        case ENTRY_INCOMPLETE_BRANCH:
            return Object.assign({}, state, {
                entryComplete: false
            });
        case RESET_APP: {
            // Perform deep clone of the initialState object
            return JSON.parse(JSON.stringify(initialState));
        }
        default:
            return state;
    }
};

export default branchReducer;
