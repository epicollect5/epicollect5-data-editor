import fetch from 'isomorphic-fetch';
import config from '../constants/config';
import { getAuthorisationHeader } from '../utils/Utils';

import {
    FETCH_PROJECT
} from './';

/**
 * Action to fetch a project asynchronously (using redux promise middleware)
 *
 * @param url
 * @param projectSlug
 * @param jwtToken
 * @returns {function(*)}
 */
export function fetchProject(url, projectSlug, jwtToken) {

    const options = Object.assign({}, config.FETCH_OPTIONS);
    options.headers.Authorization = getAuthorisationHeader(jwtToken);

    const promise = fetch(`${url}/${projectSlug}`, config.FETCH_OPTIONS).then((response) => {
        return response.json();
    }).then((json) => {

        // Check if any errors
        if (json.errors) {
            const errors = json.errors;
            for (const error of errors) {
                // Throw the first error
                throw new Error(error.code);
            }
        }

        return json;

    });
    return (dispatch) => {
        return dispatch({
            type: FETCH_PROJECT,
            payload: promise
        }).catch((err) => {
            console.log(err);
        });
    };

}
