import UUID from 'uuid';
import Answers from '../utils/Answers';
import { getIsoDateTime } from '../../src/utils/Utils';
import {
    FETCH_ENTRY_BRANCH_PENDING,
    FETCH_ENTRY_BRANCH_FULFILLED,
    FETCH_ENTRY_BRANCH_REJECTED,
    SET_UP_ENTRY_BRANCH_ADD,
    SET_UP_ENTRY_BRANCH_EDIT,
    SET_WAS_JUMPED_BRANCH,
    ADD_ANSWER_TO_ENTRY_BRANCH,
    RESET_BRANCH,
    ADD_TITLE_TO_ENTRY_BRANCH,
    ENTRY_COMPLETE_BRANCH,
    ENTRY_INCOMPLETE_BRANCH,
    RESET_APP
} from '../actions/';

const initialState = {
    isFetching: false,
    isFulfilled: false,
    isRejected: false,
    entryComplete: false,
    entryUploaded: false,
    entry: {
        type: 'branch_entry',
        id: '',
        relationships: {
            branch: {
                data: {
                    owner_input_ref: '',
                    owner_entry_uuid: ''
                }
            },
            parent: {}
        },
        branch_entry: {
            title: '',
            answers: {},
            created_at: ''
        }
    }
};

const entryBranchReducer = (state = initialState, action) => {

    const payload = action.payload;
    const entry = JSON.parse(JSON.stringify(state.entry));
    const answers = entry.branch_entry.answers;
    const answersUtil = new Answers();

    switch (action.type) {

        case FETCH_ENTRY_BRANCH_PENDING:
            return Object.assign({}, state, {
                isFetching: true
            });
        case FETCH_ENTRY_BRANCH_FULFILLED:
            return Object.assign({}, state, {
                isFetching: false,
                isFulfilled: true,
                entry: payload
            });
        case FETCH_ENTRY_BRANCH_REJECTED:
            return Object.assign({}, state, {
                isFetching: false,
                isRejected: true,
                error: payload
            });
        case SET_UP_ENTRY_BRANCH_ADD: {

            entry.id = UUID.v1();
            entry.relationships = {
                branch: {
                    data: {
                        owner_input_ref: payload.ownerInputRef,
                        owner_entry_uuid: payload.ownerEntryUuid
                    }
                }
            };
            entry.branch_entry.created_at = getIsoDateTime();

            // Set the current input ref and input index
            return Object.assign({}, state, {
                entry
            });
        }
        case SET_UP_ENTRY_BRANCH_EDIT: {

            const editEntry = JSON.parse(JSON.stringify(payload.branchEntry));
            // Set the entry
            return Object.assign({}, state, {
                entry: editEntry
            });
        }
        case ADD_ANSWER_TO_ENTRY_BRANCH:

            // If there is currently no answer for this inputRef
            if (typeof answers[payload.inputRef] === 'undefined') {

                // Set a default
                answers[payload.inputRef] = {
                    answer: payload.answer,
                    was_jumped: false
                };

            } else if (typeof payload.answer !== 'undefined' && payload.answer !== null) {
                // Otherwise update current answer, if available
                answers[payload.inputRef] = {
                    answer: payload.answer,
                    was_jumped: false
                };
            }

            return Object.assign({}, state, {
                entry
            });

        case ADD_TITLE_TO_ENTRY_BRANCH: {

            const { form, ownerInputRef, inputs } = payload;
            entry.branch_entry.title = '';

            const titles = answersUtil.getAnswersTitles(entry.branch_entry, form.branch[ownerInputRef], form.group, inputs);

            //If no title, use uuid
            if (titles.length === 0) {
                entry.branch_entry.title = entry.id;
            } else {
                entry.branch_entry.title = titles.join(' ');
            }

            return Object.assign({}, state, {
                entry
            });

        }
        case SET_WAS_JUMPED_BRANCH:

            // Update current answer to empty string and set was_jumped = true
            answers[payload.input.ref] = {
                answer: answersUtil.getEmptyDefaultAnswer(payload.input),
                was_jumped: true
            };

            return Object.assign({}, state, {
                entry
            });

        case RESET_BRANCH:
        case RESET_APP: {

            // Perform deep clone of the initialState object
            return JSON.parse(JSON.stringify(initialState));
        }
        case ENTRY_COMPLETE_BRANCH:
            return Object.assign({}, state, {
                entryComplete: true
            });
        case ENTRY_INCOMPLETE_BRANCH:
            return Object.assign({}, state, {
                entryComplete: false
            });
        default:
            return state;
    }
};

export default entryBranchReducer;
