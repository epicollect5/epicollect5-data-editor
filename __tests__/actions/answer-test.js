import * as answerActions from '../../src/actions/answer';
import {
    SET_ANSWER,
    SET_ANSWERS,
    SET_CONFIRM_ANSWER,
    RESET_BRANCH_ANSWERS,
    RESET_ALL_ANSWERS
} from '../../src/actions/';

describe('answer actions', () => {
    it('should add an answer', () => {
        const answer = 'John Smith';
        const inputRef = 'abc123';
        const expectedAction = {
            type: SET_ANSWER,
            payload: {
                answer: 'John Smith',
                inputRef: 'abc123'
            }
        };
        expect(answerActions.setAnswer(answer, inputRef)).toEqual(expectedAction);
    });

    it('should add all answers', () => {
        const answers = {
            abc123: {
                answer: 'John Smith',
                was_jumped: false
            },
            def456: {
                answer: 'Jane Smith',
                was_jumped: false
            }
        };
        const expectedAction = {
            type: SET_ANSWERS,
            payload: {
                answers
            }
        };
        expect(answerActions.setAnswers({ answers })).toEqual(expectedAction);
    });

    it('should add a confirm answer', () => {
        const answer = 'John Smith';
        const inputRef = 'abc123';
        const expectedAction = {
            type: SET_CONFIRM_ANSWER,
            payload: {
                answer: 'John Smith',
                inputRef: 'abc123'
            }
        };
        expect(answerActions.setConfirmAnswer(answer, inputRef)).toEqual(expectedAction);
    });

    it('should reset branch answers', () => {
        const expectedAction = {
            type: RESET_BRANCH_ANSWERS,
            payload: {
                project: {},
                formRef: 'form_ref',
                ownerInputRef: 'owner_input_ref'
            }
        };
        expect(answerActions.resetBranchAnswers({}, 'form_ref', 'owner_input_ref')).toEqual(expectedAction);
    });

    it('should reset all answers', () => {
        const expectedAction = {
            type: RESET_ALL_ANSWERS,
            payload: {}
        };
        expect(answerActions.resetAllAnswers()).toEqual(expectedAction);
    });

});
