import {
    REQUEST_VALIDATION, FINISHED_VALIDATION, ADD_ERRORS, CLEAR_ERROR, CLEAR_ERRORS, CLEAR_ALL_ERRORS, RESET_APP
} from '../actions/';

const initialState = {
    isValidating: false,
    passed: false,
    errors: {}
};

/**
 * Validator reducer with default 'state'
 *
 * @param state
 * @param action
 * @returns {*}
 */
function validatorReducer(state = initialState, action) {

    const payload = action.payload;
    const errors = JSON.parse(JSON.stringify(state.errors));

    switch (action.type) {
        case REQUEST_VALIDATION:
            return Object.assign({}, state, {
                isValidating: true,
                passed: false
            });

        case FINISHED_VALIDATION:

            return Object.assign({}, state, {
                isValidating: false,
                passed: payload.passed
            });
        case ADD_ERRORS: {

            if (!errors[payload.uuid]) {
                errors[payload.uuid] = {};
            }

            // Merge entry errors with existing entry errors
            errors[payload.uuid] = Object.assign({}, errors[payload.uuid], payload.errors);

            return Object.assign({}, state, {
                errors
            });
        }
        case CLEAR_ERROR:

            // Clear error for an input ref
            if (errors[payload.uuid] && errors[payload.uuid][payload.inputRef]) {
                delete errors[payload.uuid][payload.inputRef];
            }

            return Object.assign({}, state, {
                errors
            });
        case CLEAR_ERRORS:

            // Clear errors for a uuid
            if (errors[payload.uuid]) {
                delete errors[payload.uuid];
            }

            return Object.assign({}, state, {
                errors
            });
        case CLEAR_ALL_ERRORS:
            return Object.assign({}, state, {
                errors: {}
            });
        case RESET_APP: {
            // Perform deep clone of the initialState object
            return JSON.parse(JSON.stringify(initialState));
        }
        default:
            return state;
    }
}

export default validatorReducer;
