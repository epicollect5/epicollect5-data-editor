import * as actions from '../../src/actions/entry-common';
import * as actionConsts from '../../src/actions/';

describe('form branch common - jump actions', () => {

    it('should jump a branch input', () => {

        const expectedAction = {
            type: actionConsts.SET_WAS_JUMPED_BRANCH,
            payload: {
                input: {
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
        };

        // For a branch
        expect(actions.setWasJumped(
            {
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
            },
            true
        )).toEqual(expectedAction);
    });

    it('should jump a form input', () => {

        const expectedAction = {
            type: actionConsts.SET_WAS_JUMPED,
            payload: {
                input: {
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
        };

        // For a form
        expect(actions.setWasJumped(
            {
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
            },
            false
        )).toEqual(expectedAction);
    });


});
