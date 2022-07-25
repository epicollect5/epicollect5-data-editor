import {
    SHOW_TOAST_SUCCESS, HIDE_TOAST_SUCCESS, SHOW_TOAST_ERROR, HIDE_TOAST_ERROR
} from '../actions/';

const initialState = {
    showSuccess: false,
    showError: false,
    toastMessage: ''
};

const toastReducer = (state = initialState, action) => {

    const payload = action.payload;

    switch (action.type) {

        case SHOW_TOAST_SUCCESS:
            return Object.assign({}, state, {
                showSuccess: true,
                toastMessage: payload.message
            });
        case HIDE_TOAST_SUCCESS:
            return Object.assign({}, state, {
                showSuccess: false,
                toastMessage: ''
            });
        case SHOW_TOAST_ERROR:
            return Object.assign({}, state, {
                showError: true,
                toastMessage: payload.message
            });
        case HIDE_TOAST_ERROR:
            return Object.assign({}, state, {
                showError: false,
                toastMessage: ''
            });
        default:
            return state;
    }
};

export default toastReducer;
