import {
    UPLOADING, FINISHED_UPLOADING, FINISHED_UPLOADING_WITH_ERRORS, CLEAR_ALL_UPLOAD_ERRORS, RESET_APP
}
    from '../actions/';

const initialState = {
    isUploading: false,
    hasUploaded: false,
    errors: []
};

const uploadReducer = (state = initialState, action) => {

    const payload = action.payload;

    switch (action.type) {

        case UPLOADING:

            return Object.assign({}, state, {
                isUploading: true,
                hasUploaded: false
            });

        case FINISHED_UPLOADING:

            return Object.assign({}, state, {
                isUploading: false,
                hasUploaded: true
            });

        case FINISHED_UPLOADING_WITH_ERRORS:

            return Object.assign({}, state, {
                isUploading: false,
                hasUploaded: false,
                errors: payload.errors
            });
        case CLEAR_ALL_UPLOAD_ERRORS:
            return Object.assign({}, state, {
                errors: []
            });
        case RESET_APP: {
            // Perform deep clone of the initialState object
            return JSON.parse(JSON.stringify(initialState));
        }
        default:
            return state;
    }
};

export default uploadReducer;
