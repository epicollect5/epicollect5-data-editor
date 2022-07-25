import {
    FETCH_PROJECT_PENDING, FETCH_PROJECT_FULFILLED, FETCH_PROJECT_REJECTED
} from '../actions/';
import ProjectModel from '../models/ProjectModel';

const initialState = {
    isFetching: false,
    isFulfilled: false,
    isRejected: false,
    projectSlug: '',
    project: {},
    error: new Error()
};

/**
 * Project reducer with default 'state'
 *
 * @param state
 * @param action
 * @returns {*}
 */
function projectReducer(state = initialState, action) {

    const payload = action.payload;
    const project = ProjectModel;

    switch (action.type) {
        case FETCH_PROJECT_PENDING: {
            return Object.assign({}, state, {
                isFetching: true
            });
        }
        case FETCH_PROJECT_FULFILLED: {
            project.loadExtraStructure(payload.meta.project_extra);
            project.setStructureLastUpdated(payload.meta.project_stats.structure_last_updated);

            // Check we have a valid form
            if (project.getExtraInputs().length === 0) {
                return Object.assign({}, state, {
                    isFetching: false,
                    isRejected: true,
                    error: new Error('ec5_68')
                });
            }
            return Object.assign({}, state, {
                isFetching: false,
                isFulfilled: true,
                project
            });
        }
        case FETCH_PROJECT_REJECTED: {
            return Object.assign({}, state, {
                isFetching: false,
                isRejected: true,
                error: payload
            });
        }
        default:
            return state;
    }
}

export default projectReducer;
