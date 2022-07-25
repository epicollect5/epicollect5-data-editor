import fetch from 'isomorphic-fetch';
import config from '../constants/config';
import {
    EXTERNAL,
    INTERNAL,
    BRANCH_OPEN,
    BRANCH_CLOSED,
    RESET_APP,
    RESET_APP_COMPLETE,
    FETCH_STATUS_CODES
} from './';

/**
 *
 * @param serverUrl
 * @param apiUrl
 * @param jwtToken
 * @returns {{type, payload: {appUrl: *, apiUrl: *, jwtToken: *}}}
 */
export function external(serverUrl, apiUrl, jwtToken) {
    return {
        type: EXTERNAL,
        payload: {
            serverUrl,
            apiUrl,
            jwtToken
        }
    };
}

/**
 *
 * @param serverUrl
 * @param apiUrl
 * @returns {{type, payload: {appUrl: *, apiUrl: *}}}
 */
export function internal(serverUrl, apiUrl) {
    return {
        type: INTERNAL,
        payload: {
            serverUrl,
            apiUrl
        }
    };
}

/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function branchOpen() {
    return {
        type: BRANCH_OPEN,
        payload: {}
    };
}
/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function branchClosed() {
    return {
        type: BRANCH_CLOSED,
        payload: {}
    };
}

/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function resetAppComplete() {
    return {
        type: RESET_APP_COMPLETE,
        payload: {}
    };
}

/**
 *
 * @returns {{type: *, payload: {}}}
 */
export function resetApp() {

    return {
        type: RESET_APP,
        payload: {}
    };

}

/**
 * Action to fetch the status codes asynchronously
 * @param serverUrl
 * @returns {function(*)}
 */
export function fetchStatusCodes(serverUrl) {

    const promise = fetch(serverUrl + '/json/ec5-status-codes/' + config.language + '.json').then((response) => {
        return response.json();
    }).then((json) => {
        return json;
    });
    return (dispatch) => {
        return dispatch({
            type: FETCH_STATUS_CODES,
            payload: promise
        }).catch((err) => {
            console.log(err);
        });
    };

}
