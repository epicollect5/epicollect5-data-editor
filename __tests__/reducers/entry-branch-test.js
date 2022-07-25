import reducer from '../../src/reducers/entry-branch';
import {
    SET_WAS_JUMPED_BRANCH
} from '../../src/actions/';

describe('branch entry reducer - jumps', () => {

    it('should handle SET_WAS_JUMPED_BRANCH, setting was_jumped to true for input dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f answer', () => {

        // Expect that we will have an answer with was_jumped set to true
        const expectedAnswers = {
            // The input ref we're jumping
            dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f: {
                answer: '',
                was_jumped: true
            }
        };

        const state = reducer(undefined, {
            type: SET_WAS_JUMPED_BRANCH,
            payload: {
                input: {
                    // The input to jump
                    max: null,
                    min: null,
                    ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f',
                    type: 'text',
                    group: [],
                    jumps: [],
                    regex: null,
                    branch: [],
                    verify: false,
                    default: null,
                    is_title: false,
                    question: 'text',
                    uniqueness: 'none',
                    is_required: false,
                    datetime_format: null,
                    possible_answers: [],
                    set_to_current_datetime: false
                }
            }
        });

        // Testing only the answers object in the returned state from the reducer
        const actualAnswers = state.entry.branch_entry.answers;

        expect(actualAnswers).toEqual(expectedAnswers);

    });

});
