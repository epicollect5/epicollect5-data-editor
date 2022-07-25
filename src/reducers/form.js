import {
    ADD_FORM_REF,
    NEXT_QUESTION,
    PREVIOUS_QUESTION,
    SET_UP_FORM_ADD,
    SET_UP_FORM_EDIT,
    ENTRY_COMPLETE,
    ENTRY_INCOMPLETE,
    RESET_APP
} from '../actions/';
import parameters from '../constants/parameters';

const initialState = {
    type: parameters.ADD,
    isSetUp: false,
    entryComplete: false,
    entryUploaded: false,
    currentInputRef: null,
    currentInputIndex: 0,
    formRef: '',
    errors: {}
};

const formReducer = (state = initialState, action) => {

    const payload = action.payload;

    switch (action.type) {

        case ADD_FORM_REF:
            // Set the current input ref and input index
            return Object.assign({}, state, {
                formRef: payload.formRef
            });

        case SET_UP_FORM_ADD: {

            // Set the current input ref and input index
            return Object.assign({}, state, {
                isSetUp: true,
                type: parameters.ADD,
                currentInputRef: payload.currentInputRef,
                currentInputIndex: payload.currentInputIndex
            });
        }
        case SET_UP_FORM_EDIT:

            // Set the current input ref and input index
            return Object.assign({}, state, {
                isSetUp: true,
                type: parameters.EDIT,
                currentInputRef: payload.currentInputRef,
                currentInputIndex: payload.currentInputIndex
            });
        case NEXT_QUESTION:
            return Object.assign({}, state, {
                currentInputRef: payload.nextInputRef,
                currentInputIndex: payload.nextInputIndex
            });
        case PREVIOUS_QUESTION:
            return Object.assign({}, state, {
                currentInputRef: payload.previousInputRef,
                currentInputIndex: payload.previousInputIndex
            });
        case ENTRY_COMPLETE:
            return Object.assign({}, state, {
                entryComplete: true
            });
        case ENTRY_INCOMPLETE:
            return Object.assign({}, state, {
                entryComplete: false
            });
        case RESET_APP: {

            // Perform deep clone of the initialState object
            const resetState = JSON.parse(JSON.stringify(initialState));
            // But retain the formRef
            resetState.formRef = state.formRef;
            return resetState;
        }
        default:
            return state;
    }
};

export default formReducer;
