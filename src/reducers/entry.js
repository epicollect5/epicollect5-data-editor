import UUID from 'uuid';
import Answers from '../utils/Answers';
import { getIsoDateTime } from '../../src/utils/Utils';
import {
    FETCH_ENTRY_PENDING,
    FETCH_ENTRY_FULFILLED,
    FETCH_ENTRY_REJECTED,
    SET_UP_ENTRY_ADD,
    ADD_ANSWER_TO_ENTRY,
    SET_WAS_JUMPED,
    ADD_TITLE_TO_ENTRY,
    RESET_APP
} from '../actions/';

const initialState = {
    isFetching: false,
    isFulfilled: false,
    isRejected: false,
    error: new Error(),
    entryComplete: false,
    entryUploaded: false,
    entry: {
        type: 'entry',
        id: '',
        entry: {
            title: '',
            answers: {},
            created_at: ''
        },
        relationships: {
            parent: {
                data: {
                    parent_form_ref: '',
                    parent_entry_uuid: ''
                }
            },
            branch: {}
        }
    }
};

const entryReducer = (state = initialState, action) => {

    const payload = action.payload;
    // Deep copy
    const entry = JSON.parse(JSON.stringify(state.entry));
    const answers = entry.entry.answers;
    const answersUtil = new Answers();

    switch (action.type) {

        case FETCH_ENTRY_PENDING:
            return Object.assign({}, state, {
                isFetching: true
            });
        case FETCH_ENTRY_FULFILLED:
            return Object.assign({}, state, {
                isFetching: false,
                isFulfilled: true,
                entry: payload
            });
        case FETCH_ENTRY_REJECTED:
            return Object.assign({}, state, {
                isFetching: false,
                isRejected: true,
                error: payload
            });
        case SET_UP_ENTRY_ADD: {

            // todo this is not 'pure'
            entry.id = UUID.v1();

            entry.relationships.parent.data.parent_form_ref = payload.parentFormRef;
            entry.relationships.parent.data.parent_entry_uuid = payload.parentEntryUuid;

            // todo this is not 'pure'
            entry.entry.created_at = getIsoDateTime();

            // Set the current input ref and input index
            return Object.assign({}, state, {
                entry
            });
        }
        case ADD_ANSWER_TO_ENTRY:

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

        case ADD_TITLE_TO_ENTRY: {

            const { form, inputs } = payload;
            entry.entry.title = '';

            const titles = answersUtil.getAnswersTitles(entry.entry, form.inputs, form.group, inputs);

            // If no title, use uuid
            if (titles.length === 0) {
                entry.entry.title = entry.id;
            } else {
                entry.entry.title = titles.join(' ');
            }

            return Object.assign({}, state, {
                entry
            });
        }
        case SET_WAS_JUMPED:

            // Update current answer to empty string and set was_jumped = true
            answers[payload.input.ref] = {
                answer: answersUtil.getEmptyDefaultAnswer(payload.input),
                was_jumped: true
            };

            return Object.assign({}, state, {
                entry
            });
        case RESET_APP: {
            // Perform deep clone of the initialState object
            return JSON.parse(JSON.stringify(initialState));
        }
        default:
            return state;
    }
};

export default entryReducer;
