import {
    SHOW_TOAST_SUCCESS, HIDE_TOAST_SUCCESS, SHOW_TOAST_ERROR, HIDE_TOAST_ERROR
} from './';

/**
 *
 * @param message
 * @returns {{type, payload: {message: *}}}
 */
function showSuccess(message) {
    return {
        type: SHOW_TOAST_SUCCESS,
        payload: {
            message
        }
    };
}

/**
 *
 * @returns {{type, payload: {}}}
 */
function hideSuccess() {
    return {
        type: HIDE_TOAST_SUCCESS,
        payload: {}
    };
}

/**
 *
 * @param message
 * @returns {{type, payload: {message: *}}}
 */
function showError(message) {
    return {
        type: SHOW_TOAST_ERROR,
        payload: {
            message
        }
    };
}
/**
 *
 * @returns {{type, payload: {}}}
 */
function hideError() {
    return {
        type: HIDE_TOAST_ERROR,
        payload: {}
    };
}

/**
 *
 * @param message
 * @returns {function(*)}
 */
export function showToastSuccess(message) {
    return (dispatch) => {
        dispatch(showSuccess(message));
        setTimeout(() => {
            dispatch(hideSuccess());
        }, 1000);

    };
}

/**
 *
 * @param message
 * @returns {function(*)}
 */
export function showToastError(message) {
    return (dispatch) => {
        dispatch(showError(message));
        setTimeout(() => {
            dispatch(hideError());
        }, 1000);
    };
}
