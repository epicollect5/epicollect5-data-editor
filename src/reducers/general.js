import {
    EXTERNAL, INTERNAL, BRANCH_OPEN, BRANCH_CLOSED, RESET_APP, RESET_APP_COMPLETE,
    FETCH_STATUS_CODES_PENDING, FETCH_STATUS_CODES_FULFILLED, FETCH_STATUS_CODES_REJECTED

} from '../actions/';

const initialState = {
    network: {
        serverUrl: '',
        api: '',
        jwtToken: ''
    },
    external: true,
    isBranchOpen: false,
    isResetting: false,
    statusCodes: {}
};

const generalReducer = (state = initialState, action) => {

    const payload = action.payload;

    switch (action.type) {
        case EXTERNAL:
            return Object.assign({}, state, {
                external: true,
                network: {
                    serverUrl: payload.serverUrl,
                    api: payload.apiUrl,
                    jwtToken: payload.jwtToken
                }
            });
        case INTERNAL:
            return Object.assign({}, state, {
                external: false,
                network: {
                    serverUrl: payload.serverUrl,
                    api: payload.apiUrl,
                    jwtToken: ''
                }
            });
        case BRANCH_OPEN:
            return Object.assign({}, state, {
                isBranchOpen: true
            });
        case BRANCH_CLOSED:
            return Object.assign({}, state, {
                isBranchOpen: false
            });
        case RESET_APP:
            return Object.assign({}, state, {
                isResetting: true
            });
        case RESET_APP_COMPLETE:
            return Object.assign({}, state, {
                isResetting: false
            });
        case FETCH_STATUS_CODES_PENDING: {
            return Object.assign({}, state, {});
        }
        case FETCH_STATUS_CODES_FULFILLED: {
            return Object.assign({}, state, {
                statusCodes: payload
            });
        }
        case FETCH_STATUS_CODES_REJECTED: {
            return Object.assign({}, state, {});
        }
        default:
            return state;
    }
};

export default generalReducer;
